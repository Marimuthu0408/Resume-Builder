import React from 'react';
import {
  Check,
  Crown,
  QrCode,
  ShieldCheck,
  Zap,
  Sparkles,
  HelpCircle,
  Clock,
  ArrowRight,
  FileCheck
} from 'lucide-react';
import { SUBSCRIPTION_PLANS, SINGLE_DOWNLOAD_PRICE, PAYTM_UPI_NUMBER, PAYTM_UPI_ID } from '../../data/plans';
import { SubscriptionTier } from '../../types/auth';
import { useAuth } from '../../context/AuthContext';

interface PricingViewProps {
  onSelectPlan: (tier: SubscriptionTier) => void;
  onSelectSingleDownload: () => void;
}

export const PricingView: React.FC<PricingViewProps> = ({
  onSelectPlan,
  onSelectSingleDownload
}) => {
  const { user, hasActiveSubscription, getRemainingSubscriptionTime } = useAuth();
  const isSubscribed = hasActiveSubscription();
  const remaining = getRemainingSubscriptionTime();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
          <Zap className="w-3.5 h-3.5" />
          Transparent INR Pricing · Direct Paytm UPI
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Flexible Subscription Plans for Every Career Stage
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          From an urgent 1-day job submission to year-round executive portfolio management. All payments received directly at Paytm UPI <strong className="text-slate-900 font-mono">6369673585</strong>.
        </p>

        {isSubscribed && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl inline-flex items-center gap-2 text-xs font-semibold text-emerald-800">
            <Crown className="w-4 h-4 text-emerald-600" />
            Your current plan is active: <span className="capitalize">{user.subscription.tier} Pass</span> ({remaining})
          </div>
        )}
      </div>

      {/* 4 Main Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {SUBSCRIPTION_PLANS.map(plan => {
          const isCurrentActive = isSubscribed && user.subscription.tier === plan.id;

          return (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl border transition-all flex flex-col justify-between ${
                plan.popular
                  ? 'border-indigo-600 shadow-lg ring-2 ring-indigo-600/20'
                  : 'border-slate-200 shadow-xs hover:border-slate-300'
              }`}
            >
              {plan.badge && (
                <div
                  className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    plan.popular
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-900 text-white'
                  }`}
                >
                  {plan.badge}
                </div>
              )}

              <div className="p-6 space-y-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">{plan.name}</h2>
                  <p className="text-xs text-slate-500 mt-1 min-h-[32px]">{plan.tagline}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                    ₹{plan.price}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">/ {plan.durationLabel}</span>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                    What is Included:
                  </span>
                  <ul className="space-y-2">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5 stroke-[2.5]" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  type="button"
                  onClick={() => onSelectPlan(plan.id)}
                  disabled={isCurrentActive}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-all ${
                    isCurrentActive
                      ? 'bg-emerald-100 text-emerald-800 cursor-default'
                      : plan.popular
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-md'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  {isCurrentActive ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Active Plan
                    </>
                  ) : (
                    <>
                      <QrCode className="w-3.5 h-3.5" />
                      Subscribe via Paytm UPI (₹{plan.price})
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pay-As-You-Go Single Download Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-800 text-indigo-300 text-xs font-semibold">
            <FileCheck className="w-3.5 h-3.5" />
            No Subscription Needed
          </div>
          <h2 className="text-xl sm:text-2xl font-bold">Just want a single download? Pay only ₹5</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Non-subscription users can build their resume for free and pay a nominal ₹5 fee per download. Zero recurring charges. High-resolution print-ready PDF generated instantly.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <div className="text-center md:text-right px-4">
            <span className="text-3xl font-extrabold text-white font-mono tabular-nums">₹{SINGLE_DOWNLOAD_PRICE}</span>
            <span className="text-xs text-slate-400 block">per resume</span>
          </div>
          <button
            type="button"
            onClick={onSelectSingleDownload}
            className="py-3 px-5 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-xs rounded-xl shadow-md transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <QrCode className="w-4 h-4" />
            Pay ₹5 with Paytm UPI
          </button>
        </div>
      </div>

      {/* Paytm Payment Information & Trust Box */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <ShieldCheck className="w-5 h-5 text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-900">Paytm UPI Payment Instructions</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
          <div className="p-3 bg-slate-50 rounded-xl space-y-1">
            <div className="font-bold text-slate-900 flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">1</span>
              Scan Dynamic QR
            </div>
            <p className="text-slate-500">Scan the generated QR code using Paytm, Google Pay, PhonePe, or BHIM.</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl space-y-1">
            <div className="font-bold text-slate-900 flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">2</span>
              Receiver: {PAYTM_UPI_ID}
            </div>
            <p className="text-slate-500">Transfer is sent directly to mobile <span className="font-mono font-semibold">+91 {PAYTM_UPI_NUMBER}</span>.</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl space-y-1">
            <div className="font-bold text-slate-900 flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">3</span>
              Instant Verification
            </div>
            <p className="text-slate-500">Submit the 12-digit UTR transaction reference to instantly unlock all features.</p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 text-center">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900">How do subscription downloads work?</div>
            <p className="text-slate-600 leading-relaxed">
              Once you activate any pass (Daily, Weekly, Monthly, or Yearly), you can download your resume as many times as you like without paying the ₹5 fee.
            </p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900">Can I modify my resume after subscribing?</div>
            <p className="text-slate-600 leading-relaxed">
              Yes, you can edit every single detail—content, font, color, layout, template—at any time with zero restrictions during your subscription period.
            </p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900">What if my payment is made but not verified?</div>
            <p className="text-slate-600 leading-relaxed">
              We provide instant verification upon entering the 12-digit UPI UTR reference number. You can also use the Instant Test Verify button anytime.
            </p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900">Is the downloaded PDF ATS-friendly?</div>
            <p className="text-slate-600 leading-relaxed">
              All our templates follow strict ATS parsable HTML structures, high-contrast text, standard headings, and vector typography readable by Taleo, Workday, and Greenhouse.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
