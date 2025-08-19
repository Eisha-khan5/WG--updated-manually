import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductFilters, { FilterState } from '@/components/ProductFilters';
import { searchProducts, filterProducts } from '@/services/productService';
import SearchBar from '@/components/search/SearchBar';
import ViewToggle from '@/components/search/ViewToggle';
import ProductTable from '@/components/search/ProductTable';
import ProductGrid from '@/components/search/ProductGrid';
import ProductList from '@/components/search/ProductList';
import LoadingSkeleton from '@/components/search/LoadingSkeleton';
import NoResults from '@/components/search/NoResults';
import { SortOption } from '@/components/search/SortingControls';
import { ProductProps } from "@/components/ProductCard";
import { motion } from 'framer-motion';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || '';

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductProps[]>([]);
  const [sortedProducts, setSortedProducts] = useState<ProductProps[]>([]);
  const [view, setView] = useState<'grid' | 'list' | 'table'>('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [currentFilters, setCurrentFilters] = useState<FilterState>({
    priceRange: [0, 25000],
    brands: [],
    categories: [],
    fabricTypes: [],
    colors: [],
    style :[],
  });

  // Function to sort products based on the selected option
  const sortProducts = (products: ProductProps[], sortOption: SortOption): ProductProps[] => {
    const sorted = [...products];

    switch (sortOption) {
      case 'price-low-high':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high-low':
        return sorted.sort((a, b) => b.price - a.price);
      case 'newest':
        return sorted
          .filter(p => p.isNew === true || p.isNew === undefined)
          .sort((a, b) => Number(b.id) - Number(a.id));

      case 'discounted':
        return sorted
          .filter(p => (p.discount || 0) > 0)
          .sort((a, b) => (b.discount || 0) - (a.discount || 0));
      case 'top-sellers':
        return sorted.sort((a, b) => b.price - a.price);
      default:
        return sorted;
    }
  };

  // Load products when component mounts or when query/category changes
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      console.log('Loading products for query:', queryParam, 'category:', categoryParam);

      try {
        let results: ProductProps[] = [];

        if (queryParam) {
          // Use advanced search for query
          results = await searchProducts(queryParam);
        } else if (categoryParam) {
          // Filter by category using the filter function
          results = await filterProducts({ categories: [categoryParam] });
        } else {
          // Show all products if no query or category
          results = await searchProducts('');
        }

        console.log('Products loaded:', results.length);
        setProducts(results);
        setFilteredProducts(results);
        setSortedProducts(sortProducts(results, sortBy));
      } catch (error) {
        console.error('Error loading products:', error);
        setProducts([]);
        setFilteredProducts([]);
        setSortedProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [queryParam, categoryParam, sortBy]);

  // Update sorted products when filteredProducts or sortBy changes
  useEffect(() => {
    setSortedProducts(sortProducts(filteredProducts, sortBy));
  }, [filteredProducts, sortBy]);

  // Handle search form submission
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      return;
    }

    console.log('Performing search for:', searchQuery);
    setSearchParams({ q: searchQuery });
  };

  // Handle filter changes
  const handleFilterChange = async (filters: FilterState) => {
    console.log('Applying filters:', filters);
    setCurrentFilters(filters);
    setIsLoading(true);

    try {
      // Convert FilterState to the format expected by filterProducts
      const filterParams = {
        priceRange: filters.priceRange,
        brands: filters.brands,
        categories: filters.categories,
        fabricTypes: filters.fabricTypes,
        colors: filters.colors,
        style: filters.style,
      };

      const results = await filterProducts(filterParams, queryParam);
      console.log('Filtered results:', results.length);
      setFilteredProducts(results);
    } catch (error) {
      console.error('Error applying filters:', error);
      setFilteredProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sorting change
  const handleSortChange = (newSortBy: SortOption) => {
    console.log('Changing sort to:', newSortBy);
    setSortBy(newSortBy);
  };

  // Render the product view based on selected view type
  const renderProductView = () => {
    if (isLoading) {
      return <LoadingSkeleton />;
    }

    if (sortedProducts.length === 0) {
      return <NoResults />;
    }

    // Convert Product[] to ProductProps[] for compatibility
    const productProps = sortedProducts.map(product => ({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      category: product.category,
      imageUrl: product.imageUrl,
      fabric: product.fabric,
      color: product.color,
      discount: product.discount,
      isNew: product.isNew,
      gender: product.gender,
    }));

    switch (view) {
      case 'table':
        return <ProductTable products={productProps} />;
      case 'grid':
        return <ProductGrid products={productProps} />;
      case 'list':
        return <ProductList products={productProps} />;
      default:
        return <ProductGrid products={productProps} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow bg-gray-50 py-6">
        <div className="container mx-auto px-4">
          {/* Search bar */}
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearch}
          />

          {/* Header with title and view toggle */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div>
              <h1 className="font-serif text-3xl font-bold">
                {queryParam ? `Results for "${queryParam}"` :
                  categoryParam ? `Category: ${categoryParam}` :
                    'All Products'}
              </h1>
              <p className="text-gray-600 mt-1">
                {sortedProducts.length} items found
              </p>
            </div>

            <ViewToggle view={view} setView={setView} />
          </motion.div>

          {/* Body: sidebar + main products area */}
          <div className="flex gap-6">
            {/* Filters sidebar */}
            <aside className="hidden md:block w-64 flex-shrink-0">
              <div className="bg-white p-5 rounded-lg shadow-sm sticky top-4">
                <h3 className="font-medium text-lg mb-4">Filters</h3>
                <ProductFilters
                  onFilterChange={handleFilterChange}
                  sortBy={sortBy}
                  onSortChange={handleSortChange}
                />
              </div>
            </aside>

            {/* Main content */}
            <div className="flex-1">
              {/* Mobile filters */}
              <div className="md:hidden mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <ProductFilters
                    onFilterChange={handleFilterChange}
                    sortBy={sortBy}
                    onSortChange={handleSortChange}
                  />
                </div>
              </div>

              {/* Product view with animation */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                {renderProductView()}
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SearchResults;
