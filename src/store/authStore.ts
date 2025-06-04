import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  username: string;
  email?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (username: string, password: string) => {
        // Demo login - in production this would call an API
        if (username === 'username' && password === 'password') {
          set({
            user: {
              id: '1',
              username: username,
            },
            isAuthenticated: true,
          });
          return true;
        }
        return false;
      },

      signup: async (username: string, password: string) => {
        // Demo signup - in production this would call an API
        set({
          user: {
            id: '1',
            username: username,
          },
          isAuthenticated: true,
        });
        return true;
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'chairismatic-auth',
    }
  )
);