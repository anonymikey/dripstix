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
    const { order_id } = await req.json();

    if (!order_id) {
      return new Response(JSON.stringify({ success: false, message: "Missing order_id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("PAYFLOW_API_KEY");
    const apiSecret = Deno.env.get("PAYFLOW_API_SECRET");
    const accountId = Deno.env.get("PAYFLOW_ACCOUNT_ID");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (!apiKey || !apiSecret || !accountId) {
      return new Response(JSON.stringify({ success: false, message: "Payment configuration missing" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate order exists and get server-side values
    const orderRes = await fetch(`${supabaseUrl}/rest/v1/orders?id=eq.${order_id}&select=id,phone_number,total,payment_status`, {
      headers: {
        "apikey": serviceKey,
        "Authorization": `Bearer ${serviceKey}`,
      },
    });
    const orders = await orderRes.json();

    if (!orders || orders.length === 0) {
      return new Response(JSON.stringify({ success: false, message: "Order not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const order = orders[0];

    // Prevent re-initiating payment on already paid/processing orders
    if (order.payment_status === "completed") {
      return new Response(JSON.stringify({ success: false, message: "Order already paid" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use server-side phone and amount — never trust client values
    const phone = order.phone_number;
    const amount = order.total;

    // Format phone: ensure 2547... format
    let formattedPhone = phone.replace(/\s+/g, "").replace(/^0/, "254").replace(/^\+/, "");
    if (!formattedPhone.startsWith("254")) {
      formattedPhone = "254" + formattedPhone;
    }

    const reference = `ORD_${order_id.slice(0, 8).toUpperCase()}`;

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
        amount: parseFloat(String(amount)),
        reference,
        description: `DripStix Order ${reference}`,
      }),
    });

    const stkData = await stkRes.json();

    if (stkData.success) {
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
    return new Response(JSON.stringify({ success: false, message: "An error occurred processing your request" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
