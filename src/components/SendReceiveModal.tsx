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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowDownLeft, ArrowUpRight, Copy, QrCode, Send, Zap, Wallet, CreditCard, Building2, Smartphone, Clock, Shield, CheckCircle, Info, ArrowLeft, AlertTriangle, Eye } from "lucide-react";
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
  const [destinationCurrency, setDestinationCurrency] = useState('UGX');
  
  // Authentication state
  const [pin, setPin] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [showPin, setShowPin] = useState(false);
  
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
    const toRate = exchangeRates[destinationCurrency] || { usd: 0.00027, ugx: 1 };
    
    // Calculate base fees (2.4% + network fees)
    const networkFee = channel === 'mobile_money' ? 0.5 : channel === 'crypto' ? 2.0 : 1.0;
    const percentageFee = amountNum * fromRate.usd * 0.024;
    const totalFee = Math.max(1.20, percentageFee + networkFee);
    
    const convertedAmount = (amountNum * fromRate.ugx) / toRate.ugx;
    const netReceived = convertedAmount - (totalFee * exchangeRates.USD.ugx / toRate.ugx);
    
    return {
      convertedAmount,
      fee: totalFee,
      netReceived,
      rate: fromRate.ugx / toRate.ugx,
      networkFee,
      percentageFee
    };
  };

  const conversionInfo = getConversionInfo();
  const availableBalance = wallets.find(w => w.currency === currency)?.balance || 0;

  // Step navigation
  const nextStep = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
      
      // Auto-send OTP when PIN is entered
      if (currentStep === 4) {
        triggerOTP();
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const triggerOTP = () => {
    setOtpSent(true);
    toast({
      title: "OTP Sent",
      description: "A 6-digit code has been sent to your phone/email",
    });
  };

  const handleSendPayment = async () => {
    setLoading(true);
    setPaymentStatus('processing');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const prefix = mode === 'send' ? 'TX' : 'WD';
      const txId = `${prefix}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
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
        await convertCurrency(currency, destinationCurrency, parseFloat(amount));
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
    setDestinationCurrency('UGX');
    setMessage('');
    setChannel('');
    setPin('');
    setOtpCode('');
    setOtpSent(false);
    setShowPin(false);
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
      case 6: return true; // Review step
      default: return true;
    }
  };

  const getStepTitle = () => {
    const actionText = mode === 'send' ? 'Send Payment' : 'Withdraw Funds';
    switch (currentStep) {
      case 1: return `${actionText} - Select Channel`;
      case 2: return `${actionText} - Destination`;
      case 3: return `${actionText} - ${mode === 'send' ? 'Payment' : 'Withdrawal'} Details`;
      case 4: return `${actionText} - Timing Estimate`;
      case 5: return `${actionText} - Authentication`;
      case 6: return `${actionText} - Review & ${mode === 'send' ? 'Send' : 'Withdraw'}`;
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
                    <Label>Mobile Money Provider</Label>
                    <Select value={destinationCurrency} onValueChange={setDestinationCurrency}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MPESA_KE">M-Pesa (Kenya)</SelectItem>
                        <SelectItem value="MPESA_TZ">M-Pesa (Tanzania)</SelectItem>
                        <SelectItem value="MTN_UG">MTN Mobile Money (Uganda)</SelectItem>
                        <SelectItem value="MTN_GH">MTN Mobile Money (Ghana)</SelectItem>
                        <SelectItem value="AIRTEL_UG">Airtel Money (Uganda)</SelectItem>
                        <SelectItem value="AIRTEL_KE">Airtel Money (Kenya)</SelectItem>
                        <SelectItem value="TIGO_TZ">Tigo Pesa (Tanzania)</SelectItem>
                        <SelectItem value="ORANGE_CI">Orange Money (Côte d'Ivoire)</SelectItem>
                        <SelectItem value="WAVE_SN">Wave (Senegal)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Mobile Money Number</Label>
                    <Input 
                      placeholder="+254 712 XXX XXX"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                    />
                  </div>
                  {destinationCurrency && (
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 text-blue-700">
                        <Info className="h-4 w-4" />
                        <span className="text-sm font-medium">{destinationCurrency.replace('_', ' - ')} Selected</span>
                      </div>
                      <p className="text-xs text-blue-600 mt-1">
                        Funds will be delivered via {destinationCurrency.split('_')[0]} mobile money
                      </p>
                    </div>
                  )}
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

          {/* Step 3: Payment/Withdrawal Details */}
          {currentStep === 3 && (
            <TooltipProvider>
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">
                    {mode === 'send' ? 'Payment' : 'Withdrawal'} Details
                  </h3>
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
                    <Label>{mode === 'send' ? 'From' : 'Wallet'} Currency</Label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background border shadow-lg z-50">
                        {wallets.map((wallet) => (
                          <SelectItem key={wallet.currency} value={wallet.currency}>
                            <div className="flex items-center justify-between w-full">
                              <span>{wallet.currency}</span>
                              <Badge variant="secondary" className="ml-2">
                                {wallet.balance.toFixed(4)}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Available: {availableBalance.toFixed(4)} {currency}
                    </div>
                  </div>
                </div>

                {amount && (
                  <>
                    {/* Auto Conversion Notice */}
                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <div className="flex items-center gap-2 text-amber-700">
                        <Info className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {currency} → {destinationCurrency} (real-time rate: 1 {currency} = {conversionInfo.rate.toLocaleString()} {destinationCurrency})
                        </span>
                      </div>
                      <p className="text-xs text-amber-600 mt-1">
                        {mode === 'send' ? 'Converted automatically' : `Will be converted to ${destinationCurrency} at real-time rate`}
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
                            Fee
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-3 w-3 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <div className="space-y-1 text-xs">
                                  <div>Network fee: ${conversionInfo.networkFee.toFixed(2)}</div>
                                  <div>Processing fee: ${conversionInfo.percentageFee.toFixed(2)} (2.4%)</div>
                                  <div>Total: ${conversionInfo.fee.toFixed(2)}</div>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </span>
                          <span>${conversionInfo.fee.toFixed(2)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-sm">
                          <span>Final Currency ({destinationCurrency})</span>
                          <span>{conversionInfo.convertedAmount.toLocaleString()} {destinationCurrency}</span>
                        </div>
                        <div className="flex justify-between font-medium">
                          <span>Net Received</span>
                          <span>{conversionInfo.netReceived.toLocaleString()} {destinationCurrency}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}

                {/* Reference Field */}
                <div>
                  <Label>Reference (Optional)</Label>
                  <Input 
                    placeholder={mode === 'send' ? "Invoice #423" : "Business payout"}
                    value={message}
                    onChange={(e) => setMessage(e.target.value.slice(0, 100))}
                    maxLength={100}
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {message.length}/100 characters
                  </div>
                </div>
              </div>
            </TooltipProvider>
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
                      <div className="font-semibold text-green-800">Instant delivery (&lt;60s)</div>
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

              {/* Warning for delayed providers */}
              {channel === 'crypto' && (
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-2 text-yellow-700">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm font-medium">Blockchain delays possible</span>
                  </div>
                  <p className="text-xs text-yellow-600 mt-1">
                    Network congestion may cause delays up to 30 minutes
                  </p>
                </div>
              )}
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
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-xs text-green-600 font-medium">Secure & Encrypted</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="flex items-center justify-between">
                    Enter 6-digit PIN
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPin(!showPin)}
                      className="h-auto p-0"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                  </Label>
                  <Input 
                    type={showPin ? "text" : "password"}
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
                <h3 className="text-lg font-semibold mb-2">Review & {mode === 'send' ? 'Send' : 'Confirm'}</h3>
                <p className="text-muted-foreground text-sm">
                  Please review all details before {mode === 'send' ? 'sending' : 'confirming withdrawal'}
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
                    <span>{destinationCurrency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fee</span>
                    <span>${conversionInfo.fee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Net Received</span>
                    <span>{conversionInfo.netReceived.toLocaleString()} {destinationCurrency}</span>
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
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  ✅ {mode === 'send' ? 'Payment Sent Successfully!' : 'Withdrawal Request Submitted Successfully!'}
                </h3>
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
          {currentStep < 7 && (
            <div className="flex gap-3 pt-4">
              {currentStep === 6 ? (
                <Button 
                  onClick={handleSendPayment}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? "Processing..." : (mode === 'send' ? "Send Now" : "Withdraw Now")}
                </Button>
              ) : (
                <Button 
                  onClick={nextStep}
                  disabled={!canProceedToNextStep() || loading}
                  className="flex-1"
                >
                  Continue
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};