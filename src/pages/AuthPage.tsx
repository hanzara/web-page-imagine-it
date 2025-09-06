import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSecureAuth } from '@/hooks/useSecureAuth';
import { SecureLoginForm } from '@/components/auth/SecureLoginForm';
import { SecureSignupForm } from '@/components/auth/SecureSignupForm';
import { BiometricSetup } from '@/components/auth/BiometricSetup';

type AuthStep = 'login' | 'signup' | 'biometric-setup';

export const AuthPage = () => {
  const [currentStep, setCurrentStep] = useState<AuthStep>('login');
  const [showBiometricSetup, setShowBiometricSetup] = useState(false);
  const { user, loading } = useSecureAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const handleLoginSuccess = () => {
    // Check if user should set up biometrics
    if (user && !user.biometricEnabled) {
      setShowBiometricSetup(true);
    } else {
      navigate('/dashboard');
    }
  };

  const handleSignupSuccess = () => {
    setShowBiometricSetup(true);
  };

  const handleBiometricComplete = () => {
    navigate('/dashboard');
  };

  const handleBiometricSkip = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        {showBiometricSetup ? (
          <BiometricSetup 
            onComplete={handleBiometricComplete}
            onSkip={handleBiometricSkip}
          />
        ) : currentStep === 'login' ? (
          <SecureLoginForm
            onSuccess={handleLoginSuccess}
            onSwitchToSignup={() => setCurrentStep('signup')}
          />
        ) : (
          <SecureSignupForm
            onSuccess={handleSignupSuccess}
            onSwitchToLogin={() => setCurrentStep('login')}
          />
        )}
      </div>
    </div>
  );
};