
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/components/ProductCard';

const WishlistSection = () => {
  const { wishlistItems, loading } = useWishlist();

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-white to-stone-50/50 border border-stone-200/60 shadow-lg">
        <CardHeader className="border-b border-stone-100 bg-gradient-to-r from-navy-50 to-stone-50">
          <CardTitle className="flex items-center gap-3 text-navy-800">
            <Heart className="h-5 w-5" />
            My Wishlist
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-white to-stone-50/50 border border-stone-200/60 shadow-lg">
      <CardHeader className="border-b border-stone-100 bg-gradient-to-r from-navy-50 to-stone-50">
        <CardTitle className="flex items-center gap-3 text-navy-800">
          <Heart className="h-5 w-5" />
          My Wishlist ({wishlistItems.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        {wishlistItems.length === 0 ? (
          <div className="text-center text-stone-500 py-12">
            <Heart className="h-16 w-16 mx-auto mb-6 text-stone-300" />
            <p className="text-xl mb-3">Your wishlist is empty</p>
            <p className="text-sm mb-6">Start exploring products to add items to your wishlist!</p>
            <Link to="/search">
              <Button className="bg-gradient-to-r from-navy-600 to-navy-700 hover:from-navy-700 hover:to-navy-800">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Explore Products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {wishlistItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard {...item} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WishlistSection;
