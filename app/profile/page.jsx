import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createServerSupabase, getCurrentUserProfile } from 'lib/supabase-server';
import { RentalCard } from 'components/rental-card';
import { EditNameForm } from './edit-name-form';

export const metadata = {
  title: 'My Profile',
  description: 'View your profile and manage your listings',
};

export default async function ProfilePage() {
  const profile = await getCurrentUserProfile();
  
  if (!profile) {
    redirect('/auth/login?redirect=/profile');
  }
  
  // Fetch user's own listings (only if renter/admin)
  let myListings = [];
  
  if (['renter', 'admin'].includes(profile.role)) {
    const supabase = await createServerSupabase();
    const { data } = await supabase
      .from('rentals')
      .select('*')
      .eq('owner_id', profile.id)
      .order('created_at', { ascending: false });
    
    myListings = data || [];
  }
  
  // Format member since date
  const memberSince = new Date(profile.created_at).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long'
  });
  
  // Role badge colors
  const roleBadgeColors = {
    admin: 'bg-red-500 text-white',
    renter: 'bg-[#7C9C95] text-white',
    user: 'bg-gray-200 text-gray-700'
  };

  return (
    <div className="py-8 space-y-8">
      {/* Profile Card */}
      <section className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
        <div className="flex items-start justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${roleBadgeColors[profile.role]}`}>
            {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
          </span>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-center gap-5">
            {profile.avatar_url ? (
              <Image 
                src={profile.avatar_url} 
                alt="Profile" 
                width={80}
                height={80}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 bg-[#7C9C95]/10 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-[#7C9C95]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
            <div>
              <EditNameForm currentName={profile.full_name} />
              <p className="text-gray-500">{profile.email}</p>
            </div>
          </div>
          
          <div className="border-t border-gray-100 pt-6 grid grid-cols-2 sm:grid-cols-3 gap-6">
            <div>
              <span className="text-sm text-gray-400">Member since</span>
              <p className="font-semibold text-gray-900">{memberSince}</p>
            </div>
            <div>
              <span className="text-sm text-gray-400">Role</span>
              <p className="font-semibold text-gray-900 capitalize">{profile.role}</p>
            </div>
            {['renter', 'admin'].includes(profile.role) && (
              <div>
                <span className="text-sm text-gray-400">Listings</span>
                <p className="font-semibold text-gray-900">{myListings.length}</p>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* My Listings Section (only for renters/admins) */}
      {['renter', 'admin'].includes(profile.role) && (
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              My Listings
            </h2>
            <Link 
              href="/rentals/create" 
              className="px-6 py-2.5 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm"
            >
              + New Listing
            </Link>
          </div>
          
          {myListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {myListings.map(rental => (
                <RentalCard 
                  key={rental.id} 
                  rental={rental}
                  userProfile={profile}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-[32px] shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-[#7C9C95]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#7C9C95]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Listings Yet</h3>
              <p className="text-gray-500 mb-6">
                You haven't listed any gear for rent.
              </p>
              <Link 
                href="/rentals/create" 
                className="inline-flex px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-all"
              >
                Create Your First Listing
              </Link>
            </div>
          )}
        </section>
      )}
      
      {/* Message for regular users */}
      {profile.role === 'user' && (
        <section className="text-center py-16 bg-white rounded-[32px] shadow-sm border border-gray-100">
          <div className="w-16 h-16 bg-[#7C9C95]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🎿</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Want to Rent Out Your Gear?</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            Become a renter to list your ski and snowboard equipment for others to rent.
          </p>
          <p className="text-sm text-gray-400">
            Contact us to upgrade your account to renter status
          </p>
        </section>
      )}
    </div>
  );
}
