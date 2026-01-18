import Link from 'next/link';
import { createServerSupabase, getCurrentUserProfile } from 'lib/supabase-server';
import { RentalCard } from 'components/rental-card';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'All Rentals',
  description: 'Browse all available ski equipment rentals',
};

export default async function RentalsPage() {
  const supabase = await createServerSupabase();
  const userProfile = await getCurrentUserProfile();
  
  const { data: rentals, error } = await supabase
    .from('rentals')
    .select(`
      id,
      title,
      description,
      price,
      image_url,
      owner_id,
      created_at,
      owner:profiles!owner_id (
        id,
        email,
        full_name
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching rentals:', error);
  }

  const canCreateListing = userProfile && ['renter', 'admin'].includes(userProfile.role);

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Rentals</h1>
          <p className="text-gray-500 mt-1">{rentals?.length || 0} listings available</p>
        </div>
        {canCreateListing && (
          <Link 
            href="/rentals/create"
            className="px-6 py-2.5 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm"
          >
            + New Listing
          </Link>
        )}
      </div>
      
      {rentals && rentals.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {rentals.map((rental) => (
            <RentalCard 
              key={rental.id} 
              rental={rental} 
              userProfile={userProfile}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[32px] p-12 text-center shadow-sm border border-gray-100">
          <div className="w-16 h-16 bg-[#7C9C95]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#7C9C95]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Rentals Yet</h3>
          <p className="text-gray-500 mb-6">Be the first to list your ski equipment!</p>
          {canCreateListing && (
            <Link 
              href="/rentals/create"
              className="inline-flex px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-all"
            >
              Create First Listing
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
