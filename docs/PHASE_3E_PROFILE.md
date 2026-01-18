# Sub-Phase 3E: Profile Dashboard & Navigation

> **Project:** SkiNB - Ski Rental Platform  
> **Sub-Phase:** 3E of 5 - Profile & Nav  
> **Estimated Time:** 40 minutes  
> **Dependencies:** Sub-Phase 3D completed

---

## Files to Create/Modify

```
app/
├── profile/
│   └── page.jsx                # User dashboard
components/
├── header.jsx                  # EDIT: Update with auth and nav
```

---

## Step 3E.1: Profile Dashboard

**File:** `app/profile/page.jsx`

```jsx
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createServerSupabase, getCurrentUserProfile } from '@/lib/supabase-server';
import { RentalCard } from '@/components/rental-card';

export const metadata = {
  title: 'My Profile | SkiNB',
  description: 'View your profile and manage your listings',
};

export default async function ProfilePage() {
  const profile = await getCurrentUserProfile();
  
  if (!profile) {
    redirect('/auth/login?redirect=/profile');
  }
  
  // Fetch user's own listings (only if renter/admin)
  let myListings = [];
  
  if (['renter', 'admin'].includes(profile.role)) {
    const supabase = await createServerSupabase();
    const { data } = await supabase
      .from('rentals')
      .select('*')
      .eq('owner_id', profile.id)
      .order('created_at', { ascending: false });
    
    myListings = data || [];
  }
  
  // Format member since date
  const memberSince = new Date(profile.created_at).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long'
  });
  
  // Role badge colors
  const roleBadgeColors = {
    admin: 'bg-red-600 text-white',
    renter: 'bg-teal-600 text-white',
    user: 'bg-gray-600 text-white'
  };

  return (
    <div className="py-8">
      {/* Profile Card */}
      <section className="bg-gray-800 rounded-2xl p-6 mb-8">
        <div className="flex items-start justify-between mb-6">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${roleBadgeColors[profile.role]}`}>
            {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
          </span>
        </div>
        
        <div className="grid gap-4">
          <div className="flex items-center gap-4">
            {profile.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt="Profile" 
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center text-2xl">
                👤
              </div>
            )}
            <div>
              <p className="font-semibold text-lg">
                {profile.full_name || 'Name not set'}
              </p>
              <p className="text-gray-400">{profile.email}</p>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Member since</span>
              <p className="font-medium">{memberSince}</p>
            </div>
            <div>
              <span className="text-gray-400">Listings</span>
              <p className="font-medium">{myListings.length}</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* My Listings Section (only for renters/admins) */}
      {['renter', 'admin'].includes(profile.role) && (
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">
              My Listings
            </h2>
            <Link 
              href="/rentals/create" 
              className="px-4 py-2 bg-black text-white rounded-full text-sm hover:bg-gray-900 transition-colors"
            >
              + New Listing
            </Link>
          </div>
          
          {myListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {myListings.map(rental => (
                <RentalCard 
                  key={rental.id} 
                  rental={rental}
                  userProfile={profile}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-800/50 rounded-2xl">
              <div className="text-5xl mb-4">📦</div>
              <h3 className="text-lg font-semibold mb-2">No Listings Yet</h3>
              <p className="text-gray-400 mb-4">
                You haven't listed any gear for rent.
              </p>
              <Link 
                href="/rentals/create" 
                className="inline-block px-6 py-3 bg-teal-600 hover:bg-teal-700 rounded-full transition-colors"
              >
                Create Your First Listing
              </Link>
            </div>
          )}
        </section>
      )}
      
      {/* Message for regular users */}
      {profile.role === 'user' && (
        <section className="text-center py-12 bg-gray-800/50 rounded-2xl">
          <div className="text-5xl mb-4">🎿</div>
          <h3 className="text-lg font-semibold mb-2">Want to Rent Out Your Gear?</h3>
          <p className="text-gray-400 max-w-md mx-auto">
            Become a renter to list your ski and snowboard equipment for others to rent.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Contact us to upgrade your account
          </p>
        </section>
      )}
    </div>
  );
}
```

---

## Step 3E.2: Update Header Navigation

You'll need to modify your existing Header component. The exact implementation depends on your current header structure. Here's a reference:

**File:** `components/header.jsx` (update existing)

Key changes to make:
1. Import and use `AuthButton` component
2. Add navigation links based on user role
3. Make it responsive

```jsx
// Add these imports
import { AuthButton } from './auth-button';
import Link from 'next/link';

// In your header's navigation/right side, add:

// Navigation links
<nav className="hidden md:flex items-center gap-6">
  <Link href="/" className="hover:text-teal-400 transition-colors">
    Browse Gear
  </Link>
  {/* The AuthButton handles login/logout and profile link */}
