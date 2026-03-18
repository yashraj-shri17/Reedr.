-- Initial Schema for Reedr

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  username TEXT UNIQUE,
  display_name TEXT,
  bio TEXT CHECK (char_length(bio) <= 160),
  profile_photo_url TEXT,
  banner_image_url TEXT,
  featured_book_id UUID,
  subscription_tier TEXT NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free', 'plus')),
  subscription_billing TEXT CHECK (subscription_billing IN ('monthly', 'annual', 'early_adopter_annual')),
  stripe_customer_id TEXT UNIQUE,
  reading_goal INTEGER,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_active_date DATE,
  show_streak_on_profile BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Works (Abstract Books)
CREATE TABLE IF NOT EXISTS works (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  open_library_work_id TEXT UNIQUE,
  canonical_title TEXT NOT NULL,
  canonical_author TEXT NOT NULL,
  primary_cover_url TEXT,
  genres TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_works_title ON works (canonical_title);
CREATE INDEX IF NOT EXISTS idx_works_author ON works (canonical_author);
CREATE INDEX IF NOT EXISTS idx_works_ol_id ON works (open_library_work_id);

-- Add foreign key to users now that works exists
ALTER TABLE users ADD CONSTRAINT fk_featured_book FOREIGN KEY (featured_book_id) REFERENCES works(id);

-- Editions (Specific ISBN/Format)
CREATE TABLE IF NOT EXISTS editions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  work_id UUID NOT NULL REFERENCES works(id) ON DELETE CASCADE,
  isbn TEXT,
  isbn13 TEXT,
  google_books_id TEXT,
  open_library_edition_id TEXT,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  cover_image_url TEXT,
  publication_year INTEGER,
  publisher TEXT,
  page_count INTEGER,
  format TEXT CHECK (format IN ('hardcover', 'paperback', 'ebook', 'audiobook')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_editions_work_id ON editions (work_id);
CREATE INDEX IF NOT EXISTS idx_editions_isbn13 ON editions (isbn13);
CREATE INDEX IF NOT EXISTS idx_editions_isbn ON editions (isbn);
CREATE INDEX IF NOT EXISTS idx_editions_google_id ON editions (google_books_id);

-- Shelves
CREATE TABLE IF NOT EXISTS shelves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'My Shelf',
  is_public BOOLEAN NOT NULL DEFAULT TRUE,
  theme TEXT NOT NULL DEFAULT 'minimalist'
    CHECK (theme IN ('minimalist', 'dark_academia', 'botanical', 'pastel', 'vintage_library')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shelves_user_id ON shelves (user_id);

-- User Books Junction
CREATE TABLE IF NOT EXISTS user_books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  work_id UUID NOT NULL REFERENCES works(id),
  edition_id UUID REFERENCES editions(id),
  shelf_id UUID NOT NULL REFERENCES shelves(id) ON DELETE CASCADE,
  reading_status TEXT NOT NULL DEFAULT 'want_to_read'
    CHECK (reading_status IN ('read', 'currently_reading', 'want_to_read', 'dnf')),
  rating NUMERIC(3,2) CHECK (rating >= 0.25 AND rating <= 5.0),
  rating_plot NUMERIC(3,2) CHECK (rating_plot >= 0.25 AND rating_plot <= 5.0),
  rating_characters NUMERIC(3,2) CHECK (rating_characters >= 0.25 AND rating_characters <= 5.0),
  rating_writing NUMERIC(3,2) CHECK (rating_writing >= 0.25 AND rating_writing <= 5.0),
  rating_enjoyment NUMERIC(3,2) CHECK (rating_enjoyment >= 0.25 AND rating_enjoyment <= 5.0),
  spice_level INTEGER CHECK (spice_level >= 1 AND spice_level <= 5),
  notes TEXT,
  custom_cover_url TEXT,
  custom_sort_position INTEGER,
  date_added TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  date_read DATE,
  date_status_changed TIMESTAMPTZ,
  UNIQUE (user_id, work_id, shelf_id)
);

CREATE INDEX IF NOT EXISTS idx_user_books_user_shelf ON user_books (user_id, shelf_id);
CREATE INDEX IF NOT EXISTS idx_user_books_work ON user_books (work_id);
CREATE INDEX IF NOT EXISTS idx_user_books_status ON user_books (user_id, reading_status);

-- Quotes
CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  work_id UUID NOT NULL REFERENCES works(id),
  text TEXT NOT NULL,
  source_type TEXT NOT NULL DEFAULT 'typed' CHECK (source_type IN ('typed', 'photo_ocr')),
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quotes_user_work ON quotes (user_id, work_id);

-- Book Tags
CREATE TABLE IF NOT EXISTS book_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  work_id UUID NOT NULL REFERENCES works(id),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tag_type TEXT NOT NULL CHECK (tag_type IN ('trope', 'mood', 'content_warning')),
  tag_value TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (work_id, user_id, tag_type, tag_value)
);

CREATE INDEX IF NOT EXISTS idx_book_tags_work ON book_tags (work_id, tag_type);
CREATE INDEX IF NOT EXISTS idx_book_tags_user ON book_tags (user_id);

-- Reading Goals
CREATE TABLE IF NOT EXISTS reading_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  target INTEGER NOT NULL,
  current_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, year)
);

-- AI Recommendations Cache
CREATE TABLE IF NOT EXISTS ai_recommendations_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recommendation_type TEXT NOT NULL CHECK (recommendation_type IN ('passive', 'mood_based')),
  mood_prompt TEXT,
  recommended_books JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ai_cache_user ON ai_recommendations_cache (user_id, recommendation_type);
CREATE INDEX IF NOT EXISTS idx_ai_cache_expiry ON ai_recommendations_cache (expires_at);

-- Stripe Webhook Events
CREATE TABLE IF NOT EXISTS stripe_webhook_events (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS POLICIES

-- Users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Public profiles readable" ON users FOR SELECT USING (TRUE);

-- Works & Editions
ALTER TABLE works ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Works are public" ON works FOR SELECT USING (TRUE);
CREATE POLICY "Authenticated users can insert works" ON works FOR INSERT WITH CHECK (auth.role() = 'authenticated');

ALTER TABLE editions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Editions are public" ON editions FOR SELECT USING (TRUE);
CREATE POLICY "Authenticated users can insert editions" ON editions FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Shelves
ALTER TABLE shelves ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Shelves owner full access" ON shelves FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public shelves readable" ON shelves FOR SELECT USING (is_public = TRUE);

-- User Books
ALTER TABLE user_books ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User books owner access" ON user_books FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public shelf books readable" ON user_books FOR SELECT
  USING (EXISTS (SELECT 1 FROM shelves WHERE shelves.id = user_books.shelf_id AND shelves.is_public = TRUE));

-- Quotes
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Quotes owner access" ON quotes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public quotes readable" ON quotes FOR SELECT USING (is_public = TRUE);

-- Book Tags
ALTER TABLE book_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tags owner write" ON book_tags FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Tags public read" ON book_tags FOR SELECT USING (TRUE);

-- Reading Goals
ALTER TABLE reading_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Goals owner access" ON reading_goals FOR ALL USING (auth.uid() = user_id);

-- AI Cache
ALTER TABLE ai_recommendations_cache ENABLE ROW LEVEL SECURITY;
CREATE POLICY "AI cache owner access" ON ai_recommendations_cache FOR ALL USING (auth.uid() = user_id);
