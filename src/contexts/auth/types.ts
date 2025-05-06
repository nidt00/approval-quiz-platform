
import { User, UserRole, UserStatus } from '@/types';

export interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>; // Changed from Promise<void> to Promise<any>
  register: (name: string, email: string, username: string, password: string) => Promise<any>; // Changed from Promise<void> to Promise<any>
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSupabaseReady: boolean;
}
