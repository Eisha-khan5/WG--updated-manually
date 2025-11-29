// NLP-based Search Function (No Embeddings Required)
// Uses OpenAI Chat API for intelligent entity extraction
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import OpenAI from "npm:openai@4";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY")!,
});

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// Entity extraction using OpenAI Chat API
async function extractEntitiesWithAI(query: string) {
  console.log("🤖 Extracting entities from query:", query);

  const systemPrompt = `You are a fashion product search assistant. Extract ALL relevant search parameters from user queries.

IMPORTANT: Extract EVERY attribute mentioned in the query, not just some of them.

Extract these fields:
- color: ANY color mentioned (red, blue, black, white, green, pink, orange, brown, grey, yellow, purple, maroon, navy, beige, cream, golden, silver, etc.)
- fabric: ANY fabric type (cotton, silk, chiffon, lawn, linen, wool, velvet, satin, organza, denim, leather, suede, polyester, rayon, lycra, etc.)
- category: product type (dress, kurta, kameez, shalwar, shirt, trouser, pant, dupatta, shawl, jacket, coat, blazer, skirt, top, blouse, etc.)
- gender: Male or Female (from keywords: men, women, man, woman, boy, girl, male, female, boys, girls, men's, women's, mens, womens, ladies, gents)
- style: style keywords (elegant, casual, formal, party, wedding, traditional, modern, vintage, chic, minimalist, luxury, festive, summer, winter, printed, embroidered, plain, etc.)
- min_price: minimum price if mentioned
- max_price: maximum price (from: "under X", "below X", "less than X", "up to X", or just a number)
- is_new: true if mentions "new", "latest", "fresh", "recent"
- has_discount: true if mentions "sale", "discount", "offer", "deal"

CRITICAL RULES FOR GENDER:
1. "men", "mens", "men's", "man", "boy", "boys", "male", "gents" → gender: "Male"
2. "women", "womens", "women's", "woman", "girl", "girls", "female", "ladies" → gender: "Female"
3. ALWAYS extract gender if ANY gender keyword appears
4. Extract ALL other attributes present in the query
5. Return ONLY valid JSON - no explanations
6. If a field is not in the query, omit it from JSON
7. Be case-insensitive when matching
8. Look for plurals (shirts, dresses, kurtas)

Examples:
Query: "red silk kurta for women under 5000"
Output: {"color":"red","fabric":"silk","category":"kurta","gender":"Female","max_price":5000}

Query: "mens kurta"
Output: {"category":"kurta","gender":"Male"}

Query: "red cotton kurta"
Output: {"color":"red","fabric":"cotton","category":"kurta"}

Query: "elegant black dress"
Output: {"color":"black","category":"dress","style":"elegant"}

Query: "men casual shirts under 3000"
Output: {"gender":"Male","category":"shirt","style":"casual","max_price":3000}

Query: "blue denim jeans for boys"
Output: {"color":"blue","fabric":"denim","category":"jeans","gender":"Male"}

Query: "womens printed kurtas"
Output: {"category":"kurta","style":"printed","gender":"Female"}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Extract attributes from: "${query}"` }
      ],
      temperature: 0.1, // Lower temperature for more consistent extraction
      max_tokens: 250,
    });

    const content = response.choices[0].message.content?.trim() || "{}";
    console.log("🧠 AI Response:", content);

    // Try to extract JSON from response (in case there's extra text)
    let jsonMatch = content.match(/\{[^{}]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : content;

    // Parse JSON response
    const entities = JSON.parse(jsonString);
    console.log("✅ Extracted entities from AI:", entities);

    // Enhance with fallback for missed items
    const fallbackEntities = basicEntityExtraction(query);
    const mergedEntities = { ...fallbackEntities, ...entities };

    console.log("✅ Final merged entities:", mergedEntities);
    return mergedEntities;
  } catch (error) {
    console.error("❌ AI extraction failed:", error);
    console.log("⚠️ Falling back to pattern matching");
    // Fallback to basic extraction
    return basicEntityExtraction(query);
  }
}

