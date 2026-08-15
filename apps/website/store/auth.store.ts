import { create } from 'zustand';
import { Customer } from '../types';

interface AuthState {
  user: Customer | null;
  accessToken: string | null;
  isAuthenticated: boolean;

  setTokens: (tokens: { accessToken: string }) => void;
  setUser: (user: Customer) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  (set) => ({
    user: null,
    accessToken: null,
    isAuthenticated: false,

    setTokens: ({ accessToken }) =>
      set({ accessToken, isAuthenticated: true }),

    setUser: (user) => set({ user }),

    logout: () =>
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
      }),
  })
);
