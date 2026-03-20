# Reedr — Technical Product Requirements Document

**Version:** 1.0
**Date:** 2026-03-16
**Author:** Melusi Ndoro
**Status:** Final — Ready for development

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Target User & Personas](#2-target-user--personas)
3. [Tech Stack](#3-tech-stack)
4. [Architecture](#4-architecture)
5. [Project Structure](#5-project-structure)
6. [Database Schema](#6-database-schema)
7. [Authentication & Authorization](#7-authentication--authorization)
8. [Routes & Pages](#8-routes--pages)
9. [Feature Specifications](#9-feature-specifications)
10. [API Integrations](#10-api-integrations)
11. [Theme System](#11-theme-system)
12. [Brand & Design System](#12-brand--design-system)
13. [Performance Requirements](#13-performance-requirements)
14. [Security Requirements](#14-security-requirements)
15. [Phased Delivery Roadmap](#15-phased-delivery-roadmap)
16. [Critical Pitfalls & Mitigations](#16-critical-pitfalls--mitigations)
17. [Environment Variables](#17-environment-variables)
18. [Development Setup](#18-development-setup)
19. [Scaling Plan](#19-scaling-plan)
20. [Success Metrics](#20-success-metrics)
21. [Out of Scope](#21-out-of-scope)

---

## 1. Product Overview

### What It Is

Reedr is a mobile-first responsive web app where readers curate, display, and discover books through visually stunning 3D digital bookshelves. Users build realistic shelves with themed environments, share their reading identity via public profile links, and discover books through an invisible AI-powered engine.

**Positioning:** "Letterboxd for books, but you control the aesthetic."

The shelf IS the product. The aesthetics are the differentiator. This is not a book tracker (StoryGraph), not a social network (Fable), not a marketplace. It's a visual display product for people who want to show off what they read.

### What It Is NOT

- Not a book tracker or stats tool (StoryGraph's territory)
- Not a social network (Fable's lane)
- Not a marketplace for buying books
- Not an AI product (AI powers parts invisibly -- never branded as "AI-powered")
- Not trying to replace Goodreads -- something new entirely

### Market Context

- **Total addressable:** 155M+ registered users across Goodreads/StoryGraph
- **12-month target:** 25,000 users (0.016% of market)
- **BookTok:** 200B+ views on TikTok -- massive audience seeking visual book content tools
- **Anti-Amazon sentiment** in the reading community is a powerful tailwind
- **Validation:** StoryGraph (solo founder, bootstrapped) grew to 5M users via organic viral moments

### Revenue Model — Three Legs

1. **Plus subscriptions:** $2.99/month or $24.99/year (early adopter: $12.49/year locked forever)
2. **Affiliate links:** Bookshop.org (10% commission) + Amazon (4.5%) on every book detail and recommendation
3. **Publisher partnerships:** Featured placements, sponsored giveaways -- activate at ~10K+ users

---

## 2. Target User & Personas

### Primary: BookTok Creator (18-35)

- Produces and shares book-related content on TikTok, Instagram, X
- Values visual aesthetics above functional features
- Owns 50-200+ books, reads 20-50/year
- Already uses Goodreads (frustrated with it) or StoryGraph
- Wants a URL they can put in their bio that shows off their reading taste
- Phone-first -- 80%+ of interactions will be mobile

### Secondary: Casual Reader (25-45)

- Reads 10-20 books/year
- Wants a simple way to track what they've read
- Not a content creator but shares recommendations with friends
- Might pay for premium features if the free tier impresses them

### Key Behavioral Insight

BookTok users don't just want to track books -- they want to DISPLAY them. The screenshot, the share link, the public profile IS the product to them. Every feature should be evaluated through the lens: "Does this make the shelf more shareable?"

---

## 3. Tech Stack

### Core Framework

| Package | Version | Purpose |
|---------|---------|---------|
| Next.js | 16.1.x | Full-stack React framework (Turbopack default, Server Components, Server Actions, PPR) |
| React | 19.2.x | UI library (ships with Next.js 16) |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.2.x | Styling (CSS-first config with `@theme` blocks, no `tailwind.config.js`) |

### Backend & Database

| Package | Version | Purpose |
|---------|---------|---------|
| Supabase (PostgreSQL) | Latest | Database + Auth + Storage + Realtime |
| @supabase/supabase-js | 2.98.x | Isomorphic Supabase client |
| @supabase/storage-js | 2.99.x | Supabase Storage client (browser + server-safe helpers) |
| @supabase/ssr | Latest | Server-side auth for Next.js App Router |

### Payments

| Package | Version | Purpose |
|---------|---------|---------|
| stripe | 20.4.x | Server-side Stripe SDK (webhooks, subscription management) |
| @stripe/stripe-js | 8.9.x | Client-side Stripe loader (Embedded Checkout) |
| @stripe/react-stripe-js | 5.6.x | React Stripe components |

### AI

| Package | Version | Purpose |
|---------|---------|---------|
| @anthropic-ai/sdk | 0.78.x | Claude API client (server-side only, never exposed to client) |
| openai | 6.32.x | Optional/experimental OpenAI client (server-side only). Present in repo but not used for branded UX. |

### UI & Animation

| Package | Version | Purpose |
|---------|---------|---------|
| motion | 12.36.x | Shelf transitions, book hover effects, page animations. Import from `motion/react` |
| zustand | 5.0.x | Client-side global state (1.16KB gzipped). Active shelf, filters, sort order |
| sonner | 2.0.x | Toast notifications for success/error feedback |
| next-themes | 0.4.x | System dark mode handling, localStorage persistence, no-flash-on-load |

### Data Processing

| Package | Version | Purpose |
|---------|---------|---------|
| groq-sdk | 1.1.x | GROQ client for querying content stores (used by some enrichment scripts) |
| papaparse | 5.5.x | CSV parsing (Goodreads/StoryGraph import). Web Workers for large files |

### PWA

| Package | Version | Purpose |
|---------|---------|---------|
| @serwist/next | 9.5.x | Service worker, asset caching, install prompts. **Requires `--webpack` flag** (no Turbopack support) |

### Dev Dependencies

| Package | Purpose |
|---------|---------|
| prettier + prettier-plugin-tailwindcss | Code formatting with Tailwind class sorting |
| @types/papaparse | TypeScript types for PapaParse |
| supabase (CLI) | Local development (`supabase start` for local Postgres + Auth) |

### Deferred Packages (install when building those features)

| Package | Version | Purpose | Phase |
|---------|---------|---------|-------|
| html5-qrcode | 2.3.x | Barcode/ISBN scanning (camera-based) | v2 (deferred) |
| tesseract.js | 7.x | OCR text recognition for quote photo capture | v2 (deferred) |

### Critical Version Notes

- `@serwist/next@9.5.x` requires `--webpack` flag for `next dev` and `next build` (no Turbopack support yet)
- `motion@12.35` imports from `motion/react` (rebranded from Framer Motion)
- `zustand@5.0` drops class-based middleware -- use hook-based API only
- Google Books API: 1,000 req/day per API key (not per user). **Caching is mandatory.**
- Open Library API: no hard rate limit but 100 req/5min per IP for cover lookups

### What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| next-pwa | Unmaintained 2+ years | @serwist/next |
| Prisma | Unnecessary ORM layer over Supabase PostgREST, adds cold start overhead | @supabase/supabase-js |
| MongoDB / Mongoose | Wrong fit for relational book data | Supabase PostgreSQL |
| Redux Toolkit | Overkill for this app's state needs | zustand |
| Chakra UI / Material UI | Fights with Tailwind, blocks custom theme control | Tailwind CSS + custom components |
| Three.js (initially) | Too heavy for launch; CSS 3D transforms sufficient for <100 visible books | CSS 3D transforms (upgrade path later) |
| Goodreads API | Deprecated, no longer issuing API keys | CSV import via PapaParse |

---

## 4. Architecture

### System Diagram

```
+-----------------------------------------------------------------------+
|                         CLIENT LAYER                                    |
|  +---------------+  +---------------+  +---------------+  +----------+ |
|  |  Shelf View   |  |  Book Detail  |  |  Discover     |  |  Profile | |
|  |  (CSS 3D)     |  |  (Overlay)    |  |  (AI Mood)    |  |  (Public)| |
|  +-------+-------+  +-------+-------+  +-------+-------+  +-----+---+ |
|          |                  |                  |                  |     |
|  +-------+------------------+------------------+------------------+--+ |
|  |                    Shared Client State (zustand)                   | |
|  +-----------------------------------+-------------------------------+ |
+--------------------------------------+--------------------------------+
                                       |
+--------------------------------------+--------------------------------+
|                         SERVER LAYER (Next.js)                         |
|  +---------------+  +---------------+  +---------------+  +----------+ |
|  | Server        |  | Server        |  | Route         |  | Middle-  | |
|  | Components    |  | Actions       |  | Handlers      |  | ware     | |
|  | (SSR pages)   |  | (Mutations)   |  | (Webhooks)    |  | (Auth)   | |
|  +-------+-------+  +-------+-------+  +-------+-------+  +-----+---+ |
+----------+------------------+------------------+---------------+------+
           |                  |                  |               |
+----------+------------------+------------------+---------------+------+
|                         SERVICE LAYER (lib/)                           |
|  +----------+  +----------+  +----------+  +----------+  +----------+ |
|  | Book     |  | AI       |  | Stripe   |  | Image    |  | Import   | |
|  | Service  |  | Service  |  | Service  |  | Service  |  | Service  | |
|  | (APIs)   |  | (Claude) |  | (Billing)|  | (OG/Img) |  | (CSV)    | |
|  +----------+  +----------+  +----------+  +----------+  +----------+ |
+-----------------------------------------------------------------------+
           |                  |                  |
+-----------------------------------------------------------------------+
|                         DATA LAYER                                     |
|  +-----------------------+  +--------------+  +-----------------------+ |
|  | Supabase PostgreSQL   |  | Supabase     |  | Supabase Auth         | |
|  | (RLS-protected)       |  | Storage      |  | (Email + Google)      | |
|  +-----------------------+  +--------------+  +-----------------------+ |
+-----------------------------------------------------------------------+

External Services:
  Google Books API ---+
  Open Library API ---+---> Book Service (merge + deduplicate)
  Claude API ---------+---> AI Service (recommendations + mood discovery)
  Stripe -------------+---> Stripe Service (checkout + webhooks)
```

### Architectural Patterns

**1. Server Components by Default, Client Islands for Interactivity**

Every page starts as a Server Component. Only components needing browser APIs, state, or event handlers get `"use client"`. The shelf renderer, barcode scanner, theme switcher, and rating inputs are Client Components. The public profile page, book detail data fetching, and settings page structure are Server Components.

**2. Server Actions for Mutations, Route Handlers for External APIs**

All user-initiated data changes (add book, update rating, change status, reorder shelf) use Server Actions. Route Handlers reserved for:
- Stripe webhooks (external caller, not your React app)
- AI recommendation endpoints (POST-only, non-cacheable)
- Book search proxy (cacheable GET for deduplication/caching layer)

**3. RLS-First Security**

All Supabase queries through browser/server client go through Row Level Security. The `books` table has public SELECT policies. User-scoped tables (`user_books`, `quotes`, `shelves`) restrict all operations to `auth.uid() = user_id`. The service role client (`supabase-admin`) is used exclusively for webhook handlers.

**4. Theme System via CSS Custom Properties**

Each theme defines CSS custom properties (background, shelf texture, text colors, accent, book treatment). Switching themes changes CSS variables on a wrapper div. The entire page transforms -- not just the shelf. System dark mode is independent (affects app chrome, not shelf themes).

**5. Dual-API Book Resolution with ISBN Deduplication**

Search queries Google Books API and Open Library API in parallel. Results merged using ISBN13 as primary key (fallback: ISBN10, then title+author fuzzy match). Higher-quality cover picked from whichever API provides one. Resolved book records cached in `books` table.

---

## 5. Project Structure

```
src/
├── app/
│   ├── (auth)/                        # Auth route group (minimal layout)
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── layout.tsx
│   ├── (main)/                        # Main app (authenticated)
│   │   ├── shelf/
│   │   │   ├── page.tsx               # Primary shelf view
│   │   │   └── [id]/page.tsx          # Specific shelf (Plus)
│   │   ├── discover/page.tsx          # Explore + mood-based discovery
│   │   ├── search/page.tsx            # Book search + barcode scan
│   │   ├── settings/
│   │   │   ├── page.tsx               # Settings hub
│   │   │   └── import/page.tsx        # CSV import tools
│   │   ├── pricing/page.tsx
│   │   └── layout.tsx                 # App shell (nav, theme provider)
│   ├── (public)/                      # Public routes (no auth required)
│   │   └── [username]/
│   │       ├── page.tsx               # Public profile (Server Component, SSR)
│   │       └── opengraph-image.tsx    # Dynamic OG image for profile
│   ├── api/
│   │   ├── webhooks/
│   │   │   └── stripe/route.ts        # Stripe webhook handler
│   │   ├── ai/
│   │   │   ├── recommend/route.ts     # Passive recommendations
│   │   │   └── discover/route.ts      # Mood-based discovery
│   │   └── books/
│   │       └── search/route.ts        # Book API proxy (caching layer)
│   ├── layout.tsx                     # Root layout (fonts, metadata, PWA)
│   ├── page.tsx                       # Landing page
│   ├── manifest.ts                    # PWA manifest
│   ├── opengraph-image.tsx            # Default site-wide OG image
│   └── globals.css                    # Tailwind directives + theme CSS vars
├── components/
│   ├── shelf/
│   │   ├── Bookshelf.tsx              # Main 3D shelf renderer (container)
│   │   ├── ShelfRow.tsx               # Single shelf row (horizontal scroll mobile)
│   │   ├── BookSpine.tsx              # Individual book on shelf (CSS 3D)
│   │   ├── CurrentlyReading.tsx       # Easel/stand display
│   │   └── ShelfSorter.tsx            # Sort controls
│   ├── book/
│   │   ├── BookDetailOverlay.tsx      # Bottom sheet (mobile) / modal (desktop)
│   │   ├── BookSearch.tsx             # Search input + results
│   │   ├── RatingInput.tsx            # Quarter-star rating component
│   │   └── TagPicker.tsx              # Trope, mood, content warning tags
│   ├── quote/
│   │   ├── QuoteCapture.tsx           # Manual quote input
│   │   ├── QuoteCard.tsx              # Themed quote share image
│   │   └── QuoteList.tsx              # Quotes for a book
│   ├── theme/
│   │   ├── ThemeProvider.tsx          # Theme context + CSS variable injection
│   │   ├── ThemeSelector.tsx          # Theme picker with live preview
│   │   └── themes.ts                 # Theme definitions
│   ├── profile/
│   │   ├── PublicProfile.tsx          # Immersive public shelf view
│   │   ├── ProfileHeader.tsx          # Photo, name, bio, reading goal
│   │   └── ReadingStreak.tsx          # Flame icon + counter
│   ├── import/
│   │   ├── CSVImporter.tsx            # File upload + progress
│   │   └── ImportPreview.tsx          # Book list review before confirm
│   ├── subscription/
│   │   ├── PricingCards.tsx           # Plan comparison
│   │   └── UpgradeNudge.tsx           # Inline upgrade prompt
│   └── ui/
│       ├── BottomSheet.tsx            # Mobile bottom sheet
│       ├── Modal.tsx                  # Desktop modal
│       └── Button.tsx                 # Themed button variants
├── lib/
│   ├── supabase/
│   │   ├── client.ts                  # Browser client (createBrowserClient)
│   │   ├── server.ts                  # Server client (createServerClient)
│   │   └── admin.ts                   # Service role client (webhooks only)
│   ├── stripe/
│   │   ├── client.ts                  # Stripe SDK initialization
│   │   ├── webhooks.ts                # Webhook event handlers
│   │   └── plans.ts                   # Plan/price definitions
│   ├── books/
│   │   ├── google-books.ts            # Google Books API client
│   │   ├── open-library.ts            # Open Library API client
│   │   ├── merge.ts                   # Deduplicate + merge by ISBN
│   │   └── types.ts                   # Unified book type definitions
│   ├── ai/
│   │   ├── recommendations.ts         # Claude API for passive recs
│   │   ├── mood-discovery.ts          # Claude API for mood-based search
│   │   └── prompts.ts                 # Prompt templates
│   ├── import/
│   │   ├── goodreads.ts               # Goodreads CSV parser + field mapper
│   │   └── storygraph.ts              # StoryGraph CSV parser + field mapper
│   └── utils/
│       ├── rate-limit.ts              # Rate limiting for AI/API calls
│       ├── image-gen.ts               # OG image + quote card helpers
│       └── validators.ts              # Zod schemas for data validation
├── hooks/
│   ├── useShelf.ts                    # Shelf data fetching + mutations
│   ├── useBooks.ts                    # Book search + detail
│   ├── useTheme.ts                    # Theme switching
│   ├── useSubscription.ts             # Subscription status + gating
│   └── useMediaQuery.ts               # Responsive breakpoint detection
├── types/
│   ├── database.ts                    # Auto-generated: npx supabase gen types
│   ├── books.ts                       # Book, UserBook, Shelf types
│   └── stripe.ts                      # Subscription tier types
├── middleware.ts                       # Auth token refresh + route protection
└── public/
    ├── sw.js                          # Service worker (PWA)
    ├── icon-192x192.png               # PWA icon
    ├── icon-512x512.png               # PWA icon
    └── textures/                      # Shelf/theme background textures
        ├── dark-academia-wall.jpg
        ├── botanical-pattern.jpg
        ├── vintage-library.jpg
        └── pastel-gradient.jpg
```

---

## 6. Database Schema

### CRITICAL: Work/Edition Separation

The data model MUST separate Works (the abstract book) from Editions (specific ISBN/format). A single intellectual work like "The Great Gatsby" has dozens of ISBNs across editions. User relationships are stored against Works, not Editions. This prevents duplicate shelf entries, broken deduplication, and an extremely costly data migration later. This is the single most important architectural decision in the data model.

### Tables

#### `users`

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  username TEXT UNIQUE,
  display_name TEXT,
  bio TEXT CHECK (char_length(bio) <= 160),
  profile_photo_url TEXT,
  banner_image_url TEXT,
  featured_book_id UUID REFERENCES works(id),
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
```

#### `works` (the abstract book)

```sql
CREATE TABLE works (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  open_library_work_id TEXT UNIQUE,         -- e.g. /works/OL45883W
  canonical_title TEXT NOT NULL,
  canonical_author TEXT NOT NULL,
  primary_cover_url TEXT,
  genres TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_works_title ON works (canonical_title);
CREATE INDEX idx_works_author ON works (canonical_author);
CREATE INDEX idx_works_ol_id ON works (open_library_work_id);
```

#### `editions` (specific ISBN/format)

```sql
CREATE TABLE editions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  work_id UUID NOT NULL REFERENCES works(id) ON DELETE CASCADE,
  isbn TEXT,
  isbn13 TEXT,
  google_books_id TEXT,
  open_library_edition_id TEXT,
  title TEXT NOT NULL,                      -- edition-specific title
  author TEXT NOT NULL,
  cover_image_url TEXT,
  publication_year INTEGER,
  publisher TEXT,
  page_count INTEGER,
  format TEXT CHECK (format IN ('hardcover', 'paperback', 'ebook', 'audiobook')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_editions_work_id ON editions (work_id);
CREATE INDEX idx_editions_isbn13 ON editions (isbn13);
CREATE INDEX idx_editions_isbn ON editions (isbn);
CREATE INDEX idx_editions_google_id ON editions (google_books_id);
```

#### `shelves`

```sql
CREATE TABLE shelves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'My Shelf',
  is_public BOOLEAN NOT NULL DEFAULT TRUE,
  theme TEXT NOT NULL DEFAULT 'minimalist'
    CHECK (theme IN ('minimalist', 'dark_academia', 'botanical', 'pastel', 'vintage_library')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_shelves_user_id ON shelves (user_id);
```

#### `user_books` (junction: user's relationship to a Work)

```sql
CREATE TABLE user_books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  work_id UUID NOT NULL REFERENCES works(id),
  edition_id UUID REFERENCES editions(id),       -- optional: which edition they own
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
  custom_cover_url TEXT,                         -- user-uploaded cover override
  custom_sort_position INTEGER,
  date_added TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  date_read DATE,
  date_status_changed TIMESTAMPTZ,
  UNIQUE (user_id, work_id, shelf_id)
);

CREATE INDEX idx_user_books_user_shelf ON user_books (user_id, shelf_id);
CREATE INDEX idx_user_books_work ON user_books (work_id);
CREATE INDEX idx_user_books_status ON user_books (user_id, reading_status);
```

#### `quotes`

```sql
CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  work_id UUID NOT NULL REFERENCES works(id),
  text TEXT NOT NULL,
  source_type TEXT NOT NULL DEFAULT 'typed' CHECK (source_type IN ('typed', 'photo_ocr')),
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_quotes_user_work ON quotes (user_id, work_id);
```

#### `book_tags` (tropes, moods, content warnings)

```sql
CREATE TABLE book_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  work_id UUID NOT NULL REFERENCES works(id),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tag_type TEXT NOT NULL CHECK (tag_type IN ('trope', 'mood', 'content_warning')),
  tag_value TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (work_id, user_id, tag_type, tag_value)
);

CREATE INDEX idx_book_tags_work ON book_tags (work_id, tag_type);
CREATE INDEX idx_book_tags_user ON book_tags (user_id);
```

#### `reading_goals`

```sql
CREATE TABLE reading_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  target INTEGER NOT NULL,
  current_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, year)
);
```

#### `ai_recommendations_cache`

```sql
CREATE TABLE ai_recommendations_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recommendation_type TEXT NOT NULL CHECK (recommendation_type IN ('passive', 'mood_based')),
  mood_prompt TEXT,
  recommended_books JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_ai_cache_user ON ai_recommendations_cache (user_id, recommendation_type);
CREATE INDEX idx_ai_cache_expiry ON ai_recommendations_cache (expires_at);
```

#### `stripe_webhook_events` (idempotency)

```sql
CREATE TABLE stripe_webhook_events (
  id TEXT PRIMARY KEY,                           -- Stripe event ID (evt_xxx)
  event_type TEXT NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## 7. Authentication & Authorization

### Auth Provider

Supabase Auth with two methods:
- **Email + password** (with email verification)
- **Google OAuth** (primary social login)

### Middleware

`middleware.ts` runs on every request:
1. Reads auth token from cookies
2. Refreshes expired tokens via `supabase.auth.getUser()`
3. Sets refreshed cookies on response
4. Protects `(main)` routes -- redirects unauthenticated users to `/login`
5. Allows `(public)` and `(auth)` routes without authentication

### Row Level Security Policies

```sql
-- Users: can read own data, update own data
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
-- Public profiles readable by anyone
CREATE POLICY "Public profiles readable" ON users FOR SELECT USING (TRUE);

-- Works & Editions: public read (book metadata is shared)
ALTER TABLE works ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Works are public" ON works FOR SELECT USING (TRUE);
CREATE POLICY "Authenticated users can insert works" ON works FOR INSERT WITH CHECK (auth.role() = 'authenticated');

ALTER TABLE editions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Editions are public" ON editions FOR SELECT USING (TRUE);
CREATE POLICY "Authenticated users can insert editions" ON editions FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Shelves: owner CRUD, public read if is_public
ALTER TABLE shelves ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Shelves owner full access" ON shelves FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public shelves readable" ON shelves FOR SELECT USING (is_public = TRUE);

-- User Books: owner only
ALTER TABLE user_books ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User books owner access" ON user_books FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public shelf books readable" ON user_books FOR SELECT
  USING (EXISTS (SELECT 1 FROM shelves WHERE shelves.id = user_books.shelf_id AND shelves.is_public = TRUE));

-- Quotes: owner CRUD, public read if is_public
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Quotes owner access" ON quotes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public quotes readable" ON quotes FOR SELECT USING (is_public = TRUE);

-- Book Tags: owner write, public read
ALTER TABLE book_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tags owner write" ON book_tags FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Tags public read" ON book_tags FOR SELECT USING (TRUE);

-- Reading Goals: owner only
ALTER TABLE reading_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Goals owner access" ON reading_goals FOR ALL USING (auth.uid() = user_id);

-- AI Cache: owner only
ALTER TABLE ai_recommendations_cache ENABLE ROW LEVEL SECURITY;
CREATE POLICY "AI cache owner access" ON ai_recommendations_cache FOR ALL USING (auth.uid() = user_id);
```

### Subscription Gating

- `useSubscription` hook reads `user.subscription_tier` from the user's session
- Returns `{ isPlusUser: boolean, tier: 'free' | 'plus' }`
- Components use this to show/hide Plus features or display upgrade nudges
- Server Actions validate subscription tier before allowing Plus-only operations

---

## 8. Routes & Pages

| Route | Page | Auth Required | Server/Client | Description |
|-------|------|---------------|---------------|-------------|
| `/` | Landing Page | No | Server | Interactive demo shelf, features, pricing, CTA |
| `/signup` | Sign Up | No | Server | Account creation (email + Google OAuth) |
| `/login` | Login | No | Server | Authentication |
| `/shelf` | My Shelf | Yes | Client (3D) | User's primary shelf view |
| `/shelf/[id]` | Specific Shelf | Yes (Plus) | Client | View/edit a specific shelf |
| `/discover` | Discover | Yes | Client | Explore page + mood-based AI discovery |
| `/search` | Book Search | Yes | Client | Search + add books |
| `/settings` | Settings | Yes | Server | Profile, account, subscription management |
| `/settings/import` | Import Tools | Yes | Client | CSV upload (Goodreads/StoryGraph) |
| `/pricing` | Pricing | Partial | Server | Plans page, auth required to subscribe |
| `/[username]` | Public Profile | No | Server (SSR) | Immersive themed public shelf |

---

## 9. Feature Specifications

### 9.1 The 3D Bookshelf (Core Product)

**Visual:**
- Realistic 3D bookshelf with books standing upright, front covers facing outward
- Not a grid of thumbnails -- a bookshelf you'd want in your home
- CSS 3D transforms (`perspective`, `rotateY`, `translateZ`, `preserve-3d`)

**Layout by Device:**
- **Mobile (320-768px):** Horizontal swipe per shelf row, 3-4 books visible per row. Each row is a shelf rail.
- **Desktop (1025px+):** Full bookcase view -- all books visible, multiple rows, vertical scroll only for very large collections.
- **Tablet (769-1024px):** Hybrid -- wider rows, 5-6 books visible.

**Currently Reading:**
- Displayed on small book stands/easels at the top shelf row
- Slightly larger and pulled forward visually
- Supports multiple simultaneous currently-reading books

**Interactions:**
- **Tap a book** → Detail overlay (bottom sheet mobile, centered modal desktop). Shelf stays visible but dimmed.
- **Sort:** Date added, title, author, rating, status
- **Custom order:** Long-press and drag to rearrange. Persists until a sort option is chosen.
- **Scaling:** Must look stunning with 1 book, 10, 50, 200. Sparse shelves feel curated, full shelves feel impressive.

**Performance Requirements:**
- 2D grid as default rendering path; 3D layered on top as progressive enhancement
- Cap visible 3D books at 8-12 per viewport
- Use `will-change: transform` on interaction only, remove after animation
- Books off-screen rendered as flat 2D elements, promoted to 3D only when scrolled into view
- Test on $150 Android phone (Samsung Galaxy A15) as performance baseline
- Chrome DevTools Layers panel: stay under 30 compositing layers

**Component Composition:**
```
<Bookshelf>        (container + layout + theme application)
  <ShelfRow>       (horizontal row, touch scroll on mobile)
    <BookSpine>    (individual book, CSS 3D transform)
    <BookSpine>
    ...
  </ShelfRow>
  <ShelfRow>
    ...
  </ShelfRow>
</Bookshelf>
```

This composition enables a future Three.js upgrade by swapping `BookSpine` and `ShelfRow` without changing data flow.

### 9.2 Book Search & Data

**Search Flow:**
1. User types in search bar (debounce 300ms)
2. `GET /api/books/search?q=...`
3. Check Supabase cache (`works`/`editions` tables by title/ISBN)
4. Cache hit → return cached results
5. Cache miss → parallel fetch Google Books + Open Library
6. Merge + deduplicate by ISBN13 (fallback: ISBN10, then title+author)
7. Pick higher-quality cover from whichever API
8. Insert into `works`/`editions` tables (cache)
9. Return merged results

**Cover Quality Fallback Chain:**
1. Google Books (zoom=3, high-res) → if 404...
2. Open Library (L size) → if unavailable...
3. Google Books (zoom=1, thumbnail) → if unavailable...
4. Open Library (M size) → if unavailable...
5. Generated themed placeholder (title + author in theme-appropriate typography on color-matched background)

**User Cover Upload:**
- Users can upload custom cover to Supabase Storage
- Overrides API cover for that specific user_book
- Max 2MB, JPEG/PNG only (validate magic bytes, not just extension)

### 9.3 Book Detail Overlay

Triggered by tapping a book on the shelf.

**Mobile:** Bottom sheet that slides up from the bottom (60% screen height, draggable to full).
**Desktop:** Centered modal with backdrop blur.

**Contents:**
- Full cover image
- Title, author, publication year
- **Reading status** (editable): Read, Currently Reading, Want to Read, DNF
- **Quarter-star rating** (0.25 increments, 20 possible scores)
- **Sub-ratings (Plus only):** Plot, Characters, Writing Style, Enjoyment -- collapsible, hidden by default
- **Content warnings:** Community-submitted tags behind a "Show content warnings" toggle
- **Trope & mood tags:** User-applied tags
- **Spice level:** 1-5 pepper icons
- **Quotes section:** Saved quotes for this book
- **"Get this book" affiliate link** (Bookshop.org primary, Amazon secondary)
- **Book notes (Plus only):** Personal notes textarea
- Remove from shelf option

### 9.4 Quote Capture & Sharing

**Saving Quotes:**
- Typed manual input (v1)
- OCR from book photo (v2 -- deferred, uses Tesseract.js)
- Quotes stored per book per user

**Themed Quote Cards:**
Each theme generates a unique visual card:
| Theme | Card Style |
|-------|-----------|
| Minimalist | Clean black text on white |
| Dark Academia | Aged parchment with serif typography |
| Botanical | Cream card with leaf border |
| Pastel | Soft gradient with rounded edges |
| Vintage Library | Sepia-toned with brass frame detail |

- Free users: Reedr branding on cards
- Plus users: Clean version without watermark
- Export as high-res image for Instagram/TikTok

### 9.5 Content Warnings & Tags

**Content Warnings:**
- Community-submitted per work
- Users prompted subtly to add warnings when marking a book as "Read"
- Shown on book detail behind "Show content warnings" toggle (opt-in)
- Standardized categories: violence, sexual content, mental health, substance abuse, death, etc.
- Feed into AI recommendations (AI avoids recommending flagged content)

**Trope Tags:**
- Predefined list: enemies-to-lovers, slow burn, friends-to-lovers, grumpy x sunshine, fake dating, found family, second chance, forced proximity, etc.
- Users can add custom tropes

**Mood Tags:**
- Predefined: dark, cozy, funny, emotional, twisty, hopeful, heartbreaking, etc.
- Filterable on user's own shelf ("show me all my slow burn books")
- Feed the AI discovery engine

**Spice Level:**
- 1-5 pepper scale (romance-specific)
- Displayed as pepper icons

### 9.6 CSV Import

**Goodreads CSV Format:**
- Key columns: Title, Author (Last, First → reformat to First Last), ISBN/ISBN13 (strip `=""` wrapping), My Rating (0-5 whole stars), Exclusive Shelf, Date Read
- Status mapping: `read` → Read, `currently-reading` → Currently Reading, `to-read` → Want to Read, no DNF equivalent → Want to Read

**StoryGraph CSV Format:**
- Key columns: Title, Authors (First Last), ISBN/UID, Star Rating (quarter-star float), Read Status, Tags, Moods
- Status mapping: `read` → Read, `currently-reading` → Currently Reading, `to-read` → Want to Read, `did-not-finish` → DNF
- Preserve quarter-star ratings, mood tags, trope tags

**Import UX Flow:**
1. User selects platform (auto-detect from column headers)
2. File upload (PapaParse with Web Workers for large files)
3. Loading indicator during parse
4. Results: "[X] books found. [Y] matched with covers."
5. Scrollable list with covers, titles, statuses -- user can deselect any
6. "Add to my shelf" to confirm
7. Unmatched books shown separately for manual add later

**Matching Waterfall:**
ISBN13 → ISBN10 → Title+Author exact → Title+Author fuzzy → manual review queue

**Requirements:**
- Make every field optional (a book with only Title + Author must import)
- Handle missing ISBNs, Unicode titles (manga, Arabic), multi-line reviews with embedded commas
- Process asynchronously with progress streaming
- Support 5,000 book limit with clear messaging
- Test with real 1,000+ book exports (not just 50-book test files)

### 9.7 Public Profiles

**URL:** `reedr.co/username`

**Fully immersive** -- the theme IS the page. Dark Academia = entire page has stone wall + candlelight. No app UI chrome visible to visitors.

**Profile Contents:**
- Profile photo, display name, bio integrated into the environment
- Currently reading books on easels/stands at top
- Full shelf below (interactive -- visitors can tap books)
- Reading goal progress: "[Username] has read 34 of 50 books in 2026"
- Reading streak (if enabled): subtle flame icon + count

**For Non-Users Visiting:**
- Full interactive shelf experience, zero restrictions
- Small "Build your own shelf" button in the corner
- No pop-ups, no gates, no interruptions. The product sells itself.

**OG Image Generation:**
- Dynamic `opengraph-image.tsx` at `app/(public)/[username]/`
- 1200x630 image showing book covers in a grid with theme colors
- `export const revalidate = 86400` (24-hour ISR)
- Title: "[Username]'s Shelf | Reedr"
- Description: "Where readers curate, display, and discover."

### 9.8 AI Discovery (Invisible)

AI is invisible infrastructure. No mention of AI anywhere in UI or marketing. The brand never says "AI-powered." The shelf is smart, not robotic.

**Passive Recommendations:**
- Section on shelf page: "You might love" / "Based on your shelf"
- 3-4 book cover suggestions
- Implementation: user's books + tags + ratings → Claude API → JSON → cached
- Always filter against user's existing library (never recommend a book already on their shelf)

**Mood-Based Discovery (Discover Page):**
- Text input: "Describe what you're in the mood for..."
- Returns 5-8 book covers with mood-appropriate styling
- Results tappable to see details and add to shelf

**Rate Limits:**
- Free: 3 AI requests/month
- Plus: Unlimited
- Clear but non-shaming messaging when limit reached

**Cost Management:**
- Claude API ~$0.005-0.01 per request
- Prompt engineering: short system prompts, structured JSON output, limit response to 5 titles + one-line reasons
- Cache by user preference cluster (users with similar reading patterns share cached results)
- Pre-compute popular recommendations in nightly batch job (top 500 books)

**Explore Page:**
- Trending books this week/month (from user shelf data -- most-added books)
- Popular by genre
- New releases (from book APIs)
- Auto-curated lists: "BookTok favorites," "Underrated gems," "Best debuts of 2026"
- Fully algorithmic -- no manual editorial curation
- Every displayed book has an affiliate link opportunity

### 9.9 Monetization

**Free Tier (Generous):**
- Unlimited books on one shelf
- Minimalist theme
- Book search
- Reading statuses, quarter-star rating
- Content warnings (view + submit)
- Trope & mood tags
- Quote saving (unlimited), sharing (with Reedr branding)
- Public profile at reedr.co/username
- 3 AI requests/month
- Shelf image export with Reedr branding
- PWA installable

**Reedr Plus:**
- $2.99/month or $24.99/year
- Early adopter: $12.49/year (first 60-90 days, locked forever)
- Annual billing is the default selected option

**Plus Features:**
- All 5 themes + early access to new themes
- Unlimited shelves with dropdown picker (each with own theme)
- Sub-ratings (Plot, Characters, Writing, Enjoyment)
- Reading streak tracker
- Book notes
- Unlimited AI requests
- High-res shelf/quote export without watermark
- Full annual Wrapped (when available)

**Stripe Implementation:**
- Embedded Checkout (stays on your domain)
- Webhook handler with idempotency table (store processed event IDs)
- Webhook signature verification on every request (`stripe.webhooks.constructEvent()`)
- Handle events: `customer.subscription.created`, `.updated`, `.deleted`, `invoice.payment_succeeded`, `invoice.payment_failed`
- Sync subscription state to `users.subscription_tier`
- Daily reconciliation job comparing Stripe state to database
- Handle `cancel_at_period_end` correctly (don't revoke immediately)

**Affiliate Links:**
- Bookshop.org (10% commission) -- primary, brand-aligned
- Amazon (4.5%) -- secondary
- Prominent on recommended/discovered books, subtle on already-shelved books

### 9.10 Shelf Image Export

- High-res screenshot of user's themed shelf
- Designed for Instagram stories and posts
- Free: Reedr branding watermark (viral branding)
- Plus: Clean version without watermark
- Server-side or client-side image generation of the shelf view

### 9.11 PWA

- Installable from browser via "Add to Home Screen"
- Opens full-screen, no browser chrome, custom app icon
- No offline support -- requires internet
- **Critical:** Never rely on client-side storage as source of truth (iOS purges after 7 days of inactivity). All data must sync to Supabase immediately. Treat localStorage as cache only.

### 9.12 Re-engagement Email

- Single email after 30+ days of inactivity: "Your shelf misses you" with a preview of their shelf
- One email, then silence. Never pushy. Never follow up.
- Transactional emails only: subscription confirmations, new theme drops (when applicable)

---

## 10. API Integrations

### Google Books API

| Detail | Value |
|--------|-------|
| Base URL | `https://www.googleapis.com/books/v1/volumes` |
| Auth | API Key (query param `key=`) |
| Rate Limit | 1,000 req/day per API key (can request increase) |
| Cover trick | Replace `zoom=1` with `zoom=3` in thumbnail URL for higher res (may 404) |
| Caching | Mandatory -- one API call per unique ISBN, serve from DB thereafter |
| Env var | `GOOGLE_BOOKS_API_KEY` |

### Open Library API

| Detail | Value |
|--------|-------|
| Search URL | `https://openlibrary.org/search.json?q=` |
| Works URL | `https://openlibrary.org/works/{id}.json` |
| Covers URL | `https://covers.openlibrary.org/b/isbn/{isbn}-L.jpg` |
| Auth | None (send User-Agent header for 3 req/s instead of 1) |
| Cover rate limit | 100 req/5min per IP |
| Key feature | Works API groups editions under canonical works -- use for deduplication |

### Claude API (Anthropic)

| Detail | Value |
|--------|-------|
| Package | `@anthropic-ai/sdk` |
| Usage | Server-side only (Server Actions / Route Handlers) |
| Cost | ~$0.005-0.01 per request |
| Model | Start with `claude-3-haiku` for cost efficiency; evaluate Sonnet for quality |
| Env var | `ANTHROPIC_API_KEY` |
| Key rule | Never expose API key to client. Never brand as "AI-powered" in UI. |

### Stripe

| Detail | Value |
|--------|-------|
| Checkout | Embedded Checkout (stays on domain) |
| Webhooks | POST to `/api/webhooks/stripe` with signature verification |
| Key events | `customer.subscription.created`, `.updated`, `.deleted`, `invoice.payment_succeeded`, `invoice.payment_failed` |
| Env vars | `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` |
| Reference | Follow Vercel's `nextjs-subscription-payments` template |

---

## 11. Theme System

### How It Works

Each theme defines a set of CSS custom properties. Switching themes changes the variables on a wrapper div. The entire page transforms.

### Theme Definitions

```typescript
export const themes = {
  minimalist: {
    '--shelf-bg': '#FAF6F1',
    '--shelf-surface': '#FFFFFF',
    '--shelf-wood': 'none',
    '--text-primary': '#3D2B1F',
    '--text-secondary': '#8B7355',
    '--accent': '#C9A96E',
    '--book-filter': 'none',
    '--ambient-light': '0deg',
  },
  dark_academia: {
    '--shelf-bg': '#1a1410',
    '--shelf-surface': '#2d2418',
    '--shelf-wood': 'url(/textures/dark-oak.jpg)',
    '--text-primary': '#e8dcc8',
    '--text-secondary': '#b8a88c',
    '--accent': '#C9A96E',
    '--book-filter': 'sepia(0.15) brightness(0.9)',
    '--ambient-light': '35deg',
  },
  botanical: {
    '--shelf-bg': '#f0ebe2',
    '--shelf-surface': '#d4c9b0',
    '--shelf-wood': 'url(/textures/botanical-pattern.jpg)',
    '--text-primary': '#2d3a2d',
    '--text-secondary': '#5a6b5a',
    '--accent': '#6b8e6b',
    '--book-filter': 'brightness(1.02) saturate(1.1)',
    '--ambient-light': '90deg',
  },
  pastel: {
    '--shelf-bg': '#fdf0f5',
    '--shelf-surface': '#f5e6ed',
    '--shelf-wood': 'none',
    '--text-primary': '#4a3040',
    '--text-secondary': '#8a7080',
    '--accent': '#d4a0b0',
    '--book-filter': 'brightness(1.05) saturate(0.95)',
    '--ambient-light': '180deg',
  },
  vintage_library: {
    '--shelf-bg': '#1c1810',
    '--shelf-surface': '#2a2218',
    '--shelf-wood': 'url(/textures/vintage-library.jpg)',
    '--text-primary': '#d4c4a0',
    '--text-secondary': '#a09070',
    '--accent': '#b8860b',
    '--book-filter': 'sepia(0.25) brightness(0.85)',
    '--ambient-light': '45deg',
  },
};
```

### Theme vs Dark Mode

- **Shelf themes:** Control the shelf, public profile, quote cards. Independent of system settings.
- **System dark mode:** Controls app chrome only (nav, settings, search overlays, modals). Respects system preference via `next-themes`. Does NOT affect shelf themes.

### Theme Preview (Conversion Trigger)

- Free users can tap a locked theme
- Theme fully applies to their shelf temporarily
- Non-intrusive CTA appears at bottom: "Keep this look -- upgrade to Plus for $2.99/mo"
- One tap takes them to Stripe Checkout
- Must look beautiful enough to create genuine "I want that" moment

---

## 12. Brand & Design System

### Colors -- Warm Parchment Palette

| Token | Value | Usage |
|-------|-------|-------|
| Primary Background | `#FAF6F1` (Cream) | Page backgrounds, surfaces |
| Secondary Surface | `#EDE4D8` (Warm stone) | Cards, elevated surfaces |
| Text Primary | `#3D2B1F` (Dark brown) | Headings, body text |
| Text Secondary | `#8B7355` (Warm brown) | Muted text, labels |
| Accent | `#C9A96E` (Muted gold) | CTAs, highlights, logo on dark |
| Borders | `#D4C4A8` (Soft tan) | Borders, dividers, disabled states |

### Typography

| Usage | Font | Notes |
|-------|------|-------|
| Headings | Playfair Display or Lora | Serif, premium reading feel |
| Body / Buttons / Nav | Inter or DM Sans | Sans-serif, clean readability |

### Logo

- **Font:** Bodoni Moda, all caps, wide letter-spacing (~8px)
- **Light backgrounds:** Dark brown (#3D2B1F)
- **Dark backgrounds:** Muted gold (#C9A96E)
- Purely typographic. Favicon: single "R" in same style.
- Logo badge on all shared shelves (branding, same for all tiers)

### Responsive Breakpoints

| Breakpoint | Range | Notes |
|------------|-------|-------|
| Mobile | 320px - 768px | Primary target. Horizontal swipe shelves. |
| Tablet | 769px - 1024px | Hybrid layout. Wider rows. |
| Desktop | 1025px+ | Full bookcase view. Most visually impressive. |

---

## 13. Performance Requirements

### Page Load

| Metric | Target |
|--------|--------|
| LCP (Largest Contentful Paint) | < 2.5s on 3G |
| FID (First Input Delay) | < 100ms |
| CLS (Cumulative Layout Shift) | < 0.1 |
| TTI (Time to Interactive) | < 3.5s on 3G |

### Shelf Rendering

| Metric | Target |
|--------|--------|
| Frame rate during scroll | 60fps on iPhone, 30fps+ on $150 Android |
| Max GPU compositing layers | < 30 total |
| Max visible 3D books per viewport | 8-12 |
| Book cover image size | 300x450px (consistent, resized server-side) |

### API Response Times

| Endpoint | Target |
|----------|--------|
| Book search | < 500ms (cache hit), < 2s (cache miss) |
| Add book to shelf | < 300ms |
| Theme switch | < 100ms (CSS variables, no network) |
| AI recommendation | < 3s (cache miss), < 200ms (cache hit) |
| Public profile load | < 1.5s (SSR) |

### Bundle Size Budgets

| Chunk | Budget |
|-------|--------|
| Initial JS | < 150KB gzipped |
| Shelf renderer | < 50KB gzipped |
| Per-route chunks | < 30KB gzipped each |
| Total CSS | < 30KB gzipped |

---

## 14. Security Requirements

| Area | Requirement |
|------|-------------|
| API Keys | All API keys (Google Books, Claude, Stripe) server-side only. Never in client bundle. Proxy through Route Handlers/Server Actions. |
| Image Uploads | Validate file type (JPEG/PNG only, check magic bytes not just extension). Max 2MB. Scan dimensions. |
| Stripe Webhooks | Always verify `Stripe-Signature` header via `stripe.webhooks.constructEvent()`. Reject requests with invalid/missing signatures. |
| AI Rate Limiting | Per-user rate limit (3/month free, unlimited Plus). Per-IP rate limit. Cost circuit breaker: disable AI if daily spend exceeds threshold. |
| RLS | Enabled on ALL tables. Users can only read/write their own data. `books`/`works`/`editions` tables are public read. Service role client used ONLY in webhook handlers. |
| XSS | Sanitize all user-generated content (notes, quotes, bio) before rendering. Use plain text or safe Markdown renderer. |
| CSRF | Server Actions handle CSRF automatically (Next.js built-in). Route Handlers for webhooks verify external signatures. |
| Input Validation | Zod schemas on every Server Action input. Never trust client-side data. |
| Supabase Storage | Signed upload URLs for direct client uploads. CDN caching enabled on storage buckets. |

---

## 15. Phased Delivery Roadmap

### Phase 1: Foundation (7 requirements)
**Goal:** Users can create accounts, log in, and see an authenticated app shell with Minimalist theme, dark mode, and PWA installability.

**Requirements:** AUTH-01 through AUTH-04, SHELF-04, SHELF-12, GROWTH-02

**Deliverables:**
- Next.js project scaffolding with Tailwind CSS 4.2
- Supabase project setup with full database schema (Work/Edition model)
- RLS policies on all tables
- Auth flows (email + Google OAuth) with session persistence
- App shell layout with Minimalist theme system (CSS custom properties)
- System dark mode (app chrome only)
- PWA manifest + service worker

**Success Criteria:**
1. User can sign up with email/password and Google, staying logged in across sessions
2. User can log out from any page
3. App shell renders with Minimalist theme applied
4. System dark mode affects app chrome independent of shelf theme
5. App is installable as PWA on iOS and Android

---

### Phase 2: Core Shelf (15 requirements)
**Goal:** Users can search for books, add them to a 3D CSS bookshelf, and manage reading with statuses and ratings.

**Requirements:** BOOK-01 through BOOK-06, SHELF-01 through SHELF-03, SHELF-07 through SHELF-09, SHELF-13, META-01, META-02

**Deliverables:**
- Book search service (dual-API merge, ISBN dedup, caching)
- Book data layer (works + editions tables populated from API)
- 3D CSS shelf renderer with 2D fallback
- Responsive layouts (swipe rows mobile, full bookcase desktop)
- Book detail overlay (bottom sheet mobile, modal desktop)
- Reading status management + quarter-star rating component
- Sort options + drag-and-drop ordering
- Currently reading easel display
- Custom cover upload

**Success Criteria:**
1. Search returns merged Google Books + Open Library results with no duplicates
2. One-tap add puts a book on a 3D CSS shelf with cover facing out
3. Shelf displays as swipe rows on mobile, bookcase on desktop, with 2D fallback
4. User can set status, rate with quarter-stars, and see "Currently Reading" on easels
5. Sort and drag-and-drop ordering persists across sessions

---

### Phase 3: Book Enrichment (12 requirements)
**Goal:** Users can enrich books with tags/CW/spice, set reading goals, and import from Goodreads/StoryGraph.

**Requirements:** META-03 through META-08, IMPORT-01 through IMPORT-06

**Deliverables:**
- Tag system (tropes, moods, spice level) UI and data layer
- Content warning submission and display (opt-in toggle)
- Reading goal tracking with progress display
- CSV import engine (Goodreads + StoryGraph parsing, matching waterfall, progress UI)

**Success Criteria:**
1. User can add trope/mood tags and spice level, displayed on book detail
2. Content warnings viewable behind opt-in toggle, user can submit their own
3. Annual reading goal with live progress tracking
4. Goodreads CSV import preserves ratings, statuses, dates -- handles missing ISBNs
5. StoryGraph import preserves quarter-star ratings, moods, tags with progress UI

---

### Phase 4: Social & Sharing (9 requirements)
**Goal:** Users share their reading identity through immersive public profiles, quote cards, and shelf exports.

**Requirements:** SOCIAL-01 through SOCIAL-09

**Deliverables:**
- Public profile pages (SSR, themed rendering, username routing)
- Dynamic OG image generation (1200x630, ISR 24h)
- Quote capture (typed input), themed card generation
- Shelf image export (branded free, clean Plus)
- Quote image export (branded free, clean Plus)

**Success Criteria:**
1. Public profile at reedr.co/username renders as fully immersive themed page
2. Non-users can view profiles without sign-up gates
3. Shared links display auto-generated OG images on social platforms
4. User can save quotes, generate themed shareable cards
5. Shelf image export with Reedr branding on free tier

---

### Phase 5: Monetization (13 requirements)
**Goal:** Users subscribe to Plus via Stripe, unlocking premium themes, multiple shelves, sub-ratings, notes, and streaks.

**Requirements:** PAY-01 through PAY-06, SHELF-05, SHELF-06, SHELF-10, SHELF-11, META-09, META-10, META-11

**Deliverables:**
- Stripe Embedded Checkout integration
- Webhook handler with idempotency table + signature verification
- Subscription sync to Supabase (daily reconciliation job)
- Feature gating via RLS + `useSubscription` hook
- 4 premium themes (Dark Academia, Botanical, Pastel, Vintage Library)
- Theme preview with inline upgrade nudge
- Multiple shelves with dropdown picker (Plus)
- Sub-ratings, private notes, reading streaks (Plus)
- Affiliate links (Bookshop.org + Amazon) on book detail pages

**Success Criteria:**
1. Stripe checkout works ($2.99/mo, $24.99/yr, $12.49/yr early adopter) with reliable webhook sync
2. Free users can preview locked themes with inline upgrade CTA
3. Plus users can create multiple shelves with different themes
4. Plus features (sub-ratings, notes, streaks) gated correctly
5. Affiliate links appear on book detail pages

---

### Phase 6: AI & Discovery (6 requirements)
**Goal:** Users discover books through invisible AI recommendations and algorithmic Explore page.

**Requirements:** AI-01 through AI-06

**Deliverables:**
- Claude API integration with prompt engineering and response caching
- Passive "Based on your shelf" recommendation UI
- Mood-based discovery input and results UI
- Rate limiting (3/month free, unlimited Plus)
- Explore page (trending, BookTok, new releases, auto-curated lists)

**Success Criteria:**
1. Passive recommendations with zero AI branding visible
2. Mood-based discovery via natural language input
3. Explore page with auto-curated lists (no manual editorial)
4. Rate limiting enforced: 3/month free, unlimited Plus

---

### Phase 7: Growth & Polish (2 requirements)
**Goal:** Interactive landing page demo and re-engagement email.

**Requirements:** GROWTH-01, GROWTH-03

**Deliverables:**
- Landing page with interactive 3D demo shelf (pre-populated, explorable without signup)
- Re-engagement email system (30-day trigger, once-then-silence)

**Success Criteria:**
1. Landing page demo shelf is interactive without signup
2. Inactive users get one email after 30+ days, then never again

---

## 16. Critical Pitfalls & Mitigations

### 1. ISBN Identity Crisis (CRITICAL -- Phase 1)

**Problem:** A single book has dozens of ISBNs across editions. Building around ISBN as primary identifier leads to duplicate shelf entries and broken deduplication.

**Mitigation:** Work/Edition entity separation in the data model from day one. Use Open Library Works API for canonical grouping. Store user relationships to Works, not Editions. Cost to fix retroactively: 2-3 weeks + data quality issues.

### 2. CSS 3D Mobile Performance (Phase 2)

**Problem:** Each 3D-transformed book creates a separate GPU compositing layer. 20+ layers on mid-range Android causes stutter.

**Mitigation:** 2D grid as default, 3D as progressive enhancement. Cap at 8-12 visible 3D books. Test on $150 Android phone. Stay under 30 compositing layers in Chrome DevTools.

### 3. AI Cost Spiral (Phase 6)

**Problem:** At $0.005-0.01 per request with unlimited free access, AI costs consume 17-33% of revenue at scale.

**Mitigation:** Hard cap free tier at 3/month. Cache by user preference cluster. Pre-compute popular recs nightly. Revenue must be live (Phase 5) before AI ships.

### 4. Stripe Webhook Desync (Phase 5)

**Problem:** Missed or double-processed webhooks create ghost subscribers or free Plus access.

**Mitigation:** Idempotency table storing processed event IDs. Signature verification on every request. Daily reconciliation job. Handle `cancel_at_period_end` correctly.

### 5. Goodreads CSV Import on Real Data (Phase 3)

**Problem:** Power readers with 2,000+ books surface missing ISBNs, Unicode titles, multi-line reviews with embedded commas.

**Mitigation:** PapaParse for robust parsing. Make every field optional. Matching waterfall (ISBN13 → ISBN10 → Title+Author → fuzzy → manual review). Show progress with partial results. Test with real 1,000+ book exports.

### 6. Cover Image Quality (Phase 2)

**Problem:** Google Books thumbnails are 128px. Open Library covers vary wildly. 30% of books have no cover.

**Mitigation:** Cover fallback chain (Google zoom=3 → OL Large → Google zoom=1 → OL Medium → generated placeholder). Cache in Supabase Storage. Allow user upload override. Target 80%+ of books with 300x450px covers.

### 7. iOS PWA Data Loss (Phase 1)

**Problem:** iOS purges all script-writable storage after 7 days of inactivity. Offline data silently lost.

**Mitigation:** Server-first architecture. All data syncs to Supabase immediately. Treat localStorage as cache only. Never store critical data client-side only.

### 8. Supabase Free Tier Pausing (Phase 1)

**Problem:** After 7 days of database inactivity, Supabase free tier pauses the project. App goes completely offline.

**Mitigation:** Cron job pinging database every 6 days. Budget for Supabase Pro ($25/month) before launch. Free tier is for development only, not production.

---

## 17. Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...     # Server-side only, webhooks

# Google Books
GOOGLE_BOOKS_API_KEY=AIza...                 # Server-side only

# Claude / Anthropic
ANTHROPIC_API_KEY=sk-ant-...                 # Server-side only

# Stripe
STRIPE_SECRET_KEY=sk_live_...                # Server-side only
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...              # Server-side only

# App
NEXT_PUBLIC_APP_URL=https://reedr.co         # For OG images, redirect URLs
```

**Security:** All `NEXT_PUBLIC_` prefixed variables are exposed to the client. Everything else is server-only. Never prefix API keys or secrets with `NEXT_PUBLIC_`.

---

## 18. Development Setup

### Prerequisites

- Node.js 20+
- npm or pnpm
- Supabase CLI (`npm install -g supabase`)
- Stripe CLI (for webhook testing)

### Initial Setup

```bash
# Create Next.js project
npx create-next-app@latest reedr --typescript --tailwind --eslint --app --src-dir

# Install dependencies
npm install @supabase/supabase-js @supabase/ssr
npm install stripe @stripe/stripe-js @stripe/react-stripe-js
npm install @anthropic-ai/sdk
npm install motion zustand sonner next-themes
npm install papaparse
npm install @serwist/next @serwist/precaching @serwist/sw

# Dev dependencies
npm install -D prettier prettier-plugin-tailwindcss @types/papaparse supabase

# Start local Supabase
supabase init
supabase start

# Run dev server (note: --webpack flag required for Serwist)
npm run dev
```

### Local Development

```bash
# Supabase local dashboard
supabase start    # → http://localhost:54323

# Stripe webhook forwarding
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Generate Supabase types after schema changes
npx supabase gen types typescript --local > src/types/database.ts
```

---

## 19. Scaling Plan

| Scale | Architecture Adjustments |
|-------|--------------------------|
| **0-1K users** | Supabase free tier sufficient (but set up keepalive cron). Single Vercel deployment. Google Books 1,000/day limit is fine with caching. |
| **1K-10K users** | Upgrade to Supabase Pro ($25/mo). Request Google Books API quota increase (free form). AI costs ~$50-150/mo. Add database indexes on hot queries. |
| **10K-100K users** | Consider Vercel KV for hot book search caching. Pre-generate OG images to Supabase Storage. Stripe webhook processing may need queue. |
| **100K+ users** | Read replicas, CDN for textures/covers. Move AI to batch processing. Unlikely to need before significant revenue. |

### First Three Bottlenecks (in order)

1. **Google Books API rate limit** (1,000/day): Fix with aggressive caching in `works`/`editions` tables + quota increase request.
2. **AI API costs**: Fix with caching, rate limiting, premium gating, batch pre-computation.
3. **OG image generation compute**: Fix with ISR (24h revalidation) + pre-generate to Storage at scale.

---

## 20. Success Metrics

### Launch (First 30 Days)

| Metric | Target |
|--------|--------|
| User sign-ups | 200-500 |
| Users who add 5+ books | 50%+ |
| Users who share shelf link | 30%+ |
| Onboarding completion rate | 60%+ |

### 3 Months

| Metric | Target |
|--------|--------|
| Free users | 2,000 |
| Paying users | 100 (5% conversion) |
| MRR | $228 |

### 12 Months

| Metric | Target |
|--------|--------|
| Free users | 25,000 |
| Paying users | 1,250 |
| MRR | $2,850+ |
| Additional revenue | Affiliate commissions + publisher partnerships |

---

## 21. Out of Scope

These features are explicitly excluded from v1 and should not be built:

| Feature | Reason |
|---------|--------|
| Social feed / timeline | Display product, not a social network |
| Book clubs / forums | Fable's lane, requires moderation infrastructure |
| Long-form text reviews | Sub-ratings + tags + quotes replace paragraphs |
| Reading session timer | Tracker territory (StoryGraph/Bookly) |
| Discussion forums / comments | Requires moderation, solo founder can't sustain |
| E-reader / in-app reading | Completely different product |
| Kindle/Libby sync | No public APIs, technical debt trap |
| Gamification (badges/leaderboards) | Misaligns with aesthetic-first, no-shame philosophy |
| Push notifications | Intrusive for a shelf display app |
| Detailed stats dashboard | StoryGraph's core competency |
| Author pages / interaction | Opens door to review manipulation |
| Native mobile app | Web-first with PWA |
| Full WebGL shelf rendering | CSS 3D first, upgrade path later |
| Apple Sign In | When native app ships |
| Bookshelf photo scanning (AI vision) | v1.1 -- second viral moment |

### Deferred to v2

| Feature | Why Deferred |
|---------|-------------|
| 3-step onboarding flow | Build after core features are stable |
| Soft account deletion (30-day grace) | Nice-to-have, not critical for launch |
| Barcode scanning | Good for "haul" content but not launch-critical |
| Reading progress (page/percentage) | Simple tracking, add after core is solid |
| Format tracking (physical/ebook/audiobook) | Low complexity, just not phase 1 priority |
| OCR photo quote capture | Complex ML, typed quotes prove value first |
| Annual Wrapped | Needs 12 months of tracked data |

---

## Appendix: Key Data Flows

### Adding a Book to Shelf

```
User taps "+" on search result
  → Client Component calls Server Action: addBookToShelf()
    → Zod validation
    → Check if Work exists in DB (by ISBN/title+author)
      → If not: create Work + Edition from search result data
    → Insert into user_books (user_id, work_id, shelf_id, status)
    → revalidatePath('/shelf')
  → Shelf re-renders with new book appearing (animation via motion)
```

### Stripe Subscription Flow

```
User clicks "Upgrade to Plus"
  → Server Action: createCheckoutSession()
    → Creates Stripe Checkout Session
    → Returns checkout URL
  → Client redirects to Stripe Embedded Checkout
  → User pays
  → Stripe fires webhook → POST /api/webhooks/stripe
    → Verify Stripe-Signature header
    → Check idempotency table (skip if already processed)
    → Parse event (customer.subscription.created)
    → Supabase admin client: UPDATE users SET subscription_tier = 'plus'
    → Insert event ID into stripe_webhook_events
  → Next request: middleware reads updated user → Plus features unlocked
```

### Public Profile SSR

```
Visitor hits reedr.co/username
  → Next.js middleware: no auth required (public route)
  → Server Component: fetch user + shelf + books from Supabase
  → generateMetadata: title, description, OG tags
  → opengraph-image.tsx: render shelf preview as 1200x630 PNG (ISR 24h)
  → Render PublicProfile client component with server-fetched data
  → Hydrate: interactive shelf (swipe, tap books)
```

---

*This document contains everything needed to build Reedr v1. All technical decisions, data models, API integrations, and feature specifications are final and approved. Questions or clarification requests should be directed to Melusi Ndoro.*
