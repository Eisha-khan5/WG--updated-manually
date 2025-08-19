
import { useState, useEffect } from 'react';
import { ProductProps } from '@/components/ProductCard';
import { 
  getWishlist, 
  addToWishlist, 
  removeFromWishlist, 
  toggleWishlistItem, 
  isInWishlist 
} from '@/services/wishlistService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useWishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      loadWishlist();
    } else {
      setWishlistItems([]);
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const loadWishlist = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const items = await getWishlist(user.id);
      setWishlistItems(items);
    } catch (error) {
      console.error('Error loading wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to load wishlist items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (product: ProductProps) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to add items to your wishlist",
        variant: "destructive",
      });
      return;
    }

    try {
      const success = await addToWishlist(user.id, product.id);
      if (success) {
        await loadWishlist();
        toast({
          title: "Added to wishlist",
          description: `${product.name} has been added to your wishlist`,
          duration: 2000,
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to add item to wishlist",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to add item to wishlist",
        variant: "destructive",
      });
    }
  };

  const removeItem = async (productId: string) => {
    if (!user) return;

    try {
      const product = wishlistItems.find(item => item.id === productId);
      const success = await removeFromWishlist(user.id, productId);
      
      if (success) {
        await loadWishlist();
        if (product) {
          toast({
            title: "Removed from wishlist",
            description: `${product.name} has been removed from your wishlist`,
            duration: 2000,
          });
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to remove item from wishlist",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist",
        variant: "destructive",
      });
    }
  };

  const toggleItem = async (product: ProductProps) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to manage your wishlist",
        variant: "destructive",
      });
      return;
    }

    try {
      const isAdded = await toggleWishlistItem(user.id, product);
      await loadWishlist();
      
      toast({
        title: isAdded ? "Added to wishlist" : "Removed from wishlist",
        description: `${product.name} has been ${isAdded ? 'added to' : 'removed from'} your wishlist`,
        duration: 2000,
      });
    } catch (error) {
      console.error('Error toggling wishlist item:', error);
      toast({
        title: "Error",
        description: "Failed to update wishlist",
        variant: "destructive",
      });
    }
  };

  const isItemInWishlist = async (productId: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      return await isInWishlist(user.id, productId);
    } catch (error) {
      console.error('Error checking wishlist:', error);
      return false;
    }
  };

  return {
    wishlistItems,
    loading,
    addItem,
    removeItem,
    toggleItem,
    isItemInWishlist,
    loadWishlist
  };
};
