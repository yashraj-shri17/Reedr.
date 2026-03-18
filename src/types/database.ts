export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          username: string | null
          display_name: string | null
          bio: string | null
          profile_photo_url: string | null
          banner_image_url: string | null
          featured_book_id: string | null
          subscription_tier: 'free' | 'plus'
          subscription_billing: 'monthly' | 'annual' | 'early_adopter_annual' | null
          stripe_customer_id: string | null
          reading_goal: number | null
          current_streak: number
          longest_streak: number
          last_active_date: string | null
          show_streak_on_profile: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          username?: string | null
          display_name?: string | null
          bio?: string | null
          profile_photo_url?: string | null
          banner_image_url?: string | null
          featured_book_id?: string | null
          subscription_tier?: 'free' | 'plus'
          subscription_billing?: 'monthly' | 'annual' | 'early_adopter_annual' | null
          stripe_customer_id?: string | null
          reading_goal?: number | null
          current_streak?: number
          longest_streak?: number
          last_active_date?: string | null
          show_streak_on_profile?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string | null
          display_name?: string | null
          bio?: string | null
          profile_photo_url?: string | null
          banner_image_url?: string | null
          featured_book_id?: string | null
          subscription_tier?: 'free' | 'plus'
          subscription_billing?: 'monthly' | 'annual' | 'early_adopter_annual' | null
          stripe_customer_id?: string | null
          reading_goal?: number | null
          current_streak?: number
          longest_streak?: number
          last_active_date?: string | null
          show_streak_on_profile?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      works: {
        Row: {
          id: string
          open_library_work_id: string | null
          canonical_title: string
          canonical_author: string
          primary_cover_url: string | null
          genres: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          open_library_work_id?: string | null
          canonical_title: string
          canonical_author: string
          primary_cover_url?: string | null
          genres?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          open_library_work_id?: string | null
          canonical_title?: string
          canonical_author?: string
          primary_cover_url?: string | null
          genres?: string[] | null
          created_at?: string
        }
      }
      editions: {
        Row: {
          id: string
          work_id: string
          isbn: string | null
          isbn13: string | null
          google_books_id: string | null
          open_library_edition_id: string | null
          title: string
          author: string
          cover_image_url: string | null
          publication_year: number | null
          publisher: string | null
          page_count: number | null
          format: 'hardcover' | 'paperback' | 'ebook' | 'audiobook' | null
          created_at: string
        }
        Insert: {
          id?: string
          work_id: string
          isbn?: string | null
          isbn13?: string | null
          google_books_id?: string | null
          open_library_edition_id?: string | null
          title: string
          author: string
          cover_image_url?: string | null
          publication_year?: number | null
          publisher?: string | null
          page_count?: number | null
          format?: 'hardcover' | 'paperback' | 'ebook' | 'audiobook' | null
          created_at?: string
        }
        Update: {
          id?: string
          work_id?: string
          isbn?: string | null
          isbn13?: string | null
          google_books_id?: string | null
          open_library_edition_id?: string | null
          title?: string
          author?: string
          cover_image_url?: string | null
          publication_year?: number | null
          publisher?: string | null
          page_count?: number | null
          format?: 'hardcover' | 'paperback' | 'ebook' | 'audiobook' | null
          created_at?: string
        }
      }
      shelves: {
        Row: {
          id: string
          user_id: string
          name: string
          is_public: boolean
          theme: 'minimalist' | 'dark_academia' | 'botanical' | 'pastel' | 'vintage_library'
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name?: string
          is_public?: boolean
          theme?: 'minimalist' | 'dark_academia' | 'botanical' | 'pastel' | 'vintage_library'
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          is_public?: boolean
          theme?: 'minimalist' | 'dark_academia' | 'botanical' | 'pastel' | 'vintage_library'
          sort_order?: number
          created_at?: string
        }
      }
      user_books: {
        Row: {
          id: string
          user_id: string
          work_id: string
          edition_id: string | null
          shelf_id: string
          reading_status: 'read' | 'currently_reading' | 'want_to_read' | 'dnf'
          rating: number | null
          rating_plot: number | null
          rating_characters: number | null
          rating_writing: number | null
          rating_enjoyment: number | null
          spice_level: number | null
          notes: string | null
          custom_cover_url: string | null
          custom_sort_position: number | null
          date_added: string
          date_read: string | null
          date_status_changed: string | null
        }
        Insert: {
          id?: string
          user_id: string
          work_id: string
          edition_id?: string | null
          shelf_id: string
          reading_status?: 'read' | 'currently_reading' | 'want_to_read' | 'dnf'
          rating?: number | null
          rating_plot?: number | null
          rating_characters?: number | null
          rating_writing?: number | null
          rating_enjoyment?: number | null
          spice_level?: number | null
          notes?: string | null
          custom_cover_url?: string | null
          custom_sort_position?: number | null
          date_added?: string
          date_read?: string | null
          date_status_changed?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          work_id?: string
          edition_id?: string | null
          shelf_id?: string
          reading_status?: 'read' | 'currently_reading' | 'want_to_read' | 'dnf'
          rating?: number | null
          rating_plot?: number | null
          rating_characters?: number | null
          rating_writing?: number | null
          rating_enjoyment?: number | null
          spice_level?: number | null
          notes?: string | null
          custom_cover_url?: string | null
          custom_sort_position?: number | null
          date_added?: string
          date_read?: string | null
          date_status_changed?: string | null
        }
      }
      quotes: {
        Row: {
          id: string
          user_id: string
          work_id: string
          text: string
          source_type: 'typed' | 'photo_ocr'
          is_public: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          work_id: string
          text: string
          source_type?: 'typed' | 'photo_ocr'
          is_public?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          work_id?: string
          text?: string
          source_type?: 'typed' | 'photo_ocr'
          is_public?: boolean
          created_at?: string
        }
      }
      book_tags: {
        Row: {
          id: string
          work_id: string
          user_id: string
          tag_type: 'trope' | 'mood' | 'content_warning'
          tag_value: string
          created_at: string
        }
        Insert: {
          id?: string
          work_id: string
          user_id: string
          tag_type: 'trope' | 'mood' | 'content_warning'
          tag_value: string
          created_at?: string
        }
        Update: {
          id?: string
          work_id?: string
          user_id?: string
          tag_type?: 'trope' | 'mood' | 'content_warning'
          tag_value?: string
          created_at?: string
        }
      }
      reading_goals: {
        Row: {
          id: string
          user_id: string
          year: number
          target: number
          current_count: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          year: number
          target: number
          current_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          year?: number
          target?: number
          current_count?: number
          created_at?: string
        }
      }
      ai_recommendations_cache: {
        Row: {
          id: string
          user_id: string
          recommendation_type: 'passive' | 'mood_based'
          mood_prompt: string | null
          recommended_books: Json
          created_at: string
          expires_at: string
        }
        Insert: {
          id?: string
          user_id: string
          recommendation_type: 'passive' | 'mood_based'
          mood_prompt?: string | null
          recommended_books: Json
          created_at?: string
          expires_at: string
        }
        Update: {
          id?: string
          user_id?: string
          recommendation_type?: 'passive' | 'mood_based'
          mood_prompt?: string | null
          recommended_books?: Json
          created_at?: string
          expires_at?: string
        }
      }
      stripe_webhook_events: {
        Row: {
          id: string
          event_type: string
          processed_at: string
        }
        Insert: {
          id: string
          event_type: string
          processed_at?: string
        }
        Update: {
          id?: string
          event_type?: string
          processed_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
