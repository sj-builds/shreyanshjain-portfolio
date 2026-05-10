import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Volume2, VolumeX, Sun, Moon } from "lucide-react";

const NAV = [
  { href: "#hero", label: "01 / Home" },
  { href: "#about", label: "02 / About" },
  { href: "#skills", label: "03 / Skills" },
  { href: "#projects", label: "04 / Projects" },
  { href: "#experience", label: "05 / Experience" },
  { href: "#certs", label: "06 / Certs" },
  { href: "#contact", label: "07 / Contact" },
];

export function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [light, setLight] = useState(false);
  const [sound, setSound] = useState(false);

  useEffect(() => {
    const onS = () => setScrolled(window.scrollY > 12);
    onS();
    window.addEventListener("scroll", onS);
    return () => window.removeEventListener("scroll", onS);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("light", light);
  }, [light]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "py-3" : "py-5"}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div
          className={`flex items-center justify-between rounded-2xl px-4 py-2.5 ${scrolled ? "glass-strong" : "glass"}`}
        >
          <Link to="/" className="flex items-center gap-2 font-mono text-xs">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inset-0 rounded-full bg-[oklch(0.85_0.18_195)] animate-ping opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[oklch(0.85_0.18_195)]" />
            </span>
            <span className="tracking-[0.2em] text-foreground/90">
              SHREYANSH<span className="text-[oklch(0.85_0.18_195)]">.SYS</span>
            </span>
          </Link>
          <nav className="hidden lg:flex items-center gap-6 font-mono text-[11px] tracking-widest text-muted-foreground">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="hover:text-foreground transition-colors story-link"
              >
                {n.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSound((s) => !s)}
              aria-label="Toggle sound"
              className="p-2 rounded-lg hover:bg-white/5 transition"
            >
              {sound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setLight((l) => !l)}
              aria-label="Toggle theme"
              className="p-2 rounded-lg hover:bg-white/5 transition"
            >
              {light ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <a
              href="#contact"
              className="ml-1 hidden sm:inline-flex items-center font-mono text-[11px] tracking-widest px-3 py-1.5 rounded-lg border border-[oklch(0.72_0.22_295/0.5)] text-foreground hover:bg-[oklch(0.72_0.22_295/0.15)] transition"
            >
              INIT_CONTACT →
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
