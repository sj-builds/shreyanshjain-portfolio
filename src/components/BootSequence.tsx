import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function BootSequence({ onDone }: { onDone: () => void }) {
  const lines = [
    "> initializing kernel.sys ...",
    "> mounting /shreyansh/portfolio",
    "> loading neural shaders ✓",
    "> handshake @ secure-channel ✓",
    "> rendering holographic interface ...",
    "> ACCESS GRANTED",
  ];
  const [n, setN] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (n >= lines.length) {
      const t = setTimeout(() => {
        setDone(true);
        setTimeout(onDone, 500);
      }, 350);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setN((v) => v + 1), 240 + Math.random() * 220);
    return () => clearTimeout(t);
  }, [n]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] bg-background flex items-center justify-center bg-aurora"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0 bg-grid opacity-60" />
          <div className="relative w-[min(560px,90vw)] glass-strong rounded-2xl p-6 font-mono text-sm">
            <div className="flex items-center gap-2 pb-3 border-b border-border/60">
              <span className="w-2.5 h-2.5 rounded-full bg-[oklch(0.65_0.25_20)]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[oklch(0.85_0.18_85)]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[oklch(0.75_0.18_150)]" />
              <span className="ml-3 text-muted-foreground">shreyansh@sys — booting</span>
            </div>
            <div className="mt-4 space-y-1.5 min-h-[180px]">
              {lines.slice(0, n).map((l, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-foreground/85"
                >
                  {l}
                </motion.div>
              ))}
              {n < lines.length && (
                <div className="text-[oklch(0.85_0.18_195)]">
                  <span className="animate-blink">▌</span>
                </div>
              )}
            </div>
            <div className="mt-4 h-1 w-full bg-muted/40 rounded overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[oklch(0.85_0.18_195)] to-[oklch(0.72_0.22_295)]"
                animate={{ width: `${(n / lines.length) * 100}%` }}
                transition={{ ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
