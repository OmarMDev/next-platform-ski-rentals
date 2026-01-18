import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Browser client (for client components)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Get the current authenticated user
 * @returns {Promise<import('@supabase/supabase-js').User | null>}
 */
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Get the current user's profile with role
 * @returns {Promise<import('./database.types').Profile | null>}
 */
export async function getCurrentUserProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
    
  return profile;
}

/**
 * Check if user has a specific role
 * @param {'admin' | 'renter' | 'user'} requiredRole
 * @returns {Promise<boolean>}
 */
export async function hasRole(requiredRole) {
  const profile = await getCurrentUserProfile();
  if (!profile) return false;
  
  if (requiredRole === 'user') return true; // All authenticated users
  if (requiredRole === 'renter') return ['renter', 'admin'].includes(profile.role);
  if (requiredRole === 'admin') return profile.role === 'admin';
  
  return false;
}

/**
 * Check if user can delete a specific rental
 * @param {string} rentalOwnerId - The owner_id of the rental
 * @returns {Promise<boolean>}
 */
export async function canDeleteRental(rentalOwnerId) {
  const profile = await getCurrentUserProfile();
  if (!profile) return false;
  
  // Admins can delete any rental
  if (profile.role === 'admin') return true;
  
  // Renters can only delete their own
  if (profile.role === 'renter' && profile.id === rentalOwnerId) return true;
  
  return false;
}
