import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface WalletOperation {
  operation: 'topup' | 'withdraw' | 'send' | 'unlock';
  chamaId: string;
  amount?: number;
  walletType?: 'savings' | 'mgr';
  recipient?: string;
  paymentMethod?: string;
}

export const useChamaWalletOps = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: WalletOperation) => {
      const { data, error } = await supabase.functions.invoke('chama-wallet-ops', {
        body: params
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['chama-members', variables.chamaId] });
      queryClient.invalidateQueries({ queryKey: ['chama-transactions', variables.chamaId] });
      queryClient.invalidateQueries({ queryKey: ['chama-notifications'] });
      
      toast({
        title: "Success",
        description: data.message || "Operation completed successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Operation failed",
        variant: "destructive"
      });
    }
  });
};