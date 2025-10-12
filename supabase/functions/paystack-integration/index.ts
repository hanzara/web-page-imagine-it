import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface InitializePaymentRequest {
  email: string;
  amount: number;
  metadata?: Record<string, any>;
  channels?: string[];
}

serve(async (req) => {
  console.log('=== Paystack Integration Function Called ===');
  console.log('Request method:', req.method);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY');

    if (!paystackSecretKey) {
      console.error('PAYSTACK_SECRET_KEY not configured');
      return new Response(JSON.stringify({
        success: false,
        error: 'Payment service not configured'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const requestBody = await req.json();
    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    const { action, email, amount, metadata, channels, reference } = requestBody;

    if (action === 'initialize') {
      // Initialize Paystack transaction
      const callbackUrl = `${supabaseUrl}/functions/v1/paystack-callback`;
      
      const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${paystackSecretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          amount: Math.round(amount * 100), // Convert to kobo/cents
          callback_url: callbackUrl,
          metadata: metadata || {},
          channels: channels || ['card', 'bank', 'ussd', 'mobile_money', 'bank_transfer'],
        }),
      });

      const paystackData = await paystackResponse.json();
      console.log('Paystack response:', JSON.stringify(paystackData, null, 2));

      if (!paystackResponse.ok || !paystackData.status) {
        return new Response(JSON.stringify({
          success: false,
          error: paystackData.message || 'Failed to initialize payment'
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Store transaction in database
      const { data: transaction, error: dbError } = await supabase
        .from('mpesa_transactions')
        .insert({
          user_id: metadata?.user_id,
          phone_number: email, // Store email in phone_number field for now
          amount: amount,
          transaction_type: 'paystack',
          purpose: metadata?.purpose || 'other',
          chama_id: metadata?.chama_id,
          status: 'pending',
          checkout_request_id: paystackData.data.reference,
          merchant_request_id: paystackData.data.access_code,
        })
        .select()
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
      }

      return new Response(JSON.stringify({
        success: true,
        authorization_url: paystackData.data.authorization_url,
        access_code: paystackData.data.access_code,
        reference: paystackData.data.reference,
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'verify') {
      // Verify Paystack transaction
      const verifyResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${paystackSecretKey}`,
        },
      });

      const verifyData = await verifyResponse.json();
      console.log('Verify response:', JSON.stringify(verifyData, null, 2));

      if (!verifyResponse.ok || !verifyData.status) {
        return new Response(JSON.stringify({
          success: false,
          error: verifyData.message || 'Failed to verify payment'
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Update transaction in database
      const status = verifyData.data.status === 'success' ? 'success' : 'failed';
      await supabase
        .from('mpesa_transactions')
        .update({
          status,
          result_code: verifyData.data.status === 'success' ? 0 : 1,
          result_desc: verifyData.data.gateway_response,
          mpesa_receipt_number: verifyData.data.reference,
          transaction_date: verifyData.data.paid_at,
        })
        .eq('checkout_request_id', reference);

      return new Response(JSON.stringify({
        success: true,
        data: verifyData.data,
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      success: false,
      error: 'Invalid action'
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('=== FUNCTION ERROR ===');
    console.error('Error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
