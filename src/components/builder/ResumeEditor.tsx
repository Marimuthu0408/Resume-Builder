import React, { useState } from 'react';
import {
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderGit2,
  Award,
  Globe,
  Sliders,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Lock,
  Upload,
  ArrowUp,
  ArrowDown,
  Check,
  Search
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { useAuth } from '../../context/AuthContext';
import { AI_BULLET_SUGGESTIONS, POPULAR_SKILLS } from '../../data/initialData';
import { TEMPLATE_METADATA, COLOR_PALETTES, FONT_OPTIONS } from '../../data/plans';
import { TemplateId, FontId, Skill, Language, ResumeDesign } from '../../types/resume';

interface ResumeEditorProps {
  onOpenUpgradeModal: () => void;
}

export const ResumeEditor: React.FC<ResumeEditorProps> = ({ onOpenUpgradeModal }) => {
  const {
    resume,
    updatePersonal,
    addExperience,
    updateExperience,
    deleteExperience,
    addHighlight,
    updateHighlight,
    deleteHighlight,
    addEducation,
    updateEducation,
    deleteEducation,
    addSkill,
    updateSkill,
    deleteSkill,
    addProject,
    updateProject,
    deleteProject,
    addCertification,
    updateCertification,
    deleteCertification,
    addLanguage,
    updateLanguage,
    deleteLanguage,
    addCustomSection,
    updateCustomSectionTitle,
    addCustomSectionItem,
    updateCustomSectionItem,
    deleteCustomSectionItem,
    deleteCustomSection,
    updateDesign,
    setTemplate
  } = useResume();

  const { canAccessTemplate, hasActiveSubscription, getActivePlanDetails } = useAuth();
  const activePlan = getActivePlanDetails();

  const [activeTab, setActiveTab] = useState<
    'contact' | 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'more' | 'design'
  >('contact');

  // Bullet point helper state
  const [bulletHelperExpId, setBulletHelperExpId] = useState<string | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<string>('Software & IT');

  // Skill filter
  const [skillSearch, setSkillSearch] = useState<string>('');

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size exceeds 2MB limit. Please choose a smaller photo.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        updatePersonal({ photoUrl: reader.result as string });
        updateDesign({ showPhoto: true });
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    updatePersonal({ photoUrl: '' });
    updateDesign({ showPhoto: false });
  };

  // Section reordering
  const moveSection = (direction: 'up' | 'down', index: number) => {
    const currentOrder = [...resume.design.sectionOrder];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentOrder.length) return;
    const temp = currentOrder[index];
    currentOrder[index] = currentOrder[targetIndex];
    currentOrder[targetIndex] = temp;
    updateDesign({ sectionOrder: currentOrder });
  };

  const sectionLabels: Record<string, string> = {
    personal: 'Personal & Contact',
    experiences: 'Work Experience',
    education: 'Education',
    skills: 'Skills & Tools',
    projects: 'Projects',
    certifications: 'Certifications',
    languages: 'Languages',
    custom: 'Additional Sections'
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-full overflow-hidden">
      {/* Tab Navigation */}
      <div className="border-b border-slate-200 bg-slate-50/70 p-2 overflow-x-auto flex items-center gap-1.5 scrollbar-thin">
        <button
          onClick={() => setActiveTab('contact')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'contact' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          Contact
        </button>
        <button
          onClick={() => setActiveTab('summary')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'summary' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Summary
        </button>
        <button
          onClick={() => setActiveTab('experience')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'experience' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          Experience ({resume.experiences.length})
        </button>
        <button
          onClick={() => setActiveTab('education')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'education' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          Education ({resume.education.length})
        </button>
        <button
          onClick={() => setActiveTab('skills')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'skills' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Wrench className="w-3.5 h-3.5" />
          Skills ({resume.skills.length})
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'projects' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FolderGit2 className="w-3.5 h-3.5" />
          Projects ({resume.projects.length})
        </button>
        <button
          onClick={() => setActiveTab('more')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'more' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          More Sections
        </button>
        <button
          onClick={() => setActiveTab('design')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'design' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          Template & Design
        </button>
      </div>

      {/* Editor Body */}
      <div className="p-5 flex-1 overflow-y-auto space-y-6">
        {/* ===================== TAB 1: CONTACT ===================== */}
        {activeTab === 'contact' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Personal & Contact Information</h3>
                <p className="text-xs text-slate-500">Provide direct recruiter contact channels.</p>
              </div>
            </div>

            {/* Photo Upload Area */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {resume.personal.photoUrl ? (
                  <img
                    src={resume.personal.photoUrl}
                    alt="Uploaded Profile"
                    className="w-12 h-12 rounded-full object-cover border border-slate-300"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-400">
                    <User className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <div className="text-xs font-semibold text-slate-800">Profile Photo (Optional)</div>
                  <div className="text-[11px] text-slate-500">JPG, PNG under 2MB</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label className="cursor-pointer py-1.5 px-3 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-xs font-medium text-slate-700 transition-colors inline-flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{resume.personal.photoUrl ? 'Change' : 'Upload'}</span>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
                {resume.personal.photoUrl && (
                  <button
                    onClick={removePhoto}
                    className="py-1.5 px-2 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-medium transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={resume.personal.fullName}
                  onChange={e => updatePersonal({ fullName: e.target.value })}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Professional Target Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={resume.personal.jobTitle}
                  onChange={e => updatePersonal({ jobTitle: e.target.value })}
                  placeholder="e.g. Senior Full Stack Engineer"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  value={resume.personal.email}
                  onChange={e => updatePersonal({ email: e.target.value })}
                  placeholder="e.g. aarav@example.com"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={resume.personal.phone}
                  onChange={e => updatePersonal({ phone: e.target.value })}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Location (City, Country) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={resume.personal.location}
                  onChange={e => updatePersonal({ location: e.target.value })}
                  placeholder="e.g. Bengaluru, India"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Personal Portfolio / Website</label>
                <input
                  type="text"
                  value={resume.personal.website}
                  onChange={e => updatePersonal({ website: e.target.value })}
                  placeholder="e.g. https://portfolio.dev"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">LinkedIn Profile</label>
                <input
                  type="text"
                  value={resume.personal.linkedin}
                  onChange={e => updatePersonal({ linkedin: e.target.value })}
                  placeholder="e.g. linkedin.com/in/username"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">GitHub / Code Repository</label>
                <input
                  type="text"
                  value={resume.personal.github}
                  onChange={e => updatePersonal({ github: e.target.value })}
                  placeholder="e.g. github.com/username"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 2: SUMMARY ===================== */}
        {activeTab === 'summary' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Executive & Professional Summary</h3>
                <p className="text-xs text-slate-500">2-4 high-impact sentences highlighting career value proposition.</p>
              </div>
              <div className="text-xs font-mono text-slate-400">
                {resume.personal.summary.length} characters
              </div>
            </div>

            <div>
              <textarea
                rows={5}
                value={resume.personal.summary}
                onChange={e => updatePersonal({ summary: e.target.value })}
                placeholder="High-impact Software Engineer with 5+ years of experience architecting distributed systems..."
                className="w-full p-3 text-xs leading-relaxed border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            {/* Quick Summary templates */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                Quick Summary Starter Inspirations
              </div>
              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    updatePersonal({
                      summary:
                        'Results-oriented Full Stack Engineer with 4+ years of expertise in high-concurrency Node.js and React architectures. Adept at scaling microservices, accelerating delivery velocity by 35%, and partnering with cross-functional leadership.'
                    })
                  }
                  className="text-left p-2.5 bg-white border border-slate-200 rounded-lg hover:border-indigo-300 transition-colors text-xs text-slate-600 hover:text-slate-900"
                >
                  <span className="font-semibold text-indigo-700 block mb-0.5">Software Engineering Template</span>
                  Results-oriented Full Stack Engineer with 4+ years of expertise in high-concurrency Node.js and React...
                </button>
                <button
                  type="button"
                  onClick={() =>
                    updatePersonal({
                      summary:
                        'Strategic Product Manager with proven track record launching B2B SaaS features from 0 to 1, driving a 28% increase in activation metrics and retaining ₹1.2M in annual recurring revenue through data-backed user research.'
                    })
                  }
                  className="text-left p-2.5 bg-white border border-slate-200 rounded-lg hover:border-indigo-300 transition-colors text-xs text-slate-600 hover:text-slate-900"
                >
                  <span className="font-semibold text-indigo-700 block mb-0.5">Product Management Template</span>
                  Strategic Product Manager with proven track record launching B2B SaaS features from 0 to 1...
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 3: WORK EXPERIENCE ===================== */}
        {activeTab === 'experience' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Work Experience & Roles</h3>
                <p className="text-xs text-slate-500">List chronological positions with measurable bullet achievements.</p>
              </div>
              <button
                type="button"
                onClick={addExperience}
                className="inline-flex items-center gap-1.5 py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Position
              </button>
            </div>

            {resume.experiences.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Briefcase className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-600">No work experience added yet.</p>
                <button
                  onClick={addExperience}
                  className="mt-3 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  + Add First Position
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {resume.experiences.map((exp, index) => (
                  <div
                    key={exp.id}
                    className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Position #{index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => deleteExperience(exp.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors"
                        title="Delete position"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">Job Title</label>
                        <input
                          type="text"
                          value={exp.jobTitle}
                          onChange={e => updateExperience(exp.id, { jobTitle: e.target.value })}
                          placeholder="e.g. Senior Software Engineer"
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">Company / Organization</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={e => updateExperience(exp.id, { company: e.target.value })}
                          placeholder="e.g. Flipkart"
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">Location</label>
                        <input
                          type="text"
                          value={exp.location}
                          onChange={e => updateExperience(exp.id, { location: e.target.value })}
                          placeholder="e.g. Bengaluru, India"
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] font-semibold text-slate-600 block mb-1">Start Date</label>
                          <input
                            type="text"
                            value={exp.startDate}
                            onChange={e => updateExperience(exp.id, { startDate: e.target.value })}
                            placeholder="e.g. 2021-06"
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                            {exp.isCurrent ? 'Present' : 'End Date'}
                          </label>
                          <input
                            type="text"
                            disabled={exp.isCurrent}
                            value={exp.isCurrent ? 'Present' : exp.endDate}
                            onChange={e => updateExperience(exp.id, { endDate: e.target.value })}
                            placeholder="e.g. 2023-12"
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-hidden disabled:bg-slate-100 disabled:text-slate-400"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-0.5">
                      <input
                        type="checkbox"
                        id={`current-${exp.id}`}
                        checked={exp.isCurrent}
                        onChange={e => updateExperience(exp.id, { isCurrent: e.target.checked })}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                      />
                      <label htmlFor={`current-${exp.id}`} className="text-xs text-slate-600 select-none cursor-pointer">
                        I currently work in this role
                      </label>
                    </div>

                    {/* Bullet Points */}
                    <div className="space-y-2 pt-2 border-t border-slate-200">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-slate-700">Accomplishment Bullet Points</label>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setBulletHelperExpId(bulletHelperExpId === exp.id ? null : exp.id)}
                            className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                          >
                            <Sparkles className="w-3 h-3" />
                            Suggest Pro Bullets
                          </button>
                          <button
                            type="button"
                            onClick={() => addHighlight(exp.id)}
                            className="text-[11px] font-semibold text-slate-600 hover:text-slate-900"
                          >
                            + Add Bullet
                          </button>
                        </div>
                      </div>

                      {/* Pro Bullets Inserter Dropdown */}
                      {bulletHelperExpId === exp.id && (
                        <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-indigo-900 flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                              Select Industry Bullet to Insert:
                            </span>
                            <div className="flex gap-1">
                              {Object.keys(AI_BULLET_SUGGESTIONS).map(cat => (
                                <button
                                  key={cat}
                                  type="button"
                                  onClick={() => setSelectedDomain(cat)}
                                  className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                    selectedDomain === cat
                                      ? 'bg-indigo-600 text-white'
                                      : 'bg-white text-indigo-700 border border-indigo-200'
                                  }`}
                                >
                                  {cat}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                            {AI_BULLET_SUGGESTIONS[selectedDomain]?.map((bullet, bIdx) => (
                              <div
                                key={bIdx}
                                className="p-2 bg-white rounded-lg border border-indigo-100 flex items-start justify-between gap-2 hover:border-indigo-300 transition-colors"
                              >
                                <span className="text-[11px] text-slate-700 leading-normal">{bullet}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    addHighlight(exp.id, bullet);
                                    setBulletHelperExpId(null);
                                  }}
                                  className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[10px] font-semibold shrink-0"
                                >
                                  Use
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {exp.highlights.map((hl, hlIdx) => (
                        <div key={hlIdx} className="flex items-start gap-2">
                          <span className="text-slate-400 mt-2 text-xs">•</span>
                          <textarea
                            rows={2}
                            value={hl}
                            onChange={e => updateHighlight(exp.id, hlIdx, e.target.value)}
                            placeholder="Architected high-throughput service reducing latency by 40%..."
                            className="flex-1 p-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                          />
                          <button
                            type="button"
                            onClick={() => deleteHighlight(exp.id, hlIdx)}
                            className="text-slate-400 hover:text-rose-500 p-1.5 rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB 4: EDUCATION ===================== */}
        {activeTab === 'education' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Academic & Educational Credentials</h3>
                <p className="text-xs text-slate-500">Degree, university, graduation year, and score/CGPA.</p>
              </div>
              <button
                type="button"
                onClick={addEducation}
                className="inline-flex items-center gap-1.5 py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Degree
              </button>
            </div>

            <div className="space-y-3">
              {resume.education.map((edu, index) => (
                <div key={edu.id} className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Degree #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => deleteEducation(edu.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Degree Title</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={e => updateEducation(edu.id, { degree: e.target.value })}
                        placeholder="e.g. Bachelor of Technology (B.Tech)"
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Field of Study / Major</label>
                      <input
                        type="text"
                        value={edu.fieldOfStudy}
                        onChange={e => updateEducation(edu.id, { fieldOfStudy: e.target.value })}
                        placeholder="e.g. Computer Science and Engineering"
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Institution / University</label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={e => updateEducation(edu.id, { institution: e.target.value })}
                        placeholder="e.g. IIT Delhi"
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">Graduation Year</label>
                        <input
                          type="text"
                          value={edu.endDate}
                          onChange={e => updateEducation(edu.id, { endDate: e.target.value })}
                          placeholder="e.g. 2022"
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">Score / CGPA</label>
                        <input
                          type="text"
                          value={edu.score}
                          onChange={e => updateEducation(edu.id, { score: e.target.value })}
                          placeholder="e.g. 8.9 CGPA / 85%"
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB 5: SKILLS ===================== */}
        {activeTab === 'skills' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Skills & Tech Stack</h3>
                <p className="text-xs text-slate-500">Crucial for automated ATS keyword filters and search algorithms.</p>
              </div>
            </div>

            {/* Popular Skills Quick Add */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="text-xs font-semibold text-slate-700 block">Click to Add Common In-Demand Skills:</span>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_SKILLS.map(skill => {
                  const alreadyAdded = resume.skills.some(s => s.name.toLowerCase() === skill.toLowerCase());
                  return (
                    <button
                      key={skill}
                      type="button"
                      disabled={alreadyAdded}
                      onClick={() => addSkill(skill, 'technical', 4)}
                      className={`text-xs px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 ${
                        alreadyAdded
                          ? 'bg-slate-200 text-slate-400 cursor-default'
                          : 'bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-300'
                      }`}
                    >
                      {alreadyAdded && <Check className="w-3 h-3 text-emerald-600" />}
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Manual Skill Input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type custom skill and press Add (e.g. Redux Toolkit, Go, Figma)"
                value={skillSearch}
                onChange={e => setSkillSearch(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill(skillSearch);
                    setSkillSearch('');
                  }
                }}
                className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={() => {
                  addSkill(skillSearch);
                  setSkillSearch('');
                }}
                className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs"
              >
                + Add
              </button>
            </div>

            {/* Current Skills List */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-semibold text-slate-700 block">
                Active Skills ({resume.skills.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {resume.skills.map(sk => (
                  <div
                    key={sk.id}
                    className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-semibold text-slate-800 block truncate">{sk.name}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <select
                          value={sk.category}
                          onChange={e =>
                            updateSkill(sk.id, { category: e.target.value as Skill['category'] })
                          }
                          className="text-[10px] bg-white border border-slate-300 rounded px-1.5 py-0.5 text-slate-600"
                        >
                          <option value="technical">Technical</option>
                          <option value="tools">Tools/Cloud</option>
                          <option value="soft">Soft Skill</option>
                          <option value="languages">Languages</option>
                        </select>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteSkill(sk.id)}
                      className="text-slate-400 hover:text-rose-500 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 6: PROJECTS ===================== */}
        {activeTab === 'projects' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Featured Technical Projects</h3>
                <p className="text-xs text-slate-500">Showcase real github repositories and live deployments.</p>
              </div>
              <button
                type="button"
                onClick={addProject}
                className="inline-flex items-center gap-1.5 py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Project
              </button>
            </div>

            <div className="space-y-3">
              {resume.projects.map((proj, idx) => (
                <div key={proj.id} className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Project #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => deleteProject(proj.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Project Name</label>
                      <input
                        type="text"
                        value={proj.title}
                        onChange={e => updateProject(proj.id, { title: e.target.value })}
                        placeholder="e.g. Realtime Analytics Pipeline"
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        Tech Stack (comma separated)
                      </label>
                      <input
                        type="text"
                        value={proj.techStack.join(', ')}
                        onChange={e =>
                          updateProject(proj.id, {
                            techStack: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                          })
                        }
                        placeholder="e.g. Go, Docker, PostgreSQL, React"
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Live URL / Demo Link</label>
                      <input
                        type="text"
                        value={proj.link}
                        onChange={e => updateProject(proj.id, { link: e.target.value })}
                        placeholder="e.g. https://project-demo.com"
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">GitHub / Source Link</label>
                      <input
                        type="text"
                        value={proj.github}
                        onChange={e => updateProject(proj.id, { github: e.target.value })}
                        placeholder="e.g. github.com/user/project"
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Project Summary</label>
                    <textarea
                      rows={2}
                      value={proj.description}
                      onChange={e => updateProject(proj.id, { description: e.target.value })}
                      placeholder="Engineered fault-tolerant message queue servicing 50k msgs/sec..."
                      className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB 7: MORE SECTIONS ===================== */}
        {activeTab === 'more' && (
          <div className="space-y-5">
            <div className="pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Certifications, Languages & Achievements</h3>
              <p className="text-xs text-slate-500">Add industry credentials, spoken languages, and custom awards.</p>
            </div>

            {/* Certifications */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Certifications ({resume.certifications.length})
                </span>
                <button
                  type="button"
                  onClick={addCertification}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  + Add Certificate
                </button>
              </div>

              {resume.certifications.map(cert => (
                <div key={cert.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-700">Certificate</span>
                    <button
                      type="button"
                      onClick={() => deleteCertification(cert.id)}
                      className="text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={cert.name}
                      onChange={e => updateCertification(cert.id, { name: e.target.value })}
                      placeholder="Certificate Name (e.g. AWS Solutions Architect)"
                      className="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden"
                    />
                    <input
                      type="text"
                      value={cert.issuer}
                      onChange={e => updateCertification(cert.id, { issuer: e.target.value })}
                      placeholder="Issuer (e.g. Amazon Web Services)"
                      className="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Languages */}
            <div className="space-y-3 pt-3 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Languages ({resume.languages.length})
                </span>
                <button
                  type="button"
                  onClick={() => addLanguage()}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  + Add Language
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {resume.languages.map(lang => (
                  <div
                    key={lang.id}
                    className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-2"
                  >
                    <input
                      type="text"
                      value={lang.name}
                      onChange={e => updateLanguage(lang.id, { name: e.target.value })}
                      placeholder="Language (e.g. English)"
                      className="px-2 py-1 text-xs bg-white border border-slate-300 rounded flex-1 focus:outline-hidden"
                    />
                    <select
                      value={lang.proficiency}
                      onChange={e =>
                        updateLanguage(lang.id, { proficiency: e.target.value as Language['proficiency'] })
                      }
                      className="text-xs bg-white border border-slate-300 rounded px-2 py-1"
                    >
                      <option value="Native">Native</option>
                      <option value="Fluent">Fluent</option>
                      <option value="Professional">Professional</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Basic">Basic</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => deleteLanguage(lang.id)}
                      className="text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Section */}
            <div className="space-y-3 pt-3 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Custom Achievements & Honors
                </span>
                <button
                  type="button"
                  onClick={() => addCustomSection('Honors & Awards')}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  + Add Custom Section
                </button>
              </div>

              {resume.customSections.map(sec => (
                <div key={sec.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={sec.title}
                      onChange={e => updateCustomSectionTitle(sec.id, e.target.value)}
                      className="text-xs font-bold text-slate-800 bg-white border border-slate-300 rounded px-2 py-1"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => addCustomSectionItem(sec.id)}
                        className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        + Add Item
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteCustomSection(sec.id)}
                        className="text-slate-400 hover:text-rose-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {sec.items.map(item => (
                    <div key={item.id} className="p-2 bg-white rounded border border-slate-200 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <input
                          type="text"
                          value={item.title}
                          onChange={e => updateCustomSectionItem(sec.id, item.id, { title: e.target.value })}
                          placeholder="Title / Recognition"
                          className="w-full text-xs font-semibold text-slate-700 border-b border-slate-200 pb-0.5 focus:outline-hidden"
                        />
                        <button
                          type="button"
                          onClick={() => deleteCustomSectionItem(sec.id, item.id)}
                          className="text-slate-400 hover:text-rose-500 ml-2"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={item.description}
                        onChange={e => updateCustomSectionItem(sec.id, item.id, { description: e.target.value })}
                        placeholder="Description of honor..."
                        className="w-full text-xs text-slate-600 focus:outline-hidden"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB 8: DESIGN & TEMPLATES ===================== */}
        {activeTab === 'design' && (
          <div className="space-y-6">
            <div className="pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Visual Templates & Design Controls</h3>
              <p className="text-xs text-slate-500">
                Choose template layouts, curated typography, and accent colors.
              </p>
            </div>

            {/* Template Selector */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Choose Resume Layout Template
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {TEMPLATE_METADATA.map(tpl => {
                  const isLocked = !canAccessTemplate(tpl.id);
                  const isSelected = resume.design.templateId === tpl.id;

                  return (
                    <div
                      key={tpl.id}
                      onClick={() => {
                        if (isLocked) {
                          onOpenUpgradeModal();
                        } else {
                          setTemplate(tpl.id as TemplateId);
                        }
                      }}
                      className={`relative p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      {isLocked && (
                        <div className="absolute top-2 right-2 p-1 bg-amber-100 text-amber-800 rounded-md">
                          <Lock className="w-3 h-3" />
                        </div>
                      )}
                      <div className="text-xs font-bold text-slate-900 mb-1">{tpl.name}</div>
                      <div className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">
                        {tpl.description}
                      </div>
                      <div className="mt-2 text-[10px] font-semibold">
                        {isLocked ? (
                          <span className="text-amber-700">Requires {tpl.tierRequired} plan</span>
                        ) : (
                          <span className="text-emerald-600">Available</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Color Theme Selector */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Primary Accent Color
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {COLOR_PALETTES.map(color => (
                  <button
                    key={color.hex}
                    type="button"
                    onClick={() => updateDesign({ colorTheme: color.hex })}
                    className={`w-7 h-7 rounded-full transition-transform flex items-center justify-center ${
                      resume.design.colorTheme === color.hex ? 'scale-110 ring-2 ring-offset-2 ring-indigo-500' : ''
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {resume.design.colorTheme === color.hex && (
                      <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                    )}
                  </button>
                ))}
                {/* Custom Color Input */}
                <label className="cursor-pointer text-xs flex items-center gap-1.5 px-2.5 py-1 border border-slate-300 rounded-lg bg-white hover:bg-slate-50">
                  <span className="text-[11px] font-medium text-slate-600">Custom</span>
                  <input
                    type="color"
                    value={resume.design.colorTheme}
                    onChange={e => updateDesign({ colorTheme: e.target.value })}
                    className="w-5 h-5 rounded cursor-pointer border-0 p-0"
                  />
                </label>
              </div>
            </div>

            {/* Font Pairings */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Typography & Font Family
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {FONT_OPTIONS.map(font => (
                  <button
                    key={font.id}
                    type="button"
                    onClick={() => updateDesign({ fontId: font.id as FontId })}
                    className={`p-2.5 rounded-lg border text-left transition-colors ${
                      resume.design.fontId === font.id
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs">{font.name}</div>
                    <div className="text-[10px] text-slate-500 font-normal">{font.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Spacing & Margins */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200">
              <div>
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1">
                  Page Margins
                </label>
                <select
                  value={resume.design.margins}
                  onChange={e => updateDesign({ margins: e.target.value as ResumeDesign['margins'] })}
                  className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2"
                >
                  <option value="compact">Compact (Fit more content)</option>
                  <option value="normal">Standard A4 Margins</option>
                  <option value="relaxed">Relaxed (Airy spacing)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1">
                  Line Density
                </label>
                <select
                  value={resume.design.lineSpacing}
                  onChange={e => updateDesign({ lineSpacing: e.target.value as ResumeDesign['lineSpacing'] })}
                  className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2"
                >
                  <option value="compact">Tight (1-Page target)</option>
                  <option value="normal">Standard Balanced</option>
                  <option value="relaxed">Roomy</option>
                </select>
              </div>
            </div>

            {/* Section Reordering */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Section Display Order
                </span>
                <span className="text-[11px] text-slate-500">Move sections up/down to reorder</span>
              </div>
              <div className="space-y-1.5">
                {resume.design.sectionOrder.map((secKey, index) => (
                  <div
                    key={secKey}
                    className="p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs font-medium text-slate-700"
                  >
                    <span>{sectionLabels[secKey] || secKey}</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => moveSection('up', index)}
                        className="p-1 hover:bg-white rounded disabled:opacity-30 text-slate-600"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={index === resume.design.sectionOrder.length - 1}
                        onClick={() => moveSection('down', index)}
                        className="p-1 hover:bg-white rounded disabled:opacity-30 text-slate-600"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
