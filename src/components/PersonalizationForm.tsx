import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  Building, 
  Globe, 
  Target, 
  CreditCard, 
  Code, 
  ArrowRight, 
  X,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PersonalizationData {
  fullName: string;
  businessName: string;
  role: string;
  country: string;
  primaryUseCase: string[];
  industry: string;
  integrations: string[];
  defaultCurrency: string;
  paymentChannels: string[];
  monthlyVolume: string;
  needsAPI: boolean;
  webhooksUrl: string;
  oauthPreference: string;
  sandboxAccess: boolean;
}

export const PersonalizationForm = () => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<PersonalizationData>({
    fullName: "",
    businessName: "",
    role: "",
    country: "",
    primaryUseCase: [],
    industry: "",
    integrations: [],
    defaultCurrency: "USD",
    paymentChannels: [],
    monthlyVolume: "",
    needsAPI: false,
    webhooksUrl: "",
    oauthPreference: "api-key",
    sandboxAccess: false,
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSkip = () => {
    toast({
      title: "Setup Skipped",
      description: "You can complete personalization later in your profile settings.",
    });
    navigate("/");
  };

  const handleComplete = () => {
    // Save personalization data (would normally save to user profile)
    localStorage.setItem("userPersonalization", JSON.stringify(data));
    
    toast({
      title: "Setup Complete!",
      description: "Your account has been personalized. Welcome to Universal Pay!",
    });
    navigate("/");
  };

  const toggleArrayValue = (array: string[], value: string, setter: (arr: string[]) => void) => {
    if (array.includes(value)) {
      setter(array.filter(item => item !== value));
    } else {
      setter([...array, value]);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <User className="w-12 h-12 mx-auto mb-4 text-primary" />
        <h2 className="text-2xl font-bold">User Profile Basics</h2>
        <p className="text-muted-foreground">Tell us about yourself</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            value={data.fullName}
            onChange={(e) => setData({ ...data, fullName: e.target.value })}
            placeholder="John Doe"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessName">Business / Company Name</Label>
          <Input
            id="businessName"
            value={data.businessName}
            onChange={(e) => setData({ ...data, businessName: e.target.value })}
            placeholder="Your Company Ltd (optional for individuals)"
          />
        </div>

        <div className="space-y-2">
          <Label>Role / Title *</Label>
          <Select value={data.role} onValueChange={(value) => setData({ ...data, role: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="founder">Founder</SelectItem>
              <SelectItem value="developer">Developer</SelectItem>
              <SelectItem value="finance-manager">Finance Manager</SelectItem>
              <SelectItem value="freelancer">Freelancer</SelectItem>
              <SelectItem value="business-owner">Business Owner</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Country of Operation *</Label>
          <Select value={data.country} onValueChange={(value) => setData({ ...data, country: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select your country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="US">United States</SelectItem>
              <SelectItem value="UK">United Kingdom</SelectItem>
              <SelectItem value="CA">Canada</SelectItem>
              <SelectItem value="KE">Kenya</SelectItem>
              <SelectItem value="NG">Nigeria</SelectItem>
              <SelectItem value="GH">Ghana</SelectItem>
              <SelectItem value="ZA">South Africa</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Target className="w-12 h-12 mx-auto mb-4 text-primary" />
        <h2 className="text-2xl font-bold">Purpose & Use Case</h2>
        <p className="text-muted-foreground">How will you use Universal Pay?</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label>Primary Use Case (select all that apply)</Label>
          <div className="grid grid-cols-2 gap-3">
            {[
              "Accept Payments",
              "Send Payouts", 
              "Multi-Currency Wallet",
              "API Integration",
              "Virtual/Physical Cards"
            ].map((useCase) => (
              <div key={useCase} className="flex items-center space-x-2">
                <Checkbox
                  id={useCase}
                  checked={data.primaryUseCase.includes(useCase)}
                  onCheckedChange={() => 
                    toggleArrayValue(data.primaryUseCase, useCase, (arr) => 
                      setData({ ...data, primaryUseCase: arr })
                    )
                  }
                />
                <Label htmlFor={useCase} className="text-sm">{useCase}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Industry / Sector</Label>
          <Select value={data.industry} onValueChange={(value) => setData({ ...data, industry: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select your industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ecommerce">eCommerce</SelectItem>
              <SelectItem value="ngo">NGO</SelectItem>
              <SelectItem value="saas">SaaS</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="retail">Retail</SelectItem>
              <SelectItem value="freelance">Freelance</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label>Platform Integration Needed?</Label>
          <div className="grid grid-cols-2 gap-3">
            {[
              "Shopify",
              "WooCommerce",
              "Jumia",
              "Magento",
              "API Only",
              "None for Now"
            ].map((integration) => (
              <div key={integration} className="flex items-center space-x-2">
                <Checkbox
                  id={integration}
                  checked={data.integrations.includes(integration)}
                  onCheckedChange={() => 
                    toggleArrayValue(data.integrations, integration, (arr) => 
                      setData({ ...data, integrations: arr })
                    )
                  }
                />
                <Label htmlFor={integration} className="text-sm">{integration}</Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <CreditCard className="w-12 h-12 mx-auto mb-4 text-primary" />
        <h2 className="text-2xl font-bold">Currency & Payment Preferences</h2>
        <p className="text-muted-foreground">Configure your payment settings</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Default Wallet Currency</Label>
          <Select value={data.defaultCurrency} onValueChange={(value) => setData({ ...data, defaultCurrency: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD - US Dollar</SelectItem>
              <SelectItem value="EUR">EUR - Euro</SelectItem>
              <SelectItem value="NGN">NGN - Nigerian Naira</SelectItem>
              <SelectItem value="KES">KES - Kenyan Shilling</SelectItem>
              <SelectItem value="GHS">GHS - Ghanaian Cedi</SelectItem>
              <SelectItem value="BTC">BTC - Bitcoin</SelectItem>
              <SelectItem value="USDT">USDT - Tether</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label>Preferred Payment Channels</Label>
          <div className="grid grid-cols-2 gap-3">
            {[
              "Bank Transfer",
              "Mobile Money",
              "Card Payments",
              "Cryptocurrency",
              "QR Code"
            ].map((channel) => (
              <div key={channel} className="flex items-center space-x-2">
                <Checkbox
                  id={channel}
                  checked={data.paymentChannels.includes(channel)}
                  onCheckedChange={() => 
                    toggleArrayValue(data.paymentChannels, channel, (arr) => 
                      setData({ ...data, paymentChannels: arr })
                    )
                  }
                />
                <Label htmlFor={channel} className="text-sm">{channel}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Expected Monthly Volume (optional)</Label>
          <Select value={data.monthlyVolume} onValueChange={(value) => setData({ ...data, monthlyVolume: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select volume range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="<1000">&lt;$1,000</SelectItem>
              <SelectItem value="1k-10k">$1,000 - $10,000</SelectItem>
              <SelectItem value="10k-50k">$10,000 - $50,000</SelectItem>
              <SelectItem value="50k+">$50,000+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Code className="w-12 h-12 mx-auto mb-4 text-primary" />
        <h2 className="text-2xl font-bold">Developer Settings</h2>
        <p className="text-muted-foreground">Optional technical configuration</p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div>
            <p className="font-medium">Do you need API access?</p>
            <p className="text-sm text-muted-foreground">Enable API integration capabilities</p>
          </div>
          <Checkbox
            checked={data.needsAPI}
            onCheckedChange={(checked) => setData({ ...data, needsAPI: checked as boolean })}
          />
        </div>

        {data.needsAPI && (
          <>
            <div className="space-y-2">
              <Label htmlFor="webhooksUrl">Webhooks URL (optional)</Label>
              <Input
                id="webhooksUrl"
                value={data.webhooksUrl}
                onChange={(e) => setData({ ...data, webhooksUrl: e.target.value })}
                placeholder="https://yoursite.com/webhooks"
              />
            </div>

            <div className="space-y-2">
              <Label>Authentication Preference</Label>
              <Select value={data.oauthPreference} onValueChange={(value) => setData({ ...data, oauthPreference: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="api-key">API Key</SelectItem>
                  <SelectItem value="oauth">OAuth</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="font-medium">Sandbox Access</p>
                <p className="text-sm text-muted-foreground">Access test environment for development</p>
              </div>
              <Checkbox
                checked={data.sandboxAccess}
                onCheckedChange={(checked) => setData({ ...data, sandboxAccess: checked as boolean })}
              />
            </div>
          </>
        )}

        <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="w-5 h-5 text-primary" />
            <p className="font-medium">Final Confirmation</p>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="confirm"
              checked={data.fullName !== ""}
              disabled
            />
            <Label htmlFor="confirm" className="text-sm">
              I confirm the information above is correct.
            </Label>
          </div>
        </div>
      </div>
    </div>
  );

  const isStepValid = () => {
    switch (step) {
      case 1:
        return data.fullName && data.role && data.country;
      case 2:
        return data.primaryUseCase.length > 0;
      case 3:
        return data.defaultCurrency && data.paymentChannels.length > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/80 to-primary/5 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-primary rounded-full blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-secondary rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-card/80 backdrop-blur-xl border border-border/50 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Globe className="w-8 h-8 text-primary" />
                <span className="text-xl font-bold">Universal Pay</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4 mr-1" />
                Skip
              </Button>
            </div>
            <CardTitle className="text-3xl font-bold">Personalization Setup</CardTitle>
            <CardDescription className="text-base">
              Help us tailor your experience - Step {step} of {totalSteps}
            </CardDescription>
            <Progress value={progress} className="mt-4" />
          </CardHeader>

          <CardContent className="pt-0">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}

            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={step === 1}
              >
                Back
              </Button>

              <div className="flex space-x-3">
                <Button
                  variant="ghost"
                  onClick={handleSkip}
                  className="text-muted-foreground"
                >
                  Skip for now
                </Button>
                
                {step < totalSteps ? (
                  <Button
                    onClick={handleNext}
                    disabled={!isStepValid()}
                    className="bg-gradient-primary"
                  >
                    Continue Setup
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleComplete}
                    disabled={!isStepValid()}
                    className="bg-gradient-primary"
                  >
                    Complete Setup
                    <CheckCircle className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};