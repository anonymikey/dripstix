import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phone, amount, reference, order_id } = await req.json();

    if (!phone || !amount || !order_id) {
      return new Response(JSON.stringify({ success: false, message: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("PAYFLOW_API_KEY");
    const apiSecret = Deno.env.get("PAYFLOW_API_SECRET");
    const accountId = Deno.env.get("PAYFLOW_ACCOUNT_ID");

    if (!apiKey || !apiSecret || !accountId) {
      return new Response(JSON.stringify({ success: false, message: "Payment configuration missing" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Format phone: ensure 2547... format
    let formattedPhone = phone.replace(/\s+/g, "").replace(/^0/, "254").replace(/^\+/, "");
    if (!formattedPhone.startsWith("254")) {
      formattedPhone = "254" + formattedPhone;
    }

    // Initiate STK Push
    const stkRes = await fetch("https://payflow.top/api/v2/stkpush.php", {
      method: "POST",
      headers: {
        "X-API-Key": apiKey,
        "X-API-Secret": apiSecret,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        payment_account_id: parseInt(accountId),
        phone: formattedPhone,
        amount: parseFloat(amount),
        reference: reference || `ORDER_${order_id.slice(0, 8)}`,
        description: `DripStix Order ${reference || order_id.slice(0, 8)}`,
      }),
    });

    const stkData = await stkRes.json();

    if (stkData.success) {
      // Save checkout_request_id to order
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

      await fetch(`${supabaseUrl}/rest/v1/orders?id=eq.${order_id}`, {
        method: "PATCH",
        headers: {
          "apikey": serviceKey,
          "Authorization": `Bearer ${serviceKey}`,
          "Content-Type": "application/json",
          "Prefer": "return=minimal",
        },
        body: JSON.stringify({
          checkout_request_id: stkData.checkout_request_id,
          payment_status: "stk_sent",
        }),
      });
    }

    return new Response(JSON.stringify(stkData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
