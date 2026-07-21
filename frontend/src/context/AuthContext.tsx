'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiRequest } from '../lib/api';

export interface User {
  id: string;
  email: string;
  name: string;
  profilePhoto?: string;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  leadScore: number;
  phone?: string;
  whatsApp?: string;
  company?: string;
  businessType?: string;
  industry?: string;
  city?: string;
  country?: string;
  website?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  loginWithGoogle: (credential?: string, recaptchaToken?: string, mockData?: { email: string; name: string; profilePhoto?: string; googleId?: string }) => Promise<void>;
  loginWithEmailAndPassword: (email: string, password: string, recaptchaToken?: string) => Promise<void>;
  completeProfile: (profileData: {
    phone: string;
    whatsApp?: string;
    company?: string;
    businessType: string;
    industry?: string;
    city?: string;
    country?: string;
    website?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('oakpillar_token');
      if (storedToken) {
        setToken(storedToken);
        try {
          const res = await apiRequest<{ user: User }>('/auth/profile', { method: 'GET' });
          setUser(res.user);
        } catch (error) {
          console.error('Failed to restore session:', error);
          localStorage.removeItem('oakpillar_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const loginWithGoogle = async (
    credential?: string,
    recaptchaToken?: string,
    mockData?: { email: string; name: string; profilePhoto?: string; googleId?: string }
  ) => {
    setLoading(true);
    try {
      const res = await apiRequest<{ token: string; user: User }>('/auth/google', {
        method: 'POST',
        body: JSON.stringify({ credential, recaptchaToken, ...mockData })
      });


      localStorage.setItem('oakpillar_token', res.token);
      setToken(res.token);
      setUser(res.user);
    } catch (error) {
      console.error('Google Login Error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmailAndPassword = async (email: string, password: string, recaptchaToken?: string) => {
    setLoading(true);
    try {
      const res = await apiRequest<{ token: string; user: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password, recaptchaToken })
      });
      localStorage.setItem('oakpillar_token', res.token);
      setToken(res.token);
      setUser(res.user);
    } catch (error) {
      console.error('Email/Password Login Error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const completeProfile = async (profileData: any) => {
    setLoading(true);
    try {
      const res = await apiRequest<{ user: User }>('/auth/profile/complete', {
        method: 'PATCH',
        body: JSON.stringify(profileData)
      });
      setUser(res.user);
    } catch (error) {
      console.error('Complete Profile Error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await apiRequest('/auth/logout', { method: 'POST' }).catch(() => {});
    } finally {
      localStorage.removeItem('oakpillar_token');
      setToken(null);
      setUser(null);
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    try {
      const res = await apiRequest<{ user: User }>('/auth/profile', { method: 'GET' });
      setUser(res.user);
    } catch (error) {
      console.error('Refresh Profile Error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, loginWithGoogle, loginWithEmailAndPassword, completeProfile, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
