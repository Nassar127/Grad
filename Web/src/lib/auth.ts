const ACCESS_KEY = 'ml.access';
const REFRESH_KEY = 'ml.refresh';
const USER_KEY   = 'ml.user';

export type LoggedUser = { id: number; email: string; name?: string | null; role?: string | null };

export const tokenStore = {
  get access() { return localStorage.getItem(ACCESS_KEY); },
  get refresh() { return localStorage.getItem(REFRESH_KEY); },
  set(access: string, refresh: string) {
    localStorage.setItem(ACCESS_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
  }
};

export const userStore = {
  get(): LoggedUser | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },
  set(u: LoggedUser) { localStorage.setItem(USER_KEY, JSON.stringify(u)); }
};
