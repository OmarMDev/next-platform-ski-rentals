import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createServerSupabase, getCurrentUserProfile } from 'lib/supabase-server';
import { DeleteButton } from 'components/delete-button';
import { EditButton } from 'components/edit-button';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const supabase = await createServerSupabase();
  
  const { data: rental } = await supabase
    .from('rentals')
    .select('title, description')
    .eq('id', id)
    .single();

  if (!rental) {
    return { title: 'Listing Not Found' };
  }

  return {
    title: rental.title,
    description: rental.description || `Rent ${rental.title} on SkiNB`,
  };
}

export default async function RentalDetailPage({ params }) {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const userProfile = await getCurrentUserProfile();
  
  const { data: rental, error } = await supabase
    .from('rentals')
    .select(`
      *,
      owner:profiles!owner_id (
        id,
        email,
        full_name,
        avatar_url
      )
    `)
    .eq('id', id)
    .single();

  if (error || !rental) {
    notFound();
  }

  // Build mailto link
  const subject = encodeURIComponent(`Inquiry about: ${rental.title}`);
  const body = encodeURIComponent(
    `Hi${rental.owner.full_name ? ` ${rental.owner.full_name}` : ''},\n\n` +
    `I'm interested in renting "${rental.title}" listed at €${rental.price}/day.\n\n` +
    `Please let me know if it's available and how we can arrange pickup/delivery.\n\n` +
    `Thanks!`
  );
  const mailtoHref = `mailto:${rental.owner.email}?subject=${subject}&body=${body}`;

  // Format date
  const listedDate = new Date(rental.created_at).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="py-8">
      {/* Back link */}
      <Link 
        href="/" 
        className="text-[#7C9C95] hover:text-[#6a8a83] font-medium transition-colors inline-block mb-6"
      >
        ← Back to Listings
      </Link>
      
      <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[500px] bg-gray-100">
            {rental.image_url ? (
              <Image 
                src={rental.image_url} 
                alt={rental.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#7C9C95]/20 to-[#A4B4A8]/20">
                <span className="text-8xl">🎿</span>
              </div>
            )}
          </div>
          
          {/* Details */}
          <div className="p-8 lg:p-10">
            <div className="flex justify-between items-start gap-4 mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{rental.title}</h1>
              <div className="flex items-center gap-2">
                <EditButton 
                  rentalId={rental.id}
                  userProfile={userProfile}
                  ownerId={rental.owner_id}
                />
                <DeleteButton 
                  rentalId={rental.id}
                  userProfile={userProfile}
                  ownerId={rental.owner_id}
                />
              </div>
            </div>
            
            <div className="mb-6">
              <span className="text-4xl font-bold text-[#7C9C95]">€{rental.price}</span>
              <span className="text-lg text-gray-500">/day</span>
            </div>
            
            {rental.description && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">{rental.description}</p>
              </div>
            )}
            
            {/* Owner info */}
            <div className="bg-gray-50 rounded-2xl p-5 mb-8">
              <p className="text-sm text-gray-500 mb-3">Listed by</p>
              <div className="flex items-center gap-3">
                {rental.owner.avatar_url ? (
                  <Image
                    src={rental.owner.avatar_url}
                    alt={rental.owner.full_name || 'User'}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 bg-[#7C9C95]/10 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#7C9C95]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900">
                    {rental.owner.full_name || rental.owner.email.split('@')[0]}
                  </p>
                  <p className="text-sm text-gray-500">
                    Listed on {listedDate}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Contact button */}
            <a 
              href={mailtoHref}
              className="flex items-center justify-center gap-2 w-full py-4 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-all text-lg shadow-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Owner
            </a>
            
            <p className="text-sm text-gray-400 text-center mt-3">
              Opens your email app with a pre-filled message
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
