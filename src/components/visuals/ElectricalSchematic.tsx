"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Zap, Info, RotateCcw } from "lucide-react";

export type CircuitSequence = "OFF" | "STAR" | "DELTA";

interface ComponentDetail {
  tag: string;
  name: string;
  functionDescription: string;
  standard: string;
}

const COMPONENT_DETAILS: Record<string, ComponentDetail> = {
  QF1: {
    tag: "QF1",
    name: "Main Circuit Breaker (MCCB)",
    functionDescription: "Provides thermal-magnetic short-circuit and gross overcurrent protection across incoming 3-phase feeder lines.",
    standard: "IEC 60947-2",
  },
  KM1: {
    tag: "KM1",
    name: "Main Line Contactor",
    functionDescription: "Connects the three-phase power supply (L1, L2, L3) directly to motor primary terminals (U1, V1, W1) during both Star and Delta runs.",
    standard: "IEC 60947-4-1",
  },
  FR1: {
    tag: "FR1",
    name: "Thermal Overload Relay",
    functionDescription: "Monitors continuous motor current via bimetallic elements to trip the control circuit during sustained overload conditions.",
    standard: "Class 10 / IEC 60947-4",
  },
  KM2: {
    tag: "KM2",
    name: "Star Contactor",
    functionDescription: "Bridges secondary terminals (W2, U2, V2) into a common neutral star point during starting, reducing line inrush to ~33%.",
    standard: "Interlocked with KM3",
  },
  KM3: {
    tag: "KM3",
    name: "Delta Contactor",
    functionDescription: "Connects opposing winding terminals across full line voltage (U1-W2, V1-U2, W1-V2) for standard running torque.",
    standard: "Interlocked with KM2",
  },
  M1: {
    tag: "M1",
    name: "Three-Phase Induction Motor",
    functionDescription: "Squirrel-cage induction machine with six accessible stator terminals for external dual-voltage / star-delta switching.",
    standard: "IEC 60034-1",
  },
};

const SEQUENCE_EXPLANATIONS: Record<CircuitSequence, string> = {
  OFF: "System Isolated: All contactors (KM1, KM2, KM3) are open. Zero energy transfer to the stator windings. Safe for inspection.",
  STAR: "Star Starting Sequence: KM1 and KM2 energized. Phase voltage across windings is reduced to V_line / √3, reducing initial starting current to 1/3 of direct online values.",
  DELTA: "Delta Running Sequence: KM2 de-energized, KM1 and KM3 energized. Full line voltage is applied across each stator phase for continuous rated power and operational torque.",
};

