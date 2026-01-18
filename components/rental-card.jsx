import Link from 'next/link';
import Image from 'next/image';
import { DeleteButton } from './delete-button';
import { EditButton } from './edit-button';

export function RentalCard({ rental, userProfile }) {
  return (
    <div className="bg-white rounded-[24px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {rental.image_url ? (
          <Image 
            src={rental.image_url} 
            alt={rental.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#7C9C95]/20 to-[#A4B4A8]/20 flex items-center justify-center">
            <span className="text-5xl">🎿</span>
          </div>
        )}
        
        {/* Price Tag */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm">
          <span className="font-bold text-gray-900">€{rental.price}</span>
          <span className="text-sm text-gray-500">/day</span>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-5">
        <h3 className="font-semibold text-lg text-gray-900 mb-1 truncate">{rental.title}</h3>
        
        {rental.owner && (
          <p className="text-sm text-gray-500 mb-4">
            by {rental.owner?.full_name || rental.owner?.email?.split('@')[0]}
          </p>
        )}
        
        <div className="flex items-center gap-2">
          <Link 
            href={`/rentals/${rental.id}`} 
            className="flex-1 text-center py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors text-sm font-medium"
          >
            Details
          </Link>
          
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
    </div>
  );
}
