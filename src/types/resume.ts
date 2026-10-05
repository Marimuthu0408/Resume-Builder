export type TemplateId =
  | 'classic'
  | 'modern'
  | 'tech'
  | 'nordic'
  | 'swiss'
  | 'creative'
  | 'ivy'
  | 'compact';

export type FontId = 'sans' | 'serif' | 'display' | 'mono';

export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  photoUrl: string;
  summary: string;
}

export interface WorkExperience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  highlights: string[];
}

export interface Education {
  id: string;
  degree: string;
  fieldOfStudy: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  score: string;
}

export interface Skill {
  id: string;
  name: string;
  category: 'technical' | 'soft' | 'tools' | 'languages';
  level: number; // 1-5
}

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  link: string;
  github: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  credentialUrl: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: 'Native' | 'Fluent' | 'Professional' | 'Intermediate' | 'Basic';
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  description: string;
}

export interface CustomSection {
  id: string;
  title: string;
  items: CustomSectionItem[];
}

export interface ResumeDesign {
  templateId: TemplateId;
  colorTheme: string;
  fontId: FontId;
  fontSize: 'sm' | 'base' | 'lg';
  lineSpacing: 'compact' | 'normal' | 'relaxed';
  margins: 'compact' | 'normal' | 'relaxed';
  showPhoto: boolean;
  photoStyle: 'circle' | 'square' | 'rounded';
  sectionOrder: string[];
}

export interface ResumeData {
  id: string;
  title: string;
  updatedAt: string;
  personal: PersonalInfo;
  experiences: WorkExperience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  customSections: CustomSection[];
  design: ResumeDesign;
}
