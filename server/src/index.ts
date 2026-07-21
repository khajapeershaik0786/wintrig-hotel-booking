import 'dotenv/config';

import bcrypt from 'bcryptjs';
import cors from 'cors';
import express, { type NextFunction, type Request, type Response } from 'express';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';
import { z } from 'zod';

import { generateRagAnswer, resolveLlmConfig } from './llm.js';

const envSchema = z.object({
  NODE_ENV: z.string().default('development'),
  PORT: z.string().default('4000'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 chars'),
  ADMIN_API_KEY: z.string().default('dev-admin-key'),
  AUTO_MIGRATE: z.enum(['true', 'false']).default('true'),
  LLM_PROVIDER: z.enum(['groq', 'openai', 'gemini', 'none']).default('groq'),
  LLM_API_KEY: z.string().optional(),
  LLM_MODEL: z.string().optional(),
  GROQ_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
});

const env = envSchema.parse(process.env);
const port = Number(env.PORT);
const llmConfig = resolveLlmConfig(env);

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false },
});

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

type AuthedRequest = Request & { user?: { id: string; email: string; name: string } };

function signToken(payload: { id: string; email: string; name: string }) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '7d' });
}

function authMiddleware(req: AuthedRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    res.status(401).json({ message: 'Missing auth token' });
    return;
  }
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string; email: string; name: string };
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
}

function adminKeyMiddleware(req: Request, res: Response, next: NextFunction) {
  const key = req.headers['x-admin-key'];
  if (key !== env.ADMIN_API_KEY) {
    res.status(401).json({ message: 'Invalid admin key' });
    return;
  }
  next();
}

