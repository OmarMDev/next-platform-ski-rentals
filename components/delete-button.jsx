'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

export function DeleteButton({ rentalId, userProfile, ownerId }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  
  // Determine visibility - only show if user can delete
  const canDelete = 
    userProfile?.role === 'admin' || 
    (userProfile?.role === 'renter' && ownerId === userProfile?.id);
  
  if (!canDelete) return null;
  
  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    
    setLoading(true);
    
    const { error } = await supabase
      .from('rentals')
      .delete()
      .eq('id', rentalId);
    
    if (error) {
      alert('Failed to delete: ' + error.message);
    } else {
      router.refresh(); // Revalidate server data
    }
    
    setLoading(false);
  }
  
  return (
    <button 
      onClick={handleDelete}
      disabled={loading}
      className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-full font-medium disabled:opacity-50 transition-colors"
    >
      {loading ? 'Deleting...' : 'Delete'}
    </button>
  );
}
