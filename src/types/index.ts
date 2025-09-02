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
  image_url?: string;
  visibility: 'public' | 'private';
  created_at: string;
  user_id: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

export interface Database {
  public: {
    Tables: {
      startups: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string;
          image_url: string | null;
          visibility: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description: string;
          image_url?: string | null;
          visibility?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string;
          image_url?: string | null;
          visibility?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}