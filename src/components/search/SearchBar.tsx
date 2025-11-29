
// useState to manage state (like user input).
// useEffect to run code when something changes.
// useRef to reference DOM (Document Object Model) elements (like input box and suggestion box).

import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from 'lucide-react';
import { getProductSuggestions, trackSearch } from '@/services/searchTrackingService';

interface SearchBarProps {
  searchQuery: string; // Current search query text
  setSearchQuery: (query: string) => void; // Function to update query
  handleSearch: (e: React.FormEvent) => void;  // Submit handler for form
}

// Functional component that receives props
const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  handleSearch
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]); // Stores filtered suggestions for dropdown
  const [showSuggestions, setShowSuggestions] = useState(false); // Controls visibility of suggestions dropdown
  const [highlightedIndex, setHighlightedIndex] = useState(-1); // Index of the currently highlighted suggestion
  const suggestionsRef = useRef<HTMLDivElement>(null); // Points to the suggestions container div
  const inputRef = useRef<HTMLInputElement>(null); // Points to the input box
  const location = useLocation(); // Used to track current route (page)

  // Hide suggestions when route/path changes
  useEffect(() => {
    setShowSuggestions(false);
    setHighlightedIndex(-1);
  }, [location.pathname]);

  // Generate suggestions based on input from database
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

  // Close dropdown if clicked outside
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

  // Handle clicking on a suggestion
  const handleSelectSuggestion = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
    inputRef.current?.blur();

    // Track the selected suggestion
    trackSearch(suggestion);

    setTimeout(() => {
      const form = document.querySelector('form');
      if (form) {
        form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
    }, 0);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <form
        onSubmit={(e) => {
          handleSearch(e);
          setShowSuggestions(false);
          setHighlightedIndex(-1);
        }}
        className="flex gap-2"
      >
        <div className="relative flex-1">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search products (e.g., orange cotton dress with dupatta under Rs. 4000)"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setHighlightedIndex(-1);
            }}
            onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
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
            className="pr-10"
          />

          {searchQuery && (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => {
                setSearchQuery('');
                setShowSuggestions(false);
                inputRef.current?.focus();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear</span>
            </Button>
          )}

          {showSuggestions && suggestions.length > 0 && (
            <div
              ref={suggestionsRef}
              id="search-suggestions"
              className="absolute z-50 left-0 right-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden"
            >
              <div className="max-h-80 overflow-y-auto">
                <ul className="py-1">
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      id={`suggestion-${index}`}
                      className={`px-4 py-2 cursor-pointer text-left transition-colors ${
                        index === highlightedIndex
                          ? 'bg-navy-50 text-navy-900'
                          : 'hover:bg-navy-50'
                      }`}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      onClick={() => handleSelectSuggestion(suggestion)}
                    >
                      <div className="flex items-center gap-2">
                        <Search className="w-4 h-4 text-gray-400" />
                        <span className="capitalize">{suggestion}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        <Button type="submit">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </form>
    </div>
  );
};

export default SearchBar;
