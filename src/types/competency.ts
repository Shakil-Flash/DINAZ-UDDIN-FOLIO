export type CompetencyStatus = "confirmed" | "sample_pending_verification";

export interface CompetencyItem {
  id: string;
  name: string;
  description: string;
  coreConcepts: string[];
  status: CompetencyStatus;
  isPublished: boolean;
}

export interface CompetencyCategory {
  id: string;
  number: string;
  title: string;
  description: string;
  iconName:
    | "circuit"
    | "wrench"
    | "shield"
    | "zap"
    | "file-text"
    | "gauge"
    | "cpu";
  items: CompetencyItem[];
  isPublished: boolean;
}
