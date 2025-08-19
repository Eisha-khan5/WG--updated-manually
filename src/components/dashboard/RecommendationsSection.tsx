import React, { useState, useEffect } from 'react';
// UI components for the card layout
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Icons for styling
import { Sparkles, Shirt } from 'lucide-react';
// Animation library for smooth product appearance/disappearance
import { motion, AnimatePresence } from 'framer-motion';
// Component that displays an individual product
import ProductCard from '@/components/ProductCard';
// Type definition for product props (helps TypeScript know the product shape)
import { ProductProps } from '@/components/ProductCard';
// Service function to get recommended products based on preferences
import { getPersonalizedRecommendations } from '@/services/personalizedRecommendationService';
// Service function to get the current user's saved preferences
import { getUserPreferences } from '@/services/preferencesService';
// Custom hook to get the current logged-in user (via Supabase Auth in your case)
import { useAuth } from '@/contexts/AuthContext';

const RecommendationsSection = () => {
  // Store the list of recommended products
  const [recommendations, setRecommendations] = useState<ProductProps[]>([]);
  // Controls whether to show the loading skeleton
  const [loading, setLoading] = useState(true);
  // Get the current logged-in user from the Auth context
  const { user } = useAuth();

  useEffect(() => {
    // This function fetches recommendations for the logged-in user
    const fetchRecommendations = async () => {
      // If no user is logged in → stop here and hide loading state
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true); // Show the skeleton loader

        // 1️⃣ Get user preferences from backend (e.g., colors, sizes, categories)
        const preferences = await getUserPreferences(user.id);
        
        // 2️⃣ Get personalized product recommendations (max 6 items here)
        const data = await getPersonalizedRecommendations(preferences, 9);

        // Save the fetched recommendations into state
        setRecommendations(data);
      } catch (error) {
        // Log any errors for debugging and reset to an empty list
        console.error('Error fetching recommendations:', error);
        setRecommendations([]);
      } finally {
        // Hide the loading skeleton
        setLoading(false);
      }
    };

    // Run the function above every time the `user` changes (login/logout)
    fetchRecommendations();
  }, [user]); // Dependency: re-run when `user` changes

  // --- LOADING STATE ---
  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-white to-stone-50/50 border border-stone-200/60 shadow-lg">
        <CardHeader className="border-b border-stone-100 bg-gradient-to-r from-navy-50 to-stone-50">
          <CardTitle className="flex items-center gap-3 text-navy-800">
            <Sparkles className="h-5 w-5" />
            Recommended for You
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          {/* Display 6 gray placeholder blocks to mimic product cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="animate-pulse">
                {/* Gray image placeholder */}
                <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-4"></div>
                {/* Gray text placeholders */}
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

  // --- MAIN RENDER AFTER LOADING ---
  return (
    <Card className="bg-gradient-to-br from-white to-stone-50/50 border border-stone-200/60 shadow-lg">
      <CardHeader className="border-b border-stone-100 bg-gradient-to-r from-navy-50 to-stone-50">
        <CardTitle className="flex items-center gap-3 text-navy-800">
          <Sparkles className="h-5 w-5" />
          Recommended for You
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        {/* If there are NO recommendations yet */}
        {recommendations.length === 0 ? (
          <div className="text-center text-stone-500 py-12">
            {/* Icon to make the empty state look friendly */}
            <Shirt className="h-16 w-16 mx-auto mb-6 text-stone-300" />
            <p className="text-xl mb-3">No recommendations yet</p>
            <p className="text-sm mb-6">
              We'll show you personalized recommendations once products are available in the database.
            </p>
          </div>
        ) : (
          // If we have recommendations → display them as animated cards
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {recommendations.map((item) => (
                <motion.div
                  key={item.id} // Unique key for React list rendering
                  initial={{ opacity: 0, scale: 0.9 }} // Start animation (fade + shrink)
                  animate={{ opacity: 1, scale: 1 }}    // Animate to full size
                  exit={{ opacity: 0, scale: 0.9 }}     // Exit animation if removed
                  transition={{ duration: 0.3 }}        // Animation speed
                >
                  {/* Render the individual product card with all its props */}
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

export default RecommendationsSection;
