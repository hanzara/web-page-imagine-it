-- Create wallet transactions table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'pending',
  description TEXT,
  reference_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for wallet_transactions
CREATE POLICY "Users can manage their own transactions" ON public.wallet_transactions
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Create updated_at trigger for wallet_transactions
CREATE OR REPLACE TRIGGER update_wallet_transactions_updated_at
  BEFORE UPDATE ON public.wallet_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add trigger for realtime updates
ALTER PUBLICATION supabase_realtime ADD TABLE wallet_transactions;
ALTER TABLE wallet_transactions REPLICA IDENTITY FULL;