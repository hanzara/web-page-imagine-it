import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, RefreshCw, ArrowUpDown } from 'lucide-react';
import CurrencyDisplay from '@/components/CurrencyDisplay';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCSVExport } from '@/hooks/useCSVExport';
import { VerifyContributionButton } from './VerifyContributionButton';

interface ContributionLeaderboardProps {
  chamaId: string;
  canDownload?: boolean;
  canVerify?: boolean;
  userRole?: string;
}

type SortOption = 'most_contributing' | 'top_saver' | 'ascending' | 'descending' | 'alphabetical';

export const ContributionLeaderboard: React.FC<ContributionLeaderboardProps> = ({
  chamaId,
  canDownload = false,
  canVerify = false,
  userRole
}) => {
  const [sortBy, setSortBy] = useState<SortOption>('most_contributing');
  const { exportToCSV } = useCSVExport();

  const { data: members, isLoading, refetch } = useQuery({
    queryKey: ['chama-leaderboard', chamaId, sortBy],
    queryFn: async () => {
      let query = supabase
        .from('chama_members')
        .select(`
          *,
          profiles:user_id (
            full_name,
            email
          )
        `)
        .eq('chama_id', chamaId)
        .eq('is_active', true);

      // Apply sorting
      switch (sortBy) {
        case 'most_contributing':
          query = query.order('total_contributed', { ascending: false });
          break;
        case 'top_saver':
          query = query.order('savings_balance', { ascending: false });
          break;
        case 'ascending':
          query = query.order('total_contributed', { ascending: true });
          break;
        case 'descending':
          query = query.order('total_contributed', { ascending: false });
          break;
        case 'alphabetical':
          // Will sort by email since we have profiles joined
          break;
      }

      const { data, error } = await query;
      if (error) throw error;

      // Additional client-side sort for alphabetical
      if (sortBy === 'alphabetical') {
        return (data || []).sort((a, b) => {
          const aEmail = (a.profiles as any)?.email || '';
          const bEmail = (b.profiles as any)?.email || '';
          return aEmail.localeCompare(bEmail);
        });
      }

      return data || [];
    },
    enabled: !!chamaId
  });

  const handleDownload = () => {
    if (!members) return;

    const exportData = members.map((m, i) => ({
      rank: i + 1,
      email: (m.profiles as any)?.email || 'N/A',
      total_contributed: m.total_contributed || 0,
      savings_balance: m.savings_balance || 0,
      mgr_balance: m.mgr_balance || 0,
      role: m.role,
      last_contribution: m.last_contribution_date || 'Never'
    }));

    exportToCSV(
      exportData,
      'chama-contributions',
      ['Rank', 'Email', 'Total Contributed', 'Savings Balance', 'MGR Balance', 'Role', 'Last Contribution']
    );
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Contribution Leaderboard</CardTitle>
          <div className="flex items-center gap-2">
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
              <SelectTrigger className="w-[180px]">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="most_contributing">Most Contributing</SelectItem>
                <SelectItem value="top_saver">Top Saver</SelectItem>
                <SelectItem value="ascending">Ascending</SelectItem>
                <SelectItem value="descending">Descending</SelectItem>
                <SelectItem value="alphabetical">Alphabetical</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            {canDownload && (
              <Button variant="outline" size="icon" onClick={handleDownload}>
                <Download className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {members?.map((member, index) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center font-bold
                    ${index === 0 ? 'bg-yellow-500 text-white' :
                      index === 1 ? 'bg-gray-400 text-white' :
                      index === 2 ? 'bg-orange-600 text-white' :
                      'bg-muted-foreground/20'}
                  `}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{(member.profiles as any)?.email || 'Member'}</p>
                    <Badge variant="outline" className="text-xs">
                      {member.role}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <CurrencyDisplay 
                    amount={member.total_contributed || 0} 
                    className="font-bold"
                  />
                  <p className="text-xs text-muted-foreground">
                    Savings: <CurrencyDisplay amount={member.savings_balance || 0} />
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};