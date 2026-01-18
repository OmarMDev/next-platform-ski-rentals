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
        className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
          dragActive 
            ? 'border-[#7C9C95] bg-[#7C9C95]/5' 
            : 'border-gray-200 hover:border-gray-300 bg-gray-50'
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
          <div className="relative w-full aspect-[4/3]">
            <Image 
              src={preview} 
              alt="Preview" 
              fill 
              className="object-contain rounded-xl"
            />
            <button
              type="button"
              onClick={clearImage}
              className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="py-8">
            <div className="w-16 h-16 bg-[#7C9C95]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#7C9C95]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-700 font-medium">
              Drag and drop an image, or click to select
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Max 5MB • JPG, PNG, or WebP
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
