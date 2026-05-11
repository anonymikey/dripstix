import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { productId } = await req.json();
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const { data: current } = await supabase
      .from("products").select("id, name, description, product_type, category:categories(name)")
      .eq("id", productId).maybeSingle();

    const { data: pool } = await supabase
      .from("products")
      .select("id, name, description, product_type, category:categories(name)")
      .eq("is_active", true).eq("is_in_stock", true).neq("id", productId)
      .limit(60);

    if (!current || !pool || pool.length === 0) {
      return new Response(JSON.stringify({ ids: [] }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const list = pool.map((p: any) => `${p.id}|${p.name}|${p.product_type}|${p.category?.name ?? ""}`).join("\n");
    const ctx = `${current.name}|${current.product_type}|${(current as any).category?.name ?? ""}|${current.description?.slice(0, 100) ?? ""}`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          { role: "system", content: `Recommend 4 products similar/complementary to the given one. Return ONLY a JSON array of 4 product IDs.\n\nPool (id|name|type|category):\n${list}` },
          { role: "user", content: `Current product: ${ctx}` },
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
    return new Response(JSON.stringify({ ids: ids.slice(0, 4) }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message, ids: [] }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});