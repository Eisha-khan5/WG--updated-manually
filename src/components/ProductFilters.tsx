
import React, { useState, useEffect } from 'react';
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
import { getBrands, getCategories, getFabrics, getColors, getMaxPrice } from '@/services/productService';

interface FilterProps {
  onFilterChange: (filters: FilterState) => void;
  sortBy: SortOption;
  onSortChange: (sortBy: SortOption) => void;
  initialCategory?: string;
  initialIsNew?: boolean;
  onReset?: () => void;
}

export interface FilterState {
  priceRange: [number, number];
  brands: string[];
  categories: string[];
  fabricTypes: string[];
  colors: string[];
}

const ProductFilters: React.FC<FilterProps> = ({
  onFilterChange,
  sortBy,
  onSortChange,
  initialCategory,
  initialIsNew,
  onReset
}) => {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [maxPrice, setMaxPrice] = useState(25000);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 25000],
    brands: [],
    categories: initialCategory ? [initialCategory] : [],
    fabricTypes: [],
    colors: [],
  });

  // Sync with initialCategory changes
  useEffect(() => {
    if (initialCategory && !filters.categories.includes(initialCategory)) {
      setFilters(prev => ({
        ...prev,
        categories: [initialCategory]
      }));
    }
  }, [initialCategory]);

  // Dynamic filter options from Supabase
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableFabrics, setAvailableFabrics] = useState<string[]>([]);
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Load filter options from database
  useEffect(() => {
    const loadFilterOptions = async () => {
      setLoading(true);
      try {
        console.log('Loading filter options from database...');

        const [brands, categories, fabrics, colors, maxPriceValue] = await Promise.all([
          getBrands(),
          getCategories(),
          getFabrics(),
          getColors(),
          getMaxPrice()
        ]);

        console.log('Filter options loaded:', {
          brands: brands.length,
          categories: categories.length,
          fabrics: fabrics.length,
          colors: colors.length,
          maxPrice: maxPriceValue
        });
        console.log('All colors:', colors);

        setAvailableBrands(brands);
        setAvailableCategories(categories);
        setAvailableFabrics(fabrics);
        setAvailableColors(colors);
        setMaxPrice(maxPriceValue);

        // Update price range if needed
        setFilters(prev => ({
          ...prev,
          priceRange: [0, maxPriceValue] as [number, number]
        }));
      } catch (error) {
        console.error('Error loading filter options:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFilterOptions();
  }, []);

  const handlePriceChange = (value: number[]) => {
    const newFilters: FilterState = {
      ...filters,
      priceRange: [value[0], value[1]] as [number, number]
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleCheckboxChange = (
    category: 'brands' | 'categories' | 'fabricTypes' | 'colors',
    value: string,
    checked: boolean
  ) => {
    const newFilters: FilterState = { ...filters };

    if (checked) {
      newFilters[category] = [...newFilters[category], value];
    } else {
      newFilters[category] = newFilters[category].filter(item => item !== value);
    }

    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters: FilterState = {
      priceRange: [0, maxPrice],
      brands: [],
      categories: [],
      fabricTypes: [],
      colors: [],
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);

    // Call parent reset handler to clear search and URL params
    if (onReset) {
      onReset();
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

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

      {/* Filter container */}
      <div className={`${isFilterVisible ? 'block' : 'hidden'} md:block`}>
        <div className="flex items-center justify-between mb-4">
          <Button
            className='bg-navy-500 text-white px-4 py-2 text-sm hover:bg-stone-600 transition' 
            variant="ghost" 
            size="sm" 
            onClick={resetFilters}
          >
            Reset
          </Button>
        </div>

        {/* Sorting Controls */}
        <div className="mb-6">
          <SortingControls sortBy={sortBy} onSortChange={onSortChange} />
        </div>

        {/* Accordion for collapsible filter sections */}
        <Accordion type="single" collapsible className="w-full">
          {/* Price Range Filter */}
          <AccordionItem value="price">
            <AccordionTrigger>Price Range</AccordionTrigger>
            <AccordionContent>
              <div className="py-4">
                <Slider
                  defaultValue={[0, maxPrice]}
                  max={maxPrice}
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
          {availableBrands.length > 0 && (
            <AccordionItem value="brands">
              <AccordionTrigger>Brands ({availableBrands.length})</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                  {availableBrands.map((brand) => (
                    <div key={brand} className="flex items-center space-x-2">
                      <Checkbox
                        id={`brand-${brand}`}
                        checked={filters.brands.includes(brand)}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange('brands', brand, checked === true)
                        }
                      />
                      <Label htmlFor={`brand-${brand}`} className="text-sm cursor-pointer">
                        {brand}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Categories Filter */}
          {availableCategories.length > 0 && (
            <AccordionItem value="categories">
              <AccordionTrigger>Categories ({availableCategories.length})</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                  {availableCategories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category}`}
                        checked={filters.categories.includes(category)}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange('categories', category, checked === true)
                        }
                      />
                      <Label htmlFor={`category-${category}`} className="text-sm cursor-pointer">
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Fabric Filter */}
          {availableFabrics.length > 0 && (
            <AccordionItem value="fabric">
              <AccordionTrigger>Fabric ({availableFabrics.length})</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                  {availableFabrics.map((fabric) => (
                    <div key={fabric} className="flex items-center space-x-2">
                      <Checkbox
                        id={`fabric-${fabric}`}
                        checked={filters.fabricTypes.includes(fabric)}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange('fabricTypes', fabric, checked === true)
                        }
                      />
                      <Label htmlFor={`fabric-${fabric}`} className="text-sm cursor-pointer">
                        {fabric}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Colors Filter */}
          {availableColors.length > 0 && (
            <AccordionItem value="colors">
              <AccordionTrigger>Colors ({availableColors.length})</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                  {availableColors.map((color) => (
                    <div key={color} className="flex items-center space-x-2">
                      <Checkbox
                        id={`color-${color}`}
                        checked={filters.colors.includes(color)}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange('colors', color, checked === true)
                        }
                      />
                      <Label htmlFor={`color-${color}`} className="text-sm cursor-pointer">
                        <span className="flex items-center">
                          <span
                            className="w-3 h-3 inline-block rounded-full mr-2 border"
                            style={{
                              backgroundColor: color.toLowerCase(),
                              borderColor: color.toLowerCase() === 'white' ? '#ddd' : 'transparent'
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
          )}
        </Accordion>
      </div>
    </>
  );
};

export default ProductFilters;
