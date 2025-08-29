-- Create sub-accounts table for multi-user wallet management
CREATE TABLE public.wallet_sub_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_user_id UUID NOT NULL,
  sub_account_name TEXT NOT NULL,
  sub_account_type TEXT NOT NULL DEFAULT 'personal', -- 'personal', 'business', 'family', 'team'
  sub_user_id UUID, -- If this sub-account is assigned to a specific user
  sub_user_email TEXT, -- Email for invitation if user doesn't exist yet
  permissions JSONB NOT NULL DEFAULT '{"view": true, "send": false, "receive": true, "convert": false}',
  spending_limits JSONB DEFAULT '{"daily": null, "weekly": null, "monthly": null}',
  allowed_currencies TEXT[] DEFAULT '{USD}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  CONSTRAINT unique_parent_subaccount_name UNIQUE (parent_user_id, sub_account_name)
);

-- Create sub-account balances table
CREATE TABLE public.sub_account_balances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sub_account_id UUID NOT NULL REFERENCES public.wallet_sub_accounts(id) ON DELETE CASCADE,
  currency_code TEXT NOT NULL,
  balance NUMERIC(20,8) NOT NULL DEFAULT 0,
  locked_balance NUMERIC(20,8) NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  CONSTRAINT unique_subaccount_currency UNIQUE (sub_account_id, currency_code)
);

-- Create sub-account transactions table
CREATE TABLE public.sub_account_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sub_account_id UUID NOT NULL REFERENCES public.wallet_sub_accounts(id) ON DELETE CASCADE,
  parent_user_id UUID NOT NULL,
  transaction_type TEXT NOT NULL, -- 'transfer_in', 'transfer_out', 'spend', 'receive'
  amount NUMERIC(20,8) NOT NULL,
  currency_code TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'completed', -- 'pending', 'completed', 'failed'
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.wallet_sub_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sub_account_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sub_account_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for wallet_sub_accounts
CREATE POLICY "Users can manage their own sub-accounts" 
ON public.wallet_sub_accounts 
FOR ALL 
USING (auth.uid() = parent_user_id OR auth.uid() = sub_user_id);

CREATE POLICY "Sub-users can view their assigned sub-accounts" 
ON public.wallet_sub_accounts 
FOR SELECT 
USING (auth.uid() = sub_user_id);

-- RLS Policies for sub_account_balances
CREATE POLICY "Users can view sub-account balances they have access to" 
ON public.sub_account_balances 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.wallet_sub_accounts 
  WHERE wallet_sub_accounts.id = sub_account_balances.sub_account_id 
  AND (wallet_sub_accounts.parent_user_id = auth.uid() OR wallet_sub_accounts.sub_user_id = auth.uid())
));

CREATE POLICY "Parent users can manage sub-account balances" 
ON public.sub_account_balances 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.wallet_sub_accounts 
  WHERE wallet_sub_accounts.id = sub_account_balances.sub_account_id 
  AND wallet_sub_accounts.parent_user_id = auth.uid()
));

-- RLS Policies for sub_account_transactions
CREATE POLICY "Users can view sub-account transactions they have access to" 
ON public.sub_account_transactions 
FOR SELECT 
USING (parent_user_id = auth.uid() OR EXISTS (
  SELECT 1 FROM public.wallet_sub_accounts 
  WHERE wallet_sub_accounts.id = sub_account_transactions.sub_account_id 
  AND wallet_sub_accounts.sub_user_id = auth.uid()
));

CREATE POLICY "Users can create transactions for their sub-accounts" 
ON public.sub_account_transactions 
FOR INSERT 
WITH CHECK (parent_user_id = auth.uid() OR EXISTS (
  SELECT 1 FROM public.wallet_sub_accounts 
  WHERE wallet_sub_accounts.id = sub_account_transactions.sub_account_id 
  AND wallet_sub_accounts.sub_user_id = auth.uid()
));

-- Create functions for sub-account management
CREATE OR REPLACE FUNCTION public.create_sub_account(
  p_parent_user_id UUID,
  p_sub_account_name TEXT,
  p_sub_account_type TEXT DEFAULT 'personal',
  p_sub_user_email TEXT DEFAULT NULL,
  p_permissions JSONB DEFAULT '{"view": true, "send": false, "receive": true, "convert": false}',
  p_initial_currencies TEXT[] DEFAULT '{USD}'
) RETURNS UUID AS $$
DECLARE
  v_sub_account_id UUID;
  v_currency TEXT;
BEGIN
  -- Create the sub-account
  INSERT INTO public.wallet_sub_accounts (
    parent_user_id, sub_account_name, sub_account_type, 
    sub_user_email, permissions, allowed_currencies
  ) VALUES (
    p_parent_user_id, p_sub_account_name, p_sub_account_type,
    p_sub_user_email, p_permissions, p_initial_currencies
  ) RETURNING id INTO v_sub_account_id;
  
  -- Create initial balance entries for allowed currencies
  FOREACH v_currency IN ARRAY p_initial_currencies
  LOOP
    INSERT INTO public.sub_account_balances (sub_account_id, currency_code, balance)
    VALUES (v_sub_account_id, v_currency, 0);
  END LOOP;
  
  RETURN v_sub_account_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to transfer funds between main wallet and sub-accounts
CREATE OR REPLACE FUNCTION public.transfer_to_sub_account(
  p_parent_user_id UUID,
  p_sub_account_id UUID,
  p_currency_code TEXT,
  p_amount NUMERIC(20,8),
  p_description TEXT DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
  v_main_balance NUMERIC(20,8);
BEGIN
  -- Check main wallet balance
  SELECT balance INTO v_main_balance 
  FROM public.wallet_currencies 
  WHERE user_id = p_parent_user_id AND currency_code = p_currency_code;
  
  IF v_main_balance IS NULL OR v_main_balance < p_amount THEN
    RAISE EXCEPTION 'Insufficient balance in main wallet';
  END IF;
  
  -- Deduct from main wallet
  UPDATE public.wallet_currencies 
  SET balance = balance - p_amount, updated_at = now()
  WHERE user_id = p_parent_user_id AND currency_code = p_currency_code;
  
  -- Add to sub-account
  INSERT INTO public.sub_account_balances (sub_account_id, currency_code, balance)
  VALUES (p_sub_account_id, p_currency_code, p_amount)
  ON CONFLICT (sub_account_id, currency_code)
  DO UPDATE SET balance = sub_account_balances.balance + p_amount, updated_at = now();
  
  -- Record transaction
  INSERT INTO public.sub_account_transactions (
    sub_account_id, parent_user_id, transaction_type, 
    amount, currency_code, description
  ) VALUES (
    p_sub_account_id, p_parent_user_id, 'transfer_in',
    p_amount, p_currency_code, p_description
  );
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for updated_at
CREATE TRIGGER update_wallet_sub_accounts_updated_at
BEFORE UPDATE ON public.wallet_sub_accounts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sub_account_balances_updated_at
BEFORE UPDATE ON public.sub_account_balances
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();