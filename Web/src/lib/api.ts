// lib/api.ts

import { tokenStore, userStore, type LoggedUser } from './auth';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

async function request<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const headers = new Headers(opts.headers);
  headers.set('Content-Type', 'application/json');
  const access = tokenStore.access;
  if (access) headers.set('Authorization', `Bearer ${access}`);

  let res = await fetch(`${API}${path}`, { ...opts, headers });

  if (res.status === 401 && tokenStore.refresh) {
    const r = await fetch(`${API}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: tokenStore.refresh })
    });
    if (r.ok) {
      const data = await r.json();
      tokenStore.set(data.accessToken, data.refreshToken);
      headers.set('Authorization', `Bearer ${data.accessToken}`);
      res = await fetch(`${API}${path}`, { ...opts, headers });
    } else {
      tokenStore.clear();
    }
  }

  if (!res.ok) {
    const msg = await res.text().catch(() => '');
    throw new Error(msg || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  // ✅ MODIFIED: Added phone to signup parameters
  async signup(email: string, phone: string, password: string, name?: string) {
    const data = await request<{ user: LoggedUser; accessToken: string; refreshToken: string }>(
      '/auth/signup',
      { method: 'POST', body: JSON.stringify({ email, phone, password, name }) }
    );
    tokenStore.set(data.accessToken, data.refreshToken);
    userStore.set(data.user);
    return data.user;
  },

  // ✅ MODIFIED: Changed 'email' to a generic 'login' identifier
  async login(login: string, password: string) {
    const data = await request<{ user: LoggedUser; accessToken: string; refreshToken: string }>(
      '/auth/login',
      { method: 'POST', body: JSON.stringify({ login, password }) }
    );
    tokenStore.set(data.accessToken, data.refreshToken);
    userStore.set(data.user);
    return data.user;
  },

  // ... rest of the file is unchanged ...
  async me() {
    const data = await request<{ user: LoggedUser }>('/auth/me');
    userStore.set(data.user);
    return data.user;
  },

  async logout() {
    if (tokenStore.refresh) {
      await request('/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken: tokenStore.refresh })
      }).catch(() => {});
    }
    tokenStore.clear();
  },

  async createChat(title: string) {
    const data = await request<{ chat: { id: number; title: string } }>('/chats', {
      method: 'POST',
      body: JSON.stringify({ title }),
    });
    return data.chat;
  },

  async sendMessage(chatId: number, text: string) {
    const data = await request<{ userMessage: any; botMessage: any }>(`/chats/${chatId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
    return data;
  },  
};