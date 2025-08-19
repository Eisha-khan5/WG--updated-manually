
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Tag, DollarSign } from 'lucide-react';

export type SortOption = 
  | 'default'
  | 'price-low-high'
  | 'price-high-low'
  | 'newest'
  | 'discounted'
  | 'top-sellers';

interface SortingControlsProps {
  sortBy: SortOption;
  onSortChange: (sortBy: SortOption) => void;
}

const SortingControls: React.FC<SortingControlsProps> = ({ sortBy, onSortChange }) => {
  return (
    <div className="space-y-4 text-left">
      <span className="text-sm font-medium text-gray-700">Sort by</span>
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select sorting option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Default</SelectItem>
          <SelectItem value="price-low-high">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Price: Low to High
            </div>
          </SelectItem>
          <SelectItem value="price-high-low">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Price: High to Low
            </div>
          </SelectItem>
          <SelectItem value="newest">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Newest Arrivals
            </div>
          </SelectItem>
          <SelectItem value="discounted">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Discounted Items
            </div>
          </SelectItem>
          <SelectItem value="top-sellers">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Top Sellers
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SortingControls;
