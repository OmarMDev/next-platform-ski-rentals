import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { createServerSupabase, getCurrentUserProfile } from 'lib/supabase-server';
import { EditRentalForm } from 'components/edit-rental-form';

export const metadata = {
  title: 'Edit Listing',
  description: 'Edit your ski gear rental listing',
};

export default async function EditRentalPage({ params }) {
  const { id } = await params;
  const profile = await getCurrentUserProfile();
  
  // Not logged in - redirect to login
  if (!profile) {
    redirect(`/auth/login?redirect=/rentals/${id}/edit`);
  }
  
  // Fetch the rental
  const supabase = await createServerSupabase();
  const { data: rental, error } = await supabase
    .from('rentals')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error || !rental) {
    notFound();
  }
  
  // Check if user can edit (must be owner or admin)
  const canEdit = profile.role === 'admin' || rental.owner_id === profile.id;
  
  if (!canEdit) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="bg-red-50 border border-red-200 p-8 rounded-[32px] text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-600 mb-6">
              You can only edit your own listings.
            </p>
            <Link 
              href={`/rentals/${id}`}
              className="inline-flex px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-all"
            >
              Back to Listing
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-8">
      <div className="mb-8">
        <Link href={`/rentals/${id}`} className="text-[#7C9C95] hover:text-[#6a8a83] font-medium transition-colors">
          ← Back to Listing
        </Link>
      </div>
      
      <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Listing</h1>
        <p className="text-gray-500 mb-8">
          Update your rental listing details
        </p>
        
        <EditRentalForm rental={rental} userId={profile.id} />
      </div>
    </div>
  );
}
