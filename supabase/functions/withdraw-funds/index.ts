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

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { amount, paymentMethod, destinationDetails, fee = 0 } = await req.json();

    console.log('Withdrawal request:', { userId: user.id, amount, paymentMethod, destinationDetails, fee });

    // Validate input
    if (!amount || amount <= 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid amount' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!destinationDetails) {
      return new Response(
        JSON.stringify({ error: 'Destination details required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate specific fields based on payment method
    if (paymentMethod === 'bank') {
      if (!destinationDetails.account_number || !destinationDetails.bank_name || !destinationDetails.account_name) {
        return new Response(
          JSON.stringify({ error: 'Bank account details incomplete' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } else {
      if (!destinationDetails.phone_number) {
        return new Response(
          JSON.stringify({ error: 'Phone number required for mobile money withdrawal' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Get user's central wallet
    const { data: wallet, error: walletError } = await supabaseClient
      .from('user_central_wallets')
      .select('balance')
      .eq('user_id', user.id)
      .single();

    if (walletError || !wallet) {
      console.error('Wallet error:', walletError);
      return new Response(
        JSON.stringify({ error: 'Wallet not found', success: false }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (wallet.balance < amount) {
      return new Response(
        JSON.stringify({ error: 'Insufficient balance', success: false }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Call Paystack Transfer API for withdrawal
    const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY');
    if (!paystackSecretKey) {
      return new Response(
        JSON.stringify({ error: 'Payment service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate net amount after fee
    const netAmount = amount - fee;
    
    // Create/get transfer recipient first
    let recipientCode;
    
    if (paymentMethod === 'mpesa' || paymentMethod === 'airtel') {
      // First, fetch the list of mobile money providers to get the correct bank code
      const banksResponse = await fetch('https://api.paystack.co/bank?currency=KES&type=mobile_money', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${paystackSecretKey}`,
        },
      });

      const banksData = await banksResponse.json();
      
      if (!banksResponse.ok || !banksData.status) {
        console.error('Failed to fetch banks:', banksData);
        return new Response(
          JSON.stringify({ 
            error: 'Failed to fetch mobile money providers',
            success: false 
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Find the correct provider based on payment method (robust matching)
      const provider = banksData.data.find((bank: any) => {
        const name = (bank.name || '').toLowerCase();
        const slug = (bank.slug || '').toLowerCase();
        const code = (bank.code || '').toUpperCase();
        if (paymentMethod === 'mpesa') {
          return code === 'MPESA' || name.includes('m-pesa') || name.includes('mpesa') || slug.includes('m-pesa') || slug.includes('mpesa');
        }
        if (paymentMethod === 'airtel') {
          return code === 'ATL_KE' || name.includes('airtel') || slug.includes('airtel');
        }
        return false;
      });

      if (!provider) {
        console.error('Provider not found:', { paymentMethod, providers: banksData.data });
        return new Response(
          JSON.stringify({ 
            error: `${paymentMethod.toUpperCase()} provider not available`,
            success: false 
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Using provider:', provider);

      // Normalize phone to international format without + (e.g., 2547XXXXXXXX)
      let formattedPhone = String(destinationDetails.phone_number || '').replace(/\s+/g, '');
      formattedPhone = formattedPhone.replace(/^\+/, '');
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '254' + formattedPhone.slice(1);
      } else if (!formattedPhone.startsWith('254')) {
        // If it's not starting with 254, assume it's a local number and prefix
        formattedPhone = '254' + formattedPhone;
      }
      // Create mobile money recipient
      const recipientResponse = await fetch('https://api.paystack.co/transferrecipient', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${paystackSecretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'mobile_money',
          name: user.email || 'User',
          account_number: formattedPhone,
          bank_code: provider.code,
          currency: 'KES',
          metadata: {
            provider: paymentMethod,
          }
        }),
      });

      const recipientData = await recipientResponse.json();
      
      if (!recipientResponse.ok || !recipientData.status) {
        console.error('Recipient creation failed:', recipientData);
        return new Response(
          JSON.stringify({ 
            error: recipientData.message || 'Failed to create recipient',
            success: false 
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      recipientCode = recipientData.data.recipient_code;
    } else {
      // Create bank recipient
      const recipientResponse = await fetch('https://api.paystack.co/transferrecipient', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${paystackSecretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'nuban',
          name: destinationDetails.account_name,
          account_number: destinationDetails.account_number,
          bank_code: destinationDetails.bank_name,
          currency: 'KES',
        }),
      });

      const recipientData = await recipientResponse.json();
      
      if (!recipientResponse.ok || !recipientData.status) {
        console.error('Recipient creation failed:', recipientData);
        return new Response(
          JSON.stringify({ 
            error: recipientData.message || 'Failed to create bank recipient',
            success: false 
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      recipientCode = recipientData.data.recipient_code;
    }

    // Initialize transfer
    const transferResponse = await fetch('https://api.paystack.co/transfer', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: 'balance',
        amount: Math.round(netAmount * 100), // Convert to kobo/cents (net amount after fee)
        recipient: recipientCode,
        reason: `Wallet withdrawal via ${paymentMethod}`,
        reference: `WD${Date.now()}${user.id.substring(0, 8)}`,
      }),
    });

    const transferData = await transferResponse.json();

    if (!transferResponse.ok || !transferData.status) {
      console.error('Transfer failed:', transferData);
      return new Response(
        JSON.stringify({ 
          error: transferData.message || 'Transfer failed',
          success: false 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Deduct from wallet
    const { error: updateError } = await supabaseClient
      .from('user_central_wallets')
      .update({ 
        balance: wallet.balance - amount,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Wallet update error:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update wallet', success: false }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Record transaction
    const destination = paymentMethod === 'bank' 
      ? `${destinationDetails.bank_name} - ${destinationDetails.account_number}`
      : destinationDetails.phone_number;

    await supabaseClient
      .from('wallet_transactions')
      .insert({
        user_id: user.id,
        type: 'withdrawal',
        amount: -amount,
        description: `Withdrawal to ${destination} (Fee: KES ${fee})`,
        status: 'completed',
        reference_id: transferData.data?.reference || `WD${Date.now()}`,
        metadata: {
          payment_method: paymentMethod,
          destination_details: destinationDetails,
          fee,
          net_amount: amount - fee,
        }
      });

    console.log('Withdrawal successful:', { 
      userId: user.id, 
      amount, 
      fee,
      netAmount: amount - fee,
      newBalance: wallet.balance - amount 
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Withdrawal successful',
        amount,
        fee,
        netAmount: amount - fee,
        destination,
        paymentMethod,
        reference: transferData.data?.reference,
        newBalance: wallet.balance - amount
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Withdrawal error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
