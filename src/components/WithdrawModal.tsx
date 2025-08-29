import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowDownLeft, 
  Clock, 
  Shield, 
  CheckCircle, 
  Info, 
  ArrowLeft, 
  Eye, 
  EyeOff,
  Smartphone,
  Wallet
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WithdrawModal = ({ isOpen, onClose }: WithdrawModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [reference, setReference] = useState("");
  const [pin, setPin] = useState("");
  const [otp, setOtp] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  
  const { toast } = useToast();

  const currencies = ["USD", "EUR", "GBP", "KES", "BTC", "ETH"];
  const walletBalances = {
    USD: 250.00,
    EUR: 180.50,
    GBP: 120.75,
    KES: 25000,
    BTC: 0.05,
    ETH: 1.2
  };
  
  const exchangeRate = currency === "USD" ? 130 : currency === "EUR" ? 140 : 120; // To KES
  const fee = parseFloat(amount) ? Math.max(1.20, parseFloat(amount) * 0.024) : 1.20;
  const finalAmount = parseFloat(amount) - fee;
  const kesAmount = finalAmount * exchangeRate;

  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleWithdraw = async () => {
    setTransactionId(`WD-${Math.random().toString(36).substr(2, 7).toUpperCase()}X`);
    setCurrentStep(7);
    
    toast({
      title: "Withdrawal Initiated!",
      description: "Your withdrawal is being processed",
    });
  };

  const resetAndClose = () => {
    setCurrentStep(1);
    setAmount("");
    setCurrency("USD");
    setReference("");
    setPin("");
    setOtp("");
    setTransactionId("");
    onClose();
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1: return amount && parseFloat(amount) > 0 && currency;
      case 2: return true; // Reference is optional
      case 3: return pin.length === 6 && otp.length === 6;
      case 4: return true; // Review step
      default: return true;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetAndClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowDownLeft className="h-5 w-5" />
              Withdraw Funds
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
          {/* Step 1: Withdrawal Amount */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Withdrawal Amount</h3>
                <p className="text-muted-foreground text-sm">
                  Select currency and enter amount to withdraw
                </p>
              </div>

              <div>
                <Label>Select Wallet Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((curr) => (
                      <SelectItem key={curr} value={curr}>
                        <div className="flex items-center justify-between w-full">
                          <span>{curr}</span>
                          <span className="text-muted-foreground ml-2">
                            Balance: {walletBalances[curr as keyof typeof walletBalances]?.toFixed(curr.includes('BTC') || curr.includes('ETH') ? 6 : 2) || '0.00'}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Enter Amount</Label>
                <Input 
                  type="number"
                  placeholder="100.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <div className="text-xs text-muted-foreground mt-1">
                  Available: {walletBalances[currency as keyof typeof walletBalances]?.toFixed(currency.includes('BTC') || currency.includes('ETH') ? 6 : 2) || '0.00'} {currency}
                </div>
              </div>

              {amount && (
                <>
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="flex items-center gap-2 text-amber-700">
                      <Info className="h-4 w-4" />
                      <span className="text-sm font-medium">Will be converted to KES at real-time rate</span>
                    </div>
                    <p className="text-xs text-amber-600 mt-1">
                      Exchange rate: 1 {currency} = {exchangeRate} KES
                    </p>
                  </div>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex justify-between text-sm">
                        <span>Real-Time Fee Estimate:</span>
                        <span className="font-medium">${fee.toFixed(2)}</span>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          )}

          {/* Step 2: Reference Note */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Reference Note (Optional)</h3>
                <p className="text-muted-foreground text-sm">
                  Add a note for your withdrawal record
                </p>
              </div>

              <div>
                <Label>Purpose of Withdrawal</Label>
                <Input 
                  placeholder="Business payout"
                  value={reference}
                  onChange={(e) => setReference(e.target.value.slice(0, 100))}
                  maxLength={100}
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {reference.length}/100 characters
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Common purposes:</p>
                <div className="flex flex-wrap gap-2">
                  {["Business payout", "Personal savings", "Emergency fund", "Investment returns"].map((purpose) => (
                    <Button 
                      key={purpose}
                      variant="outline" 
                      size="sm"
                      onClick={() => setReference(purpose)}
                    >
                      {purpose}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Security Confirmation */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Security Confirmation</h3>
                <p className="text-muted-foreground text-sm">
                  Verify your identity to authorize the withdrawal
                </p>
              </div>

              <div className="flex items-center justify-center mb-4">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Enter PIN</Label>
                  <div className="relative">
                    <Input 
                      type={showPin ? "text" : "password"}
                      placeholder="••••••"
                      value={pin}
                      onChange={(e) => setPin(e.target.value.slice(0, 6))}
                      maxLength={6}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPin(!showPin)}
                    >
                      {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Enter OTP</Label>
                  <Input 
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                    maxLength={6}
                  />
                  <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Smartphone className="h-3 w-3" />
                    OTP sent via phone/email or use Authenticator App
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review & Confirm */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Review & Confirm</h3>
                <p className="text-muted-foreground text-sm">
                  Review your withdrawal details before confirming
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Withdrawal Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <span className="text-muted-foreground">From Wallet:</span>
                    <span className="font-medium">{currency} Wallet (Balance: ${walletBalances[currency as keyof typeof walletBalances]?.toFixed(2)})</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-medium">${amount}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <span className="text-muted-foreground">Withdrawal To:</span>
                    <span className="font-medium">+254 712 XXX XXX (M-Pesa)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <span className="text-muted-foreground">Currency Received:</span>
                    <span className="font-medium">KES (auto-converted)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <span className="text-muted-foreground">Fees:</span>
                    <span className="font-medium">${fee.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4 text-sm font-semibold">
                    <span>Final Amount:</span>
                    <span>${finalAmount.toFixed(2)} ({kesAmount.toFixed(2)} KES)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <span className="text-muted-foreground">Timing:</span>
                    <span className="font-medium">Instant – typically less than 2 minutes</span>
                  </div>
                  {reference && (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <span className="text-muted-foreground">Reference:</span>
                      <span className="font-medium">"{reference}"</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Button 
                onClick={handleWithdraw} 
                className="w-full"
                size="lg"
              >
                <ArrowDownLeft className="h-4 w-4 mr-2" />
                Confirm Withdrawal
              </Button>
            </div>
          )}

          {/* Step 5: Success Screen */}
          {currentStep === 7 && (
            <div className="space-y-4 text-center">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-green-800">Withdrawal Initiated!</h3>
                <p className="text-muted-foreground">Your withdrawal is being processed</p>
              </div>

              <Card>
                <CardContent className="p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Status:</span>
                    <span className="font-medium text-blue-600">Processing...</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Estimated time:</span>
                    <span className="font-medium">~2 minutes</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tracking ID:</span>
                    <span className="font-mono font-medium">{transactionId}</span>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  View Transactions
                </Button>
                <Button variant="outline" className="flex-1">
                  Download Receipt
                </Button>
              </div>
              <Button onClick={resetAndClose} className="w-full">
                Done
              </Button>
            </div>
          )}

          {/* Navigation Buttons */}
          {currentStep >= 1 && currentStep <= 3 && (
            <div className="flex justify-between pt-4">
              <Button 
                variant="outline" 
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              <Button 
                onClick={nextStep}
                disabled={!canProceedToNextStep()}
              >
                {currentStep === 3 ? "Review" : "Continue"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};