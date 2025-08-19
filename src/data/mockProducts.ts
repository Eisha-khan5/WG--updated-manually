
// This file now only exports utility functions for filtering and searching
// All mock data has been removed - the app now uses Supabase backend exclusively

import { ProductProps } from '../components/ProductCard';

// Utility function to filter products (now works with any product array from backend)
export const filterProducts = (
  products: ProductProps[], 
  filters: {
    priceRange?: [number, number];
    brands?: string[];  
    categories?: string[];
    fabrics?: string[];
    colors?: string[];
    gender?: string;
  }
) => {
  return products.filter(product => {
    // Gender filter
    if (filters.gender && product.gender !== filters.gender) {
      return false;
    }
    
    // Price filter
    if (
      filters.priceRange && 
      (product.price < filters.priceRange[0] || product.price > filters.priceRange[1])
    ) {
      return false;
    }
    
    // Brand filter
    if (filters.brands && filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
      return false;
    }
    
    // Category filter
    if (filters.categories && filters.categories.length > 0 && !filters.categories.includes(product.category)) {
      return false;
    }
    
    // Fabric filter
    if (
      filters.fabrics && 
      filters.fabrics.length > 0 && 
      product.fabric && 
      !filters.fabrics.includes(product.fabric)
    ) {
      return false;
    }
    
    // Color filter
    if (
      filters.colors && 
      filters.colors.length > 0 && 
      product.color && 
      !filters.colors.includes(product.color)
    ) {
      return false;
    }
    
    return true;
  });
};

// Search function for products (now works with any product array from backend)
export const searchProducts = (products: ProductProps[], query: string) => {
  if (!query) return products;
  
  const lowerCaseQuery = query.toLowerCase();
  
  return products.filter(product => {
    return (
      product.name.toLowerCase().includes(lowerCaseQuery) ||
      product.brand.toLowerCase().includes(lowerCaseQuery) ||
      product.category.toLowerCase().includes(lowerCaseQuery) ||
      (product.fabric && product.fabric.toLowerCase().includes(lowerCaseQuery)) ||
      (product.color && product.color.toLowerCase().includes(lowerCaseQuery)) ||
      product.price.toString().includes(lowerCaseQuery) ||
      (product.gender && product.gender.toLowerCase().includes(lowerCaseQuery))
    );
  });
};

// Legacy exports removed - all data now comes from Supabase
// These functions now return empty arrays and should not be used
export const getBrands = () => [];
export const getCategories = () => [];
export const getFabrics = () => [];
export const getColors = () => [];
export const getProductById = (id: string) => undefined;
export const getGender = () => [];
export const mockProducts: ProductProps[] = [];
