import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { projectRecords } from "@/config/projects";
import { siteConfig } from "@/config/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import { ArrowLeft, ArrowUpRight, FolderGit2, CheckCircle, Shield, Layers, Cpu } from "lucide-react";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  // Only statically prerender published and verified projects
  return projectRecords
    .filter((project) => project.status === "published")
    .map((project) => ({
      slug: project.slug,
    }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projectRecords.find((p) => p.slug === slug);

  if (!project || project.status !== "published") {
    return {
      title: `Project Not Found — ${siteConfig.name}`,
    };
  }

  return {
    title: `${project.title} — ${siteConfig.name}`,
    description: project.summary,
    openGraph: {
      title: `${project.title} — ${siteConfig.name}`,
      description: project.summary,
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = projectRecords.find((p) => p.slug === slug);

  // Guardrail: Draft templates or unverified records return 404
  if (!project || project.status !== "published") {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#090a0f] text-[#f8fafc]">
      <Header />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Breadcrumb Navigation */}
          <div className="mb-8">
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 font-mono text-xs text-[#94a3b8] hover:text-[#b4ff39] transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Case Studies System</span>
            </Link>
          </div>

          {/* Project Header */}
          <div className="border-b border-white/10 pb-8 mb-10">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="font-mono text-xs uppercase tracking-wider text-[#b4ff39]">
                {project.category}
              </span>
              <Badge variant="lime">
                {project.verificationStatus === "verified"
                  ? "Verified Production"
                  : "Draft"}
              </Badge>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#f8fafc] mb-4">
              {project.title}
            </h1>

            <p className="text-base sm:text-lg text-[#94a3b8] leading-relaxed max-w-2xl">
              {project.summary}
            </p>

            {/* Tools and Technologies */}
            <div className="mt-6 flex flex-wrap gap-2">
              {project.toolsAndEquipment.map((tool) => (
                <span
                  key={tool}
                  className="rounded-lg border border-white/10 bg-[#161a29] px-3 py-1 font-mono text-xs text-[#94a3b8]"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Technical Blueprint Placeholder */}
          <div
            className="relative mb-12 h-64 sm:h-80 w-full overflow-hidden rounded-3xl border border-white/10 bg-[#0c0e17] p-6 flex flex-col justify-between font-mono select-none"
            aria-hidden="true"
          >
            <div className="flex items-center justify-between text-xs text-[#64748b]">
              <span>SYSTEM ARCHITECTURE DIAGRAM</span>
              <span className="text-[#b4ff39]">STATUS: VERIFIED PRODUCTION</span>
            </div>

            <div className="my-auto flex flex-col items-center justify-center text-center">
              <div className="h-14 w-14 rounded-2xl bg-[#b4ff39]/10 border border-[#b4ff39]/30 flex items-center justify-center text-[#b4ff39] mb-3">
                <Layers className="h-7 w-7" />
              </div>
              <h2 className="text-sm sm:text-base font-bold text-[#f8fafc]">
                {project.imagePlaceholder.label}
              </h2>
              <span className="text-xs text-[#64748b] mt-1 max-w-sm">
                Next.js 16 App Router • React Server Components • GSAP Scoped Timelines • Vercel AI SDK
              </span>
            </div>

            <div className="flex items-center justify-between text-[10px] text-[#64748b] border-t border-white/5 pt-2">
              <span>DOC REF: {project.id}</span>
              <span>VERIFIED BY: DINAZ UDDIN</span>
            </div>
          </div>

          {/* In-Depth Case Study Sections */}
          <div className="space-y-10">
            {/* The Objective / Problem */}
            <section className="rounded-2xl border border-white/10 bg-[#111420] p-6 sm:p-8">
              <div className="flex items-center gap-2 font-mono text-xs text-[#b4ff39] uppercase mb-2">
                <Shield className="h-4 w-4" />
                <span>01 // Problem & Technical Requirements</span>
              </div>
              <h2 className="text-xl font-bold text-[#f8fafc] mb-3">
                Engineering Challenge
              </h2>
              <p className="text-sm text-[#94a3b8] leading-relaxed">
                {project.problem}
              </p>
            </section>

            {/* The Methodology / Approach */}
            <section className="rounded-2xl border border-white/10 bg-[#111420] p-6 sm:p-8">
              <div className="flex items-center gap-2 font-mono text-xs text-[#b4ff39] uppercase mb-2">
                <Cpu className="h-4 w-4" />
                <span>02 // Architecture & Implementation Approach</span>
              </div>
              <h2 className="text-xl font-bold text-[#f8fafc] mb-3">
                Disciplined Technical Methodology
              </h2>
              <p className="text-sm text-[#94a3b8] leading-relaxed">
                {project.approach}
              </p>
            </section>

            {/* Verified Outcome */}
            {project.outcome && (
              <section className="rounded-2xl border border-[#b4ff39]/30 bg-[#b4ff39]/5 p-6 sm:p-8">
                <div className="flex items-center gap-2 font-mono text-xs text-[#b4ff39] uppercase mb-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>03 // Verified Technical Outcome</span>
                </div>
                <h2 className="text-xl font-bold text-[#f8fafc] mb-3">
                  Validated Results
                </h2>
                <p className="text-sm text-[#f8fafc] leading-relaxed">
                  {project.outcome}
                </p>
              </section>
            )}

            {/* Project Links / Repository */}
            {project.links && project.links.length > 0 && (
              <div className="flex items-center gap-4 pt-4">
                {project.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#b4ff39] px-6 py-3 text-xs font-semibold text-[#090a0f] hover:bg-[#c4ff4d] transition-colors"
                  >
                    <FolderGit2 className="h-4 w-4" />
                    <span>{link.label}</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