export function ElectricalSchematic({ className }: { className?: string }) {
  const [sequence, setSequence] = React.useState<CircuitSequence>("STAR");
  const [inspectedComponent, setInspectedComponent] = React.useState<string | null>("KM1");

  const isStarActive = sequence === "STAR";
  const isDeltaActive = sequence === "DELTA";
  const isLineEnergized = sequence !== "OFF";

  const selectedDetail = inspectedComponent ? COMPONENT_DETAILS[inspectedComponent] : null;

  return (
    <div
      className={cn(
        "flex flex-col rounded-3xl border border-white/10 bg-[#0e111a]/95 p-5 sm:p-6 backdrop-blur-xl shadow-2xl transition-all",
        className
      )}
    >
      {/* Schematic Header & Sequence Controller */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-[#b4ff39] shadow-[0_0_8px_rgba(180,255,57,0.8)]" />
            <h3 className="font-mono text-xs font-bold tracking-wider text-[#f8fafc] uppercase">
              Topology // Star-Delta Starter Schematic
            </h3>
          </div>
          <p className="text-[11px] font-mono text-[#64748b] mt-0.5">
            IEC 60947 Standard Motor Control Circuit
          </p>
        </div>

        {/* Interactive Sequence Mode Switcher */}
        <div
          role="group"
          aria-label="Schematic Sequence Simulation States"
          className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#141824] p-1 text-[11px] font-mono"
        >
          {(["OFF", "STAR", "DELTA"] as CircuitSequence[]).map((mode) => {
            const isActive = sequence === mode;
            return (
              <button
                key={mode}
                type="button"
                onClick={() => setSequence(mode)}
                aria-pressed={isActive}
                className={cn(
                  "rounded-lg px-2.5 py-1 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#b4ff39]",
                  isActive
                    ? "bg-[#b4ff39] text-[#090a0f] font-bold shadow-[0_0_12px_rgba(180,255,57,0.35)]"
                    : "text-[#94a3b8] hover:text-[#f8fafc] hover:bg-white/5"
                )}
              >
                {mode}
              </button>
            );
          })}
        </div>
      </div>

      {/* SVG Engineering Diagram */}
      <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-[#07080c] p-3 sm:p-4">
        <svg
          viewBox="0 0 540 340"
          className="w-full h-auto select-none"
          role="img"
          aria-label={`Electrical schematic representing three-phase star-delta starter in ${sequence} state`}
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="schematicGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
            </pattern>

            {/* Glow Filter */}
            <filter id="limeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Grid */}
          <rect width="540" height="340" fill="url(#schematicGrid)" />

          {/* Busbars: L1, L2, L3 at Top */}
          <g id="incoming-busbars">
            <line x1="40" y1="30" x2="500" y2="30" stroke="#475569" strokeWidth="1.5" />
            <line x1="40" y1="45" x2="500" y2="45" stroke="#475569" strokeWidth="1.5" />
            <line x1="40" y1="60" x2="500" y2="60" stroke="#475569" strokeWidth="1.5" />

            <text x="15" y="34" fill="#94a3b8" fontSize="10" fontFamily="monospace">L1</text>
            <text x="15" y="49" fill="#94a3b8" fontSize="10" fontFamily="monospace">L2</text>
            <text x="15" y="64" fill="#94a3b8" fontSize="10" fontFamily="monospace">L3</text>
          </g>

          {/* Main Feeder Lines down through QF1, KM1, FR1 to Motor */}
          {/* Phase 1 (L1 -> U1) */}
          <path
            d="M 80 30 L 80 90 L 80 150 L 80 210 L 80 255"
            fill="none"
            stroke={isLineEnergized ? "#b4ff39" : "#334155"}
            strokeWidth="1.75"
            filter={isLineEnergized ? "url(#limeGlow)" : undefined}
          />
          {/* Phase 2 (L2 -> V1) */}
          <path
            d="M 120 45 L 120 90 L 120 150 L 120 210 L 120 255"
            fill="none"
            stroke={isLineEnergized ? "#b4ff39" : "#334155"}
            strokeWidth="1.75"
            filter={isLineEnergized ? "url(#limeGlow)" : undefined}
          />
          {/* Phase 3 (L3 -> W1) */}
          <path
            d="M 160 60 L 160 90 L 160 150 L 160 210 L 160 255"
            fill="none"
            stroke={isLineEnergized ? "#b4ff39" : "#334155"}
            strokeWidth="1.75"
            filter={isLineEnergized ? "url(#limeGlow)" : undefined}
          />

          {/* QF1 - Main Isolator Box */}
          <g
            id="comp-QF1"
            className="cursor-pointer transition-opacity hover:opacity-80"
            onClick={() => setInspectedComponent("QF1")}
            tabIndex={0}
            role="button"
            aria-label="Inspect QF1 Main Circuit Breaker"
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setInspectedComponent("QF1")}
          >
            <rect
              x="60"
              y="75"
              width="120"
              height="30"
              rx="6"
              fill={inspectedComponent === "QF1" ? "#181c2b" : "#111420"}
              stroke={inspectedComponent === "QF1" ? "#b4ff39" : "#334155"}
              strokeWidth="1.5"
            />
            <text x="120" y="94" textAnchor="middle" fill="#f8fafc" fontSize="11" fontFamily="monospace" fontWeight="bold">
              QF1 // MCCB
            </text>
          </g>

          {/* KM1 - Main Contactor Box */}
          <g
            id="comp-KM1"
            className="cursor-pointer transition-opacity hover:opacity-80"
            onClick={() => setInspectedComponent("KM1")}
            tabIndex={0}
            role="button"
            aria-label="Inspect KM1 Main Contactor"
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setInspectedComponent("KM1")}
          >
            <rect
              x="60"
              y="135"
              width="120"
              height="30"
              rx="6"
              fill={inspectedComponent === "KM1" ? "#181c2b" : "#111420"}
              stroke={isLineEnergized ? "#b4ff39" : "#334155"}
              strokeWidth="1.5"
            />
            <text x="120" y="154" textAnchor="middle" fill="#f8fafc" fontSize="11" fontFamily="monospace" fontWeight="bold">
              KM1 // MAIN
            </text>
          </g>

          {/* FR1 - Thermal Overload Relay */}
          <g
            id="comp-FR1"
            className="cursor-pointer transition-opacity hover:opacity-80"
            onClick={() => setInspectedComponent("FR1")}
            tabIndex={0}
            role="button"
            aria-label="Inspect FR1 Thermal Overload Relay"
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setInspectedComponent("FR1")}
          >
            <rect
              x="60"
              y="195"
              width="120"
              height="30"
              rx="6"
              fill={inspectedComponent === "FR1" ? "#181c2b" : "#111420"}
              stroke={inspectedComponent === "FR1" ? "#b4ff39" : "#334155"}
              strokeWidth="1.5"
            />
            <text x="120" y="214" textAnchor="middle" fill="#f8fafc" fontSize="11" fontFamily="monospace" fontWeight="bold">
              FR1 // OVERLOAD
            </text>
          </g>

          {/* Motor M1 Center */}
          <g
            id="comp-M1"
            className="cursor-pointer transition-opacity hover:opacity-80"
            onClick={() => setInspectedComponent("M1")}
            tabIndex={0}
            role="button"
            aria-label="Inspect M1 Induction Motor"
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setInspectedComponent("M1")}
          >
            <circle
              cx="120"
              cy="285"
              r="30"
              fill={inspectedComponent === "M1" ? "#181c2b" : "#111420"}
              stroke={isLineEnergized ? "#b4ff39" : "#334155"}
              strokeWidth="2"
            />
            <text x="120" y="282" textAnchor="middle" fill="#f8fafc" fontSize="12" fontFamily="monospace" fontWeight="bold">
              M1
            </text>
            <text x="120" y="296" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="monospace">
              3 ~ IND
            </text>

            {/* Terminal Indicators */}
            <text x="75" y="250" fill="#94a3b8" fontSize="8" fontFamily="monospace">U1</text>
            <text x="115" y="250" fill="#94a3b8" fontSize="8" fontFamily="monospace">V1</text>
            <text x="155" y="250" fill="#94a3b8" fontSize="8" fontFamily="monospace">W1</text>

            <text x="155" y="325" fill="#94a3b8" fontSize="8" fontFamily="monospace">U2</text>
            <text x="175" y="325" fill="#94a3b8" fontSize="8" fontFamily="monospace">V2</text>
            <text x="195" y="325" fill="#94a3b8" fontSize="8" fontFamily="monospace">W2</text>
          </g>

          {/* Secondary return paths from Motor (U2, V2, W2) branching to Delta (KM3) and Star (KM2) */}
          {/* Return path 1 */}
          <path
            d="M 150 285 L 260 285 L 260 165"
            fill="none"
            stroke={isStarActive || isDeltaActive ? "#b4ff39" : "#334155"}
            strokeWidth="1.5"
            strokeDasharray={isStarActive || isDeltaActive ? "none" : "2,2"}
          />
          {/* Return path 2 */}
          <path
            d="M 140 305 L 290 305 L 290 165"
            fill="none"
            stroke={isStarActive || isDeltaActive ? "#b4ff39" : "#334155"}
            strokeWidth="1.5"
            strokeDasharray={isStarActive || isDeltaActive ? "none" : "2,2"}
          />
          {/* Return path 3 */}
          <path
            d="M 120 315 L 320 315 L 320 165"
            fill="none"
            stroke={isStarActive || isDeltaActive ? "#b4ff39" : "#334155"}
            strokeWidth="1.5"
            strokeDasharray={isStarActive || isDeltaActive ? "none" : "2,2"}
          />

          {/* Delta Contactor KM3 Box */}
          <g
            id="comp-KM3"
            className="cursor-pointer transition-opacity hover:opacity-80"
            onClick={() => setInspectedComponent("KM3")}
            tabIndex={0}
            role="button"
            aria-label="Inspect KM3 Delta Contactor"
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setInspectedComponent("KM3")}
          >
            <rect
              x="240"
              y="135"
              width="100"
              height="30"
              rx="6"
              fill={inspectedComponent === "KM3" ? "#181c2b" : "#111420"}
              stroke={isDeltaActive ? "#b4ff39" : "#334155"}
              strokeWidth="1.5"
            />
            <text x="290" y="154" textAnchor="middle" fill="#f8fafc" fontSize="11" fontFamily="monospace" fontWeight="bold">
              KM3 // DELTA
            </text>
          </g>

          {/* Delta Loopback lines to Main incoming lines */}
          <path
            d="M 260 135 L 260 60"
            fill="none"
            stroke={isDeltaActive ? "#b4ff39" : "#334155"}
            strokeWidth="1.25"
          />
          <path
            d="M 290 135 L 290 45"
            fill="none"
            stroke={isDeltaActive ? "#b4ff39" : "#334155"}
            strokeWidth="1.25"
          />
          <path
            d="M 320 135 L 320 30"
            fill="none"
            stroke={isDeltaActive ? "#b4ff39" : "#334155"}
            strokeWidth="1.25"
          />

          {/* Star Contactor KM2 Box & Common Star Shorting Bar */}
          <g
            id="comp-KM2"
            className="cursor-pointer transition-opacity hover:opacity-80"
            onClick={() => setInspectedComponent("KM2")}
            tabIndex={0}
            role="button"
            aria-label="Inspect KM2 Star Contactor"
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setInspectedComponent("KM2")}
          >
            <rect
              x="380"
              y="135"
              width="100"
              height="30"
              rx="6"
              fill={inspectedComponent === "KM2" ? "#181c2b" : "#111420"}
              stroke={isStarActive ? "#b4ff39" : "#334155"}
              strokeWidth="1.5"
            />
            <text x="430" y="154" textAnchor="middle" fill="#f8fafc" fontSize="11" fontFamily="monospace" fontWeight="bold">
              KM2 // STAR
            </text>
          </g>

          {/* Star Connection Lines from Delta to Star Contactor */}
          <path
            d="M 260 165 L 400 165"
            fill="none"
            stroke={isStarActive ? "#b4ff39" : "#334155"}
            strokeWidth="1.25"
          />
          <path
            d="M 290 165 L 430 165"
            fill="none"
            stroke={isStarActive ? "#b4ff39" : "#334155"}
            strokeWidth="1.25"
          />
          <path
            d="M 320 165 L 460 165"
            fill="none"
            stroke={isStarActive ? "#b4ff39" : "#334155"}
            strokeWidth="1.25"
          />

          {/* Star Shorting Bridge at Top of KM2 */}
          <g id="star-shorting-bridge">
            <line x1="400" y1="135" x2="460" y2="135" stroke={isStarActive ? "#b4ff39" : "#334155"} strokeWidth="2.5" />
            <circle cx="400" cy="135" r="2.5" fill={isStarActive ? "#b4ff39" : "#475569"} />
            <circle cx="430" cy="135" r="2.5" fill={isStarActive ? "#b4ff39" : "#475569"} />
            <circle cx="460" cy="135" r="2.5" fill={isStarActive ? "#b4ff39" : "#475569"} />
            <text x="430" y="123" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="monospace">
              STAR NEUTRAL POINT
            </text>
          </g>

          {/* Connection Terminal Dots on Feeders */}
          <circle cx="80" cy="30" r="3" fill={isLineEnergized ? "#b4ff39" : "#475569"} />
          <circle cx="120" cy="45" r="3" fill={isLineEnergized ? "#b4ff39" : "#475569"} />
          <circle cx="160" cy="60" r="3" fill={isLineEnergized ? "#b4ff39" : "#475569"} />

          <circle cx="260" cy="60" r="3" fill={isDeltaActive ? "#b4ff39" : "#475569"} />
          <circle cx="290" cy="45" r="3" fill={isDeltaActive ? "#b4ff39" : "#475569"} />
          <circle cx="320" cy="30" r="3" fill={isDeltaActive ? "#b4ff39" : "#475569"} />
        </svg>
      </div>

      {/* Dynamic Sequence Explanation Callout */}
      <div className="mt-4 rounded-xl border border-white/10 bg-[#090a0f] p-3 text-xs leading-relaxed text-[#94a3b8]">
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#b4ff39] font-medium mb-1">
          <Zap className="h-3.5 w-3.5" />
          <span>CURRENT STAGE: {sequence} OPERATION</span>
        </div>
        <p className="text-[11px] text-[#cbd5e1]">{SEQUENCE_EXPLANATIONS[sequence]}</p>
      </div>

      {/* Component Inspector Panel */}
      {selectedDetail && (
        <div className="mt-3 rounded-xl border border-[#b4ff39]/20 bg-[#141824]/80 p-3.5 text-xs transition-all">
          <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="rounded bg-[#b4ff39]/10 border border-[#b4ff39]/30 px-2 py-0.5 font-mono text-[10px] font-bold text-[#b4ff39]">
                {selectedDetail.tag}
              </span>
              <span className="font-semibold text-[#f8fafc] text-xs">
                {selectedDetail.name}
              </span>
            </div>
            <span className="font-mono text-[10px] text-[#94a3b8]">
              {selectedDetail.standard}
            </span>
          </div>
          <p className="text-[11px] text-[#94a3b8] leading-relaxed">
            {selectedDetail.functionDescription}
          </p>
        </div>
      )}

      {/* Professional Electrical Visualization Disclaimer */}
      <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-[#64748b] pt-2 border-t border-white/5">
        <span className="flex items-center gap-1">
          <Info className="h-3 w-3" />
          <span>Technical topology visualization • Not for uncertified wiring</span>
        </span>
        <button
          type="button"
          onClick={() => {
            setSequence("STAR");
            setInspectedComponent("KM1");
          }}
          className="hover:text-[#f8fafc] flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="h-2.5 w-2.5" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
}
