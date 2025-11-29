import { supabase } from "@/integrations/supabase/client";
import { ProductProps } from "@/components/ProductCard";
import { Tables } from "@/integrations/supabase/types";

// Map Supabase ProductCard to ProductProps
export const mapProductCardToProductProps = (
  productCard: Tables<"ProductCard">
): ProductProps => ({
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

// Fetch distinct categories dynamically from Supabase
export const getDistinctCategories = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from("ProductCard")
    .select("category")
    .not("category", "is", null);

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  // Extract unique, trimmed, non-empty categories
  const categories = Array.from(
    new Set(data.map((item) => item.category?.trim()).filter(Boolean))
  );

  return categories;
};

// Fetch products for homepage categories dynamically
export const getProductsForHomepageCategories = async (): Promise<
  Record<string, ProductProps[]>
> => {
  const results: Record<string, ProductProps[]> = {};

  // Fetch dynamic categories
  const homepageCategories = await getDistinctCategories();

  for (const category of homepageCategories) {
    const { data, error } = await supabase
      .from("ProductCard")
      .select("*")
      .ilike("category", category) // case-insensitive match
      .eq("in_stock", true)
      .order("Scraped_at", { ascending: false })
      .limit(5); // first 5 products per category

    if (error) {
      console.error(`Error fetching ${category}:`, error);
      results[category] = [];
      continue;
    }

    results[category] = data
      ? data.map((p: Tables<"ProductCard">) => mapProductCardToProductProps(p))
      : [];
  }

  return results;
};

// It fetches products from your Supabase database.
// Only products in stock are fetched, Latest scraped products appear first.
// Function to show "Featured Products" on the homepage.
export const fetchProducts = async (): Promise<ProductProps[]> => {
  try {
    console.log("Fetching all products from Supabase...");
    const { data, error } = await supabase
      .from("ProductCard")
      .select("*")
      .eq("in_stock", true)
      .order("Scraped_at", { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
      return [];
    }

    console.log("Products fetched successfully:", data?.length || 0);
    return data ? data.map(mapProductCardToProductProps) : [];
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
};

// Searches products based on a style
// for the homepage shop by style section.
export const fetchProductsByStyles = async (): Promise<ProductProps[]> => {
  try {
    console.log("Fetching products by styles from Supabase...");

    const { data, error } = await supabase
      .from("ProductCard")
      .select("*")
      .eq("in_stock", true)
      .order("Scraped_at", { ascending: true });

    if (error) {
      console.error("Error fetching products by styles:", error);
      return [];
    }

    if (!data || data.length === 0) {
      console.log("No products found for styles.");
      return [];
    }

    // Group products by style, pick one per style
    const styleMap = new Map<string, Tables<"ProductCard">>();
    data.forEach((item: Tables<"ProductCard">) => {
      if (item.style && !styleMap.has(item.style)) {
        styleMap.set(item.style, item);
      }
    });

    const uniqueProducts = Array.from(styleMap.values());
    console.log(
      "Products by styles fetched successfully:",
      uniqueProducts.length
    );

    return uniqueProducts.map(mapProductCardToProductProps);
  } catch (error) {
    console.error("Failed to fetch products by styles:", error);
    return [];
  }
};

// It fetches a single product by its ID from your Supabase database.
export const fetchProductById = async (
  id: string
): Promise<ProductProps | null> => {
  try {
    console.log("Fetching product by ID:", id);
    const { data, error } = await supabase
      .from("ProductCard")
      .select("*")
      .eq("id", parseInt(id))
      .eq("in_stock", true)
      .single();

    if (error) {
      console.error("Error fetching product:", error);
      return null;
    }

    return data ? mapProductCardToProductProps(data) : null;
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return null;
  }
};

// New arrivals ......
export const fetchNewArrivals = async (): Promise<ProductProps[]> => {
  try {
    console.log("Fetching new arrival products from Supabase...");

    const { data, error } = await supabase
      .from("ProductCard")
      .select("*")
      .eq("is_new", "New") // filter only new arrival products
      .eq("in_stock", true) // optional: only in-stock items
      .order("Scraped_at", { ascending: false }); // latest first

    if (error) {
      console.error("Error fetching new arrivals:", error);
      return [];
    }

    if (!data || data.length === 0) {
      console.log("No new arrival products found.");
      return [];
    }

    console.log("New arrival products fetched successfully:", data.length);

    return data.map(mapProductCardToProductProps);
  } catch (error) {
    console.error("Failed to fetch new arrivals:", error);
    return [];
  }
};

// Paginated product fetching
export const fetchProductsPaginated = async (
  offset: number = 0,
  limit: number = 20,
  filters?: {
    priceRange?: [number, number];
    brands?: string[];
    categories?: string[];
    fabricTypes?: string[];
    colors?: string[];
    gender?: string;
  },
  searchQuery?: string,
  isNew?: boolean
): Promise<ProductProps[]> => {
  try {
    let queryBuilder = supabase
      .from("ProductCard")
      .select("*")
      .eq("in_stock", true);

    // Apply is_new filter if specified
    if (isNew) {
      queryBuilder = queryBuilder.eq("is_new", "New");
    }

    // Apply price range filter
    if (filters?.priceRange) {
      queryBuilder = queryBuilder
        .gte("price", filters.priceRange[0])
        .lte("price", filters.priceRange[1]);
    }

    // Apply brand filter
    if (filters?.brands && filters.brands.length > 0) {
      queryBuilder = queryBuilder.in("brand", filters.brands);
    }

    // Apply category filter
    if (filters?.categories && filters.categories.length > 0) {
      queryBuilder = queryBuilder.in("category", filters.categories);
    }

    // Apply fabric filter
    if (filters?.fabricTypes && filters.fabricTypes.length > 0) {
      queryBuilder = queryBuilder.in("fabric", filters.fabricTypes);
    }

    // Apply color filter
    if (filters?.colors && filters.colors.length > 0) {
      queryBuilder = queryBuilder.in("color", filters.colors);
    }

    // Apply gender filter
    if (filters?.gender) {
      queryBuilder = queryBuilder.eq("gender", filters.gender);
    }

    // Apply search query if provided
    if (searchQuery && searchQuery.trim()) {
      queryBuilder = queryBuilder.or(
        `name.ilike.%${searchQuery}%,brand.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%,fabric.ilike.%${searchQuery}%,color.ilike.%${searchQuery}%`
      );
    }

    // Order by most recent products (Scraped_at DESC) for default/browse all mode
    const { data, error } = await queryBuilder
      .order("Scraped_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Error fetching paginated products:", error);
      return [];
    }

    return data ? data.map(mapProductCardToProductProps) : [];
  } catch (error) {
    console.error("Failed to fetch paginated products:", error);
    return [];
  }
};

// Queries only the brand column from in-stock products.
// Removes duplicates using Set. Removes empty values using filter(Boolean).
// Returns a clean array of unique brand names.

// Get available filter options from database
export const getBrands = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from("ProductCard")
      .select("brand")
      .eq("in_stock", true);

    if (error) {
      console.error("Error fetching brands:", error);
      return [];
    }

    const brands = [
      ...new Set(data?.map((item) => item.brand).filter(Boolean) || []),
    ];
    return brands.sort();
  } catch (error) {
    console.error("Failed to fetch brands:", error);
    return [];
  }
};

