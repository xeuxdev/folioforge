export interface ContactInfo {
  fullName?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  websiteUrl?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  location?: string;
  bullets: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree?: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  gpa?: string;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  technologies: string[];
  url?: string;
}

export interface CommunityContribution {
  id: string;
  organization: string;
  role: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  description?: string;
  bullets?: string[];
  url?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate?: string;
  expirationDate?: string;
  credentialId?: string;
  url?: string;
}

export interface Language {
  id: string;
  language: string;
  fluency?: string;
}

export interface Publication {
  id: string;
  title: string;
  publisher?: string;
  publicationDate?: string;
  url?: string;
  description?: string;
}

export interface HonorAndAward {
  id: string;
  title: string;
  issuer?: string;
  date?: string;
  description?: string;
}

export interface CanonicalResumeGraph {
  contactInfo: ContactInfo;
  summary?: string;
  workExperiences: WorkExperience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  communityContributions?: CommunityContribution[];
  certifications?: Certification[];
  languages?: Language[];
  publications?: Publication[];
  honorsAndAwards?: HonorAndAward[];
}
