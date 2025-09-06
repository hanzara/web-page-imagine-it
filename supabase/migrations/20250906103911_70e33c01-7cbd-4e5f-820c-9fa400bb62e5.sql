-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user_cards table
CREATE TABLE public.user_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  card_name TEXT NOT NULL,
  card_type TEXT NOT NULL CHECK (card_type IN ('virtual', 'physical')),
  card_subtype TEXT CHECK (card_subtype IN ('single_use', 'recurring')),
  card_number TEXT,
  card_holder_name TEXT,
  expiry_date TEXT,
  cvv TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'locked', 'frozen', 'expired', 'cancelled')),
  primary_currency TEXT NOT NULL DEFAULT 'USD',
  currency_priority TEXT[] DEFAULT '{}',
  daily_limit DECIMAL(10,2),
  weekly_limit DECIMAL(10,2),
  monthly_limit DECIMAL(10,2),
  current_balance DECIMAL(10,2) NOT NULL DEFAULT 0,
  international_enabled BOOLEAN NOT NULL DEFAULT true,
  pin_hash TEXT,
  auto_expiry_date TEXT,
  is_apple_pay_enabled BOOLEAN NOT NULL DEFAULT false,
  is_google_pay_enabled BOOLEAN NOT NULL DEFAULT false,
  is_paypal_enabled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create card_transactions table
CREATE TABLE public.card_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  card_id UUID NOT NULL REFERENCES public.user_cards(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  merchant_name TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency_used TEXT NOT NULL DEFAULT 'USD',
  category TEXT,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create card_notifications table
CREATE TABLE public.card_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  card_id UUID NOT NULL REFERENCES public.user_cards(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('sms', 'email', 'push')),
  transaction_alerts BOOLEAN NOT NULL DEFAULT true,
  declined_payments BOOLEAN NOT NULL DEFAULT true,
  suspicious_activity BOOLEAN NOT NULL DEFAULT true,
  spending_limits BOOLEAN NOT NULL DEFAULT true
);

-- Create card_kyc table
CREATE TABLE public.card_kyc (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  card_id UUID NOT NULL REFERENCES public.user_cards(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  document_type TEXT,
  document_number TEXT,
  document_image_url TEXT,
  full_name TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT,
  verification_status TEXT NOT NULL DEFAULT 'pending',
  shipping_address TEXT,
  estimated_delivery TEXT,
  tracking_number TEXT
);

-- Create card_rewards table
CREATE TABLE public.card_rewards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  card_id UUID NOT NULL REFERENCES public.user_cards(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  total_cashback DECIMAL(10,2) NOT NULL DEFAULT 0,
  current_milestone INTEGER NOT NULL DEFAULT 0,
  next_milestone INTEGER NOT NULL DEFAULT 100,
  reward_points INTEGER NOT NULL DEFAULT 0
);

-- Create enhanced_wallet_transactions table
CREATE TABLE public.enhanced_wallet_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  transaction_type TEXT NOT NULL,
  from_currency TEXT NOT NULL,
  from_amount DECIMAL(10,2) NOT NULL,
  to_currency TEXT,
  to_amount DECIMAL(10,2),
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.card_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.card_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.card_kyc ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.card_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enhanced_wallet_transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_cards
CREATE POLICY "Users can view their own cards" 
ON public.user_cards 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own cards" 
ON public.user_cards 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cards" 
ON public.user_cards 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cards" 
ON public.user_cards 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for card_transactions
CREATE POLICY "Users can view their own card transactions" 
ON public.card_transactions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own card transactions" 
ON public.card_transactions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for card_notifications
CREATE POLICY "Users can view their own card notifications" 
ON public.card_notifications 
FOR SELECT 
USING (auth.uid() IN (SELECT user_id FROM public.user_cards WHERE id = card_id));

CREATE POLICY "Users can create their own card notifications" 
ON public.card_notifications 
FOR INSERT 
WITH CHECK (auth.uid() IN (SELECT user_id FROM public.user_cards WHERE id = card_id));

CREATE POLICY "Users can update their own card notifications" 
ON public.card_notifications 
FOR UPDATE 
USING (auth.uid() IN (SELECT user_id FROM public.user_cards WHERE id = card_id));

-- Create RLS policies for card_kyc
CREATE POLICY "Users can view their own card KYC" 
ON public.card_kyc 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own card KYC" 
ON public.card_kyc 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own card KYC" 
ON public.card_kyc 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for card_rewards
CREATE POLICY "Users can view their own card rewards" 
ON public.card_rewards 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own card rewards" 
ON public.card_rewards 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own card rewards" 
ON public.card_rewards 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for enhanced_wallet_transactions
CREATE POLICY "Users can view their own wallet transactions" 
ON public.enhanced_wallet_transactions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own wallet transactions" 
ON public.enhanced_wallet_transactions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wallet transactions" 
ON public.enhanced_wallet_transactions 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_user_cards_updated_at
  BEFORE UPDATE ON public.user_cards
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_enhanced_wallet_transactions_updated_at
  BEFORE UPDATE ON public.enhanced_wallet_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();