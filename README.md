# SkiNB - Ski Rental Marketplace

> A peer-to-peer ski equipment rental platform built with Next.js 16, Supabase, and deployed on Netlify.


## 🎿 Overview

SkiNB is a modern marketplace that connects ski equipment owners with skiers across Europe. Built with the latest web technologies, it demonstrates a full-stack application featuring authentication, database operations, role-based access control, and a clean, minimalist UI.

### Key Features

- **🔐 Authentication** - Secure email/password auth via Supabase with session management
- **📝 Rental Listings** - Create, edit, and delete ski equipment listings
- **👥 Role-Based Access** - User roles (Guest, User, Renter, Admin) with granular permissions
- **🖼️ Image Handling** - Supabase Storage integration with Netlify Image CDN optimization
- **⚡ Real-time Updates** - Dynamic data fetching with Next.js Server Components
- **🎨 Design System** - "Lodge & Luxury" minimalist UI with Tailwind CSS v4
- **🔒 Row-Level Security** - Database-level access control via Supabase RLS policies

---

## 🏗️ Tech Stack

### Frontend
- **Next.js 16** (App Router) - React framework with Server Components
- **React 19** - UI library with React Compiler optimizations
- **Tailwind CSS v4** - Utility-first CSS framework
- **Markdown-to-JSX** - Markdown rendering support

### Backend & Infrastructure
- **Supabase** - PostgreSQL database, authentication, and storage
  - Auth (email/password)
  - PostgreSQL with Row Level Security
  - Storage buckets for images
- **Netlify** - Hosting, Edge Functions, and Image CDN
  - Edge Functions for geo-location rewrites
  - Image optimization via `next/image`
  - Blob Store (demo features)

### Development
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Babel React Compiler Plugin** - Performance optimizations

---

## 📁 Project Structure

```
├── app/                      # Next.js App Router pages
│   ├── layout.jsx           # Root layout with Header/Footer
│   ├── page.jsx             # Home page with rental feed
│   ├── auth/                # Authentication routes
│   │   ├── login/           # Login page
│   │   ├── signup/          # Registration page
│   │   └── callback/        # OAuth callback handler
│   ├── profile/             # User profile management
│   │   ├── page.jsx         # Profile view
│   │   └── actions.js       # Server Actions
│   ├── rentals/             # Rental listings
│   │   ├── page.jsx         # All rentals list
│   │   ├── create/          # Create listing (renter only)
│   │   └── [id]/            # Dynamic rental pages
│   │       ├── page.jsx     # Rental details
│   │       └── edit/        # Edit listing (owner/admin)
│   └── blobs/               # Netlify Blob Store demos
│
├── components/              # Reusable React components
│   ├── header.jsx          # Navigation header with auth state
│   ├── footer.jsx          # Site footer
│   ├── rental-card.jsx     # Rental listing card
│   ├── create-rental-form.jsx
│   ├── edit-rental-form.jsx
│   └── auth-button.jsx     # Login/Logout UI
│
├── lib/                     # Utilities and clients
│   ├── supabase-server.js  # Server-side Supabase client
│   ├── supabase.js         # Browser Supabase client
│   └── database.types.ts   # Generated TypeScript types
│
├── netlify/
│   └── edge-functions/     # Netlify Edge Functions
│       └── rewrite.js      # Geo-based URL rewrites
│
├── docs/                    # Comprehensive documentation
│   ├── DATABASE.md         # Schema reference
│   ├── AUTHENTICATION.md   # Auth flows
│   ├── ROUTES.md           # Route reference
│   ├── ARCHITECTURE.md     # System design
│   └── COMPONENTS.md       # Component docs
│
├── styles/
│   └── globals.css         # Global styles & Tailwind imports
│
├── middleware.js           # Next.js middleware (security headers)
├── next.config.js          # Next.js configuration
├── design-system.json      # Design tokens & UI guidelines
└── utils.js                # Helper functions
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** installed
- **npm** or compatible package manager
- **Netlify CLI** (for local development)
- **Supabase account** (for database and auth)

### Setup Instructions

#### 1. Clone & Install Dependencies

```bash
git clone <repository-url>
cd next-platform-ski-rentals
npm install
```

#### 2. Install Netlify CLI

```bash
npm install netlify-cli@latest -g
```

#### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Run database migrations from `docs/DATABASE.md`
3. Copy your project's API URL and anon key

#### 4. Configure Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### 5. Link to Netlify (Optional)

If deploying to Netlify:

```bash
netlify link
```

#### 6. Run Development Server

**⚠️ Important:** Always use `netlify dev` instead of `npm run dev` to enable Edge Functions, Blob Store, and proper context environment variables.

```bash
netlify dev
```

Visit [http://localhost:8888](http://localhost:8888)

---

## 🗄️ Database Schema

### Tables

#### `profiles`
- Extends Supabase Auth users
- Fields: `id`, `email`, `full_name`, `avatar_url`, `role`
- Roles: `admin`, `renter`, `user`

#### `rentals`
- Ski equipment listings
- Fields: `id`, `title`, `description`, `price`, `image_url`, `owner_id`
- Constraints: `price >= 0`, cascading deletes

### Row Level Security (RLS)

All tables use RLS policies:
- **Public Read** - Anyone can view profiles and rentals
- **Authenticated Write** - Users can update their own profiles
- **Role-Based Actions** - Renters can create listings, admins can delete any listing
- **Owner Permissions** - Users can edit/delete only their own listings

See [docs/DATABASE.md](docs/DATABASE.md) for complete schema.

---

## 🔐 Authentication

### Auth Flow

1. **Sign Up**: User registers → Supabase creates auth record → Trigger creates profile
2. **Login**: Credentials validated → Session cookie set → Redirect to profile
3. **Session Management**: HTTP-only cookies for security and SSR compatibility

### Protected Routes

| Route | Required Role |
|-------|---------------|
| `/profile` | Any authenticated user |
| `/rentals/create` | `renter` or `admin` |
| `/rentals/[id]/edit` | Owner or `admin` |

See [docs/AUTHENTICATION.md](docs/AUTHENTICATION.md) for implementation details.

---

## 🎨 Design System

SkiNB follows a **"Lodge & Luxury - Minimalist Travel UI"** design system:

- **Colors**: Clean whites (#FFFFFF, #F8F8F8) with muted earth tones (Teal #7C9C95)
- **Typography**: Geometric sans-serif (Inter, DM Sans) with strong hierarchy
- **Components**: Pill-shaped buttons, large border radius (24-32px), generous whitespace
- **Imagery**: High-fidelity nature photography

Reference [design-system.json](design-system.json) for complete design tokens.

---

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Next.js dev server (use netlify dev instead)
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

### Key Development Patterns

#### Supabase Server Components

```javascript
import { createServerSupabase, getCurrentUserProfile } from 'lib/supabase-server';

