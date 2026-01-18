'use client';

import { useState } from 'react';
import { updateProfileName } from './actions';

export function EditNameForm({ currentName }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentName || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('fullName', name);
    
    const result = await updateProfileName(formData);
    
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setIsEditing(false);
      setLoading(false);
    }
  }

  if (!isEditing) {
    return (
      <div className="flex items-center gap-3">
        <p className="font-semibold text-xl text-gray-900">
          {currentName || 'Name not set'}
        </p>
        <button
          onClick={() => setIsEditing(true)}
          className="p-1.5 text-gray-400 hover:text-[#7C9C95] hover:bg-[#7C9C95]/10 rounded-full transition-colors"
          title="Edit name"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="px-3 py-1.5 border border-gray-200 rounded-lg text-lg font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#7C9C95] focus:border-transparent"
          placeholder="Enter your name"
          autoFocus
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="p-2 bg-[#7C9C95] text-white rounded-lg hover:bg-[#6a8a83] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Save"
        >
          {loading ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
        <button
          type="button"
          onClick={() => {
            setIsEditing(false);
            setName(currentName || '');
            setError(null);
          }}
          disabled={loading}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          title="Cancel"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </form>
  );
}
