import React, { useEffect, useState, useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { supabase } from "@/integrations/supabase/client";
import { ProductProps } from "@/components/ProductCard";
import ProductCard from "@/components/ProductCard";

interface StyleProduct {
  style: string;
  products: ProductProps[];
}

const StyleCarousel: React.FC = () => {
  const [styleProducts, setStyleProducts] = useState<StyleProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Use ref with correct type for Autoplay plugin
  const plugin = useRef<ReturnType<typeof Autoplay> | null>(null);

  // Initialize plugin once
  useEffect(() => {
    plugin.current = Autoplay({ delay: 3000, stopOnInteraction: false });
  }, []);

  useEffect(() => {
    const loadStyleProducts = async () => {
      try {
        const { data, error } = await supabase
          .from("ProductCard")
          .select("*")
          .eq("in_stock", true);

        if (error) throw error;

        if (data && data.length > 0) {
          // Group products by style
          const styleMap = new Map<string, ProductProps[]>();

          data.forEach((item: any) => {
            if (item.style) {
              const product : ProductProps = {
                id: item.id.toString(),
                name: item.name,
                brand: item.brand,
                price: item.price,
                category: item.category,
                imageUrl: item.image_url,
                fabric: item.fabric,
                color: item.color,
                discount: item.discount,
                isNew: item.is_new,
                gender: item.gender,
                productUrl: item.product_url,
                style: item.style,
              };

              if (!styleMap.has(item.style)) styleMap.set(item.style, []);
              styleMap.get(item.style)?.push(product);
            }
          });

          // Convert to array and take first product from each style
          const styles: StyleProduct[] = Array.from(styleMap.entries())
            .map(([style, products]) => ({
              style,
              products: products.slice(0, 1),
            }))
            .slice(0, 10); // limit to 10 styles

          setStyleProducts(styles);
        }
      } catch (error) {
        console.error("Error loading style products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStyleProducts();
  }, []);

  if (loading) {
    return (
      <div className="py-8">
        <div className="flex gap-4 overflow-hidden justify-center">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-64 animate-pulse">
              <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (styleProducts.length === 0) return null;

  return (
    <div className="py-4">
      <Carousel
        plugins={plugin.current ? [plugin.current] : []} // TS-safe
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full max-w-7xl mx-auto"
        onMouseEnter={() => plugin.current?.stop()}
        onMouseLeave={() => plugin.current?.reset()}
      >
        <CarouselContent className="-ml-4">
          {styleProducts.map((styleProduct, index) => (
            <CarouselItem
              key={index}
              className="pl-4 md:basis-1/2 lg:basis-1/4"
            >
              {styleProduct.products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  brand={product.brand}
                  price={product.price}
                  imageUrl={product.imageUrl}
                  category={product.category}
                  fabric={product.fabric}
                  color={product.color}
                  discount={product.discount}
                  isNew={product.isNew}
                  gender={product.gender}
                  productUrl={product.productUrl}
                style={product.style}
                />
              ))}
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-6 bg-white hover:bg-gray-50 shadow-lg border-2 border-stone-300 h-10 w-10 hover:scale-110 transition-all" />
        <CarouselNext className="-right-6 bg-white hover:bg-gray-50 shadow-lg border-2 border-stone-300 h-10 w-10 hover:scale-110 transition-all" />
      </Carousel>
    </div>
  );
};

export default StyleCarousel;