export const getCategories = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from("ProductCard")
      .select("category")
      .eq("in_stock", true);

    if (error) {
      console.error("Error fetching categories:", error);
      return [];
    }

    const categories = [
      ...new Set(data?.map((item) => item.category).filter(Boolean) || []),
    ];
    return categories.sort();
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
};

export const getFabrics = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from("ProductCard")
      .select("fabric")
      .eq("in_stock", true)
      .not("fabric", "is", null);

    if (error) {
      console.error("Error fetching fabrics:", error);
      return [];
    }

    const fabrics = [
      ...new Set(data?.map((item) => item.fabric).filter(Boolean) || []),
    ];
    return fabrics.sort();
  } catch (error) {
    console.error("Failed to fetch fabrics:", error);
    return [];
  }
};

export const getColors = async (): Promise<string[]> => {
  try {
    // Fetch ALL products to ensure we get ALL unique colors in the database
    const { data, error } = await supabase
      .from("ProductCard")
      .select("color")
      .not("color", "is", null)
      .not("color", "eq", "");

    if (error) {
      console.error("Error fetching colors:", error);
      return [];
    }

    console.log('📊 Total products with colors fetched:', data?.length);

    // Normalize colors: trim whitespace and handle multiple colors separated by delimiters
    const colorSet = new Set<string>();

    data?.forEach((item) => {
      if (item.color && item.color.trim()) {
        // Split by comma, slash, ampersand, or 'and' to handle multi-color entries
        const colors = item.color
          .split(/[,/&]|\s+and\s+/i)
          .map(c => c.trim())
          .filter(c => c.length > 0);

        colors.forEach(color => {
          // Capitalize first letter of each word for consistency
          const words = color.split(/\s+/);
          const normalized = words
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
          colorSet.add(normalized);
        });
      }
    });

    const uniqueColors = Array.from(colorSet).sort();
    console.log('🎨 Unique colors loaded:', uniqueColors.length);
    console.log('🎨 All available colors:', uniqueColors);
    return uniqueColors;
  } catch (error) {
    console.error("Failed to fetch colors:", error);
    return [];
  }
};

