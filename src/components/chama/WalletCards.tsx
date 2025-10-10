import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CurrencyDisplay from '@/components/CurrencyDisplay';
import { Wallet, Lock, Unlock, ArrowUp, ArrowDown, Send } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { WalletOperationModal } from './WalletOperationModal';
import { useChamaMembers } from '@/hooks/useChamaMembers';

interface WalletCardsProps {
  chamaId: string;
  savingsBalance: number;
  mgrBalance: number;
  withdrawalLocked: boolean;
  canUnlock?: boolean;
}

export const WalletCards: React.FC<WalletCardsProps> = ({
  chamaId,
  savingsBalance,
  mgrBalance,
  withdrawalLocked,
  canUnlock
}) => {
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);
  const [operationType, setOperationType] = useState<'topup' | 'withdraw' | 'send'>('topup');
  const { data: members } = useChamaMembers(chamaId);

  const handleOpenModal = (type: 'topup' | 'withdraw' | 'send') => {
    setOperationType(type);
    if (type === 'topup') setTopUpOpen(true);
    if (type === 'withdraw') setWithdrawOpen(true);
    if (type === 'send') setSendOpen(true);
  };
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Chama Savings Wallet */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-blue-600" />
              <CardTitle>Chama Savings Wallet</CardTitle>
            </div>
            <Badge variant="secondary">Active</Badge>
          </div>
          <CardDescription>Your accumulated savings in this chama</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <CurrencyDisplay 
            amount={savingsBalance} 
            className="text-3xl font-bold text-blue-600" 
          />
          <div className="text-sm text-muted-foreground">
            Funds locked until contribution period ends
          </div>
        </CardContent>
      </Card>

      {/* Merry-Go-Round Wallet */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-green-600" />
              <CardTitle>Merry-Go-Round Wallet</CardTitle>
            </div>
            {withdrawalLocked ? (
              <Badge variant="destructive" className="flex items-center gap-1">
                <Lock className="h-3 w-3" />
                Locked
              </Badge>
            ) : (
              <Badge variant="default" className="flex items-center gap-1">
                <Unlock className="h-3 w-3" />
                Unlocked
              </Badge>
            )}
          </div>
          <CardDescription>Your payout wallet for merry-go-round turns</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <CurrencyDisplay 
            amount={mgrBalance} 
            className="text-3xl font-bold text-green-600" 
          />
          
          <div className="flex flex-col gap-2">
            <Button 
              onClick={() => handleOpenModal('topup')} 
              variant="outline" 
              className="w-full justify-start"
              size="sm"
            >
              <ArrowUp className="h-4 w-4 mr-2" />
              Top Up from Central Wallet
            </Button>
            
            <Button 
              onClick={() => handleOpenModal('withdraw')} 
              disabled={withdrawalLocked || mgrBalance === 0}
              variant="outline" 
              className="w-full justify-start"
              size="sm"
            >
              <ArrowDown className="h-4 w-4 mr-2" />
              Withdraw to M-Pesa / Bank
            </Button>
            
            <Button 
              onClick={() => handleOpenModal('send')} 
              disabled={mgrBalance === 0}
              variant="outline" 
              className="w-full justify-start"
              size="sm"
            >
              <Send className="h-4 w-4 mr-2" />
              Send to Member
            </Button>
          </div>

          <WalletOperationModal 
            open={topUpOpen}
            onOpenChange={setTopUpOpen}
            chamaId={chamaId}
            operation="topup"
            currentMGRBalance={mgrBalance}
          />

          <WalletOperationModal
            open={withdrawOpen}
            onOpenChange={setWithdrawOpen}
            chamaId={chamaId}
            operation="withdraw"
            currentMGRBalance={mgrBalance}
          />

          <WalletOperationModal
            open={sendOpen}
            onOpenChange={setSendOpen}
            chamaId={chamaId}
            operation="send"
            currentMGRBalance={mgrBalance}
            members={members}
          />

          {withdrawalLocked && (
            <div className="text-xs text-muted-foreground bg-yellow-50 p-2 rounded">
              🔒 Withdrawals locked until it's your turn or admin unlocks
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};