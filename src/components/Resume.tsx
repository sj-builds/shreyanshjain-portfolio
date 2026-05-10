import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";
import profile from "@/data/profile.json";
import { Download, FileText } from "lucide-react";

export function Resume() {
  return (
    <section id="resume" className="relative py-28">
      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeader
          index="07"
          kicker="RESUME"
          title={
            <>
              Download the <span className="text-gradient">dossier.</span>
            </>
          }
        />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-strong rounded-3xl p-8 lg:p-10 grid md:grid-cols-[1fr_auto] items-center gap-6 overflow-hidden relative"
        >
          <div
            className="absolute -top-20 -right-20 w-72 h-72 rounded-full blur-3xl"
            style={{
              background: "radial-gradient(circle, oklch(0.72 0.22 295 / 0.45), transparent 60%)",
            }}
          />
          <div className="relative">
            <div className="flex items-center gap-3 text-[oklch(0.85_0.18_195)] font-mono text-xs tracking-widest">
              <FileText className="w-4 h-4" /> SHREYANSH_JAIN_RESUME.PDF
            </div>
            <h3 className="mt-3 font-display text-3xl">
              A condensed map of skills, projects, and credentials.
            </h3>
            <p className="mt-3 text-muted-foreground max-w-xl">
              Updated for 2025. Includes role-fit summary, technical stack and security focus areas.
            </p>
          </div>
          <a
            href={profile.resumeUrl}
            download="SHREYANSH_JAIN_RESUME.pdf"
            data-cursor="hover"
            className="relative inline-flex items-center gap-2 px-6 py-3 rounded-xl font-mono text-xs tracking-[0.2em] text-background bg-gradient-to-r from-[oklch(0.85_0.18_195)] to-[oklch(0.72_0.22_295)] glow-violet hover:scale-[1.03] transition"
          >
            <Download className="w-4 h-4" /> DOWNLOAD_PDF
          </a>
        </motion.div>
      </div>
    </section>
  );
}
