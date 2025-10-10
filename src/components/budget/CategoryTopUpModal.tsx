import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus } from 'lucide-react';
import CurrencyDisplay from '@/components/CurrencyDisplay';
import { useTransactionNotification } from '@/hooks/useTransactionNotification';
import { useFeeCalculation } from '@/hooks/useFeeCalculation';
import type { Database } from '@/integrations/supabase/types';

type BudgetCategory = Database['public']['Tables']['budget_categories']['Row'];

interface CategoryTopUpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: BudgetCategory | null;
  onTopUp: (data: any) => Promise<any>;
  isProcessing: boolean;
}

const PAYMENT_METHODS = [
  { value: 'lipa_na_mpesa_paybill', label: 'Lipa na M-Pesa Paybill' },
  { value: 'buy_goods_till', label: 'Buy Goods Till' },
  { value: 'send_money', label: 'Send Money' },
  { value: 'pochi_la_biashara', label: 'Pochi la Biashara' },
  { value: 'withdrawal', label: 'Withdrawal (Cash)' },
];

const CategoryTopUpModal: React.FC<CategoryTopUpModalProps> = ({
  open,
  onOpenChange,
  category,
  onTopUp,
  isProcessing,
}) => {
  const { showTransactionNotification } = useTransactionNotification();
  const { calculateFeeLocally } = useFeeCalculation();
  const [formData, setFormData] = useState({
    amount: '',
    payment_method: '',
    paybill_number: '',
    account_number: '',
    till_number: '',
    phone_number: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amount = parseFloat(formData.amount);
    
    if (!category || amount <= 0) return;

    await onTopUp({
      category: category.category,
      amount,
      payment_method: formData.payment_method,
      paybill_number: formData.paybill_number || undefined,
      account_number: formData.account_number || undefined,
      till_number: formData.till_number || undefined,
      phone_number: formData.phone_number || undefined,
      notes: formData.notes || undefined,
    });

    // Calculate fee and show notification for deposit
    const fee = calculateFeeLocally('deposit', amount);
    const newBalance = (category?.remaining_balance || 0) + amount;

    showTransactionNotification({
      type: 'deposit',
      amount,
      newBalance,
    });

    // Reset form
    setFormData({
      amount: '',
      payment_method: '',
      paybill_number: '',
      account_number: '',
      till_number: '',
      phone_number: '',
      notes: '',
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Top-Up {category?.category} Budget
          </DialogTitle>
        </DialogHeader>

        {category && (
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Current Allocated:</span>
              <CurrencyDisplay 
                amount={category.allocated_amount} 
                className="font-medium" 
                showToggle={false} 
              />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Current Remaining:</span>
              <CurrencyDisplay 
                amount={category.remaining_balance} 
                className={`font-semibold ${
                  category.remaining_balance <= 0 ? 'text-red-600' : 'text-green-600'
                }`}
                showToggle={false} 
              />
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Top-Up Amount (KES) *</Label>
            <Input
              id="amount"
              type="number"
              placeholder="5000"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              min="1"
              step="1"
              required
            />
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label>Payment Method *</Label>
            <Select
              value={formData.payment_method}
              onValueChange={(value) => setFormData({ ...formData, payment_method: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_METHODS.map((method) => (
                  <SelectItem key={method.value} value={method.value}>
                    {method.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Payment Details based on method */}
          {formData.payment_method === 'lipa_na_mpesa_paybill' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="paybill">Paybill Number *</Label>
                <Input
                  id="paybill"
                  placeholder="e.g., 400200"
                  value={formData.paybill_number}
                  onChange={(e) => setFormData({ ...formData, paybill_number: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="account">Account Number *</Label>
                <Input
                  id="account"
                  placeholder="e.g., Account123"
                  value={formData.account_number}
                  onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  placeholder="e.g., 254712345678"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                  required
                />
              </div>
            </>
          )}

          {formData.payment_method === 'buy_goods_till' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="till">Till Number *</Label>
                <Input
                  id="till"
                  placeholder="e.g., 123456"
                  value={formData.till_number}
                  onChange={(e) => setFormData({ ...formData, till_number: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  placeholder="e.g., 254712345678"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                  required
                />
              </div>
            </>
          )}

          {(formData.payment_method === 'send_money' || formData.payment_method === 'pochi_la_biashara') && (
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                placeholder="e.g., 254712345678"
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                required
              />
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="e.g., Food budget refill"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isProcessing || !formData.amount || !formData.payment_method}
              className="gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Top-Up
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryTopUpModal;