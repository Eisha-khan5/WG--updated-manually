import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductFilters, { FilterState } from '@/components/ProductFilters';
import { fetchProductsPaginated } from '@/services/productService';
import { nlpSearch } from '@/services/nlpSearchService';
import { trackSearch } from '@/services/searchTrackingService';
import SearchBar from '@/components/search/SearchBar';
import ViewToggle from '@/components/search/ViewToggle';
import ProductTable from '@/components/search/ProductTable';
import ProductGrid from '@/components/search/ProductGrid';
import ProductList from '@/components/search/ProductList';
import LoadingSkeleton from '@/components/search/LoadingSkeleton';
import NoResults from '@/components/search/NoResults';
import { SortOption } from '@/components/search/SortingControls';
import { ProductProps } from '@/components/ProductCard';
import { motion } from 'framer-motion';

const ITEMS_PER_PAGE = 20;

const SearchResults: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || '';

  const isNewParam = searchParams.get('isNew') === 'true';
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [sortedProducts, setSortedProducts] = useState<ProductProps[]>([]);
  const [view, setView] = useState<'grid' | 'list' | 'table'>('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [currentFilters, setCurrentFilters] = useState<FilterState>({
    priceRange: [0, 25000],
    brands: [],
    categories: [],
    fabricTypes: [],
    colors: [],
  });
  const [extractedEntities, setExtractedEntities] = useState<any>(null);
  const [totalCount, setTotalCount] = useState(0);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const seenKeysRef = useRef<Set<string>>(new Set());
  const initialLoadCompletedRef = useRef<boolean>(false); // guards observer attach until initial load done

  const getProductKey = (p: ProductProps) => p.productUrl || p.id;

  // Sorting helper
  // Function to sort products based on the selected option
  const sortProducts = useCallback((items: ProductProps[], sortOption: SortOption) => {
    const sorted = [...items];
    switch (sortOption) {
      case 'price-low-high':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high-low':
        return sorted.sort((a, b) => b.price - a.price);
      case 'newest':
        // Don't filter here - handled by backend fetch with isNew=true
        return sorted;
      case 'discounted':
        return sorted.sort((a, b) => {
          const discountA: number = a.discount || 0;
          const discountB: number = b.discount || 0;
          return discountB - discountA;
        });
      default:
        return sorted;
    }
  }, []);

  // Consolidated fetch function that supports two return shapes:
  // - service returns array
  // - service returns { results, total }
  const fetchResults = useCallback(
    async (
      query: string,
      category: string,
      isNew: boolean,
      filters: FilterState,
      offset = 0,
      limit = ITEMS_PER_PAGE
    ) => {
      // Abort previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;
      const requestId = Date.now();

      console.debug('[SearchResults] fetchResults start', { requestId, query, category, offset, limit, filters });

      try {
        let results: ProductProps[] = [];
        let total = 0;

        // NLP-based search when textual query exists and no category/isNew
        if (query && !category && !isNew) {
          console.debug('[SearchResults] using NLP search', { query });
          const nlpResponse = await nlpSearch(query, limit, offset, { signal });
          // Expecting { products, entities, total } from nlpSearch. Be defensive:
          if (Array.isArray(nlpResponse)) {
            results = nlpResponse as ProductProps[];
            total = results.length;
            setExtractedEntities(null);
          } else {
            results = nlpResponse.products || nlpResponse.results || [];
            setExtractedEntities(nlpResponse.entities || null);
            total = typeof nlpResponse.total === 'number' ? nlpResponse.total : results.length;
          }
          console.debug('[SearchResults] nlpResponse', { requestId, got: results.length, total });
        } else {
          // Filter-based fetch
          let finalFilters = { ...filters };
          if (category) {
            // keep categories as array to send to backend
            finalFilters = { ...finalFilters, categories: [category] };
            console.debug('[SearchResults] category filter applied', category);
          }

          const searchTerm = query || '';
          const backendResponse = await fetchProductsPaginated(offset, limit, finalFilters, searchTerm, isNew, { signal });

          if (Array.isArray(backendResponse)) {
            results = backendResponse as ProductProps[];
            total = results.length;
          } else {
            results = backendResponse.results || backendResponse.products || [];
            total = typeof backendResponse.total === 'number' ? backendResponse.total : results.length;
          }
          setExtractedEntities(null);
          console.debug('[SearchResults] filter-based response', { requestId, got: results.length, total });
        }

        return { results, total, requestId };
      } catch (err: any) {
        if (err?.name === 'AbortError') {
          console.debug('[SearchResults] fetch aborted', { requestId });
          throw err;
        }
        console.error('[SearchResults] fetch error', err);
        throw err;
      }
    },
    []
  );

  // Initial load / URL param change
  useEffect(() => {
    const loadInitialProducts = async () => {
      setIsLoading(true);
      setPage(0);
      setHasMore(true);
      console.log('Loading initial products...');

      try {
        const filters = categoryParam ? { ...currentFilters, categories: [categoryParam] } : currentFilters;
        const results = await fetchProductsPaginated(0, ITEMS_PER_PAGE, filters, queryParam);

        console.log('Initial products loaded:', results.length);
        setProducts(results);
        setSortedProducts(sortProducts(results, sortBy));
        setHasMore(results.length === ITEMS_PER_PAGE);
      } catch (error) {
        console.error('Error loading products:', error);
        setProducts([]);
        setSortedProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialProducts();
  }, [queryParam, categoryParam]);

  // Load more (infinite scroll)
  // Load more products for infinite scroll
  const loadMoreProducts = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    console.log('Loading more products, page:', page + 1);

    try {
      const nextPage = page + 1;
      const offset = nextPage * ITEMS_PER_PAGE;
      const filters = categoryParam ? { ...currentFilters, categories: [categoryParam] } : currentFilters;
      const results = await fetchProductsPaginated(offset, ITEMS_PER_PAGE, filters, queryParam);

      console.log('More products loaded:', results.length);

      if (results.length > 0) {
        setProducts(prev => [...prev, ...results]);
        setPage(nextPage);
        setHasMore(results.length === ITEMS_PER_PAGE);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more products:', error);
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  }, [page, hasMore, isLoadingMore, currentFilters, queryParam, categoryParam]);

  // sortedProducts update
  useEffect(() => {
    setSortedProducts(sortProducts(products, sortBy));
  }, [products, sortBy, sortProducts]);


  // Setup intersection observer for infinite scroll
  useEffect(() => {
    if (isLoading) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMoreProducts();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isLoading, hasMore, isLoadingMore, loadMoreProducts]);

  // Search submit (user initiated)
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      return;
    }

    trackSearch(searchQuery);
    // update URL -> triggers initial load effect above
    setSearchParams({ q: searchQuery });
  };

  // Reset filters (user action)
  const handleReset = () => {
    console.debug('[SearchResults] Reset triggered by user');
    setSearchQuery('');
    setCurrentFilters({
      priceRange: [0, 25000],
      brands: [],
      categories: [],
      fabricTypes: [],
      colors: [],
    });
    // Clearing search params triggers initial load effect
    setSearchParams({});
  };

  // Handle filter changes (user initiated)
  const handleFilterChange = async (filters: FilterState) => {
    console.log('Applying filters:', filters);
    setCurrentFilters(filters);
    setIsLoading(true);
    setPage(0);
    setHasMore(true);

    try {
      const filterParams = {
        priceRange: filters.priceRange,
        brands: filters.brands,
        categories: filters.categories,
        fabricTypes: filters.fabricTypes,
        colors: filters.colors,
      };

      const additionalCategories = categoryParam ? [categoryParam] : [];
      const allCategories = [...(filters.categories || []), ...additionalCategories];
      const finalFilters = { ...filterParams, categories: allCategories.length > 0 ? allCategories : undefined };

      const results = await fetchProductsPaginated(0, ITEMS_PER_PAGE, finalFilters, queryParam);
      console.log('Filtered results:', results.length);
      setProducts(results);
      setSortedProducts(sortProducts(results, sortBy));
      setHasMore(results.length === ITEMS_PER_PAGE);
    } catch (error) {
      console.error('Error applying filters:', error);
      setProducts([]);
      setSortedProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSortChange = async (newSortBy: SortOption) => {
    console.debug('[SearchResults] sort change', newSortBy);
    setSortBy(newSortBy);

    // If 'newest' is selected, refetch from backend with isNew filter
    if (newSortBy === 'newest') {
      setIsLoading(true);
      setPage(0);
      setHasMore(true);
      seenKeysRef.current = new Set();

      try {
        const results = await fetchProductsPaginated(0, ITEMS_PER_PAGE, currentFilters, queryParam, true);

        results.forEach(p => {
          const key = getProductKey(p);
          seenKeysRef.current.add(key);
        });

        setProducts(results);
        setSortedProducts(results); // Already filtered by backend, no need to sort
        setHasMore(results.length === ITEMS_PER_PAGE);
      } catch (error) {
        console.error('Error loading newest products:', error);
        setProducts([]);
        setSortedProducts([]);
      } finally {
        setIsLoading(false);
      }
    } else if (newSortBy === 'default') {
      // Reset to default: refetch without isNew filter
      setIsLoading(true);
      setPage(0);
      setHasMore(true);
      seenKeysRef.current = new Set();

      try {
        const results = await fetchProductsPaginated(0, ITEMS_PER_PAGE, currentFilters, queryParam, false);

        results.forEach(p => {
          const key = getProductKey(p);
          seenKeysRef.current.add(key);
        });

        setProducts(results);
        setSortedProducts(results);
        setHasMore(results.length === ITEMS_PER_PAGE);
      } catch (error) {
        console.error('Error loading products:', error);
        setProducts([]);
        setSortedProducts([]);
      } finally {
        setIsLoading(false);
      }
    }
    // For other sort options (price, discount), just sort the existing products client-side
  };

  const renderProductView = () => {
    if (isLoading) return <LoadingSkeleton />;

    if (sortedProducts.length === 0) return <NoResults />;

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
      productUrl: product.productUrl || '',
      style: product.style || '',
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
                    isNewParam ? 'New Arrivals' :
                      'All Products'}
              </h1>
              <p className="text-gray-600 mt-1">
                {sortedProducts.length} items found
              </p>
            </div>

            <ViewToggle view={view} setView={setView} />
          </motion.div>

          <div className="flex gap-6">
            <aside className="hidden md:block w-64 flex-shrink-0">
              <div className="bg-white p-5 rounded-lg shadow-sm sticky top-4">
                <h3 className="font-medium text-lg mb-4">Filters</h3>
                <ProductFilters
                  onFilterChange={handleFilterChange}
                  sortBy={sortBy}
                  onSortChange={handleSortChange}
                  initialCategory={categoryParam}
                  initialIsNew={isNewParam}
                  onReset={handleReset}
                />
              </div>
            </aside>

            <div className="flex-1">
              <div className="md:hidden mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <ProductFilters
                    onFilterChange={handleFilterChange}
                    sortBy={sortBy}
                    onSortChange={handleSortChange}
                    initialCategory={categoryParam}
                    initialIsNew={isNewParam}
                    onReset={handleReset}
                  />
                </div>
              </div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                {renderProductView()}
              </motion.div>

              {/* Infinite scroll trigger */}
              {!isLoading && hasMore && (
                <div ref={loadMoreRef} className="py-8 text-center">
                  {isLoadingMore && (
                    <div className="flex justify-center items-center gap-2">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-muted-foreground">Loading more products...</span>
                    </div>
                  )}
                </div>
              )}

              {!isLoading && !hasMore && products.length > 0 && (
                <div className="py-8 text-center text-muted-foreground">
                  You've reached the end of the results
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SearchResults;
