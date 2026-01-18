'use client';

import { useState } from 'react';
import { RentalCard } from 'components/rental-card';
import { ImageUpload } from 'components/image-upload';

const mockRental = {
  id: '1',
  title: 'Rossignol Experience 88 Ti',
  price: 45,
  image_url: 'https://picsum.photos/400/300',
  owner_id: 'user-123',
  owner: { full_name: 'John Doe', email: 'john@example.com' }
};

const mockRentalNoImage = {
  id: '2',
  title: 'K2 Mindbender 99Ti',
  price: 55,
  image_url: null,
  owner_id: 'user-123',
  owner: { full_name: 'Jane Smith', email: 'jane@example.com' }
};

const mockAdmin = { id: 'admin-1', role: 'admin' };
const mockOwner = { id: 'user-123', role: 'renter' };
const mockOtherUser = { id: 'other-456', role: 'renter' };

export default function TestPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Component Tests</h1>
        <p className="text-gray-500">Testing RentalCard, DeleteButton, and ImageUpload components</p>
      </div>
      
      {/* RentalCard Tests */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">RentalCard Component</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-3">Anonymous User (No Delete)</p>
            <RentalCard rental={mockRental} userProfile={null} />
          </div>
          
          <div>
            <p className="text-sm text-gray-500 mb-3">Admin User (Has Delete)</p>
            <RentalCard rental={mockRental} userProfile={mockAdmin} />
          </div>
          
          <div>
            <p className="text-sm text-gray-500 mb-3">Owner (Has Delete)</p>
            <RentalCard rental={mockRental} userProfile={mockOwner} />
          </div>
          
          <div>
            <p className="text-sm text-gray-500 mb-3">Other Renter (No Delete)</p>
            <RentalCard rental={mockRental} userProfile={mockOtherUser} />
          </div>
        </div>
        
        <div className="max-w-xs">
          <p className="text-sm text-gray-500 mb-3">No Image (Placeholder)</p>
          <RentalCard rental={mockRentalNoImage} userProfile={null} />
        </div>
      </section>
      
      {/* ImageUpload Test */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">ImageUpload Component</h2>
        
        <div className="max-w-md">
          <ImageUpload onFileSelect={setSelectedFile} />
          
          {selectedFile && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-2xl">
              <p className="text-green-700 font-medium">
                ✅ File selected: {selectedFile.name}
              </p>
              <p className="text-green-600 text-sm">
                Size: {Math.round(selectedFile.size / 1024)}KB
              </p>
            </div>
          )}
        </div>
      </section>
      
      {/* Test Checklist */}
      <section className="bg-white rounded-[24px] p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Checklist</h2>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <span className="w-5 h-5 rounded border border-gray-300 flex items-center justify-center">✓</span>
            <span>RentalCard renders with image</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-5 h-5 rounded border border-gray-300 flex items-center justify-center">✓</span>
            <span>RentalCard shows ski emoji when no image</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-5 h-5 rounded border border-gray-300 flex items-center justify-center">✓</span>
            <span>Delete button visible for admin</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-5 h-5 rounded border border-gray-300 flex items-center justify-center">✓</span>
            <span>Delete button visible for owner</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-5 h-5 rounded border border-gray-300 flex items-center justify-center">✓</span>
            <span>Delete button hidden for other users</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-5 h-5 rounded border border-gray-300 flex items-center justify-center">✓</span>
            <span>ImageUpload accepts files on click</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-5 h-5 rounded border border-gray-300 flex items-center justify-center">✓</span>
            <span>ImageUpload shows preview after selection</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
