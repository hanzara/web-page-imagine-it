import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  Send, 
  Clock, 
  Shield, 
  CheckCircle, 
  Info, 
  ArrowLeft, 
  Eye, 
  EyeOff,
  Smartphone
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SendPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SendPaymentModal = ({ isOpen, onClose }: SendPaymentModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [reference, setReference] = useState("");
  const [pin, setPin] = useState("");
  const [otp, setOtp] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [recipient, setRecipient] = useState("+254 712 XXX XXX");
  const [transactionId, setTransactionId] = useState("");
  const [status, setStatus] = useState<"processing" | "sent" | "completed">("processing");
  
  const { toast } = useToast();

  const currencies = ["USD", "EUR", "GBP", "KES", "UGX", "BTC", "ETH"];
  
  const exchangeRate = 3650; // USD to UGX
  const fee = parseFloat(amount) ? Math.max(1.20, parseFloat(amount) * 0.024) : 1.20;
  const ugxAmount = parseFloat(amount) * exchangeRate;
  const netReceived = ugxAmount - (fee * exchangeRate);

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

  const handleSend = async () => {
    setTransactionId(`TX-${Math.random().toString(36).substr(2, 8).toUpperCase()}`);
    setCurrentStep(7);
    
    // Simulate status progression
    setTimeout(() => setStatus("sent"), 2000);
    setTimeout(() => setStatus("completed"), 5000);
    
    toast({
      title: "Payment Sent Successfully!",
      description: `Transaction ${transactionId} is being processed`,
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
    setStatus("processing");
    onClose();
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1: return amount && parseFloat(amount) > 0 && currency;
      case 2: return true; // Timing is informational
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
              <Send className="h-5 w-5" />
              Send Payment
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
          {/* Step 1: Payment Details */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Payment Details</h3>
                <p className="text-muted-foreground text-sm">
                  Enter amount and currency for your payment
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
                      {currencies.map((curr) => (
                        <SelectItem key={curr} value={curr}>
                          {curr}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {amount && (
                <>
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="flex items-center gap-2 text-amber-700">
                      <Info className="h-4 w-4" />
                      <span className="text-sm font-medium">Currency: {currency} → UGX (auto-converted)</span>
                    </div>
                    <p className="text-xs text-amber-600 mt-1">
                      Exchange rate: 1 {currency} = {exchangeRate.toLocaleString()} UGX
                    </p>
                  </div>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        Fees Display
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Fees</span>
                        <span>${fee.toFixed(2)}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Network and FX conversion fees apply
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              <div>
                <Label>Reference (Optional)</Label>
                <Input 
                  placeholder="Invoice #423"
                  value={reference}
                  onChange={(e) => setReference(e.target.value.slice(0, 100))}
                  maxLength={100}
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {reference.length}/100 characters
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Timing Estimate */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Timing Estimate</h3>
                <p className="text-muted-foreground text-sm">
                  Expected delivery time for your payment
                </p>
              </div>

              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-8 w-8 text-green-600" />
                    <div>
                      <div className="font-semibold text-green-800">Instant delivery (typically &lt;60s)</div>
                      <div className="text-sm text-green-600">
                        Direct integration with payment providers
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 3: Authentication */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Authentication</h3>
                <p className="text-muted-foreground text-sm">
                  Secure your transaction with PIN and OTP verification
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Enter PIN (6 digits)</Label>
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
                  <Label>Enter OTP (6 digits)</Label>
                  <Input 
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                    maxLength={6}
                  />
                  <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Smartphone className="h-3 w-3" />
                    OTP sent to your registered phone/email
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review & Send */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Review & Send</h3>
                <p className="text-muted-foreground text-sm">
                  Confirm your payment details before sending
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Payment Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <span className="text-muted-foreground">From Wallet:</span>
                    <span className="font-medium">${amount} ({currency})</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <span className="text-muted-foreground">To:</span>
                    <span className="font-medium">{recipient} via M-Pesa (Kenya)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <span className="text-muted-foreground">Final Currency:</span>
                    <span className="font-medium">UGX</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <span className="text-muted-foreground">Fee:</span>
                    <span className="font-medium">${fee.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4 text-sm font-semibold">
                    <span>Net Received:</span>
                    <span>{netReceived.toLocaleString()} UGX</span>
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
                onClick={handleSend} 
                className="w-full"
                size="lg"
              >
                <Send className="h-4 w-4 mr-2" />
                Send Now
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
                <h3 className="text-lg font-semibold text-green-800">Payment Sent Successfully!</h3>
                <p className="text-muted-foreground">Your transaction is being processed</p>
              </div>

              <Card>
                <CardContent className="p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Tracking ID:</span>
                    <span className="font-mono font-medium">{transactionId}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Status:</span>
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${
                        status === "completed" ? "bg-green-500" : "bg-yellow-500"
                      }`} />
                      <span className="capitalize font-medium">{status}</span>
                      {status === "completed" && <span>✅</span>}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  View Transaction
                </Button>
                <Button onClick={resetAndClose} className="flex-1">
                  Done
                </Button>
              </div>
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