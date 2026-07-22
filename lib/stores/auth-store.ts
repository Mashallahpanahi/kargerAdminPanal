import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id?: string;
  email: string;
  role: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  setAuth: (user: User) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      setAuth: (user) => set({ isAuthenticated: true, user }),
      clearAuth: () => set({ isAuthenticated: false, user: null }),
    }),
    {
      name: "auth-storage",
    }
  )
);
