
import React from 'react';

// Component to show a loading skeleton while data is being fetched
const LoadingSkeleton: React.FC = () => {
  return (
     // Grid layout for 6 skeleton cards
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) =>
      (
         // Each box looks like a product card
        <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
          
            {/* Placeholder for product image */}
          <div className="aspect-[3/4] bg-gray-200"></div>

           {/* Placeholder for product details */}
          <div className="p-4">
            <div className="h-4 bg-gray-200 rounded mb-2 w-1/3"></div> {/* title line */}
            <div className="h-5 bg-gray-200 rounded mb-4"></div>  {/* subtitle line */}
            <div className="h-4 bg-gray-200 rounded w-1/4"></div> {/* price or tag line */} 
          </div>
        </div>
      ))
      }
    </div>
  );
};

export default LoadingSkeleton;
