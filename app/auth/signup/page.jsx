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
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-[#7C9C95]/10 border border-[#7C9C95]/30 p-8 rounded-[32px] text-center">
            <div className="w-16 h-16 bg-[#7C9C95] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email!</h2>
            <p className="text-gray-600">We've sent you a confirmation link. Click it to activate your account.</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-[32px] shadow-lg p-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Create Account</h1>
          <p className="text-gray-500 mb-8">Join SkiNB and start renting gear</p>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#7C9C95] focus:border-transparent text-gray-900 placeholder-gray-400 transition-all"
              />
            </div>
            
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
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#7C9C95] focus:border-transparent text-gray-900 placeholder-gray-400 transition-all"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3.5 bg-black text-white rounded-full font-semibold hover:bg-gray-800 disabled:opacity-50 transition-all shadow-md"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>
          
          <p className="mt-8 text-center text-gray-500">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-[#7C9C95] hover:text-[#6a8a83] font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
