# Phase 1: Database Initialization (Supabase MCP)

> **Project:** SkiNB - Ski Rental Platform  
> **Phase:** 1 of 4 - Database Schema & Security

---

All database operations **MUST** be executed via the Supabase MCP tools. Do not run SQL directly in the Supabase dashboard.

## 1.1 Create Custom Types (ENUM)

```sql
-- Create role enum type for user profiles
CREATE TYPE public.user_role AS ENUM ('admin', 'renter', 'user');
```

---

## 1.2 Create `profiles` Table

```sql
-- Profiles table: extends auth.users with role-based access
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role public.user_role DEFAULT 'user' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Index for faster role-based queries
CREATE INDEX idx_profiles_role ON public.profiles(role);
```

---

## 1.3 Create `rentals` Table

```sql
-- Rentals table: ski gear listings
CREATE TABLE public.rentals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  image_url TEXT,
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS on rentals
ALTER TABLE public.rentals ENABLE ROW LEVEL SECURITY;

-- Indexes for common queries
CREATE INDEX idx_rentals_owner_id ON public.rentals(owner_id);
CREATE INDEX idx_rentals_created_at ON public.rentals(created_at DESC);
```

---

## 1.4 Create Storage Bucket for Images

```sql
-- Create the 'gear' storage bucket for rental images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gear',
  'gear',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);
```

---

## 1.5 Auto-Create Profile Trigger

```sql
-- Function to create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    'user'  -- Default role for new signups
  );
  RETURN NEW;
END;
$$;

-- Trigger to execute the function on user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

---

## 1.6 Row Level Security (RLS) Policies

### Profiles Table Policies

```sql
-- Policy: Anyone can view profiles (needed for owner info on listings)
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles
  FOR SELECT
  USING (true);

-- Policy: Users can update their own profile (except role)
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
```

### Rentals Table Policies

```sql
-- Policy: Anyone can view all rentals (public feed)
CREATE POLICY "Rentals are viewable by everyone"
  ON public.rentals
  FOR SELECT
  USING (true);

-- Policy: Renters and Admins can create rentals
CREATE POLICY "Renters and Admins can create rentals"
  ON public.rentals
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('renter', 'admin')
    )
  );

-- Policy: Renters can update their own rentals only
CREATE POLICY "Renters can update own rentals"
  ON public.rentals
  FOR UPDATE
  USING (
    owner_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('renter', 'admin')
    )
  );

-- Policy: Admins can delete ANY rental, Renters can delete only their own
CREATE POLICY "Admins delete any, Renters delete own"
  ON public.rentals
  FOR DELETE
  USING (
    -- Admin can delete any listing
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
    OR
    -- Renter can delete only their own listing
    (
      owner_id = auth.uid()
      AND EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'renter'
      )
    )
  );
```

### Storage Policies for 'gear' Bucket

```sql
-- Policy: Anyone can view images (public bucket)
CREATE POLICY "Public read access for gear images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'gear');

-- Policy: Authenticated renters/admins can upload images
CREATE POLICY "Renters and Admins can upload gear images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'gear'
    AND auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('renter', 'admin')
    )
  );

-- Policy: Users can delete their own uploaded images
CREATE POLICY "Users can delete own images"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'gear'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
```

---

## 1.7 Updated_at Trigger

```sql
-- Function to auto-update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Apply trigger to profiles table
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Apply trigger to rentals table
CREATE TRIGGER update_rentals_updated_at
  BEFORE UPDATE ON public.rentals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
```

---

## Execution Order

Run the SQL scripts in this exact order using `mcp_supabase_apply_migration`:

1. Create ENUM type (1.1)
2. Create profiles table (1.2)
3. Create rentals table (1.3)
4. Create storage bucket (1.4)
5. Create auto-profile trigger (1.5)
6. Create RLS policies (1.6)
7. Create updated_at triggers (1.7)

---

## Verification Queries

After running migrations, verify the setup:

```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public';

-- Check policies
SELECT * FROM pg_policies 
WHERE schemaname = 'public';

-- Check storage bucket
SELECT * FROM storage.buckets WHERE id = 'gear';
```

---

**Next:** [Phase 2: Environment & Types](./PHASE_2_ENVIRONMENT.md)
