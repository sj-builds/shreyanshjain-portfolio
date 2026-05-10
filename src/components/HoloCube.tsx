import { motion } from "framer-motion";

/** CSS-only 3D rotating wireframe cube */
export function HoloCube({ size = 220 }: { size?: number }) {
  const half = size / 2;
  const faces = [
    { t: `rotateY(0deg) translateZ(${half}px)` },
    { t: `rotateY(90deg) translateZ(${half}px)` },
    { t: `rotateY(180deg) translateZ(${half}px)` },
    { t: `rotateY(-90deg) translateZ(${half}px)` },
    { t: `rotateX(90deg) translateZ(${half}px)` },
    { t: `rotateX(-90deg) translateZ(${half}px)` },
  ];
  return (
    <div className="relative" style={{ width: size, height: size, perspective: 1200 }}>
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateX: [15, 25, 15], rotateY: [0, 360], rotateZ: [0, 5, 0] }}
        transition={{
          rotateY: { duration: 22, repeat: Infinity, ease: "linear" },
          rotateX: { duration: 8, repeat: Infinity },
          rotateZ: { duration: 9, repeat: Infinity },
        }}
      >
        {faces.map((f, i) => (
          <div
            key={i}
            className="absolute inset-0 border border-[oklch(0.85_0.18_195/0.5)] bg-[oklch(0.72_0.22_295/0.05)]"
            style={{
              transform: f.t,
              boxShadow:
                "inset 0 0 60px oklch(0.72 0.22 295 / 0.25), 0 0 30px oklch(0.85 0.18 195 / 0.2)",
            }}
          >
            <div className="absolute inset-0 bg-grid-sm opacity-60" />
            <div className="absolute inset-2 border border-[oklch(0.72_0.22_295/0.4)]" />
            <div className="absolute inset-6 border border-[oklch(0.85_0.18_195/0.3)]" />
          </div>
        ))}
      </motion.div>
      {/* glow base */}
      <div
        className="absolute inset-0 -z-10 rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, oklch(0.72 0.22 295 / 0.4), transparent 60%)",
        }}
      />
    </div>
  );
}
