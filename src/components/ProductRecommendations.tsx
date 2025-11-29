
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from 'lucide-react';
import { ProductProps } from './ProductCard';
import ProductCard from './ProductCard';
import { getRecommendations } from '@/services/recommendationService';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

interface ProductRecommendationsProps {
  currentProductId?: string;
  title?: string;
  limit?: number;
  products?: ProductProps[]; // Allow passing products directly
  loading?: boolean; // Allow passing loading state
}

const ProductRecommendations: React.FC<ProductRecommendationsProps> = ({
  currentProductId,
  title = "You might also like",
  limit = 8,
  products: externalProducts,
  loading: externalLoading = false
}) => {
  const [recommendations, setRecommendations] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState(true);
  const plugin = useRef<ReturnType<typeof Autoplay> | null>(null);

  // Initialize autoplay plugin
  useEffect(() => {
    plugin.current = Autoplay({ delay: 3000, stopOnInteraction: false });
  }, []);

  // Use external products if provided, otherwise fetch recommendations
  const displayProducts = externalProducts || recommendations;
  const isLoading = externalProducts ? externalLoading : loading;

  useEffect(() => {
    // Only fetch if no external products provided
    if (!externalProducts) {
      const fetchRecommendations = async () => {
        try {
          setLoading(true);
          const data = await getRecommendations(currentProductId, limit);
          setRecommendations(data);
        } catch (error) {
          console.error('Error fetching recommendations:', error);
          setRecommendations([]);
        } finally {
          setLoading(false);
        }
      };

      fetchRecommendations();
    }
  }, [currentProductId, limit, externalProducts]);

  if (isLoading) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
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

  if (displayProducts.length === 0) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            <Sparkles className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No recommendations available at the moment.</p>
            <p className="text-sm mt-2">Check back later for personalized suggestions!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Carousel
          plugins={plugin.current ? [plugin.current] : []}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
          onMouseEnter={() => plugin.current?.stop()}
          onMouseLeave={() => plugin.current?.reset()}
        >
          <CarouselContent className="-ml-4">
            {displayProducts.map((product) => (
              <CarouselItem
                key={product.id}
                className="pl-4 md:basis-1/2 lg:basis-1/4"
              >
                <ProductCard {...product} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-6 bg-white hover:bg-gray-50 shadow-lg border-2 border-stone-300 h-10 w-10 hover:scale-110 transition-all" />
          <CarouselNext className="-right-6 bg-white hover:bg-gray-50 shadow-lg border-2 border-stone-300 h-10 w-10 hover:scale-110 transition-all" />
        </Carousel>
      </CardContent>
    </Card>
  );
};

export default ProductRecommendations;
