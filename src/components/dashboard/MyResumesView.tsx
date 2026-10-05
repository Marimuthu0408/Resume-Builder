import React, { useState } from 'react';
import {
  Plus,
  Search,
  Copy,
  Trash2,
  Edit3,
  Download,
  Clock,
  FileText,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { useAuth } from '../../context/AuthContext';

interface MyResumesViewProps {
  onOpenEditor: () => void;
  onTriggerSinglePayment: () => void;
  onOpenUpgradeModal: () => void;
}

export const MyResumesView: React.FC<MyResumesViewProps> = ({
  onOpenEditor,
  onTriggerSinglePayment,
  onOpenUpgradeModal
}) => {
  const { savedResumes, activeResumeId, switchResume, createNewResume, duplicateResume, deleteResume } = useResume();
  const { canDownloadFree, user, hasActiveSubscription, getActivePlanDetails } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const plan = getActivePlanDetails();
  const maxResumes = plan ? plan.maxResumes : 1;
  const isSubscribed = hasActiveSubscription();

  const filteredResumes = savedResumes.filter(
    r =>
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.personal.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.personal.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateNew = () => {
    if (!isSubscribed && savedResumes.length >= 1) {
      alert('Free users can store 1 resume profile. Please upgrade to a Daily/Weekly/Monthly plan to save multiple resumes!');
      onOpenUpgradeModal();
      return;
    }
    createNewResume(newTitle.trim() || 'New Resume Profile');
    setNewTitle('');
    setIsCreating(false);
    onOpenEditor();
  };

  const handleEdit = (id: string) => {
    switchResume(id);
    onOpenEditor();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">My Resumes</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your tailored resume variations ({savedResumes.length} saved).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center gap-1.5 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create New Resume
          </button>
        </div>
      </div>

      {/* Create Modal / Banner if toggled */}
      {isCreating && (
        <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in duration-150">
          <div className="flex-1 w-full sm:w-auto">
            <label className="text-xs font-semibold text-indigo-900 block mb-1">
              Give your new resume variation a title:
            </label>
            <input
              type="text"
              placeholder="e.g. SDE Backend - Fintech or Design Portfolio"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-white border border-indigo-300 rounded-lg focus:outline-hidden"
            />
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => setIsCreating(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateNew}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs"
            >
              Create & Open
            </button>
          </div>
        </div>
      )}

      {/* Filter and Search Toolbar */}
      <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by job title, name, or keywords..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border-0 focus:ring-0 focus:outline-hidden text-slate-800 placeholder:text-slate-400"
          />
        </div>
        <div className="text-xs text-slate-500 px-3 font-mono">
          {filteredResumes.length} {filteredResumes.length === 1 ? 'Resume' : 'Resumes'}
        </div>
      </div>

      {/* Resume Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredResumes.map(r => {
          const isActive = r.id === activeResumeId;

          return (
            <div
              key={r.id}
              className={`bg-white rounded-2xl border transition-all flex flex-col justify-between overflow-hidden ${
                isActive
                  ? 'border-indigo-600 shadow-md ring-1 ring-indigo-500/20'
                  : 'border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 block mb-0.5">
                      Template: {r.design.templateId}
                    </span>
                    <h2 className="text-base font-bold text-slate-900 truncate">{r.title}</h2>
                    <p className="text-xs text-slate-600 mt-0.5 truncate">{r.personal.fullName} · {r.personal.jobTitle}</p>
                  </div>
                  {isActive && (
                    <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-200 shrink-0">
                      Active
                    </span>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Clock className="w-3 h-3 text-slate-400" />
                    Updated {new Date(r.updatedAt).toLocaleDateString()}
                  </span>
                  <span className="text-[11px]">
                    {r.experiences.length} exp · {r.skills.length} skills
                  </span>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(r.id)}
                  className="inline-flex items-center gap-1.5 py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit Studio
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => duplicateResume(r.id)}
                    className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200"
                    title="Duplicate Resume"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  {savedResumes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete "${r.title}"?`)) {
                          deleteResume(r.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Resume"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
