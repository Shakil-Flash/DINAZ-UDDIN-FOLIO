import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArrowLeft, AlertCircle } from "lucide-react";

export default function ProjectNotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-[#090a0f] text-[#f8fafc]">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-24">
        <div className="max-w-md w-full rounded-3xl border border-white/10 bg-[#111420] p-8 text-center">
          <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto mb-4">
            <AlertCircle className="h-6 w-6" />
          </div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#b4ff39]">
            CASE STUDY STATUS
          </span>
          <h1 className="mt-2 text-2xl font-bold text-[#f8fafc]">
            Project Not Published
          </h1>
          <p className="mt-3 text-xs text-[#94a3b8] leading-relaxed">
            The requested project either does not exist or remains in draft/verification status. In accordance with strict portfolio integrity, unconfirmed case studies are withheld from publication.
          </p>
          <div className="mt-6">
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 rounded-xl bg-[#b4ff39] px-5 py-2.5 text-xs font-semibold text-[#090a0f] hover:bg-[#c4ff4d] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Return to Projects</span>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
