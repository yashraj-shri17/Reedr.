# Reedr

"Letterboxd for books, but you control the aesthetic."

Reedr is a mobile-first responsive web app where readers curate, display, and discover books through visually stunning 3D digital bookshelves. Users build realistic shelves with themed environments, share their reading identity via public profile links, and discover books through an invisible AI-powered engine.

## 🚀 Key Features

- **3D Digital Bookshelves**: Realistic 3D shelf rendering with horizontal swipe on mobile and full bookcase view on desktop.
- **Themed Environments**: Choose from Minimalist, Dark Academia, Botanical, Pastel, and Vintage Library.
- **AI-Powered Discovery**: Mood-based book recommendations powered by Claude.
- **Public Profiles**: Share your reading identity with an immersive public URL.
- **Smart Data Integration**: Combined results from Google Books and Open Library for highest quality metadata and covers.
- **Interactive Ratings**: Quarter-star ratings with sub-ratings for Plot, Characters, Writing Style, and Enjoyment.
- **Quote Sharing**: Captures and displays beautiful themed quote cards.
- **CSV Imports**: Import your existing library from Goodreads or StoryGraph.
- **PWA Ready**: Installable on mobile devices for a native-like experience.

## 🛠 Tech Stack

- **Framework**: Next.js 16.1.x (App Router, Server Components, Server Actions)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4.2.x (CSS-first configuration)
- **Database & Auth**: Supabase (PostgreSQL, RLS)
- **Payments**: Stripe (Subscriptions)
- **AI**: Anthropic Claude API
- **State Management**: Zustand 5.0.x
- **Animation**: Motion (formerly Framer Motion)
- **PWA**: Serwist

## 📦 Project Structure

```
src/
├── app/
│   ├── (auth)/        # Login/Signup routes
│   ├── (main)/        # Authenticated app (Shelf, Discover, Search, Settings)
│   ├── (public)/      # Public profiles (username/page.tsx)
│   └── api/           # Backend routes (Webhooks, AI, Books)
├── components/        # React components (Shelf, Book, Quote, UI, etc.)
├── hooks/             # Custom React hooks (useShelf, useTheme, etc.)
├── lib/               # Service layer (Supabase, Stripe, Claude, Books)
├── types/             # TypeScript definitions
└── public/            # Static assets and PWA service worker
```

## 🛠 Development Setup

### Prerequisites

- Node.js 20+
- npm or pnpm
- Supabase CLI

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/reedr.git
   cd reedr
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   GOOGLE_BOOKS_API_KEY=your_google_books_key
   ANTHROPIC_API_KEY=your_anthropic_key
   STRIPE_SECRET_KEY=your_stripe_secret
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable
   STRIPE_WEBHOOK_SECRET=your_webhook_secret
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```
   *Note: Serwist requires the `--webpack` flag which is included in the dev script.*

## 📄 License

This project is proprietary. All rights reserved.

---
**Author**: Melusi Ndoro
**Version**: 1.0 (2026-03-16)
