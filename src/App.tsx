import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ResumeProvider, useResume } from './context/ResumeContext';
import { Navbar } from './components/navigation/Navbar';
import { ResumeEditor } from './components/builder/ResumeEditor';
import { ATSScoreCard } from './components/builder/ATSScoreCard';
import { ResumePreview } from './components/preview/ResumePreview';
import { PricingView } from './components/pricing/PricingView';
import { MyResumesView } from './components/dashboard/MyResumesView';
import { TemplatesGalleryView } from './components/templates/TemplatesGalleryView';
import { CoverLetterView } from './components/coverletter/CoverLetterView';
import { PaytmUPIModal } from './components/payment/PaytmUPIModal';
import { InvoicesModal } from './components/billing/InvoicesModal';
import { AuthModal } from './components/auth/AuthModal';
import { SubscriptionTier } from './types/auth';

function MainAppContent() {
  const [currentView, setCurrentView] = useState<'builder' | 'templates' | 'my-resumes' | 'pricing' | 'cover-letter'>('builder');
  const [activePaymentModal, setActivePaymentModal] = useState<{
    isOpen: boolean;
    tier?: SubscriptionTier;
    mode: 'subscription' | 'single_download';
  }>({
    isOpen: false,
    tier: 'daily',
    mode: 'subscription'
  });

  const [isInvoicesOpen, setIsInvoicesOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const { resume } = useResume();
  const { hasActiveSubscription } = useAuth();

  const handleOpenUpgrade = (tier: SubscriptionTier = 'daily') => {
    setActivePaymentModal({
      isOpen: true,
      tier,
      mode: 'subscription'
    });
  };

  const handleTriggerSingleDownload = () => {
    setActivePaymentModal({
      isOpen: true,
      mode: 'single_download'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        onOpenUpgradeModal={() => handleOpenUpgrade('daily')}
        onOpenInvoicesModal={() => setIsInvoicesOpen(true)}
        onOpenAuthModal={() => setIsAuthOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {currentView === 'builder' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: ATS Score + Editor (5 cols on large screens) */}
              <div className="lg:col-span-6 space-y-5 no-print">
                <ATSScoreCard />
                <ResumeEditor onOpenUpgradeModal={() => handleOpenUpgrade('daily')} />
              </div>

              {/* Right Column: Live A4 Resume Preview (6 cols on large screens) */}
              <div className="lg:col-span-6 lg:sticky lg:top-20 h-[calc(100vh-6rem)] min-h-[700px]">
                <ResumePreview
                  onTriggerSinglePayment={handleTriggerSingleDownload}
                  onOpenUpgradeModal={() => handleOpenUpgrade('daily')}
                />
              </div>
            </div>
          </div>
        )}

        {currentView === 'templates' && (
          <TemplatesGalleryView
            onOpenEditor={() => setCurrentView('builder')}
            onOpenUpgradeModal={() => handleOpenUpgrade('weekly')}
          />
        )}

        {currentView === 'my-resumes' && (
          <MyResumesView
            onOpenEditor={() => setCurrentView('builder')}
            onTriggerSinglePayment={handleTriggerSingleDownload}
            onOpenUpgradeModal={() => handleOpenUpgrade('daily')}
          />
        )}

        {currentView === 'pricing' && (
          <PricingView
            onSelectPlan={tier => handleOpenUpgrade(tier)}
            onSelectSingleDownload={handleTriggerSingleDownload}
          />
        )}

        {currentView === 'cover-letter' && <CoverLetterView />}
      </main>

      {/* Footer (Anti-slop, clean and restrained) */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 px-4 sm:px-6 text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">CVForge</span>
            <span aria-hidden="true">·</span>
            <span>Paytm UPI Enabled Resume Platform</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView('pricing')}
              className="hover:text-slate-900 transition-colors"
            >
              Plans (₹20/Day, ₹100/Wk, ₹350/Mo, ₹1000/Yr)
            </button>
            <span aria-hidden="true">·</span>
            <span>Payments to: 6369673585@paytm</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsInvoicesOpen(true)}
              className="hover:text-slate-900 transition-colors"
            >
              Invoices
            </button>
          </div>
        </div>
      </footer>

      {/* Global Paytm UPI Payment Modal */}
      <PaytmUPIModal
        isOpen={activePaymentModal.isOpen}
        onClose={() => setActivePaymentModal(prev => ({ ...prev, isOpen: false }))}
        tier={activePaymentModal.tier}
        mode={activePaymentModal.mode}
        resumeTitle={resume.title}
      />

      {/* Global Invoices / Billing Modal */}
      <InvoicesModal isOpen={isInvoicesOpen} onClose={() => setIsInvoicesOpen(false)} />

      {/* Global User Authentication Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ResumeProvider>
        <MainAppContent />
      </ResumeProvider>
    </AuthProvider>
  );
}
