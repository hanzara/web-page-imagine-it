import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { recipientEmail, amount, description } = await req.json();

    console.log('Wallet transfer request:', { senderId: user.id, recipientEmail, amount });

    if (!recipientEmail || !amount || amount <= 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid input parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate transaction fee (1% of amount, min KES 10, max KES 100)
    const feePercentage = 0.01;
    const transactionFee = Math.min(Math.max(amount * feePercentage, 10), 100);

    // Find recipient by email
    const { data: authUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) {
      console.error('Error listing users:', listError);
      return new Response(
        JSON.stringify({ error: 'Failed to find recipient' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const matchingUser = authUsers.users?.find(u => u.email?.toLowerCase() === recipientEmail.toLowerCase());
    
    if (!matchingUser) {
      return new Response(
        JSON.stringify({ error: 'Recipient not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (user.id === matchingUser.id) {
      return new Response(
        JSON.stringify({ error: 'Cannot send money to yourself' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Call the transfer_funds SQL function
    const { data: transferResult, error: transferError } = await supabaseAdmin.rpc('transfer_funds', {
      p_sender_id: user.id,
      p_receiver_id: matchingUser.id,
      p_amount: amount,
      p_fee: transactionFee
    });

    if (transferError) {
      console.error('Transfer error:', transferError);
      return new Response(
        JSON.stringify({ error: 'Transfer failed', details: transferError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Transfer result:', transferResult);

    if (!transferResult.success) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: transferResult.error,
          balance: transferResult.balance 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Transfer successful',
        remaining_balance: transferResult.remaining_balance,
        amount_sent: transferResult.amount_sent,
        fee: transferResult.fee,
        recipient: recipientEmail
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Wallet transfer error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
