import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Loader2, CreditCard, Smartphone, Building, Phone } from 'lucide-react';
import { usePaystackIntegration } from '@/hooks/usePaystackIntegration';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface ContributeModalProps {
  isOpen: boolean;
  onClose: () => void;
  chamaId: string;
  chamaName: string;
  expectedAmount?: number;
}

export const ContributeModal: React.FC<ContributeModalProps> = ({
  isOpen,
  onClose,
  chamaId,
  chamaName,
  expectedAmount
}) => {
  const [formData, setFormData] = useState({
    amount: expectedAmount?.toString() || '',
    email: '',
    notes: '',
    paymentChannel: 'all' as 'card' | 'bank' | 'ussd' | 'mobile_money' | 'bank_transfer' | 'all'
  });

  const { user } = useAuth();
  const { initializePayment, isProcessingPayment } = usePaystackIntegration();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseFloat(formData.amount);
    if (!amount || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid contribution amount",
        variant: "destructive"
      });
      return;
    }

    const userEmail = formData.email.trim() || user?.email;
    if (!userEmail) {
      toast({
        title: "Email Required",
        description: "Please provide your email address",
        variant: "destructive"
      });
      return;
    }

    try {
      const channels = formData.paymentChannel === 'all' 
        ? ['card', 'bank', 'ussd', 'mobile_money', 'bank_transfer']
        : [formData.paymentChannel];

      await initializePayment.mutateAsync({
        email: userEmail,
        amount,
        metadata: {
          description: formData.notes || `Contribution to ${chamaName}`,
          chama_name: chamaName
        },
        purpose: 'contribution',
        chamaId,
      });

      onClose();
      setFormData({
        amount: expectedAmount?.toString() || '',
        email: '',
        notes: '',
        paymentChannel: 'all'
      });
    } catch (error: any) {
      console.error('Contribution failed:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Contribute to {chamaName}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Expected Amount Display */}
          {expectedAmount && (
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Expected Contribution</p>
                  <p className="text-xl font-semibold text-foreground">
                    {formatCurrency(expectedAmount)}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (KES) *</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                min="1"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                disabled={isProcessingPayment}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder={user?.email || "your@email.com"}
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={isProcessingPayment}
              />
              <p className="text-xs text-muted-foreground">
                {user?.email ? "Using your account email by default" : "Required for payment receipt"}
              </p>
            </div>

            {/* Payment Channel Selection */}
            <div className="space-y-2">
              <Label>Preferred Payment Method</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={formData.paymentChannel === 'card' ? 'default' : 'outline'}
                  className="h-auto py-3"
                  onClick={() => handleInputChange('paymentChannel', 'card')}
                  disabled={isProcessingPayment}
                >
                  <div className="flex flex-col items-center gap-1">
                    <CreditCard className="h-5 w-5" />
                    <span className="text-xs">Card</span>
                  </div>
                </Button>
                <Button
                  type="button"
                  variant={formData.paymentChannel === 'mobile_money' ? 'default' : 'outline'}
                  className="h-auto py-3"
                  onClick={() => handleInputChange('paymentChannel', 'mobile_money')}
                  disabled={isProcessingPayment}
                >
                  <div className="flex flex-col items-center gap-1">
                    <Smartphone className="h-5 w-5" />
                    <span className="text-xs">M-Pesa</span>
                  </div>
                </Button>
                <Button
                  type="button"
                  variant={formData.paymentChannel === 'bank_transfer' ? 'default' : 'outline'}
                  className="h-auto py-3"
                  onClick={() => handleInputChange('paymentChannel', 'bank_transfer')}
                  disabled={isProcessingPayment}
                >
                  <div className="flex flex-col items-center gap-1">
                    <Building className="h-5 w-5" />
                    <span className="text-xs">Bank</span>
                  </div>
                </Button>
                <Button
                  type="button"
                  variant={formData.paymentChannel === 'ussd' ? 'default' : 'outline'}
                  className="h-auto py-3"
                  onClick={() => handleInputChange('paymentChannel', 'ussd')}
                  disabled={isProcessingPayment}
                >
                  <div className="flex flex-col items-center gap-1">
                    <Phone className="h-5 w-5" />
                    <span className="text-xs">USSD</span>
                  </div>
                </Button>
              </div>
              <Button
                type="button"
                variant={formData.paymentChannel === 'all' ? 'default' : 'outline'}
                className="w-full"
                onClick={() => handleInputChange('paymentChannel', 'all')}
                disabled={isProcessingPayment}
              >
                All Payment Options
              </Button>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add a note for this contribution"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                disabled={isProcessingPayment}
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isProcessingPayment}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isProcessingPayment || !formData.amount}
            >
              {isProcessingPayment ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Continue to Payment'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};