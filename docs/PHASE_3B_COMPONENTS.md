# Sub-Phase 3B: Reusable Components

> **Project:** SkiNB - Ski Rental Platform  
> **Sub-Phase:** 3B of 5 - Components  
> **Estimated Time:** 35 minutes  
> **Dependencies:** Sub-Phase 3A completed

---

## Files to Create

```
components/
├── rental-card.jsx             # Rental card component
├── delete-button.jsx           # Delete action button (client)
└── image-upload.jsx            # Image upload component
```

---

## Step 3B.1: Delete Button Component

**File:** `components/delete-button.jsx`

```jsx
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
  
  // Determine visibility
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
      className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50 transition-colors"
    >
      {loading ? 'Deleting...' : 'Delete'}
    </button>
  );
}
```

---

## Step 3B.2: Rental Card Component

**File:** `components/rental-card.jsx`

```jsx
import Link from 'next/link';
import Image from 'next/image';
import { DeleteButton } from './delete-button';

export function RentalCard({ rental, userProfile }) {
  return (
    <div className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 hover:border-gray-600 transition-colors">
      {rental.image_url ? (
        <div className="relative w-full h-48">
          <Image 
            src={rental.image_url} 
            alt={rental.title}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="w-full h-48 bg-gray-700 flex items-center justify-center">
          <span className="text-4xl">🎿</span>
        </div>
      )}
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 truncate">{rental.title}</h3>
        <p className="text-2xl font-bold text-teal-400">
          ${rental.price}
          <span className="text-sm text-gray-400 font-normal">/day</span>
        </p>
        
        {rental.owner && (
          <p className="text-sm text-gray-400 mt-2">
            By {rental.owner?.full_name || rental.owner?.email?.split('@')[0]}
          </p>
        )}
        
        <div className="flex justify-between items-center mt-4 gap-2">
          <Link 
            href={`/rentals/${rental.id}`} 
            className="flex-1 text-center py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm"
          >
            View Details
          </Link>
          
          <DeleteButton 
            rentalId={rental.id}
            userProfile={userProfile}
            ownerId={rental.owner_id}
          />
        </div>
      </div>
    </div>
  );
}
```

---

## Step 3B.3: Image Upload Component

**File:** `components/image-upload.jsx`

```jsx
'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

export function ImageUpload({ onFileSelect, currentPreview }) {
  const [preview, setPreview] = useState(currentPreview || null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);
  
  function handleFile(file) {
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
    
    // Pass file to parent
    onFileSelect(file);
  }
  
  function handleDrag(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }
  
  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }
  
  function handleChange(e) {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }
  
  function clearImage(e) {
    e.stopPropagation();
    setPreview(null);
    onFileSelect(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }
  
  return (
    <div>
      <div
        className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
          dragActive 
            ? 'border-teal-500 bg-teal-500/10' 
            : 'border-gray-600 hover:border-gray-500'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
        
        {preview ? (
          <div className="relative w-full h-48">
            <Image 
              src={preview} 
              alt="Preview" 
              fill 
              className="object-contain rounded-lg"
            />
            <button
              type="button"
              onClick={clearImage}
              className="absolute top-2 right-2 p-1 bg-red-600 rounded-full hover:bg-red-700 text-white"
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="py-8">
            <div className="text-4xl mb-2">📷</div>
            <p className="text-gray-400">
              Drag and drop an image, or click to select
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Max 5MB, JPG/PNG/WebP
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## 🧪 Checkpoint CP-3B: Component Testing

### Option A: Quick Test Page (Recommended)

Create a temporary test page at `app/test-components/page.jsx`:

```jsx
import { RentalCard } from '@/components/rental-card';

const mockRental = {
  id: '1',
  title: 'Rossignol Experience 88 Ti',
  price: 45,
  image_url: 'https://picsum.photos/400/300',
  owner_id: 'user-123',
  owner: { full_name: 'John Doe', email: 'john@example.com' }
};

const mockAdmin = { id: 'admin-1', role: 'admin' };
const mockOwner = { id: 'user-123', role: 'renter' };
const mockOtherUser = { id: 'other-456', role: 'renter' };

export default function TestPage() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Component Tests</h1>
      
      <section>
        <h2 className="text-lg font-semibold mb-4">RentalCard - No User (Anonymous)</h2>
        <div className="max-w-sm">
          <RentalCard rental={mockRental} userProfile={null} />
        </div>
      </section>
      
      <section>
        <h2 className="text-lg font-semibold mb-4">RentalCard - Admin User (Should see Delete)</h2>
        <div className="max-w-sm">
          <RentalCard rental={mockRental} userProfile={mockAdmin} />
        </div>
      </section>
      
      <section>
        <h2 className="text-lg font-semibold mb-4">RentalCard - Owner (Should see Delete)</h2>
        <div className="max-w-sm">
          <RentalCard rental={mockRental} userProfile={mockOwner} />
        </div>
      </section>
      
      <section>
        <h2 className="text-lg font-semibold mb-4">RentalCard - Other Renter (No Delete)</h2>
        <div className="max-w-sm">
          <RentalCard rental={mockRental} userProfile={mockOtherUser} />
        </div>
      </section>
    </div>
  );
}
```

### Test Checklist

| # | Test Case | Expected Result | ✅ |
|---|-----------|-----------------|-----|
| 1 | Visit `/test-components` | Page renders without errors | ⬜ |
| 2 | `RentalCard` - No User | Card shows, NO delete button | ⬜ |
| 3 | `RentalCard` - Admin | Card shows WITH delete button | ⬜ |
| 4 | `RentalCard` - Owner | Card shows WITH delete button | ⬜ |
| 5 | `RentalCard` - Other Renter | Card shows, NO delete button | ⬜ |
| 6 | `RentalCard` - No image | Shows ski emoji placeholder | ⬜ |

### Option B: ImageUpload Testing (Client Component)

Add this to your test page to test the image upload:

```jsx
'use client';

import { useState } from 'react';
import { ImageUpload } from '@/components/image-upload';

export default function TestUploadPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  
  return (
    <div className="p-8 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Image Upload Test</h1>
      
      <ImageUpload onFileSelect={setSelectedFile} />
      
      {selectedFile && (
        <p className="mt-4 text-green-400">
          ✅ File selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)}KB)
        </p>
      )}
    </div>
  );
}
```

| # | Test Case | Expected Result | ✅ |
|---|-----------|-----------------|-----|
| 7 | `ImageUpload` - Click to select | File picker opens | ⬜ |
| 8 | `ImageUpload` - Drag and drop | Preview appears | ⬜ |
| 9 | `ImageUpload` - Select >5MB file | Error alert shown | ⬜ |
| 10 | `ImageUpload` - Select non-image | Error alert shown | ⬜ |
| 11 | `ImageUpload` - Click ✕ button | Preview clears | ⬜ |

### Cleanup

After testing, you can delete the test page:
```bash
rm -rf app/test-components
```

### ✅ Phase Complete Criteria

Before moving to Sub-Phase 3C, ensure:
- [ ] All 11 test cases pass
- [ ] No TypeScript/ESLint errors
- [ ] Components are properly exported

---

**Previous:** [Sub-Phase 3A: Authentication](./PHASE_3A_AUTH.md)  
**Next:** [Sub-Phase 3C: Home Page](./PHASE_3C_HOME.md)
