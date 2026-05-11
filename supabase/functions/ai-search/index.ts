import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { query } = await req.json();
    if (!query || typeof query !== "string") {
      return new Response(JSON.stringify({ error: "query required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: products } = await supabase
      .from("products")
      .select("id, name, description, base_price, sale_price, is_on_offer, product_type, category:categories(name)")
      .eq("is_active", true)
      .eq("is_in_stock", true);

    const list = (products ?? []).map((p: any) => {
      const price = p.is_on_offer && p.sale_price ? p.sale_price : p.base_price;
      return `${p.id}|${p.name}|${p.product_type}|${p.category?.name ?? ""}|Ksh${price}|${p.description?.slice(0, 80) ?? ""}`;
    }).join("\n");

    // Log query
    supabase.from("ai_chat_logs").insert({ message: query.slice(0, 200), intent: "search" }).then(() => {});

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          { role: "system", content: `Match user search queries to product IDs from a catalog. Return ONLY a JSON array of up to 8 matching product IDs, ordered by relevance. No prose.\n\nCatalog (id|name|type|category|price|desc):\n${list}` },
          { role: "user", content: query },
        ],
        response_format: { type: "json_object" },
      }),
    });

    const data = await resp.json();
    const txt = data?.choices?.[0]?.message?.content ?? "[]";
    let ids: string[] = [];
    try {
      const parsed = JSON.parse(txt);
      ids = Array.isArray(parsed) ? parsed : (parsed.ids ?? parsed.results ?? []);
    } catch { ids = []; }

    return new Response(JSON.stringify({ ids: ids.filter((x) => typeof x === "string") }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message, ids: [] }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});