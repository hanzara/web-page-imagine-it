import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Plus, 
  Send, 
  HandCoins, 
  Users,
  Wallet,
  ArrowUpDown,
  CreditCard,
  UserPlus
} from 'lucide-react';

interface QuickActionsProps {
  onAction: (action: 'add_money' | 'send' | 'request_loan' | 'join_chama' | 'make_contribution') => void;
  isOffline: boolean;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onAction, isOffline }) => {
  const actions = [
    {
      id: 'add_money' as const,
      label: 'Add Money',
      icon: Plus,
      color: 'bg-green-500 hover:bg-green-600',
      disabled: isOffline,
    },
    {
      id: 'make_contribution' as const,
      label: 'Make Contribution',
      icon: CreditCard,
      color: 'bg-primary hover:bg-primary/90',
      disabled: isOffline,
    },
    {
      id: 'send' as const,
      label: 'Send',
      icon: Send,
      color: 'bg-blue-500 hover:bg-blue-600',
      disabled: isOffline,
    },
    {
      id: 'request_loan' as const,
      label: 'Request Loan',
      icon: HandCoins,
      color: 'bg-purple-500 hover:bg-purple-600',
      disabled: isOffline,
    },
    {
      id: 'join_chama' as const,
      label: 'Join Chama',
      icon: UserPlus,
      color: 'bg-orange-500 hover:bg-orange-600',
      disabled: false,
    },
  ];

  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.id}
                variant="ghost"
                className={`h-20 flex-col gap-2 ${action.color} text-white ${
                  action.disabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={() => !action.disabled && onAction(action.id)}
                disabled={action.disabled}
              >
                <Icon className="h-6 w-6" />
                <span className="text-sm font-medium">{action.label}</span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};