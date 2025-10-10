import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CurrencyDisplay from '@/components/CurrencyDisplay';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { VerifyContributionButton } from './VerifyContributionButton';
import { format } from 'date-fns';

interface PendingVerificationsProps {
  chamaId: string;
}

export const PendingVerifications: React.FC<PendingVerificationsProps> = ({ chamaId }) => {
  const { data: pendingContributions, isLoading, refetch } = useQuery({
    queryKey: ['pending-contributions', chamaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chama_contributions_new')
        .select(`
          *,
          chama_members!inner(
            profiles:user_id(full_name, email)
          )
        `)
        .eq('chama_id', chamaId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-600" />
            <CardTitle>Pending Verifications</CardTitle>
          </div>
          <Button variant="outline" size="icon" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-muted animate-pulse rounded" />
            ))}
          </div>
        ) : pendingContributions && pendingContributions.length > 0 ? (
          <div className="space-y-3">
            {pendingContributions.map((contribution) => {
              const member = contribution.chama_members as any;
              const profile = member?.profiles;
              
              return (
                <div
                  key={contribution.id}
                  className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-medium">
                          {profile?.full_name || profile?.email || 'Member'}
                        </p>
                        <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                          Pending
                        </Badge>
                      </div>
                      <CurrencyDisplay 
                        amount={contribution.amount} 
                        className="text-lg font-bold text-orange-600"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        {format(new Date(contribution.created_at), 'MMM dd, yyyy HH:mm')}
                      </p>
                      {contribution.payment_method && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Method: {contribution.payment_method}
                        </p>
                      )}
                      {contribution.payment_reference && (
                        <p className="text-xs text-muted-foreground">
                          Ref: {contribution.payment_reference}
                        </p>
                      )}
                      {contribution.notes && (
                        <p className="text-sm text-muted-foreground mt-2 italic">
                          "{contribution.notes}"
                        </p>
                      )}
                    </div>
                    <div className="ml-4">
                      <VerifyContributionButton
                        contributionId={contribution.id}
                        chamaId={chamaId}
                        amount={contribution.amount}
                        onVerified={() => refetch()}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No pending verifications</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
