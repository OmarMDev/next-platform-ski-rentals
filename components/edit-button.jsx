'use client';

import Link from 'next/link';

export function EditButton({ rentalId, userProfile, ownerId }) {
  // Determine visibility - only show if user can edit
  const canEdit = 
    userProfile?.role === 'admin' || 
    (userProfile?.role === 'renter' && ownerId === userProfile?.id);
  
  if (!canEdit) return null;
  
  return (
    <Link 
      href={`/rentals/${rentalId}/edit`}
      className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full font-medium transition-colors"
    >
      Edit
    </Link>
  );
}
