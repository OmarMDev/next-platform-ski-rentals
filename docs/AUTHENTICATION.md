# Authentication

> Auth flows, session management, and protected routes

---

## Overview

SkiNB uses Supabase Auth with email/password authentication. Sessions are managed via HTTP-only cookies for security and SSR compatibility.

---

## Auth Routes

| Route | Description |
|-------|-------------|
| `/auth/login` | Login page with email/password form |
| `/auth/signup` | Registration page with email/password form |
| `/auth/callback` | OAuth callback handler (for future social auth) |

---

## Auth Flow

### Sign Up Flow

```
User fills signup form
        │
        ▼
┌─────────────────────┐
│ supabase.auth       │
│ .signUp()           │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Supabase creates    │
│ auth.users record   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Trigger creates     │
│ profiles record     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Session cookie set  │
│ Redirect to /profile│
└─────────────────────┘
```

### Login Flow

```
User fills login form
        │
        ▼
┌─────────────────────┐
│ supabase.auth       │
│ .signInWithPassword │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Validate credentials│
│ Return session      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Session cookie set  │
│ Redirect to /profile│
└─────────────────────┘
```

### Logout Flow

```
User clicks logout
        │
        ▼
┌─────────────────────┐
│ supabase.auth       │
│ .signOut()          │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Clear session cookie│
│ Redirect to /       │
└─────────────────────┘
```

---

## Implementation

### Login Page (`app/auth/login/page.jsx`)

```jsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push('/profile');
    router.refresh();
  }

  return (
    <form onSubmit={handleLogin}>
      {/* Form fields */}
    </form>
  );
}
```

### Signup Page (`app/auth/signup/page.jsx`)

```jsx
'use client';

import { supabase } from '@/lib/supabase';

async function handleSignup(e) {
  e.preventDefault();
  
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    setError(error.message);
    return;
  }

  router.push('/profile');
  router.refresh();
}
```

### Auth Callback (`app/auth/callback/route.js`)

Handles OAuth redirects (for future social auth support).

```javascript
import { createServerSupabase } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = await createServerSupabase();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(new URL('/profile', request.url));
}
```

---

## Protected Routes

### Server Component Protection

```jsx
import { redirect } from 'next/navigation';
import { getCurrentUserProfile } from '@/lib/supabase-server';

export default async function ProtectedPage() {
  const profile = await getCurrentUserProfile();

  if (!profile) {
    redirect('/auth/login');
  }

  // Page content for authenticated users
  return <div>Welcome, {profile.full_name}</div>;
}
```

### Role-Based Protection

```jsx
import { redirect } from 'next/navigation';
import { getCurrentUserProfile } from '@/lib/supabase-server';

export default async function RenterOnlyPage() {
  const profile = await getCurrentUserProfile();

  if (!profile) {
    redirect('/auth/login');
  }

  if (!['renter', 'admin'].includes(profile.role)) {
    redirect('/'); // Not authorized
  }

  return <div>Renter dashboard</div>;
}
```

### Client Component Protection

```jsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, getCurrentUserProfile } from '@/lib/supabase';

export default function ProtectedClientPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      const profile = await getCurrentUserProfile();
      
      if (!profile) {
        router.push('/auth/login');
        return;
      }
      
      setProfile(profile);
      setLoading(false);
    }

    checkAuth();
  }, [router]);

  if (loading) return <div>Loading...</div>;

  return <div>Welcome, {profile.full_name}</div>;
}
```

---

## Session Management

### Cookie Configuration

Sessions are stored in HTTP-only cookies managed by `@supabase/ssr`:

```javascript
// lib/supabase-server.js
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
```

### Auth State Changes

Listen for auth changes in client components:

```jsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export function AuthListener({ children }) {
  const router = useRouter();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          router.push('/');
          router.refresh();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router]);

  return children;
}
```

---

## User Roles

### Role Assignment

New users are assigned the `user` role by default. Roles can be upgraded:

```javascript
// Admin-only operation
const { error } = await supabase
  .from('profiles')
  .update({ role: 'renter' })
  .eq('id', targetUserId);
```

### Role Hierarchy

| Role | Browse | Create Rental | Edit Own | Delete Own | Delete Any |
|------|--------|---------------|----------|------------|------------|
| Guest | ✅ | ❌ | ❌ | ❌ | ❌ |
| User | ✅ | ❌ | ❌ | ❌ | ❌ |
| Renter | ✅ | ✅ | ✅ | ✅ | ❌ |
| Admin | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## Security Considerations

1. **Never trust client-side role checks alone** - RLS policies enforce permissions at database level

2. **Always use `getUser()` not `getSession()`** - `getUser()` validates the JWT with Supabase

3. **Server components can't set cookies** - Auth operations should happen in client components or route handlers

4. **Refresh router after auth changes** - Call `router.refresh()` to update server components
