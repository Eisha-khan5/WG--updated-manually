import { supabase } from "@/integrations/supabase/client";
import { ProductProps } from "@/components/ProductCard";

// Map Supabase ProductCard to ProductProps
const mapProductCardToProductProps = (productCard: any): ProductProps => ({
  id: productCard.id.toString(),
  name: productCard.name,
  brand: productCard.brand,
  price: productCard.price,
  category: productCard.category,
  imageUrl: productCard.image_url,
  fabric: productCard.fabric,
  color: productCard.color,
  discount: productCard.discount,
  isNew: productCard.is_new,
  gender: productCard.gender,
  productUrl: productCard.product_url,
  style: productCard.style,
});

interface UserPreferences {
  gender?: string;
  colors?: string[];
  fabrics?: string[];
  brands?: string[];
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
}

export const getPersonalizedRecommendations = async (
  preferences: UserPreferences,
  limit: number = 6,
  offset: number = 0
): Promise<ProductProps[]> => {
  try {
    // Check if any products exist
    const { data: allProducts, error: checkError } = await supabase
      .from("ProductCard")
      .select("id")
      .eq("in_stock", true)
      .limit(1);

    if (checkError) {
      console.error("Error checking products:", checkError);
      return [];
    }

    if (!allProducts || allProducts.length === 0) {
      console.log(
        "No products found in database for personalized recommendations"
      );
      return [];
    }

    // Build the base query
    let query = supabase.from("ProductCard").select("*").eq("in_stock", true);

    // -----------------------------
    // APPLY USER PREFERENCES
    // -----------------------------
    if (preferences.gender) {
      query = query.eq("gender", preferences.gender);
    }

    if (preferences.brands?.length > 0) {
      query = query.in("brand", preferences.brands);
    }

    if (preferences.categories?.length > 0) {
      query = query.in("category", preferences.categories);
    }

    if (preferences.fabrics?.length > 0) {
      query = query.in("fabric", preferences.fabrics);
    }

    if (preferences.minPrice !== undefined) {
      query = query.gte("price", preferences.minPrice);
    }

    if (preferences.maxPrice !== undefined) {
      query = query.lte("price", preferences.maxPrice);
    }

    // -----------------------------
    // PAGINATION + ORDERING
    // -----------------------------
    const { data, error } = await query
      .order("Scraped_at", { ascending: false })
      .range(offset, offset + limit - 1); // 👈 PAGINATION HERE

    if (error) {
      console.error("Error fetching personalized recommendations:", error);
      return await getFallbackRecommendations(limit);
    }

    if (!data || data.length === 0) {
      return await getFallbackRecommendations(limit);
    }

    return data.map(mapProductCardToProductProps);
  } catch (error) {
    console.error("Failed to fetch personalized recommendations:", error);
    return await getFallbackRecommendations(limit);
  }
};

// Fallback to trending/popular products when no personalized recommendations available
const getFallbackRecommendations = async (
  limit: number = 6
): Promise<ProductProps[]> => {
  try {
    const { data, error } = await supabase
      .from("ProductCard")
      .select("*")
      .eq("in_stock", true)
      .order("Scraped_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching fallback recommendations:", error);
      return [];
    }

    return data ? data.map(mapProductCardToProductProps) : [];
  } catch (error) {
    console.error("Failed to fetch fallback recommendations:", error);
    return [];
  }
};

export const getRecommendationsByCategory = async (
  category: string,
  excludeProductId?: string,
  limit: number = 4
): Promise<ProductProps[]> => {
  try {
    let query = supabase
      .from("ProductCard")
      .select("*")
      .eq("category", category)
      .eq("in_stock", true);

    if (excludeProductId) {
      query = query.neq("id", parseInt(excludeProductId));
    }

    const { data, error } = await query
      .order("Scraped_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching category recommendations:", error);
      return [];
    }

    return data ? data.map(mapProductCardToProductProps) : [];
  } catch (error) {
    console.error("Failed to fetch category recommendations:", error);
    return [];
  }
};
