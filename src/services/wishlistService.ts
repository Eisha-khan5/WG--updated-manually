import { supabase } from '@/integrations/supabase/client';
import { ProductProps } from '@/components/ProductCard';

// Map Supabase data to ProductProps
const mapToProductProps = (productCard: any): ProductProps => ({
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
  gender: productCard.gender
  
});

export const getWishlist = async (userId: string): Promise<ProductProps[]> => {
  try {
    const { data, error } = await supabase
      .from('Wishlist')
      .select(`
        product_id,
        ProductCard (
          id,
          name,
          brand,
          price,
          category,
          image_url,
          fabric,
          color,
          discount,
          is_new,
          gender,
          in_stock
        )
      `)
      .eq('user_id', userId)
      .eq('ProductCard.in_stock', true);

    if (error) {
      console.error('Error fetching wishlist:', error);
      return [];
    }

    return data?.map(item => mapToProductProps(item.ProductCard)).filter(Boolean) || [];
  } catch (error) {
    console.error('Failed to fetch wishlist:', error);
    return [];
  }
};

export const addToWishlist = async (userId: string, productId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('Wishlist')
      .insert({
        user_id: userId,
        product_id: parseInt(productId)
      });

    if (error) {
      console.error('Error adding to wishlist:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to add to wishlist:', error);
    return false;
  }
};

export const removeFromWishlist = async (userId: string, productId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('Wishlist')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', parseInt(productId));

    if (error) {
      console.error('Error removing from wishlist:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to remove from wishlist:', error);
    return false;
  }
};

export const isInWishlist = async (userId: string, productId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('Wishlist')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', parseInt(productId))
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('Error checking wishlist:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Failed to check wishlist:', error);
    return false;
  }
};

export const toggleWishlistItem = async (userId: string, product: ProductProps): Promise<boolean> => {
  const inWishlist = await isInWishlist(userId, product.id);
  
  if (inWishlist) {
    const removed = await removeFromWishlist(userId, product.id);
    return !removed; // Return false if successfully removed
  } else {
    return await addToWishlist(userId, product.id);
  }
};

/* Legacy functions for backward compatibility (now require userId)
export const getWishlist_legacy = (): ProductProps[] => {
  console.warn('getWishlist_legacy called - this function requires authentication');
  return [];
};

export const addToWishlist_legacy = (product: ProductProps): ProductProps[] => {
  console.warn('addToWishlist_legacy called - this function requires authentication');
  return [];
};

export const removeFromWishlist_legacy = (productId: string): ProductProps[] => {
  console.warn('removeFromWishlist_legacy called - this function requires authentication');
  return [];
};

export const toggleWishlistItem_legacy = (product: ProductProps): boolean => {
  console.warn('toggleWishlistItem_legacy called - this function requires authentication');
  return false;
};

export const isInWishlist_legacy = (productId: string): boolean => {
  console.warn('isInWishlist_legacy called - this function requires authentication');
  return false;
};
*/