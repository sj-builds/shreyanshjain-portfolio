import { motion } from "framer-motion";
import { Download, FileText } from "lucide-react";

import { SectionHeader } from "./SectionHeader";
import profile from "@/data/profile.json";

const glowStyle = {
  background: "radial-gradient(circle, oklch(0.72 0.22 295 / 0.45), transparent 60%)",
} as const;

export function Resume() {
  const resume = profile.resume;

  if (!resume?.url) return null;

  const isExternal = resume.url.startsWith("http://") || resume.url.startsWith("https://");

  return (
    <section id="resume" aria-labelledby="resume-heading" className="relative py-28">
      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeader
          index="07"
          kicker="RESUME"
          title={
            <span id="resume-heading">
              Download the <span className="text-gradient">dossier.</span>
            </span>
          }
        />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
          }}
          viewport={{ once: true, amount: 0.25 }}
          className="relative grid items-center gap-8 overflow-hidden rounded-3xl glass-strong p-8 lg:grid-cols-[1fr_auto] lg:p-10"
        >
          {/* Background Glow */}
          <div
            aria-hidden="true"
            className="absolute -right-20 -top-20 h-72 w-72 rounded-full blur-3xl"
            style={glowStyle}
          />

          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-center gap-3 font-mono text-xs tracking-[0.2em] text-[oklch(0.85_0.18_195)] uppercase">
              <FileText className="h-4 w-4" aria-hidden="true" />
              <span>{resume.fileName}</span>
            </div>

            <h3 className="mt-4 font-display text-3xl leading-tight md:text-4xl">{resume.title}</h3>

            <p className="mt-4 max-w-2xl text-muted-foreground">{resume.description}</p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                Updated {resume.lastUpdated}
              </span>

              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                ATS Optimized
              </span>

              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                PDF
              </span>
            </div>
          </div>

          {/* Download */}
          <div className="relative z-10">
            <a
              href={resume.url}
              download={!isExternal ? resume.fileName : undefined}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              aria-label="Download Shreyansh Jain Resume PDF"
              data-cursor="hover"
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-gradient-to-r
                from-[oklch(0.85_0.18_195)]
                to-[oklch(0.72_0.22_295)]
                px-6
                py-3
                font-mono
                text-xs
                font-medium
                tracking-[0.2em]
                text-background
                shadow-lg
                transition-all
                duration-300
                hover:scale-[1.03]
                hover:shadow-xl
                active:scale-95
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[oklch(0.85_0.18_195)]
                focus-visible:ring-offset-2
                focus-visible:ring-offset-background
              "
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              DOWNLOAD PDF
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
