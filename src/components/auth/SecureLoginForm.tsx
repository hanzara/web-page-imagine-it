import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Fingerprint, Lock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useSecureAuth } from '@/hooks/useSecureAuth';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface SecureLoginFormProps {
  onSuccess?: () => void;
  onSwitchToSignup?: () => void;
}

export const SecureLoginForm = ({ onSuccess, onSwitchToSignup }: SecureLoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [lastEmail, setLastEmail] = useState(localStorage.getItem('last_login_email') || '');
  const { login, loginWithBiometric, user, biometricSupported, loading } = useSecureAuth();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: lastEmail,
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    const success = await login(data.email, data.password);
    if (success) {
      localStorage.setItem('last_login_email', data.email);
      setLastEmail(data.email);
      onSuccess?.();
    }
  };

  const handleBiometricLogin = async () => {
    if (!lastEmail) {
      toast.error('No previous login found');
      return;
    }

    // In a real app, you'd get the user ID from the email
    // For now, using email as identifier
    const success = await loginWithBiometric(lastEmail);
    if (success) {
      onSuccess?.();
    }
  };

  const showBiometricOption = biometricSupported && lastEmail && 
    localStorage.getItem('biometric_enabled') === 'true';

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
          <Lock className="h-6 w-6" />
          Secure Login
        </CardTitle>
        <CardDescription className="text-center">
          Enter your credentials or use biometric authentication
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {showBiometricOption && (
          <div className="space-y-2">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleBiometricLogin}
              disabled={loading}
            >
              <Fingerprint className="h-4 w-4 mr-2" />
              Login with Biometrics
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with password
                </span>
              </div>
            </div>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        {...field}
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        autoComplete="email"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        {...field}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        className="pl-10 pr-10"
                        autoComplete="current-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm">
          <Button variant="link" className="text-xs" onClick={onSwitchToSignup}>
            Don't have an account? Sign up
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};