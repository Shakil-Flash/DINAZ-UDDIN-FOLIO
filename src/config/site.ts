export interface NavItem {
  label: string;
  href: string;
  isExternal?: boolean;
}

export interface VerificationRecord {
  isVerified: boolean;
  notes?: string;
  lastUpdated: string;
}

export interface SiteConfig {
  name: string;
  role: string;
  discipline: string;
  shortBio: string;
  description: string;
  url: string;
  navItems: NavItem[];
  verifiedProfile: {
    fullName: string;
    designation: string;
    discipline: string;
    // Verified status tracker: marks what has been explicitly confirmed by Dinaz
    academicDegree: {
      degreeName: string;
      institution: string | null; // Awaiting confirmation
      status: "pending_confirmation";
    };
    certifications: {
      status: "pending_confirmation";
      records: string[];
    };
  };
  links: {
    github: string;
    linkedin: string;
    email: string;
  };
}

export const siteConfig: SiteConfig = {
  name: "Dinaz Uddin",
  role: "Electrical Diploma Engineer",
  discipline: "Electrical Systems & Modern Technical Infrastructure",
  shortBio:
    "Electrical Diploma Engineer with a disciplined foundation in circuit theory, power distribution systems, electrical safety standards, and modern digital tooling.",
  description:
    "Portfolio of Dinaz Uddin, Electrical Diploma Engineer. Focused on electrical systems engineering, technical rigor, and resilient digital architectures.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  navItems: [
    { label: "Overview", href: "#overview" },
    { label: "Philosophy", href: "#philosophy" },
    { label: "Competencies", href: "#competencies" },
    { label: "Projects", href: "#projects" },
    { label: "Contact", href: "#contact" },
  ],
  verifiedProfile: {
    fullName: "Dinaz Uddin",
    designation: "Electrical Diploma Engineer",
    discipline: "Electrical Engineering",
    academicDegree: {
      degreeName: "Diploma in Electrical Engineering",
      institution: null, // Left unpopulated until Dinaz provides verified institution details
      status: "pending_confirmation",
    },
    certifications: {
      status: "pending_confirmation",
      records: [],
    },
  },
  links: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    email: "contact@dinazuddin.dev",
  },
};
