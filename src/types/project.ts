export type ProjectStatus = "published" | "draft" | "archived";
export type ProjectVerificationStatus =
  | "verified"
  | "sample_template"
  | "pending_confirmation";

export interface ProjectLink {
  label: string;
  url: string;
  type: "github" | "live" | "documentation" | "schematic";
}

export interface ProjectRecord {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category:
    | "Power Distribution"
    | "Circuit Design"
    | "Industrial Automation"
    | "Electrical Safety"
    | "Systems Engineering"
    | "Draft Template";
  toolsAndEquipment: string[];
  imagePlaceholder: {
    label: string;
    aspectRatio?: "16/9" | "4/3";
  };
  problem: string;
  approach: string;
  outcome?: string; // Strictly optional, included ONLY when verified
  links?: ProjectLink[];
  status: ProjectStatus;
  verificationStatus: ProjectVerificationStatus;
  order: number;
}