// Fallback: Basic pattern-based extraction
function basicEntityExtraction(query: string): any {
  const normalized = query.toLowerCase().trim();
  const entities: any = {};

  // Color dictionary (most common colors)
  const colors = [
    'red', 'blue', 'black', 'white', 'green', 'yellow', 'pink', 'purple',
    'orange', 'brown', 'grey', 'gray', 'beige', 'cream', 'navy', 'maroon',
    'golden', 'silver', 'teal', 'turquoise', 'coral', 'olive', 'mustard'
  ];

  // Fabric dictionary
  const fabrics = [
    'cotton', 'silk', 'chiffon', 'lawn', 'linen', 'wool', 'velvet',
    'satin', 'organza', 'denim', 'leather', 'suede', 'polyester', 'rayon', 'lycra'
  ];

  // Category dictionary (support plurals)
  const categories = [
    { singular: 'dress', plural: 'dresses' },
    { singular: 'kurta', plural: 'kurtas' },
    { singular: 'kameez', plural: 'kameez' },
    { singular: 'shirt', plural: 'shirts' },
    { singular: 'trouser', plural: 'trousers' },
    { singular: 'pant', plural: 'pants' },
    { singular: 'jeans', plural: 'jeans' },
    { singular: 'jacket', plural: 'jackets' },
    { singular: 'coat', plural: 'coats' },
    { singular: 'skirt', plural: 'skirts' },
    { singular: 'top', plural: 'tops' },
    { singular: 'blouse', plural: 'blouses' },
    { singular: 'dupatta', plural: 'dupattas' },
    { singular: 'shawl', plural: 'shawls' }
  ];

  // Style keywords
  const styles = [
    'elegant', 'casual', 'formal', 'party', 'wedding', 'traditional',
    'modern', 'vintage', 'chic', 'minimalist', 'luxury', 'festive',
    'printed', 'embroidered', 'plain', 'summer', 'winter'
  ];

  // Extract color
  for (const color of colors) {
    if (new RegExp(`\\b${color}\\b`, 'i').test(normalized)) {
      entities.color = color;
      break;
    }
  }

  // Extract fabric
  for (const fabric of fabrics) {
    if (new RegExp(`\\b${fabric}\\b`, 'i').test(normalized)) {
      entities.fabric = fabric;
      break;
    }
  }

  // Extract category (check both singular and plural)
  for (const cat of categories) {
    if (new RegExp(`\\b${cat.singular}\\b`, 'i').test(normalized) ||
        new RegExp(`\\b${cat.plural}\\b`, 'i').test(normalized)) {
      entities.category = cat.singular;
      break;
    }
  }

  // Extract style
  for (const style of styles) {
    if (new RegExp(`\\b${style}\\b`, 'i').test(normalized)) {
      entities.style = style;
      break;
    }
  }

  // Extract price
  const pricePatterns = [
    { regex: /under\s+(\d+)/i, type: 'max' },
    { regex: /below\s+(\d+)/i, type: 'max' },
    { regex: /less\s+than\s+(\d+)/i, type: 'max' },
    { regex: /up\s+to\s+(\d+)/i, type: 'max' },
    { regex: /(\d+)\s*-\s*(\d+)/, type: 'range' },
    { regex: /(\d{3,5})/, type: 'max' }
  ];

  for (const pattern of pricePatterns) {
    const match = normalized.match(pattern.regex);
    if (match) {
      if (pattern.type === 'range') {
        entities.min_price = parseInt(match[1]);
        entities.max_price = parseInt(match[2]);
      } else {
        entities.max_price = parseInt(match[1]);
      }
      break;
    }
  }

  // Extract gender
  if (/\b(male|men|man|boy|boys|mens|men's|gents)\b/i.test(normalized)) {
    entities.gender = 'Male';
  } else if (/\b(female|women|woman|girl|girls|womens|women's|ladies)\b/i.test(normalized)) {
    entities.gender = 'Female';
  }

  // Extract special flags
  if (/\b(new|latest|fresh|recent)\b/i.test(normalized)) {
    entities.is_new = true;
  }
  if (/\b(sale|discount|offer|deal)\b/i.test(normalized)) {
    entities.has_discount = true;
  }

  console.log("🔍 Fallback extraction:", entities);
  return entities;
}

// Search products with extracted filters
async function searchProducts(entities: any, limit: number = 20, offset: number = 0) {
  console.log("🔍 Searching with filters:", entities);

  let query = supabase
    .from("ProductCard")
    .select("*", { count: "exact" })
    .eq("in_stock", true);

  // Apply filters
  if (entities.gender) {
    query = query.eq("gender", entities.gender);
  }

  if (entities.max_price) {
    query = query.lte("price", entities.max_price);
  }

  if (entities.min_price) {
    query = query.gte("price", entities.min_price);
  }

  if (entities.color) {
    query = query.ilike("color", `%${entities.color}%`);
  }

  if (entities.fabric) {
    query = query.ilike("fabric", `%${entities.fabric}%`);
  }

  if (entities.category) {
    query = query.ilike("category", `%${entities.category}%`);
  }

  if (entities.style) {
    query = query.or(`style.ilike.%${entities.style}%,category.ilike.%${entities.style}%,name.ilike.%${entities.style}%`);
  }

  if (entities.is_new) {
    query = query.eq("is_new", "New");
  }

  if (entities.has_discount) {
    query = query.gt("discount", 0);
  }

  // Order and paginate
  const { data, error, count } = await query
    .order("Scraped_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("❌ Database error:", error);
    throw error;
  }

  console.log(`✅ Found ${data?.length || 0} products`);
  return { data, count };
}

// Calculate relevance scores
function rankResults(products: any[], entities: any) {
  return products.map(product => {
    let score = 0;
    let matches = 0;

    // Exact matches get higher scores
    if (entities.color && product.color?.toLowerCase().includes(entities.color.toLowerCase())) {
      score += 3;
      matches++;
    }
    if (entities.fabric && product.fabric?.toLowerCase().includes(entities.fabric.toLowerCase())) {
      score += 3;
      matches++;
    }
    if (entities.category && product.category?.toLowerCase().includes(entities.category.toLowerCase())) {
      score += 4;
      matches++;
    }
    if (entities.gender && product.gender === entities.gender) {
      score += 2;
      matches++;
    }
    if (entities.style) {
      if (product.style?.toLowerCase().includes(entities.style.toLowerCase())) {
        score += 2;
        matches++;
      }
      if (product.name?.toLowerCase().includes(entities.style.toLowerCase())) {
        score += 1;
      }
    }

    // Boost new products
    if (product.is_new === "New") score += 0.5;

    // Boost discounted products
    if (product.discount && product.discount > 0) score += 0.5;

    return { ...product, _score: score, _matches: matches };
  }).sort((a, b) => b._score - a._score);
}

// Main HTTP handler
Deno.serve(async (req) => {
  // CORS headers
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      }
    });
  }

  try {
    const { query, limit = 20, offset = 0 } = await req.json();

    if (!query || typeof query !== "string") {
      return new Response(
        JSON.stringify({ error: "Query is required" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }

    console.log("📨 NLP Search Request:", query);

    // Step 1: Extract entities using AI
    const entities = await extractEntitiesWithAI(query);

    // Step 2: Search database with filters
    const { data: products, count } = await searchProducts(entities, limit, offset);

    if (!products || products.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          query,
          entities,
          total: 0,
          returned: 0,
          results: []
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }

    // Step 3: Rank results
    const rankedResults = rankResults(products, entities);

    // Step 4: Remove internal scoring fields
    const cleanResults = rankedResults.map(({ _score, _matches, ...product }) => product);

    return new Response(
      JSON.stringify({
        success: true,
        query,
        entities,
        total: count || products.length,
        returned: cleanResults.length,
        results: cleanResults
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          'Access-Control-Allow-Origin': '*'
        }
      }
    );

  } catch (error) {
    console.error("❌ Error in NLP search:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Internal server error",
        details: error.message
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }
});
