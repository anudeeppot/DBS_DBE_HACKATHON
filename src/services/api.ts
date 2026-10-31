// ============================================================
// src/services/api.ts
// Central API client — all calls go through here.
// Base URL is read from the VITE_API_URL env variable,
// falling back to http://localhost:3001 for local dev.
// ============================================================

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `API error ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// ── Vehicles ─────────────────────────────────────────────────
export const api = {
  vehicles: {
    getAll: ()           => request<any[]>('/api/vehicles'),
    getById: (id: string)=> request<any>(`/api/vehicles/${id}`),
    updateStatus: (id: string, status: string) =>
      request('/api/vehicles/' + id + '/status', {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
    updateLoad: (id: string, payload: object) =>
      request('/api/vehicles/' + id + '/load', {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }),
  },

  drivers: {
    getAll: ()            => request<any[]>('/api/drivers'),
    getById: (id: string) => request<any>(`/api/drivers/${id}`),
  },

  shipments: {
    getAll: ()              => request<any[]>('/api/shipments'),
    create: (data: object)  => request('/api/shipments', { method: 'POST', body: JSON.stringify(data) }),
  },

  opportunities: {
    getAll: ()            => request<any[]>('/api/opportunities'),
    accept: (id: string)  => request(`/api/opportunities/${id}/accept`, { method: 'PATCH' }),
  },

  maintenance: {
    getAll: ()             => request<any[]>('/api/maintenance'),
    create: (data: object) => request('/api/maintenance', { method: 'POST', body: JSON.stringify(data) }),
  },

  expenses: {
    getAll: ()             => request<any[]>('/api/expenses'),
    create: (data: object) => request('/api/expenses', { method: 'POST', body: JSON.stringify(data) }),
  },

  alerts: {
    getAll: ()             => request<any[]>('/api/alerts'),
    create: (data: object) => request('/api/alerts', { method: 'POST', body: JSON.stringify(data) }),
    markRead: (id: string) => request(`/api/alerts/${id}/read`, { method: 'PATCH' }),
    markAllRead: ()        => request('/api/alerts/read-all', { method: 'PATCH' }),
  },
};
