import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, CreditCard, Smartphone, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useTransactionNotification } from '@/hooks/useTransactionNotification';
import { useFeeCalculation } from '@/hooks/useFeeCalculation';

interface AddMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const paymentMethods = [
  { id: 'mpesa', name: 'M-Pesa', icon: Smartphone, description: 'Mobile money transfer' },
  { id: 'card', name: 'Debit/Credit Card', icon: CreditCard, description: 'Bank card payment' },
  { id: 'bank', name: 'Bank Transfer', icon: Building, description: 'Direct bank transfer' },
];

export const AddMoneyModal: React.FC<AddMoneyModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { showTransactionNotification } = useTransactionNotification();
  const { calculateFeeLocally } = useFeeCalculation();
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !paymentMethod) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (paymentMethod === 'mpesa' && !phoneNumber) {
      toast({
        title: "Error",
        description: "Phone number is required for M-Pesa",
        variant: "destructive",
      });
      return;
    }

    const numericAmount = parseFloat(amount);
    if (numericAmount <= 0 || numericAmount > 100000) {
      toast({
        title: "Error",
        description: "Amount must be between KES 1 and KES 100,000",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('add-money', {
        body: {
          userId: user?.id,
          amount: numericAmount,
          paymentMethod,
          phoneNumber: paymentMethod === 'mpesa' ? phoneNumber : undefined,
        }
      });

      if (error) throw error;

      // Get updated wallet balance
      const { data: walletData } = await supabase
        .from('user_wallets')
        .select('balance')
        .eq('user_id', user?.id)
        .single();

      const newBalance = walletData?.balance || numericAmount;
      const fee = calculateFeeLocally('deposit', numericAmount);

      showTransactionNotification({
        type: 'deposit',
        amount: numericAmount,
        newBalance,
      });

      setAmount('');
      setPaymentMethod('');
      setPhoneNumber('');
      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error('Add money error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add money. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedMethod = paymentMethods.find(method => method.id === paymentMethod);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Money to Wallet</DialogTitle>
          <DialogDescription>
            Add funds to your wallet to start making transactions
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (KES)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              max="100000"
              step="1"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Payment Method</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod} required>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <SelectItem key={method.id} value={method.id}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <div>
                          <p className="font-medium">{method.name}</p>
                          <p className="text-xs text-muted-foreground">{method.description}</p>
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {paymentMethod === 'mpesa' && (
            <div className="space-y-2">
              <Label htmlFor="phone">M-Pesa Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="e.g., 254712345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
          )}

          {selectedMethod && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <selectedMethod.icon className="h-8 w-8 text-primary" />
                  <div>
                    <h4 className="font-medium">{selectedMethod.name}</h4>
                    <p className="text-sm text-muted-foreground">{selectedMethod.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Money
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};