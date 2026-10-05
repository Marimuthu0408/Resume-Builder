import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ResumeData,
  PersonalInfo,
  WorkExperience,
  Education,
  Skill,
  Project,
  Certification,
  Language,
  CustomSection,
  ResumeDesign,
  TemplateId
} from '../types/resume';
import { SAMPLE_RESUME_ENGINEER } from '../data/initialData';

export interface ATSAnalysis {
  score: number;
  grade: 'Needs Work' | 'Good' | 'Strong' | 'Elite';
  metricsCount: number;
  wordCount: number;
  checklist: {
    label: string;
    passed: boolean;
    recommendation: string;
  }[];
}

interface ResumeContextType {
  resume: ResumeData;
  savedResumes: ResumeData[];
  activeResumeId: string;
  atsAnalysis: ATSAnalysis;
  totalExperienceYears: number;
  updatePersonal: (data: Partial<PersonalInfo>) => void;
  // Experience
  addExperience: () => void;
  updateExperience: (id: string, data: Partial<WorkExperience>) => void;
  deleteExperience: (id: string) => void;
  addHighlight: (expId: string, text?: string) => void;
  updateHighlight: (expId: string, index: number, text: string) => void;
  deleteHighlight: (expId: string, index: number) => void;
  // Education
  addEducation: () => void;
  updateEducation: (id: string, data: Partial<Education>) => void;
  deleteEducation: (id: string) => void;
  // Skills
  addSkill: (name: string, category?: Skill['category'], level?: number) => void;
  updateSkill: (id: string, data: Partial<Skill>) => void;
  deleteSkill: (id: string) => void;
  // Projects
  addProject: () => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  // Certifications
  addCertification: () => void;
  updateCertification: (id: string, data: Partial<Certification>) => void;
  deleteCertification: (id: string) => void;
  // Languages
  addLanguage: (name?: string, proficiency?: Language['proficiency']) => void;
  updateLanguage: (id: string, data: Partial<Language>) => void;
  deleteLanguage: (id: string) => void;
  // Custom Section
  addCustomSection: (title?: string) => void;
  updateCustomSectionTitle: (sectionId: string, title: string) => void;
  addCustomSectionItem: (sectionId: string) => void;
  updateCustomSectionItem: (sectionId: string, itemId: string, data: Partial<CustomSection['items'][0]>) => void;
  deleteCustomSectionItem: (sectionId: string, itemId: string) => void;
  deleteCustomSection: (sectionId: string) => void;
  // Design
  updateDesign: (data: Partial<ResumeDesign>) => void;
  setTemplate: (templateId: TemplateId) => void;
  // Resume Manager
  createNewResume: (title?: string) => void;
  switchResume: (id: string) => void;
  duplicateResume: (id: string) => void;
  deleteResume: (id: string) => void;
  loadSampleData: () => void;
  exportResumeJSON: () => void;
  importResumeJSON: (jsonData: string) => boolean;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedResumes, setSavedResumes] = useState<ResumeData[]>(() => {
    try {
      const stored = localStorage.getItem('cvforge_saved_resumes');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading saved resumes:', e);
    }
    return [SAMPLE_RESUME_ENGINEER];
  });

  const [activeResumeId, setActiveResumeId] = useState<string>(() => {
    return savedResumes[0]?.id || SAMPLE_RESUME_ENGINEER.id;
  });

  const resume = savedResumes.find(r => r.id === activeResumeId) || savedResumes[0] || SAMPLE_RESUME_ENGINEER;

  // Persist saved resumes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cvforge_saved_resumes', JSON.stringify(savedResumes));
    } catch (e) {
      console.error('Error saving resumes:', e);
    }
  }, [savedResumes]);

  const updateActiveResume = (updater: (prev: ResumeData) => ResumeData) => {
    setSavedResumes(prev =>
      prev.map(item => {
        if (item.id === resume.id) {
          const updated = updater(item);
          return { ...updated, updatedAt: new Date().toISOString() };
        }
        return item;
      })
    );
  };

  // Personal
  const updatePersonal = (data: Partial<PersonalInfo>) => {
    updateActiveResume(prev => ({
      ...prev,
      personal: { ...prev.personal, ...data }
    }));
  };

  // Experience
  const addExperience = () => {
    const newExp: WorkExperience = {
      id: `exp-${Date.now()}`,
      jobTitle: 'Software Engineer',
      company: 'Tech Enterprise',
      location: 'Bengaluru, India',
      startDate: '2023-01',
      endDate: '',
      isCurrent: true,
      highlights: ['Spearheaded development of scalable features improving customer satisfaction.']
    };
    updateActiveResume(prev => ({
      ...prev,
      experiences: [newExp, ...prev.experiences]
    }));
  };

  const updateExperience = (id: string, data: Partial<WorkExperience>) => {
    updateActiveResume(prev => ({
      ...prev,
      experiences: prev.experiences.map(exp => (exp.id === id ? { ...exp, ...data } : exp))
    }));
  };

  const deleteExperience = (id: string) => {
    updateActiveResume(prev => ({
      ...prev,
      experiences: prev.experiences.filter(exp => exp.id !== id)
    }));
  };

  const addHighlight = (expId: string, text = 'Achieved key milestone by delivering project ahead of schedule.') => {
    updateActiveResume(prev => ({
      ...prev,
      experiences: prev.experiences.map(exp => {
        if (exp.id === expId) {
          return { ...exp, highlights: [...exp.highlights, text] };
        }
        return exp;
      })
    }));
  };

  const updateHighlight = (expId: string, index: number, text: string) => {
    updateActiveResume(prev => ({
      ...prev,
      experiences: prev.experiences.map(exp => {
        if (exp.id === expId) {
          const newHighlights = [...exp.highlights];
          newHighlights[index] = text;
          return { ...exp, highlights: newHighlights };
        }
        return exp;
      })
    }));
  };

  const deleteHighlight = (expId: string, index: number) => {
    updateActiveResume(prev => ({
      ...prev,
      experiences: prev.experiences.map(exp => {
        if (exp.id === expId) {
          return { ...exp, highlights: exp.highlights.filter((_, i) => i !== index) };
        }
        return exp;
      })
    }));
  };

  // Education
  const addEducation = () => {
    const newEdu: Education = {
      id: `edu-${Date.now()}`,
      degree: 'Bachelor of Technology (B.Tech)',
      fieldOfStudy: 'Computer Science',
      institution: 'State University',
      location: 'Delhi, India',
      startDate: '2018-08',
      endDate: '2022-05',
      score: '8.5 CGPA'
    };
    updateActiveResume(prev => ({
      ...prev,
      education: [newEdu, ...prev.education]
    }));
  };

  const updateEducation = (id: string, data: Partial<Education>) => {
    updateActiveResume(prev => ({
      ...prev,
      education: prev.education.map(edu => (edu.id === id ? { ...edu, ...data } : edu))
    }));
  };

  const deleteEducation = (id: string) => {
    updateActiveResume(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  // Skills
  const addSkill = (name: string, category: Skill['category'] = 'technical', level = 4) => {
    if (!name.trim()) return;
    const exists = resume.skills.some(s => s.name.toLowerCase() === name.trim().toLowerCase());
    if (exists) return;

    const newSkill: Skill = {
      id: `sk-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      name: name.trim(),
      category,
      level
    };
    updateActiveResume(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill]
    }));
  };

  const updateSkill = (id: string, data: Partial<Skill>) => {
    updateActiveResume(prev => ({
      ...prev,
      skills: prev.skills.map(sk => (sk.id === id ? { ...sk, ...data } : sk))
    }));
  };

  const deleteSkill = (id: string) => {
    updateActiveResume(prev => ({
      ...prev,
      skills: prev.skills.filter(sk => sk.id !== id)
    }));
  };

  // Projects
  const addProject = () => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      title: 'Cloud Analytics Dashboard',
      description: 'Built scalable real-time telemetry analytics platform with intuitive charts.',
      techStack: ['React', 'TypeScript', 'Node.js'],
      link: 'https://example.com/project',
      github: 'github.com/example/project'
    };
    updateActiveResume(prev => ({
      ...prev,
      projects: [...prev.projects, newProj]
    }));
  };

  const updateProject = (id: string, data: Partial<Project>) => {
    updateActiveResume(prev => ({
      ...prev,
      projects: prev.projects.map(p => (p.id === id ? { ...p, ...data } : p))
    }));
  };

  const deleteProject = (id: string) => {
    updateActiveResume(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id)
    }));
  };

  // Certifications
  const addCertification = () => {
    const newCert: Certification = {
      id: `cert-${Date.now()}`,
      name: 'Certified Cloud Practitioner',
      issuer: 'AWS',
      issueDate: '2023',
      credentialUrl: ''
    };
    updateActiveResume(prev => ({
      ...prev,
      certifications: [...prev.certifications, newCert]
    }));
  };

  const updateCertification = (id: string, data: Partial<Certification>) => {
    updateActiveResume(prev => ({
      ...prev,
      certifications: prev.certifications.map(c => (c.id === id ? { ...c, ...data } : c))
    }));
  };

  const deleteCertification = (id: string) => {
    updateActiveResume(prev => ({
      ...prev,
      certifications: prev.certifications.filter(c => c.id !== id)
    }));
  };

  // Languages
  const addLanguage = (name = 'English', proficiency: Language['proficiency'] = 'Fluent') => {
    const newLang: Language = {
      id: `lang-${Date.now()}`,
      name,
      proficiency
    };
    updateActiveResume(prev => ({
      ...prev,
      languages: [...prev.languages, newLang]
    }));
  };

  const updateLanguage = (id: string, data: Partial<Language>) => {
    updateActiveResume(prev => ({
      ...prev,
      languages: prev.languages.map(l => (l.id === id ? { ...l, ...data } : l))
    }));
  };

  const deleteLanguage = (id: string) => {
    updateActiveResume(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l.id !== id)
    }));
  };

  // Custom Sections
  const addCustomSection = (title = 'Awards & Honors') => {
    const newSec: CustomSection = {
      id: `custom-${Date.now()}`,
      title,
      items: [
        {
          id: `item-${Date.now()}`,
          title: 'Award of Excellence',
          subtitle: 'National Tech Society',
          date: '2023',
          description: 'Recognized for highest impact engineering innovation.'
        }
      ]
    };
    updateActiveResume(prev => ({
      ...prev,
      customSections: [...prev.customSections, newSec]
    }));
  };

  const updateCustomSectionTitle = (sectionId: string, title: string) => {
    updateActiveResume(prev => ({
      ...prev,
      customSections: prev.customSections.map(s => (s.id === sectionId ? { ...s, title } : s))
    }));
  };

  const addCustomSectionItem = (sectionId: string) => {
    const newItem = {
      id: `item-${Date.now()}`,
      title: 'New Achievement',
      subtitle: 'Organization',
      date: '2023',
      description: 'Detail about this recognition.'
    };
    updateActiveResume(prev => ({
      ...prev,
      customSections: prev.customSections.map(s => {
        if (s.id === sectionId) {
          return { ...s, items: [...s.items, newItem] };
        }
        return s;
      })
    }));
  };

  const updateCustomSectionItem = (sectionId: string, itemId: string, data: Partial<CustomSection['items'][0]>) => {
    updateActiveResume(prev => ({
      ...prev,
      customSections: prev.customSections.map(s => {
        if (s.id === sectionId) {
          return {
            ...s,
            items: s.items.map(item => (item.id === itemId ? { ...item, ...data } : item))
          };
        }
        return s;
      })
    }));
  };

  const deleteCustomSectionItem = (sectionId: string, itemId: string) => {
    updateActiveResume(prev => ({
      ...prev,
      customSections: prev.customSections.map(s => {
        if (s.id === sectionId) {
          return { ...s, items: s.items.filter(item => item.id !== itemId) };
        }
        return s;
      })
    }));
  };

  const deleteCustomSection = (sectionId: string) => {
    updateActiveResume(prev => ({
      ...prev,
      customSections: prev.customSections.filter(s => s.id !== sectionId)
    }));
  };

  // Design
  const updateDesign = (data: Partial<ResumeDesign>) => {
    updateActiveResume(prev => ({
      ...prev,
      design: { ...prev.design, ...data }
    }));
  };

  const setTemplate = (templateId: TemplateId) => {
    updateDesign({ templateId });
  };

  // Resume Management
  const createNewResume = (title = 'Untitled Resume') => {
    const newResume: ResumeData = {
      ...SAMPLE_RESUME_ENGINEER,
      id: `resume-${Date.now()}`,
      title,
      updatedAt: new Date().toISOString(),
      personal: {
        ...SAMPLE_RESUME_ENGINEER.personal,
        fullName: 'Your Name',
        jobTitle: 'Professional Title',
        summary: 'A brief summary of your expertise and professional goals.'
      }
    };
    setSavedResumes(prev => [newResume, ...prev]);
    setActiveResumeId(newResume.id);
  };

  const switchResume = (id: string) => {
    const target = savedResumes.find(r => r.id === id);
    if (target) {
      setActiveResumeId(id);
    }
  };

  const duplicateResume = (id: string) => {
    const target = savedResumes.find(r => r.id === id);
    if (!target) return;
    const cloned: ResumeData = {
      ...JSON.parse(JSON.stringify(target)),
      id: `resume-${Date.now()}`,
      title: `${target.title} (Copy)`,
      updatedAt: new Date().toISOString()
    };
    setSavedResumes(prev => [cloned, ...prev]);
    setActiveResumeId(cloned.id);
  };

  const deleteResume = (id: string) => {
    if (savedResumes.length <= 1) return;
    const remaining = savedResumes.filter(r => r.id !== id);
    setSavedResumes(remaining);
    if (activeResumeId === id) {
      setActiveResumeId(remaining[0].id);
    }
  };

  const loadSampleData = () => {
    updateActiveResume(() => ({
      ...JSON.parse(JSON.stringify(SAMPLE_RESUME_ENGINEER)),
      id: resume.id,
      title: resume.title
    }));
  };

  const exportResumeJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(resume, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${resume.personal.fullName.replace(/\s+/g, '_')}_Resume.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importResumeJSON = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData) as ResumeData;
      if (parsed.personal && parsed.design) {
        const importedResume = {
          ...parsed,
          id: `resume-${Date.now()}`,
          updatedAt: new Date().toISOString()
        };
        setSavedResumes(prev => [importedResume, ...prev]);
        setActiveResumeId(importedResume.id);
        return true;
      }
    } catch (e) {
      console.error('Failed to parse resume JSON:', e);
    }
    return false;
  };

  // Calculation: ATS Score & Keyword Audit
  const calculateATS = (): ATSAnalysis => {
    let score = 0;
    const checklist: ATSAnalysis['checklist'] = [];

    // 1. Basic Info
    const hasNameAndRole = Boolean(resume.personal.fullName.trim() && resume.personal.jobTitle.trim());
    if (hasNameAndRole) score += 15;
    checklist.push({
      label: 'Full Name & Target Job Title',
      passed: hasNameAndRole,
      recommendation: hasNameAndRole ? 'Clearly specified' : 'Add your full name and job title to establish identity'
    });

    // 2. Contact details
    const hasContact = Boolean(resume.personal.email.trim() && resume.personal.phone.trim() && resume.personal.location.trim());
    if (hasContact) score += 15;
    checklist.push({
      label: 'Complete Contact Essentials',
      passed: hasContact,
      recommendation: hasContact ? 'Email, phone, and city present' : 'Include phone number, email, and city for recruiter reach'
    });

    // 3. Summary length
    const summaryLen = resume.personal.summary.trim().length;
    const hasGoodSummary = summaryLen >= 90;
    if (hasGoodSummary) score += 15;
    checklist.push({
      label: 'Professional Summary Depth',
      passed: hasGoodSummary,
      recommendation: hasGoodSummary ? `${summaryLen} chars (optimal length)` : 'Expand summary to at least 90 characters highlighting core strengths'
    });

    // 4. Work Experience & Bullet count
    const hasExperiences = resume.experiences.length >= 2;
    if (hasExperiences) score += 15;
    checklist.push({
      label: 'Work History Depth (>= 2 roles)',
      passed: hasExperiences,
      recommendation: hasExperiences ? `${resume.experiences.length} positions documented` : 'List at least 2 relevant work or internship experiences'
    });

    // 5. Quantitative Metrics in bullet points
    let metricsFound = 0;
    let totalHighlights = 0;
    const metricRegex = /(\d+%|\d+x|\$\d+|₹\d+|\b\d+\b|\b\d+M\b|\b\d+k\b)/i;
    resume.experiences.forEach(exp => {
      exp.highlights.forEach(h => {
        totalHighlights++;
        if (metricRegex.test(h)) metricsFound++;
      });
    });
    const hasQuantifiableImpact = metricsFound >= 2;
    if (hasQuantifiableImpact) score += 15;
    checklist.push({
      label: 'Quantifiable Metrics & Numbers',
      passed: hasQuantifiableImpact,
      recommendation: hasQuantifiableImpact
        ? `${metricsFound} measurable accomplishments detected`
        : 'Incorporate specific numbers (e.g. 25%, ₹5L, 3x, 10+ team members) into bullet points'
    });

    // 6. Skills Depth
    const skillsCount = resume.skills.length;
    const hasSkills = skillsCount >= 6;
    if (hasSkills) score += 15;
    checklist.push({
      label: 'ATS Keyword & Skills Breadth',
      passed: hasSkills,
      recommendation: hasSkills ? `${skillsCount} skills listed` : 'Add at least 6 core technical and industry skills'
    });

    // 7. Education & Projects
    const hasEduAndProjects = resume.education.length > 0 && resume.projects.length > 0;
    if (hasEduAndProjects) score += 10;
    checklist.push({
      label: 'Education & Real Projects',
      passed: hasEduAndProjects,
      recommendation: hasEduAndProjects ? 'Education and projects present' : 'Include education history and at least 1 showcase project'
    });

    // Total calculated word count
    const fullText = [
      resume.personal.fullName,
      resume.personal.jobTitle,
      resume.personal.summary,
      ...resume.experiences.flatMap(e => [e.company, e.jobTitle, ...e.highlights]),
      ...resume.education.map(e => `${e.degree} ${e.institution}`),
      ...resume.skills.map(s => s.name),
      ...resume.projects.map(p => `${p.title} ${p.description}`)
    ].join(' ');
    const wordCount = fullText.split(/\s+/).filter(Boolean).length;

    let grade: ATSAnalysis['grade'] = 'Needs Work';
    if (score >= 90) grade = 'Elite';
    else if (score >= 75) grade = 'Strong';
    else if (score >= 50) grade = 'Good';

    return {
      score: Math.min(100, score),
      grade,
      metricsCount: metricsFound,
      wordCount,
      checklist
    };
  };

  // Calculation: Total Experience Years
  const calculateTotalExperienceYears = (): number => {
    let totalMonths = 0;
    resume.experiences.forEach(exp => {
      if (!exp.startDate) return;
      const start = new Date(exp.startDate);
      const end = exp.isCurrent || !exp.endDate ? new Date() : new Date(exp.endDate);
      const diffMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
      if (diffMonths > 0) {
        totalMonths += diffMonths;
      }
    });
    return Math.round((totalMonths / 12) * 10) / 10;
  };

  return (
    <ResumeContext.Provider
      value={{
        resume,
        savedResumes,
        activeResumeId,
        atsAnalysis: calculateATS(),
        totalExperienceYears: calculateTotalExperienceYears(),
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
        setTemplate,
        createNewResume,
        switchResume,
        duplicateResume,
        deleteResume,
        loadSampleData,
        exportResumeJSON,
        importResumeJSON
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};
