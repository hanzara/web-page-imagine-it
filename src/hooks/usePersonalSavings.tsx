// @ts-nocheck
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SavingsGoal {
  id: string;
  user_id: string;
  goal_name: string;
  target_amount: number;
  current_amount: number;
  target_date?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface SavingsTransaction {
  id: string;
  user_id: string;
  savings_goal_id?: string;
  amount: number;
  transaction_type: string;
  frequency: string;
  payment_method: string;
  notes?: string;
  created_at: string;
}

interface PersonalWallet {
  balance: number;
  totalSavings: number;
  monthlyTarget: number;
  dailyTarget: number;
  currentStreak: number;
}

export const usePersonalSavings = () => {
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [savingsTransactions, setSavingsTransactions] = useState<SavingsTransaction[]>([]);
  const [walletData, setWalletData] = useState<PersonalWallet>({
    balance: 0,
    totalSavings: 0,
    monthlyTarget: 15000,
    dailyTarget: 500,
    currentStreak: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const addSavings = async (amount: number, goalName?: string, frequency = 'one_time', notes?: string) => {
    try {
      const { data, error } = await supabase.rpc('add_personal_savings', {
        p_amount: amount,
        p_goal_name: goalName,
        p_frequency: frequency,
        p_notes: notes
      });

      if (error) throw error;

      toast({
        title: "Savings Added! 💰",
        description: `Successfully saved KES ${amount}`,
      });

      // Refresh data
      setIsLoading(true);
      const { data: goals } = await supabase
        .from('personal_savings_goals')
        .select('*')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);
      
      if (goals) setSavingsGoals(goals);
      setIsLoading(false);
      
      return data;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add savings",
        variant: "destructive",
      });
      return null;
    }
  };

  const getSavingsBreakdown = () => {
    return [];
  };

  const getSavingsData = () => {
    return [];
  };

  return {
    savingsGoals,
    savingsTransactions,
    walletData,
    isLoading,
    addSavings,
    getSavingsBreakdown,
    getSavingsData,
    refreshData: () => Promise.resolve([])
  };
};