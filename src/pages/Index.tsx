import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import SearchHero from '@/components/SearchHero';
import ProductCard from '@/components/ProductCard';
import CategoryCarousel from '@/components/CategoryCarousel';
import StyleCarousel from '@/components/StyleCarousel';
import Footer from '@/components/Footer';
import { getProductsForHomepageCategories } from '@/services/productService';
import { fetchProducts } from '@/services/productService';
import { fetchProductsByStyles, fetchNewArrivals } from '@/services/productService';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button'; // Custom button component
import { ProductProps } from '@/components/ProductCard';
import { useState, useEffect, useRef } from 'react';

const Index = () => {
  const navigate = useNavigate();
  const [styleItems, setStyleItems] = useState<{ name: string; image: string }[]>([]);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  // State to hold category items for the carousel
  const [categoryItems, setCategoryItems] = useState<{ name: string; image: string; description: string }[]>([]); const handleSearch = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

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

  // Fetch categories for the homepage carousel
  useEffect(() => {
    const fetchCategoryItems = async () => {
      try {
        const data = await getProductsForHomepageCategories();

        const items = Object.entries(data)
          .map(([categoryName, products]) => {
            if (!products || products.length === 0) return null;

            const productWithStyle = products.find(
              p => p.style && p.imageUrl
            );

            if (!productWithStyle) return null;

            return {
              name: categoryName,
              image: productWithStyle.imageUrl,
              description: productWithStyle.style.trim(),
            };
          })
          .filter(Boolean);

        setCategoryItems(items);
      } catch (error) {
        console.error("Error fetching homepage categories:", error);
      }
    };

    fetchCategoryItems();
  }, []);

  // Fetch featured products for the homepage
  const [featuredProducts, setFeaturedProducts] = useState<ProductProps[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      const products = await fetchProducts();
      setFeaturedProducts(products.slice(0, 4)); // Display first 4 featured products
    };

    loadProducts();
  }, []);

  // New Arrivals Section
  const [newArrivalProducts, setNewArrivalProducts] = useState<ProductProps[]>([]);
  useEffect(() => {
    const loadNewArrivals = async () => {
      const products = await fetchNewArrivals();
      setNewArrivalProducts(products.slice(0, 4)); // Show only 4 new arrival products
    };

    loadNewArrivals();
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
            <h2 className="card-heading text-center text-2xl font-semibold mb-2">
              Shop by Category
            </h2>
            <p className="card-subheading">
              Explore our diverse collection organized by categories </p>
            <CategoryCarousel categories={categoryItems} />
          </div>
        </section>

        {/* Featured Collections */}
        <section className="section-container collections-bg my-4 md:my-5">
          <div className="container mx-auto px-4">

            <div className="relative mb-8 flex items-center justify-between">

              {/* Heading & Subheading Centered */}
              <div className="text-center flex-1">
                <h2 className="card-heading text-center mt-2">Featured Collections</h2>
                <p className="card-subheading mt-1">
                  Handpicked pieces from our most popular collection
                </p>
              </div>

              {/* Right-Aligned Button */}
              <Button
                className="bg-navy-500 text-white px-4 py-2 rounded-full text-sm hover:bg-stone-600 transition"
                onClick={() => {
                  // Navigate to search page showing all products (same as featured section + more recent)
                  navigate('/search');
                }}
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

        {/* Shop by style carousel */}
        <div>
          <div className="text-center mb-12">
            <h2 className="card-heading mt-4">Shop by Style</h2>
            <p className="text-stone-600 text-lg">
              Discover products curated by unique styles
            </p>
            {/* Right-Aligned Button using absolute positioning */}
            <Button
              className="absolute right-11 bg-navy-500 text-white px-4 py-2 rounded-full text-sm hover:bg-stone-600 transition"
              onClick={() => navigate('/search')}
            >
              View All
            </Button>
          </div>
          <StyleCarousel />
          <div className="text-center mt-8">

          </div>
        </div>

        {/* New Arrivals Section */}
        <section className="section-container collections-bg my-4 md:my-5">
          <div className="container mx-auto px-4">

            {/* Heading & Button */}
            <div className="relative mb-8 flex items-center justify-between">
              <div className="text-center flex-1">
                <h2 className="card-heading mt-2">New Arrivals</h2>
                <p className="card-subheading mt-1">
                  Fresh styles just added to our collection
                </p>
              </div>

              <Button
                className="bg-navy-500 text-white px-4 py-2 rounded-full text-sm hover:bg-stone-600 transition"
                onClick={() => navigate('/search?isNew=true')}
              >
                View All
              </Button>
            </div>

            {/* Products Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6"
            >
              {newArrivalProducts.length > 0 ? (
                newArrivalProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <ProductCard {...product} />
                  </motion.div>
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500">
                  No new arrivals at the moment.
                </p>
              )}
            </motion.div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-4 bg-stone-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="card-heading mt-4">
                How Our Platform Works
              </h2>
              <p className="text-stone-600 text-lg max-w-3xl mx-auto">
                Discover, compare, and find your perfect style from curated fashion collections
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
              <div className="text-center group">
                <div className="w-20 h-20 bg-navy-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-stone-200 transition-colors">
                  <svg className="w-10 h-10 text-navy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="font-serif text-xl font-semibold text-navy-800 mb-4">
                  1. Search & Discover
                </h3>
                <p className="text-stone-600 leading-relaxed">
                  Use our smart search to find exactly what you're looking for. Search by style, color, fabric, or even describe what you want in natural language.
                </p>
              </div>

              <div className="text-center group">
                <div className="w-20 h-20 bg-navy-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-stone-300 transition-colors">
                  <svg className="w-10 h-10 text-navy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="font-serif text-xl font-semibold text-navy-800 mb-4">
                  2. Save Your Favorites
                </h3>
                <p className="text-stone-600 leading-relaxed">
                  Create your personal wishlist by saving items you love. Compare prices, styles, and features to make the perfect choice for your wardrobe.
                </p>
              </div>

              <div className="text-center group">
                <div className="w-20 h-20 bg-navy-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-stone-300 transition-colors">
                  <svg className="w-10 h-10 text-navy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
                <h3 className="font-serif text-xl font-semibold text-navy-800 mb-4">
                  3. Visit & Purchase
                </h3>
                <p className="text-stone-600 leading-relaxed">
                  Click "Visit Website" to go directly to the retailer's page and complete your purchase. We connect you with trusted fashion retailers seamlessly.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
