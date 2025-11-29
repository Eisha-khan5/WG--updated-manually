import { supabase } from '@/integrations/supabase/client';
import { ProductProps } from '@/components/ProductCard';

interface NLPSearchResponse {
  success: boolean;
  query: string;
  entities: {
    color?: string;
    fabric?: string;
    category?: string;
    gender?: string;
    style?: string;
    min_price?: number;
    max_price?: number;
    is_new?: boolean;
    has_discount?: boolean;
  };
  total: number;
  returned: number;
  results: any[];
}

/**
 * NLP-based search using OpenAI for intelligent entity extraction
 * @param query - Natural language search query (e.g., "red silk kurta for women under 5000")
 * @param limit - Number of results to return (default: 20)
 * @param offset - Pagination offset (default: 0)
 * @returns Promise with search results and extracted entities
 */
export const nlpSearch = async (
  query: string,
  limit: number = 20,
  offset: number = 0
): Promise<{
  products: ProductProps[];
  entities: any;
  total: number;
}> => {
  try {
    console.log('🔍 NLP Search Query:', query);

    // Call the nlp-search edge function
    const { data, error } = await supabase.functions.invoke('nlp-search', {
      body: {
        query,
        limit,
        offset
      }
    });

    if (error) {
      console.error('❌ NLP Search Error:', error);
      throw error;
    }

    const response: NLPSearchResponse = data;

    if (!response.success) {
      console.error('❌ NLP Search failed:', response);
      return { products: [], entities: {}, total: 0 };
    }

    console.log('✅ Extracted entities:', response.entities);
    console.log(`✅ Found ${response.returned} products`);

    // Map results to ProductProps
    const products: ProductProps[] = response.results.map((product: any) => ({
      id: product.id.toString(),
      name: product.name,
      brand: product.brand,
      price: product.price,
      category: product.category,
      imageUrl: product.image_url,
      fabric: product.fabric,
      color: product.color,
      discount: product.discount,
      isNew: product.is_new,
      gender: product.gender,
      productUrl: product.product_url,
      style: product.style,
    }));

    return {
      products,
      entities: response.entities,
      total: response.total
    };

  } catch (error) {
    console.error('Failed to perform NLP search:', error);
    return { products: [], entities: {}, total: 0 };
  }
};

/**
 * Check if query should use NLP search
 * Always use NLP for any query with at least one word to provide intelligent search
 */
export const shouldUseNLPSearch = (query: string): boolean => {
  // Always use NLP for any non-empty query
  // This enables intelligent entity extraction for all searches
  return query && query.trim().length > 0;
};
