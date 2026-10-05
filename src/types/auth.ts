export type SubscriptionTier = 'free' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  price: number;
  durationLabel: string;
  durationDays: number;
  badge?: string;
  popular?: boolean;
  tagline: string;
  features: string[];
  allowedTemplates: string[];
  maxResumes: number;
  hasAIBullets: boolean;
  hasATSScanner: boolean;
  hasCoverLetter: boolean;
  hasCustomColors: boolean;
  hasCustomFonts: boolean;
  hasSectionReorder: boolean;
  hasPhotoUpload: boolean;
  unlimitedDownloads: boolean;
}

export interface PaymentReceipt {
  id: string;
  timestamp: string;
  amount: number;
  type: 'subscription' | 'single_download';
  planId?: SubscriptionTier;
  planTitle: string;
  upiId: string;
  utrNumber: string;
  customerName: string;
  customerEmail: string;
  status: 'verified';
  downloadToken?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  subscription: {
    tier: SubscriptionTier;
    startDate?: string;
    expiresAt?: string;
    isActive: boolean;
  };
  singleDownloadsBalance: number;
  receipts: PaymentReceipt[];
}
