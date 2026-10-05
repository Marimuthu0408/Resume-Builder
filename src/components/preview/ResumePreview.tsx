import React, { useRef, useState } from 'react';
import {
  Download,
  Printer,
  FileJson,
  RotateCcw,
  Sparkles,
  Lock,
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Github,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { useAuth } from '../../context/AuthContext';
import { TemplateId, FontId } from '../../types/resume';

interface ResumePreviewProps {
  onTriggerSinglePayment: () => void;
  onOpenUpgradeModal: () => void;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({
  onTriggerSinglePayment,
  onOpenUpgradeModal
}) => {
  const { resume, loadSampleData, exportResumeJSON } = useResume();
  const { hasActiveSubscription, user, consumeSingleDownload } = useAuth();
  const [zoomScale, setZoomScale] = useState<number>(100);

  const isSubscribed = hasActiveSubscription();
  const hasDownloadCredit = user.singleDownloadsBalance > 0;
  const canDownloadFree = isSubscribed || hasDownloadCredit;

  // Font class resolver
  const getFontClass = (fontId: FontId) => {
    switch (fontId) {
      case 'serif':
        return 'font-serif-custom';
      case 'mono':
        return 'font-mono-custom';
      case 'display':
        return 'font-display-custom';
      default:
        return 'font-sans-custom';
    }
  };

  // Margins class resolver
  const getMarginClass = () => {
    switch (resume.design.margins) {
      case 'compact':
        return 'p-6 sm:p-8';
      case 'relaxed':
        return 'p-10 sm:p-14';
      default:
        return 'p-8 sm:p-10';
    }
  };

  // Spacing class resolver
  const getSpacingClass = () => {
    switch (resume.design.lineSpacing) {
      case 'compact':
        return 'space-y-3';
      case 'relaxed':
        return 'space-y-6';
      default:
        return 'space-y-4';
    }
  };

  const handleDownloadClick = () => {
    if (canDownloadFree) {
      if (!isSubscribed && hasDownloadCredit) {
        consumeSingleDownload();
      }
      window.print();
    } else {
      onTriggerSinglePayment();
    }
  };

  const accentColor = resume.design.colorTheme || '#1E40AF';

  return (
    <div className="flex flex-col h-full bg-slate-100/80 rounded-2xl border border-slate-200 overflow-hidden">
      {/* Top Preview Action Bar */}
      <div className="bg-white px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2.5 no-print">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-800">Live Preview (A4)</span>
          {!isSubscribed && (
            <span className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md font-medium">
              Free Mode · ₹5 to Download
            </span>
          )}
          {isSubscribed && (
            <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md font-medium">
              Pro Unlimited Downloads
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-100 rounded-lg p-0.5 border border-slate-200">
            <button
              onClick={() => setZoomScale(prev => Math.max(70, prev - 10))}
              className="p-1 text-slate-600 hover:text-slate-900 rounded"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-1 text-slate-600 tabular-nums">{zoomScale}%</span>
            <button
              onClick={() => setZoomScale(prev => Math.min(130, prev + 10))}
              className="p-1 text-slate-600 hover:text-slate-900 rounded"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={loadSampleData}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg text-xs font-medium transition-colors"
            title="Reload Sample Data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={exportResumeJSON}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg text-xs font-medium transition-colors"
            title="Export JSON Data"
          >
            <FileJson className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => window.print()}
            className="hidden sm:inline-flex items-center gap-1.5 py-1.5 px-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            Print
          </button>

          {/* Primary Download Button */}
          <button
            onClick={handleDownloadClick}
            className="inline-flex items-center gap-1.5 py-1.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs hover:shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{canDownloadFree ? 'Download PDF' : 'Download (₹5)'}</span>
          </button>
        </div>
      </div>

      {/* Preview Scroll Canvas */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center items-start">
        <div
          id="resume-print-canvas"
          style={{
            transform: `scale(${zoomScale / 100})`,
            transformOrigin: 'top center'
          }}
          className={`w-full max-w-[800px] min-h-[1050px] bg-white text-slate-900 shadow-xl border border-slate-200/80 transition-transform relative ${getFontClass(
            resume.design.fontId
          )} ${getMarginClass()} ${getSpacingClass()}`}
        >
          {/* Watermark for non-subscribed users without download credits */}
          {!canDownloadFree && (
            <div className="absolute top-2 right-4 text-[10px] text-slate-400 select-none uppercase tracking-wider font-mono no-print">
              CVForge Free Preview · Pay ₹5 or Subscribe to Download
            </div>
          )}

          {/* Render Active Template Content */}
          {renderTemplateLayout(resume, accentColor)}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// RENDER TEMPLATES
// ==========================================
function renderTemplateLayout(resume: ReturnType<typeof useResume>['resume'], accentColor: string) {
  const { personal, experiences, education, skills, projects, certifications, languages, customSections, design } =
    resume;

  // 1. MODERN EXECUTIVE TEMPLATE (Clean side column or modern header accent)
  if (design.templateId === 'modern') {
    return (
      <div className="space-y-6">
        {/* Header with Color Accent Bar */}
        <div className="border-b-2 pb-4" style={{ borderColor: accentColor }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                {personal.fullName}
              </h1>
              <p className="text-sm font-semibold mt-1" style={{ color: accentColor }}>
                {personal.jobTitle}
              </p>
            </div>
            {design.showPhoto && personal.photoUrl && (
              <img
                src={personal.photoUrl}
                alt={personal.fullName}
                className="w-16 h-16 rounded-lg object-cover border-2 shadow-xs shrink-0"
                style={{ borderColor: accentColor }}
              />
            )}
          </div>

          {/* Contact Bar */}
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
            {personal.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3 text-slate-400" />
                {personal.email}
              </span>
            )}
            {personal.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" />
                {personal.phone}
              </span>
            )}
            {personal.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                {personal.location}
              </span>
            )}
            {personal.website && (
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3 text-slate-400" />
                {personal.website.replace(/^https?:\/\//, '')}
              </span>
            )}
            {personal.linkedin && (
              <span className="flex items-center gap-1">
                <Linkedin className="w-3 h-3 text-slate-400" />
                {personal.linkedin}
              </span>
            )}
            {personal.github && (
              <span className="flex items-center gap-1">
                <Github className="w-3 h-3 text-slate-400" />
                {personal.github}
              </span>
            )}
          </div>
        </div>

        {/* Summary */}
        {personal.summary && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Professional Summary
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed text-justify">{personal.summary}</p>
          </div>
        )}

        {/* Grid 2-columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Experience Column (2 cols) */}
          <div className="md:col-span-2 space-y-5">
            {experiences.length > 0 && (
              <div>
                <h2
                  className="text-xs font-bold uppercase tracking-wider mb-3 pb-1 border-b"
                  style={{ borderColor: `${accentColor}40`, color: accentColor }}
                >
                  Work Experience
                </h2>
                <div className="space-y-4">
                  {experiences.map(exp => (
                    <div key={exp.id} className="space-y-1">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs font-bold text-slate-900">{exp.jobTitle}</span>
                        <span className="text-[11px] font-mono text-slate-500">
                          {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                        </span>
                      </div>
                      <div className="text-xs font-medium text-slate-600">
                        {exp.company} {exp.location ? `· ${exp.location}` : ''}
                      </div>
                      <ul className="list-disc list-outside ml-3.5 space-y-1 text-xs text-slate-700 pt-1 leading-normal">
                        {exp.highlights.map((hl, i) => (
                          <li key={i}>{hl}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {projects.length > 0 && (
              <div>
                <h2
                  className="text-xs font-bold uppercase tracking-wider mb-3 pb-1 border-b"
                  style={{ borderColor: `${accentColor}40`, color: accentColor }}
                >
                  Key Projects
                </h2>
                <div className="space-y-3">
                  {projects.map(p => (
                    <div key={p.id} className="space-y-1">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs font-bold text-slate-900">{p.title}</span>
                        {p.link && (
                          <a
                            href={p.link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] text-indigo-600 hover:underline"
                          >
                            Live Demo ↗
                          </a>
                        )}
                      </div>
                      <p className="text-xs text-slate-700 leading-normal">{p.description}</p>
                      {p.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-0.5">
                          {p.techStack.map((tech, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-100 rounded text-slate-700"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Column (1 col): Education, Skills, Certs */}
          <div className="space-y-5">
            {skills.length > 0 && (
              <div>
                <h2
                  className="text-xs font-bold uppercase tracking-wider mb-2.5 pb-1 border-b"
                  style={{ borderColor: `${accentColor}40`, color: accentColor }}
                >
                  Core Skills
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map(sk => (
                    <span
                      key={sk.id}
                      className="text-xs px-2 py-0.5 rounded-md font-medium"
                      style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
                    >
                      {sk.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {education.length > 0 && (
              <div>
                <h2
                  className="text-xs font-bold uppercase tracking-wider mb-2.5 pb-1 border-b"
                  style={{ borderColor: `${accentColor}40`, color: accentColor }}
                >
                  Education
                </h2>
                <div className="space-y-2.5">
                  {education.map(edu => (
                    <div key={edu.id} className="text-xs">
                      <div className="font-bold text-slate-900">{edu.degree}</div>
                      <div className="text-slate-700">{edu.fieldOfStudy}</div>
                      <div className="text-slate-500">{edu.institution}</div>
                      <div className="text-[11px] font-mono text-slate-500">
                        {edu.endDate} {edu.score ? `· ${edu.score}` : ''}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {certifications.length > 0 && (
              <div>
                <h2
                  className="text-xs font-bold uppercase tracking-wider mb-2.5 pb-1 border-b"
                  style={{ borderColor: `${accentColor}40`, color: accentColor }}
                >
                  Certifications
                </h2>
                <div className="space-y-2 text-xs">
                  {certifications.map(c => (
                    <div key={c.id}>
                      <div className="font-semibold text-slate-800">{c.name}</div>
                      <div className="text-[11px] text-slate-500">
                        {c.issuer} ({c.issueDate})
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {languages.length > 0 && (
              <div>
                <h2
                  className="text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b"
                  style={{ borderColor: `${accentColor}40`, color: accentColor }}
                >
                  Languages
                </h2>
                <div className="space-y-1 text-xs">
                  {languages.map(l => (
                    <div key={l.id} className="flex justify-between">
                      <span className="text-slate-800 font-medium">{l.name}</span>
                      <span className="text-slate-500 text-[11px]">{l.proficiency}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Custom Section */}
        {customSections.length > 0 && (
          <div className="pt-2">
            {customSections.map(sec => (
              <div key={sec.id} className="space-y-2">
                <h2
                  className="text-xs font-bold uppercase tracking-wider pb-1 border-b"
                  style={{ borderColor: `${accentColor}40`, color: accentColor }}
                >
                  {sec.title}
                </h2>
                <div className="space-y-2">
                  {sec.items.map(item => (
                    <div key={item.id} className="text-xs">
                      <div className="flex justify-between font-semibold text-slate-800">
                        <span>{item.title}</span>
                        {item.date && <span className="font-mono text-slate-500">{item.date}</span>}
                      </div>
                      {item.subtitle && <div className="text-slate-600 text-[11px]">{item.subtitle}</div>}
                      {item.description && <div className="text-slate-700 mt-0.5">{item.description}</div>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // 2. TECH MINIMAL TEMPLATE (Developer-centric, monospace headers, clean code layout)
  if (design.templateId === 'tech') {
    return (
      <div className="space-y-5 font-mono text-xs">
        {/* Header */}
        <div className="border-b border-slate-300 pb-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight font-sans text-slate-900">
                {personal.fullName}
              </h1>
              <p className="text-xs font-semibold mt-0.5" style={{ color: accentColor }}>
                $ {personal.jobTitle}
              </p>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-x-3 text-[11px] text-slate-600">
            <span>email: {personal.email}</span>
            <span>tel: {personal.phone}</span>
            <span>loc: {personal.location}</span>
            {personal.github && <span>git: {personal.github}</span>}
          </div>
        </div>

        {/* Summary */}
        {personal.summary && (
          <div>
            <div className="font-bold uppercase tracking-wider text-slate-800 mb-1">
              // PROFILE_SUMMARY
            </div>
            <p className="text-slate-700 leading-relaxed font-sans text-xs">{personal.summary}</p>
          </div>
        )}

        {/* Experience */}
        <div>
          <div className="font-bold uppercase tracking-wider text-slate-800 mb-2 pb-0.5 border-b border-slate-200">
            // WORK_HISTORY
          </div>
          <div className="space-y-3 font-sans">
            {experiences.map(exp => (
              <div key={exp.id} className="space-y-1">
                <div className="flex justify-between font-mono text-xs">
                  <span className="font-bold text-slate-900">{exp.jobTitle} @ {exp.company}</span>
                  <span className="text-slate-500">{exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}</span>
                </div>
                <ul className="list-disc ml-4 space-y-1 text-xs text-slate-700">
                  {exp.highlights.map((hl, i) => (
                    <li key={i}>{hl}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div>
          <div className="font-bold uppercase tracking-wider text-slate-800 mb-1.5 pb-0.5 border-b border-slate-200">
            // TECH_STACK
          </div>
          <div className="flex flex-wrap gap-1 font-mono text-[11px]">
            {skills.map(sk => (
              <span key={sk.id} className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                {sk.name}
              </span>
            ))}
          </div>
        </div>

        {/* Projects */}
        {projects.length > 0 && (
          <div>
            <div className="font-bold uppercase tracking-wider text-slate-800 mb-2 pb-0.5 border-b border-slate-200">
              // REPOSITORIES_AND_BUILDS
            </div>
            <div className="space-y-2 font-sans">
              {projects.map(p => (
                <div key={p.id}>
                  <div className="font-bold text-xs text-slate-900 flex justify-between font-mono">
                    <span>{p.title}</span>
                    {p.link && <span className="text-indigo-600">{p.link}</span>}
                  </div>
                  <p className="text-xs text-slate-700">{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        <div>
          <div className="font-bold uppercase tracking-wider text-slate-800 mb-1.5 pb-0.5 border-b border-slate-200">
            // EDUCATION
          </div>
          <div className="space-y-1 font-sans text-xs">
            {education.map(e => (
              <div key={e.id} className="flex justify-between">
                <span>{e.degree} - {e.institution} ({e.fieldOfStudy})</span>
                <span className="font-mono text-slate-500">{e.endDate}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 3. CLASSIC CLEAN & OTHER TEMPLATES (Default High-Recruiter Scannability Layout)
  return (
    <div className="space-y-5 text-slate-900">
      {/* Header */}
      <div className="text-center pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          {personal.fullName}
        </h1>
        <p className="text-sm font-semibold mt-1 tracking-wide" style={{ color: accentColor }}>
          {personal.jobTitle}
        </p>

        {/* Contact info list */}
        <div className="mt-2.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-slate-600">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>· {personal.phone}</span>}
          {personal.location && <span>· {personal.location}</span>}
          {personal.linkedin && <span>· {personal.linkedin}</span>}
          {personal.github && <span>· {personal.github}</span>}
          {personal.website && <span>· {personal.website.replace(/^https?:\/\//, '')}</span>}
        </div>
      </div>

      {/* Summary */}
      {personal.summary && (
        <div>
          <h2
            className="text-xs font-bold uppercase tracking-wider mb-1.5 pb-0.5 border-b"
            style={{ borderColor: accentColor, color: accentColor }}
          >
            Professional Summary
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed text-justify">{personal.summary}</p>
        </div>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <div>
          <h2
            className="text-xs font-bold uppercase tracking-wider mb-2.5 pb-0.5 border-b"
            style={{ borderColor: accentColor, color: accentColor }}
          >
            Professional Experience
          </h2>
          <div className="space-y-3.5">
            {experiences.map(exp => (
              <div key={exp.id} className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold text-slate-900">
                    {exp.jobTitle} <span className="font-normal text-slate-600">· {exp.company}</span>
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">{exp.location}</div>
                <ul className="list-disc ml-4 space-y-1 text-xs text-slate-700 leading-normal">
                  {exp.highlights.map((hl, i) => (
                    <li key={i}>{hl}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div>
          <h2
            className="text-xs font-bold uppercase tracking-wider mb-2 pb-0.5 border-b"
            style={{ borderColor: accentColor, color: accentColor }}
          >
            Education
          </h2>
          <div className="space-y-2">
            {education.map(edu => (
              <div key={edu.id} className="flex justify-between items-baseline text-xs">
                <div>
                  <span className="font-bold text-slate-900">{edu.degree}</span>
                  <span className="text-slate-600"> in {edu.fieldOfStudy}</span>
                  <div className="text-[11px] text-slate-500">{edu.institution} · {edu.location}</div>
                </div>
                <div className="text-right text-[11px] font-mono text-slate-500">
                  <div>{edu.endDate}</div>
                  {edu.score && <div className="font-medium text-slate-700">{edu.score}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div>
          <h2
            className="text-xs font-bold uppercase tracking-wider mb-2 pb-0.5 border-b"
            style={{ borderColor: accentColor, color: accentColor }}
          >
            Skills & Competencies
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {skills.map(sk => (
              <span
                key={sk.id}
                className="text-xs px-2.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-800"
              >
                {sk.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div>
          <h2
            className="text-xs font-bold uppercase tracking-wider mb-2 pb-0.5 border-b"
            style={{ borderColor: accentColor, color: accentColor }}
          >
            Featured Projects
          </h2>
          <div className="space-y-2.5">
            {projects.map(p => (
              <div key={p.id} className="text-xs space-y-0.5">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{p.title}</span>
                  {p.link && (
                    <a href={p.link} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">
                      Link ↗
                    </a>
                  )}
                </div>
                <p className="text-slate-700 text-xs leading-normal">{p.description}</p>
                {p.techStack.length > 0 && (
                  <div className="text-[11px] text-slate-500 font-mono">
                    Technologies: {p.techStack.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications & Languages in compact columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {certifications.length > 0 && (
          <div>
            <h2
              className="text-xs font-bold uppercase tracking-wider mb-1.5 pb-0.5 border-b"
              style={{ borderColor: accentColor, color: accentColor }}
            >
              Certifications
            </h2>
            <div className="space-y-1 text-xs">
              {certifications.map(c => (
                <div key={c.id}>
                  <span className="font-semibold text-slate-800">{c.name}</span>
                  <span className="text-slate-500"> ({c.issuer})</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {languages.length > 0 && (
          <div>
            <h2
              className="text-xs font-bold uppercase tracking-wider mb-1.5 pb-0.5 border-b"
              style={{ borderColor: accentColor, color: accentColor }}
            >
              Languages
            </h2>
            <div className="flex flex-wrap gap-2 text-xs">
              {languages.map(l => (
                <span key={l.id} className="text-slate-700">
                  <strong>{l.name}</strong> ({l.proficiency})
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
