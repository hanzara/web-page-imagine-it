import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

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

  // Initialize demo data
  const initializeDemoData = async () => {
    if (!user) return;

    try {
      // Demo wallet currencies
      const demoCurrencies: WalletCurrency[] = [
        {
          id: 'usd-wallet',
          user_id: user.id,
          currency_code: 'USD',
          balance: 5000,
          locked_balance: 0,
          wallet_address: '0x1234...5678',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'eur-wallet',
          user_id: user.id,
          currency_code: 'EUR',
          balance: 3500,
          locked_balance: 0,
          wallet_address: '0x2345...6789',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'btc-wallet',
          user_id: user.id,
          currency_code: 'BTC',
          balance: 0.125,
          locked_balance: 0,
          wallet_address: 'bc1qxy2...abc123',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      // Demo exchange rates
      const demoRates: ExchangeRate[] = [
        { from_currency: 'USD', to_currency: 'EUR', rate: 0.85, updated_at: new Date().toISOString(), source: 'demo' },
        { from_currency: 'USD', to_currency: 'BTC', rate: 0.000022, updated_at: new Date().toISOString(), source: 'demo' },
        { from_currency: 'EUR', to_currency: 'USD', rate: 1.18, updated_at: new Date().toISOString(), source: 'demo' },
      ];

      // Demo transactions
      const demoTransactions: EnhancedTransaction[] = [
        {
          id: 'tx-1',
          user_id: user.id,
          from_currency: 'USD',
          to_currency: 'EUR',
          from_amount: 1000,
          to_amount: 850,
          exchange_rate: 0.85,
          fee_amount: 5,
          fee_currency: 'USD',
          transaction_type: 'conversion',
          status: 'completed',
          description: 'Currency conversion',
          reference_id: 'demo-ref-1',
          metadata: {},
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        },
      ];

      setWalletCurrencies(demoCurrencies);
      setExchangeRates(demoRates);
      setTransactions(demoTransactions);
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

  // Add funds to wallet (demo implementation)
  const addFunds = async (currency: string, amount: number, source: string = 'demo') => {
    if (!user) throw new Error('User not authenticated');

    try {
      // Update local state for demo
      setWalletCurrencies(prev => 
        prev.map(wallet => 
          wallet.currency_code === currency 
            ? { ...wallet, balance: wallet.balance + amount }
            : wallet
        )
      );

      const newTransaction: EnhancedTransaction = {
        id: `tx-${Date.now()}`,
        user_id: user.id,
        transaction_type: 'deposit',
        from_amount: amount,
        from_currency: currency,
        fee_amount: 0,
        status: 'completed',
        description: `Added ${amount} ${currency}`,
        metadata: { source },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setTransactions(prev => [newTransaction, ...prev]);

      toast({
        title: "Funds Added",
        description: `Added ${amount} ${currency} to your wallet`,
      });

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

  // Convert currency (demo implementation)
  const convertCurrency = async (
    fromCurrency: string,
    toCurrency: string,
    amount: number
  ) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const rate = getExchangeRate(fromCurrency, toCurrency);
      const convertedAmount = amount * rate;

      // Update local state for demo
      setWalletCurrencies(prev => 
        prev.map(wallet => {
          if (wallet.currency_code === fromCurrency) {
            return { ...wallet, balance: wallet.balance - amount };
          }
          if (wallet.currency_code === toCurrency) {
            return { ...wallet, balance: wallet.balance + convertedAmount };
          }
          return wallet;
        })
      );

      const newTransaction: EnhancedTransaction = {
        id: `tx-${Date.now()}`,
        user_id: user.id,
        transaction_type: 'conversion',
        from_currency: fromCurrency,
        to_currency: toCurrency,
        from_amount: amount,
        to_amount: convertedAmount,
        exchange_rate: rate,
        fee_amount: 0,
        status: 'completed',
        description: `Converted ${amount} ${fromCurrency} to ${convertedAmount.toFixed(4)} ${toCurrency}`,
        metadata: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setTransactions(prev => [newTransaction, ...prev]);

      toast({
        title: "Currency Converted",
        description: `Converted ${amount} ${fromCurrency} to ${convertedAmount.toFixed(4)} ${toCurrency}`,
      });

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

  // Send payment (demo implementation)
  const sendPayment = async (
    recipientId: string,
    currency: string,
    amount: number,
    description?: string
  ) => {
    if (!user) throw new Error('User not authenticated');

    try {
      // Update local state for demo
      setWalletCurrencies(prev => 
        prev.map(wallet => 
          wallet.currency_code === currency 
            ? { ...wallet, balance: wallet.balance - amount }
            : wallet
        )
      );

      const newTransaction: EnhancedTransaction = {
        id: `tx-${Date.now()}`,
        user_id: user.id,
        transaction_type: 'send',
        from_amount: amount,
        from_currency: currency,
        fee_amount: 0,
        status: 'completed',
        description: description || `Sent ${amount} ${currency}`,
        metadata: { recipientId },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setTransactions(prev => [newTransaction, ...prev]);

      toast({
        title: "Payment Sent",
        description: `Sent ${amount} ${currency}`,
      });

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
    if (user && walletCurrencies.length === 0) {
      initializeDemoData();
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
    refreshData: () => initializeDemoData(),
  };
};