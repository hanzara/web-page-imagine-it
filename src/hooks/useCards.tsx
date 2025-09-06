import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Card {
  id: string;
  user_id: string;
  card_name: string;
  card_type: 'virtual' | 'physical';
  status: string;
  balance: number;
  current_balance: number;
  spending_limit: number;
  primary_currency: string;
  currency_priority: string[];
  last_used: string;
  created_at: string;
  updated_at: string;
  international_enabled: boolean;
  is_apple_pay_enabled: boolean;
  is_google_pay_enabled: boolean;
  is_paypal_enabled: boolean;
}

interface CardTransaction {
  id: string;
  user_id: string;
  card_id: string;
  type: string;
  amount: number;
  currency: string;
  currency_used: string;
  status: string;
  description: string;
  merchant_name: string;
  created_at: string;
}

interface CardSettings {
  notifications?: any[];
  rewards?: any[];
}

export const useCards = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [transactions, setTransactions] = useState<CardTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchCards = async () => {
    if (!user) return;

    try {
      // Using demo data since card tables don't exist yet
      const demoCards: Card[] = [
        {
          id: 'card-1',
          user_id: user.id,
          card_name: 'Primary Card',
          card_type: 'virtual',
          status: 'active',
          balance: 2500,
          current_balance: 2500,
          spending_limit: 5000,
          primary_currency: 'USD',
          currency_priority: ['USD', 'EUR'],
          last_used: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          international_enabled: true,
          is_apple_pay_enabled: true,
          is_google_pay_enabled: true,
          is_paypal_enabled: false,
        }
      ];
      setCards(demoCards);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching cards:', err);
    }
  };

  const fetchTransactions = async () => {
    if (!user) return;

    try {
      // Using demo data since card transaction tables don't exist yet
      const demoTransactions: CardTransaction[] = [
        {
          id: 'tx-1',
          user_id: user.id,
          card_id: 'card-1',
          type: 'purchase',
          amount: 125.50,
          currency: 'USD',
          currency_used: 'USD',
          status: 'completed',
          description: 'Online Purchase',
          merchant_name: 'Amazon',
          created_at: new Date().toISOString(),
        }
      ];
      setTransactions(demoTransactions);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching transactions:', err);
    }
  };

  const createCard = async (cardData: Partial<Card>): Promise<Card> => {
    if (!user) throw new Error('User not authenticated');

    try {
      // Demo implementation - in production this would create actual card
      const newCard: Card = {
        id: `card-${Date.now()}`,
        user_id: user.id,
        card_name: cardData.card_name || 'New Card',
        card_type: cardData.card_type || 'virtual',
        status: 'active',
        balance: 0,
        current_balance: 0,
        spending_limit: cardData.spending_limit || 1000,
        primary_currency: cardData.primary_currency || 'USD',
        currency_priority: cardData.currency_priority || ['USD'],
        last_used: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        international_enabled: true,
        is_apple_pay_enabled: true,
        is_google_pay_enabled: true,
        is_paypal_enabled: false,
      };

      setCards(prev => [newCard, ...prev]);

      toast({
        title: "Card Created",
        description: `${cardData.card_name} has been created successfully`,
      });

      return newCard;
    } catch (err: any) {
      toast({
        title: "Card Creation Failed",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateCardSettings = async (cardId: string, settings: Partial<CardSettings>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      // Demo implementation 
      toast({
        title: "Settings Updated",
        description: "Card settings have been updated successfully",
      });
    } catch (err: any) {
      toast({
        title: "Update Failed",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateCardStatus = async (cardId: string, status: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setCards(prev => prev.map(card => 
        card.id === cardId ? { ...card, status, updated_at: new Date().toISOString() } : card
      ));

      toast({
        title: "Card Status Updated",
        description: `Card status has been changed to ${status}`,
      });
    } catch (err: any) {
      toast({
        title: "Update Failed",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteCard = async (cardId: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setCards(prev => prev.filter(card => card.id !== cardId));

      toast({
        title: "Card Deleted",
        description: "Card has been deleted successfully",
      });
    } catch (err: any) {
      toast({
        title: "Delete Failed",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const loadFunds = async (cardId: string, amount: number, currency: string = 'USD') => {
    if (!user) throw new Error('User not authenticated');

    try {
      setCards(prev => prev.map(card => 
        card.id === cardId ? { 
          ...card, 
          balance: card.balance + amount,
          current_balance: card.current_balance + amount,
          updated_at: new Date().toISOString() 
        } : card
      ));

      const newTransaction: CardTransaction = {
        id: `tx-${Date.now()}`,
        user_id: user.id,
        card_id: cardId,
        type: 'load',
        amount: amount,
        currency: currency,
        currency_used: currency,
        status: 'completed',
        description: 'Load Funds',
        merchant_name: 'Universal Pay',
        created_at: new Date().toISOString(),
      };

      setTransactions(prev => [newTransaction, ...prev]);

      toast({
        title: "Funds Loaded",
        description: `${amount} ${currency} has been loaded to your card`,
      });
    } catch (err: any) {
      toast({
        title: "Load Failed",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  // Initial data fetch
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchCards(), fetchTransactions()]);
      setLoading(false);
    };

    if (user) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [user]);

  return {
    cards,
    transactions,
    loading,
    error,
    createCard,
    updateCardSettings,
    updateCardStatus,
    deleteCard,
    loadFunds,
    refreshData: () => Promise.all([fetchCards(), fetchTransactions()]),
    topUpCard: loadFunds,
  };
};