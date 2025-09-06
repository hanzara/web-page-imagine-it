import { useState } from 'react';
import { Fingerprint, Shield, Smartphone, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSecureAuth } from '@/hooks/useSecureAuth';

interface BiometricSetupProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

export const BiometricSetup = ({ onComplete, onSkip }: BiometricSetupProps) => {
  const [setupStatus, setSetupStatus] = useState<'idle' | 'setting-up' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const { enableBiometric, biometricSupported, user } = useSecureAuth();

  const handleSetupBiometric = async () => {
    if (!user) return;

    setSetupStatus('setting-up');
    setErrorMessage('');

    try {
      const success = await enableBiometric();
      if (success) {
        setSetupStatus('success');
        setTimeout(() => onComplete?.(), 2000);
      } else {
        setSetupStatus('error');
        setErrorMessage('Failed to set up biometric authentication. Please try again.');
      }
    } catch (error) {
      setSetupStatus('error');
      setErrorMessage('An error occurred during biometric setup.');
    }
  };

  const handleSkip = () => {
    onSkip?.();
  };

  if (!biometricSupported) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Smartphone className="h-6 w-6" />
            Biometric Not Supported
          </CardTitle>
          <CardDescription>
            Your device doesn't support biometric authentication
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Your account is still secure with password authentication. 
              You can enable biometric authentication later if you use a supported device.
            </AlertDescription>
          </Alert>
          <Button onClick={onComplete} className="w-full mt-4">
            Continue
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Fingerprint className="h-6 w-6" />
          Set Up Biometric Login
        </CardTitle>
        <CardDescription>
          Secure your account with fingerprint or face recognition
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {setupStatus === 'idle' && (
          <>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Shield className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-sm">Enhanced Security</p>
                  <p className="text-xs text-muted-foreground">
                    Add an extra layer of protection to your account
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Fingerprint className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-sm">Quick Access</p>
                  <p className="text-xs text-muted-foreground">
                    Login instantly with your fingerprint or face
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Smartphone className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-medium text-sm">Device Specific</p>
                  <p className="text-xs text-muted-foreground">
                    Biometric data stays secure on your device
                  </p>
                </div>
              </div>
            </div>

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                You can always use your password as a fallback if biometric authentication fails.
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button onClick={handleSetupBiometric} className="flex-1">
                Set Up Biometric
              </Button>
              <Button variant="outline" onClick={handleSkip}>
                Skip
              </Button>
            </div>
          </>
        )}

        {setupStatus === 'setting-up' && (
          <div className="text-center space-y-4">
            <div className="animate-pulse">
              <Fingerprint className="h-16 w-16 mx-auto text-primary" />
            </div>
            <p className="text-sm">Setting up biometric authentication...</p>
            <p className="text-xs text-muted-foreground">
              Please follow the prompts from your device
            </p>
          </div>
        )}

        {setupStatus === 'success' && (
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <p className="font-medium">Biometric Setup Complete!</p>
              <p className="text-sm text-muted-foreground">
                You can now use biometric authentication to login
              </p>
            </div>
          </div>
        )}

        {setupStatus === 'error' && (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <X className="h-8 w-8 text-red-600" />
              </div>
              <div>
                <p className="font-medium text-red-600">Setup Failed</p>
                <p className="text-sm text-muted-foreground">{errorMessage}</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleSetupBiometric} variant="outline" className="flex-1">
                Try Again
              </Button>
              <Button onClick={handleSkip} className="flex-1">
                Skip for Now
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};