export default async function Page() {
  const supabase = await createServerSupabase();
  const { data } = await supabase.from('rentals').select('*');
  // ...
}
```

#### Server Actions

```javascript
'use server';

import { createServerSupabase } from 'lib/supabase-server';

export async function createRental(formData) {
  const supabase = await createServerSupabase();
  // ...
}
```

#### Dynamic Routes

```javascript
export const dynamic = 'force-dynamic'; // Prevent caching

export default async function RentalPage({ params }) {
  const { id } = await params;
  // Fetch dynamic data...
}
```

---

## 📚 Documentation

Comprehensive documentation available in the `docs/` directory:

- **[DATABASE.md](docs/DATABASE.md)** - Complete schema, RLS policies, and storage buckets
- **[AUTHENTICATION.md](docs/AUTHENTICATION.md)** - Auth flows, session management, and protected routes
- **[ROUTES.md](docs/ROUTES.md)** - All routes, API endpoints, and middleware
- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - System architecture and data flow diagrams
- **[COMPONENTS.md](docs/COMPONENTS.md)** - Reusable component reference

---

## 🌐 Deployment

### Deploy to Netlify

1. Click the "Deploy to Netlify" button above, or:

```bash
netlify deploy --prod
```

2. Set environment variables in Netlify dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. Netlify automatically:
   - Builds with `npm run build`
   - Enables Edge Functions
   - Configures Image CDN
   - Sets up continuous deployment

---

## 🔧 Configuration

### Next.js Config (`next.config.js`)

- **React Compiler**: Enabled for automatic optimizations
- **Redirects**: `/docs` → Netlify docs, `/old-blog/:slug` → `/classics`
- **Rewrites**: `/api/health` → `/quotes/random`, `/blog` → `/classics`
- **Images**: Remote patterns for Supabase Storage and demo images

### Middleware (`middleware.js`)

- Adds security headers (CSP, X-Frame-Options, etc.)
- Custom logging
- Excludes static assets via matcher config

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🔗 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Netlify Next.js Documentation](https://docs.netlify.com/frameworks/next-js/overview/)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [React 19 Documentation](https://react.dev)

---

## 💡 Features Showcase

### Netlify Core Primitives

This application demonstrates both **implicit** and **explicit** usage of Netlify Core Primitives:

**Implicit (Framework Integration):**
- Route Handlers automatically become serverless functions
- `next/image` uses Netlify Image CDN
- Automatic edge caching and optimization

**Explicit (Framework-Agnostic):**
- Edge Functions for geo-location (`netlify/edge-functions/rewrite.js`)
- Blob Store demos (`app/blobs/`)
- Direct access to Netlify context and environment variables

See demo pages:
- `/edge` - Edge Function demonstrations
- `/blobs` - Blob Store operations
- `/image-cdn` - Image optimization examples

---

**Built with ❤️ using Next.js, Supabase, and Netlify**
