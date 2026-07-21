# Wintrig Hotel Booking

Cross-platform **React Native (Expo) + TypeScript** client plus a production-ready **Node.js + Express backend** with:

- Neon PostgreSQL database
- Render deployment config
- JWT auth (`signup`, `login`)
- Hotels search/detail APIs
- Booking APIs
- Profile APIs
- Free-cost RAG pipeline with pgvector retrieval

## Stack

| Layer | Choice |
| --- | --- |
| Mobile + web app | Expo SDK 57, React Native, TypeScript |
| Backend | Express 5, TypeScript |
| Database | Neon PostgreSQL + pgvector |
| Auth | JWT + bcrypt |
| RAG | Free local embedding + pgvector retrieval |
| Deployment | Render Free plan (`render.yaml`) |

## Run the app

```bash
npm install
npm run web
npm run ios
npm run android
```

Set `EXPO_PUBLIC_API_URL=http://localhost:4000` for local API.

## Backend setup (Neon + Render)

### 1) Local backend

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

Required env values:

- `DATABASE_URL` = Neon connection string
- `JWT_SECRET` = long secure secret
- `ADMIN_API_KEY` = key for RAG indexing endpoint

`AUTO_MIGRATE=true` auto-creates tables, enables `vector` extension, and seeds hotels + knowledge chunks.

### 2) Deploy on Render (free)

This repo includes `render.yaml` with service `wintrig-api` (`rootDir: server`).

**Important:** do not start the Expo `index.ts`. The API lives in `server/`.

In Render dashboard for the web service, set:

| Setting | Value |
| --- | --- |
| Root Directory | `server` |
| Build Command | `npm install && npm run build` |
| Start Command | `npm start` |

Then set secrets:

- `DATABASE_URL` (Neon)
- `JWT_SECRET`
- `ADMIN_API_KEY`
- `GROQ_API_KEY` (optional, for free LLM answers)

Redeploy after changing these settings.

## API reference

Base URL local: `http://localhost:4000`

### Auth

- `POST /api/auth/signup`
  - body: `{ "name": "Alex", "email": "alex@email.com", "password": "secret123" }`
- `POST /api/auth/login`
  - body: `{ "email": "alex@email.com", "password": "secret123" }`

### Profile (Bearer token required)

- `GET /api/profile`
- `PUT /api/profile`
  - body: `{ "name": "Alex Morgan", "phone": "9999999999", "avatarUrl": "https://..." }`

### Hotels

- `GET /api/hotels?query=santo&city=santorini&minPrice=100&maxPrice=400`
- `GET /api/hotels/:id`
- `GET /api/search/suggestions?q=sa`

### Bookings (Bearer token required)

- `POST /api/bookings`
  - body: `{ "hotelId": "<uuid>", "checkIn": "2026-08-10", "checkOut": "2026-08-14", "guests": 2 }`
- `GET /api/bookings/me`

### RAG / LLM assistant

- `POST /api/rag/index` (requires header `x-admin-key`)
  - body: `{ "topic": "policy", "source": "faq", "content": "..." }`
- `POST /api/rag/query`
  - body: `{ "question": "Can I cancel after booking?" }`

Pipeline:

1. Free local embeddings + Neon pgvector retrieval
2. Free LLM answer generation (recommended: **Groq Llama**)
3. Falls back to template answers if no LLM key is set

#### Free LLM setup (recommended)

1. Create a free key at [console.groq.com](https://console.groq.com)
2. Add to `server/.env`:

```bash
LLM_PROVIDER=groq
GROQ_API_KEY=your_groq_key
LLM_MODEL=llama-3.1-8b-instant
```

Other supported providers:

```bash
# Google Gemini free tier
LLM_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_key
LLM_MODEL=gemini-2.0-flash

# OpenAI (paid / trial credits)
LLM_PROVIDER=openai
OPENAI_API_KEY=your_openai_key
LLM_MODEL=gpt-4o-mini
```

## Project layout

- `src/` - mobile/web app
- `server/src/index.ts` - backend APIs and RAG
- `server/.env.example` - backend env template
- `render.yaml` - Render deployment spec
