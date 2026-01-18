# Sub-Phase 3A: Authentication System

> **Project:** SkiNB - Ski Rental Platform  
> **Sub-Phase:** 3A of 5 - Authentication  
> **Estimated Time:** 45 minutes  
> **Dependencies:** Phase 1 & 2 completed

---

## Files to Create

```
app/
├── auth/
│   ├── login/page.jsx          # Login page
│   ├── signup/page.jsx         # Signup page
│   └── callback/route.js       # OAuth callback handler
components/
├── auth-button.jsx             # Login/Logout button
```

---

## Step 3A.1: Auth Callback Handler

**File:** `app/auth/callback/route.js`

This handles the redirect after OAuth or email confirmation.

```javascript
// app/auth/callback/route.js
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return to origin with error
  return NextResponse.redirect(`${origin}/auth/login?error=auth_failed`);
}
```

---

## Step 3A.2: Login Page

**File:** `app/auth/login/page.jsx`

```jsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  
  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      setError(error.message);
    } else {
      router.push('/');
      router.refresh();
    }
    
    setLoading(false);
  }
  
  return (
    <div className="max-w-md mx-auto py-12">
      <h1 className="text-2xl font-bold mb-6 text-center">Welcome Back</h1>
      
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-3 bg-black text-white rounded-full font-medium hover:bg-gray-900 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      
      <p className="mt-6 text-center text-gray-400">
        Don't have an account?{' '}
        <Link href="/auth/signup" className="text-teal-400 hover:text-teal-300">
          Sign up
        </Link>
      </p>
    </div>
  );
}
```

---

## Step 3A.3: Signup Page

**File:** `app/auth/signup/page.jsx`

```jsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  
  async function handleSignup(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      }
    });
    
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
    
    setLoading(false);
  }
  
  if (success) {
    return (
      <div className="max-w-md mx-auto py-12 text-center">
        <div className="bg-teal-500/20 border border-teal-500 text-teal-200 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Check your email!</h2>
          <p>We've sent you a confirmation link. Click it to activate your account.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-md mx-auto py-12">
      <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>
      
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            placeholder="Minimum 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-3 bg-black text-white rounded-full font-medium hover:bg-gray-900 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
      
      <p className="mt-6 text-center text-gray-400">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-teal-400 hover:text-teal-300">
          Sign in
        </Link>
      </p>
    </div>
  );
}
```

---

## Step 3A.4: Auth Button Component

**File:** `components/auth-button.jsx`

```jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';

export function AuthButton() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    
    getUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);
  
  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }
  
  if (loading) {
    return <div className="h-10 w-20 bg-gray-700 animate-pulse rounded-full" />;
  }
  
  if (user) {
    return (
      <div className="flex items-center gap-4">
        <Link 
          href="/profile" 
          className="text-sm text-gray-300 hover:text-white transition-colors"
        >
          {user.email}
        </Link>
        <button 
          onClick={handleLogout}
          className="px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
        >
          Sign Out
        </button>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-2">
      <Link 
        href="/auth/login"
        className="px-4 py-2 text-sm hover:text-teal-400 transition-colors"
      >
        Sign In
      </Link>
      <Link 
        href="/auth/signup"
        className="px-4 py-2 text-sm bg-black text-white rounded-full hover:bg-gray-900 transition-colors"
      >
        Sign Up
      </Link>
    </div>
  );
}
```

---

## 🧪 Checkpoint CP-3A: Authentication Testing

### Prerequisites
- Phase 1 complete (database tables and trigger exist)
- Phase 2 complete (environment variables set)
- Dev server running with `netlify dev`

### Test Checklist

| # | Test Case | Expected Result | ✅ |
|---|-----------|-----------------|-----|
| 1 | Visit `/auth/signup` | Form displays correctly | ⬜ |
| 2 | Sign up with new email | "Check email" message appears | ⬜ |
| 3 | Click confirmation link in email | Redirected to home page | ⬜ |
| 4 | Visit `/auth/login` | Form displays correctly | ⬜ |
| 5 | Login with valid credentials | Redirected to home, AuthButton shows email | ⬜ |
| 6 | Click "Sign Out" | Logged out, AuthButton shows Sign In/Up | ⬜ |
| 7 | Login with invalid password | Error message displayed | ⬜ |
| 8 | Refresh page while logged in | Session persists, still logged in | ⬜ |
| 9 | Check Supabase dashboard | New user appears in `auth.users` and `profiles` | ⬜ |

### How to Test

```bash
# 1. Start the dev server
netlify dev

# 2. Open browser to http://localhost:8888/auth/signup
# 3. Create a test account
# 4. Check your email for confirmation
# 5. Log in and verify session persistence
```

### Troubleshooting

| Issue | Likely Cause | Fix |
|-------|--------------|-----|
| "Invalid API key" | Missing env vars | Check `.env.local` has `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| Confirmation email not received | Email not confirmed in Supabase | Check Supabase Auth > Email Templates settings |
| Profile not created on signup | Trigger not working | Re-run Phase 1 trigger creation via MCP |
| "User already registered" | Duplicate signup | Use login page instead |

### ✅ Phase Complete Criteria

Before moving to Sub-Phase 3B, ensure:
- [ ] All 9 test cases pass
- [ ] Profile record created automatically on signup
- [ ] AuthButton component integrated into Header (optional, can do in 3E)

---

**Previous:** [Phase 2: Environment & Types](./PHASE_2_ENVIRONMENT.md)  
**Next:** [Sub-Phase 3B: Reusable Components](./PHASE_3B_COMPONENTS.md)
