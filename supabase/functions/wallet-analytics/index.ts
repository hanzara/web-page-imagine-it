import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    if (req.method === 'GET') {
      const url = new URL(req.url);
      const timeframe = url.searchParams.get('timeframe') || '7d';
      
      // Calculate date range based on timeframe
      const now = new Date();
      let startDate = new Date();
      
      switch (timeframe) {
        case '24h':
          startDate.setDate(now.getDate() - 1);
          break;
        case '7d':
          startDate.setDate(now.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(now.getDate() - 30);
          break;
        default:
          startDate.setDate(now.getDate() - 7);
      }

      // Fetch wallet analytics data
      const [walletResponse, transactionResponse] = await Promise.all([
        supabaseClient
          .from('wallet_currencies')
          .select('currency_code, balance, locked_balance')
          .eq('user_id', user.id)
          .eq('is_active', true),
        supabaseClient
          .from('wallet_transactions')
          .select('type, amount, currency, created_at, status')
          .eq('user_id', user.id)
          .gte('created_at', startDate.toISOString())
          .order('created_at', { ascending: false })
      ]);

      if (walletResponse.error) throw walletResponse.error;
      if (transactionResponse.error) throw transactionResponse.error;

      const wallets = walletResponse.data || [];
      const transactions = transactionResponse.data || [];

      // Calculate analytics metrics
      const totalTransactions = transactions.length;
      const inboundTransactions = transactions.filter(tx => tx.type === 'inbound');
      const outboundTransactions = transactions.filter(tx => tx.type === 'outbound');
      const completedTransactions = transactions.filter(tx => tx.status === 'completed');
      
      const successRate = totalTransactions > 0 ? (completedTransactions.length / totalTransactions) * 100 : 0;
      const totalInbound = inboundTransactions.reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
      const totalOutbound = outboundTransactions.reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

      // Calculate portfolio distribution
      const portfolioDistribution = wallets.map(wallet => ({
        currency: wallet.currency_code,
        balance: wallet.balance,
        locked: wallet.locked_balance,
        percentage: 0 // Will be calculated below
      }));

      const totalBalance = portfolioDistribution.reduce((sum, item) => sum + item.balance, 0);
      portfolioDistribution.forEach(item => {
        item.percentage = totalBalance > 0 ? (item.balance / totalBalance) * 100 : 0;
      });

      // Transaction volume by day
      const dailyVolume = transactions.reduce((acc, tx) => {
        const date = tx.created_at.split('T')[0];
        if (!acc[date]) {
          acc[date] = { date, inbound: 0, outbound: 0, count: 0 };
        }
        
        acc[date].count += 1;
        if (tx.type === 'inbound') {
          acc[date].inbound += parseFloat(tx.amount);
        } else {
          acc[date].outbound += parseFloat(tx.amount);
        }
        
        return acc;
      }, {} as Record<string, any>);

      const analytics = {
        summary: {
          totalTransactions,
          successRate: Math.round(successRate * 100) / 100,
          totalInbound: Math.round(totalInbound * 100) / 100,
          totalOutbound: Math.round(totalOutbound * 100) / 100,
          netFlow: Math.round((totalInbound - totalOutbound) * 100) / 100,
          activeWallets: wallets.length
        },
        portfolioDistribution,
        dailyVolume: Object.values(dailyVolume),
        timeframe,
        generatedAt: new Date().toISOString()
      };

      return new Response(JSON.stringify(analytics), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 405,
    });

  } catch (error) {
    console.error('Wallet analytics function error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});