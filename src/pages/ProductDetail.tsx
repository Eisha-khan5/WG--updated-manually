
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchProductById } from '@/services/productService';
import { getProductsForHomepageCategories } from "@/services/productService";
import { ProductProps } from "@/components/ProductCard";
import { useState, useEffect } from 'react';


const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<ProductProps | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;

      setLoading(true);

      // Fetch main product
      const fetchedProduct = await fetchProductById(id);
      setProduct(fetchedProduct);

      if (fetchedProduct) {
        // Fetch products grouped by homepage categories
        const categoryProducts = await getProductsForHomepageCategories();
        const related = categoryProducts[fetchedProduct.category] || [];

        // Exclude current product and take up to 4
        setRelatedProducts(related.filter(p => p.id !== fetchedProduct.id).slice(0, 4));
      }

      setLoading(false);
    };

    loadProduct();
  }, [id]);

  // If product not found
  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
            <p className="mb-6">The product you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate("/search")}>Browse All Products</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Product Main Card */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Product Image */}
              <div className="aspect-square md:aspect-auto md:h-full bg-gray-100">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Details */}
              <div className="p-6 md:p-8">
                <div className="mb-6">
                  <h1 className="font-serif text-3xl font-bold mb-1">{product.name}</h1>
                  <p className="text-lg text-gray-600 mb-4">{product.brand}</p>

                  {/* Price & Discount */}
                  <div className="flex items-center gap-2 mb-8">
                    <span className="text-2xl font-bold text-black-700">
                      Rs. {product.price.toLocaleString()}
                    </span>
                    {product.discount && product.discount > 0 && (
                      <>
                        <span className="text-gray-400 line-through">
                          Rs. {Math.round(product.price / (1 - product.discount / 100)).toLocaleString()}
                        </span>
                        <Badge className="bg-ruby-600">-{product.discount}%</Badge>
                      </>
                    )}
                  </div>

                  {/* Category & Fabric */}
                  <div className="grid grid-cols-3 gap-6 mb-4">
                    <div className="pr-4">
                      <strong className="text-md text-black-500 mb-1">Category</strong>
                      <p className="font-medium">{product.category}</p>
                    </div>
                    {product.fabric && (
                      <div>
                        <strong className="text-md text-black-500 mb-1">Fabric</strong>
                        <p className="font-medium">{product.fabric}</p>
                      </div>
                    )}
                    <div className="mb-6">
                      <strong className="text-md text-black-500 mb-2">Color</strong>
                      <p className="font-medium">{product.color}</p>
                      <div className="flex items-center">
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visit Brand Website Button */}
                <div className="space-y-4">
                  <Button
                    className="w-50 bg-navy-600 hover:bg-stone-600 py-6 text-lg"
                    onClick={() => window.open(product.productUrl, "_blank")}
                  >
                    Visit Brand Website
                  </Button>
                  <p className="text-sm text-gray-500 text-center">
                    This will redirect you to the official brand website where you can complete your purchase.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mb-8">
              <h2 className="font-serif text-2xl font-bold mb-6">You May Also Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {relatedProducts.map((rp) => (
                  <ProductCard key={rp.id} {...rp} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;