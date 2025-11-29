
import React from 'react';
import { useNavigate } from 'react-router-dom';

// Import carousel components from UI library
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";

// Utility to maintain aspect ratio of images
import { AspectRatio } from "@/components/ui/aspect-ratio";
// Utility for conditional className handling (optional styling utility)
import { cn } from "@/lib/utils";

// Define the structure of a single category item (TypeScript interface)
interface CategoryItem {
  name: string;
  image: string;
  description?: string;
  count?: number;
}

// Define props expected by the CategoryCarousel component
interface CategoryCarouselProps {
  categories: CategoryItem[]; // Array of category items to show
  className?: string;  // Optional custom className
  title?: string;   // Optional title to show above the carousel
  loading?: boolean; // Loading state
}

// Functional component definition
const CategoryCarousel: React.FC<CategoryCarouselProps> = ({ categories = [], className, title, loading = false }) => {
  const navigate = useNavigate();
  
  // Function to handle click on a category
  const handleCategoryClick = (category: string) => {
    navigate(`/search?category=${encodeURIComponent(category)}`); // Navigates to search page with selected category
  };

  if (loading) {
    return (
      <div className={cn("px-4 py-6", className)}>
        {title && (
          <h2 className="text-2xl font-serif font-medium mb-8 text-center">{title}</h2>
        )}
        <div className="flex gap-6 overflow-hidden justify-center">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="flex-shrink-0 w-32 md:w-40">
              <div className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-full mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className={cn("px-4 py-6", className)}>
        {title && (
          <h2 className="text-2xl font-serif font-medium mb-8 text-center">{title}</h2>
        )}
        <div className="text-center py-8 text-gray-500">
          <p>No categories available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    // Outer container with expanded width
    <div className={cn("px-4 py-4", className)}>
      {title && (
        <h2 className="text-xl font-serif font-medium mb-6 text-center">{title}</h2>
      )}
       {/* Main carousel wrapper - expanded to show 7 circles */}
      <Carousel
        opts={{
          align: "center", // Center align items
          loop: true,  // Enable looping of carousel items
        }}
        className="w-full max-w-6xl mx-auto"
      >
        <CarouselContent className="-ml-2 md:-ml-3">
           {/* Map through all categories and render each as a carousel item - adjusted for 7 items */}
          {categories.map((category, index) => (
            <CarouselItem key={index} className="pl-2 md:pl-3 basis-1/4 sm:basis-1/5 md:basis-1/6 lg:basis-[14.28%]">
              
               {/* Each item is clickable and navigates on click */}
              <div 
                className="cursor-pointer flex flex-col items-center group transition-all duration-300 hover:scale-105"
                onClick={() => handleCategoryClick(category.name)}
              >
                {/* Circle image with border, shadow, and hover effects */}
                <div className="overflow-hidden rounded-full border-2 border-stone-200 w-full shadow-sm group-hover:shadow-md group-hover:border-navy-400 transition-all duration-300">
                  <AspectRatio ratio={1} className="bg-gradient-to-br from-stone-50 to-stone-100">
                    <img 
                      src={category.image || '/placeholder.svg'}  // Image of category with fallback
                      alt={category.name}   // Alt text for accessibility
                      className="object-cover w-90 h-90 transition-all duration-500 group-hover:scale-110"
                      loading="lazy"  // Lazy load images for performance
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                  </AspectRatio>
                </div>

                  {/* Category name with hover effect */}
                <span className="mt-2 text-xs md:text-sm font-medium text-gray-800 text-center capitalize group-hover:text-navy-600 transition-colors duration-300">
                  {category.name}
                </span>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
           {/* Previous button: visible on all screens */}
        <CarouselPrevious className="-left-2 md:-left-3 bg-white/90 hover:bg-white shadow-md border border-stone-200 h-8 w-8" />
           {/* Next button: visible on all screens */}
        <CarouselNext className="-right-2 md:-right-3 bg-white/90 hover:bg-white shadow-md border border-stone-200 h-8 w-8" />
      </Carousel>
    </div>
  );
};

export default CategoryCarousel;
