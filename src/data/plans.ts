import { SubscriptionPlan, SubscriptionTier } from '../types/auth';

export const PAYTM_UPI_NUMBER = '6369673585';
export const PAYTM_UPI_ID = '6369673585@paytm';
export const PAYTM_PAYEE_NAME = 'ResumeCraft Pro';

export const SINGLE_DOWNLOAD_PRICE = 5; // ₹5 per resume for non-subscribed users

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'daily',
    name: 'Daily Pass',
    price: 20,
    durationLabel: '24 Hours',
    durationDays: 1,
    tagline: 'Perfect for urgent job applications & quick interview submissions today.',
    badge: 'Quick Fix',
    features: [
      '24-Hour Unlimited PDF Downloads',
      '3 Sleek Professional Templates (Classic, Modern, Tech)',
      'Custom Accent Color Palette',
      'Profile Photo Upload Support',
      'High-Resolution Print Export (Zero Watermark)',
      'Single Resume Profile Storage'
    ],
    allowedTemplates: ['classic', 'modern', 'tech'],
    maxResumes: 1,
    hasAIBullets: false,
    hasATSScanner: false,
    hasCoverLetter: false,
    hasCustomColors: true,
    hasCustomFonts: false,
    hasSectionReorder: false,
    hasPhotoUpload: true,
    unlimitedDownloads: true
  },
  {
    id: 'weekly',
    name: 'Weekly Sprint',
    price: 100,
    durationLabel: '7 Days',
    durationDays: 7,
    tagline: 'Best for active candidates submitting multiple applications this week.',
    badge: 'Popular for Job Hunting',
    popular: true,
    features: [
      '7 Days Unlimited PDF Downloads',
      '6 Premium Templates (incl. Nordic & Swiss Grid)',
      'Curated Typography & Font Pairing Library',
      'ATS Real-Time Keyword & Score Scanner',
      'Extended Sections (Certificates, Projects, Languages)',
      'Custom Section Reordering',
      'Up to 3 Saved Resume Profiles'
    ],
    allowedTemplates: ['classic', 'modern', 'tech', 'nordic', 'swiss', 'creative'],
    maxResumes: 3,
    hasAIBullets: true,
    hasATSScanner: true,
    hasCoverLetter: false,
    hasCustomColors: true,
    hasCustomFonts: true,
    hasSectionReorder: true,
    hasPhotoUpload: true,
    unlimitedDownloads: true
  },
  {
    id: 'monthly',
    name: 'Monthly Pro',
    price: 350,
    durationLabel: '30 Days',
    durationDays: 30,
    tagline: 'The complete career accelerator for senior professionals & career switchers.',
    badge: 'Best Value',
    features: [
      '30 Days Unlimited Downloads & Edits',
      'All 8+ Elite Templates (incl. Ivy League Academic & Compact)',
      'AI-Powered Bullet Point Enhancer by Industry',
      'Smart Cover Letter Builder matched to Resume Style',
      'Live ATS Score Optimization & Keyword Density',
      'Unlimited Resume Profiles & Versioning',
      'JSON Backup & Multi-format Export'
    ],
    allowedTemplates: ['classic', 'modern', 'tech', 'nordic', 'swiss', 'creative', 'ivy', 'compact'],
    maxResumes: 10,
    hasAIBullets: true,
    hasATSScanner: true,
    hasCoverLetter: true,
    hasCustomColors: true,
    hasCustomFonts: true,
    hasSectionReorder: true,
    hasPhotoUpload: true,
    unlimitedDownloads: true
  },
  {
    id: 'yearly',
    name: 'Annual Executive',
    price: 1000,
    durationLabel: '365 Days (1 Year)',
    durationDays: 365,
    tagline: 'Continuous career progression, portfolio maintenance & VIP features.',
    badge: 'Save ₹3,200',
    features: [
      '365 Days Unrestricted VIP Access',
      'All Current & Upcoming Templates & Designs',
      'Unlimited Resumes & Tailored Cover Letters',
      'Full ATS Optimization & Action Verb Engine',
      'Direct Portfolio & GitHub Project Sync Links',
      'Vector High-Resolution Print Engine (Clean A4)',
      'Priority Verification & VIP Badge'
    ],
    allowedTemplates: ['classic', 'modern', 'tech', 'nordic', 'swiss', 'creative', 'ivy', 'compact'],
    maxResumes: 99,
    hasAIBullets: true,
    hasATSScanner: true,
    hasCoverLetter: true,
    hasCustomColors: true,
    hasCustomFonts: true,
    hasSectionReorder: true,
    hasPhotoUpload: true,
    unlimitedDownloads: true
  }
];

export const TEMPLATE_METADATA = [
  {
    id: 'classic',
    name: 'Classic Clean',
    tierRequired: 'free',
    description: 'Timeless single-column layout with clean dividers, favored by traditional corporate recruiters.'
  },
  {
    id: 'modern',
    name: 'Modern Executive',
    tierRequired: 'daily',
    description: 'Crisp header with distinct colored accent bar and structured timeline highlights.'
  },
  {
    id: 'tech',
    name: 'Tech Minimal',
    tierRequired: 'daily',
    description: 'Built for software engineers and IT professionals with monospaced tech stacks.'
  },
  {
    id: 'nordic',
    name: 'Nordic Slate',
    tierRequired: 'weekly',
    description: 'Airy Scandinavian typography, subtle border structure, and refined spacing.'
  },
  {
    id: 'swiss',
    name: 'Swiss Grid',
    tierRequired: 'weekly',
    description: 'Asymmetric two-column architectural grid with maximum scannability.'
  },
  {
    id: 'creative',
    name: 'Creative Accent',
    tierRequired: 'weekly',
    description: 'High-contrast section markers designed for designers, marketers, and product managers.'
  },
  {
    id: 'ivy',
    name: 'Ivy League',
    tierRequired: 'monthly',
    description: 'Prestigious serif aesthetic inspired by Harvard and Stanford academic resumes.'
  },
  {
    id: 'compact',
    name: 'Compact 1-Page',
    tierRequired: 'monthly',
    description: 'High-density spatial design engineered to fit maximum career depth into a single sheet.'
  }
];

export const COLOR_PALETTES = [
  { name: 'Slate Gray', hex: '#334155' },
  { name: 'Navy Indigo', hex: '#1E40AF' },
  { name: 'Deep Emerald', hex: '#065F46' },
  { name: 'Charcoal Black', hex: '#0F172A' },
  { name: 'Crimson Rose', hex: '#9F1239' },
  { name: 'Royal Purple', hex: '#581C87' },
  { name: 'Teal Ocean', hex: '#0F766E' },
  { name: 'Warm Amber', hex: '#B45309' }
];

export const FONT_OPTIONS = [
  { id: 'sans', name: 'Plus Jakarta Sans', label: 'Modern Clean Sans' },
  { id: 'serif', name: 'Merriweather', label: 'Classic Serif' },
  { id: 'display', name: 'Outfit Display', label: 'Contemporary Geometric' },
  { id: 'mono', name: 'JetBrains Mono', label: 'Technical Developer' }
];
