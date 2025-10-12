import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log('=== Paystack Callback Received ===');
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const callbackData = await req.json();
    console.log('Callback data:', JSON.stringify(callbackData, null, 2));

    const { event, data } = callbackData;
    
    if (event === 'charge.success') {
      const reference = data.reference;
      const amountPaid = data.amount / 100; // Paystack amount is in kobo/cents
      
      // Get transaction details
      const { data: transaction, error: txError } = await supabase
        .from('mpesa_transactions')
        .select('user_id, purpose, metadata')
        .eq('checkout_request_id', reference)
        .single();

      if (txError) {
        console.error('Error fetching transaction:', txError);
      }

      // Update transaction status
      const { error: updateError } = await supabase
        .from('mpesa_transactions')
        .update({
          status: 'success',
          result_code: 0,
          result_desc: data.gateway_response,
          mpesa_receipt_number: reference,
          transaction_date: data.paid_at,
          callback_data: callbackData,
          updated_at: new Date().toISOString()
        })
        .eq('checkout_request_id', reference);

      if (updateError) {
        console.error('Error updating transaction:', updateError);
      }

      // Calculate and collect platform fee (2.5% transaction fee)
      if (transaction) {
        const platformFee = amountPaid * 0.025;
        const netAmount = amountPaid - platformFee;

        console.log('Processing payment:', { amountPaid, platformFee, netAmount });

        // Collect platform fee separately
        const { error: feeError } = await supabase.rpc('collect_platform_fee', {
          p_user_id: transaction.user_id,
          p_fee_type: 'transaction',
          p_amount: platformFee,
          p_source_transaction_id: transaction.metadata?.transaction_id,
          p_payment_reference: reference
        });

        if (feeError) {
          console.error('Error collecting platform fee:', feeError);
        } else {
          console.log('Platform fee collected:', platformFee);
        }
      }
    } else if (event === 'charge.failed') {
      const reference = data.reference;
      
      await supabase
        .from('mpesa_transactions')
        .update({
          status: 'failed',
          result_code: 1,
          result_desc: data.gateway_response,
          callback_data: callbackData,
          updated_at: new Date().toISOString()
        })
        .eq('checkout_request_id', reference);
    }

    return new Response('OK', { status: 200, headers: corsHeaders });

  } catch (error) {
    console.error('Callback error:', error);
    return new Response('OK', { status: 200, headers: corsHeaders });
  }
});
