import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { chamaId, amount, paymentMethod, paymentReference, notes } = await req.json();
    console.log('Making contribution:', { chamaId, amount, paymentMethod, user: user.id });

    // Get member record
    const { data: member, error: memberError } = await supabaseClient
      .from('chama_members')
      .select('*')
      .eq('user_id', user.id)
      .eq('chama_id', chamaId)
      .eq('is_active', true)
      .single();

    if (memberError || !member) {
      throw new Error('You are not a member of this chama');
    }

    // Create contribution record
    const { data: contribution, error: contributionError } = await supabaseClient
      .from('chama_contributions_new')
      .insert({
        chama_id: chamaId,
        member_id: member.id,
        amount: amount,
        payment_method: paymentMethod || 'mobile_money',
        payment_reference: paymentReference,
        notes: notes,
        status: 'completed'
      })
      .select()
      .single();

    if (contributionError) throw contributionError;

    // Update member's savings balance and contribution stats
    const { error: memberUpdateError } = await supabaseClient
      .from('chama_members')
      .update({
        savings_balance: member.savings_balance + amount,
        total_contributed: member.total_contributed + amount,
        last_contribution_date: new Date().toISOString()
      })
      .eq('id', member.id);

    if (memberUpdateError) throw memberUpdateError;

    // Update chama's total savings
    const { data: chama } = await supabaseClient
      .from('chamas')
      .select('total_savings')
      .eq('id', chamaId)
      .single();

    if (chama) {
      await supabaseClient
        .from('chamas')
        .update({
          total_savings: (chama.total_savings || 0) + amount
        })
        .eq('id', chamaId);
    }

    // Log activity
    await supabaseClient
      .from('chama_activities')
      .insert({
        chama_id: chamaId,
        member_id: member.id,
        activity_type: 'contribution_made',
        description: `Contributed KES ${amount}`,
        amount: amount
      });

    // Get user email for notification
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('email, full_name')
      .eq('user_id', user.id)
      .single();

    // Create notifications for all other members
    const { data: allMembers } = await supabaseClient
      .from('chama_members')
      .select('user_id')
      .eq('chama_id', chamaId)
      .eq('is_active', true)
      .neq('user_id', user.id);

    if (allMembers && allMembers.length > 0) {
      const notifications = allMembers.map(m => ({
        user_id: m.user_id,
        chama_id: chamaId,
        type: 'contribution',
        title: '🎉 New Contribution!',
        message: `${profile?.full_name || profile?.email || 'A member'} contributed KES ${amount}`,
        metadata: { contribution_id: contribution.id, amount: amount }
      }));

      await supabaseClient
        .from('chama_notifications')
        .insert(notifications);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Contribution made successfully!',
        data: contribution
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error making contribution:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
