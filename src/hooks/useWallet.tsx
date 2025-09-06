import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

interface WalletData {
  id: string;
  user_id: string;
  balance: number;
  currency: string;
  wallet_address?: string;
  created_at: string;
  updated_at: string;
}

interface WalletCurrencyData {
  id: string;
  user_id: string;
  currency_code: string;
  balance: number;
  locked_balance: number;
  wallet_address?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface TransactionData {
  id: string;
  user_id: string;
  type: string;
  amount: number;
  status: string;
  description?: string;
  currency?: string;
  created_at: string;
}

export const useWallet = () => {
  const [wallets, setWallets] = useState<WalletData[]>([]);
  const [walletCurrencies, setWalletCurrencies] = useState<WalletCurrencyData[]>([]);
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch main wallet
  const fetchWallets = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_wallets')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setWallets(data || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching wallets:', err);
    }
  };

  // Fetch wallet currencies
  const fetchWalletCurrencies = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('wallet_currencies')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (error) throw error;
      
      // If no currencies exist, create default ones
      if (!data || data.length === 0) {
        await initializeDefaultCurrencies();
      } else {
        setWalletCurrencies(data);
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching wallet currencies:', err);
    }
  };

  // Initialize default currencies for new users
  const initializeDefaultCurrencies = async () => {
    if (!user) return;

    const defaultCurrencies = [
      { currency_code: 'USD', balance: 1000 },
      { currency_code: 'EUR', balance: 850 },
      { currency_code: 'BTC', balance: 0.02 }
    ];

    try {
      const { data, error } = await supabase
        .from('wallet_currencies')
        .insert(
          defaultCurrencies.map(curr => ({
            user_id: user.id,
            currency_code: curr.currency_code,
            balance: curr.balance,
            locked_balance: 0,
            is_active: true
          }))
        )
        .select();

      if (error) throw error;
      setWalletCurrencies(data || []);
    } catch (err: any) {
      console.error('Error initializing default currencies:', err);
    }
  };

  // Fetch transactions
  const fetchTransactions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setTransactions(data || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching transactions:', err);
    }
  };

  // Send payment
  const sendPayment = async (payload: {
    recipient: string;
    amount: number;
    currency: string;
    message?: string;
    route?: string;
  }) => {
    if (!user) throw new Error('User not authenticated');

    try {
      // Check balance
      const currency = walletCurrencies.find(w => w.currency_code === payload.currency);
      if (!currency || currency.balance < payload.amount) {
        throw new Error(`Insufficient ${payload.currency} balance`);
      }

      // Create transaction record
      const { data: transaction, error: txError } = await supabase
        .from('wallet_transactions')
        .insert({
          user_id: user.id,
          type: 'outbound',
          amount: payload.amount,
          currency: payload.currency,
          status: 'completed',
          description: `Payment to ${payload.recipient}: ${payload.message || ''}`,
          reference_id: payload.route
        })
        .select()
        .single();

      if (txError) throw txError;

      // Update wallet balance
      const { error: balanceError } = await supabase
        .from('wallet_currencies')
        .update({
          balance: currency.balance - payload.amount,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('currency_code', payload.currency);

      if (balanceError) throw balanceError;

      toast({
        title: "Payment Sent",
        description: `Sent ${payload.amount} ${payload.currency} to ${payload.recipient}`,
      });

      // Refresh data
      await Promise.all([fetchWallets(), fetchWalletCurrencies(), fetchTransactions()]);
      
      return transaction;
    } catch (err: any) {
      toast({
        title: "Payment Failed",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  // Convert currency
  const convertCurrency = async (
    fromCurrency: string,
    toCurrency: string,
    amount: number
  ) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('wallet_transactions')
        .insert({
          user_id: user.id,
          type: 'conversion',
          amount: amount,
          status: 'pending',
          description: `Convert ${amount} ${fromCurrency} to ${toCurrency}`
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Currency Conversion",
        description: `Converting ${amount} ${fromCurrency} to ${toCurrency}`,
      });

      // Refresh data
      await Promise.all([fetchWallets(), fetchTransactions()]);
      
      return data;
    } catch (err: any) {
      toast({
        title: "Conversion Failed", 
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  // Calculate total portfolio value in USD
  const getTotalValue = () => {
    const rates: { [key: string]: number } = { 
      USD: 1, 
      EUR: 1.1, 
      GBP: 1.25, 
      BTC: 45000, 
      ETH: 2500 
    };
    
    return walletCurrencies.reduce((sum, wallet) => {
      return sum + (wallet.balance * (rates[wallet.currency_code] || 1));
    }, 0);
  };

  // Get currency balance
  const getCurrencyBalance = (currencyCode: string): number => {
    const currency = walletCurrencies.find(c => c.currency_code === currencyCode);
    return currency?.balance || 0;
  };

  // Add funds to wallet
  const addFunds = async (currency: string, amount: number, source: string = 'deposit') => {
    if (!user) throw new Error('User not authenticated');

    try {
      // Update or create currency balance
      const existingCurrency = walletCurrencies.find(c => c.currency_code === currency);
      
      if (existingCurrency) {
        const { error } = await supabase
          .from('wallet_currencies')
          .update({
            balance: existingCurrency.balance + amount,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id)
          .eq('currency_code', currency);
          
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('wallet_currencies')
          .insert({
            user_id: user.id,
            currency_code: currency,
            balance: amount,
            locked_balance: 0,
            is_active: true
          });
          
        if (error) throw error;
      }

      // Create transaction record
      await supabase
        .from('wallet_transactions')
        .insert({
          user_id: user.id,
          type: 'inbound',
          amount: amount,
          currency: currency,
          status: 'completed',
          description: `Added ${amount} ${currency} from ${source}`,
          reference_id: source
        });

      toast({
        title: "Funds Added",
        description: `Added ${amount} ${currency} to your wallet`,
      });

      // Refresh data
      await Promise.all([fetchWalletCurrencies(), fetchTransactions()]);
    } catch (err: any) {
      toast({
        title: "Add Funds Failed",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  // Real-time subscriptions
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('wallet-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_wallets',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchWallets();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'wallet_currencies',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchWalletCurrencies();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'wallet_transactions',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchTransactions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Initial data fetch
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchWallets(), fetchWalletCurrencies(), fetchTransactions()]);
      setLoading(false);
    };

    if (user) {
      loadData();
    }
  }, [user]);

  return {
    wallets,
    walletCurrencies,
    transactions,
    loading,
    error,
    sendPayment,
    convertCurrency,
    getTotalValue,
    getCurrencyBalance,
    addFunds,
    refreshData: () => Promise.all([fetchWallets(), fetchWalletCurrencies(), fetchTransactions()]),
  };
};