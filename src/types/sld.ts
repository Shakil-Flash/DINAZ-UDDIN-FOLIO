export type SldEquipmentCategory =
  | "grid"
  | "mv_switchgear"
  | "transformer"
  | "lv_incomer"
  | "busbar"
  | "feeder"
  | "pfc";

export interface SldEquipmentNode {
  id: string;
  tag: string;
  name: string;
  category: SldEquipmentCategory;
  voltageRating: string;
  generalPurpose: string;
  technicalExplanation: string;
  standardReference: string;
  keySpecs: string[];
}

export interface SldLegendItem {
  id: string;
  name: string;
  description: string;
  symbolType: "breaker" | "transformer" | "busbar" | "earth" | "capacitor";
}
