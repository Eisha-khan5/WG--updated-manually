
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { getPopularSearches, trackSearch, getProductSuggestions } from '@/services/searchTrackingService';

interface SearchHeroProps {
  onSearch: (query: string) => void;
}

const SearchHero: React.FC<SearchHeroProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [popularSearches, setPopularSearches] = useState<string[]>([
    'embroidered lawn suit',
    'blue silk kurta',
    'bridal lehenga under 10000'
  ]);

  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();

  // Custom Pakistani fashion-focused background images
  const backgroundImages = [
    // Pakistani formal wear showcase with traditional patterns
    'https://images.pexels.com/photos/325876/pexels-photo-325876.jpeg',
    
    // Pakistani bridal wear with gold accents
    'https://images.pexels.com/photos/11443064/pexels-photo-11443064.jpeg',
    
    // Pakistani casual wear with contemporary design
    'https://images.pexels.com/photos/6347546/pexels-photo-6347546.jpeg'
  ];

  // Rotate carousel images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  // Hide suggestions when route/path changes
  useEffect(() => {
    setShowSuggestions(false);
    setHighlightedIndex(-1);
  }, [location.pathname]);

  // Load popular searches on mount
  useEffect(() => {
    const loadPopularSearches = async () => {
      const popular = await getPopularSearches(3);
      setPopularSearches(popular);
    };
    loadPopularSearches();
  }, []);

  // Update suggestions whenever user types in search bar
  useEffect(() => {
    const loadSuggestions = async () => {
      if (searchQuery.length >= 2) {
        const productSuggestions = await getProductSuggestions(searchQuery, 8);
        setSuggestions(productSuggestions);
        setShowSuggestions(productSuggestions.length > 0);
        setHighlightedIndex(-1);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
        setHighlightedIndex(-1);
      }
    };

    const timeoutId = setTimeout(loadSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Handle click outside the suggestion box to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle escape key to close suggestions
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      return;
    }

    // Track the search query
    trackSearch(searchQuery);

    onSearch(searchQuery);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
  };

  const handlePopularSearch = (query: string) => {
    setSearchQuery(query);

    // Track the popular search
    trackSearch(query);

    onSearch(query);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
    inputRef.current?.blur();

    // Track the selected suggestion
    trackSearch(suggestion);

    setTimeout(() => {
      onSearch(suggestion);
    }, 0);
  };

  return (
    <div className="relative w-full py-16 md:py-20 lg:py-24 overflow-hidden">
      {/* Background Carousel */}
      <div className="absolute inset-0">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-translate duration-1000 ${
              index === currentImageIndex ? 'opacity-70' : 'opacity-0'
            }`}
            style={{
              
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
        ))}
      </div>

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>

      {/* Carousel Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {backgroundImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>

      {/* Foreground content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.h1
          className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-white drop-shadow-lg"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Discover <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-pink-200">Perfect</span> Pakistani Fashion
        </motion.h1>

        <motion.p
          className="text-base md:text-lg text-white mb-8 max-w-2xl mx-auto drop-shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Search thousands of clothing items across top Pakistani brands with natural language descriptions.
        </motion.p>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex w-full max-w-xl mx-auto gap-2">
          <div className="relative flex-1">
            <Input
              ref={inputRef}
              type="text"
              placeholder="e.g., orange cotton dress with dupatta"
              className="search-input bg-white/95 backdrop-blur-sm border-white/20"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setHighlightedIndex(-1);
              }}
              onFocus={() => searchQuery.length >= 1 && setShowSuggestions(true)}
              onKeyDown={(e) => {
                if (!showSuggestions) return;

                if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  setHighlightedIndex((prev) => (prev + 1) % suggestions.length);
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  setHighlightedIndex((prev) =>
                    prev === -1 ? suggestions.length - 1 : (prev - 1 + suggestions.length) % suggestions.length
                  );
                } else if (e.key === 'Enter') {
                  if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
                    e.preventDefault();
                    handleSelectSuggestion(suggestions[highlightedIndex]);
                  }
                } else if (e.key === 'Escape') {
                  setShowSuggestions(false);
                  setHighlightedIndex(-1);
                  inputRef.current?.blur();
                }
              }}
              aria-autocomplete="list"
              aria-controls="search-suggestions"
              aria-expanded={showSuggestions}
              aria-activedescendant={
                highlightedIndex >= 0 ? `suggestion-${highlightedIndex}` : undefined
              }
            />

            {searchQuery && (
              <Button
                type="button"
                size="icon"
                onClick={() => {
                  setSearchQuery('');
                  setShowSuggestions(false);
                  inputRef.current?.focus();
                }}
                className="absolute right-12 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full hover:bg-gray-200 bg-transparent text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Clear</span>
              </Button>
            )}

            <Button
              type="submit"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-navy-600 to-navy-600 hover:from-stone-600 hover:to-stone-600 h-8 md:h-9 w-9 md:w-9 rounded-full shadow-md"
            >
              <Search className="h-4 md:h-5 w-4 md:w-5" />
              <span className="sr-only">Search</span>
            </Button>

            {/* Auto Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                ref={suggestionsRef}
                id="search-suggestions"
                className="absolute z-50 left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-neutral-100 overflow-hidden"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="max-h-80 overflow-y-auto">
                  <ul className="py-1">
                    {suggestions.map((suggestion, index) => (
                      <motion.li
                        key={index}
                        id={`suggestion-${index}`}
                        className={`px-4 py-2.5 cursor-pointer text-left transition-colors border-b border-neutral-50 last:border-b-0 ${
                          index === highlightedIndex
                            ? 'bg-navy-50 text-navy-900'
                            : 'hover:bg-neutral-50'
                        }`}
                        onClick={() => handleSelectSuggestion(suggestion)}
                        onMouseEnter={() => setHighlightedIndex(index)}
                        whileHover={{ backgroundColor: index === highlightedIndex ? "rgba(243, 244, 246, 0.8)" : "rgba(245, 245, 245, 0.8)" }}
                      >
                        <div className="flex items-center gap-2">
                          <Search className="w-4 h-4 text-gray-400" />
                          <span className="capitalize">{suggestion}</span>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </div>
        </form>

        {/* Popular Search Tags */}
        <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs md:text-sm">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-xs md:text-sm">
            <span className="font-bold text-white drop-shadow-md">Popular searches:</span>

            <div className="flex flex-wrap justify-center gap-2">
              {popularSearches.map((search, index) => (
                <motion.button
                  key={index}
                  onClick={() => handlePopularSearch(search)}
                  className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full font-medium hover:bg-white/30 transition border border-white/30 capitalize"
                  whileHover={{ scale: 1.05 }}
                >
                  {search}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchHero;
