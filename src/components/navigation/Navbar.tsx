import React, { useState } from 'react';
import {
  FileText,
  Crown,
  User as UserIcon,
  Receipt,
  LogOut,
  ChevronDown,
  Sparkles,
  Download,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SubscriptionTier } from '../../types/auth';

interface NavbarProps {
  currentView: 'builder' | 'templates' | 'my-resumes' | 'pricing' | 'cover-letter';
  onNavigate: (view: 'builder' | 'templates' | 'my-resumes' | 'pricing' | 'cover-letter') => void;
  onOpenUpgradeModal: () => void;
  onOpenInvoicesModal: () => void;
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenUpgradeModal,
  onOpenInvoicesModal,
  onOpenAuthModal
}) => {
  const { user, hasActiveSubscription, getRemainingSubscriptionTime, switchDemoUser, logout } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const isSubscribed = hasActiveSubscription();
  const remainingTime = getRemainingSubscriptionTime();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('builder')}
            className="flex items-center gap-2 group text-left focus:outline-hidden"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs group-hover:bg-indigo-700 transition-colors">
              <FileText className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              CVForge
            </span>
          </button>
        </div>

        {/* Zone 2: 4-5 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button
            onClick={() => onNavigate('builder')}
            className={`transition-colors hover:text-slate-900 pb-0.5 border-b-2 ${
              currentView === 'builder'
                ? 'border-indigo-600 text-slate-900 font-semibold'
                : 'border-transparent'
            }`}
          >
            Resume Studio
          </button>
          <button
            onClick={() => onNavigate('templates')}
            className={`transition-colors hover:text-slate-900 pb-0.5 border-b-2 ${
              currentView === 'templates'
                ? 'border-indigo-600 text-slate-900 font-semibold'
                : 'border-transparent'
            }`}
          >
            Templates
          </button>
          <button
            onClick={() => onNavigate('my-resumes')}
            className={`transition-colors hover:text-slate-900 pb-0.5 border-b-2 ${
              currentView === 'my-resumes'
                ? 'border-indigo-600 text-slate-900 font-semibold'
                : 'border-transparent'
            }`}
          >
            My Resumes
          </button>
          <button
            onClick={() => onNavigate('cover-letter')}
            className={`transition-colors hover:text-slate-900 pb-0.5 border-b-2 ${
              currentView === 'cover-letter'
                ? 'border-indigo-600 text-slate-900 font-semibold'
                : 'border-transparent'
            }`}
          >
            Cover Letter
          </button>
          <button
            onClick={() => onNavigate('pricing')}
            className={`transition-colors hover:text-slate-900 pb-0.5 border-b-2 ${
              currentView === 'pricing'
                ? 'border-indigo-600 text-slate-900 font-semibold'
                : 'border-transparent'
            }`}
          >
            Pricing & Plans
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          {/* Subscription Status or Upgrade CTA */}
          {isSubscribed ? (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-medium">
              <Crown className="w-3.5 h-3.5 text-emerald-600" />
              <span className="capitalize font-semibold">{user.subscription.tier} Pass</span>
              <span className="text-emerald-600">({remainingTime})</span>
            </div>
          ) : (
            <button
              onClick={onOpenUpgradeModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs hover:shadow-sm transition-all whitespace-nowrap"
            >
              <Crown className="w-3.5 h-3.5" />
              Upgrade (₹20/Day)
            </button>
          )}

          {/* User Account / Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(prev => !prev)}
              className="flex items-center gap-2 p-1.5 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
              aria-label="User Profile Menu"
            >
              <div className="w-7 h-7 rounded-md bg-slate-900 text-white flex items-center justify-center text-xs font-bold uppercase">
                {user.name.charAt(0) || 'U'}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {profileDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                onClick={() => setProfileDropdownOpen(false)}
              >
                <div className="p-3 border-b border-slate-100">
                  <div className="font-semibold text-slate-900 text-sm truncate">{user.name}</div>
                  <div className="text-xs text-slate-500 truncate">{user.email}</div>
                  <div className="mt-2 text-[11px] font-medium text-slate-600">
                    Plan:{' '}
                    <span className="capitalize font-semibold text-indigo-600">
                      {user.subscription.tier} {isSubscribed ? `(${remainingTime})` : ''}
                    </span>
                  </div>
                  {user.singleDownloadsBalance > 0 && (
                    <div className="text-[11px] text-emerald-700 font-medium">
                      Single Downloads Left: {user.singleDownloadsBalance}
                    </div>
                  )}
                </div>

                {/* Quick actions */}
                <div className="py-1">
                  <button
                    onClick={() => onNavigate('pricing')}
                    className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-2"
                  >
                    <CreditCard className="w-4 h-4 text-slate-500" />
                    Subscription Plans (from ₹20)
                  </button>
                  <button
                    onClick={onOpenInvoicesModal}
                    className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-2"
                  >
                    <Receipt className="w-4 h-4 text-slate-500" />
                    Payment Invoices & Receipts ({user.receipts.length})
                  </button>
                </div>

                {/* Instant Plan Switcher for Evaluator/Testing */}
                <div className="border-t border-slate-100 pt-2 px-1 pb-1">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-600 px-2 mb-1">
                    Quick Role Switcher (Test)
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[11px]">
                    <button
                      onClick={() => switchDemoUser('free')}
                      className={`px-2 py-1 text-left rounded-md transition-colors ${
                        user.subscription.tier === 'free'
                          ? 'bg-slate-200 text-slate-900 font-bold'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Free User (₹5 DL)
                    </button>
                    <button
                      onClick={() => switchDemoUser('daily')}
                      className={`px-2 py-1 text-left rounded-md transition-colors ${
                        user.subscription.tier === 'daily'
                          ? 'bg-indigo-100 text-indigo-900 font-bold'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Daily (₹20)
                    </button>
                    <button
                      onClick={() => switchDemoUser('weekly')}
                      className={`px-2 py-1 text-left rounded-md transition-colors ${
                        user.subscription.tier === 'weekly'
                          ? 'bg-indigo-100 text-indigo-900 font-bold'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Weekly (₹100)
                    </button>
                    <button
                      onClick={() => switchDemoUser('monthly')}
                      className={`px-2 py-1 text-left rounded-md transition-colors ${
                        user.subscription.tier === 'monthly'
                          ? 'bg-indigo-100 text-indigo-900 font-bold'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Monthly (₹350)
                    </button>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-1">
                  <button
                    onClick={onOpenAuthModal}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-2"
                  >
                    <UserIcon className="w-4 h-4 text-slate-500" />
                    Account Settings / Switch User
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile subnavigation bar */}
      <div className="md:hidden border-t border-slate-200 px-4 py-2 flex items-center justify-between text-xs overflow-x-auto gap-3">
        <button
          onClick={() => onNavigate('builder')}
          className={`whitespace-nowrap px-2.5 py-1 rounded-md ${
            currentView === 'builder' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600'
          }`}
        >
          Studio
        </button>
        <button
          onClick={() => onNavigate('templates')}
          className={`whitespace-nowrap px-2.5 py-1 rounded-md ${
            currentView === 'templates' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600'
          }`}
        >
          Templates
        </button>
        <button
          onClick={() => onNavigate('my-resumes')}
          className={`whitespace-nowrap px-2.5 py-1 rounded-md ${
            currentView === 'my-resumes' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600'
          }`}
        >
          My Resumes
        </button>
        <button
          onClick={() => onNavigate('cover-letter')}
          className={`whitespace-nowrap px-2.5 py-1 rounded-md ${
            currentView === 'cover-letter' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600'
          }`}
        >
          Cover Letter
        </button>
        <button
          onClick={() => onNavigate('pricing')}
          className={`whitespace-nowrap px-2.5 py-1 rounded-md ${
            currentView === 'pricing' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600'
          }`}
        >
          Pricing (₹20+)
        </button>
      </div>
    </header>
  );
};