export const getMaxPrice = async (): Promise<number> => {
  try {
    const { data, error } = await supabase
      .from("ProductCard")
      .select("price")
      .eq("in_stock", true)
      .order("price", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error("Error fetching max price:", error);
      return 25000; // fallback
    }

    return data?.price || 25000;
  } catch (error) {
    console.error("Failed to fetch max price:", error);
    return 25000;
  }
};

// Fallback simple text search
const simpleTextSearch = async (query: string): Promise<ProductProps[]> => {
  try {
    const { data, error } = await supabase
      .from("ProductCard")
      .select("*")
      .eq("in_stock", true)
      .or(
        `name.ilike.%${query}%,brand.ilike.%${query}%,category.ilike.%${query}%,fabric.ilike.%${query}%,color.ilike.%${query}%`
      )
      .order("Scraped_at", { ascending: false });

    if (error) {
      console.error("Error in simple text search:", error);
      return [];
    }

    return data ? data.map(mapProductCardToProductProps) : [];
  } catch (error) {
    console.error("Failed simple text search:", error);
    return [];
  }
};

// Advanced search function that handles natural language queries like "orange cotton dress for female under 4500"
export const searchProducts = async (
  query: string
): Promise<ProductProps[]> => {
  if (!query.trim()) {
    return fetchProducts();
  }

  try {
    console.log("Searching products with query:", query);

    // Parse the query for specific filters
    const lowerQuery = query.toLowerCase();
    const words = lowerQuery.split(" ");

    // Extract potential filters from the query
    const genderKeywords = ["male", "female", "men", "women", "man", "woman"];
    const categoryKeywords = [
      "dress",
      "shirt",
      "kurta",
      "kameez",
      "shalwar",
      "trouser",
      "pant",
    ];
    const fabricKeywords = [
      "cotton",
      "silk",
      "chiffon",
      "lawn",
      "linen",
      "wool",
      "velvet",
      "organza",
    ];

    let genderFilter = null;
    let priceFilter = null;
    let fabricFilter = null;
    let categoryFilter = null;

    // Extract gender
    const foundGender = words.find((word) => genderKeywords.includes(word));
    if (foundGender) {
      genderFilter =
        foundGender === "male" || foundGender === "men" || foundGender === "man"
          ? "Male"
          : "Female";
    }

    // Extract price (look for numbers)
    const priceMatch = query.match(/(\d+)/);
    if (priceMatch) {
      priceFilter = parseInt(priceMatch[1]);
    }

    // Extract fabric
    fabricFilter = words.find((word) => fabricKeywords.includes(word));

    // Extract category
    categoryFilter = words.find((word) => categoryKeywords.includes(word));

    let queryBuilder = supabase
      .from("ProductCard")
      .select("*")
      .eq("in_stock", true);

    // Apply extracted filters
    if (genderFilter) {
      queryBuilder = queryBuilder.eq("gender", genderFilter);
    }

    if (priceFilter) {
      queryBuilder = queryBuilder.lte("price", priceFilter);
    }

    if (fabricFilter) {
      queryBuilder = queryBuilder.ilike("fabric", `%${fabricFilter}%`);
    }

    if (categoryFilter) {
      queryBuilder = queryBuilder.ilike("category", `%${categoryFilter}%`);
    }

    // Also search in text fields for any remaining keywords
    const textSearch = query.replace(/\d+/g, "").trim();
    if (textSearch) {
      queryBuilder = queryBuilder.or(
        `name.ilike.%${textSearch}%,brand.ilike.%${textSearch}%,color.ilike.%${textSearch}%`
      );
    }

    const { data, error } = await queryBuilder.order("Scraped_at", {
      ascending: false,
    });

    if (error) {
      console.error("Error searching products:", error);
      // Fallback to simple text search
      return await simpleTextSearch(query);
    }

    console.log(
      "Search completed successfully:",
      data?.length || 0,
      "products found"
    );
    return data ? data.map(mapProductCardToProductProps) : [];
  } catch (error) {
    console.error("Failed to search products:", error);
    return await simpleTextSearch(query);
  }
};

