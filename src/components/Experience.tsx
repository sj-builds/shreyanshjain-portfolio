import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";
import profile from "@/data/profile.json";

export function Experience() {
  return (
    <section id="experience" className="relative py-28">
      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeader
          index="05"
          kicker="EXPERIENCE"
          title={
            <>
              Trajectory <span className="text-gradient">// timeline.</span>
            </>
          }
        />

        <div className="relative pl-6 sm:pl-10">
          <div className="absolute left-1.5 sm:left-3 top-2 bottom-2 w-px bg-gradient-to-b from-[oklch(0.85_0.18_195/0.6)] via-[oklch(0.72_0.22_295/0.4)] to-transparent" />
          <div className="space-y-10">
            {profile.experience.map((e, i) => (
              <motion.div
                key={e.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="relative"
              >
                <div className="absolute -left-[26px] sm:-left-[34px] top-2 w-3 h-3 rounded-full bg-[oklch(0.85_0.18_195)] glow-cyan" />
                <div className="glass-strong rounded-2xl p-6">
                  <div className="flex items-baseline justify-between gap-4 flex-wrap">
                    <h3 className="font-display text-2xl">{e.title}</h3>
                    <span className="font-mono text-xs tracking-widest text-[oklch(0.85_0.18_195)]">
                      {e.period}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground font-mono tracking-wide">
                    {e.org}
                  </div>
                  <p className="mt-3 text-foreground/80">{e.summary}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
