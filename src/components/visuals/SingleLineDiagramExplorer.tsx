"use client";

import * as React from "react";
import { sldEquipmentNodes, sldLegendItems } from "@/config/sld-data";
import { SldEquipmentNode } from "@/types/sld";
import { cn } from "@/lib/utils";
import {
  Zap,
  Info,
  RotateCcw,
  CheckCircle2,
  BookOpen,
} from "lucide-react";

export function SingleLineDiagramExplorer({ className }: { className?: string }) {
  const [selectedNodeId, setSelectedNodeId] = React.useState<string>("tx_01");
  const [showLegend, setShowLegend] = React.useState<boolean>(false);

  const selectedNode: SldEquipmentNode = React.useMemo(() => {
    return (
      sldEquipmentNodes.find((n) => n.id === selectedNodeId) ||
      sldEquipmentNodes[0]
    );
  }, [selectedNodeId]);

  const handleSelectNode = (id: string) => {
    setSelectedNodeId(id);
  };

  const handleReset = () => {
    setSelectedNodeId("tx_01");
  };

  return (
    <div
      className={cn(
        "rounded-3xl border border-white/10 bg-[#0c0e17] p-5 sm:p-8 backdrop-blur-xl shadow-2xl transition-all",
        className
      )}
    >
      {/* Explorer Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="flex h-2 w-2 rounded-full bg-[#b4ff39] shadow-[0_0_8px_rgba(180,255,57,0.8)]" />
            <span className="font-mono text-xs uppercase tracking-wider text-[#b4ff39] font-semibold">
              EDUCATIONAL LABORATORY // POWER DISTRIBUTION
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-[#f8fafc]">
            Interactive Single-Line Diagram (SLD) Explorer
          </h3>
          <p className="text-xs text-[#94a3b8] mt-1 max-w-xl leading-relaxed">
            Conceptual 11kV-to-415V distribution substation topology. Select any electrical equipment node to inspect protective coordination and architectural purpose.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setShowLegend((prev) => !prev)}
            aria-expanded={showLegend}
            className={cn(
              "flex items-center gap-1.5 rounded-xl border px-3 py-1.5 font-mono text-xs transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b4ff39]",
              showLegend
                ? "border-[#b4ff39]/50 bg-[#b4ff39]/10 text-[#b4ff39]"
                : "border-white/10 bg-[#141824] text-[#94a3b8] hover:text-[#f8fafc] hover:border-white/20"
            )}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Symbol Legend</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#141824] px-3 py-1.5 font-mono text-xs text-[#94a3b8] hover:text-[#f8fafc] hover:border-white/20 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b4ff39]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset View</span>
          </button>
        </div>
      </div>

      {/* Symbol Legend Drawer (Collapsible) */}
      {showLegend && (
        <div className="mb-6 rounded-2xl border border-white/10 bg-[#111420] p-4 text-xs animate-in fade-in-0 duration-200">
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
            <span className="font-mono text-xs font-semibold text-[#f8fafc] uppercase tracking-wider">
              Conventional SLD Symbols & Meaning (IEC 60617)
            </span>
            <span className="text-[11px] font-mono text-[#64748b]">Standard Representation</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {sldLegendItems.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-white/5 bg-[#090a0f] p-3 text-[11px] text-[#94a3b8]"
              >
                <span className="font-semibold text-[#f8fafc] block mb-1 font-mono text-xs">
                  {item.name}
                </span>
                <p className="leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Layout: SVG Diagram on Top/Left, Detailed Inspector on Right/Bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* SVG Diagram Canvas */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-[#07080c] p-3 sm:p-5">
            <svg
              viewBox="0 0 640 440"
              className="w-full h-auto select-none"
              role="img"
              aria-label="Single-Line Diagram of 11kV to 415V Substation. Click equipment nodes to inspect technical details."
            >
              <defs>
                {/* Background Grid Pattern */}
                <pattern id="sldGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="0.5" />
                </pattern>

                {/* Electric Lime Glow Filter */}
                <filter id="sldGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Grid Background */}
              <rect width="640" height="440" fill="url(#sldGrid)" />

              {/* STAGE 1: 11kV Incoming Grid Feeder */}
              <g id="line-grid-incomer">
                {/* Incoming Arrow Line */}
                <line x1="320" y1="15" x2="320" y2="45" stroke="#94a3b8" strokeWidth="2" />
                <polygon points="315,15 320,5 325,15" fill="#b4ff39" />
              </g>

              {/* Node 1: Grid Incomer */}
              <g
                id="node-grid_intake"
                className="cursor-pointer focus:outline-none"
                onClick={() => handleSelectNode("grid_intake")}
                tabIndex={0}
                role="button"
                aria-label="Inspect 11kV Grid Intake"
                aria-pressed={selectedNodeId === "grid_intake"}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleSelectNode("grid_intake")}
              >
                <rect
                  x="240"
                  y="40"
                  width="160"
                  height="28"
                  rx="6"
                  fill={selectedNodeId === "grid_intake" ? "#181c2b" : "#111420"}
                  stroke={selectedNodeId === "grid_intake" ? "#b4ff39" : "#334155"}
                  strokeWidth={selectedNodeId === "grid_intake" ? "2" : "1.25"}
                  filter={selectedNodeId === "grid_intake" ? "url(#sldGlow)" : undefined}
                />
                <text x="320" y="58" textAnchor="middle" fill="#f8fafc" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  GRID-11KV // HT INTAKE
                </text>
              </g>

              {/* Conductor from Grid to VCB */}
              <line
                x1="320"
                y1="68"
                x2="320"
                y2="95"
                stroke={selectedNodeId === "vcb_01" || selectedNodeId === "grid_intake" ? "#b4ff39" : "#475569"}
                strokeWidth="2"
              />

              {/* Node 2: 11kV VCB Breaker */}
              <g
                id="node-vcb_01"
                className="cursor-pointer focus:outline-none"
                onClick={() => handleSelectNode("vcb_01")}
                tabIndex={0}
                role="button"
                aria-label="Inspect VCB-01 Medium Voltage Vacuum Breaker"
                aria-pressed={selectedNodeId === "vcb_01"}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleSelectNode("vcb_01")}
              >
                <rect
                  x="295"
                  y="95"
                  width="50"
                  height="34"
                  rx="6"
                  fill={selectedNodeId === "vcb_01" ? "#181c2b" : "#111420"}
                  stroke={selectedNodeId === "vcb_01" ? "#b4ff39" : "#334155"}
                  strokeWidth={selectedNodeId === "vcb_01" ? "2" : "1.25"}
                  filter={selectedNodeId === "vcb_01" ? "url(#sldGlow)" : undefined}
                />
                {/* Breaker Cross Symbol */}
                <line x1="305" y1="102" x2="335" y2="122" stroke="#f8fafc" strokeWidth="1.5" />
                <line x1="335" y1="102" x2="305" y2="122" stroke="#f8fafc" strokeWidth="1.5" />
                <text x="355" y="116" fill="#94a3b8" fontSize="9" fontFamily="monospace">
                  VCB-01 (11kV)
                </text>
              </g>

              {/* Conductor from VCB to Transformer */}
              <line
                x1="320"
                y1="129"
                x2="320"
                y2="155"
                stroke={selectedNodeId === "tx_01" || selectedNodeId === "vcb_01" ? "#b4ff39" : "#475569"}
                strokeWidth="2"
              />

              {/* Node 3: Transformer TX-01 (Interlocking Circles) */}
              <g
                id="node-tx_01"
                className="cursor-pointer focus:outline-none"
                onClick={() => handleSelectNode("tx_01")}
                tabIndex={0}
                role="button"
                aria-label="Inspect TX-01 Distribution Transformer"
                aria-pressed={selectedNodeId === "tx_01"}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleSelectNode("tx_01")}
              >
                {/* Primary Circle (Delta) */}
                <circle
                  cx="320"
                  cy="175"
                  r="20"
                  fill={selectedNodeId === "tx_01" ? "#181c2b" : "#111420"}
                  stroke={selectedNodeId === "tx_01" ? "#b4ff39" : "#475569"}
                  strokeWidth="2"
                  filter={selectedNodeId === "tx_01" ? "url(#sldGlow)" : undefined}
                />
                {/* Secondary Circle (Star) */}
                <circle
                  cx="320"
                  cy="202"
                  r="20"
                  fill={selectedNodeId === "tx_01" ? "#181c2b" : "#111420"}
                  stroke={selectedNodeId === "tx_01" ? "#b4ff39" : "#475569"}
                  strokeWidth="2"
                  filter={selectedNodeId === "tx_01" ? "url(#sldGlow)" : undefined}
                />
                <text x="320" y="179" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">Δ</text>
                <text x="320" y="206" textAnchor="middle" fill="#b4ff39" fontSize="10" fontFamily="monospace">Y</text>
                <text x="355" y="193" fill="#f8fafc" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  TX-01 (11kV / 415V)
                </text>
              </g>

              {/* Neutral Earthing Symbol on Transformer Secondary */}
              <g id="tx-ground">
                <line x1="340" y1="202" x2="385" y2="202" stroke="#64748b" strokeWidth="1" />
                <line x1="385" y1="202" x2="385" y2="215" stroke="#64748b" strokeWidth="1" />
                <line x1="375" y1="215" x2="395" y2="215" stroke="#64748b" strokeWidth="1.5" />
                <line x1="378" y1="218" x2="392" y2="218" stroke="#64748b" strokeWidth="1.25" />
                <line x1="381" y1="221" x2="389" y2="221" stroke="#64748b" strokeWidth="1" />
                <text x="400" y="218" fill="#64748b" fontSize="8" fontFamily="monospace">SOLID GROUND</text>
              </g>

              {/* Conductor from Transformer to LV Main ACB */}
              <line
                x1="320"
                y1="222"
                x2="320"
                y2="245"
                stroke={selectedNodeId === "acb_01" || selectedNodeId === "tx_01" ? "#b4ff39" : "#475569"}
                strokeWidth="2"
              />

              {/* Node 4: Main LV Incomer ACB */}
              <g
                id="node-acb_01"
                className="cursor-pointer focus:outline-none"
                onClick={() => handleSelectNode("acb_01")}
                tabIndex={0}
                role="button"
                aria-label="Inspect ACB-01 Low Voltage Main Air Circuit Breaker"
                aria-pressed={selectedNodeId === "acb_01"}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleSelectNode("acb_01")}
              >
                <rect
                  x="295"
                  y="245"
                  width="50"
                  height="34"
                  rx="6"
                  fill={selectedNodeId === "acb_01" ? "#181c2b" : "#111420"}
                  stroke={selectedNodeId === "acb_01" ? "#b4ff39" : "#334155"}
                  strokeWidth={selectedNodeId === "acb_01" ? "2" : "1.25"}
                  filter={selectedNodeId === "acb_01" ? "url(#sldGlow)" : undefined}
                />
                <line x1="305" y1="252" x2="335" y2="272" stroke="#f8fafc" strokeWidth="1.5" />
                <line x1="335" y1="252" x2="305" y2="272" stroke="#f8fafc" strokeWidth="1.5" />
                <text x="355" y="266" fill="#94a3b8" fontSize="9" fontFamily="monospace">
                  ACB-01 (415V)
                </text>
              </g>

              {/* Conductor from ACB to Main Busbar */}
              <line
                x1="320"
                y1="279"
                x2="320"
                y2="310"
                stroke={selectedNodeId === "bus_main" || selectedNodeId === "acb_01" ? "#b4ff39" : "#475569"}
                strokeWidth="2.5"
              />

              {/* Node 5: Main LV 415V Busbar (Heavy Horizontal Conductor) */}
              <g
                id="node-bus_main"
                className="cursor-pointer focus:outline-none"
                onClick={() => handleSelectNode("bus_main")}
                tabIndex={0}
                role="button"
                aria-label="Inspect BUS-415V Main Low Voltage Distribution Busbar"
                aria-pressed={selectedNodeId === "bus_main"}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleSelectNode("bus_main")}
              >
                <line
                  x1="80"
                  y1="310"
                  x2="560"
                  y2="310"
                  stroke={selectedNodeId === "bus_main" ? "#b4ff39" : "#64748b"}
                  strokeWidth="6"
                  strokeLinecap="round"
                  filter={selectedNodeId === "bus_main" ? "url(#sldGlow)" : undefined}
                />
                <text x="80" y="300" fill="#b4ff39" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  BUS-415V // 3-PHASE 4-WIRE DISTRIBUTION BUSBAR
                </text>
              </g>

              {/* Feeder Taps down to branch breakers */}
              {/* Feeder 1 Tap: Motor Loads */}
              <line x1="160" y1="310" x2="160" y2="340" stroke="#475569" strokeWidth="2" />
              <circle cx="160" cy="310" r="3.5" fill="#b4ff39" />

              {/* Node 6: Feeder 1 (MCCB-FD1) */}
              <g
                id="node-mccb_fd1"
                className="cursor-pointer focus:outline-none"
                onClick={() => handleSelectNode("mccb_fd1")}
                tabIndex={0}
                role="button"
                aria-label="Inspect MCCB-FD1 Motor Control Center Feeder"
                aria-pressed={selectedNodeId === "mccb_fd1"}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleSelectNode("mccb_fd1")}
              >
                <rect
                  x="135"
                  y="340"
                  width="50"
                  height="30"
                  rx="5"
                  fill={selectedNodeId === "mccb_fd1" ? "#181c2b" : "#111420"}
                  stroke={selectedNodeId === "mccb_fd1" ? "#b4ff39" : "#334155"}
                  strokeWidth={selectedNodeId === "mccb_fd1" ? "2" : "1.25"}
                  filter={selectedNodeId === "mccb_fd1" ? "url(#sldGlow)" : undefined}
                />
                <line x1="145" y1="347" x2="175" y2="363" stroke="#f8fafc" strokeWidth="1.5" />
                <line x1="175" y1="347" x2="145" y2="363" stroke="#f8fafc" strokeWidth="1.5" />

                <line x1="160" y1="370" x2="160" y2="395" stroke="#475569" strokeWidth="1.5" />
                <polygon points="156,395 160,405 164,395" fill="#b4ff39" />
                <text x="160" y="420" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">
                  TO MCC / MOTORS
                </text>
              </g>

              {/* Feeder 2 Tap: Essential / Lighting Utilities */}
              <line x1="320" y1="310" x2="320" y2="340" stroke="#475569" strokeWidth="2" />
              <circle cx="320" cy="310" r="3.5" fill="#b4ff39" />

              {/* Node 7: Feeder 2 (MCCB-FD2) */}
              <g
                id="node-mccb_fd2"
                className="cursor-pointer focus:outline-none"
                onClick={() => handleSelectNode("mccb_fd2")}
                tabIndex={0}
                role="button"
                aria-label="Inspect MCCB-FD2 Lighting and Utilities Feeder"
                aria-pressed={selectedNodeId === "mccb_fd2"}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleSelectNode("mccb_fd2")}
              >
                <rect
                  x="295"
                  y="340"
                  width="50"
                  height="30"
                  rx="5"
                  fill={selectedNodeId === "mccb_fd2" ? "#181c2b" : "#111420"}
                  stroke={selectedNodeId === "mccb_fd2" ? "#b4ff39" : "#334155"}
                  strokeWidth={selectedNodeId === "mccb_fd2" ? "2" : "1.25"}
                  filter={selectedNodeId === "mccb_fd2" ? "url(#sldGlow)" : undefined}
                />
                <line x1="305" y1="347" x2="335" y2="363" stroke="#f8fafc" strokeWidth="1.5" />
                <line x1="335" y1="347" x2="305" y2="363" stroke="#f8fafc" strokeWidth="1.5" />

                <line x1="320" y1="370" x2="320" y2="395" stroke="#475569" strokeWidth="1.5" />
                <polygon points="316,395 320,405 324,395" fill="#b4ff39" />
                <text x="320" y="420" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">
                  TO LIGHTING / HVAC
                </text>
              </g>

              {/* Feeder 3 Tap: APFC Bank */}
              <line x1="480" y1="310" x2="480" y2="340" stroke="#475569" strokeWidth="2" />
              <circle cx="480" cy="310" r="3.5" fill="#b4ff39" />

              {/* Node 8: APFC Bank */}
              <g
                id="node-apfc_bank"
                className="cursor-pointer focus:outline-none"
                onClick={() => handleSelectNode("apfc_bank")}
                tabIndex={0}
                role="button"
                aria-label="Inspect APFC-01 Power Factor Correction Bank"
                aria-pressed={selectedNodeId === "apfc_bank"}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleSelectNode("apfc_bank")}
              >
                <rect
                  x="455"
                  y="340"
                  width="50"
                  height="30"
                  rx="5"
                  fill={selectedNodeId === "apfc_bank" ? "#181c2b" : "#111420"}
                  stroke={selectedNodeId === "apfc_bank" ? "#b4ff39" : "#334155"}
                  strokeWidth={selectedNodeId === "apfc_bank" ? "2" : "1.25"}
                  filter={selectedNodeId === "apfc_bank" ? "url(#sldGlow)" : undefined}
                />
                {/* Capacitor Bank Symbol (Parallel Plates) */}
                <line x1="472" y1="350" x2="488" y2="350" stroke="#b4ff39" strokeWidth="2" />
                <line x1="472" y1="356" x2="488" y2="356" stroke="#b4ff39" strokeWidth="2" />

                <line x1="480" y1="370" x2="480" y2="395" stroke="#475569" strokeWidth="1.5" />
                <circle cx="480" cy="402" r="6" fill="#181c2b" stroke="#b4ff39" strokeWidth="1.5" />
                <text x="480" y="420" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">
                  APFC CAPACITOR BANK
                </text>
              </g>
            </svg>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-[#64748b] px-1">
            <span>Click or focus on equipment nodes to inspect engineering details</span>
            <span>Radial Industrial Topology</span>
          </div>
        </div>

        {/* Detailed Inspector Card */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="rounded-2xl border border-white/10 bg-[#111420] p-6 shadow-xl">
            {/* Tag & Voltage Badge */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="rounded-md border border-[#b4ff39]/40 bg-[#b4ff39]/10 px-2.5 py-0.5 font-mono text-xs font-bold text-[#b4ff39]">
                  {selectedNode.tag}
                </span>
                <span className="font-mono text-xs text-[#94a3b8]">
                  {selectedNode.voltageRating}
                </span>
              </div>
              <span className="font-mono text-[10px] text-[#64748b]">
                {selectedNode.standardReference}
              </span>
            </div>

            {/* Equipment Name */}
            <h4 className="text-lg font-bold text-[#f8fafc] mb-2">
              {selectedNode.name}
            </h4>

            {/* General Purpose */}
            <div className="mb-4">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#b4ff39] block mb-1">
                Substation Purpose:
              </span>
              <p className="text-xs text-[#cbd5e1] leading-relaxed">
                {selectedNode.generalPurpose}
              </p>
            </div>

            {/* In-depth Technical Explanation */}
            <div className="rounded-xl border border-white/5 bg-[#090a0f] p-4 mb-4">
              <div className="flex items-center gap-1.5 text-xs font-mono text-[#f8fafc] mb-1.5 font-semibold">
                <Zap className="h-3.5 w-3.5 text-[#b4ff39]" />
                <span>Electrical Engineering Analysis:</span>
              </div>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                {selectedNode.technicalExplanation}
              </p>
            </div>

            {/* Key Specifications / Attributes */}
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#64748b] block mb-2">
                Engineering Design Parameters:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedNode.keySpecs.map((spec) => (
                  <div
                    key={spec}
                    className="flex items-center gap-1.5 rounded-lg border border-white/5 bg-[#161a29] px-2.5 py-1.5 text-[11px] font-mono text-[#cbd5e1]"
                  >
                    <CheckCircle2 className="h-3 w-3 text-[#b4ff39] shrink-0" />
                    <span className="truncate">{spec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Academic & Non-Certification Integrity Notice */}
          <div className="rounded-xl border border-white/5 bg-[#111420]/40 p-4 flex items-start gap-2.5 text-xs text-[#64748b]">
            <Info className="h-4 w-4 text-[#94a3b8] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-[#94a3b8]">Educational Conceptual Model:</strong> This diagram is an engineering study representation of an industrial distribution network. It does not replace site-specific protection coordination, arc flash studies, or certified electrical design documentation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
