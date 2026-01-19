# SkiNB Documentation

> Reference documentation for the SkiNB Ski Rental Platform

---

## Quick Links

| Document | Description |
|----------|-------------|
| [Architecture](./ARCHITECTURE.md) | System architecture, data flow, and tech stack |
| [Database Schema](./DATABASE.md) | Tables, relationships, RLS policies, and types |
| [API Reference](./API.md) | Supabase client utilities and server functions |
| [Components](./COMPONENTS.md) | Reusable UI component library |
| [Authentication](./AUTHENTICATION.md) | Auth flows, session management, and protected routes |
| [Routes](./ROUTES.md) | App routes, API endpoints, and middleware |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth |
| **Hosting** | Netlify |
| **Styling** | Tailwind CSS v4 |
| **Storage** | Supabase Storage (gear bucket) |

---

## Project Structure

```
app/                    # Next.js App Router pages
├── auth/               # Authentication routes
├── rentals/            # Rental CRUD routes
├── profile/            # User dashboard
components/             # Reusable UI components
lib/                    # Supabase clients & utilities
├── supabase.js         # Browser client
├── supabase-server.js  # Server client
├── database.types.ts   # TypeScript types
public/                 # Static assets
styles/                 # Global CSS
docs/                   # This documentation
```

---

## Environment Variables

Required in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## Development

```bash
# Always use Netlify CLI for local development
netlify dev

# Build for production
npm run build

# Run linter
npm run lint
```

> ⚠️ Never use `npm run dev` directly. Always use `netlify dev` to ensure Edge Functions and environment variables work correctly.
