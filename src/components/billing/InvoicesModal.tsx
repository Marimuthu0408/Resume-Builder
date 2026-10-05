import React, { useState } from 'react';
import { X, Receipt, Download, Check, ShieldCheck, Printer, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PaymentReceipt } from '../../types/auth';
import { PAYTM_UPI_NUMBER, PAYTM_UPI_ID, PAYTM_PAYEE_NAME } from '../../data/plans';

interface InvoicesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InvoicesModal: React.FC<InvoicesModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentReceipt | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Receipt className="w-5 h-5 text-indigo-400" />
            <div>
              <h2 className="text-base font-semibold leading-tight">Payment Receipts & Billing History</h2>
              <p className="text-xs text-slate-400">All transactions verified via Paytm UPI ({PAYTM_UPI_NUMBER})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {selectedReceipt ? (
            /* Detailed Printable Invoice View */
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  ← Back to All Receipts
                </button>
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 py-1 px-3 bg-slate-900 text-white rounded-lg text-xs font-semibold"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Receipt
                </button>
              </div>

              <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-4 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">ResumeCraft Technologies</h3>
                    <p className="text-slate-500">Official Payment Tax Invoice</p>
                    <p className="text-slate-500 mt-0.5">Paytm UPI: {PAYTM_UPI_ID}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-slate-800 text-sm">{selectedReceipt.id}</span>
                    <p className="text-slate-500">{new Date(selectedReceipt.timestamp).toLocaleString()}</p>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full mt-1">
                      <Check className="w-3 h-3" /> VERIFIED PAID
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-3 grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-400 uppercase text-[10px] font-semibold block">Billed To</span>
                    <span className="font-bold text-slate-800">{selectedReceipt.customerName || user.name}</span>
                    <p className="text-slate-600">{selectedReceipt.customerEmail || user.email}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase text-[10px] font-semibold block">Payment Method</span>
                    <span className="font-semibold text-slate-800">Paytm UPI (India)</span>
                    <p className="font-mono text-slate-600">UTR: {selectedReceipt.utrNumber}</p>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-3">
                  <div className="flex justify-between font-bold text-slate-800 pb-2 border-b border-slate-200">
                    <span>Description</span>
                    <span>Amount (INR)</span>
                  </div>
                  <div className="flex justify-between py-2 text-slate-700">
                    <span>{selectedReceipt.planTitle}</span>
                    <span className="font-mono font-semibold">₹{selectedReceipt.amount}.00</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-slate-900 text-sm">
                    <span>Total Paid</span>
                    <span className="font-mono text-indigo-600">₹{selectedReceipt.amount}.00</span>
                  </div>
                </div>

                <div className="pt-2 text-[10px] text-slate-400 text-center border-t border-slate-200">
                  This is a computer generated digital receipt for online resume services.
                </div>
              </div>
            </div>
          ) : (
            /* Receipts List */
            <div className="space-y-4">
              {user.receipts.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-2">
                  <FileText className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs text-slate-600 font-medium">No payment receipts yet.</p>
                  <p className="text-[11px] text-slate-400">
                    When you subscribe (from ₹20) or purchase a ₹5 resume download via Paytm UPI, your official verified receipts will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-80 overflow-y-auto">
                  {user.receipts.map(rcpt => (
                    <div
                      key={rcpt.id}
                      className="p-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-between gap-3 transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{rcpt.planTitle}</span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                            Paid
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2 font-mono">
                          <span>{new Date(rcpt.timestamp).toLocaleDateString()}</span>
                          <span>·</span>
                          <span>UTR: {rcpt.utrNumber.slice(0, 16)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-bold text-slate-900 text-sm font-mono">₹{rcpt.amount}</span>
                        <button
                          type="button"
                          onClick={() => setSelectedReceipt(rcpt)}
                          className="px-2.5 py-1 bg-white hover:bg-slate-200 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 transition-colors"
                        >
                          View Receipt
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
