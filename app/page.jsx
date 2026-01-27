import Link from 'next/link';
import { createServerSupabase, getCurrentUserProfile } from 'lib/supabase-server';
import { RentalCard } from 'components/rental-card';

export const dynamic = 'force-dynamic'; // Always fetch fresh data

export default async function HomePage() {
  const supabase = await createServerSupabase();
  const userProfile = await getCurrentUserProfile();
  
  // Fetch all rentals with owner info
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
    <div className="flex flex-col gap-16">
      {/* Hero Section */}
      <section className="relative text-center py-24 sm:py-32 overflow-hidden rounded-[32px]">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/4274798-uhd_3840_2160_25fps.mp4" type="video/mp4" />
        </video>
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Content */}
        <div className="relative z-10">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6 drop-shadow-lg">
            Rent Ski Gear<br />
            <span className="text-white/90">From Locals</span>
          </h1>
          <p className="text-xl text-white/95 max-w-2xl mx-auto mb-10 drop-shadow-md px-4">
            Discover quality ski equipment from trusted renters across Europe. 
            Save money, ski more.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <Link 
              href="#rentals"
              className="px-8 py-4 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-all shadow-lg"
            >
              Browse Rentals
            </Link>
            {canCreateListing ? (
              <Link 
                href="/rentals/create"
                className="px-8 py-4 bg-white/20 text-white border border-white/40 backdrop-blur-sm rounded-full font-semibold hover:bg-white/30 transition-all"
              >
                + List Your Gear
              </Link>
            ) : !userProfile && (
              <Link 
                href="/auth/signup"
                className="px-8 py-4 bg-white/20 text-white border border-white/40 backdrop-blur-sm rounded-full font-semibold hover:bg-white/30 transition-all"
              >
                List Your Gear
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard 
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          title="Save Money"
          description="Rent equipment at a fraction of retail prices from local ski enthusiasts."
        />
        <FeatureCard 
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          }
          title="Verified Renters"
          description="Every renter is verified. Read reviews and rent with confidence."
        />
        <FeatureCard 
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
          title="Local Pickup"
          description="Find gear near you. Convenient local pickup across Europe."
        />
      </section>

      {/* Rentals Section */}
      <section id="rentals" className="scroll-mt-24">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Available Rentals</h2>
          <span className="text-gray-500">{rentals?.length || 0} listings</span>
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
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white rounded-[24px] p-8 shadow-sm border border-gray-100">
      <div className="w-12 h-12 bg-[#7C9C95]/10 rounded-2xl flex items-center justify-center mb-4 text-[#7C9C95]">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </div>
  );
}
