import { supabase } from '@/integrations/supabase/client';
import { ProductProps } from '@/components/ProductCard';
import { Tables} from '@/integrations/supabase/types';

// Map Supabase ProductCard to ProductProps
const mapProductCardToProductProps = (productCard: Tables<"ProductCard">): ProductProps => ({
  id: productCard.id.toString(),
  name: productCard.name,
  brand: productCard.brand,
  price: productCard.price,
  category: productCard.category,
  imageUrl: productCard.image_url,
  fabric: productCard.fabric,
  color: productCard.color,
  discount: productCard.discount,
  isNew: productCard.is_new,
  gender: productCard.gender,
  productUrl: productCard.product_url,
  style: productCard.Style
});

// Save viewed product for recommendation tracking
// Save a single viewed product
export const saveViewedProduct = async (user_id: string, product_id: string) => {
  const { data, error } = await supabase
    .from("viewed_products")
    .insert({
      user_id,
      product_id
    });

  if (error) {
    console.error("Error saving viewed product:", error.message);
    return null;
  }
  return data;
};

// Get all viewed products for a specific user
export const getViewedProducts = async (user_id: string) => {
  const { data, error } = await supabase
    .from("viewed_products")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false }); // latest first

  if (error) {
    console.error("Error fetching viewed products:", error.message);
    return [];
  }
  return data;
};

export const getRecommendations = async (
  currentProductId?: string, 
  limit: number = 4
): Promise<ProductProps[]> => {
  try {
    // Check if there are any products in the database first
    const { data: allProducts, error: checkError } = await supabase
      .from('ProductCard')
      .select('id')
      .eq('in_stock', true)
      .limit(1);

    if (checkError) {
      console.error('Error checking products:', checkError);
      return [];
    }

    // If no products exist, return empty array
    if (!allProducts || allProducts.length === 0) {
      console.log('No products found in database');
      return [];
    }

    // If we have a current product, try to get similar products
    if (currentProductId) {
      // First get the current product to find similar ones
      const { data: currentProduct, error: currentError } = await supabase
        .from('ProductCard')
        .select('*')
        .eq('id', parseInt(currentProductId))
        .single();

      if (!currentError && currentProduct) {
        // Find similar products by category, brand, or fabric
        let query = supabase
          .from('ProductCard')
          .select('*')
          .eq('in_stock', true)
          .neq('id', parseInt(currentProductId));

        // Prioritize same category
        query = query.eq('category', currentProduct.category);

        const { data: similarProducts, error: similarError } = await query
          .order('Scraped_at', { ascending: false })
          .limit(limit);

        if (!similarError && similarProducts && similarProducts.length > 0) {
          return similarProducts.map(mapProductCardToProductProps);
        }

        // Fallback to same brand if no category matches
        const { data: brandProducts, error: brandError } = await supabase
          .from('ProductCard')
          .select('*')
          .eq('brand', currentProduct.brand)
          .eq('in_stock', true)
          .neq('id', parseInt(currentProductId))
          .order('Scraped_at', { ascending: false })
          .limit(limit);

        if (!brandError && brandProducts && brandProducts.length > 0) {
          return brandProducts.map(mapProductCardToProductProps);
        }
      }
    }

    // General recommendations - newest or popular products
    const { data, error } = await supabase
      .from('ProductCard')
      .select('*')
      .eq('in_stock', true)
      .order('Scraped_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching general recommendations:', error);
      return [];
    }

    return data ? data.map(mapProductCardToProductProps) : [];
  } catch (error) {
    console.error('Failed to fetch recommendations:', error);
    return [];
  }
};

// Get trending products (could be based on views, purchases, etc.)
export const getTrendingProducts = async (limit: number = 8): Promise<ProductProps[]> => {
  try {
    const { data, error } = await supabase
      .from('ProductCard')
      .select('*')
      .eq('in_stock', true)
      .eq('is_new', true)
      .order('Scraped_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching trending products:', error);
      return [];
    }

    return data ? data.map(mapProductCardToProductProps) : [];
  } catch (error) {
    console.error('Failed to fetch trending products:', error);
    return [];
  }
};

// Get products on sale
export const getSaleProducts = async (limit: number = 8): Promise<ProductProps[]> => {
  try {
    const { data, error } = await supabase
      .from('ProductCard')
      .select('*')
      .eq('in_stock', true)
      .not('discount', 'is', null)
      .gt('discount', 0)
      .order('discount', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching sale products:', error);
      return [];
    }

    return data ? data.map(mapProductCardToProductProps) : [];
  } catch (error) {
    console.error('Failed to fetch sale products:', error);
    return [];
  }
};
