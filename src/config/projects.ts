import { ProjectRecord } from "@/types/project";

/**
 * Project Case Studies Data Configuration
 *
 * NOTE:
 * - Only genuine, verified projects are published with verificationStatus: "verified".
 * - Draft templates illustrate the required schema so Dinaz Uddin can populate genuine
 *   electrical engineering case studies, calculations, and photographic evidence.
 */
export const projectRecords: ProjectRecord[] = [
  {
    id: "portfolio-architecture-v1",
    slug: "portfolio-architecture",
    title: "Technical Engineering Portfolio Architecture",
    summary:
      "A high-performance digital portfolio platform engineered with Next.js 16 App Router, TypeScript strict mode, GSAP motion, and server-isolated AI streaming.",
    category: "Systems Engineering",
    toolsAndEquipment: [
      "Next.js 16",
      "React 19",
      "TypeScript Strict",
      "Tailwind CSS v4",
      "GSAP 3",
      "Vercel AI SDK",
    ],
    imagePlaceholder: {
      label: "SYSTEM ARCHITECTURE SCHEMATIC",
      aspectRatio: "16/9",
    },
    problem:
      "Generic template portfolios fail to convey disciplined engineering standards, electrical technical competencies, and strict architectural rigor.",
    approach:
      "Constructed a modular Next.js application utilizing React Server Components, client-isolated animation boundaries, server-controlled streaming LLM infrastructure, and an accessible obsidian/electric-lime design system.",
    outcome:
      "Production-grade technical portfolio featuring zero TypeScript errors, clean rate-limited AI endpoints, and fully responsive layouts.",
    links: [
      {
        label: "Source Code",
        url: "https://github.com",
        type: "github",
      },
    ],
    status: "published",
    verificationStatus: "verified",
    order: 1,
  },
  {
    id: "power-distribution-template",
    slug: "power-distribution-case-study",
    title: "Industrial Sub-Distribution & Load Analysis [Template]",
    summary:
      "Structured engineering case study template for recording three-phase load balancing, cable sizing, and protection coordination.",
    category: "Power Distribution",
    toolsAndEquipment: [
      "AutoCAD Electrical",
      "Digital Multimeter",
      "Clamp-on Ammeter",
      "Load Calculation Sheets",
    ],
    imagePlaceholder: {
      label: "ELECTRICAL SINGLE-LINE DIAGRAM (SLD)",
      aspectRatio: "16/9",
    },
    problem:
      "Unbalanced phase distribution causing neutral conductor overheating and voltage fluctuation across downstream industrial loads.",
    approach:
      "Detailed single-line diagram tracing, measuring line currents with true-RMS clamp meters, reallocating single-phase branch circuits, and verifying MCCB trip thresholds.",
    // outcome is intentionally omitted until Dinaz enters verified field results
    status: "draft",
    verificationStatus: "sample_template",
    order: 2,
  },
  {
    id: "mcc-panel-starter-template",
    slug: "motor-control-center-starter",
    title: "Motor Control Center (MCC) Starter Panel Wiring [Template]",
    summary:
      "Engineering template for Star-Delta and Direct-On-Line (DOL) induction motor starter configuration with thermal protection.",
    category: "Industrial Automation",
    toolsAndEquipment: [
      "Contactors & Overload Relays",
      "Control Timers",
      "Ferrule Labeling Tool",
      "Insulation Megohmmeter",
    ],
    imagePlaceholder: {
      label: "CONTROL PANEL WIRING SCHEMATIC",
      aspectRatio: "16/9",
    },
    problem:
      "High inrush current during induction motor start-up triggering premature upstream protective trips.",
    approach:
      "Designing an interlocking star-delta starter control circuit with adjustable pneumatic/electronic delay timers and properly rated thermal overloads.",
    // outcome is intentionally omitted until Dinaz enters verified field results
    status: "draft",
    verificationStatus: "sample_template",
    order: 3,
  },
];
