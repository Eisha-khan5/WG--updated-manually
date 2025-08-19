
import React from 'react';
import { useNavigate } from 'react-router-dom'; // import navigation hook from react-router-dom to navigate between pages
import { Button } from "@/components/ui/button"; // Reusable button component
import { Search, RefreshCw } from 'lucide-react'; // icons

// Component to show when no search results are found
const NoResults: React.FC = () => {
  const navigate = useNavigate(); // (hook) For navigation

  return (
      // Centered message box
    <div className="text-center py-16 bg-white rounded-lg border border-gray-100 shadow-sm">

       {/* Search Icon inside a circle */}
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Search className="h-8 w-8 text-gray-400" />
      </div>

       {/* Main heading */}
      <h2 className="text-2xl font-medium font-serif mb-2">No products found</h2>
      {/* Subheading */}
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        We couldn't find any products matching your search criteria. Try adjusting your filters or search terms.
      </p>

      {/* Action buttons */}
      <div className="flex gap-4 justify-center">
        {/* ('/') means navigate to the home page */}
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Start over
        </Button>
        <Button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2"
        >
          <Search className="h-4 w-4" />
          Browse all
        </Button>
      </div>
    </div>
  );
};

export default NoResults;
