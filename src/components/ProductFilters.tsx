
import React, { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Filter } from 'lucide-react';
import SortingControls, { SortOption } from '@/components/search/SortingControls';

// Define props interface
interface FilterProps {
  onFilterChange: (filters: FilterState) => void; // Callback when filter state changes
  sortBy: SortOption;
  onSortChange: (sortBy: SortOption) => void;
}

export interface FilterState {
  priceRange: [number, number]; // Tuple for price range with exactly two elements
  brands: string[];
  categories: string[];
  fabricTypes: string[];
  colors: string[];
  style: string[]; // Optional styles filter
}

// Main ProductFilters component
const ProductFilters: React.FC<FilterProps> = ({ onFilterChange, sortBy, onSortChange }) => {
  // State to toggle visibility of filters on small screens
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  // State to hold current filters
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 25000],
    brands: [],
    categories: [],
    fabricTypes: [],
    colors: [],
    style: [],
  });

  // Predefined filter options
  const brands = ["Khaadi", "Sapphire", "Gul Ahmed", "Alkaram", "J.","Sana Safinaz", "LimeLight", "Warda"];
  const categories = ["Kurta", "Shalwar Kameez", "Lehnga", "Saree", "Dupatta", "Western", "Co-ord Set"];
  const fabricTypes = ["Cotton", "Lawn", "Silk", "Chiffon", "Organza", "Velvet"];
  const colors = ["Red", "Blue", "Green", "Yellow", "Orange", "Purple", "Black", "White", "Pink", "Gray ", "Brown", "Beige"];
  const styles = ["Casual", "Printed", "Embroidered", "Shalwar Suit", "Formal", "Western", "Party Wear"];

  // Handle price range slider value change
  const handlePriceChange = (value: number[]) => {
    // Make sure we explicitly cast the price range as a tuple with exactly 2 elements
    const newFilters: FilterState = {
      ...filters,
      priceRange: [value[0], value[1]] as [number, number]
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Handle checkbox toggle for brand, category, fabric, color
  const handleCheckboxChange = (
    category: 'brands' | 'categories' | 'fabricTypes' | 'colors' | 'style',
    value: string,
    checked: boolean
  ) => {
    const newFilters: FilterState = { ...filters };

    if (checked) {
      newFilters[category] = [...newFilters[category], value]; // Add selected
    } else {
      newFilters[category] = newFilters[category].filter(item => item !== value); // Remove unselected
    }

    setFilters(newFilters);
    onFilterChange(newFilters); // Trigger callback
  };

  // Reset all filters to default state
  const resetFilters = () => {
    const defaultFilters: FilterState = {
      priceRange: [0, 25000],
      brands: [],
      categories: [],
      fabricTypes: [],
      colors: [],
      style: [],
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <>
      {/* Toggle filter visibility button for small screens */}
      <Button
        variant="outline"
        className="flex md:hidden items-center gap-2 mb-4"
        onClick={() => setIsFilterVisible(!isFilterVisible)}
      >
        <Filter size={18} />
        Filters
      </Button>

      {/* Filter container, responsive handling */}
      <div className={`${isFilterVisible ? 'block' : 'hidden'} md:block`}>
        <div className="flex items-center justify-between mb-4 ">
          <Button
           className='bg-navy-500 text-white px-4 py-2 text-sm hover:bg-stone-600 transition' 
           variant="ghost" size="sm" onClick={resetFilters}>
            Reset
          </Button>
        </div>

        {/* Sorting Controls - Now properly aligned */}
        <div className="mb-6">
          <SortingControls sortBy={sortBy} onSortChange={onSortChange} />
        </div>

        {/* Accordion UI for collapsible filter sections */}
        <Accordion type="single" collapsible className="w-full">
          {/* Price Range Filter */}
          <AccordionItem value="price">
            <AccordionTrigger>Price Range</AccordionTrigger>
            <AccordionContent>
              <div className="py-4">
                <Slider
                  defaultValue={[0, 25000]}
                  max={25000}
                  step={500}
                  value={[filters.priceRange[0], filters.priceRange[1]]}
                  onValueChange={handlePriceChange}
                  className="my-6"
                />
                <div className="flex items-center justify-between">
                  <span>Rs. {filters.priceRange[0].toLocaleString()}</span>
                  <span>Rs. {filters.priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Brands Filter */}
          <AccordionItem value="brands">
            <AccordionTrigger>Brands</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 gap-2">
                {brands.map((brand) => (
                  <div key={brand} className="flex items-center space-x-2">
                    <Checkbox
                      id={`brand-${brand}`}
                      checked={filters.brands.includes(brand)}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange('brands', brand, checked === true)
                      }
                    />
                    <Label htmlFor={`brand-${brand}`} className="text-sm">{brand}</Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Categories Filter */}
          <AccordionItem value="categories">
            <AccordionTrigger>Categories</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 gap-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={filters.categories.includes(category)}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange('categories', category, checked === true)
                      }
                    />
                    <Label htmlFor={`category-${category}`} className="text-sm">{category}</Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Fabric Filter */}
          <AccordionItem value="fabric">
            <AccordionTrigger>Fabric</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 gap-2">
                {fabricTypes.map((fabric) => (
                  <div key={fabric} className="flex items-center space-x-2">
                    <Checkbox
                      id={`fabric-${fabric}`}
                      checked={filters.fabricTypes.includes(fabric)}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange('fabricTypes', fabric, checked === true)
                      }
                    />
                    <Label htmlFor={`fabric-${fabric}`} className="text-sm">{fabric}</Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Colors Filter */}
          <AccordionItem value="colors">
            <AccordionTrigger>Colors</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 gap-2">
                {colors.map((color) => (
                  <div key={color} className="flex items-center space-x-2">
                    <Checkbox
                      id={`color-${color}`}
                      checked={filters.colors.includes(color)}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange('colors', color, checked === true)
                      }
                    />
                    <Label htmlFor={`color-${color}`} className="text-sm">
                      <span className="flex items-center">
                        <span
                          className="w-3 h-3 inline-block rounded-full mr-2"
                          style={{
                            backgroundColor: color.toLowerCase(),
                            border: color.toLowerCase() === 'white' ? '1px solid #ddd' : 'none'
                          }}
                        />
                        {color}
                      </span>
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Style Filter */}
          <AccordionItem value="style">
            <AccordionTrigger>Style</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 gap-2">
                {styles.map((style) => (
                  <div key={style} className="flex items-center space-x-2">
                    <Checkbox
                      id={`style-${style}`}
                      checked={filters.style.includes(style)}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange('style', style, checked === true)
                      }
                    />
                    <Label htmlFor={`style-${style}`} className="text-sm">{style}</Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </div>
    </>
  );
};

export default ProductFilters;
