# Sub-Phase 3D: Create Listing & Detail View

> **Project:** SkiNB - Ski Rental Platform  
> **Sub-Phase:** 3D of 5 - Listing CRUD  
> **Estimated Time:** 60 minutes  
> **Dependencies:** Sub-Phase 3C completed

---

## Files to Create

```
app/
├── rentals/
│   ├── create/
│   │   └── page.jsx            # Create listing page (protected)
│   └── [id]/
│       └── page.jsx            # Rental detail view
components/
├── create-rental-form.jsx      # Form component (client)
```

---

## Step 3D.1: Create Rental Form Component

**File:** `components/create-rental-form.jsx`

```jsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { ImageUpload } from './image-upload';

export function CreateRentalForm({ userId }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  
  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!imageFile) {
      setError('Please select an image');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // 1. Upload image to Supabase Storage
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('gear')
        .upload(fileName, imageFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw new Error(`Image upload failed: ${uploadError.message}`);
      }

      // 2. Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('gear')
        .getPublicUrl(fileName);

      // 3. Insert rental record
      const { error: insertError } = await supabase
        .from('rentals')
        .insert({
          title: title.trim(),
          description: description.trim() || null,
          price: parseFloat(price),
          image_url: publicUrl,
          owner_id: userId
        });

      if (insertError) {
        throw new Error(`Failed to create listing: ${insertError.message}`);
      }

      // 4. Success - redirect to home
      router.push('/');
      router.refresh();
      
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-lg">
          {error}
        </div>
      )}
      
      {/* Title */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Title <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Rossignol Experience 88 Ti Skis"
          required
          maxLength={100}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
        <p className="text-sm text-gray-500 mt-1">{title.length}/100 characters</p>
      </div>
      
      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your gear: size, condition, skill level, included accessories..."
          rows={4}
          maxLength={1000}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
        />
        <p className="text-sm text-gray-500 mt-1">{description.length}/1000 characters</p>
      </div>
      
      {/* Price */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Price per Day (CAD) <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            required
            min="0"
            step="0.01"
            className="w-full pl-8 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
      </div>
      
      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Photo <span className="text-red-400">*</span>
        </label>
        <ImageUpload onFileSelect={setImageFile} />
      </div>
      
      {/* Submit */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading || !title || !price || !imageFile}
          className="flex-1 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Creating Listing...' : 'Create Listing'}
        </button>
        
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
```

---

## Step 3D.2: Create Listing Page

**File:** `app/rentals/create/page.jsx`

```jsx
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUserProfile } from '@/lib/supabase-server';
import { CreateRentalForm } from '@/components/create-rental-form';

export const metadata = {
  title: 'List Your Gear | SkiNB',
  description: 'Create a new ski gear rental listing',
};

export default async function CreateRentalPage() {
  const profile = await getCurrentUserProfile();
  
  // Not logged in - redirect to login
  if (!profile) {
    redirect('/auth/login?redirect=/rentals/create');
  }
  
  // Not authorized to create listings
  if (!['renter', 'admin'].includes(profile.role)) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <div className="bg-yellow-500/20 border border-yellow-500 text-yellow-200 p-6 rounded-lg">
          <h1 className="text-2xl font-bold mb-2">Access Restricted</h1>
          <p className="mb-4">
            You need to be a registered renter to list gear. 
            Your current role is: <strong>{profile.role}</strong>
          </p>
          <p className="text-sm text-gray-400">
            Contact us to upgrade your account to renter status.
          </p>
          <Link 
            href="/"
            className="inline-block mt-4 px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-8">
      <div className="mb-8">
        <Link href="/" className="text-teal-400 hover:text-teal-300 transition-colors">
          ← Back to Listings
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-2">List Your Gear</h1>
      <p className="text-gray-400 mb-8">
        Share your ski equipment with other enthusiasts
      </p>
      
      <CreateRentalForm userId={profile.id} />
    </div>
  );
}
```

---

## Step 3D.3: Rental Detail Page

**File:** `app/rentals/[id]/page.jsx`

