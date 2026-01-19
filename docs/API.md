# API Reference

> Supabase client utilities and helper functions

---

## Supabase Clients

### Browser Client (`lib/supabase.js`)

For use in Client Components (`'use client'`).

```javascript
import { supabase } from '@/lib/supabase';
```

#### `supabase`

Standard Supabase client for browser-side operations.

```javascript
// Example: Delete a rental
await supabase.from('rentals').delete().eq('id', rentalId);

// Example: Sign out
await supabase.auth.signOut();
```

---

#### `getCurrentUser()`

Get the currently authenticated user.

```javascript
import { getCurrentUser } from '@/lib/supabase';

const user = await getCurrentUser();
// Returns: User | null
```

**Returns:** `Promise<User | null>`

---

#### `getCurrentUserProfile()`

Get the current user's profile with role information.

```javascript
import { getCurrentUserProfile } from '@/lib/supabase';

const profile = await getCurrentUserProfile();
// Returns: { id, email, full_name, role, ... } | null
```

**Returns:** `Promise<Profile | null>`

---

#### `hasRole(requiredRole)`

Check if the current user has a specific role.

```javascript
import { hasRole } from '@/lib/supabase';

const canCreate = await hasRole('renter');  // true if renter or admin
const isAdmin = await hasRole('admin');     // true if admin only
```

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `requiredRole` | `'admin' \| 'renter' \| 'user'` | Role to check against |

**Returns:** `Promise<boolean>`

**Role Hierarchy:**
- `'user'` → Any authenticated user
- `'renter'` → Users with `renter` or `admin` role
- `'admin'` → Only users with `admin` role

---

#### `canDeleteRental(rentalOwnerId)`

Check if current user can delete a specific rental.

```javascript
import { canDeleteRental } from '@/lib/supabase';

const canDelete = await canDeleteRental(rental.owner_id);
```

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `rentalOwnerId` | `string` | UUID of the rental owner |

**Returns:** `Promise<boolean>`

**Logic:**
- Admins can delete any rental
- Renters can delete their own rentals
- Users cannot delete rentals

---

### Server Client (`lib/supabase-server.js`)

For use in Server Components and Route Handlers.

```javascript
import { createServerSupabase, getCurrentUserProfile } from '@/lib/supabase-server';
```

#### `createServerSupabase()`

Create a Supabase client with cookie-based auth for server-side use.

```javascript
const supabase = await createServerSupabase();

const { data } = await supabase.from('rentals').select('*');
```

**Returns:** `Promise<SupabaseClient>`

> ⚠️ Must be called with `await` - uses async cookies API.

---

#### `getCurrentUserProfile()`

Server-side version: Get current user's profile from cookies.

```javascript
import { getCurrentUserProfile } from '@/lib/supabase-server';

export default async function Page() {
  const profile = await getCurrentUserProfile();
  
  if (!profile) {
    redirect('/auth/login');
  }
  
  return <div>Hello, {profile.full_name}</div>;
}
```

**Returns:** `Promise<Profile | null>`

---

## Authentication

### Sign Up

```javascript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    data: {
      full_name: 'John Doe'
    }
  }
});
```

### Sign In

```javascript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});
```

### Sign Out

```javascript
await supabase.auth.signOut();
```

### Get Session

```javascript
const { data: { session } } = await supabase.auth.getSession();
```

### Auth State Listener

```javascript
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    // Handle sign in
  } else if (event === 'SIGNED_OUT') {
    // Handle sign out
  }
});
```

---

## Database Operations

### Select

```javascript
// All rentals
const { data } = await supabase.from('rentals').select('*');

// With related data
const { data } = await supabase
  .from('rentals')
  .select('*, owner:profiles!owner_id(full_name, email)');

// Filtered
const { data } = await supabase
  .from('rentals')
  .select('*')
  .eq('owner_id', userId)
  .order('created_at', { ascending: false });
```

### Insert

```javascript
const { data, error } = await supabase
  .from('rentals')
  .insert({
    title: 'Ski Boots',
    description: 'Size 42, excellent condition',
    price: 25.00,
    owner_id: userId
  })
  .select()
  .single();
```

### Update

```javascript
const { error } = await supabase
  .from('rentals')
  .update({ price: 30.00 })
  .eq('id', rentalId);
```

### Delete

```javascript
const { error } = await supabase
  .from('rentals')
  .delete()
  .eq('id', rentalId);
```

---

## Storage Operations

### Upload Image

```javascript
const { data, error } = await supabase.storage
  .from('gear')
  .upload(`${userId}/${filename}`, file, {
    cacheControl: '3600',
    upsert: false
  });

// Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('gear')
  .getPublicUrl(data.path);
```

### Delete Image

```javascript
const { error } = await supabase.storage
  .from('gear')
  .remove([`${userId}/${filename}`]);
```

---

## Error Handling

All Supabase operations return an `error` object if something goes wrong.

```javascript
const { data, error } = await supabase.from('rentals').select('*');

if (error) {
  console.error('Database error:', error.message);
  // Handle error appropriately
  return;
}

// Use data safely
```

### Common Error Codes

| Code | Description |
|------|-------------|
| `PGRST116` | Row not found (single query) |
| `23505` | Unique constraint violation |
| `42501` | RLS policy violation |
| `23503` | Foreign key violation |
