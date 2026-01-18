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
    return <div className="h-10 w-24 bg-gray-100 animate-pulse rounded-full" />;
  }
  
  if (user) {
    return (
      <div className="flex items-center gap-3">
        <Link 
          href="/profile" 
          className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium truncate max-w-[150px]"
        >
          {user.user_metadata?.full_name || user.email}
        </Link>
        <button 
          onClick={handleLogout}
          className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors font-medium"
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
        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium"
      >
        Sign In
      </Link>
      <Link 
        href="/auth/signup"
        className="px-5 py-2.5 text-sm bg-black text-white rounded-full hover:bg-gray-800 transition-colors font-medium shadow-sm"
      >
        Sign Up
      </Link>
    </div>
  );
}
