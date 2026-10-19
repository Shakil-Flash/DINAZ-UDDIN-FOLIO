import { EngineeringPrinciple } from "@/types/philosophy";

export const engineeringPrinciples: EngineeringPrinciple[] = [
  {
    id: "precision-safety",
    number: "01",
    title: "Precision & Safety First",
    tagline: "Electrical systems tolerate zero margin for guesswork.",
    description:
      "Engineering integrity begins with adherence to rigorous electrical safety codes, calculated load boundaries, and defensive isolation practices. Every connection, conductor sizing, and protection rating must be verified against first principles.",
    practicalApplication:
      "Consistent verification of circuit continuity, insulation resistance, and earthing integrity before system energization.",
    keyAspects: [
      "Standard Compliance",
      "Defensive Isolation",
      "Calculated Margins",
      "Thermal Monitoring",
    ],
  },
  {
    id: "systematic-problem-solving",
    number: "02",
    title: "Systematic Root-Cause Diagnosis",
    tagline: "Diagnose through structured isolation rather than trial and error.",
    description:
      "Complex faults yield to disciplined troubleshooting methodologies. By decomposing systems into power supply, control circuitry, signal paths, and physical loads, anomalies are isolated methodically from source to sink.",
    practicalApplication:
      "Applying multi-point metering, schematic tracing, and progressive sub-circuit isolation to pinpoint failure modes.",
    keyAspects: [
      "Signal Tracing",
      "Load Division",
      "Component Isolation",
      "Quantitative Validation",
    ],
  },
  {
    id: "reliability-maintainability",
    number: "03",
    title: "Reliability & Maintainability",
    tagline: "An engineered system must outlive its installation phase.",
    description:
      "True engineering excellence is measured by how effectively a system operates over its lifecycle. Clear wire labeling, tidy panel wiring, modular terminal organization, and comprehensive schematics turn complex installations into serviceable infrastructure.",
    practicalApplication:
      "Standardized terminal labeling, modular component mounting, and documenting as-built schematic revisions.",
    keyAspects: [
      "Structured Cabling",
      "Accessible Junctions",
      "Comprehensive Labeling",
      "Serviceable Layouts",
    ],
  },
  {
    id: "continuous-learning",
    number: "04",
    title: "Continuous Technical Modernization",
    tagline: "Bridging classical electromechanics with modern computational tools.",
    description:
      "The electrical discipline constantly advances with smart microgrids, automation controllers, digital simulation tools, and programmable logic. Remaining effective demands continuous study of evolving standards and modern tooling.",
    practicalApplication:
      "Continually expanding proficiency in circuit simulation, modern CAD tooling, and automated diagnostic instruments.",
    keyAspects: [
      "Simulation Tooling",
      "Smart Metering",
      "Digital Diagnostics",
      "Standards Evolution",
    ],
  },
];
