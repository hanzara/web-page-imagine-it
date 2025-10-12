import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Send, User, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import CurrencyDisplay from '@/components/CurrencyDisplay';
import { useTransactionNotification } from '@/hooks/useTransactionNotification';
import { useFeeCalculation } from '@/hooks/useFeeCalculation';

interface SendMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  walletBalance?: number;
}

export const SendMoneyModal: React.FC<SendMoneyModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  walletBalance = 0 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { showTransactionNotification } = useTransactionNotification();
  const { calculateFeeLocally } = useFeeCalculation();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recipientName, setRecipientName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recipient || !amount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const numericAmount = parseFloat(amount);
    if (numericAmount <= 0) {
      toast({
        title: "Error",
        description: "Amount must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    if (numericAmount > walletBalance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough funds in your wallet",
        variant: "destructive",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipient)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const recipientDisplayName = recipient.split('@')[0];

      const { data, error } = await supabase.functions.invoke('send-money', {
        body: {
          senderId: user?.id,
          recipientEmail: recipient,
          amount: numericAmount,
          description: description.trim() || undefined,
        }
      });

      if (error) throw error;

      // Calculate fee based on amount
      const fee = calculateFeeLocally('send_money', numericAmount);
      const newBalance = walletBalance - numericAmount - fee;

      // Show sender notification
      showTransactionNotification({
        type: 'p2p_send',
        amount: numericAmount,
        recipientName: recipientDisplayName,
        recipientPhone: recipient,
        newBalance: newBalance,
      });

      setRecipient('');
      setAmount('');
      setDescription('');
      setRecipientName('');
      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error('Send money error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send money. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const numericAmount = parseFloat(amount) || 0;
  const remainingBalance = walletBalance - numericAmount;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Send Money
          </DialogTitle>
          <DialogDescription>
            Send money to another user instantly
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Balance */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Wallet Balance</span>
                <CurrencyDisplay amount={walletBalance} className="font-semibold" />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient Email</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="recipient"
                type="email"
                placeholder="Enter recipient's email"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (KES)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              max={walletBalance}
              step="1"
              required
            />
            {numericAmount > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Remaining balance:</span>
                <span className={remainingBalance < 0 ? "text-destructive" : "text-muted-foreground"}>
                  KES {remainingBalance.toLocaleString()}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="What's this payment for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={200}
              rows={3}
            />
          </div>

          {remainingBalance < 0 && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-lg">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <span className="text-sm text-destructive">
                Insufficient balance for this transaction
              </span>
            </div>
          )}

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || remainingBalance < 0 || numericAmount <= 0} 
              className="flex-1"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send KES {numericAmount.toLocaleString()}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};