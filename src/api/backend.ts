export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

export type Hotel = {
  id: string;
  name: string;
  city: string;
  country: string;
  description: string;
  price_per_night: string;
  rating: string;
  amenities: string[];
  image_url: string;
};

export type Booking = {
  id: string;
  check_in: string;
  check_out: string;
  guests: number;
  total_price: string;
  status: string;
  created_at: string;
  hotel_id: string;
  hotel_name: string;
  city: string;
  country: string;
  image_url: string;
};

export type Profile = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
};

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000';

async function request<T>(path: string, init?: RequestInit, token?: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    let message = `Request failed: ${response.status}`;
    try {
      const json = (await response.json()) as { message?: string };
      if (json.message) {
        message = json.message;
      }
    } catch {
      // keep fallback message
    }
    throw new Error(message);
  }

  return (await response.json()) as T;
}

export const backendApi = {
  signup: (payload: { name: string; email: string; password: string }) =>
    request<{ token: string; user: AuthUser }>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  login: (payload: { email: string; password: string }) =>
    request<{ token: string; user: AuthUser }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getProfile: (token: string) => request<Profile>('/api/profile', undefined, token),
  updateProfile: (token: string, payload: { name?: string; phone?: string; avatarUrl?: string }) =>
    request<Profile>(
      '/api/profile',
      {
        method: 'PUT',
        body: JSON.stringify(payload),
      },
      token,
    ),
  listHotels: (params?: string | { query?: string; city?: string; minPrice?: number; maxPrice?: number }) => {
    const filters = typeof params === 'string' ? { query: params } : params ?? {};
    const search = new URLSearchParams();
    if (filters.query) search.set('query', filters.query);
    if (filters.city) search.set('city', filters.city);
    if (filters.minPrice != null) search.set('minPrice', String(filters.minPrice));
    if (filters.maxPrice != null) search.set('maxPrice', String(filters.maxPrice));
    const queryString = search.toString();
    return request<Hotel[]>(`/api/hotels${queryString ? `?${queryString}` : ''}`);
  },
  getHotel: (id: string) => request<Hotel>(`/api/hotels/${encodeURIComponent(id)}`),
  searchSuggestions: (q: string) =>
    request<string[]>(`/api/search/suggestions?q=${encodeURIComponent(q)}`),
  createBooking: (
    token: string,
    payload: { hotelId: string; checkIn: string; checkOut: string; guests: number },
  ) =>
    request<Booking>(
      '/api/bookings',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
      token,
    ),
  myBookings: (token: string) => request<Booking[]>('/api/bookings/me', undefined, token),
  ragQuery: (question: string) =>
    request<{ answer: string; retrieved: { topic: string; content: string }[] }>('/api/rag/query', {
      method: 'POST',
      body: JSON.stringify({ question }),
    }),
};
