import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";
import projects from "@/data/projects.json";
import { ArrowUpRight } from "lucide-react";

export function Projects() {
  return (
    <section id="projects" className="relative py-28">
      <div className="absolute inset-0 bg-grid mask-fade-b opacity-50" />
      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeader
          index="04"
          kicker="PROJECTS"
          title={
            <>
              Selected <span className="text-gradient">builds &amp; experiments.</span>
            </>
          }
          subtitle="Tools and systems engineered for security, data, and intelligent automation."
        />

        <div className="grid md:grid-cols-2 gap-5">
          {projects.map((p, i) => (
            <motion.a
              key={p.title}
              href="#"
              data-cursor="hover"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.08, duration: 0.7 }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-3xl glass-strong p-7 min-h-[300px] flex flex-col justify-between"
            >
              {/* animated glow */}
              <div
                className="absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background:
                    "conic-gradient(from 120deg, oklch(0.72 0.22 295 / 0.5), oklch(0.85 0.18 195 / 0.5), transparent 60%)",
                  filter: "blur(24px)",
                }}
              />
              <div className="absolute inset-0 bg-grid-sm opacity-30" />
              <div
                className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-60 group-hover:opacity-100 transition"
                style={{
                  background:
                    "radial-gradient(circle, oklch(0.72 0.22 295 / 0.45), transparent 60%)",
                }}
              />

              <div className="relative">
                <div className="flex items-center justify-between font-mono text-[10px] tracking-widest text-muted-foreground">
                  <span>{p.tag}</span>
                  <span className="px-2 py-0.5 rounded-full border border-[oklch(0.85_0.18_195/0.4)] text-[oklch(0.85_0.18_195)]">
                    {p.status}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-3xl sm:text-4xl tracking-tight">{p.title}</h3>
                <p className="mt-3 text-muted-foreground max-w-md">{p.summary}</p>
              </div>
              <div className="relative mt-8 flex items-center justify-between">
                <div className="flex flex-wrap gap-2 font-mono text-[10px]">
                  {p.tech.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-md bg-white/5 border border-border/60"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:border-[oklch(0.85_0.18_195)] group-hover:text-[oklch(0.85_0.18_195)] transition">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
