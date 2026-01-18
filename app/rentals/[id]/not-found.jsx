import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Listing Not Found</h1>
        <p className="text-gray-500 mb-8 max-w-sm mx-auto">
          This rental listing doesn't exist or has been removed.
        </p>
        <Link 
          href="/"
          className="inline-flex px-8 py-4 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-all shadow-md"
        >
          Browse Available Gear
        </Link>
      </div>
    </div>
  );
}
