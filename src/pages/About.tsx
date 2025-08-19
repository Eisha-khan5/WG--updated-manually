
import React from 'react';
import { Navbar } from '@/components/Navbar';
import Footer from '@/components/Footer';

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-stone-100 to-sky-50 py-12">
          <div className="container mx-auto px-4">
            <h1 className="font-serif text-4xl md:text-5xl font-semibold text-center">About Us</h1>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Introduction */}
            <section className="prose prose-lg max-w-none">
              <p className="lead text-lg md:text-xl text-gray-700">
                Wardrobe Genius is a next-generation intelligent clothing search engine designed to revolutionize the way you shop online. 
                We bring together the best of Pakistan's top clothing brands into one seamless platform—so you can discover, compare, 
                and choose fashion that fits your style, budget, and needs effortlessly.
              </p>
              <p className="text-gray-600">
                At the heart of Wardrobe Genius is a commitment to innovation, convenience, and user empowerment. 
                Built with smart search algorithms and curated data, our platform allows you to explore a wide range of 
                clothing across various brands, fabrics, categories, and price points—without the hassle of visiting multiple websites.
              </p>
            </section>
            
            {/* Vision & Mission */}
            <section className="grid md:grid-cols-2 gap-8">
              <div className="bg-sky-50 p-6 rounded-lg shadow-sm">
                <h2 className="font-serif text-2xl font-medium mb-4 text-navy-600">Our Vision</h2>
                <p className="text-gray-600">
                  To be the ultimate fashion discovery engine that empowers every shopper with personalized, 
                  intelligent, and simplified choices in the vast world of online clothing.
                </p>
              </div>
              <div className="bg-sky-50 p-6 rounded-lg shadow-sm">
                <h2 className="font-serif text-2xl font-medium mb-4 text-navy-600">Our Mission</h2>
                <p className="text-gray-600">
                  To transform the online shopping experience by offering a smart, intuitive, and brand-inclusive 
                  fashion search tool—making clothing discovery as easy as thinking it.
                </p>
              </div>
            </section>
            
            {/* Journey */}
            <section>
              <h2 className="font-serif text-3xl font-medium mb-6 text-navy-700">Our Journey</h2>
              <p className="text-gray-600 mb-4">
                Born out of a simple idea—to eliminate the chaos of searching dozens of websites for the perfect outfit—Wardrobe 
                Genius was launched by a team of passionate tech enthusiasts and fashion lovers.
              </p>
              <p className="text-gray-600 mb-4">
                We observed the growing frustration among online shoppers who wanted specific clothing items (e.g., "orange 
                cotton kurti under 3000") but had to manually browse endless pages across different websites. That's where 
                the idea of an AI-powered clothing search engine took shape.
              </p>
              <p className="text-gray-600 mb-4">
                With a mission to bring clarity, speed, and intelligence to this process, we began aggregating high-quality 
                clothing data from the country's leading fashion brands, ensuring users could explore all options in one place.
              </p>
              <p className="text-gray-600">
                Today, Wardrobe Genius stands as a one-of-a-kind fashion tech platform in Pakistan—streamlining how you shop 
                with smart filters, real-time brand data, and sleek user experience.
              </p>
            </section>
            
            {/* What Makes Us Different */}
            <section>
              <h2 className="font-serif text-3xl font-medium mb-6 text-navy-700">What Makes Us Different</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <div className="bg-navy-100 rounded-full p-2 mr-4">
                    <span className="block h-6 w-6 bg-navy-500 rounded-full"></span>
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-2">Unified Search</h3>
                    <p className="text-gray-600">Access collections from multiple brands in one place</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-navy-100 rounded-full p-2 mr-4">
                    <span className="block h-6 w-6 bg-navy-500 rounded-full"></span>
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-2">Smart Filters</h3>
                    <p className="text-gray-600">Search by color, fabric, price range, stitched/unstiched, and more</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-navy-100 rounded-full p-2 mr-4">
                    <span className="block h-6 w-6 bg-navy-500 rounded-full"></span>
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-2">Real-Time Data</h3>
                    <p className="text-gray-600">Updated product info directly from brand websites</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-navy-100 rounded-full p-2 mr-4">
                    <span className="block h-6 w-6 bg-navy-500 rounded-full"></span>
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-2">Simplified Choices</h3>
                    <p className="text-gray-600">Compare items, save favorites, and shop smarter</p>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Commitment */}
            <section className="bg-gradient-to-r from-sky-50 to-sky-50 p-8 rounded-lg">
              <h2 className="font-serif text-3xl font-medium mb-6 text-navy-700">Our Commitment</h2>
              <p className="text-gray-600 mb-4">
                Wardrobe Genius is more than just a search engine—it's a reflection of our dedication to improving 
                fashion discovery for everyone. We are constantly expanding our database, refining our algorithms, 
                and enhancing the user experience.
              </p>
              <p className="text-gray-600 mb-4">
                Our commitment extends beyond convenience—we aim to empower shoppers with transparency, variety, 
                and control, while also supporting local brands by increasing their digital visibility.
              </p>
              <p className="text-gray-600">
                As we grow, we remain focused on creating responsible tech, ensuring data accuracy, and adding 
                features that truly serve our users.
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutPage;
