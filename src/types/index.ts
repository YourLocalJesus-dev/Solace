export interface User {
  id: string;
  email: string;
  username: string;
  profilePicture?: string;
  createdAt: string;
  isAdmin: boolean;
}

export interface Startup {
  id: string;
  name: string;
  description: string;
  category: string;
  founder: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}