```jsx
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createServerSupabase, getCurrentUserProfile } from '@/lib/supabase-server';
import { DeleteButton } from '@/components/delete-button';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const supabase = await createServerSupabase();
  
  const { data: rental } = await supabase
    .from('rentals')
    .select('title, description')
    .eq('id', id)
    .single();

  if (!rental) {
    return { title: 'Listing Not Found | SkiNB' };
  }

  return {
    title: `${rental.title} | SkiNB`,
    description: rental.description || `Rent ${rental.title} on SkiNB`,
  };
}

export default async function RentalDetailPage({ params }) {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const userProfile = await getCurrentUserProfile();
  
  const { data: rental, error } = await supabase
    .from('rentals')
    .select(`
      *,
      owner:profiles!owner_id (
        id,
        email,
        full_name,
        avatar_url
      )
    `)
    .eq('id', id)
    .single();

  if (error || !rental) {
    notFound();
  }

  // Build mailto link
  const subject = encodeURIComponent(`Inquiry about: ${rental.title}`);
  const body = encodeURIComponent(
    `Hi${rental.owner.full_name ? ` ${rental.owner.full_name}` : ''},\n\n` +
    `I'm interested in renting "${rental.title}" listed at $${rental.price}/day.\n\n` +
    `Please let me know if it's available and how we can arrange pickup/delivery.\n\n` +
    `Thanks!`
  );
  const mailtoHref = `mailto:${rental.owner.email}?subject=${subject}&body=${body}`;

  // Format date
  const listedDate = new Date(rental.created_at).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="py-8">
      {/* Back link */}
      <Link 
        href="/" 
        className="text-teal-400 hover:text-teal-300 transition-colors inline-block mb-6"
      >
        ← Back to Listings
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image */}
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-800">
          {rental.image_url ? (
            <Image 
              src={rental.image_url} 
              alt={rental.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-8xl">🎿</span>
            </div>
          )}
        </div>
        
        {/* Details */}
        <div>
          <div className="flex justify-between items-start gap-4 mb-4">
            <h1 className="text-3xl font-bold">{rental.title}</h1>
            <DeleteButton 
              rentalId={rental.id}
              userProfile={userProfile}
              ownerId={rental.owner_id}
            />
          </div>
          
          <p className="text-4xl font-bold text-teal-400 mb-6">
            ${rental.price}
            <span className="text-lg text-gray-400 font-normal">/day</span>
          </p>
          
          {rental.description && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-gray-300 whitespace-pre-wrap">{rental.description}</p>
            </div>
          )}
          
          {/* Owner info */}
          <div className="bg-gray-800 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-400 mb-1">Listed by</p>
            <div className="flex items-center gap-3">
              {rental.owner.avatar_url ? (
                <Image
                  src={rental.owner.avatar_url}
                  alt={rental.owner.full_name || 'User'}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                  👤
                </div>
              )}
              <div>
                <p className="font-medium">
                  {rental.owner.full_name || rental.owner.email.split('@')[0]}
                </p>
                <p className="text-sm text-gray-400">
                  Listed on {listedDate}
                </p>
              </div>
            </div>
          </div>
          
          {/* Contact button */}
          <a 
            href={mailtoHref}
            className="block w-full py-4 bg-black text-white text-center rounded-full font-medium hover:bg-gray-900 transition-colors text-lg"
          >
            📧 Contact Owner
          </a>
          
          <p className="text-sm text-gray-500 text-center mt-3">
            Opens your email app with a pre-filled message
          </p>
        </div>
      </div>
    </div>
  );
}
```

---

## Step 3D.4: Not Found Page (Optional)

**File:** `app/rentals/[id]/not-found.jsx`

```jsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="py-16 text-center">
      <div className="text-8xl mb-4">🔍</div>
      <h1 className="text-3xl font-bold mb-2">Listing Not Found</h1>
      <p className="text-gray-400 mb-6">
        This rental listing doesn't exist or has been removed.
      </p>
      <Link 
        href="/"
        className="inline-block px-6 py-3 bg-teal-600 hover:bg-teal-700 rounded-full transition-colors"
      >
        Browse Available Gear
      </Link>
    </div>
  );
}
```

---

## 🧪 Checkpoint CP-3D: Listing CRUD Testing

### Prerequisites
- Sub-Phase 3A, 3B, 3C completed
- User with `renter` or `admin` role exists
- Storage bucket `gear` created (Phase 1)
- Dev server running with `netlify dev`

### Test Checklist - Create Listing

| # | Test Case | Expected Result | ✅ |
|---|-----------|-----------------|-----|
| 1 | Visit `/rentals/create` (not logged in) | Redirect to `/auth/login` | ⬜ |
| 2 | Visit `/rentals/create` (user role) | "Access Restricted" message | ⬜ |
| 3 | Visit `/rentals/create` (renter role) | Form displays correctly | ⬜ |
| 4 | Submit without image | "Please select an image" error | ⬜ |
| 5 | Submit with all fields | Redirects to home, listing visible | ⬜ |
| 6 | Check Supabase Storage | Image uploaded to `gear` bucket | ⬜ |
| 7 | Check Supabase Database | Rental record created with correct `owner_id` | ⬜ |

### Test Checklist - Detail View

| # | Test Case | Expected Result | ✅ |
|---|-----------|-----------------|-----|
| 8 | Visit `/rentals/[valid-id]` | Detail page shows all info | ⬜ |
| 9 | Visit `/rentals/invalid-uuid` | 404 Not Found page | ⬜ |
| 10 | Click "Contact Owner" | Email app opens with pre-filled message | ⬜ |
| 11 | Delete button (owner viewing own) | Button visible, delete works | ⬜ |
| 12 | Delete button (admin viewing any) | Button visible, delete works | ⬜ |
| 13 | Delete button (other user) | Button not visible | ⬜ |

### How to Test Create Flow

```bash
# 1. Log in as a renter/admin user
# 2. Go to /rentals/create
# 3. Fill in:
#    - Title: "Test Skis"
#    - Description: "Great condition, 170cm"
#    - Price: 35
#    - Image: Any image file
# 4. Click "Create Listing"
# 5. Verify redirect to home and listing appears
```

### Troubleshooting

| Issue | Likely Cause | Fix |
|-------|--------------|-----|
| "Image upload failed" | Storage bucket not public | Check Phase 1 storage policy |
| "Row-level security violation" | RLS policy missing INSERT | Check Phase 1 rentals INSERT policy |
| Image not displaying | Next.js image domain | Add `*.supabase.co` to `next.config.js` |
| "User not found" | Profile not created | Check Phase 1 trigger |

### ✅ Phase Complete Criteria

Before moving to Sub-Phase 3E, ensure:
- [ ] Create listing works end-to-end
- [ ] Detail page displays all rental info
- [ ] Delete button respects permissions
- [ ] Images upload and display correctly

---

**Previous:** [Sub-Phase 3C: Home Page](./PHASE_3C_HOME.md)  
**Next:** [Sub-Phase 3E: Profile Dashboard & Navigation](./PHASE_3E_PROFILE.md)
