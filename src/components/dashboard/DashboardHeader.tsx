import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Settings, Wifi, WifiOff } from 'lucide-react';
import CurrencyDisplay from '@/components/CurrencyDisplay';

interface DashboardHeaderProps {
  walletBalance: number;
  isOffline: boolean;
  lastUpdated: Date;
  onAddMoney: () => void;
  onSettings: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  walletBalance,
  isOffline,
  lastUpdated,
  onAddMoney,
  onSettings,
}) => {
  return (
    <Card className="border-0 shadow-lg bg-gradient-to-r from-primary to-primary/90 text-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold">Wallet Balance</h2>
            {isOffline ? (
              <Badge variant="destructive" className="flex items-center gap-1">
                <WifiOff className="h-3 w-3" />
                Offline
              </Badge>
            ) : (
              <Badge variant="secondary" className="flex items-center gap-1 text-primary">
                <Wifi className="h-3 w-3" />
                Online
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={onAddMoney}
              disabled={isOffline}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Money
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onSettings}
              className="text-white hover:bg-white/20"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mb-2">
          <CurrencyDisplay 
            amount={walletBalance} 
            className="text-4xl font-bold text-white" 
            showToggle={false} 
          />
        </div>

        <p className="text-sm text-white/80">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </p>
      </CardContent>
    </Card>
  );
};