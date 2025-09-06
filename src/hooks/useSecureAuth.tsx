import { useState, useEffect, createContext, useContext } from 'react';
import { AuthService, AuthTokens } from '@/lib/auth';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  phone?: string;
  biometricEnabled: boolean;
  lastLogin: string;
}

interface SecureAuthContextType {
  user: User | null;
  loading: boolean;
  biometricSupported: boolean;
  signup: (email: string, password: string, phone?: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithBiometric: (userId: string) => Promise<boolean>;
  enableBiometric: () => Promise<boolean>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<boolean>;
}

const SecureAuthContext = createContext<SecureAuthContextType | undefined>(undefined);

export const SecureAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [biometricSupported, setBiometricSupported] = useState(false);

  useEffect(() => {
    initializeAuth();
    checkBiometricSupport();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = AuthService.getAccessToken();
      if (token) {
        await fetchUserProfile();
      } else {
        // Try to refresh token
        const refreshed = await AuthService.refreshAccessToken();
        if (refreshed) {
          await fetchUserProfile();
        }
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkBiometricSupport = async () => {
    const supported = await AuthService.isBiometricSupported();
    setBiometricSupported(supported);
  };

  const fetchUserProfile = async () => {
    try {
      const token = AuthService.getAccessToken();
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser({
          ...userData,
          biometricEnabled: AuthService.isBiometricEnabled(),
        });
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  };

  const signup = async (email: string, password: string, phone?: string): Promise<boolean> => {
    try {
      setLoading(true);
      await AuthService.signup(email, password, phone);
      await fetchUserProfile();
      toast.success('Account created successfully!');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Signup failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      await AuthService.login(email, password);
      await fetchUserProfile();
      toast.success('Welcome back!');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const loginWithBiometric = async (userId: string): Promise<boolean> => {
    try {
      setLoading(true);
      const tokens = await AuthService.authenticateWithBiometric(userId);
      if (tokens) {
        await fetchUserProfile();
        toast.success('Biometric login successful!');
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error('Biometric authentication failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const enableBiometric = async (): Promise<boolean> => {
    if (!user || !biometricSupported) return false;

    try {
      const success = await AuthService.registerBiometric(user.id);
      if (success) {
        setUser(prev => prev ? { ...prev, biometricEnabled: true } : null);
        toast.success('Biometric authentication enabled!');
      } else {
        toast.error('Failed to enable biometric authentication');
      }
      return success;
    } catch (error) {
      toast.error('Biometric setup failed');
      return false;
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const refreshAuth = async (): Promise<boolean> => {
    try {
      const tokens = await AuthService.refreshAccessToken();
      if (tokens) {
        await fetchUserProfile();
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const value = {
    user,
    loading,
    biometricSupported,
    signup,
    login,
    loginWithBiometric,
    enableBiometric,
    logout,
    refreshAuth,
  };

  return (
    <SecureAuthContext.Provider value={value}>
      {children}
    </SecureAuthContext.Provider>
  );
};

export const useSecureAuth = () => {
  const context = useContext(SecureAuthContext);
  if (context === undefined) {
    throw new Error('useSecureAuth must be used within a SecureAuthProvider');
  }
  return context;
};