function embedText(text: string): number[] {
  // Free local embedding: token-hash vector (384 dims) for RAG retrieval.
  const dims = 384;
  const vec = new Array<number>(dims).fill(0);
  const tokens = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
  for (const token of tokens) {
    let hash = 2166136261;
    for (let i = 0; i < token.length; i += 1) {
      hash ^= token.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    const index = Math.abs(hash) % dims;
    vec[index] += 1;
  }
  const magnitude = Math.sqrt(vec.reduce((acc, value) => acc + value * value, 0)) || 1;
  return vec.map((value) => Number((value / magnitude).toFixed(6)));
}

function vectorLiteral(vector: number[]) {
  return `[${vector.join(',')}]`;
}

async function runMigrations() {
  await pool.query('CREATE EXTENSION IF NOT EXISTS vector;');
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      phone TEXT,
      avatar_url TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS hotels (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      city TEXT NOT NULL,
      country TEXT NOT NULL,
      description TEXT NOT NULL,
      price_per_night NUMERIC(10,2) NOT NULL,
      rating NUMERIC(2,1) NOT NULL DEFAULT 4.5,
      amenities TEXT[] NOT NULL DEFAULT '{}',
      image_url TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
      check_in DATE NOT NULL,
      check_out DATE NOT NULL,
      guests INTEGER NOT NULL,
      total_price NUMERIC(10,2) NOT NULL,
      status TEXT NOT NULL DEFAULT 'confirmed',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS knowledge_chunks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      topic TEXT NOT NULL,
      source TEXT NOT NULL,
      content TEXT NOT NULL,
      embedding VECTOR(384) NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

async function seedHotels() {
  const existing = await pool.query<{ count: string }>('SELECT COUNT(*)::text AS count FROM hotels');
  if (Number(existing.rows[0]?.count ?? 0) > 0) {
    return;
  }
  await pool.query(
    `
    INSERT INTO hotels (name, city, country, description, price_per_night, rating, amenities, image_url)
    VALUES
      ('Santorini Sky Resort', 'Santorini', 'Greece', 'Caldera-view boutique stay near Oia.', 250.00, 4.9, ARRAY['pool','wifi','breakfast'], 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff'),
      ('Kyoto Zen Ryokan', 'Kyoto', 'Japan', 'Traditional ryokan with modern comfort.', 220.00, 4.8, ARRAY['onsen','wifi','tea'], 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9'),
      ('Maldives Blue Lagoon', 'Maldives', 'Maldives', 'Overwater villas and private beach.', 320.00, 4.9, ARRAY['beach','spa','wifi'], 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8'),
      ('Swiss Alpine Retreat', 'Zermatt', 'Switzerland', 'Mountain lodge close to ski trails.', 280.00, 4.7, ARRAY['spa','ski','wifi'], 'https://images.unsplash.com/photo-1508261303786-6d3b3f6f3f1d')
    `,
  );
}

async function seedKnowledgeBase() {
  const existing = await pool.query<{ count: string }>('SELECT COUNT(*)::text AS count FROM knowledge_chunks');
  if (Number(existing.rows[0]?.count ?? 0) > 0) {
    return;
  }
  const docs = [
    {
      topic: 'booking-policy',
      source: 'internal-policy',
      content:
        'Bookings can be canceled within 24 hours for full refund. After 24 hours, a 20 percent service fee applies.',
    },
    {
      topic: 'checkin-policy',
      source: 'internal-policy',
      content:
        'Standard check-in is 3 PM local time and check-out is 11 AM local time. Early check-in depends on room availability.',
    },
    {
      topic: 'payment-policy',
      source: 'internal-policy',
      content:
        'We support Visa, Mastercard, UPI, and PayPal. Payment confirmation is sent by email after successful transaction.',
    },
  ];
  for (const doc of docs) {
    const embedding = vectorLiteral(embedText(doc.content));
    await pool.query(
      `
      INSERT INTO knowledge_chunks (topic, source, content, embedding)
      VALUES ($1, $2, $3, $4::vector)
      `,
      [doc.topic, doc.source, doc.content, embedding],
    );
  }
}

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

app.get('/health', async (_req, res) => {
  const db = await pool.query('SELECT 1');
  res.json({ ok: true, db: db.rowCount === 1 });
});

app.post('/api/auth/signup', async (req, res) => {
  try {
    const body = signupSchema.parse(req.body);
    const hash = await bcrypt.hash(body.password, 10);
    const created = await pool.query<{ id: string; name: string; email: string }>(
      `
      INSERT INTO users (name, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, name, email
      `,
      [body.name, body.email.toLowerCase(), hash],
    );
    const user = created.rows[0];
    const token = signToken(user);
    res.status(201).json({ token, user });
  } catch (error) {
    if ((error as { code?: string }).code === '23505') {
      res.status(409).json({ message: 'Email already registered' });
      return;
    }
    res.status(400).json({ message: 'Invalid signup payload', error: (error as Error).message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const schema = z.object({ email: z.string().email(), password: z.string().min(1) });
  try {
    const { email, password } = schema.parse(req.body);
    const result = await pool.query<{ id: string; name: string; email: string; password_hash: string }>(
      `
      SELECT id, name, email, password_hash
      FROM users
      WHERE email = $1
      `,
      [email.toLowerCase()],
    );
    const user = result.rows[0];
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    const token = signToken({ id: user.id, name: user.name, email: user.email });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(400).json({ message: 'Invalid login payload', error: (error as Error).message });
  }
});

app.get('/api/profile', authMiddleware, async (req: AuthedRequest, res) => {
  const result = await pool.query(
    `
    SELECT id, name, email, phone, avatar_url, created_at
    FROM users
    WHERE id = $1
    `,
    [req.user?.id],
  );
  res.json(result.rows[0]);
});

app.put('/api/profile', authMiddleware, async (req: AuthedRequest, res) => {
  const schema = z.object({
    name: z.string().min(2).optional(),
    phone: z.string().min(7).max(20).optional(),
    avatarUrl: z.string().url().optional(),
  });
  try {
    const body = schema.parse(req.body);
    const updated = await pool.query(
      `
      UPDATE users
      SET
        name = COALESCE($2, name),
        phone = COALESCE($3, phone),
        avatar_url = COALESCE($4, avatar_url)
      WHERE id = $1
      RETURNING id, name, email, phone, avatar_url, created_at
      `,
      [req.user?.id, body.name ?? null, body.phone ?? null, body.avatarUrl ?? null],
    );
    res.json(updated.rows[0]);
  } catch (error) {
    res.status(400).json({ message: 'Invalid profile payload', error: (error as Error).message });
  }
});

app.get('/api/hotels', async (req, res) => {
  const query = req.query.query?.toString().trim().toLowerCase();
  const city = req.query.city?.toString().trim().toLowerCase();
  const minPrice = Number(req.query.minPrice ?? 0);
  const maxPrice = Number(req.query.maxPrice ?? 99999);

  const result = await pool.query(
    `
    SELECT id, name, city, country, description, price_per_night, rating, amenities, image_url
    FROM hotels
    WHERE
      price_per_night BETWEEN $1 AND $2
      AND ($3::text IS NULL OR LOWER(city) = $3)
      AND (
        $4::text IS NULL
        OR LOWER(name) LIKE '%' || $4 || '%'
        OR LOWER(description) LIKE '%' || $4 || '%'
      )
    ORDER BY rating DESC, price_per_night ASC
    `,
    [minPrice, maxPrice, city || null, query || null],
  );
  res.json(result.rows);
});

app.get('/api/hotels/:id', async (req, res) => {
  const result = await pool.query(
    `
    SELECT id, name, city, country, description, price_per_night, rating, amenities, image_url
    FROM hotels
    WHERE id = $1
    `,
    [req.params.id],
  );
  if (!result.rows[0]) {
    res.status(404).json({ message: 'Hotel not found' });
    return;
  }
  res.json(result.rows[0]);
});

app.get('/api/search/suggestions', async (req, res) => {
  const q = req.query.q?.toString().trim().toLowerCase();
  if (!q) {
    res.json([]);
    return;
  }
  const result = await pool.query<{ city: string }>(
    `
    SELECT DISTINCT city
    FROM hotels
    WHERE LOWER(city) LIKE $1
    ORDER BY city
    LIMIT 8
    `,
    [`${q}%`],
  );
  res.json(result.rows.map((row) => row.city));
});

app.post('/api/bookings', authMiddleware, async (req: AuthedRequest, res) => {
  const schema = z.object({
    hotelId: z.string().uuid(),
    checkIn: z.string(),
    checkOut: z.string(),
    guests: z.number().int().min(1).max(10),
  });
  try {
    const body = schema.parse(req.body);
    const hotelRes = await pool.query<{ price_per_night: string }>(
      'SELECT price_per_night FROM hotels WHERE id = $1',
      [body.hotelId],
    );
    const hotel = hotelRes.rows[0];
    if (!hotel) {
      res.status(404).json({ message: 'Hotel not found' });
      return;
    }
    const nights = Math.max(
      1,
      Math.ceil((new Date(body.checkOut).getTime() - new Date(body.checkIn).getTime()) / (1000 * 60 * 60 * 24)),
    );
    const totalPrice = Number(hotel.price_per_night) * nights * body.guests;
    const created = await pool.query(
      `
      INSERT INTO bookings (user_id, hotel_id, check_in, check_out, guests, total_price, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'confirmed')
      RETURNING id, user_id, hotel_id, check_in, check_out, guests, total_price, status, created_at
      `,
      [req.user?.id, body.hotelId, body.checkIn, body.checkOut, body.guests, totalPrice],
    );
    res.status(201).json(created.rows[0]);
  } catch (error) {
    res.status(400).json({ message: 'Invalid booking payload', error: (error as Error).message });
  }
});

app.get('/api/bookings/me', authMiddleware, async (req: AuthedRequest, res) => {
  const result = await pool.query(
    `
    SELECT
      b.id,
      b.check_in,
      b.check_out,
      b.guests,
      b.total_price,
      b.status,
      b.created_at,
      h.id AS hotel_id,
      h.name AS hotel_name,
      h.city,
      h.country,
      h.image_url
    FROM bookings b
    JOIN hotels h ON h.id = b.hotel_id
    WHERE b.user_id = $1
    ORDER BY b.created_at DESC
    `,
    [req.user?.id],
  );
  res.json(result.rows);
});

app.post('/api/rag/index', adminKeyMiddleware, async (req, res) => {
  const schema = z.object({
    topic: z.string().min(2),
    source: z.string().min(2),
    content: z.string().min(20),
  });
  try {
    const body = schema.parse(req.body);
    const embedding = vectorLiteral(embedText(body.content));
    const created = await pool.query(
      `
      INSERT INTO knowledge_chunks (topic, source, content, embedding)
      VALUES ($1, $2, $3, $4::vector)
      RETURNING id, topic, source, created_at
      `,
      [body.topic, body.source, body.content, embedding],
    );
    res.status(201).json(created.rows[0]);
  } catch (error) {
    res.status(400).json({ message: 'Invalid RAG index payload', error: (error as Error).message });
  }
});

app.post('/api/rag/query', async (req, res) => {
  const schema = z.object({ question: z.string().min(5) });
  try {
    const body = schema.parse(req.body);
    const queryEmbedding = vectorLiteral(embedText(body.question));
    const retrieval = await pool.query<{ content: string; topic: string; score: number }>(
      `
      SELECT
        content,
        topic,
        1 - (embedding <=> $1::vector) AS score
      FROM knowledge_chunks
      ORDER BY embedding <=> $1::vector
      LIMIT 4
      `,
      [queryEmbedding],
    );

    const context = retrieval.rows
      .filter((row) => row.score > 0.2)
      .map((row) => `- (${row.topic}) ${row.content}`)
      .join('\n');

    const generated = await generateRagAnswer({
      question: body.question,
      context,
      provider: llmConfig.provider,
      apiKey: llmConfig.apiKey,
      model: llmConfig.model,
    });

    res.json({
      question: body.question,
      answer: generated.answer,
      retrieved: retrieval.rows,
      mode: generated.mode,
      provider: generated.provider,
      model: generated.model ?? null,
    });
  } catch (error) {
    res.status(400).json({ message: 'Invalid RAG query payload', error: (error as Error).message });
  }
});

app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).json({ message: 'Internal server error', error: error.message });
});

async function bootstrap() {
  if (env.AUTO_MIGRATE === 'true') {
    await runMigrations();
    await seedHotels();
    await seedKnowledgeBase();
  }
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Wintrig API listening on http://localhost:${port}`);
  });
}

bootstrap().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start API:', error);
  process.exit(1);
});
