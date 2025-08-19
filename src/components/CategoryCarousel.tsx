
import React from 'react';
import { useNavigate } from 'react-router-dom';

// Import carousel components from UI library
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  //CarouselNext,
  //CarouselPrevious
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
}

// Define props expected by the CategoryCarousel component
interface CategoryCarouselProps {
  categories: CategoryItem[]; // Array of category items to show
  className?: string;  // Optional custom className
  title?: string;   // Optional title to show above the carousel
}

// Functional component definition
const CategoryCarousel: React.FC<CategoryCarouselProps> = ({ categories, className, title }) => {
  const navigate = useNavigate();


  // Function to handle click on a category
  const handleCategoryClick = (category: string) => {
    navigate(`/search?q=${encodeURIComponent(category)}`); // Navigates to search page with selected category name as query parameter
  };

  return (
    // Outer container with custom class and padding
    <div className={cn("px-4 py-6", className)}>
      {title && (
        <h2 className="text-2xl font-serif font-medium mb-4 text-center md:text-left md:ml-4">{title}</h2>
      )}
      {/* Main carousel wrapper */}
      <Carousel
        opts={{ 
          align: "start", // Align items to the start
          loop: true,  // Enable looping of carousel items
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-1 md:-ml-4 ">
          {/* Map through all categories and render each as a carousel item */}
          {categories.map((category, index) => (
            <CarouselItem key={index} className="pl-10 md:pl-10 basis-1/2 sm:basis-1/4 md:basis-1/5 lg:basis-40">

              {/* Each item is clickable and navigates on click */}
              <div
                className="cursor-pointer flex flex-col items-center group"
                onClick={() => handleCategoryClick(category.name)}
              >
                {/* Circle image with border and shadow */}
                <div className="overflow-hidden rounded-full border border-neutral-200 shadow-sm "
                  style={{ width: "130px", height: "130px"}} >
                  <AspectRatio ratio={1} className="bg-neutral-50">
                    <img
                      src={category.image}  // Image of category
                      alt={category.name}   // Alt text for accessibility
                      className="object-cover w-80 h-30 transition-transform duration-300 group-hover:scale-110"
                      // loading="lazy"  // Lazy load images for performance
                    />
                  </AspectRatio>
                </div>

                {/* Category name */}
                <span className="mt-2 text-sm font-medium text-center">{category.name}</span>

                {/* Category description */}
                {category.description && (
                  <span className="text-xs text-gray-500 text-center mt-1">{category.description}</span>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Previous button: only visible on larger screens */}
        {/*<CarouselPrevious className="hidden sm:flex -left-4 md:-left-6" />
         Next button: only visible on larger screens 
        <CarouselNext className="hidden sm:flex -right-4 md:-right-6" />*/}
      </Carousel>
    </div>
  );
};

export default CategoryCarousel;
