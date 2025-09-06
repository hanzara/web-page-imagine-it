import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface WalletCurrency {
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

interface EnhancedTransaction {
  id: string;
  user_id: string;
  from_currency?: string;
  to_currency?: string;
  from_amount?: number;
  to_amount?: number;
  exchange_rate?: number;
  fee_amount: number;
  fee_currency?: string;
  transaction_type: string;
  status: string;
  description?: string;
  reference_id?: string;
  external_id?: string;
  metadata: Record<string, any>;
  processed_at?: string;
  created_at: string;
  updated_at: string;
}

interface ExchangeRate {
  from_currency: string;
  to_currency: string;
  rate: number;
  updated_at: string;
  source: string;
}

export const useEnhancedWallet = () => {
  const [walletCurrencies, setWalletCurrencies] = useState<WalletCurrency[]>([]);
  const [transactions, setTransactions] = useState<EnhancedTransaction[]>([]);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch real data from Supabase
  const fetchWalletData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Fetch wallet currencies
      const { data: currenciesData, error: currenciesError } = await supabase
        .from('wallet_currencies')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (currenciesError) throw currenciesError;

      // Initialize with demo data if no currencies exist
      if (!currenciesData || currenciesData.length === 0) {
        await initializeDemoData();
        return;
      }

      setWalletCurrencies(currenciesData);
      
      // Fetch transactions
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('enhanced_wallet_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (transactionsError) throw transactionsError;
      setTransactions(transactionsData || []);
      
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Initialize demo data for new users
  const initializeDemoData = async () => {
    if (!user) return;

    try {
      // Demo wallet currencies
      const demoCurrencies = [
        {
          user_id: user.id,
          currency_code: 'USD',
          balance: 5000,
          locked_balance: 0,
          wallet_address: '0x1234...5678',
          is_active: true,
        },
        {
          user_id: user.id,
          currency_code: 'EUR',
          balance: 3500,
          locked_balance: 0,
          wallet_address: '0x2345...6789',
          is_active: true,
        },
        {
          user_id: user.id,
          currency_code: 'BTC',
          balance: 0.125,
          locked_balance: 0,
          wallet_address: 'bc1qxy2...abc123',
          is_active: true,
        },
      ];

      const { data, error } = await supabase
        .from('wallet_currencies')
        .insert(demoCurrencies)
        .select();

      if (error) throw error;

      setWalletCurrencies(data || []);
      
      // Initialize exchange rates if not set
      if (exchangeRates.length === 0) {
        setExchangeRates([
          { from_currency: 'USD', to_currency: 'EUR', rate: 0.85, updated_at: new Date().toISOString(), source: 'system' },
          { from_currency: 'USD', to_currency: 'BTC', rate: 0.000022, updated_at: new Date().toISOString(), source: 'system' },
          { from_currency: 'EUR', to_currency: 'USD', rate: 1.18, updated_at: new Date().toISOString(), source: 'system' },
        ]);
      }
      
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Get exchange rate between two currencies
  const getExchangeRate = (fromCurrency: string, toCurrency: string): number => {
    if (fromCurrency === toCurrency) return 1;

    // Try direct rate
    const directRate = exchangeRates.find(
      rate => rate.from_currency === fromCurrency && rate.to_currency === toCurrency
    );
    if (directRate) return directRate.rate;

    // Try reverse rate
    const reverseRate = exchangeRates.find(
      rate => rate.from_currency === toCurrency && rate.to_currency === fromCurrency
    );
    if (reverseRate) return 1 / reverseRate.rate;

    return 1; // Fallback
  };

  // Add funds to wallet (Supabase implementation)
  const addFunds = async (currency: string, amount: number, source: string = 'demo') => {
    if (!user) throw new Error('User not authenticated');

    try {
      const existingWallet = walletCurrencies.find(w => w.currency_code === currency);
      
      if (existingWallet) {
        // Update existing wallet
        const { error } = await supabase
          .from('wallet_currencies')
          .update({ 
            balance: existingWallet.balance + amount,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id)
          .eq('currency_code', currency);
          
        if (error) throw error;
      } else {
        // Create new wallet currency
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
      const { error: txError } = await supabase
        .from('enhanced_wallet_transactions')
        .insert({
          user_id: user.id,
          transaction_type: 'deposit',
          from_amount: amount,
          from_currency: currency,
          fee_amount: 0,
          status: 'completed',
          description: `Added ${amount} ${currency}`,
          metadata: { source }
        });
        
      if (txError) throw txError;

      toast({
        title: "Funds Added",
        description: `Added ${amount} ${currency} to your wallet`,
      });

      // Refresh data
      await fetchWalletData();
      return { success: true };
    } catch (err: any) {
      toast({
        title: "Add Funds Failed",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  // Convert currency (Supabase implementation)
  const convertCurrency = async (
    fromCurrency: string,
    toCurrency: string,
    amount: number
  ) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const rate = getExchangeRate(fromCurrency, toCurrency);
      const convertedAmount = amount * rate;
      
      const fromWallet = walletCurrencies.find(w => w.currency_code === fromCurrency);
      if (!fromWallet || fromWallet.balance < amount) {
        throw new Error(`Insufficient ${fromCurrency} balance`);
      }

      // Update from currency balance
      const { error: fromError } = await supabase
        .from('wallet_currencies')
        .update({ 
          balance: fromWallet.balance - amount,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('currency_code', fromCurrency);
        
      if (fromError) throw fromError;

      // Update or create to currency balance
      const toWallet = walletCurrencies.find(w => w.currency_code === toCurrency);
      if (toWallet) {
        const { error: toError } = await supabase
          .from('wallet_currencies')
          .update({ 
            balance: toWallet.balance + convertedAmount,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id)
          .eq('currency_code', toCurrency);
          
        if (toError) throw toError;
      } else {
        const { error: createError } = await supabase
          .from('wallet_currencies')
          .insert({
            user_id: user.id,
            currency_code: toCurrency,
            balance: convertedAmount,
            locked_balance: 0,
            is_active: true
          });
          
        if (createError) throw createError;
      }

      // Create transaction record
      const { error: txError } = await supabase
        .from('enhanced_wallet_transactions')
        .insert({
          user_id: user.id,
          transaction_type: 'conversion',
          from_currency: fromCurrency,
          to_currency: toCurrency,
          from_amount: amount,
          to_amount: convertedAmount,
          exchange_rate: rate,
          fee_amount: 0,
          status: 'completed',
          description: `Converted ${amount} ${fromCurrency} to ${convertedAmount.toFixed(4)} ${toCurrency}`
        });
        
      if (txError) throw txError;

      toast({
        title: "Currency Converted",
        description: `Converted ${amount} ${fromCurrency} to ${convertedAmount.toFixed(4)} ${toCurrency}`,
      });

      // Refresh data
      await fetchWalletData();
      return { success: true };
    } catch (err: any) {
      toast({
        title: "Conversion Failed",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  // Send payment (Supabase implementation)
  const sendPayment = async (
    recipientId: string,
    currency: string,
    amount: number,
    description?: string
  ) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const wallet = walletCurrencies.find(w => w.currency_code === currency);
      if (!wallet || wallet.balance < amount) {
        throw new Error(`Insufficient ${currency} balance`);
      }

      // Update wallet balance
      const { error: balanceError } = await supabase
        .from('wallet_currencies')
        .update({ 
          balance: wallet.balance - amount,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('currency_code', currency);
        
      if (balanceError) throw balanceError;

      // Create transaction record
      const { error: txError } = await supabase
        .from('enhanced_wallet_transactions')
        .insert({
          user_id: user.id,
          transaction_type: 'send',
          from_amount: amount,
          from_currency: currency,
          fee_amount: 0,
          status: 'completed',
          description: description || `Sent ${amount} ${currency}`,
          metadata: { recipientId }
        });
        
      if (txError) throw txError;

      toast({
        title: "Payment Sent",
        description: `Sent ${amount} ${currency}`,
      });

      // Refresh data
      await fetchWalletData();
      return { success: true };
    } catch (err: any) {
      toast({
        title: "Payment Failed",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  // Calculate total portfolio value in USD
  const getTotalValueUSD = (): number => {
    return walletCurrencies.reduce((total, currency) => {
      const rate = getExchangeRate(currency.currency_code, 'USD');
      return total + (currency.balance * rate);
    }, 0);
  };

  // Get currency balance
  const getCurrencyBalance = (currencyCode: string): number => {
    const currency = walletCurrencies.find(c => c.currency_code === currencyCode);
    return currency?.balance || 0;
  };

  // Initial data fetch
  useEffect(() => {
    if (user) {
      fetchWalletData();
    }
  }, [user]);

  return {
    walletCurrencies,
    transactions,
    exchangeRates,
    loading,
    error,
    addFunds,
    convertCurrency,
    sendPayment,
    getTotalValueUSD,
    getCurrencyBalance,
    getExchangeRate,
    initializeDemoData,
    refreshData: () => fetchWalletData(),
  };
};