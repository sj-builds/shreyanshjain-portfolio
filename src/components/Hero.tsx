import { motion } from "framer-motion";
import { Typewriter } from "./Typewriter";
import { ParticleField } from "./ParticleField";
import { HoloCube } from "./HoloCube";
import profile from "@/data/profile.json";
import { ArrowRight, Terminal } from "lucide-react";
import { useEffect, useState } from "react";

export function Hero() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      setMouse({ x, y });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen w-full overflow-hidden pt-24">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-aurora" />
      <div className="absolute inset-0 bg-grid mask-fade-b" />
      <div className="absolute inset-0">
        <ParticleField density={70} />
      </div>

      {/* Floating glass panels */}
      <motion.div
        className="hidden md:block absolute top-32 left-10 w-56 glass-strong rounded-xl p-4 font-mono text-[11px]"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
        style={{ transform: `translate(${mouse.x * 14}px, ${mouse.y * 14}px)` }}
      >
        <div className="flex items-center justify-between text-muted-foreground">
          <span>SYSTEM // STATUS</span>
          <span className="w-2 h-2 rounded-full bg-[oklch(0.75_0.18_150)] animate-pulse-glow" />
        </div>
        <div className="mt-3 space-y-1.5 text-foreground/80">
          <div className="flex justify-between">
            <span>UPTIME</span>
            <span className="text-[oklch(0.85_0.18_195)]">99.97%</span>
          </div>
          <div className="flex justify-between">
            <span>NODES</span>
            <span>17 / 17</span>
          </div>
          <div className="flex justify-between">
            <span>THREATS</span>
            <span className="text-[oklch(0.75_0.18_150)]">0</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="hidden md:block absolute bottom-28 right-12 w-64 glass-strong rounded-xl p-4 font-mono text-[11px]"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 7, repeat: Infinity }}
        style={{ transform: `translate(${mouse.x * -18}px, ${mouse.y * -18}px)` }}
      >
        <div className="flex items-center gap-2 text-muted-foreground">
          <Terminal className="w-3.5 h-3.5" />
          <span>ssh shreyansh@core</span>
        </div>
        <pre className="mt-3 text-foreground/80 text-[10.5px] leading-relaxed">
          {`> auth_key: ************
> handshake: OK
> session   : ACTIVE
> latency   : 12ms`}
        </pre>
      </motion.div>

      {/* Center content */}
      <div className="relative mx-auto max-w-7xl px-6 pt-10 lg:pt-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="font-mono text-[11px] tracking-[0.4em] text-[oklch(0.85_0.18_195)] flex items-center gap-3">
            <span className="w-8 h-px bg-[oklch(0.85_0.18_195)]" /> PORTFOLIO_v3.0 // CYBER_OS
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 items-center mt-6">
          <div>
            <h1 className="font-display font-bold leading-[0.9] tracking-tight">
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
                className="block text-[clamp(3rem,9vw,8.5rem)] text-gradient text-glow-violet"
              >
                SHREYANSH
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
                className="block text-[clamp(3rem,9vw,8.5rem)] text-foreground/95 -mt-2 sm:-mt-4"
              >
                JAIN<span className="text-[oklch(0.85_0.18_195)]">.</span>
              </motion.span>
            </h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 flex flex-wrap gap-2 font-mono text-[11px] tracking-widest"
            >
              {profile.roles.map((r) => (
                <span
                  key={r}
                  className="px-3 py-1.5 rounded-full glass border border-border/70 text-foreground/80"
                >
                  {r.toUpperCase()}
                </span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-8 text-base sm:text-lg text-muted-foreground max-w-xl"
            >
              <span className="font-mono text-[oklch(0.85_0.18_195)]">$ specialty —&gt; </span>
              <Typewriter words={profile.typing} />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-5 text-foreground/70 max-w-xl"
            >
              {profile.bio}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="mt-9 flex flex-wrap gap-3"
            >
              <a
                href="#about"
                data-cursor="hover"
                className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-xl font-mono text-xs tracking-[0.2em] text-background bg-gradient-to-r from-[oklch(0.85_0.18_195)] to-[oklch(0.72_0.22_295)] glow-violet hover:scale-[1.03] transition"
              >
                ENTER_SYSTEM <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </a>
              <a
                href="#projects"
                data-cursor="hover"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-mono text-xs tracking-[0.2em] text-foreground border border-border hover:border-[oklch(0.85_0.18_195)] hover:text-[oklch(0.85_0.18_195)] transition"
              >
                VIEW_PROJECTS
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="relative flex items-center justify-center"
            style={{ transform: `translate(${mouse.x * 22}px, ${mouse.y * 22}px)` }}
          >
            <CyberGlobe />
            <div className="absolute">
              <HoloCube size={180} />
            </div>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <div className="mt-16 flex items-center justify-between font-mono text-[10px] tracking-widest text-muted-foreground">
          <span>SCROLL ↓ TO_DECRYPT</span>
          <span>SECTOR / 01</span>
        </div>
      </div>
    </section>
  );
}

function CyberGlobe() {
  return (
    <div className="relative w-[min(420px,80vw)] aspect-square">
      <div className="absolute inset-0 rounded-full border border-[oklch(0.85_0.18_195/0.3)] animate-spin-slow" />
      <div
        className="absolute inset-6 rounded-full border border-[oklch(0.72_0.22_295/0.35)] animate-spin-slow"
        style={{ animationDirection: "reverse", animationDuration: "40s" }}
      />
      <div
        className="absolute inset-12 rounded-full border border-dashed border-[oklch(0.85_0.18_195/0.25)] animate-spin-slow"
        style={{ animationDuration: "60s" }}
      />
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, oklch(0.72 0.22 295 / 0.25), transparent 60%)",
        }}
      />
      {/* orbit dots */}
      {[0, 60, 120, 180, 240, 300].map((deg, i) => (
        <div
          key={i}
          className="absolute inset-0 animate-spin-slow"
          style={{ animationDuration: `${20 + i * 4}s`, transform: `rotate(${deg}deg)` }}
        >
          <div className="absolute -top-1 left-1/2 w-2 h-2 -translate-x-1/2 rounded-full bg-[oklch(0.85_0.18_195)] glow-cyan" />
        </div>
      ))}
    </div>
  );
}
