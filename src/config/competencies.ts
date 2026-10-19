import { CompetencyCategory } from "@/types/competency";

/**
 * Technical Competencies Framework for Dinaz Uddin (Electrical Diploma Engineer)
 *
 * NOTE FOR DINAZ UDDIN:
 * - Items marked with status "sample_pending_verification" represent the standard
 *   curriculum and technical domains of Electrical Diploma Engineering.
 * - Change status to "confirmed" as you verify your individual competencies.
 * - Set "isPublished: false" to hide any domain you do not wish to display publicly.
 */
export const competencyCategories: CompetencyCategory[] = [
  {
    id: "electrical-fundamentals",
    number: "01",
    title: "Electrical Fundamentals & Circuit Analysis",
    description:
      "Core principles of DC and AC circuit theory, impedance networks, electromagnetism, and electrical power calculation.",
    iconName: "circuit",
    isPublished: true,
    items: [
      {
        id: "ac-dc-circuit-analysis",
        name: "AC & DC Circuit Analysis",
        description:
          "Application of Ohm's Law, Kirchhoff's Laws (KVL/KCL), mesh and nodal analysis for active and passive networks.",
        coreConcepts: ["Ohm's Law", "KVL & KCL", "Mesh Analysis", "RLC Circuits"],
        status: "sample_pending_verification",
        isPublished: true,
      },
      {
        id: "three-phase-systems",
        name: "Polyphase & Three-Phase Systems",
        description:
          "Star and Delta configurations, line vs. phase voltage/current relations, and balanced three-phase power measurement.",
        coreConcepts: ["Star-Delta Connections", "Phase Angle", "Power Factor", "Reactive Power"],
        status: "sample_pending_verification",
        isPublished: true,
      },
      {
        id: "electromagnetic-devices",
        name: "Electromagnetism & Transformers",
        description:
          "Magnetic circuits, mutual induction, transformer turn ratios, and core/copper loss analysis.",
        coreConcepts: ["Faraday's Law", "Mutual Induction", "Transformer Ratios", "Core Losses"],
        status: "sample_pending_verification",
        isPublished: true,
      },
    ],
  },
  {
    id: "installation-maintenance",
    number: "02",
    title: "Electrical Installation & Maintenance",
    description:
      "Practical execution of conduit wiring, distribution board assembly, cable termination, and equipment upkeep.",
    iconName: "wrench",
    isPublished: true,
    items: [
      {
        id: "panel-wiring-assembly",
        name: "Control Panel & Distribution Board Assembly",
        description:
          "DIN rail component mounting, busbar sizing, trunking routing, and neat ferruled wiring practices.",
        coreConcepts: ["DIN Rail Layout", "Busbar Sizing", "Terminal Ferrule", "Cable Trunking"],
        status: "sample_pending_verification",
        isPublished: true,
      },
      {
        id: "cable-selection-termination",
        name: "Cable Sizing, Dressing & Termination",
        description:
          "Calculating ampacity, derating factors, and voltage drop across copper and aluminum conductors.",
        coreConcepts: ["Ampacity Tables", "Voltage Drop", "Lug Crimping", "Color Coding"],
        status: "sample_pending_verification",
        isPublished: true,
      },
      {
        id: "motor-control-starters",
        name: "Motor Control & Direct Online (DOL) Starters",
        description:
          "Wiring and testing of contactors, overload relays, and star-delta starters for induction motors.",
        coreConcepts: ["DOL Starters", "Star-Delta", "Thermal Overload", "Interlocking"],
        status: "sample_pending_verification",
        isPublished: true,
      },
    ],
  },
  {
    id: "safety-protection",
    number: "03",
    title: "Electrical Safety, Earthing & Protection",
    description:
      "Protective relaying, circuit interruption, personnel safety precautions, and low-impedance earth grounding.",
    iconName: "shield",
    isPublished: true,
    items: [
      {
        id: "protective-devices",
        name: "Circuit Breakers & Protective Switchgear",
        description:
          "Selection and testing of MCBs, MCCBs, ELCBs, and RCCBs for short-circuit and residual current protection.",
        coreConcepts: ["MCB / MCCB", "RCCB / ELCB", "Trip Curves", "Breaking Capacity"],
        status: "sample_pending_verification",
        isPublished: true,
      },
      {
        id: "earthing-bonding",
        name: "Earthing Systems & Equipotential Bonding",
        description:
          "Installation of ground rods, chemical earthing pits, and testing of earth electrode resistance.",
        coreConcepts: ["Earth Pits", "Bonding Conductors", "Ground Resistance", "Touch Potential"],
        status: "sample_pending_verification",
        isPublished: true,
      },
      {
        id: "safety-compliance",
        name: "Safe Isolation & Lockout/Tagout (LOTO)",
        description:
          "Strict electrical isolation workflows, proving dead using calibrated two-pole testers, and lockout procedures.",
        coreConcepts: ["LOTO Procedure", "Proving Dead", "Personal Protective Equipment", "Safety Auditing"],
        status: "sample_pending_verification",
        isPublished: true,
      },
    ],
  },
  {
    id: "power-distribution",
    number: "04",
    title: "Power Distribution & Switchgear Systems",
    description:
      "Substation layout concepts, bus coupler operations, load balancing, and power factor improvement.",
    iconName: "zap",
    isPublished: true,
    items: [
      {
        id: "substation-switchgear",
        name: "Switchgear & Substation Auxiliary Systems",
        description:
          "Understanding HT/LT panels, air circuit breakers (ACB), vacuum circuit breakers (VCB), and bus couplers.",
        coreConcepts: ["Air Circuit Breakers", "VCB", "Bus Couplers", "Metering CT/PT"],
        status: "sample_pending_verification",
        isPublished: true,
      },
      {
        id: "power-factor-correction",
        name: "Power Factor Correction (PFC)",
        description:
          "Capacitor bank sizing, automatic power factor correction (APFC) relays, and reducing reactive penalties.",
        coreConcepts: ["Capacitor Banks", "APFC Relays", "kVAR Calculations", "Harmonic Detuning"],
        status: "sample_pending_verification",
        isPublished: true,
      },
    ],
  },
  {
    id: "drawings-documentation",
    number: "05",
    title: "Electrical Drawings & Technical Documentation",
    description:
      "Interpretation and drafting of single-line diagrams (SLD), schematic circuit diagrams, and bill of quantities.",
    iconName: "file-text",
    isPublished: true,
    items: [
      {
        id: "single-line-diagrams",
        name: "Single Line Diagrams (SLD) & Schematics",
        description:
          "Reading, tracing, and drafting electrical power flows, symbol conventions (IEC/ANSI), and panel layout plans.",
        coreConcepts: ["IEC / ANSI Symbols", "Power Flow Tracing", "Control Schematics", "Legend Standards"],
        status: "sample_pending_verification",
        isPublished: true,
      },
      {
        id: "boq-specifications",
        name: "Bill of Quantities (BOQ) & Estimations",
        description:
          "Component specification drafting, conductor quantity take-offs, and switchgear rating schedules.",
        coreConcepts: ["Material Take-offs", "Conductor Schedules", "Rating Verification", "Specification Auditing"],
        status: "sample_pending_verification",
        isPublished: true,
      },
    ],
  },
  {
    id: "testing-measurement",
    number: "06",
    title: "Electrical Testing, Measurement & Instrumentation",
    description:
      "Operating industrial test instruments to verify electrical health, insulation integrity, and load parameters.",
    iconName: "gauge",
    isPublished: true,
    items: [
      {
        id: "insulation-resistance-testing",
        name: "Megohmmeter & Insulation Testing",
        description:
          "Performing high-voltage DC insulation resistance tests on motor windings, transformers, and feeder cables.",
        coreConcepts: ["Megger Testing", "Insulation Breakdown", "Dielectric Absorption", "Phase-to-Earth"],
        status: "sample_pending_verification",
        isPublished: true,
      },
      {
        id: "multimeter-clamp-meter",
        name: "Precision Multimeters & Clamp-on Ammeters",
        description:
          "True-RMS current measurement, line voltage verification, continuity testing, and diode drop checks.",
        coreConcepts: ["True RMS", "Clamp-on Current", "Inrush Current", "Continuity Testing"],
        status: "sample_pending_verification",
        isPublished: true,
      },
    ],
  },
  {
    id: "software-tools",
    number: "07",
    title: "Engineering Software & Digital Tools",
    description:
      "Modern CAD software, circuit simulation environments, and computational programming tools.",
    iconName: "cpu",
    isPublished: true,
    items: [
      {
        id: "cad-electrical-software",
        name: "CAD for Electrical Layouts",
        description:
          "Digital schematic drafting, layout detailing, and conversion to PDF/DWG technical project deliverables.",
        coreConcepts: ["AutoCAD Electrical", "Schematic Drafting", "Layer Management", "Export Verification"],
        status: "sample_pending_verification",
        isPublished: true,
      },
      {
        id: "modern-digital-tooling",
        name: "Technical Web & Digital Tooling",
        description:
          "Disciplined modern web development (Next.js, TypeScript) applied to technical documentation and engineering portfolios.",
        coreConcepts: ["TypeScript Strict", "Next.js Architecture", "Design Systems", "Web Performance"],
        status: "confirmed",
        isPublished: true,
      },
    ],
  },
];
