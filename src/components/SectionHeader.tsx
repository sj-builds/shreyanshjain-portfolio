import { ReactNode } from "react";

export function SectionHeader({
  index,
  kicker,
  title,
  subtitle,
}: {
  index: string;
  kicker: string;
  title: ReactNode;
  subtitle?: string;
}) {
  return (
    <div className="mb-12 lg:mb-16">
      <div className="font-mono text-[11px] tracking-[0.4em] text-[oklch(0.85_0.18_195)] flex items-center gap-3">
        <span className="w-8 h-px bg-[oklch(0.85_0.18_195)]" /> {index} / {kicker}
      </div>
      <h2 className="mt-4 font-display font-bold tracking-tight text-[clamp(2rem,5vw,4rem)] leading-[1] text-foreground">
        {title}
      </h2>
      {subtitle && <p className="mt-4 max-w-2xl text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
