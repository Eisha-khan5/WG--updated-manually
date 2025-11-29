// Imports
// ----------------------
import OpenAI from "npm:openai";
import { createClient, SupabaseClient } from "npm:@supabase/supabase-js";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { config } from "dotenv/mod.ts"; // Deno-compatible dotenv

// Load environment variables from .env into Deno.env
// ----------------------
await config({ export: true });

// Initialize OpenAI client
// ----------------------
const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY")!,
});

// Initialize Supabase client
// ----------------------
const supabase: SupabaseClient = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// Helper: build text from a product
// ----------------------
function buildText(record: any) {
  return [
    record.name,
    record.brand,
    record.gender,
    record.category,
    record.fabric,
    record.color,
    record.discount,
    record.is_new,
    record.style,
  ]
    .filter(Boolean)
    .join(" | ");
}

// Helper: embed a single product
// ----------------------
async function embedProduct(record: any) {
  const text = buildText(record);
  if (!text) {
    console.warn(`Skipping product ${record.id} - no text to embed`);
    return;
  }

  const embeddingRes = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });

  await supabase
    .from("ProductCard")
    .update({ embedding: embeddingRes.data[0].embedding })
    .eq("id", record.id);

  console.log(`✔ Embedded product ${record.id}`);
}

// ----------------------
// Serve HTTP requests
// ----------------------
serve(async (req) => {
  try {
    const payload = await req.json();
    console.log("📨 Received payload:", JSON.stringify(payload).substring(0, 200));

    // ----------------------
    // Handle Database Webhook (INSERT/UPDATE events)
    // ----------------------
    if (payload.type && (payload.type === "INSERT" || payload.type === "UPDATE")) {
      console.log(`🔔 Webhook event: ${payload.type} on table: ${payload.table || 'ProductCard'}`);

      const record = payload.record;
      if (!record) {
        console.error("❌ No record in webhook payload");
        return new Response("No record in webhook payload", { status: 400 });
      }

      console.log(`📦 Processing product ID: ${record.id}, Name: ${record.name}`);

      try {
        await embedProduct(record);
        return new Response(
          JSON.stringify({
            success: true,
            message: `Embedding generated for product ${record.id}`,
            event: payload.type
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" }
          }
        );
      } catch (err) {
        console.error(`❌ Failed to embed product ${record.id}:`, err);
        return new Response(
          JSON.stringify({
            success: false,
            error: err.message,
            product_id: record.id
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" }
          }
        );
      }
    }

    // ----------------------
    // Backfill all existing products
    // ----------------------
    if (payload.backfill === true) {
      console.log("🔄 Starting backfill...");

      const { data: products, error } = await supabase
        .from("ProductCard")
        .select("*")
        .is("embedding", null); // only products missing embeddings

      if (error) throw error;

      if (!products || products.length === 0) {
        console.log("✅ No products need embedding - all up to date!");
        return new Response(
          JSON.stringify({
            success: true,
            message: "No products to embed - all products already have embeddings"
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" }
          }
        );
      }

      console.log(`📊 Found ${products.length} products without embeddings`);

      // Optional batch size to avoid rate limits
      const batchSize = 50;
      let successCount = 0;
      let failCount = 0;

      for (let i = 0; i < products.length; i += batchSize) {
        const batch = products.slice(i, i + batchSize);
        console.log(`⚙️ Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(products.length / batchSize)} (${batch.length} products)`);

        for (const record of batch) {
          try {
            await embedProduct(record);
            successCount++;
          } catch (err) {
            console.error(`❌ Failed to embed product ${record.id}:`, err);
            failCount++;
          }
        }

        // Small delay between batches to avoid rate limits
        if (i + batchSize < products.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      console.log(`✅ Backfill completed - Success: ${successCount}, Failed: ${failCount}`);
      return new Response(
        JSON.stringify({
          success: true,
          message: "Backfill completed",
          total: products.length,
          success: successCount,
          failed: failCount
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // ----------------------
    // Single insert/update (direct API call)
    // ----------------------
    const record = payload.record;
    if (!record) {
      console.error("❌ No record found in payload");
      return new Response(
        JSON.stringify({ success: false, error: "No record found in payload" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    console.log(`📦 Direct API call - Processing product ID: ${record.id}`);
    await embedProduct(record);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Embedding generated for product ${record.id}`
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );

  } catch (err) {
    console.error("❌ Error in auto-embed function:", err);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Internal server error",
        details: err.message
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
});
