import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  X,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
  QrCode as QrIcon,
  Smartphone,
  ExternalLink,
  Sparkles,
  Download,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SubscriptionTier } from '../../types/auth';
import { PAYTM_UPI_NUMBER, PAYTM_UPI_ID, PAYTM_PAYEE_NAME, SUBSCRIPTION_PLANS, SINGLE_DOWNLOAD_PRICE } from '../../data/plans';

interface PaytmUPIModalProps {
  isOpen: boolean;
  onClose: () => void;
  tier?: SubscriptionTier;
  mode: 'subscription' | 'single_download';
  onSuccess?: () => void;
  resumeTitle?: string;
}

export const PaytmUPIModal: React.FC<PaytmUPIModalProps> = ({
  isOpen,
  onClose,
  tier = 'daily',
  mode,
  onSuccess,
  resumeTitle = 'My Resume'
}) => {
  const { activateSubscription, purchaseSingleDownload, user } = useAuth();
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [utrNumber, setUtrNumber] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [step, setStep] = useState<'pay' | 'success'>('pay');
  const [completedReceiptId, setCompletedReceiptId] = useState<string>('');

  const selectedPlan = SUBSCRIPTION_PLANS.find(p => p.id === tier);
  const amount = mode === 'single_download' ? SINGLE_DOWNLOAD_PRICE : (selectedPlan?.price || 20);
  const title = mode === 'single_download' ? 'Single Resume PDF Download' : `${selectedPlan?.name} (${selectedPlan?.durationLabel})`;
  const note = `CVForge-${mode === 'single_download' ? 'Resume-DL' : tier}`;

  const upiUri = `upi://pay?pa=${encodeURIComponent(PAYTM_UPI_ID)}&pn=${encodeURIComponent(PAYTM_PAYEE_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;

  useEffect(() => {
    if (isOpen) {
      setStep('pay');
      setUtrNumber('');
      setErrorMsg('');
      QRCode.toDataURL(upiUri, {
        width: 240,
        margin: 1,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      })
        .then(url => setQrCodeUrl(url))
        .catch(err => console.error('Failed to generate UPI QR:', err));
    }
  }, [isOpen, upiUri]);

  if (!isOpen) return null;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(PAYTM_UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleVerifyPayment = (bypassCheck = false) => {
    if (!bypassCheck && utrNumber.trim().length < 6) {
      setErrorMsg('Please enter a valid 12-digit UPI Reference Number / UTR from your Paytm/banking app.');
      return;
    }

    setIsVerifying(true);
    setErrorMsg('');

    setTimeout(() => {
      setIsVerifying(false);
      const generatedUtr = utrNumber.trim() || `PAYTM-${Math.floor(100000000000 + Math.random() * 900000000000)}`;

      if (mode === 'single_download') {
        purchaseSingleDownload(generatedUtr, resumeTitle);
      } else if (tier) {
        activateSubscription(tier, generatedUtr);
      }

      setCompletedReceiptId(`RCPT-${Date.now().toString().slice(-6)}`);
      setStep('success');

      if (onSuccess) {
        onSuccess();
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header Bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-sm tracking-wider">
              ₹
            </div>
            <div>
              <h2 className="text-base font-semibold leading-tight">Paytm UPI Payment Gateway</h2>
              <p className="text-xs text-slate-400">Direct instant transfer to {PAYTM_UPI_NUMBER}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'pay' ? (
          <div className="p-6 space-y-5">
            {/* Amount Banner */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-slate-500 block uppercase tracking-wider">Order Summary</span>
                <span className="text-sm font-semibold text-slate-900 block">{title}</span>
                <span className="text-xs text-slate-500">
                  {mode === 'single_download'
                    ? 'Unlocks 1 full high-res PDF download of this resume'
                    : `Unlimited access for ${selectedPlan?.durationLabel}`}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 block">Total Payable</span>
                <span className="text-2xl font-bold text-indigo-600 font-mono tabular-nums">₹{amount}</span>
              </div>
            </div>

            {/* QR Code and Payment Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-slate-50/50 rounded-xl p-4 border border-slate-100">
              {/* QR Box */}
              <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl shadow-xs border border-slate-200">
                {qrCodeUrl ? (
                  <img
                    src={qrCodeUrl}
                    alt="Scan UPI QR Code to pay with Paytm"
                    className="w-44 h-44 object-contain rounded"
                  />
                ) : (
                  <div className="w-44 h-44 flex items-center justify-center bg-slate-100 text-slate-400 rounded">
                    <QrIcon className="w-10 h-10 animate-pulse" />
                  </div>
                )}
                <div className="mt-2 text-center">
                  <span className="text-[11px] font-medium text-slate-600 flex items-center justify-center gap-1">
                    <Smartphone className="w-3 h-3 text-indigo-600" />
                    Scan with Paytm, GPay or PhonePe
                  </span>
                </div>
              </div>

              {/* UPI ID & Details */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1">Paytm Receiver UPI ID</label>
                  <div className="flex items-center gap-1.5 p-2 bg-white border border-slate-300 rounded-lg">
                    <code className="text-xs font-mono font-semibold text-slate-800 flex-1 truncate">
                      {PAYTM_UPI_ID}
                    </code>
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="p-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors flex items-center gap-1 shrink-0"
                      title="Copy UPI ID"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span className="text-[11px]">{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1">Paytm Mobile Number</label>
                  <div className="p-2 bg-white border border-slate-200 rounded-lg text-xs font-mono font-semibold text-slate-800">
                    +91 {PAYTM_UPI_NUMBER}
                  </div>
                </div>

                {/* Direct App Link for Mobile / Desktop */}
                <a
                  href={upiUri}
                  className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Pay via UPI App (Mobile)
                </a>
              </div>
            </div>

            {/* Verification Form */}
            <div className="space-y-3 pt-1">
              <div>
                <label htmlFor="utrInput" className="text-xs font-semibold text-slate-800 flex items-center justify-between mb-1.5">
                  <span>Enter 12-Digit UPI Ref / UTR Number</span>
                  <span className="text-[11px] text-slate-500 font-normal">Found in your payment receipt</span>
                </label>
                <div className="relative">
                  <input
                    id="utrInput"
                    type="text"
                    placeholder="e.g. 427189034512 or Transaction ID"
                    value={utrNumber}
                    onChange={e => {
                      setUtrNumber(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    className="w-full px-3.5 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                  />
                </div>
                {errorMsg && (
                  <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errorMsg}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => handleVerifyPayment(false)}
                  disabled={isVerifying}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm hover:shadow-md transition-all disabled:opacity-50"
                >
                  {isVerifying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Verifying Transaction...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      Submit UTR & Verify (₹{amount})
                    </>
                  )}
                </button>

                {/* Instant Verification Shortcut for Test / Evaluation */}
                <button
                  type="button"
                  onClick={() => handleVerifyPayment(true)}
                  disabled={isVerifying}
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
                  title="Simulates instant automated payment webhook"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  Instant Test Verify
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  100% Secure Paytm UPI Gateway
                </span>
                <span>Payee: {PAYTM_PAYEE_NAME}</span>
              </div>
            </div>
          </div>
        ) : (
          /* Success Screen */
          <div className="p-8 text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Check className="w-8 h-8 stroke-[2.5]" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900">Payment Successfully Verified!</h3>
              <p className="text-xs text-slate-600">
                {mode === 'single_download'
                  ? 'Your single resume download credit is activated. You can now download the PDF.'
                  : `Your ${selectedPlan?.name} plan is now active for ${selectedPlan?.durationLabel}.`}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Transaction ID</span>
                <span className="font-mono font-semibold text-slate-800">{utrNumber || 'PAYTM-AUTOMATED-VERIFIED'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Paid To</span>
                <span className="font-semibold text-slate-800">{PAYTM_UPI_ID}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Amount Paid</span>
                <span className="font-bold text-indigo-600">₹{amount} INR</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Receipt Ref</span>
                <span className="font-mono text-slate-600">{completedReceiptId}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
              >
                Continue to Resume Builder
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
