'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { ImageUpload } from './image-upload';

export function EditRentalForm({ rental, userId }) {
  const [title, setTitle] = useState(rental.title);
  const [description, setDescription] = useState(rental.description || '');
  const [price, setPrice] = useState(rental.price.toString());
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      let imageUrl = rental.image_url;
      
      // If new image selected, upload it
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${userId}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('gear')
          .upload(fileName, imageFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          throw new Error(`Image upload failed: ${uploadError.message}`);
        }

        // Get public URL for new image
        const { data: { publicUrl } } = supabase.storage
          .from('gear')
          .getPublicUrl(fileName);
        
        imageUrl = publicUrl;
      }

      // Update rental record
      const { error: updateError } = await supabase
        .from('rentals')
        .update({
          title: title.trim(),
          description: description.trim() || null,
          price: parseFloat(price),
          image_url: imageUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', rental.id)
        .eq('owner_id', userId); // Extra security check

      if (updateError) {
        throw new Error(`Failed to update listing: ${updateError.message}`);
      }

      // Success - redirect to detail page
      router.push(`/rentals/${rental.id}`);
      router.refresh();
      
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl">
          {error}
        </div>
      )}
      
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Rossignol Experience 88 Ti Skis"
          required
          maxLength={100}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#7C9C95] focus:border-transparent text-gray-900 placeholder-gray-400 transition-all"
        />
        <p className="text-sm text-gray-400 mt-1">{title.length}/100 characters</p>
      </div>
      
      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your gear: size, condition, skill level, included accessories..."
          rows={4}
          maxLength={1000}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#7C9C95] focus:border-transparent text-gray-900 placeholder-gray-400 transition-all resize-none"
        />
        <p className="text-sm text-gray-400 mt-1">{description.length}/1000 characters</p>
      </div>
      
      {/* Price */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price per Day (EUR) <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">€</span>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            required
            min="0"
            step="0.01"
            className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#7C9C95] focus:border-transparent text-gray-900 placeholder-gray-400 transition-all"
          />
        </div>
      </div>
      
      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Photo
        </label>
        <ImageUpload 
          onFileSelect={setImageFile} 
          currentPreview={rental.image_url}
        />
        <p className="text-sm text-gray-400 mt-2">
          Leave unchanged to keep the current image
        </p>
      </div>
      
      {/* Submit */}
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={loading || !title || !price}
          className="flex-1 py-3.5 bg-black text-white rounded-full font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
        >
          {loading ? 'Saving Changes...' : 'Save Changes'}
        </button>
        
        <button
          type="button"
          onClick={() => router.back()}
          className="px-8 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full font-medium transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
