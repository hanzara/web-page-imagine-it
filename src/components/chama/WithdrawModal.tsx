import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useChamaWalletOps } from '@/hooks/useChamaWalletOps';
import CurrencyDisplay from '@/components/CurrencyDisplay';
import { Loader2 } from 'lucide-react';

interface WithdrawModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chamaId: string;
  mgrBalance: number;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({
  open,
  onOpenChange,
  chamaId,
  mgrBalance
}) => {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<string>('mpesa');
  const [phoneNumber, setPhoneNumber] = useState('');
  const { mutate: performOperation, isPending } = useChamaWalletOps();

  const handleWithdraw = () => {
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) return;
    if (amountNum > mgrBalance) return;
    if (!phoneNumber) return;

    performOperation({
      operation: 'withdraw',
      chamaId,
      amount: amountNum,
      paymentMethod,
      recipient: phoneNumber
    }, {
      onSuccess: () => {
        onOpenChange(false);
        setAmount('');
        setPhoneNumber('');
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Withdraw from Merry-Go-Round</DialogTitle>
          <DialogDescription>
            Withdraw funds to your mobile money or bank account
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Available Balance</Label>
            <CurrencyDisplay amount={mgrBalance} className="text-lg font-semibold" />
          </div>

          <div>
            <Label htmlFor="withdraw-amount">Amount to Withdraw</Label>
            <Input
              id="withdraw-amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              max={mgrBalance}
              step="0.01"
            />
          </div>

          <div>
            <Label htmlFor="payment-method">Payment Method</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger id="payment-method">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mpesa">M-Pesa</SelectItem>
                <SelectItem value="airtel">Airtel Money</SelectItem>
                <SelectItem value="bank">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="phone">Phone Number / Account</Label>
            <Input
              id="phone"
              type="text"
              placeholder="0712345678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleWithdraw}
            disabled={isPending || !amount || !phoneNumber || parseFloat(amount) <= 0 || parseFloat(amount) > mgrBalance}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Withdraw
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
