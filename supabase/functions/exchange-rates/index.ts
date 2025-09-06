import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ExchangeRateData {
  from_currency: string;
  to_currency: string;
  rate: number;
  source: string;
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

    if (req.method === 'GET') {
      // Fetch current exchange rates
      const { data, error } = await supabaseClient
        .from('exchange_rates')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        throw error;
      }

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    if (req.method === 'POST') {
      const { action } = await req.json();

      if (action === 'update_rates') {
        // Mock exchange rates - in production, this would fetch from a real API
        const mockRates: ExchangeRateData[] = [
          { from_currency: 'USD', to_currency: 'EUR', rate: 0.85 + (Math.random() - 0.5) * 0.02, source: 'api' },
          { from_currency: 'USD', to_currency: 'GBP', rate: 0.73 + (Math.random() - 0.5) * 0.02, source: 'api' },
          { from_currency: 'USD', to_currency: 'BTC', rate: 0.000022 + (Math.random() - 0.5) * 0.000002, source: 'api' },
          { from_currency: 'USD', to_currency: 'ETH', rate: 0.00041 + (Math.random() - 0.5) * 0.00004, source: 'api' },
          { from_currency: 'EUR', to_currency: 'USD', rate: 1.18 + (Math.random() - 0.5) * 0.02, source: 'api' },
          { from_currency: 'GBP', to_currency: 'USD', rate: 1.37 + (Math.random() - 0.5) * 0.02, source: 'api' },
          { from_currency: 'BTC', to_currency: 'USD', rate: 45000 + (Math.random() - 0.5) * 2000, source: 'api' },
          { from_currency: 'ETH', to_currency: 'USD', rate: 2500 + (Math.random() - 0.5) * 200, source: 'api' },
        ];

        // Upsert exchange rates
        const { error: upsertError } = await supabaseClient
          .from('exchange_rates')
          .upsert(
            mockRates.map(rate => ({
              from_currency: rate.from_currency,
              to_currency: rate.to_currency,
              rate: rate.rate,
              source: rate.source,
              updated_at: new Date().toISOString()
            })),
            { 
              onConflict: 'from_currency,to_currency',
              ignoreDuplicates: false 
            }
          );

        if (upsertError) {
          throw upsertError;
        }

        return new Response(JSON.stringify({ success: true, rates_updated: mockRates.length }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 405,
    });

  } catch (error) {
    console.error('Exchange rates function error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});