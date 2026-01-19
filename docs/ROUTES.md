# Routes Reference

> App routes, API endpoints, and middleware

---

## Page Routes

### Public Routes

| Route | File | Description |
|-------|------|-------------|
| `/` | `app/page.jsx` | Home page with rental feed |
| `/rentals` | `app/rentals/page.jsx` | All rentals list |
| `/rentals/[id]` | `app/rentals/[id]/page.jsx` | Rental detail view |
| `/about` | `app/about/page.jsx` | About page |
| `/faq` | `app/faq/page.jsx` | FAQ page |
| `/terms` | `app/terms/page.jsx` | Terms of service |
| `/privacy` | `app/privacy/page.jsx` | Privacy policy |

### Auth Routes

| Route | File | Description |
|-------|------|-------------|
| `/auth/login` | `app/auth/login/page.jsx` | Login page |
| `/auth/signup` | `app/auth/signup/page.jsx` | Registration page |
| `/auth/callback` | `app/auth/callback/route.js` | OAuth callback handler |

### Protected Routes

| Route | File | Required Role | Description |
|-------|------|---------------|-------------|
| `/profile` | `app/profile/page.jsx` | Any auth user | User dashboard |
| `/rentals/create` | `app/rentals/create/page.jsx` | `renter` | Create listing form |
| `/rentals/[id]/edit` | `app/rentals/[id]/edit/page.jsx` | Owner or `admin` | Edit listing form |

---

## API Routes

### `/quotes/random`

Returns a random inspirational quote.

**File:** `app/quotes/random/route.js`

**Method:** `GET`

**Response:**
```json
{
  "text": "The mountains are calling and I must go.",
  "author": "John Muir"
}
```

### `/auth/callback`

Handles OAuth code exchange.

**File:** `app/auth/callback/route.js`

**Method:** `GET`

**Query Parameters:**
| Param | Description |
|-------|-------------|
| `code` | OAuth authorization code |

**Response:** Redirect to `/profile`

---

## Dynamic Routes

### `/rentals/[id]`

Displays a single rental's details.

**Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `id` | `string` | Rental UUID |

**Implementation:**
```jsx
// app/rentals/[id]/page.jsx
export default async function RentalDetailPage({ params }) {
  const { id } = await params;
  
  const supabase = await createServerSupabase();
  const { data: rental } = await supabase
    .from('rentals')
    .select('*, owner:profiles!owner_id(*)')
    .eq('id', id)
    .single();
    
  if (!rental) {
    notFound();
  }
  
  return <RentalDetail rental={rental} />;
}
```

### `/rentals/[id]/edit`

Edit form for a specific rental.

**Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `id` | `string` | Rental UUID |

**Access Control:** Owner or admin only

---

## Middleware

### Root Middleware (`middleware.js`)

Applied to all routes except static assets.

**Features:**
- Security headers (CSP, X-Frame-Options, etc.)
- Request logging
- Request timing

**Matcher Config:**
```javascript
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images/).*)',
  ],
};
```

**Headers Added:**
| Header | Value |
|--------|-------|
| `X-Frame-Options` | `DENY` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `X-Request-Id` | `<uuid>` |

---

## Netlify Rewrites & Redirects

Defined in `next.config.js`:

### Rewrites

| Source | Destination | Description |
|--------|-------------|-------------|
| `/api/health` | `/quotes/random` | Health check endpoint |
| `/blog` | `/classics` | Blog redirect |

### Implementation

```javascript
// next.config.js
export default {
  async rewrites() {
    return [
      {
        source: '/api/health',
        destination: '/quotes/random',
      },
      {
        source: '/blog',
        destination: '/classics',
      },
    ];
  },
};
```

---

## Edge Functions

### Geo-Based Rewrite

**File:** `netlify/edge-functions/rewrite.js`

**Purpose:** Redirects Australian users to country-specific content.

**Implementation:**
```javascript
export default async (request, context) => {
  const country = context.geo?.country?.code;
  
  if (country === 'AU') {
    const url = new URL(request.url);
    url.pathname = '/edge/australia' + url.pathname;
    return Response.redirect(url, 302);
  }
  
  return context.next();
};

export const config = {
  path: '/edge/*',
};
```

---

## Route Metadata

### Static Metadata

```jsx
// app/about/page.jsx
export const metadata = {
  title: 'About | SkiNB',
  description: 'Learn about SkiNB ski rental marketplace',
};
```

### Dynamic Metadata

```jsx
// app/rentals/[id]/page.jsx
export async function generateMetadata({ params }) {
  const { id } = await params;
  const rental = await fetchRental(id);
  
  return {
    title: `${rental.title} | SkiNB`,
    description: rental.description,
    openGraph: {
      images: rental.image_url ? [rental.image_url] : [],
    },
  };
}
```

---

## Route Caching

### Force Dynamic

For pages that need fresh data on every request:

```jsx
export const dynamic = 'force-dynamic';
```

**Used on:**
- `/` (home page)
- `/rentals` (listing page)
- `/profile` (user dashboard)

### Revalidation

For pages with time-based caching:

```jsx
export const revalidate = 60; // Revalidate every 60 seconds
```

---

## Error Handling

### Not Found Pages

**Global:** `app/not-found.jsx`

**Route-specific:** `app/rentals/[id]/not-found.jsx`

```jsx
// app/rentals/[id]/not-found.jsx
export default function RentalNotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold">Rental Not Found</h1>
      <p>The rental you're looking for doesn't exist.</p>
      <Link href="/rentals">Browse all rentals</Link>
    </div>
  );
}
```

### Error Pages

**Global:** `app/error.jsx`

```jsx
'use client';

export default function Error({ error, reset }) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

---

## Route Organization

```
app/
├── page.jsx                    # / (home)
├── layout.jsx                  # Root layout
├── not-found.jsx               # 404 page
├── error.jsx                   # Error boundary
│
├── auth/
│   ├── login/page.jsx          # /auth/login
│   ├── signup/page.jsx         # /auth/signup
│   └── callback/route.js       # /auth/callback (API)
│
├── rentals/
│   ├── page.jsx                # /rentals
│   ├── create/page.jsx         # /rentals/create
│   └── [id]/
│       ├── page.jsx            # /rentals/:id
│       ├── not-found.jsx       # 404 for invalid ID
│       └── edit/page.jsx       # /rentals/:id/edit
│
├── profile/
│   ├── page.jsx                # /profile
│   └── actions.js              # Server actions
│
└── (static)/
    ├── about/page.jsx          # /about
    ├── faq/page.jsx            # /faq
    ├── terms/page.jsx          # /terms
    └── privacy/page.jsx        # /privacy
```
