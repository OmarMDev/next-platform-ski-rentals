# Database Schema

> PostgreSQL schema via Supabase

---

## Tables

### `profiles`

Extends Supabase Auth users with application-specific data.

| Column | Type | Default | Description |
|--------|------|---------|-------------|
| `id` | `uuid` | - | Primary key, references `auth.users(id)` |
| `email` | `text` | `null` | User email (synced from auth) |
| `full_name` | `text` | `null` | Display name |
| `avatar_url` | `text` | `null` | Profile image URL |
| `role` | `user_role` | `'user'` | Permission level |
| `created_at` | `timestamptz` | `now()` | Account creation timestamp |
| `updated_at` | `timestamptz` | `now()` | Last update timestamp |

**Indexes:**
- `idx_profiles_role` on `role` column

---

### `rentals`

Ski equipment listings posted by renters.

| Column | Type | Default | Description |
|--------|------|---------|-------------|
| `id` | `uuid` | `gen_random_uuid()` | Primary key |
| `title` | `text` | - | Listing title (required) |
| `description` | `text` | `null` | Detailed description |
| `price` | `decimal(10,2)` | - | Daily rental price in EUR |
| `image_url` | `text` | `null` | Gear photo URL |
| `owner_id` | `uuid` | - | Foreign key to `profiles(id)` |
| `created_at` | `timestamptz` | `now()` | Creation timestamp |
| `updated_at` | `timestamptz` | `now()` | Last update timestamp |

**Constraints:**
- `price >= 0` check constraint
- `owner_id` references `profiles(id)` with `ON DELETE CASCADE`

---

## Enums

### `user_role`

```sql
CREATE TYPE public.user_role AS ENUM ('admin', 'renter', 'user');
```

| Value | Description |
|-------|-------------|
| `user` | Default role, can browse only |
| `renter` | Can create and manage own listings |
| `admin` | Full access, can delete any listing |

---

## Row Level Security (RLS)

All tables have RLS enabled. Policies control access at the database level.

### `profiles` Policies

| Policy | Operation | Rule |
|--------|-----------|------|
| `Public profiles are viewable` | `SELECT` | `true` (anyone) |
| `Users can update own profile` | `UPDATE` | `auth.uid() = id` |
| `Admins can update any profile` | `UPDATE` | `role = 'admin'` |

### `rentals` Policies

| Policy | Operation | Rule |
|--------|-----------|------|
| `Rentals are viewable by everyone` | `SELECT` | `true` |
| `Renters can create listings` | `INSERT` | `role IN ('renter', 'admin')` AND `owner_id = auth.uid()` |
| `Owners can update their listings` | `UPDATE` | `owner_id = auth.uid()` |
| `Owners can delete their listings` | `DELETE` | `owner_id = auth.uid()` |
| `Admins can update any listing` | `UPDATE` | `role = 'admin'` |
| `Admins can delete any listing` | `DELETE` | `role = 'admin'` |

---

## Storage Buckets

### `gear`

Stores rental equipment images.

| Setting | Value |
|---------|-------|
| Public | Yes |
| Max file size | 5MB |
| Allowed types | `image/*` |

**Policies:**
- Anyone can view images
- Authenticated users can upload
- Users can delete their own uploads

---

## TypeScript Types

Auto-generated types are in `lib/database.types.ts`.

### Usage

```typescript
import type { Database } from '@/lib/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Rental = Database['public']['Tables']['rentals']['Row'];
type UserRole = Database['public']['Enums']['user_role'];
```

### Type Definitions

```typescript
// Profile row type
interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: 'admin' | 'renter' | 'user';
  created_at: string;
  updated_at: string;
}

// Rental row type
interface Rental {
  id: string;
  title: string;
  description: string | null;
  price: number;
  image_url: string | null;
  owner_id: string;
  created_at: string;
  updated_at: string;
}
```

---

## Database Triggers

### `handle_new_user`

Automatically creates a profile when a new user signs up.

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## Common Queries

### Fetch all rentals with owner info

```javascript
const { data: rentals } = await supabase
  .from('rentals')
  .select(`
    id, title, description, price, image_url, owner_id, created_at,
    owner:profiles!owner_id (id, email, full_name)
  `)
  .order('created_at', { ascending: false });
```

### Fetch user's own rentals

```javascript
const { data: myRentals } = await supabase
  .from('rentals')
  .select('*')
  .eq('owner_id', userId);
```

### Update user role (admin only)

```javascript
const { error } = await supabase
  .from('profiles')
  .update({ role: 'renter' })
  .eq('id', targetUserId);
```
