import { supabase } from '@/integrations/supabase/client';

/**
 * Track a search query
 * Stores search queries to calculate popular searches
 */
export const trackSearch = async (query: string): Promise<void> => {
  if (!query || query.trim().length === 0) return;

  try {
    const { error } = await supabase
      .from('search_history')
      .insert({
        query: query.trim().toLowerCase(),
        searched_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error tracking search:', error);
    }
  } catch (error) {
    console.error('Failed to track search:', error);
  }
};

/**
 * Get top N most searched queries
 * Returns queries ordered by frequency
 */
export const getPopularSearches = async (limit: number = 3): Promise<string[]> => {
  try {
    // Get searches from last 30 days to keep them relevant
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data, error } = await supabase
      .from('search_history')
      .select('query')
      .gte('searched_at', thirtyDaysAgo.toISOString())
      .order('searched_at', { ascending: false });

    if (error) {
      console.error('Error fetching popular searches:', error);
      return getDefaultPopularSearches();
    }

    if (!data || data.length === 0) {
      return getDefaultPopularSearches();
    }

    // Count frequency of each query
    const queryCount = new Map<string, number>();
    data.forEach((item) => {
      const query = item.query;
      queryCount.set(query, (queryCount.get(query) || 0) + 1);
    });

    // Sort by frequency and get top N
    const topSearches = Array.from(queryCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([query]) => query);

    // Return defaults if we don't have enough searches yet
    if (topSearches.length < limit) {
      return getDefaultPopularSearches();
    }

    return topSearches;
  } catch (error) {
    console.error('Failed to get popular searches:', error);
    return getDefaultPopularSearches();
  }
};

/**
 * Get default popular searches as fallback
 */
const getDefaultPopularSearches = (): string[] => {
  return [
    'embroidered lawn suit',
    'blue silk kurta',
    'bridal lehenga under 10000'
  ];
};

/**
 * Get product name suggestions based on user input
 * Returns matching product names from database
 */
export const getProductSuggestions = async (query: string, limit: number = 5): Promise<string[]> => {
  if (!query || query.trim().length < 2) return [];

  try {
    const { data, error } = await supabase
      .from('ProductCard')
      .select('name, category, brand, fabric, color')
      .eq('in_stock', true)
      .or(`name.ilike.%${query}%,category.ilike.%${query}%,brand.ilike.%${query}%,fabric.ilike.%${query}%,color.ilike.%${query}%`)
      .limit(limit * 3); // Get more to deduplicate

    if (error) {
      console.error('Error fetching suggestions:', error);
      return [];
    }

    if (!data || data.length === 0) return [];

    // Create unique suggestions from different fields
    const suggestions = new Set<string>();

    data.forEach((item) => {
      // Add product name if it matches
      if (item.name && item.name.toLowerCase().includes(query.toLowerCase())) {
        suggestions.add(item.name);
      }
      // Add category if it matches
      if (item.category && item.category.toLowerCase().includes(query.toLowerCase())) {
        suggestions.add(item.category);
      }
      // Add brand if it matches
      if (item.brand && item.brand.toLowerCase().includes(query.toLowerCase())) {
        suggestions.add(item.brand);
      }
      // Add combinations for better suggestions
      if (item.fabric && item.fabric.toLowerCase().includes(query.toLowerCase())) {
        suggestions.add(`${item.fabric} ${item.category}`.toLowerCase());
      }
      if (item.color && item.color.toLowerCase().includes(query.toLowerCase())) {
        suggestions.add(`${item.color} ${item.category}`.toLowerCase());
      }
    });

    return Array.from(suggestions).slice(0, limit);
  } catch (error) {
    console.error('Failed to fetch suggestions:', error);
    return [];
  }
};
