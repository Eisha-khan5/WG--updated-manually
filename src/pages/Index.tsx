import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import SearchHero from '@/components/SearchHero';
import ProductCard from '@/components/ProductCard';
import CategoryCarousel from '@/components/CategoryCarousel';
import Footer from '@/components/Footer';
import { getProductsForHomepageCategories } from '@/services/productService';
import { fetchProducts } from '@/services/productService';
import { fetchProductsByStyles } from '@/services/productService';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button'; // Custom button component
import { ProductProps } from '@/components/ProductCard';
import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const [styleItems, setStyleItems] = useState<{ name: string; image: string }[]>([]);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  // State to hold category items for the carousel
  const [categoryItems, setCategoryItems] = useState<{ name: string; image: string; description: string }[]>([]); const handleSearch = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  // Fetch categories for the homepage category carousel
  useEffect(() => {
    const fetchCategoryItems = async () => {
      const data: Record<string, ProductProps[]> = await getProductsForHomepageCategories();

      const items = Object.entries(data)
        .map(([categoryName, products]) => {
          if (!products || products.length === 0) return null;

          // Pick the first product that has a style
          const productWithStyle = products.find(p => p.style);
          if (!productWithStyle) return null;

          return {
            name: categoryName,
            image: productWithStyle.imageUrl,
            description: productWithStyle.style!
          };
        })
        .filter(Boolean) as { name: string; image: string; description: string }[];
      setCategoryItems(items);
    };

    fetchCategoryItems();
  }, []);

  // shop by style section
  useEffect(() => {
    const fetchStyles = async () => {
      const data: ProductProps[] = await fetchProductsByStyles();

      const seen = new Set<string>();
      const unique = data
        .filter((p) => p.style && !seen.has(p.style))
        .map((p) => {
          seen.add(p.style!);
          return {
            name: p.style!,
            image: p.imageUrl,
          };
        });

      setStyleItems(unique);
    };

    fetchStyles();
  }, []);

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  }

  const handleStyleClick = (style: string) => {
    navigate(`/search?q=${encodeURIComponent(style)}`);
  };

  // Fetch featured products for the homepage
  const [featuredProducts, setFeaturedProducts] = useState<ProductProps[]>([]);
  useEffect(() => {
    const loadProducts = async () => {
      const products = await fetchProducts();
      setFeaturedProducts(products.slice(0, 4)); // Show only 4 products
    };

    loadProducts();
  }, []);


  // Fetch trending products for the homepage
  const [trendingProducts, setTrendingProducts] = useState<ProductProps[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      const result = await fetchProductsByStyles();
      setTrendingProducts(result.slice(0, 4));
    };
    loadProducts();
  }, []);

  // Animation remain the same
  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        <section className="hero-section">
          <SearchHero onSearch={handleSearch} />
        </section>

        {/* Category Carousel - With Title */}
        <section className="my-4 md:my-5">
          <div className="container mx-50 ">
            <h2 className="card-heading text-center text-2xl font-semibold mb-4">
              Shop by Category
            </h2>
            <CategoryCarousel categories={categoryItems} />
          </div>
        </section>

        {/* Featured Collections */}
        <section className="section-container collections-bg my-4 md:my-5">
          <div className="container mx-auto px-4">

            <div className="relative flex items-center justify-center mb-8">
              {/* Centered Heading */}
              <h2 className="card-heading text-center mt-2">Featured Products</h2>

              {/* Right-Aligned Button using absolute positioning */}
              <Button
                className="absolute right-0 bg-navy-500 text-white px-4 py-2 rounded-full text-sm hover:bg-stone-600 transition"
                onClick={() => navigate('/search')}
              >
                View All
              </Button>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6"
            >
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <ProductCard key={product.id} {...product} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Shop by Style */}
        <section className="section-container categories-bg">
          <div className="w-full px-4 mt-3">
            <div className="max-w-3xl mx-auto text-center mb-8">
              <h2 className="card-heading mt-4">Shop by Style</h2>
              <p className="card-subheading">
                Explore our curated collections of Pakistani fashion styles
              </p>
            </div>

            {/* Wrapper with arrows outside */}
            <div className="flex items-center gap-4">
              {/* Left Arrow */}
              <button
                onClick={scrollLeft}
                className="bg-white shadow-md p-2 rounded-full"
              >
                <ChevronLeft size={20} />
              </button>

              {/* Cards Carousel */}
              <div className="overflow-hidden flex-1">
                <div
                  ref={sliderRef}
                  className="flex gap-4 md:gap-6 overflow-x-scroll scroll-smooth no-scrollbar w-full"
                >
                  {styleItems.map((uniqueProduct, index) => (
                    <motion.div
                      key={uniqueProduct.name}
                      className="category-card flex-shrink-0 w-[250px] md:w-[300px] lg:w-[350px]"
                      onClick={() => handleStyleClick(uniqueProduct.name)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                    >
                      <div className="w-full h-[250px] md:h-[300px] lg:h-[350px] overflow-hidden rounded-lg">
                        <img
                          src={uniqueProduct.image}
                          alt={uniqueProduct.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="category-card-content">
                        <h3 className="font-medium text-base md:text-lg">{uniqueProduct.name}</h3>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right Arrow */}
              <button
                onClick={scrollRight}
                className="bg-white shadow-md p-2 rounded-full"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </section>

        {/* Trending Products */}
        <section className="section-container trending-bg my-4 md:my-5">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-8">
              <h2 className="card-heading mt-4">Trending Now</h2>
              <p className="card-subheading">
                See what's popular among our fashion-forward customers
              </p>
              {/* Right-Aligned Button using absolute positioning */}
              <Button
                 className="absolute right-0 top-[15px] bg-navy-500 text-white px-4 py-2 rounded-full text-sm hover:bg-stone-600 transition"
                onClick={() => navigate('/search')}
              >
                View All
              </Button>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6"
            >
              {trendingProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <ProductCard {...product} />
                </motion.div>
              ))}
            </motion.div>

          </div>
        </section>

        {/* How It Works */}
        <section className="section-container how-it-works-bg ">
          <div className="container mx-auto px-2 pb-3">
            <div className="max-w-3xl mx-auto text-center mb-8">
              <h2 className="card-heading text-stone-800 mt-4">How It Works</h2>
              <p className="card-subheading text-stone-600">
                Finding your perfect Pakistani outfit has never been easier
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <motion.div
                className="elegant-card p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="bg-neutral-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                  <span className="text-stone-600 text-2xl font-bold">1</span>
                </div>
                <h3 className="font-medium text-xl mb-3 text-stone-800">Search Naturally</h3>
                <p className="text-stone-600">
                  Describe what you're looking for in natural language, like you would to a friend.
                </p>
              </motion.div>

              <motion.div
                className="elegant-card p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="bg-neutral-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                  <span className="text-stone-600 text-2xl font-bold">2</span>
                </div>
                <h3 className="font-medium text-xl mb-3 text-stone-800">Browse Results</h3>
                <p className="text-stone-600">
                  Discover items across multiple Pakistani brands that match your specific requirements.
                </p>
              </motion.div>

              <motion.div
                className="elegant-card p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <div className="bg-neutral-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                  <span className="text-stone-600 text-2xl font-bold">3</span>
                </div>
                <h3 className="font-medium text-xl mb-3 text-stone-800">Shop with Confidence</h3>
                <p className="text-stone-600">
                  Visit the brand's website to complete your purchase with all the information you need.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
