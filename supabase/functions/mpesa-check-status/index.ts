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
    const { checkout_request_id, order_id } = await req.json();

    if (!checkout_request_id) {
      return new Response(JSON.stringify({ success: false, message: "Missing checkout_request_id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("PAYFLOW_API_KEY");
    const apiSecret = Deno.env.get("PAYFLOW_API_SECRET");

    const statusRes = await fetch("https://payflow.top/api/v2/status.php", {
      method: "POST",
      headers: {
        "X-API-Key": apiKey!,
        "X-API-Secret": apiSecret!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ checkout_request_id }),
    });

    const statusData = await statusRes.json();

    // Update order payment status if completed or failed
    if (statusData.success && order_id) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

      let paymentStatus = "pending";
      let orderStatus = "pending";

      if (statusData.status === "completed") {
        paymentStatus = "completed";
        orderStatus = "paid";
      } else if (statusData.status === "failed") {
        paymentStatus = "failed";
      }

      if (paymentStatus !== "pending") {
        await fetch(`${supabaseUrl}/rest/v1/orders?id=eq.${order_id}`, {
          method: "PATCH",
          headers: {
            "apikey": serviceKey,
            "Authorization": `Bearer ${serviceKey}`,
            "Content-Type": "application/json",
            "Prefer": "return=minimal",
          },
          body: JSON.stringify({
            payment_status: paymentStatus,
            status: orderStatus,
          }),
        });
      }
    }

    return new Response(JSON.stringify(statusData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
