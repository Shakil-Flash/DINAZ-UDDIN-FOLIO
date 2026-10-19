"use client";

import * as React from "react";
import { competencyCategories } from "@/config/competencies";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import {
  Zap,
  Wrench,
  Shield,
  Layers,
  FileText,
  Gauge,
  Cpu,
  Info,
  CheckCircle,
  HelpCircle,
} from "lucide-react";

export function CompetenciesSection() {
  const publishedCategories = React.useMemo(
    () => competencyCategories.filter((cat) => cat.isPublished),
    []
  );

  const [activeCategoryId, setActiveCategoryId] = React.useState<string>(
    publishedCategories[0]?.id || "electrical-fundamentals"
  );

  const activeCategory = React.useMemo(
    () =>
      publishedCategories.find((cat) => cat.id === activeCategoryId) ||
      publishedCategories[0],
    [publishedCategories, activeCategoryId]
  );

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case "circuit":
        return <Zap className="h-4 w-4" />;
      case "wrench":
        return <Wrench className="h-4 w-4" />;
      case "shield":
        return <Shield className="h-4 w-4" />;
      case "zap":
        return <Layers className="h-4 w-4" />;
      case "file-text":
        return <FileText className="h-4 w-4" />;
      case "gauge":
        return <Gauge className="h-4 w-4" />;
      case "cpu":
      default:
        return <Cpu className="h-4 w-4" />;
    }
  };

  return (
    <section
      id="competencies"
      className="relative border-t border-white/[0.08] bg-[#090a0f] py-24 px-4 sm:px-6 lg:px-8"
      aria-labelledby="competencies-title"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="[ 03 // TECHNICAL COMPETENCIES ]"
          title="Electrical Engineering Competencies Framework"
          description="Disciplined knowledge domains across electrical circuit analysis, installation safety, power switchgear, and technical documentation."
        />

        {/* Verification Status Disclosure Banner */}
        <div className="mb-10 rounded-2xl border border-white/10 bg-[#111420] p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#181c2b] text-[#b4ff39]">
              <Info className="h-4 w-4" />
            </div>
            <div className="text-xs">
              <span className="font-semibold text-[#f8fafc] block">
                Verification Transparency Model
              </span>
              <span className="text-[#94a3b8] leading-relaxed">
                Competencies reflect standard Electrical Diploma Engineering curriculum. Items are transparently marked as verified or awaiting personal confirmation.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#b4ff39]">
              <CheckCircle className="h-3.5 w-3.5" />
              <span>Confirmed</span>
            </div>
            <span className="text-white/20">•</span>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-amber-300">
              <HelpCircle className="h-3.5 w-3.5" />
              <span>Pending Confirmation</span>
            </div>
          </div>
        </div>

        {/* Category Navigation Tabs */}
        <div
          role="tablist"
          aria-label="Electrical Competency Categories"
          className="flex overflow-x-auto pb-4 gap-2 scrollbar-none no-scrollbar mb-8"
        >
          {publishedCategories.map((category) => {
            const isActive = category.id === activeCategoryId;
            return (
              <button
                key={category.id}
                role="tab"
                id={`tab-${category.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${category.id}`}
                onClick={() => setActiveCategoryId(category.id)}
                className={`flex items-center gap-2.5 shrink-0 rounded-xl px-4 py-2.5 text-xs font-mono transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b4ff39] ${
                  isActive
                    ? "bg-[#b4ff39] text-[#090a0f] font-semibold shadow-[0_0_15px_rgba(180,255,57,0.25)]"
                    : "border border-white/10 bg-[#111420] text-[#94a3b8] hover:text-[#f8fafc] hover:border-white/20"
                }`}
              >
                <span>{getCategoryIcon(category.iconName)}</span>
                <span>{category.number}.</span>
                <span>{category.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active Category Display Panel */}
        {activeCategory && (
          <div
            role="tabpanel"
            id={`panel-${activeCategory.id}`}
            aria-labelledby={`tab-${activeCategory.id}`}
            className="rounded-3xl border border-white/10 bg-[#111420]/80 p-6 sm:p-8 backdrop-blur-sm"
          >
            {/* Category Summary Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
              <div>
                <div className="flex items-center gap-2 text-[#b4ff39] font-mono text-xs uppercase mb-1">
                  <span>DOMAIN // {activeCategory.number}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#f8fafc]">
                  {activeCategory.title}
                </h3>
              </div>
              <p className="text-xs text-[#94a3b8] max-w-lg leading-relaxed">
                {activeCategory.description}
              </p>
            </div>

            {/* Competency Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeCategory.items
                .filter((item) => item.isPublished)
                .map((item) => {
                  const isConfirmed = item.status === "confirmed";

                  return (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-white/10 bg-[#090a0f]/90 p-5 flex flex-col justify-between transition-all hover:border-white/20 hover:bg-[#131724]"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <h4 className="text-sm font-semibold text-[#f8fafc] leading-snug">
                            {item.name}
                          </h4>
                          <Badge
                            variant={isConfirmed ? "lime" : "amber"}
                            size="sm"
                          >
                            {isConfirmed ? "Confirmed" : "Sample // Awaiting"}
                          </Badge>
                        </div>

                        <p className="text-xs text-[#94a3b8] leading-relaxed mb-4">
                          {item.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-white/5">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748b] block mb-2">
                          Core Principles:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {item.coreConcepts.map((concept) => (
                            <span
                              key={concept}
                              className="rounded border border-white/10 bg-[#161a29] px-2 py-0.5 text-[10px] font-mono text-[#94a3b8]"
                            >
                              {concept}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
