import { motion } from "framer-motion";
import { Award, ExternalLink } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import certs from "@/data/certifications.json";

export function Certifications() {
  return (
    <section id="certs" className="relative py-28">
      <div className="absolute inset-0 bg-grid mask-fade-b opacity-50" />
      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeader
          index="06"
          kicker="CERTIFICATIONS"
          title={
            <>
              Verified <span className="text-gradient">credentials.</span>
            </>
          }
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...certs].sort((a, b) => Number(b.year) - Number(a.year)).map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              whileHover={{ y: -6, rotateX: 4, rotateY: -4 }}
              style={{ transformStyle: "preserve-3d" }}
              className="group relative glass-strong rounded-2xl p-5 overflow-hidden"
              data-cursor="hover"
            >
              {/* Clickable overlay — sits above shimmer, below text */}
              {c.verifyUrl && (
                <a
                  href={c.verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 z-10 rounded-2xl focus-visible:ring-2 focus-visible:ring-[oklch(0.85_0.18_195)] focus-visible:outline-none"
                  aria-label={`View certificate: ${c.title}`}
                />
              )}

              <div className="absolute inset-0 opacity-40 shimmer pointer-events-none" />

              <div className="relative flex items-start justify-between">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[oklch(0.85_0.18_195/0.25)] to-[oklch(0.72_0.22_295/0.25)] border border-border flex items-center justify-center text-[oklch(0.85_0.18_195)]">
                  <Award className="w-5 h-5" />
                </div>
                <span className="font-mono text-[10px] text-muted-foreground tracking-widest">
                  {c.year}
                </span>
              </div>

              <h3 className="relative mt-4 font-display text-lg leading-tight">{c.title}</h3>
              <p className="relative mt-1 text-xs text-muted-foreground">{c.issuer}</p>

              <div className="relative mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-widest text-[oklch(0.85_0.18_195)]">
                  ID · {c.id}
                </span>
                {c.verifyUrl ? (
                  <ExternalLink
                    className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-60 transition-opacity duration-200"
                    aria-hidden
                  />
                ) : (
                  <span className="font-mono text-[9px] text-muted-foreground/40 tracking-widest">
                    OFFLINE
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}