import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { reference } = await req.json();

    if (!reference) {
      throw new Error("Payment reference is required");
    }

    // Verify payment with Paystack
    const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('PAYSTACK_SECRET_KEY')}`,
        'Content-Type': 'application/json',
      },
    });

    const paystackData = await paystackResponse.json();

    if (!paystackData.status) {
      throw new Error(paystackData.message || 'Payment verification failed');
    }

    const transaction = paystackData.data;
    const paymentStatus = transaction.status === 'success' ? 'success' : 'failed';

    // Update order in database
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { data: orderData, error: orderError } = await supabaseService
      .from('orders')
      .update({
        payment_status: paymentStatus === 'success' ? 'paid' : 'failed',
        status: paymentStatus === 'success' ? 'confirmed' : 'cancelled',
      })
      .eq('paystack_reference', reference)
      .select()
      .single();

    if (orderError) {
      console.error('Order update error:', orderError);
    }

    console.log(`Payment verification: ${paymentStatus} for reference: ${reference}`);

    return new Response(
      JSON.stringify({
        status: paymentStatus,
        transaction: transaction,
        order: orderData,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Payment verification error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});