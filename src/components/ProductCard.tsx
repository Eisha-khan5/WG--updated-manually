
// Imports React hooks and necessary modules
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';


// Importing UI components
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookmarkPlus, BookmarkCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { saveViewedProduct } from '@/services/recommendationService';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/hooks/useWishlist';

// Define the ProductProps interface for product properties
export interface ProductProps {
  id: string;
  name: string;
  brand: string;
  price: number;
  imageUrl: string;
  category: string;
  fabric?: string;
  color?: string;
  discount?: number;
  isNew?: string;
  alternateImageUrl?: string;
  gender: string; 
  productUrl: string
  style: string; // Optional style property
}

// Functional component definition
const ProductCard: React.FC<ProductProps> = ({
  id,
  name,
  brand,
  price,
  imageUrl,
  category,
  fabric,
  color,
  discount,
  isNew,
  alternateImageUrl,
  gender,
  productUrl,
  style
}) => {
  const { toast } = useToast();
  const { requireAuth } = useAuth();
  const [isHovering, setIsHovering] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { wishlistItems, addItem, removeItem, isItemInWishlist } = useWishlist();
  
  // Check if item is in wishlist
  useEffect(() => {
    const checkWishlistStatus = async () => {
      const inWishlist = await isItemInWishlist(id);
      setIsWishlisted(inWishlist);
    };
    
    checkWishlistStatus();
  }, [id, isItemInWishlist, wishlistItems]);

  // Mark this product as viewed for recommendation system
  const { user } = useAuth();
  useEffect(() => {
    if (user?.id) {
      saveViewedProduct(user.id, id);
    }
  }, [id, user]);

  // Handles wishlist toggle button click
  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    requireAuth(async () => {
      try {
        if (isWishlisted) {
          await removeItem(id);
          setIsWishlisted(false);
          toast({
            title: "Removed from wishlist",
            description: `${name} has been removed from your wishlist`,
            duration: 2000,
          });
        } else {
          await addItem({
            id, name, brand, price, imageUrl, category, fabric, color, discount, isNew ,gender, productUrl,style
          });
          setIsWishlisted(true);
          toast({
            title: "Added to wishlist",
            description: `${name} has been added to your wishlist`,
            duration: 2000,
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update wishlist",
          variant: "destructive",
          duration: 2000,
        });
      }
    });
  };

  // Calculate original price before discount
  const originalPrice = discount && discount > 0 
    ? Math.round(price / (1 - discount / 100)) 
    : null;

  return (
    <Link to={`/product/${id}`}>
      <Card 
        className="product-card h-full"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 rounded-t-lg">
          <img
            src={isHovering && alternateImageUrl ? alternateImageUrl : imageUrl}
            alt={name}
            className="object-cover w-full h-full transition-all duration-500"
          />
          
          <div className="absolute top-2 left-2 flex flex-col gap-1.5">
            {isNew && (
              <Badge className="bg-emerald-500 hover:bg-emerald-600 px-2.5 py-1 text-xs shadow-sm">
                New
              </Badge>
            )}
          </div>
          
          {discount && discount > 0 && (
            <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 px-2.5 py-1 text-xs shadow-sm">
              -{discount}%
            </Badge>
          )}
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleWishlistToggle}
            className={`absolute bottom-2 right-2 bg-white/90 p-2 rounded-full hover:bg-white transition-colors shadow-sm ${
              isWishlisted ? 'wishlist-added' : ''
            }`}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            {isWishlisted ? (
              <BookmarkCheck className="h-5 w-5 text-navy-600" />
            ) : (
              <BookmarkPlus className="h-5 w-5 text-navy-600" />
            )}
          </motion.button>
        </div>

        <CardContent className="p-4">
          <div className="space-y-1.5">
            <h3 className="text-sm text-gray-500 capitalize font-medium">{brand}</h3>
            <h2 className="font-medium text-gray-800 line-clamp-1">{name}</h2>

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-navy-700">Rs. {price.toLocaleString()}</span>
                {originalPrice && (
                  <span className="text-xs text-gray-400 line-through">
                    Rs. {originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              {fabric && (
                <span className="text-xs bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100 text-gray-600 capitalize">
                  {fabric}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;
