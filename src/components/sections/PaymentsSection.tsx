import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CreditCard, 
  Smartphone, 
  Bitcoin, 
  QrCode,
  Globe,
  ArrowRight,
  Building,
  Wallet,
  DollarSign,
  Euro,
  Repeat,
  Play,
  CheckCircle,
  Send,
  ArrowDownToLine,
  Clock,
  Users,
  Shuffle
} from "lucide-react";
import { useEnhancedWallet } from "@/hooks/useEnhancedWallet";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { SendReceiveModal } from "@/components/SendReceiveModal";

// Payment Methods with detailed sub-options
const paymentMethods = [
  { 
    name: "Bank Cards", 
    icon: CreditCard, 
    type: "card", 
    methods: [
      "Visa (one-time and recurring payments)",
      "Mastercard (one-time and recurring payments)", 
      "American Express",
      "Discover",
      "UnionPay",
      "JCB",
      "Virtual cards from neobanks (Revolut, N26, Monzo…)"
    ]
  },
  { 
    name: "International Payment Gateways", 
    icon: Globe, 
    type: "gateway", 
    methods: [
      "Stripe",
      "PayPal", 
      "Flutterwave",
      "Payoneer",
      "Wise",
      "Square",
      "Checkout.com"
    ]
  },
  { 
    name: "Banks & Open Banking", 
    icon: Building, 
    type: "bank", 
    methods: [
      "Payments via IBAN (SEPA, SWIFT)",
      "Direct debits (ACH, SEPA Direct Debit)",
      "Payments via open banking APIs",
      "Fast local transfers (e.g., RTP in the USA, Faster Payments in the UK)"
    ]
  },
  { 
    name: "Mobile Money", 
    icon: Smartphone, 
    type: "mobile", 
    methods: [
      "Orange Money",
      "MTN Mobile Money",
      "M-Pesa",
      "Airtel Money",
      "Moov Money",
      "Tigo Cash",
      "Wave"
    ]
  },
  { 
    name: "Cryptocurrencies", 
    icon: Bitcoin, 
    type: "crypto", 
    methods: [
      "Bitcoin (on-chain and Lightning Network)",
      "Ethereum",
      "USDT (TRC20, ERC20, BEP20)",
      "USDC",
      "BNB", 
      "Solana",
      "Avalanche",
      "Polygon",
      "Others via crypto API aggregators"
    ]
  },
  { 
    name: "QR Codes", 
    icon: QrCode, 
    type: "qr", 
    methods: [
      "Payments via Universal Pay generated QR codes",
      "QR codes compatible with MoMo, PayPal, Stripe, AliPay, and WeChat Pay"
    ]
  },
  { 
    name: "Other Input Sources", 
    icon: Globe, 
    type: "other", 
    methods: [
      "Payments via custom payment links",
      "Universal Pay hosted payment pages",
      "E-commerce integration (WooCommerce, Shopify, Magento)",
      "In-app payments via Universal Pay mobile SDK"
    ]
  }
];

// Output Methods for Send/Withdraw
const outputMethods = [
  {
    name: "Bank Accounts",
    icon: Building,
    type: "bank",
    methods: [
      "SEPA transfers",
      "SWIFT transfers", 
      "Local bank transfers (e.g., Cameroon, Nigeria, Kenya)",
      "Instant transfers (RTP, Faster Payments)"
    ]
  },
  {
    name: "Mobile Money",
    icon: Smartphone,
    type: "mobile",
    methods: [
      "Orange Money",
      "MTN Mobile Money",
      "M-Pesa", 
      "Airtel Money",
      "Wave",
      "Moov Money",
      "Tigo Cash"
    ]
  },
  {
    name: "Payment Cards",
    icon: CreditCard,
    type: "cards",
    methods: [
      "Top-up Universal Pay virtual cards",
      "Top-up physical Visa and Mastercard cards",
      "Transfers to prepaid partner cards"
    ]
  },
  {
    name: "Digital Wallets",
    icon: Wallet,
    type: "wallet",
    methods: [
      "PayPal",
      "Google Pay",
      "Apple Pay",
      "Stripe Wallet"
    ]
  },
  {
    name: "Cryptocurrencies", 
    icon: Bitcoin,
    type: "crypto",
    methods: [
      "Withdrawals to BTC, ETH, USDT, USDC, BNB, SOL, MATIC, AVAX, etc.",
      "Crypto-to-crypto swaps or crypto-to-fiat via aggregators",
      "Lightning Network payments for Bitcoin"
    ]
  },
  {
    name: "Third-Party Platforms",
    icon: Globe,
    type: "platforms",
    methods: [
      "Transfers to Stripe, PayPal, Wise, or Payoneer accounts",
      "Automatic invoice payments to partners"
    ]
  }
];

