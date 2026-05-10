import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";
import profile from "@/data/profile.json";
import { Cpu, Shield, Network } from "lucide-react";

const cards = [
  {
    icon: Shield,
    title: "Defensive Posture",
    body: "Hardening systems, threat modeling, and incident response with a builder’s mindset.",
  },
  {
    icon: Network,
    title: "Network Native",
    body: "From OSI layers to packet captures — I think in protocols.",
  },
  {
    icon: Cpu,
    title: "AI-augmented",
    body: "Pairing ML and automation with security tooling to scale judgment, not noise.",
  },
];

export function About() {
  return (
    <section id="about" className="relative py-28">
      <div className="absolute inset-0 bg-grid mask-fade-b opacity-50" />
      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeader
          index="02"
          kicker="ABOUT"
          title={
            <>
              Operating at the seam of{" "}
              <span className="text-gradient">code, networks &amp; intelligence.</span>
            </>
          }
          subtitle={profile.bio}
        />

        <div className="grid md:grid-cols-3 gap-5">
          {cards.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.1, duration: 0.7 }}
              className="group relative glass-strong rounded-2xl p-6 overflow-hidden"
            >
              <div
                className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition pointer-events-none"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.72 0.22 295 / 0.4), transparent 60%)",
                }}
              />
              <div className="relative">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[oklch(0.85_0.18_195/0.25)] to-[oklch(0.72_0.22_295/0.25)] border border-border flex items-center justify-center text-[oklch(0.85_0.18_195)] glow-cyan">
                  <c.icon className="w-5 h-5" />
                </div>
                <h3 className="mt-4 font-display text-xl">{c.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{c.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
