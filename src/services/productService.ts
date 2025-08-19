import { supabase } from "@/integrations/supabase/client";
import { ProductProps } from "@/components/ProductCard";
import { Tables } from "@/integrations/supabase/types";

// Map Supabase ProductCard to ProductProps
const mapProductCardToProductProps = (
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
  style: productCard.Style,
});

export const homepageCategories = [
  "Co-ord Set",
  "Kurta",
  "Shirt",
  "Unstitched ",
  "3 Piece",
  "2 Piece",
  "1 Piece",
  "Ready to wear",
];

// Fetches products for each homepage category (representing one style)(case-insensitive match)
// @returns Record<categoryName, Product[]>

export const getProductsForHomepageCategories = async (): Promise<
  Record<string, ProductProps[]>
> => {
  const results: Record<string, ProductProps[]> = {};

  for (const category of homepageCategories) {
    const { data, error } = await supabase
      .from("ProductCard")
      .select("*")
      .ilike("category", category)
      .eq("in_stock", true)
      .order("Scraped_at", { ascending: false })
      .limit(5); // fetch first 5 products

    if (error) {
      console.error(`Error fetching ${category}:`, error);
      results[category] = [];
    } else {
      results[category] = data ? data.map(mapProductCardToProductProps) : [];
    }
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
      if (item.Style && !styleMap.has(item.Style)) {
        styleMap.set(item.Style, item);
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

// Queries only the brand column from in-stock products.
// Removes duplicates using Set. Removes empty values using filter(Boolean).
// Returns a clean array of unique brand names.
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
    const { data, error } = await supabase
      .from("ProductCard")
      .select("color")
      .eq("in_stock", true)
      .not("color", "is", null);

    if (error) {
      console.error("Error fetching colors:", error);
      return [];
    }

    const colors = [
      ...new Set(data?.map((item) => item.color).filter(Boolean) || []),
    ];
    return colors.sort();
  } catch (error) {
    console.error("Failed to fetch colors:", error);
    return [];
  }
};

export const searchProducts = async (
  query: string
): Promise<ProductProps[]> => {
  if (!query) {
    return fetchProducts();
  }

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
      console.error("Error searching products:", error);
      return [];
    }

    return data ? data.map(mapProductCardToProductProps) : [];
  } catch (error) {
    console.error("Failed to search products:", error);
    return [];
  }
};

export const filterProducts = async (filters: {
  priceRange?: [number, number];
  brands?: string[];
  categories?: string[];
  fabricTypes?: string[];
  colors?: string[];
  gender?: string;
}, searchQuery?: string): Promise<ProductProps[]> => {
  try {
    console.log('Filtering products with filters:', filters, 'and search query:', searchQuery);
    
    let queryBuilder = supabase
      .from('ProductCard')
      .select('*')
      .eq('in_stock', true);

    // Apply price range filter
    if (filters.priceRange) {
      queryBuilder = queryBuilder.gte('price', filters.priceRange[0]).lte('price', filters.priceRange[1]);
    }

    // Apply brand filter
    if (filters.brands && filters.brands.length > 0) {
      queryBuilder = queryBuilder.in('brand', filters.brands);
    }

    // Apply category filter
    if (filters.categories && filters.categories.length > 0) {
      queryBuilder = queryBuilder.in('category', filters.categories);
    }

    // Apply fabric filter
    if (filters.fabricTypes && filters.fabricTypes.length > 0) {
      queryBuilder = queryBuilder.in('fabric', filters.fabricTypes);
    }

    // Apply color filter
    if (filters.colors && filters.colors.length > 0) {
      queryBuilder = queryBuilder.in('color', filters.colors);
    }

    // Apply gender filter
    if (filters.gender) {
      queryBuilder = queryBuilder.eq('gender', filters.gender);
    }

    // Apply search query if provided
    if (searchQuery && searchQuery.trim()) {
      queryBuilder = queryBuilder.or(`name.ilike.%${searchQuery}%,brand.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%,fabric.ilike.%${searchQuery}%,color.ilike.%${searchQuery}%`);
    }

    const { data, error } = await queryBuilder.order('Scraped_at', { ascending: false });

    if (error) {
      console.error('Error filtering products:', error);
      return [];
    }

    console.log('Filtering completed successfully:', data?.length || 0, 'products found');
    return data ? data.map(mapProductCardToProductProps) : [];
  } catch (error) {
    console.error('Failed to filter products:', error);
    return [];
  }
};