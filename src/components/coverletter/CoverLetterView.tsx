import React, { useState } from 'react';
import {
  Download,
  Printer,
  Sparkles,
  Mail,
  Building,
  User,
  Calendar,
  RotateCcw
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { useAuth } from '../../context/AuthContext';

export const CoverLetterView: React.FC = () => {
  const { resume } = useResume();
  const { hasActiveSubscription, canDownloadFree } = useAuth();

  const [recipientName, setRecipientName] = useState('Hiring Manager');
  const [recipientCompany, setRecipientCompany] = useState('Acme Corporation');
  const [targetRole, setTargetRole] = useState(resume.personal.jobTitle || 'Senior Software Engineer');
  const [salutation, setSalutation] = useState('Dear');

  const [letterBody, setLetterBody] = useState(
    `I am writing to express my strong interest in the ${
      resume.personal.jobTitle || 'Senior Software Engineer'
    } position at your organization. With a proven record in engineering high-throughput distributed systems and scalable frontends, I am excited about the opportunity to contribute to your engineering milestones.\n\nThroughout my career at ${
      resume.experiences[0]?.company || 'leading tech companies'
    }, I have focused on delivering business value through clean architecture, performance optimization, and pragmatic execution. My technical background in ${resume.skills
      .slice(0, 4)
      .map(s => s.name)
      .join(', ')} aligns directly with the core requirements of this role.\n\nI would welcome the opportunity to discuss how my background, enthusiasm, and technical leadership can support your product roadmap. Thank you for your time and consideration.`
  );

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 no-print">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Cover Letter Generator
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Synchronized with your active resume details ({resume.personal.fullName}).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Settings Panel */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 no-print">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Recipient & Role Settings
          </h2>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Company Name</label>
            <input
              type="text"
              value={recipientCompany}
              onChange={e => setRecipientCompany(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden"
              placeholder="e.g. Google India"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Recipient Name</label>
            <input
              type="text"
              value={recipientName}
              onChange={e => setRecipientName(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden"
              placeholder="e.g. Hiring Team / John Doe"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Target Position</label>
            <input
              type="text"
              value={targetRole}
              onChange={e => setTargetRole(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden"
              placeholder="e.g. Staff Full Stack Engineer"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Letter Body Text</label>
            <textarea
              rows={12}
              value={letterBody}
              onChange={e => setLetterBody(e.target.value)}
              className="w-full p-2.5 text-xs leading-relaxed border border-slate-300 rounded-lg focus:outline-hidden"
            />
          </div>
        </div>

        {/* Right Printable Preview */}
        <div className="lg:col-span-2 flex justify-center">
          <div
            id="resume-print-canvas"
            className="w-full max-w-[700px] bg-white p-8 sm:p-12 rounded-xl shadow-lg border border-slate-200 space-y-6 text-slate-900"
          >
            {/* Candidate Header */}
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-2xl font-bold text-slate-900">{resume.personal.fullName}</h2>
              <div className="text-xs text-indigo-700 font-semibold">{resume.personal.jobTitle}</div>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
                {resume.personal.email && <span>{resume.personal.email}</span>}
                {resume.personal.phone && <span>{resume.personal.phone}</span>}
                {resume.personal.location && <span>{resume.personal.location}</span>}
              </div>
            </div>

            {/* Date & Recipient */}
            <div className="space-y-1 text-xs text-slate-700">
              <div className="font-mono text-slate-500">{todayFormatted}</div>
              <div className="pt-2 font-bold text-slate-900">{recipientName}</div>
              <div className="font-semibold text-slate-700">{recipientCompany}</div>
            </div>

            {/* Salutation */}
            <div className="text-xs font-semibold text-slate-900">
              {salutation} {recipientName},
            </div>

            {/* Letter Content */}
            <div className="text-xs text-slate-700 leading-relaxed space-y-3 whitespace-pre-line text-justify">
              {letterBody}
            </div>

            {/* Sign off */}
            <div className="pt-4 text-xs text-slate-800 space-y-1">
              <div>Sincerely,</div>
              <div className="font-bold text-slate-900 text-sm">{resume.personal.fullName}</div>
              <div className="text-slate-500">{resume.personal.email}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
