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
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-[32px] shadow-lg p-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-gray-500 mb-8">Sign in to your SkiNB account</p>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#7C9C95] focus:border-transparent text-gray-900 placeholder-gray-400 transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#7C9C95] focus:border-transparent text-gray-900 placeholder-gray-400 transition-all"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3.5 bg-black text-white rounded-full font-semibold hover:bg-gray-800 disabled:opacity-50 transition-all shadow-md"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          
          <p className="mt-8 text-center text-gray-500">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-[#7C9C95] hover:text-[#6a8a83] font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
