import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, SubscriptionTier, PaymentReceipt } from '../types/auth';
import { SUBSCRIPTION_PLANS, PAYTM_UPI_ID, SINGLE_DOWNLOAD_PRICE } from '../data/plans';
import confetti from 'canvas-confetti';

interface AuthContextType {
  user: User;
  isLoggedIn: boolean;
  login: (email: string, name?: string) => void;
  register: (name: string, email: string) => void;
  logout: () => void;
  switchDemoUser: (tier: SubscriptionTier) => void;
  activateSubscription: (tier: SubscriptionTier, utrNumber: string) => void;
  purchaseSingleDownload: (utrNumber: string, resumeTitle?: string) => void;
  consumeSingleDownload: () => boolean;
  hasActiveSubscription: () => boolean;
  canDownloadFree: () => boolean;
  canAccessTemplate: (templateId: string) => boolean;
  getRemainingSubscriptionTime: () => string;
  getActivePlanDetails: () => typeof SUBSCRIPTION_PLANS[0] | null;
}

const DEFAULT_FREE_USER: User = {
  id: 'usr-default',
  name: 'Ramu Meena',
  email: 'ramumeena.ssrm.2004@gmail.com',
  role: 'user',
  subscription: {
    tier: 'free',
    isActive: false
  },
  singleDownloadsBalance: 0,
  receipts: []
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(() => {
    try {
      const stored = localStorage.getItem('cvforge_user');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error loading stored user:', e);
    }
    return DEFAULT_FREE_USER;
  });

  useEffect(() => {
    try {
      localStorage.setItem('cvforge_user', JSON.stringify(user));
    } catch (e) {
      console.error('Error persisting user:', e);
    }
  }, [user]);

  // Check if subscription has expired
  const hasActiveSubscription = (): boolean => {
    if (user.subscription.tier === 'free') return false;
    if (!user.subscription.expiresAt) return false;
    return new Date(user.subscription.expiresAt).getTime() > Date.now();
  };

  const canDownloadFree = (): boolean => {
    return hasActiveSubscription() || user.singleDownloadsBalance > 0;
  };

  const getActivePlanDetails = () => {
    if (!hasActiveSubscription()) return null;
    return SUBSCRIPTION_PLANS.find(p => p.id === user.subscription.tier) || null;
  };

  const canAccessTemplate = (templateId: string): boolean => {
    if (templateId === 'classic') return true;
    if (!hasActiveSubscription()) return false;
    const plan = getActivePlanDetails();
    if (!plan) return false;
    return plan.allowedTemplates.includes(templateId);
  };

  const getRemainingSubscriptionTime = (): string => {
    if (!hasActiveSubscription() || !user.subscription.expiresAt) {
      return 'Free Plan';
    }
    const diff = new Date(user.subscription.expiresAt).getTime() - Date.now();
    if (diff <= 0) return 'Expired';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 24) {
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m left`;
    }
    const days = Math.floor(hours / 24);
    const remHours = hours % 24;
    return `${days}d ${remHours}h left`;
  };

  const login = (email: string, name?: string) => {
    setUser(prev => ({
      ...prev,
      email,
      name: name || email.split('@')[0] || 'Member'
    }));
  };

  const register = (name: string, email: string) => {
    setUser(prev => ({
      ...prev,
      name,
      email
    }));
  };

  const logout = () => {
    setUser(DEFAULT_FREE_USER);
  };

  const switchDemoUser = (tier: SubscriptionTier) => {
    if (tier === 'free') {
      setUser({
        ...user,
        subscription: {
          tier: 'free',
          isActive: false,
          expiresAt: undefined
        }
      });
      return;
    }

    const plan = SUBSCRIPTION_PLANS.find(p => p.id === tier);
    if (!plan) return;

    const expiresAt = new Date(Date.now() + plan.durationDays * 24 * 60 * 60 * 1000).toISOString();
    setUser({
      ...user,
      subscription: {
        tier,
        startDate: new Date().toISOString(),
        expiresAt,
        isActive: true
      }
    });

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // safe fallback
    }
  };

  const activateSubscription = (tier: SubscriptionTier, utrNumber: string) => {
    const plan = SUBSCRIPTION_PLANS.find(p => p.id === tier);
    if (!plan) return;

    const expiresAt = new Date(Date.now() + plan.durationDays * 24 * 60 * 60 * 1000).toISOString();
    const receipt: PaymentReceipt = {
      id: `RCPT-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      amount: plan.price,
      type: 'subscription',
      planId: tier,
      planTitle: `${plan.name} (${plan.durationLabel})`,
      upiId: PAYTM_UPI_ID,
      utrNumber: utrNumber.trim() || `PAYTM-${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      customerName: user.name,
      customerEmail: user.email,
      status: 'verified'
    };

    setUser(prev => ({
      ...prev,
      subscription: {
        tier,
        startDate: new Date().toISOString(),
        expiresAt,
        isActive: true
      },
      receipts: [receipt, ...prev.receipts]
    }));

    try {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.5 }
      });
    } catch (e) {
      // safe fallback
    }
  };

  const purchaseSingleDownload = (utrNumber: string, resumeTitle = 'Professional Resume') => {
    const receipt: PaymentReceipt = {
      id: `RCPT-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      amount: SINGLE_DOWNLOAD_PRICE,
      type: 'single_download',
      planTitle: `Single Resume PDF Download (${resumeTitle})`,
      upiId: PAYTM_UPI_ID,
      utrNumber: utrNumber.trim() || `PAYTM-${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      customerName: user.name,
      customerEmail: user.email,
      status: 'verified',
      downloadToken: `DL-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
    };

    setUser(prev => ({
      ...prev,
      singleDownloadsBalance: prev.singleDownloadsBalance + 1,
      receipts: [receipt, ...prev.receipts]
    }));

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // safe fallback
    }
  };

  const consumeSingleDownload = (): boolean => {
    if (hasActiveSubscription()) return true;
    if (user.singleDownloadsBalance > 0) {
      setUser(prev => ({
        ...prev,
        singleDownloadsBalance: Math.max(0, prev.singleDownloadsBalance - 1)
      }));
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: Boolean(user.email),
        login,
        register,
        logout,
        switchDemoUser,
        activateSubscription,
        purchaseSingleDownload,
        consumeSingleDownload,
        hasActiveSubscription,
        canDownloadFree,
        canAccessTemplate,
        getRemainingSubscriptionTime,
        getActivePlanDetails
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
