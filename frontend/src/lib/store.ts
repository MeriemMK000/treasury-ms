import { create } from 'zustand';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  setAuth: (user, token) => {
    localStorage.setItem('treasury_token', token);
    localStorage.setItem('treasury_user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('treasury_token');
    localStorage.removeItem('treasury_user');
    set({ user: null, token: null, isAuthenticated: false });
  },
  hydrate: () => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('treasury_token');
    const userStr = localStorage.getItem('treasury_user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ user, token, isAuthenticated: true });
      } catch { set({ user: null, token: null, isAuthenticated: false }); }
    }
  },
}));
