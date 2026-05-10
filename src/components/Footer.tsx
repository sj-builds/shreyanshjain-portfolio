import profile from "@/data/profile.json";

export function Footer() {
  return (
    <footer className="relative border-t border-border/60 mt-10">
      <div className="mx-auto max-w-7xl px-6 py-10 flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] tracking-widest text-muted-foreground">
        <div>
          © {new Date().getFullYear()} · {profile.name.toUpperCase()} · ALL RIGHTS RESERVED
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[oklch(0.75_0.18_150)] animate-pulse-glow" />
          <span>LIVE · SECURE</span>
        </div>
      </div>
    </footer>
  );
}
