import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, sessionId } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Live product catalog
    const { data: products } = await supabase
      .from("products")
      .select("name, description, base_price, sale_price, is_on_offer, is_in_stock, product_type, category:categories(name)")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(80);

    // Top recent customer questions (learning loop)
    const { data: trending } = await supabase
      .from("ai_chat_logs")
      .select("message")
      .order("created_at", { ascending: false })
      .limit(30);

    const lastUser = messages[messages.length - 1];
    if (lastUser?.role === "user" && typeof lastUser.content === "string") {
      // fire-and-forget log
      supabase.from("ai_chat_logs").insert({
        message: lastUser.content.slice(0, 500),
        session_id: sessionId ?? null,
      }).then(() => {});
    }

    const catalog = (products ?? []).map((p: any) => {
      const price = p.is_on_offer && p.sale_price ? `Ksh ${p.sale_price} (was ${p.base_price})` : `Ksh ${p.base_price}`;
      const stock = p.is_in_stock ? "in stock" : "OUT OF STOCK";
      return `- ${p.name} | ${p.product_type} | ${p.category?.name ?? "Uncategorized"} | ${price} | ${stock}`;
    }).join("\n");

    const trendingTxt = (trending ?? []).map((t: any) => `- ${t.message}`).slice(0, 15).join("\n");

    const system = `You are DripStix's friendly AI shopping assistant. DripStix sells premium phone & laptop stickers in Kenya, paid via M-PESA.

RULES:
- Be concise, warm, Gen-Z friendly. Use emojis sparingly.
- ONLY recommend products from the live catalog below. Never invent products or prices.
- Prices are in Kenyan Shillings (Ksh).
- If asked about delivery/payment: orders pay via M-PESA STK push, delivery countrywide.
- If a product is OUT OF STOCK, say so and suggest similar in-stock items.
- Affiliates earn 20% commission per sale. Customers using affiliate codes get 20% off.
- For navigation: shop is at /shop, affiliate signup at /affiliate, contact at /contact.

LIVE CATALOG (${products?.length ?? 0} products):
${catalog || "(no products available)"}

RECENT CUSTOMER QUESTIONS (use to anticipate intent):
${trendingTxt || "(none yet)"}`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: system }, ...messages],
        stream: true,
      }),
    });

    if (!resp.ok) {
      const txt = await resp.text();
      if (resp.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit reached, try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (resp.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error ${resp.status}: ${txt}`);
    }

    return new Response(resp.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
      },
    });
  } catch (e) {
    console.error("ai-assistant error", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});