export const filterProducts = async (
  filters: {
    priceRange?: [number, number];
    brands?: string[];
    categories?: string[];
    fabricTypes?: string[];
    colors?: string[];
    gender?: string;
  },
  searchQuery?: string
): Promise<ProductProps[]> => {
  try {
    console.log(
      "Filtering products with filters:",
      filters,
      "and search query:",
      searchQuery
    );

    let queryBuilder = supabase
      .from("ProductCard")
      .select("*")
      .eq("in_stock", true);

    // Apply price range filter
    if (filters.priceRange) {
      queryBuilder = queryBuilder
        .gte("price", filters.priceRange[0])
        .lte("price", filters.priceRange[1]);
    }

    // Apply brand filter
    if (filters.brands && filters.brands.length > 0) {
      queryBuilder = queryBuilder.in("brand", filters.brands);
    }

    // Apply category filter
    if (filters.categories && filters.categories.length > 0) {
      queryBuilder = queryBuilder.in("category", filters.categories);
    }

    // Apply fabric filter
    if (filters.fabricTypes && filters.fabricTypes.length > 0) {
      queryBuilder = queryBuilder.in("fabric", filters.fabricTypes);
    }

    // Apply color filter
    if (filters.colors && filters.colors.length > 0) {
      queryBuilder = queryBuilder.in("color", filters.colors);
    }

    // Apply gender filter
    if (filters.gender) {
      queryBuilder = queryBuilder.eq("gender", filters.gender);
    }

    // Apply search query if provided
    if (searchQuery && searchQuery.trim()) {
      queryBuilder = queryBuilder.or(
        `name.ilike.%${searchQuery}%,brand.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%,fabric.ilike.%${searchQuery}%,color.ilike.%${searchQuery}%`
      );
    }

    const { data, error } = await queryBuilder.order("Scraped_at", {
      ascending: false,
    });

    if (error) {
      console.error("Error filtering products:", error);
      return [];
    }

    console.log(
      "Filtering completed successfully:",
      data?.length || 0,
      "products found"
    );
    return data ? data.map(mapProductCardToProductProps) : [];
  } catch (error) {
    console.error("Failed to filter products:", error);
    return [];
  }
};
