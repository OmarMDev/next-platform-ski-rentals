# Sub-Phase 3C: Home Page (Public Feed)

> **Project:** SkiNB - Ski Rental Platform  
> **Sub-Phase:** 3C of 5 - Home Page  
> **Estimated Time:** 30 minutes  
> **Dependencies:** Sub-Phase 3B completed

---

## Files to Modify

```
app/
├── page.jsx                    # EDIT: Replace demo content with rental feed
lib/
├── supabase-server.js          # NEW: Server-side Supabase client helper
```

---

## Step 3C.1: Create Server-Side Supabase Helper

**File:** `lib/supabase-server.js`

This helper creates a Supabase client for Server Components:

```javascript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createServerSupabase() {
  const cookieStore = await cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignore - called from Server Component
          }
        },
      },
    }
  );
}

/**
 * Get current user's profile from the server
 * Returns null if not authenticated
 */
export async function getCurrentUserProfile() {
  const supabase = await createServerSupabase();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, email, full_name, role, avatar_url, created_at')
    .eq('id', user.id)
    .single();
  
  return profile;
}
```

---

## Step 3C.2: Update Home Page

**File:** `app/page.jsx`

Replace the entire file with the rental feed:

```jsx
import Link from 'next/link';
import { createServerSupabase, getCurrentUserProfile } from '@/lib/supabase-server';
import { RentalCard } from '@/components/rental-card';

export const dynamic = 'force-dynamic'; // Always fetch fresh data

export default async function HomePage() {
  const supabase = await createServerSupabase();
  const userProfile = await getCurrentUserProfile();
  
  // Fetch all rentals with owner info
  const { data: rentals, error } = await supabase
    .from('rentals')
    .select(`
      id,
      title,
      description,
      price,
      image_url,
      owner_id,
      created_at,
      owner:profiles!owner_id (
        id,
        email,
        full_name
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching rentals:', error);
  }

  const canCreateListing = userProfile && ['renter', 'admin'].includes(userProfile.role);

  return (
    <main className="py-8">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Ski Gear Rentals in New Brunswick
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Find quality ski and snowboard equipment from local renters. 
          Save money, ski more.
        </p>
        
        {canCreateListing && (
          <Link 
            href="/rentals/create"
            className="inline-block mt-6 px-8 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-900 transition-colors"
          >
            + List Your Gear
          </Link>
        )}
      </section>

      {/* Rentals Grid */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Available Gear</h2>
          <span className="text-gray-400">{rentals?.length || 0} listings</span>
        </div>
        
        {rentals && rentals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {rentals.map((rental) => (
              <RentalCard 
                key={rental.id} 
                rental={rental} 
                userProfile={userProfile}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-800/50 rounded-2xl">
            <div className="text-6xl mb-4">🎿</div>
            <h3 className="text-xl font-semibold mb-2">No Listings Yet</h3>
            <p className="text-gray-400 mb-6">
              Be the first to list your ski gear for rent!
            </p>
            {canCreateListing ? (
              <Link 
                href="/rentals/create"
                className="inline-block px-6 py-3 bg-teal-600 hover:bg-teal-700 rounded-full transition-colors"
              >
                Create First Listing
              </Link>
            ) : (
              <p className="text-sm text-gray-500">
                Sign up as a renter to list gear
              </p>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
```

---

## Step 3C.3: Add Test Data (Optional)

Before testing, you may want to add some test rentals to the database. Use the Supabase MCP tool:

```sql
-- Run via mcp_supabase_execute_sql
-- First, get a user ID from the profiles table to use as owner_id
-- Then insert test rentals:

INSERT INTO public.rentals (title, description, price, image_url, owner_id)
VALUES 
  ('Rossignol Experience 88 Ti', 'High-performance all-mountain skis, 176cm. Great for advanced skiers.', 55.00, 'https://picsum.photos/seed/ski1/400/300', '<YOUR_USER_ID>'),
  ('Burton Custom Snowboard', 'Versatile freestyle board, 158cm. Perfect for park and all-mountain.', 45.00, 'https://picsum.photos/seed/board1/400/300', '<YOUR_USER_ID>'),
  ('Salomon S/Pro 120 Boots', 'Stiff, high-performance ski boots, size 27.5. Great for aggressive skiers.', 35.00, 'https://picsum.photos/seed/boots1/400/300', '<YOUR_USER_ID>');
```

---

## 🧪 Checkpoint CP-3C: Home Page Testing

### Prerequisites
- Sub-Phase 3A & 3B completed
- At least one user exists in database (to use as owner for test data)
- Dev server running with `netlify dev`

### Test Checklist

| # | Test Case | Expected Result | ✅ |
|---|-----------|-----------------|-----|
| 1 | Visit `/` (not logged in) | Home page loads, no "List Your Gear" button | ⬜ |
| 2 | Visit `/` (logged in as user role) | Home page loads, no "List Your Gear" button | ⬜ |
| 3 | Visit `/` (logged in as renter/admin) | "List Your Gear" button visible | ⬜ |
| 4 | With no rentals in DB | Empty state with ski emoji shown | ⬜ |
| 5 | With rentals in DB | Grid of rental cards displayed | ⬜ |
| 6 | Rental cards show correct data | Title, price, owner name visible | ⬜ |
| 7 | Click "View Details" | Navigates to `/rentals/[id]` (404 ok for now) | ⬜ |
| 8 | Delete button visibility (not logged in) | No delete buttons shown | ⬜ |
| 9 | Delete button visibility (admin) | Delete buttons on all cards | ⬜ |
| 10 | Delete button visibility (owner) | Delete button only on own listings | ⬜ |

### How to Test Without Real Data

If you don't have test data yet, the empty state should display correctly. To fully test:

1. Complete Sub-Phase 3D (Create Listing)
2. OR manually insert test data via Supabase dashboard
3. OR use the SQL above via MCP

### Troubleshooting

| Issue | Likely Cause | Fix |
|-------|--------------|-----|
| "Cannot read properties of undefined" | Supabase client not configured | Check `lib/supabase-server.js` exists |
| Rentals not showing | RLS policies blocking read | Check Phase 1 RLS allows SELECT for all |
| Images not loading | Next.js image domain not configured | Add domain to `next.config.js` images |
| Delete button always hidden | userProfile not passed correctly | Check `getCurrentUserProfile()` returns data |

### Image Domain Configuration (if needed)

If using external images, add to `next.config.js`:

```javascript
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
};
```

### ✅ Phase Complete Criteria

Before moving to Sub-Phase 3D, ensure:
- [ ] Home page loads without errors
- [ ] Empty state displays correctly
- [ ] RentalCard components render
- [ ] User role affects button visibility

---

**Previous:** [Sub-Phase 3B: Components](./PHASE_3B_COMPONENTS.md)  
**Next:** [Sub-Phase 3D: Create Listing & Detail View](./PHASE_3D_LISTINGS.md)
