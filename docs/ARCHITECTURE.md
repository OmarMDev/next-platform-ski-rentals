# Architecture

> System architecture and data flow for SkiNB

---

## Overview

SkiNB is a peer-to-peer ski equipment rental marketplace. Users can browse listings, renters can post their gear, and admins have moderation capabilities.

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client (Browser)                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │ React (CSR) │  │  Auth State │  │ Supabase Browser Client │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Netlify Edge Network                       │
│  ┌─────────────────┐  ┌─────────────┐  ┌────────────────────┐  │
│  │ Edge Functions  │  │  Image CDN  │  │  Static Assets     │  │
│  └─────────────────┘  └─────────────┘  └────────────────────┘  │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Next.js Server (SSR)                         │
│  ┌─────────────────┐  ┌─────────────┐  ┌────────────────────┐  │
│  │ Server Comps    │  │  Middleware │  │ Supabase SSR Client│  │
│  │ (RSC)           │  │             │  │                    │  │
│  └─────────────────┘  └─────────────┘  └────────────────────┘  │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Supabase                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │  PostgreSQL │  │    Auth     │  │   Storage (gear bucket) │ │
│  │  (Database) │  │             │  │                         │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## User Roles

| Role | Capabilities |
|------|--------------|
| **Guest** | Browse rentals, view details |
| **User** | Guest + create account, view profile |
| **Renter** | User + create/edit/delete own listings |
| **Admin** | Renter + delete any listing, manage users |

Role hierarchy: `admin > renter > user > guest`

---

## Data Flow

### 1. Page Load (Server-Side)

```
Browser Request
      │
      ▼
┌─────────────────┐
│   Middleware    │──▶ Add security headers, logging
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Server Comp    │──▶ createServerSupabase()
│  (RSC)          │──▶ Fetch data with cookies
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   HTML + RSC    │──▶ Stream to browser
│   Payload       │
└─────────────────┘
```

### 2. Client Interactions

```
User Action (e.g., Delete Rental)
      │
      ▼
┌─────────────────┐
│ Client Comp     │──▶ supabase.from('rentals').delete()
│ ('use client')  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Supabase      │──▶ RLS Policy Check
│   (Direct)      │──▶ Execute if authorized
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   router.refresh│──▶ Revalidate Server Components
└─────────────────┘
```

### 3. Authentication Flow

```
Login Form Submit
      │
      ▼
┌─────────────────┐
│  signInWith     │──▶ Supabase Auth
│  Password()     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Set Cookies    │──▶ Session stored in HTTP-only cookies
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Redirect       │──▶ /profile or callback URL
└─────────────────┘
```

---

## Key Design Decisions

### 1. Server Components by Default

All pages use React Server Components for:
- Direct database access without API layer
- Smaller client bundle
- SEO-friendly HTML

### 2. Row Level Security (RLS)

All authorization is enforced at the database level:
- Users can only modify their own data
- Admins have override policies
- No server-side auth checks needed (RLS handles it)

### 3. Cookie-Based Sessions

Using `@supabase/ssr` for:
- Automatic cookie management
- Server component compatibility
- Secure session handling

### 4. Netlify for Hosting

Provides:
- Edge Functions for geo-based features
- Image CDN optimization
- Automatic HTTPS and deployments

---

## File Organization

```
lib/
├── supabase.js           # Browser client (CSR components)
├── supabase-server.js    # Server client (RSC, middleware)
└── database.types.ts     # Auto-generated TypeScript types

components/
├── auth-button.jsx       # Client: Login/Logout toggle
├── rental-card.jsx       # Server-compatible: Rental display
├── delete-button.jsx     # Client: Delete with confirmation
├── edit-button.jsx       # Server: Edit link button
└── ...

app/
├── page.jsx              # SSR: Home page with rental feed
├── auth/
│   ├── login/page.jsx    # Client: Login form
│   ├── signup/page.jsx   # Client: Signup form
│   └── callback/route.js # API: OAuth callback handler
├── rentals/
│   ├── page.jsx          # SSR: All rentals list
│   ├── create/page.jsx   # Client: Create form (protected)
│   └── [id]/
│       ├── page.jsx      # SSR: Rental detail
│       └── edit/page.jsx # Client: Edit form (protected)
└── profile/
    └── page.jsx          # SSR: User dashboard (protected)
```
