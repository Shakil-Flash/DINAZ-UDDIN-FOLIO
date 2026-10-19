"use client";

import * as React from "react";
import Link from "next/link";
import { projectRecords } from "@/config/projects";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { ArrowUpRight, FolderGit2, AlertTriangle, Layers, PlusCircle } from "lucide-react";

export function ProjectsSection() {
  const [filter, setFilter] = React.useState<"all" | "verified" | "drafts">("all");

  const filteredProjects = React.useMemo(() => {
    if (filter === "verified") {
      return projectRecords.filter((p) => p.verificationStatus === "verified");
    }
    if (filter === "drafts") {
      return projectRecords.filter((p) => p.verificationStatus === "sample_template");
    }
    return projectRecords;
  }, [filter]);

  return (
    <section
      id="projects"
      className="relative border-t border-white/[0.08] bg-[#0c0e17] py-24 px-4 sm:px-6 lg:px-8"
      aria-labelledby="projects-title"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="[ 04 // CASE STUDIES SYSTEM ]"
          title="Engineering Project Case Studies & Blueprints"
          description="Rigorous project specifications and case-study architectures. Designed for verified electrical installations, load calculations, and technical systems."
        />

        {/* Filter Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`rounded-lg px-3.5 py-1.5 font-mono text-xs transition-all ${
                filter === "all"
                  ? "bg-[#b4ff39] text-[#090a0f] font-semibold"
                  : "border border-white/10 bg-[#111420] text-[#94a3b8] hover:text-[#f8fafc]"
              }`}
            >
              All Records ({projectRecords.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("verified")}
              className={`rounded-lg px-3.5 py-1.5 font-mono text-xs transition-all ${
                filter === "verified"
                  ? "bg-[#b4ff39] text-[#090a0f] font-semibold"
                  : "border border-white/10 bg-[#111420] text-[#94a3b8] hover:text-[#f8fafc]"
              }`}
            >
              Verified Only ({projectRecords.filter((p) => p.verificationStatus === "verified").length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("drafts")}
              className={`rounded-lg px-3.5 py-1.5 font-mono text-xs transition-all ${
                filter === "drafts"
                  ? "bg-[#b4ff39] text-[#090a0f] font-semibold"
                  : "border border-white/10 bg-[#111420] text-[#94a3b8] hover:text-[#f8fafc]"
              }`}
            >
              Draft Schemas ({projectRecords.filter((p) => p.verificationStatus === "sample_template").length})
            </button>
          </div>

          <div className="text-[11px] font-mono text-[#64748b]">
            Showing {filteredProjects.length} case study architecture(s)
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {filteredProjects.map((project) => {
            const isVerified = project.verificationStatus === "verified";

            return (
              <article
                key={project.id}
                className="flex flex-col justify-between rounded-3xl border border-white/10 bg-[#111420] p-6 sm:p-8 transition-all hover:border-white/20 hover:bg-[#141826]"
              >
                <div>
                  {/* Category & Status Eyebrow */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <span className="font-mono text-xs uppercase tracking-wider text-[#b4ff39]">
                      {project.category}
                    </span>
                    <Badge variant={isVerified ? "lime" : "amber"}>
                      {isVerified ? "Verified Production" : "Draft Schema Template"}
                    </Badge>
                  </div>

                  {/* Technical Visual Placeholder */}
                  <div
                    className="relative mb-6 h-48 w-full overflow-hidden rounded-2xl border border-white/10 bg-[#090a0f] p-4 flex flex-col justify-between font-mono select-none"
                    aria-hidden="true"
                  >
                    <div className="flex items-center justify-between text-[10px] text-[#64748b]">
                      <span>SLUG // {project.slug}</span>
                      <span className="text-[#b4ff39]">STATUS: {project.status.toUpperCase()}</span>
                    </div>

                    <div className="my-auto flex flex-col items-center justify-center text-center">
                      <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#94a3b8] mb-2">
                        <Layers className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-semibold text-[#f8fafc] tracking-wider">
                        {project.imagePlaceholder.label}
                      </span>
                      <span className="text-[10px] text-[#64748b] mt-1">
                        Architectural Blueprint & Schematic Layer
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[9px] text-[#64748b] border-t border-white/5 pt-2">
                      <span>DOC REF: {project.id}</span>
                      <span>FORMAT: VECTOR / CAD / CODE</span>
                    </div>
                  </div>

                  {/* Title & Summary */}
                  <h3 className="text-xl sm:text-2xl font-bold text-[#f8fafc] mb-2">
                    {project.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed mb-6">
                    {project.summary}
                  </p>

                  {/* Problem & Approach Breakdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 pt-4 border-t border-white/5">
                    <div className="rounded-xl border border-white/5 bg-[#090a0f]/60 p-4">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[#f8fafc] block mb-1">
                        Problem / Objective:
                      </span>
                      <p className="text-xs text-[#94a3b8] leading-relaxed">
                        {project.problem}
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/5 bg-[#090a0f]/60 p-4">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[#b4ff39] block mb-1">
                        Engineering Approach:
                      </span>
                      <p className="text-xs text-[#94a3b8] leading-relaxed">
                        {project.approach}
                      </p>
                    </div>
                  </div>

                  {/* Outcome (Only rendered when verified) */}
                  {project.outcome ? (
                    <div className="rounded-xl border border-[#b4ff39]/20 bg-[#b4ff39]/5 p-4 mb-6">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[#b4ff39] block mb-1 font-semibold">
                        Verified Outcome:
                      </span>
                      <p className="text-xs text-[#f8fafc] leading-relaxed">
                        {project.outcome}
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-white/5 bg-[#090a0f]/30 p-3 mb-6 flex items-center gap-2 text-xs text-[#64748b]">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      <span>Outcome pending verified field data from Dinaz Uddin.</span>
                    </div>
                  )}
                </div>

                {/* Footer: Tools & Links */}
                <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-1.5">
                    {project.toolsAndEquipment.map((tool) => (
                      <span
                        key={tool}
                        className="rounded border border-white/10 bg-[#161a29] px-2 py-0.5 text-[10px] font-mono text-[#94a3b8]"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    {project.status === "published" && (
                      <Link
                        href={`/projects/${project.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-mono text-[#f8fafc] hover:text-[#b4ff39] transition-colors"
                      >
                        <span>Case Study Blueprint</span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-[#b4ff39]" />
                      </Link>
                    )}

                    {project.links && project.links.length > 0 && (
                      <div className="flex items-center gap-2">
                        {project.links.map((link) => (
                          <a
                            key={link.url}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-mono text-[#b4ff39] hover:underline"
                          >
                            <FolderGit2 className="h-3.5 w-3.5" />
                            <span>{link.label}</span>
                            <ArrowUpRight className="h-3 w-3" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}

          {/* Submission Placeholder Card for Future Genuine Projects */}
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/15 bg-[#111420]/30 p-8 text-center min-h-[380px]">
            <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#b4ff39] mb-4">
              <PlusCircle className="h-6 w-6" />
            </div>
            <h4 className="text-base font-semibold text-[#f8fafc] mb-1">
              Case Study Intake Architecture
            </h4>
            <p className="text-xs text-[#94a3b8] max-w-sm mb-4 leading-relaxed">
              Designed to host genuine electrical installations, transformer maintenance logs, single-line diagrams, and substation commissioning records.
            </p>
            <span className="font-mono text-[11px] text-[#64748b]">
              SCHEMA READY FOR VERIFIED PROJECTS
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
