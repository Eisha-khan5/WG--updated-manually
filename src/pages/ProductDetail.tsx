import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Share2, ExternalLink, BookmarkPlus, BookmarkCheck } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductRecommendations from '@/components/ProductRecommendations';
import { fetchProductById } from '@/services/productService';
import { getRecommendations } from '@/services/recommendationService';
import { ProductProps } from '@/components/ProductCard';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/hooks/useWishlist';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { requireAuth } = useAuth();
  const [product, setProduct] = useState<ProductProps | null>(null);
  const [recommendations, setRecommendations] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { addItem, removeItem, isItemInWishlist } = useWishlist();

  useEffect(() => {
    const loadProductData = async () => {
      if (!id) return;

      setLoading(true);
      try {
        console.log('Loading product details for ID:', id);

        // Load product details
        const productData = await fetchProductById(id);
        setProduct(productData);

        if (productData) {
          // Load recommendations (get more for the slider)
          const recs = await getRecommendations(id, 8);
          setRecommendations(recs);

          // Check wishlist status
          const inWishlist = await isItemInWishlist(id);
          setIsWishlisted(inWishlist);
        }

        console.log('Product data loaded successfully');
      } catch (error) {
        console.error('Error loading product data:', error);
        toast({
          title: "Error",
          description: "Failed to load product details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProductData();
  }, [id, toast]);

  const handleWishlistToggle = async () => {
    if (!product) return;

    requireAuth(async () => {
      try {
        if (isWishlisted) {
          await removeItem(product.id);
          setIsWishlisted(false);
          toast({
            title: "Removed from wishlist",
            description: `${product.name} has been removed from your wishlist`,
          });
        } else {
          await addItem({
            id: product.id,
            name: product.name,
            brand: product.brand,
            price: product.price,
            imageUrl: product.imageUrl,
            category: product.category,
            fabric: product.fabric,
            color: product.color,
            discount: product.discount,
            isNew: product.isNew,
            gender: product.gender,
            productUrl: product.productUrl,
            style: product.style,
          });
          setIsWishlisted(true);
          toast({
            title: "Added to wishlist",
            description: `${product.name} has been added to your wishlist`,
          });
        }
      } catch (error) {
        console.error('Wishlist toggle error:', error);
        toast({
          title: "Error",
          description: "Failed to update wishlist",
          variant: "destructive",
        });
      }
    });
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product?.name,
        text: `Check out this ${product?.category} from ${product?.brand}`,
        url: window.location.href,
      });
    } catch (error) {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Product link copied to clipboard",
      });
    }
  };

  const handleVisitWebsite = () => {
    if (product?.productUrl) {
      console.log('Opening product URL:', product.productUrl);
      window.open(product.productUrl, '_blank', 'noopener,noreferrer');
    } else {
      toast({
        title: "Link not available",
        description: "Product website link is not available",
        variant: "destructive",
      });
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="aspect-[4/5] bg-gray-200 rounded-lg"></div>
              <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-10 bg-gray-200 rounded w-1/3"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
            <Link to="/search">
              <Button>Browse Products</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const originalPrice = product.discount && product.discount > 0
    ? Math.round(product.price / (1 - product.discount / 100))
    : null;

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="w-full flex justify-start mb-8">
          <Link
            to="/search"
            className="inline-flex items-center gap-2 text-navy-600 hover:text-navy-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Link>
        </div>

        {/* Product Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16"
        >
          {/* Product Image */}
          <div className="relative">
            <div className="aspect-square max-w-xl mx-auto bg-white rounded-lg overflow-hidden shadow-md">
              <img
                src={imageError ? '/placeholder.svg' : product.imageUrl}
                alt={product.name}
                className="w-full h-full object-contain p-4"
                onError={handleImageError}
              />
              {product.discount && product.discount > 0 && (
                <Badge className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 px-3 py-1">
                  -{product.discount}% OFF
                </Badge>
              )}
              {product.isNew && (
                <Badge className="absolute top-4 left-4 bg-emerald-500 hover:bg-emerald-600 px-3 py-1">
                  New Arrival
                </Badge>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-navy-600 font-medium mb-2 capitalize">{product.brand}</p>
              <h1 className="font-serif text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              <div>
                <span className="text-md font-bold text-navy-700">
                  <p> Price: Rs. {product.price.toLocaleString()}</p>
                </span>
                {originalPrice && (
                  <span className="text-xl text-gray-400 line-through">
                    Rs. {originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-3">
              {product.fabric && (
                <div>
                  <span className="text-md font-bold text-navy-600">Fabric</span>
                  <p className="text-gray-900 capitalize">{product.fabric}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex justify-center gap-4 ">
                <Button
                  onClick={handleVisitWebsite}
                  className="bg-navy-600 hover:bg-navy-700 text-white px-6 py-4 rounded-md text-base"
                  disabled={!product.productUrl}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit Brand Website
                </Button>

                <Button
                  variant="outline"
                  onClick={handleWishlistToggle}
                  className="px-6"
                >
                  {isWishlisted ? (
                    <BookmarkCheck className="h-4 w-4" />
                  ) : (
                    <BookmarkPlus className="h-4 w-4" />
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="px-6"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>

              {!product.productUrl && (
                <p className="text-sm text-gray-500">
                  Website link not available for this product
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ProductRecommendations
              title="You might also like"
              products={recommendations.map(product => ({
                id: product.id,
                name: product.name,
                brand: product.brand,
                price: product.price,
                imageUrl: product.imageUrl,
                category: product.category,
                fabric: product.fabric,
                color: product.color,
                discount: product.discount,
                isNew: product.isNew,
                gender: product.gender,
                productUrl: product.productUrl,
                style: product.style,
              }))}
              loading={false}
            />
          </motion.section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
