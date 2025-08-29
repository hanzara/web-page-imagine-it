import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowDownLeft, ArrowUpRight, Copy, QrCode, Send, Zap, Wallet, CreditCard, Building2, Smartphone, Clock, Shield, CheckCircle, Info, ArrowLeft } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { useToast } from "@/hooks/use-toast";

interface SendReceiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'send' | 'receive';
  defaultCurrency?: string;
}

export const SendReceiveModal = ({ isOpen, onClose, mode, defaultCurrency = 'USD' }: SendReceiveModalProps) => {
  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  
  // Form state
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState(defaultCurrency);
  const [message, setMessage] = useState('');
  const [channel, setChannel] = useState('');
  const [timing, setTiming] = useState('instant');
  
  // Authentication state
  const [pin, setPin] = useState('');
  const [otpCode, setOtpCode] = useState('');
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'sent' | 'completed'>('pending');

  const { wallets, sendPayment, convertCurrency } = useWallet();
  const { toast } = useToast();

  // Exchange rates and calculations
  const exchangeRates: { [key: string]: { usd: number; ugx: number } } = {
    USD: { usd: 1, ugx: 3650 },
    EUR: { usd: 1.08, ugx: 3942 },
    GBP: { usd: 1.25, ugx: 4562 },
    KES: { usd: 0.0065, ugx: 24 },
    UGX: { usd: 0.00027, ugx: 1 },
    BTC: { usd: 43500, ugx: 158775000 },
    ETH: { usd: 2450, ugx: 8942500 }
  };

  const getConversionInfo = () => {
    const amountNum = parseFloat(amount) || 0;
    const fromRate = exchangeRates[currency] || { usd: 1, ugx: 3650 };
    const fee = Math.max(1.20, amountNum * fromRate.usd * 0.024); // 2.4% fee, minimum $1.20
    const ugxAmount = amountNum * fromRate.ugx;
    const netReceived = ugxAmount - (fee * exchangeRates.USD.ugx);
    
    return {
      ugxAmount,
      fee,
      netReceived,
      rate: fromRate.ugx / fromRate.usd
    };
  };

  const conversionInfo = getConversionInfo();
  const availableBalance = wallets.find(w => w.currency === currency)?.balance || 0;

  // Step navigation
  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
      
      if (currentStep === 5 && mode === 'send') {
        // Simulate payment processing
        handleSendPayment();
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSendPayment = async () => {
    setLoading(true);
    setPaymentStatus('processing');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const txId = `TX-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
      setTransactionId(txId);
      
      setPaymentStatus('sent');
      
      // Simulate status updates
      setTimeout(() => setPaymentStatus('completed'), 3000);
      
      if (mode === 'send') {
        await sendPayment({
          recipient,
          amount: parseFloat(amount),
          currency,
          message
        });
      } else {
        await convertCurrency(currency, 'UGX', parseFloat(amount));
      }
      
      setCurrentStep(7); // Success step
    } catch (error: any) {
      toast({
        title: "Transaction Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setCurrentStep(1);
    setRecipient('');
    setAmount('');
    setCurrency(defaultCurrency);
    setMessage('');
    setChannel('');
    setPin('');
    setOtpCode('');
    setTransactionId(null);
    setPaymentStatus('pending');
    setLoading(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  // Form validation per step
  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1: return channel !== '';
      case 2: return recipient !== '';
      case 3: return amount !== '' && parseFloat(amount) > 0 && parseFloat(amount) <= availableBalance;
      case 4: return true; // Timing is pre-selected
      case 5: return pin.length === 6 && otpCode.length === 6;
      default: return true;
    }
  };

  const getStepTitle = () => {
    const actionText = mode === 'send' ? 'Send Payment' : 'Withdraw Funds';
    switch (currentStep) {
      case 1: return `${actionText} - Select Channel`;
      case 2: return `${actionText} - Destination`;
      case 3: return `${actionText} - Payment Details`;
      case 4: return `${actionText} - Timing Estimate`;
      case 5: return `${actionText} - Authentication`;
      case 6: return `${actionText} - Review & Send`;
      case 7: return 'Transaction Complete';
      default: return actionText;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {mode === 'send' ? <Send className="h-5 w-5" /> : <ArrowDownLeft className="h-5 w-5" />}
              {getStepTitle()}
            </div>
            {currentStep < 7 && (
              <Badge variant="outline">Step {currentStep}/6</Badge>
            )}
          </DialogTitle>
          {currentStep > 1 && currentStep < 7 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={prevStep}
              className="self-start p-0 h-auto"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          )}
        </DialogHeader>

        <div className="space-y-6">
          {/* Step 1: Channel Selection */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Choose Payment Method</h3>
                <p className="text-muted-foreground text-sm">
                  Select how you want to {mode === 'send' ? 'send money' : 'withdraw funds'}
                </p>
              </div>
              
              <div className="grid gap-3">
                {[
                  { value: 'mobile_money', label: 'Mobile Money', icon: Smartphone, desc: 'M-Pesa, MTN, Airtel' },
                  { value: 'swift', label: 'Bank Transfer', icon: Building2, desc: 'SWIFT, SEPA, ACH' },
                  { value: 'visa', label: 'Card Network', icon: CreditCard, desc: 'Visa, Mastercard' },
                  { value: 'crypto', label: 'Crypto Wallet', icon: Wallet, desc: 'BTC, ETH, USDT' }
                ].map(({ value, label, icon: Icon, desc }) => (
                  <Card 
                    key={value}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      channel === value ? 'ring-2 ring-primary bg-primary/5' : ''
                    }`}
                    onClick={() => setChannel(value)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-primary" />
                        <div>
                          <div className="font-medium">{label}</div>
                          <div className="text-sm text-muted-foreground">{desc}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Destination Details */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Enter Destination</h3>
                <p className="text-muted-foreground text-sm">
                  {channel === 'mobile_money' && 'Enter mobile money number'}
                  {channel === 'swift' && 'Enter bank account details'}
                  {channel === 'visa' && 'Enter card details'}
                  {channel === 'crypto' && 'Enter wallet address'}
                </p>
              </div>

              {channel === 'mobile_money' && (
                <div className="space-y-3">
                  <div>
                    <Label>Mobile Money Number</Label>
                    <Input 
                      placeholder="+254 712 XXX XXX"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                    />
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 text-blue-700">
                      <Info className="h-4 w-4" />
                      <span className="text-sm font-medium">M-Pesa (Kenya) Detected</span>
                    </div>
                    <p className="text-xs text-blue-600 mt-1">
                      Funds will be delivered via Safaricom M-Pesa
                    </p>
                  </div>
                </div>
              )}

              {channel === 'swift' && (
                <div className="space-y-3">
                  <div>
                    <Label>Account Number</Label>
                    <Input 
                      placeholder="Account number"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {channel === 'visa' && (
                <div className="space-y-3">
                  <div>
                    <Label>Card Number</Label>
                    <Input 
                      placeholder="1234 5678 9012 3456"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {channel === 'crypto' && (
                <div className="space-y-3">
                  <div>
                    <Label>Wallet Address</Label>
                    <Input 
                      placeholder="0x742d35Cc..."
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Payment Details */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Payment Details</h3>
                <p className="text-muted-foreground text-sm">
                  Enter the amount and review conversion details
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Amount</Label>
                  <Input 
                    type="number"
                    placeholder="50.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {wallets.map((wallet) => (
                        <SelectItem key={wallet.currency} value={wallet.currency}>
                          {wallet.currency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {amount && (
                <>
                  {/* Auto Conversion Notice */}
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="flex items-center gap-2 text-amber-700">
                      <Info className="h-4 w-4" />
                      <span className="text-sm font-medium">Currency: {currency} → UGX (auto-converted)</span>
                    </div>
                    <p className="text-xs text-amber-600 mt-1">
                      Exchange rate: 1 {currency} = {conversionInfo.rate.toLocaleString()} UGX
                    </p>
                  </div>

                  {/* Fees Display */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Transaction Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Amount ({currency})</span>
                        <span>{parseFloat(amount).toLocaleString()} {currency}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-1">
                          Fees 
                          <Info className="h-3 w-3 text-muted-foreground" />
                        </span>
                        <span>${conversionInfo.fee.toFixed(2)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-sm">
                        <span>Converting to UGX</span>
                        <span>{conversionInfo.ugxAmount.toLocaleString()} UGX</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Net Received</span>
                        <span>{conversionInfo.netReceived.toLocaleString()} UGX</span>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {/* Reference Field */}
              <div>
                <Label>Reference (Optional)</Label>
                <Input 
                  placeholder="Invoice #423"
                  value={message}
                  onChange={(e) => setMessage(e.target.value.slice(0, 100))}
                  maxLength={100}
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {message.length}/100 characters
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Timing Estimate */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Timing Estimate</h3>
                <p className="text-muted-foreground text-sm">
                  Delivery time for your transaction
                </p>
              </div>

              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-green-800">Instant delivery (typically &lt;60s)</div>
                      <div className="text-sm text-green-600">
                        {channel === 'mobile_money' && 'Direct M-Pesa integration'}
                        {channel === 'swift' && 'Real-time bank processing'}
                        {channel === 'visa' && 'Instant card settlement'}
                        {channel === 'crypto' && 'Blockchain confirmation pending'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 5: Authentication */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Security Authentication</h3>
                <p className="text-muted-foreground text-sm">
                  Verify your identity to complete the transaction
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Enter PIN</Label>
                  <Input 
                    type="password"
                    placeholder="••••••"
                    value={pin}
                    onChange={(e) => setPin(e.target.value.slice(0, 6))}
                    maxLength={6}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    6-digit secure PIN
                  </p>
                </div>

                <div>
                  <Label>Enter OTP</Label>
                  <Input 
                    placeholder="123456"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.slice(0, 6))}
                    maxLength={6}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    6-digit code sent to your email/phone
                  </p>
                </div>

                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-700">Secured with bank-level encryption</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Review & Send */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Review & Send</h3>
                <p className="text-muted-foreground text-sm">
                  Please review all details before sending
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Transaction Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">From Wallet</span>
                    <span>{amount} {currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">To</span>
                    <span className="text-right">
                      {recipient.slice(0, 15)}... via {channel === 'mobile_money' ? 'M-Pesa (Kenya)' : channel}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Final Currency</span>
                    <span>UGX</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fee</span>
                    <span>${conversionInfo.fee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Net Received</span>
                    <span>{conversionInfo.netReceived.toLocaleString()} UGX</span>
                  </div>
                  {message && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Reference</span>
                      <span>"{message}"</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 7: Success */}
          {currentStep === 7 && (
            <div className="space-y-4 text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">✅ Payment Sent Successfully!</h3>
                <p className="text-muted-foreground">Your transaction has been processed</p>
              </div>

              <Card>
                <CardContent className="p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tracking ID</span>
                    <span className="font-mono">{transactionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant={paymentStatus === 'completed' ? 'default' : 'secondary'}>
                      {paymentStatus === 'processing' && 'Processing'}
                      {paymentStatus === 'sent' && 'Sent'}
                      {paymentStatus === 'completed' && 'Completed ✅'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-2">
                <Button onClick={() => {}} className="w-full" variant="outline">
                  View Transaction
                </Button>
                <Button onClick={handleClose} className="w-full">
                  Done
                </Button>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          {currentStep < 6 && currentStep < 7 && (
            <div className="flex gap-3 pt-4">
              <Button 
                onClick={nextStep}
                disabled={!canProceedToNextStep() || loading}
                className="flex-1"
              >
                {currentStep === 5 ? (
                  loading ? "Processing..." : "Send Now"
                ) : (
                  "Continue"
                )}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};