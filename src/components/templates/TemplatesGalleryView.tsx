import React from 'react';
import { Check, Lock, Sparkles, ArrowRight, Eye } from 'lucide-react';
import { TEMPLATE_METADATA } from '../../data/plans';
import { useResume } from '../../context/ResumeContext';
import { useAuth } from '../../context/AuthContext';
import { TemplateId } from '../../types/resume';

interface TemplatesGalleryViewProps {
  onOpenEditor: () => void;
  onOpenUpgradeModal: () => void;
}

export const TemplatesGalleryView: React.FC<TemplatesGalleryViewProps> = ({
  onOpenEditor,
  onOpenUpgradeModal
}) => {
  const { resume, setTemplate } = useResume();
  const { canAccessTemplate, user } = useAuth();

  const handleSelectTemplate = (templateId: string) => {
    if (!canAccessTemplate(templateId)) {
      onOpenUpgradeModal();
      return;
    }
    setTemplate(templateId as TemplateId);
    onOpenEditor();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Recruiter-Tested Resume Templates
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Designed for maximum ATS parsing efficiency and modern aesthetic appeal.
        </p>
      </div>

      {/* Grid of Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {TEMPLATE_METADATA.map(tpl => {
          const isSelected = resume.design.templateId === tpl.id;
          const isLocked = !canAccessTemplate(tpl.id);

          return (
            <div
              key={tpl.id}
              className={`bg-white rounded-2xl border transition-all overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'border-indigo-600 shadow-md ring-2 ring-indigo-500/20'
                  : 'border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              {/* Visual Thumbnail Representation */}
              <div
                onClick={() => handleSelectTemplate(tpl.id)}
                className="h-48 bg-slate-50 border-b border-slate-200 p-4 relative cursor-pointer group flex flex-col justify-between overflow-hidden"
              >
                {/* Mock wireframe of template */}
                <div className="w-full h-full bg-white shadow-xs rounded border border-slate-200 p-2 space-y-1.5 opacity-90 group-hover:scale-102 transition-transform">
                  <div
                    className="h-2 rounded w-1/2"
                    style={{ backgroundColor: isSelected ? resume.design.colorTheme : '#cbd5e1' }}
                  />
                  <div className="h-1 rounded w-1/3 bg-slate-200" />
                  <div className="pt-1 space-y-1">
                    <div className="h-1 rounded w-full bg-slate-100" />
                    <div className="h-1 rounded w-5/6 bg-slate-100" />
                    <div className="h-1 rounded w-4/6 bg-slate-100" />
                  </div>
                  <div className="pt-1 grid grid-cols-3 gap-1">
                    <div className="h-8 rounded bg-slate-50 col-span-2" />
                    <div className="h-8 rounded bg-slate-50" />
                  </div>
                </div>

                {/* Status Badges */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  {isSelected && (
                    <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold shadow-xs">
                      Active
                    </span>
                  )}
                  {isLocked && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-semibold flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" />
                      {tpl.tierRequired}
                    </span>
                  )}
                </div>
              </div>

              {/* Template Info & Action */}
              <div className="p-4 space-y-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">{tpl.name}</h2>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{tpl.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-500">
                    Tier: <span className="capitalize font-semibold text-slate-800">{tpl.tierRequired}</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => handleSelectTemplate(tpl.id)}
                    className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                      isSelected
                        ? 'bg-slate-100 text-slate-800'
                        : isLocked
                        ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        In Use
                      </>
                    ) : isLocked ? (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        Unlock
                      </>
                    ) : (
                      <>Use Template</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
