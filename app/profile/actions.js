'use server';

import { revalidatePath } from 'next/cache';
import { createServerSupabase, getCurrentUserProfile } from 'lib/supabase-server';

export async function updateProfileName(formData) {
  const fullName = formData.get('fullName')?.toString().trim();
  
  if (!fullName) {
    return { error: 'Name is required' };
  }
  
  if (fullName.length > 100) {
    return { error: 'Name must be less than 100 characters' };
  }
  
  const profile = await getCurrentUserProfile();
  
  if (!profile) {
    return { error: 'Not authenticated' };
  }
  
  const supabase = await createServerSupabase();
  
  const { error } = await supabase
    .from('profiles')
    .update({ full_name: fullName })
    .eq('id', profile.id);
  
  if (error) {
    console.error('Error updating profile:', error);
    return { error: 'Failed to update name' };
  }
  
  revalidatePath('/profile');
  return { success: true };
}
