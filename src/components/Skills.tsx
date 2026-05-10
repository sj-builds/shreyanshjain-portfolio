import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";
import skills from "@/data/skills.json";

export function Skills() {
  return (
    <section id="skills" className="relative py-28">
      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeader
          index="03"
          kicker="SKILLS"
          title={
            <>
              Stack &amp; <span className="text-gradient">capabilities.</span>
            </>
          }
          subtitle="A composable arsenal of tools refined through projects, CTFs and constant rebuilding."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {skills.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.6 }}
              className="group relative glass rounded-2xl p-5 overflow-hidden hover:border-[oklch(0.85_0.18_195/0.5)] transition"
              data-cursor="hover"
            >
              <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground tracking-widest">
                <span>{s.category.toUpperCase()}</span>
                <span className="text-[oklch(0.85_0.18_195)]">{s.level}%</span>
              </div>
              <div className="mt-2 font-display text-2xl">{s.name}</div>
              <div className="mt-4 h-1.5 rounded-full bg-muted/40 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${s.level}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.1, delay: 0.1 + i * 0.05, ease: [0.2, 0.8, 0.2, 1] }}
                  className="h-full bg-gradient-to-r from-[oklch(0.85_0.18_195)] to-[oklch(0.72_0.22_295)]"
                />
              </div>
              <div
                className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle, oklch(0.72 0.22 295 / 0.35), transparent 60%)",
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