</nav>

// Auth section
<div className="flex items-center gap-4">
  <AuthButton />
</div>
```

### Complete Header Example (if rebuilding)

```jsx
import Link from 'next/link';
import { AuthButton } from './auth-button';

export function Header() {
  return (
    <header className="border-b border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🎿</span>
            <span className="font-bold text-xl">SkiNB</span>
          </Link>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/" 
              className="text-gray-300 hover:text-white transition-colors"
            >
              Browse
            </Link>
          </nav>
          
          {/* Auth */}
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
```

---

## Step 3E.3: Verify Layout Integration

Make sure your root layout uses the Header correctly.

**File:** `app/layout.jsx` (verify)

```jsx
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import '@/styles/globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
```

---

## 🧪 Checkpoint CP-3E: Profile & Navigation Testing

### Prerequisites
- All previous sub-phases completed
- At least one listing created
- Users with different roles (user, renter, admin)
- Dev server running with `netlify dev`

### Test Checklist - Profile Page

| # | Test Case | Expected Result | ✅ |
|---|-----------|-----------------|-----|
| 1 | Visit `/profile` (not logged in) | Redirect to `/auth/login` | ⬜ |
| 2 | Visit `/profile` (logged in) | Profile page displays user info | ⬜ |
| 3 | Profile shows correct email | Email matches logged in user | ⬜ |
| 4 | Profile shows correct role badge | Admin=red, Renter=teal, User=gray | ⬜ |
| 5 | Profile shows member since date | Formatted date displays | ⬜ |
| 6 | Renter/Admin sees "My Listings" | Section visible with listings grid | ⬜ |
| 7 | User role sees upgrade message | "Want to Rent Out?" message | ⬜ |
| 8 | Click listing card | Navigates to detail page | ⬜ |
| 9 | Delete button on own listing | Works and refreshes list | ⬜ |
| 10 | "New Listing" button | Navigates to create page | ⬜ |

### Test Checklist - Header/Navigation

| # | Test Case | Expected Result | ✅ |
|---|-----------|-----------------|-----|
| 11 | Header shows on all pages | Consistent header across site | ⬜ |
| 12 | Not logged in | "Sign In" and "Sign Up" buttons | ⬜ |
| 13 | Logged in | Email displayed, "Sign Out" button | ⬜ |
| 14 | Click email in header | Navigates to `/profile` | ⬜ |
| 15 | Sign Out button | Logs out, redirects to home | ⬜ |
| 16 | Logo click | Navigates to home | ⬜ |

### Full User Journey Test

Test the complete flow for each user role:

#### Anonymous User
1. ⬜ Visit home → See listings (no delete buttons)
2. ⬜ Click listing → View details
3. ⬜ Click "Contact Owner" → Email opens
4. ⬜ Try `/rentals/create` → Redirected to login
5. ⬜ Try `/profile` → Redirected to login

#### Regular User (role: user)
1. ⬜ Sign up / Log in
2. ⬜ Visit home → See listings (no delete buttons)
3. ⬜ Visit profile → See info, no listings section
4. ⬜ Try `/rentals/create` → "Access Restricted"

#### Renter (role: renter)
1. ⬜ Log in as renter
2. ⬜ Visit home → See "List Your Gear" button
3. ⬜ Create listing → Success, appears on home
4. ⬜ Visit profile → See own listing
5. ⬜ Delete own listing → Works
6. ⬜ View other's listing → No delete button

#### Admin (role: admin)
1. ⬜ Log in as admin
2. ⬜ Visit home → Delete button on all listings
3. ⬜ Create listing → Works
4. ⬜ Delete any listing → Works

### ✅ Phase 3 Complete Criteria

Before moving to Phase 4, ensure:
- [ ] All sub-phase checkpoints passed
- [ ] Full user journey works for all roles
- [ ] No console errors in browser
- [ ] No server errors in terminal
- [ ] Images loading correctly
- [ ] Auth state persists across refresh

---

## Phase 3 Summary

You have now completed:

| Sub-Phase | Description | Status |
|-----------|-------------|--------|
| 3A | Authentication (login, signup, logout) | ⬜ |
| 3B | Reusable Components | ⬜ |
| 3C | Home Page with rental feed | ⬜ |
| 3D | Create Listing & Detail View | ⬜ |
| 3E | Profile Dashboard & Navigation | ⬜ |

---

**Previous:** [Sub-Phase 3D: Listings](./PHASE_3D_LISTINGS.md)  
**Next:** [Phase 4: Admin Override](./PHASE_4_ADMIN.md)
