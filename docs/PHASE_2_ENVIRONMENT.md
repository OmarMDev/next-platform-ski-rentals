# Phase 2: Environment & Types

> **Project:** SkiNB - Ski Rental Platform  
> **Phase:** 2 of 4 - Configuration Setup

---

## 2.1 Required Environment Variables

Create/update `.env.local` file in the project root:

```env
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Netlify Context (auto-set by Netlify, optional for local)
CONTEXT=dev

# Optional: Disable uploads for demo mode
NEXT_PUBLIC_DISABLE_UPLOADS=false
```

### Where to Find These Values

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Security Note

⚠️ **Never commit `.env.local` to version control!**

Ensure `.gitignore` contains:
```
.env.local
.env*.local
```

---

## 2.2 Generate TypeScript Types

Use the Supabase MCP tool to generate types based on your schema:

**MCP Tool:** `mcp_supabase_generate_typescript_types`

The generated types will be saved to `lib/database.types.ts`.

### Expected Type Structure

```typescript
// lib/database.types.ts (auto-generated)

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          role: 'admin' | 'renter' | 'user'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'renter' | 'user'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'renter' | 'user'
          created_at?: string
          updated_at?: string
        }
      }
      rentals: {
        Row: {
          id: string
          title: string
          description: string | null
          price: number
          image_url: string | null
          owner_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          price: number
          image_url?: string | null
          owner_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          price?: number
          image_url?: string | null
          owner_id?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Enums: {
      user_role: 'admin' | 'renter' | 'user'
    }
  }
}

// Convenience type exports
export type UserRole = Database['public']['Enums']['user_role']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Rental = Database['public']['Tables']['rentals']['Row']
export type RentalInsert = Database['public']['Tables']['rentals']['Insert']
export type RentalUpdate = Database['public']['Tables']['rentals']['Update']
```

---

## 2.3 Update Supabase Client Configuration

**File:** `lib/supabase.js`

Update the existing file to support typed queries and add helper functions:

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Browser client (for client components)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Get the current authenticated user
 * @returns {Promise<User | null>}
 */
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Get the current user's profile with role
 * @returns {Promise<Profile | null>}
 */
export async function getCurrentUserProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
    
  return profile;
}

/**
 * Check if user has a specific role
 * @param {string} requiredRole - 'admin' | 'renter' | 'user'
 * @returns {Promise<boolean>}
 */
export async function hasRole(requiredRole) {
  const profile = await getCurrentUserProfile();
  if (!profile) return false;
  
  if (requiredRole === 'user') return true; // All authenticated users
  if (requiredRole === 'renter') return ['renter', 'admin'].includes(profile.role);
  if (requiredRole === 'admin') return profile.role === 'admin';
  
  return false;
}

/**
 * Check if user can delete a specific rental
 * @param {string} rentalOwnerId - The owner_id of the rental
 * @returns {Promise<boolean>}
 */
export async function canDeleteRental(rentalOwnerId) {
  const profile = await getCurrentUserProfile();
  if (!profile) return false;
  
  // Admins can delete any rental
  if (profile.role === 'admin') return true;
  
  // Renters can only delete their own
  if (profile.role === 'renter' && profile.id === rentalOwnerId) return true;
  
  return false;
}
```

---

## 2.4 Optional: Server-Side Supabase Client

For server components and API routes, create a server-side client:

**File:** `lib/supabase-server.js`

```javascript
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export async function createServerClient() {
  const cookieStore = await cookies();
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
}
```

---

## 2.5 Verification Checklist

Before proceeding to Phase 3, verify:

- [ ] `.env.local` file created with valid Supabase credentials
- [ ] `.env.local` is in `.gitignore`
- [ ] TypeScript types generated (if using TypeScript)
- [ ] `lib/supabase.js` updated with helper functions
- [ ] Can connect to Supabase (test with `supabase.from('profiles').select('*')`)

### Quick Connection Test

Add this to any page temporarily:

```javascript
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestPage() {
  const [status, setStatus] = useState('Testing...');
  
  useEffect(() => {
    async function test() {
      const { data, error } = await supabase.from('profiles').select('count');
      if (error) {
        setStatus(`Error: ${error.message}`);
      } else {
        setStatus('Connected successfully!');
      }
    }
    test();
  }, []);
  
  return <div>{status}</div>;
}
```

---

**Previous:** [Phase 1: Database Initialization](./PHASE_1_DATABASE.md)  
**Next:** [Phase 3: Frontend Implementation](./PHASE_3_FRONTEND.md)
