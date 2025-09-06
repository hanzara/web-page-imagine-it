import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

interface SubAccount {
  id: string;
  parent_user_id: string;
  sub_account_name: string;
  sub_account_type: string;
  sub_user_id?: string;
  sub_user_email?: string;
  permissions: {
    view: boolean;
    send: boolean;
    receive: boolean;
    convert: boolean;
  };
  spending_limits: {
    daily?: number;
    weekly?: number;
    monthly?: number;
  };
  allowed_currencies: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface SubAccountBalance {
  id: string;
  sub_account_id: string;
  currency_code: string;
  balance: number;
  locked_balance: number;
  is_active: boolean;
}

interface SubAccountTransaction {
  id: string;
  sub_account_id: string;
  parent_user_id: string;
  transaction_type: string;
  amount: number;
  currency_code: string;
  description?: string;
  status: string;
  metadata: Record<string, any>;
  created_at: string;
}

export const useSubAccounts = () => {
  const [subAccounts, setSubAccounts] = useState<SubAccount[]>([]);
  const [subAccountBalances, setSubAccountBalances] = useState<SubAccountBalance[]>([]);
  const [subAccountTransactions, setSubAccountTransactions] = useState<SubAccountTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Initialize demo data
  const initializeDemoData = async () => {
    if (!user) return;

    try {
      const demoSubAccounts: SubAccount[] = [
        {
          id: 'sub-1',
          parent_user_id: user.id,
          sub_account_name: 'Marketing Team',
          sub_account_type: 'team',
          sub_user_email: 'marketing@company.com',
          permissions: { view: true, send: true, receive: true, convert: false },
          spending_limits: { daily: 1000, weekly: 5000, monthly: 20000 },
          allowed_currencies: ['USD', 'EUR'],
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'sub-2',
          parent_user_id: user.id,
          sub_account_name: 'Development Team',
          sub_account_type: 'team',
          sub_user_email: 'dev@company.com',
          permissions: { view: true, send: false, receive: true, convert: false },
          spending_limits: { daily: 500, weekly: 2000, monthly: 8000 },
          allowed_currencies: ['USD'],
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      setSubAccounts(demoSubAccounts);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Initialize demo balances and transactions
  const initializeDemoBalancesAndTransactions = async () => {
    if (!user || subAccounts.length === 0) return;

    const demoBalances: SubAccountBalance[] = [
      {
        id: 'bal-1',
        sub_account_id: 'sub-1',
        currency_code: 'USD',
        balance: 15000,
        locked_balance: 0,
        is_active: true,
      },
      {
        id: 'bal-2',
        sub_account_id: 'sub-1',
        currency_code: 'EUR',
        balance: 8500,
        locked_balance: 0,
        is_active: true,
      },
      {
        id: 'bal-3',
        sub_account_id: 'sub-2',
        currency_code: 'USD',
        balance: 5000,
        locked_balance: 0,
        is_active: true,
      },
    ];

    const demoTransactions: SubAccountTransaction[] = [
      {
        id: 'sub-tx-1',
        sub_account_id: 'sub-1',
        parent_user_id: user.id,
        transaction_type: 'transfer',
        amount: 5000,
        currency_code: 'USD',
        description: 'Marketing budget allocation',
        status: 'completed',
        metadata: {},
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    setSubAccountBalances(demoBalances);
    setSubAccountTransactions(demoTransactions);
  };

  // Create new sub-account (demo implementation)
  const createSubAccount = async (
    name: string,
    type: string,
    email?: string,
    permissions?: any,
    currencies?: string[]
  ) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const newSubAccount: SubAccount = {
        id: `sub-${Date.now()}`,
        parent_user_id: user.id,
        sub_account_name: name,
        sub_account_type: type,
        sub_user_email: email,
        permissions: permissions || { view: true, send: false, receive: true, convert: false },
        spending_limits: { daily: 1000, weekly: 5000, monthly: 20000 },
        allowed_currencies: currencies || ['USD'],
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setSubAccounts(prev => [newSubAccount, ...prev]);

      toast({
        title: "Sub-Account Created",
        description: `Successfully created "${name}" sub-account`,
      });

      return { success: true };
    } catch (err: any) {
      toast({
        title: "Creation Failed",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  // Transfer funds to sub-account (demo implementation)
  const transferToSubAccount = async (
    subAccountId: string,
    currency: string,
    amount: number,
    description?: string
  ) => {
    if (!user) throw new Error('User not authenticated');

    try {
      // Update balances for demo
      setSubAccountBalances(prev => 
        prev.map(balance => 
          balance.sub_account_id === subAccountId && balance.currency_code === currency
            ? { ...balance, balance: balance.balance + amount }
            : balance
        )
      );

      const newTransaction: SubAccountTransaction = {
        id: `sub-tx-${Date.now()}`,
        sub_account_id: subAccountId,
        parent_user_id: user.id,
        transaction_type: 'transfer',
        amount,
        currency_code: currency,
        description: description || `Transfer to sub-account`,
        status: 'completed',
        metadata: {},
        created_at: new Date().toISOString(),
      };

      setSubAccountTransactions(prev => [newTransaction, ...prev]);

      toast({
        title: "Transfer Successful",
        description: `Transferred ${amount} ${currency} to sub-account`,
      });

      return { success: true };
    } catch (err: any) {
      toast({
        title: "Transfer Failed",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  // Update sub-account permissions (demo implementation)
  const updateSubAccountPermissions = async (
    subAccountId: string,
    permissions: any
  ) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setSubAccounts(prev => 
        prev.map(account => 
          account.id === subAccountId
            ? { ...account, permissions, updated_at: new Date().toISOString() }
            : account
        )
      );

      toast({
        title: "Permissions Updated",
        description: "Sub-account permissions updated successfully",
      });

      return { success: true };
    } catch (err: any) {
      toast({
        title: "Update Failed",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  // Deactivate sub-account (demo implementation)
  const deactivateSubAccount = async (subAccountId: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setSubAccounts(prev => 
        prev.map(account => 
          account.id === subAccountId
            ? { ...account, is_active: false, updated_at: new Date().toISOString() }
            : account
        ).filter(account => account.is_active)
      );

      toast({
        title: "Sub-Account Deactivated",
        description: "Sub-account has been deactivated",
      });

      return { success: true };
    } catch (err: any) {
      toast({
        title: "Deactivation Failed",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  // Get balance for specific sub-account and currency
  const getSubAccountBalance = (subAccountId: string, currency: string): number => {
    const balance = subAccountBalances.find(
      b => b.sub_account_id === subAccountId && b.currency_code === currency
    );
    return balance?.balance || 0;
  };

  // Get total value of all sub-accounts in USD
  const getTotalSubAccountsValueUSD = (): number => {
    // Simple rate mapping for demo
    const rates: { [key: string]: number } = { 
      USD: 1, 
      EUR: 1.1, 
      GBP: 1.25, 
      BTC: 45000, 
      ETH: 2500 
    };
    
    return subAccountBalances.reduce((total, balance) => {
      const rate = rates[balance.currency_code] || 1;
      return total + (balance.balance * rate);
    }, 0);
  };

  // Initial data fetch
  useEffect(() => {
    if (user && subAccounts.length === 0) {
      initializeDemoData();
    }
  }, [user]);

  // Initialize balances and transactions when sub-accounts are loaded
  useEffect(() => {
    if (subAccounts.length > 0 && subAccountBalances.length === 0) {
      initializeDemoBalancesAndTransactions();
    }
  }, [subAccounts]);

  return {
    subAccounts,
    subAccountBalances,
    subAccountTransactions,
    loading,
    error,
    createSubAccount,
    transferToSubAccount,
    updateSubAccountPermissions,
    deactivateSubAccount,
    getSubAccountBalance,
    getTotalSubAccountsValueUSD,
    refreshData: () => Promise.all([initializeDemoData(), initializeDemoBalancesAndTransactions()]),
  };
};