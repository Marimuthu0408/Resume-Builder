import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, ChevronDown, ChevronUp, Sparkles, Clock, Target } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';

export const ATSScoreCard: React.FC = () => {
  const { atsAnalysis, totalExperienceYears } = useResume();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 65) return 'text-indigo-600 bg-indigo-50 border-indigo-200';
    if (score >= 45) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  const getBarColor = (score: number) => {
    if (score >= 85) return 'bg-emerald-500';
    if (score >= 65) return 'bg-indigo-500';
    if (score >= 45) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden transition-all">
      {/* Header Summary */}
      <div className="p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg border font-mono tabular-nums ${getScoreColor(
              atsAnalysis.score
            )}`}
          >
            {atsAnalysis.score}%
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">ATS Readiness Score</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                {atsAnalysis.grade}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold text-slate-700">{totalExperienceYears} Yrs</span> Experience
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold text-slate-700">{atsAnalysis.metricsCount}</span> Metrics
              </span>
              <span aria-hidden="true">·</span>
              <span>{atsAnalysis.wordCount} Words</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(prev => !prev)}
          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium"
        >
          <span>{isExpanded ? 'Hide' : 'Audit'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-1.5">
        <div
          className={`h-full transition-all duration-500 ${getBarColor(atsAnalysis.score)}`}
          style={{ width: `${atsAnalysis.score}%` }}
        />
      </div>

      {/* Expanded Checklist */}
      {isExpanded && (
        <div className="p-4 bg-slate-50/70 border-t border-slate-100 space-y-2.5 animate-in fade-in duration-150">
          <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Recruiter & ATS Optimization Checklist
          </div>
          <div className="space-y-2">
            {atsAnalysis.checklist.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 text-xs bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-2xs"
              >
                {item.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-800">{item.label}</div>
                  <div className={`mt-0.5 ${item.passed ? 'text-slate-500' : 'text-amber-700 font-medium'}`}>
                    {item.recommendation}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
