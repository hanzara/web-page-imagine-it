import { startRegistration, startAuthentication } from '@simplewebauthn/browser';
import Cookies from 'js-cookie';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface BiometricCredential {
  id: string;
  publicKey: string;
  counter: number;
}

export class AuthService {
  private static readonly ACCESS_TOKEN_KEY = 'fintech_access_token';
  private static readonly REFRESH_TOKEN_KEY = 'fintech_refresh_token';
  private static readonly BIOMETRIC_ENABLED_KEY = 'biometric_enabled';
  private static readonly API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

  // Token Management
  static setTokens(tokens: AuthTokens): void {
    // Store access token in memory/sessionStorage for shorter lifespan
    sessionStorage.setItem(this.ACCESS_TOKEN_KEY, tokens.accessToken);
    sessionStorage.setItem('token_expires_at', tokens.expiresAt.toString());
    
    // Store refresh token in httpOnly cookie (would be set by backend)
    // For now using secure localStorage as fallback
    localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
  }

  static getAccessToken(): string | null {
    const token = sessionStorage.getItem(this.ACCESS_TOKEN_KEY);
    const expiresAt = sessionStorage.getItem('token_expires_at');
    
    if (!token || !expiresAt) return null;
    
    // Check if token is expired
    if (Date.now() > parseInt(expiresAt)) {
      this.clearTokens();
      return null;
    }
    
    return token;
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static clearTokens(): void {
    sessionStorage.removeItem(this.ACCESS_TOKEN_KEY);
    sessionStorage.removeItem('token_expires_at');
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  // Rate Limiting
  private static rateLimitMap = new Map<string, { count: number; resetTime: number }>();
  
  static checkRateLimit(identifier: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): boolean {
    const now = Date.now();
    const record = this.rateLimitMap.get(identifier);
    
    if (!record || now > record.resetTime) {
      this.rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
      return true;
    }
    
    if (record.count >= maxAttempts) {
      return false;
    }
    
    record.count++;
    return true;
  }

  // Authentication API calls
  static async signup(email: string, password: string, phone?: string): Promise<AuthTokens> {
    if (!this.checkRateLimit(`signup_${email}`)) {
      throw new Error('Too many signup attempts. Please try again later.');
    }

    const response = await fetch(`${this.API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, phone }),
    });

    if (!response.ok) {
      throw new Error('Signup failed');
    }

    const tokens = await response.json();
    this.setTokens(tokens);
    return tokens;
  }

  static async login(email: string, password: string): Promise<AuthTokens> {
    if (!this.checkRateLimit(`login_${email}`)) {
      throw new Error('Too many login attempts. Please try again later.');
    }

    const response = await fetch(`${this.API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const tokens = await response.json();
    this.setTokens(tokens);
    return tokens;
  }

  static async refreshAccessToken(): Promise<AuthTokens | null> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return null;

    try {
      const response = await fetch(`${this.API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        this.clearTokens();
        return null;
      }

      const tokens = await response.json();
      this.setTokens(tokens);
      return tokens;
    } catch (error) {
      this.clearTokens();
      return null;
    }
  }

  // Biometric Authentication
  static isBiometricEnabled(): boolean {
    return localStorage.getItem(this.BIOMETRIC_ENABLED_KEY) === 'true';
  }

  static setBiometricEnabled(enabled: boolean): void {
    localStorage.setItem(this.BIOMETRIC_ENABLED_KEY, enabled.toString());
  }

  static async isBiometricSupported(): Promise<boolean> {
    return window.PublicKeyCredential !== undefined && 
           await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  }

  static async registerBiometric(userId: string): Promise<boolean> {
    try {
      // Get registration options from backend
      const optionsResponse = await fetch(`${this.API_BASE_URL}/auth/biometric/register-begin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAccessToken()}`,
        },
        body: JSON.stringify({ userId }),
      });

      const options = await optionsResponse.json();

      // Start registration process
      const credential = await startRegistration(options);

      // Send credential to backend for verification
      const verificationResponse = await fetch(`${this.API_BASE_URL}/auth/biometric/register-finish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAccessToken()}`,
        },
        body: JSON.stringify({ userId, credential }),
      });

      const { verified } = await verificationResponse.json();
      
      if (verified) {
        this.setBiometricEnabled(true);
      }

      return verified;
    } catch (error) {
      console.error('Biometric registration failed:', error);
      return false;
    }
  }

  static async authenticateWithBiometric(userId: string): Promise<AuthTokens | null> {
    try {
      // Get authentication options from backend
      const optionsResponse = await fetch(`${this.API_BASE_URL}/auth/biometric/authenticate-begin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      const options = await optionsResponse.json();

      // Start authentication process
      const credential = await startAuthentication(options);

      // Send credential to backend for verification
      const verificationResponse = await fetch(`${this.API_BASE_URL}/auth/biometric/authenticate-finish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, credential }),
      });

      if (!verificationResponse.ok) {
        return null;
      }

      const tokens = await verificationResponse.json();
      this.setTokens(tokens);
      return tokens;
    } catch (error) {
      console.error('Biometric authentication failed:', error);
      return null;
    }
  }

  static async logout(): Promise<void> {
    const refreshToken = this.getRefreshToken();
    
    try {
      await fetch(`${this.API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAccessToken()}`,
        },
        body: JSON.stringify({ refreshToken }),
      });
    } catch (error) {
      console.error('Logout API call failed:', error);
    }

    this.clearTokens();
  }
}