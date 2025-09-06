import { useState } from 'react';
import { Shield, Fingerprint, Smartphone, Key, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSecureAuth } from '@/hooks/useSecureAuth';
import { toast } from 'sonner';

export const SecuritySettings = () => {
  const { user, biometricSupported, enableBiometric, logout } = useSecureAuth();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  const handleBiometricToggle = async (enabled: boolean) => {
    if (enabled && !user?.biometricEnabled) {
      const success = await enableBiometric();
      if (!success) {
        toast.error('Failed to enable biometric authentication');
      }
    } else if (!enabled && user?.biometricEnabled) {
      // In a real app, you'd call an API to disable biometrics
      toast.success('Biometric authentication disabled');
    }
  };

  const handle2FAToggle = async (enabled: boolean) => {
    setTwoFactorEnabled(enabled);
    // In a real app, this would call your backend API
    toast.success(enabled ? '2FA enabled' : '2FA disabled');
  };

  const handleLogoutAllDevices = async () => {
    // In a real app, this would call your backend to invalidate all sessions
    await logout();
    toast.success('Logged out from all devices');
  };

  const securityFeatures = [
    {
      icon: Fingerprint,
      title: 'Biometric Authentication',
      description: 'Use fingerprint or face recognition to login',
      enabled: user?.biometricEnabled || false,
      onToggle: handleBiometricToggle,
      available: biometricSupported,
    },
    {
      icon: Key,
      title: 'Two-Factor Authentication',
      description: 'Add an extra layer of security with SMS or authenticator app',
      enabled: twoFactorEnabled,
      onToggle: handle2FAToggle,
      available: true,
    },
    {
      icon: Smartphone,
      title: 'Email Security Notifications',
      description: 'Get notified about security events via email',
      enabled: emailNotifications,
      onToggle: setEmailNotifications,
      available: true,
    },
    {
      icon: Shield,
      title: 'SMS Security Alerts',
      description: 'Receive critical security alerts via SMS',
      enabled: smsNotifications,
      onToggle: setSmsNotifications,
      available: !!user?.phone,
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Settings
          </CardTitle>
          <CardDescription>
            Manage your account security preferences and authentication methods
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {securityFeatures.map((feature, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-center gap-3">
                <feature.icon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label className="text-sm font-medium">{feature.title}</Label>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                  {!feature.available && (
                    <p className="text-xs text-red-500 mt-1">Not available on this device/account</p>
                  )}
                </div>
              </div>
              <Switch
                checked={feature.enabled}
                onCheckedChange={feature.onToggle}
                disabled={!feature.available}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Security Actions
          </CardTitle>
          <CardDescription>
            Take immediate action to secure your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              For your security, we recommend enabling both biometric authentication and two-factor authentication.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Key className="h-4 w-4 mr-2" />
              Change Password
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <Smartphone className="h-4 w-4 mr-2" />
              Manage Trusted Devices
            </Button>
            
            <Button 
              variant="destructive" 
              className="w-full justify-start"
              onClick={handleLogoutAllDevices}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Logout from All Devices
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security Score</CardTitle>
          <CardDescription>
            Your current security level based on enabled features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Security Score</span>
              <span className="font-medium">
                {securityFeatures.filter(f => f.enabled && f.available).length}/
                {securityFeatures.filter(f => f.available).length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(securityFeatures.filter(f => f.enabled && f.available).length / 
                    securityFeatures.filter(f => f.available).length) * 100}%`
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Enable more security features to improve your score
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};