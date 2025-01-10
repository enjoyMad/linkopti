// src/utils/types.ts

export type User = {
  id: string;
  email: string;
  name?: string;
  role: string;
  created_at: string;
};

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at'>;
        Update: Partial<Omit<User, 'id' | 'created_at'>>;
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['projects']['Row'], 'id' | 'created_at'>;
        Update: Partial<Omit<Database['public']['Tables']['projects']['Row'], 'id' | 'created_at'>>;
      };
      utm_links: {
        Row: {
          id: string;
          project_id: string;
          url: string;
          utm_source: string;
          utm_medium: string;
          utm_campaign: string;
          utm_term?: string;
          utm_content?: string;
          short_url?: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['utm_links']['Row'], 'id' | 'short_url' | 'created_at'>;
        Update: Partial<Omit<Database['public']['Tables']['utm_links']['Row'], 'id' | 'short_url' | 'created_at'>>;
      };
      // Ajoute d'autres tables si nécessaire
    };
  };
}