// Payment Types
const paymentTypes = [
  { name: "One-time Payment", icon: CreditCard, description: "Single payment to recipient" },
  { name: "Recurring Payment", icon: Clock, description: "Scheduled automatic payments" },
  { name: "Split Payment", icon: Users, description: "Divide payment among multiple recipients" },
  { name: "Multi-source Payment", icon: Shuffle, description: "Combine multiple payment sources" }
];

export const PaymentsSection = () => {
  const [activeTab, setActiveTab] = useState("pay");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [selectedPaymentType, setSelectedPaymentType] = useState("one-time");
  const [selectedSubOption, setSelectedSubOption] = useState("");
  const [selectedSendSource, setSelectedSendSource] = useState("");
  const [selectedSendDestination, setSelectedSendDestination] = useState("");
  const [selectedSendSubSource, setSelectedSendSubSource] = useState("");
  const [selectedSendSubDestination, setSelectedSendSubDestination] = useState("");
  const [selectedWithdrawSource, setSelectedWithdrawSource] = useState("");
  const [selectedWithdrawDestination, setSelectedWithdrawDestination] = useState("");
  const [selectedWithdrawSubSource, setSelectedWithdrawSubSource] = useState("");
  const [selectedWithdrawSubDestination, setSelectedWithdrawSubDestination] = useState("");
  const [processing, setProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState({
    recipient: "",
    amount: "",
    currency: "USD",
    description: "",
    accountNumber: "",
    paymentMethod: ""
  });

  // Modal states
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);

  const { walletCurrencies, sendPayment, getCurrencyBalance, loading } = useEnhancedWallet();
  const { toast } = useToast();
  const { user } = useAuth();

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentData.recipient || !paymentData.amount || !selectedPaymentMethod || !selectedSubOption) {
      toast({
        title: "Error",
        description: "Please fill in all required fields and select payment method",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(paymentData.amount);
    const availableBalance = getCurrencyBalance(paymentData.currency);

    if (amount > availableBalance) {
      toast({
        title: "Insufficient Balance",
        description: `You don't have enough ${paymentData.currency}. Available: ${availableBalance}`,
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    try {
      // Create transaction record in database
      const { data: transaction, error: transactionError } = await supabase
        .from('enhanced_wallet_transactions')
        .insert({
          user_id: user?.id,
          transaction_type: 'send',
          from_currency: paymentData.currency,
          from_amount: amount,
          description: paymentData.description || `Payment to ${paymentData.recipient}`,
          status: 'completed',
          metadata: {
            recipient: paymentData.recipient,
            paymentMethod: selectedPaymentMethod,
            subOption: selectedSubOption,
            accountNumber: paymentData.accountNumber
          }
        })
        .select()
        .single();

      if (transactionError) throw transactionError;

      // Update wallet balance
      await sendPayment(paymentData.recipient, paymentData.currency, amount, paymentData.description);
      
      setPaymentData({ recipient: "", amount: "", currency: "USD", description: "", accountNumber: "", paymentMethod: "" });
      setSelectedPaymentMethod("");
      setSelectedSubOption("");
      
      toast({
        title: "Payment Successful",
        description: `Payment of ${amount} ${paymentData.currency} sent successfully`,
      });
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Failed",
        description: "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    }
    setProcessing(false);
  };

  const PayTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Type Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Type
            </CardTitle>
            <CardDescription>Choose your payment approach</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedPaymentType} onValueChange={setSelectedPaymentType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select payment type" />
              </SelectTrigger>
              <SelectContent>
                {paymentTypes.map((type) => (
                  <SelectItem key={type.name} value={type.name.toLowerCase().replace(/[^a-z]/g, '-')}>
                    <div className="flex items-center gap-3">
                      <type.icon className="w-4 h-4" />
                      <div>
                        <div className="font-medium">{type.name}</div>
                        <div className="text-xs text-muted-foreground">{type.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Payment Method Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Payment Method
            </CardTitle>
            <CardDescription>How would you like to pay?</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedPaymentMethod} onValueChange={(value) => {
              setSelectedPaymentMethod(value);
              setSelectedSubOption("");
            }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => (
                  <SelectItem key={method.type} value={method.type}>
                    <div className="flex items-center gap-3">
                      <method.icon className="w-4 h-4" />
                      <div>
                        <div className="font-medium">{method.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {method.methods.length} options available
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* Sub-option Selection */}
      {selectedPaymentMethod && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="w-5 h-5" />
              Select Specific Option
            </CardTitle>
            <CardDescription>
              Choose your preferred {paymentMethods.find(m => m.type === selectedPaymentMethod)?.name} option
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedSubOption} onValueChange={setSelectedSubOption}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select specific payment option" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods
                  .find(m => m.type === selectedPaymentMethod)
                  ?.methods.map((subOption, index) => (
                    <SelectItem key={index} value={subOption}>
                      {subOption}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      {/* Payment Form */}
      {selectedPaymentMethod && selectedSubOption && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
            <CardDescription>Enter payment information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="recipient">Recipient *</Label>
                  <Input
                    id="recipient"
                    placeholder="Enter recipient name or ID"
                    value={paymentData.recipient}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, recipient: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={paymentData.amount}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, amount: e.target.value }))}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={paymentData.currency} onValueChange={(value) => setPaymentData(prev => ({ ...prev, currency: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {walletCurrencies.map((wallet) => (
                        <SelectItem key={wallet.currency_code} value={wallet.currency_code}>
                          <div className="flex items-center justify-between w-full">
                            <span>{wallet.currency_code}</span>
                            <Badge variant="secondary" className="ml-2">
                              Balance: {wallet.balance.toFixed(4)}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account">Account/Reference</Label>
                  <Input
                    id="account"
                    placeholder="Account number or reference"
                    value={paymentData.accountNumber}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, accountNumber: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Payment description or note"
                  value={paymentData.description}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              {/* Selected Payment Summary */}
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Payment Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span className="font-medium">{paymentMethods.find(m => m.type === selectedPaymentMethod)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Option:</span>
                    <span className="font-medium text-xs">{selectedSubOption}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Available Balance:</span>
                    <span className="font-medium">{getCurrencyBalance(paymentData.currency).toFixed(4)} {paymentData.currency}</span>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={processing || loading}>
                {processing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Initiate Payment
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const SendTab = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Send Money</h2>
        <p className="text-muted-foreground">Transfer funds to friends, family, or businesses</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Source of Funds
            </CardTitle>
            <CardDescription>Choose where to send money from</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedSendSource} onValueChange={(value) => {
              setSelectedSendSource(value);
              setSelectedSendSubSource("");
            }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent>
                {outputMethods.map((method) => (
                  <SelectItem key={method.type} value={method.type}>
                    <div className="flex items-center gap-3">
                      <method.icon className="w-4 h-4" />
                      <div>
                        <div className="font-medium">{method.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {method.methods.length} options available
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedSendSource && (
              <div className="mt-4">
                <Label>Specific Source</Label>
                <Select value={selectedSendSubSource} onValueChange={setSelectedSendSubSource}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select specific source" />
                  </SelectTrigger>
                  <SelectContent>
                    {outputMethods
                      .find(m => m.type === selectedSendSource)
                      ?.methods.map((method, index) => (
                        <SelectItem key={index} value={method}>
                          {method}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Destination Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="w-5 h-5" />
              Send Destination
            </CardTitle>
            <CardDescription>Choose where to send money to</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedSendDestination} onValueChange={(value) => {
              setSelectedSendDestination(value);
              setSelectedSendSubDestination("");
            }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select destination" />
              </SelectTrigger>
              <SelectContent>
                {outputMethods.map((method) => (
                  <SelectItem key={method.type} value={method.type}>
                    <div className="flex items-center gap-3">
                      <method.icon className="w-4 h-4" />
                      <div>
                        <div className="font-medium">{method.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {method.methods.length} options available
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedSendDestination && (
              <div className="mt-4">
                <Label>Specific Destination</Label>
                <Select value={selectedSendSubDestination} onValueChange={setSelectedSendSubDestination}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select specific destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {outputMethods
                      .find(m => m.type === selectedSendDestination)
                      ?.methods.map((method, index) => (
                        <SelectItem key={index} value={method}>
                          {method}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Send Form */}
      {selectedSendSource && selectedSendDestination && selectedSendSubSource && selectedSendSubDestination && (
        <Card>
          <CardHeader>
            <CardTitle>Send Money Details</CardTitle>
            <CardDescription>Complete your money transfer</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Transfer Route</h4>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{selectedSendSubSource}</span>
                  <ArrowRight className="w-4 h-4" />
                  <span className="font-medium">{selectedSendSubDestination}</span>
                </div>
              </div>
              <Button 
                className="w-full"
                onClick={() => setSendModalOpen(true)}
                disabled={!selectedSendSource || !selectedSendDestination || !selectedSendSubSource || !selectedSendSubDestination}
              >
                <Send className="w-4 h-4 mr-2" />
                Continue to Send Money
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const WithdrawTab = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Withdraw Funds</h2>
        <p className="text-muted-foreground">Move money from your Universal Pay wallet to external accounts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Withdraw From
            </CardTitle>
            <CardDescription>Choose source wallet</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedWithdrawSource} onValueChange={setSelectedWithdrawSource}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select wallet currency" />
              </SelectTrigger>
              <SelectContent>
                {walletCurrencies.map((wallet) => (
                  <SelectItem key={wallet.currency_code} value={wallet.currency_code}>
                    <div className="flex items-center justify-between w-full">
                      <span>{wallet.currency_code} Wallet</span>
                      <Badge variant="secondary" className="ml-2">
                        {wallet.balance.toFixed(4)}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Destination Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowDownToLine className="w-5 h-5" />
              Withdraw To
            </CardTitle>
            <CardDescription>Choose withdrawal destination</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedWithdrawDestination} onValueChange={(value) => {
              setSelectedWithdrawDestination(value);
              setSelectedWithdrawSubDestination("");
            }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select destination type" />
              </SelectTrigger>
              <SelectContent>
                {outputMethods.map((method) => (
                  <SelectItem key={method.type} value={method.type}>
                    <div className="flex items-center gap-3">
                      <method.icon className="w-4 h-4" />
                      <div>
                        <div className="font-medium">{method.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {method.methods.length} options available
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedWithdrawDestination && (
              <div className="mt-4">
                <Label>Specific Destination</Label>
                <Select value={selectedWithdrawSubDestination} onValueChange={setSelectedWithdrawSubDestination}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select specific option" />
                  </SelectTrigger>
                  <SelectContent>
                    {outputMethods
                      .find(m => m.type === selectedWithdrawDestination)
                      ?.methods.map((method, index) => (
                        <SelectItem key={index} value={method}>
                          {method}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Withdraw Form */}
      {selectedWithdrawSource && selectedWithdrawDestination && selectedWithdrawSubDestination && (
        <Card>
          <CardHeader>
            <CardTitle>Withdrawal Details</CardTitle>
            <CardDescription>Complete your withdrawal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Withdrawal Route</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>From:</span>
                    <span className="font-medium">{selectedWithdrawSource} Wallet</span>
                  </div>
                  <div className="flex justify-between">
                    <span>To:</span>
                    <span className="font-medium">{selectedWithdrawSubDestination}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Available:</span>
                    <span className="font-medium">{getCurrencyBalance(selectedWithdrawSource).toFixed(4)} {selectedWithdrawSource}</span>
                  </div>
                </div>
              </div>
              <Button 
                className="w-full"
                onClick={() => setWithdrawModalOpen(true)}
                disabled={!selectedWithdrawSource || !selectedWithdrawDestination || !selectedWithdrawSubDestination}
              >
                <ArrowDownToLine className="w-4 h-4 mr-2" />
                Continue to Withdraw
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payment Hub</h1>
        <p className="text-muted-foreground">
          Send, receive, and manage payments across multiple channels and currencies
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pay" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            <span className="hidden sm:inline">Pay</span>
          </TabsTrigger>
          <TabsTrigger value="send" className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </TabsTrigger>
          <TabsTrigger value="withdraw" className="flex items-center gap-2">
            <ArrowDownToLine className="w-4 h-4" />
            <span className="hidden sm:inline">Withdraw</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pay" className="space-y-6">
          <PayTab />
        </TabsContent>
        
        <TabsContent value="send" className="space-y-6">
          <SendTab />
        </TabsContent>
        
        <TabsContent value="withdraw" className="space-y-6">
          <WithdrawTab />
        </TabsContent>
      </Tabs>

      {/* Send Modal */}
      <SendReceiveModal
        isOpen={sendModalOpen}
        onClose={() => setSendModalOpen(false)}
        mode="send"
        defaultCurrency={selectedWithdrawSource || "USD"}
      />

      {/* Withdraw Modal */}
      <SendReceiveModal
        isOpen={withdrawModalOpen}
        onClose={() => setWithdrawModalOpen(false)}
        mode="receive"
        defaultCurrency={selectedWithdrawSource || "USD"}
      />
    </div>
  );
};