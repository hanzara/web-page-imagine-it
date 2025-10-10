import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useChamaWalletOps } from '@/hooks/useChamaWalletOps';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import CurrencyDisplay from '@/components/CurrencyDisplay';
import { Loader2 } from 'lucide-react';

interface SendToMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chamaId: string;
  mgrBalance: number;
}

export const SendToMemberModal: React.FC<SendToMemberModalProps> = ({
  open,
  onOpenChange,
  chamaId,
  mgrBalance
}) => {
  const [amount, setAmount] = useState('');
  const [recipientId, setRecipientId] = useState('');
  const { mutate: performOperation, isPending } = useChamaWalletOps();

  const { data: members } = useQuery({
    queryKey: ['chama-members', chamaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chama_members')
        .select('id, user_id, profiles:user_id(full_name, email)')
        .eq('chama_id', chamaId)
        .eq('is_active', true);
      
      if (error) throw error;
      return data;
    },
    enabled: open && !!chamaId
  });

  const handleSend = () => {
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) return;
    if (amountNum > mgrBalance) return;
    if (!recipientId) return;

    performOperation({
      operation: 'send',
      chamaId,
      amount: amountNum,
      recipient: recipientId
    }, {
      onSuccess: () => {
        onOpenChange(false);
        setAmount('');
        setRecipientId('');
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send to Member</DialogTitle>
          <DialogDescription>
            Transfer funds from your Merry-Go-Round wallet to another member
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Available Balance</Label>
            <CurrencyDisplay amount={mgrBalance} className="text-lg font-semibold" />
          </div>

          <div>
            <Label htmlFor="recipient">Select Recipient</Label>
            <Select value={recipientId} onValueChange={setRecipientId}>
              <SelectTrigger id="recipient">
                <SelectValue placeholder="Choose a member" />
              </SelectTrigger>
              <SelectContent>
                {members?.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {(member.profiles as any)?.full_name || (member.profiles as any)?.email || 'Member'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="send-amount">Amount to Send</Label>
            <Input
              id="send-amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              max={mgrBalance}
              step="0.01"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSend}
            disabled={isPending || !amount || !recipientId || parseFloat(amount) <= 0 || parseFloat(amount) > mgrBalance}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send Funds
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
