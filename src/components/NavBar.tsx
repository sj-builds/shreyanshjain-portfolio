import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const NAV = [
  { href: "#hero", label: "01 / Home" },
  { href: "#about", label: "02 / About" },
  { href: "#skills", label: "03 / Skills" },
  { href: "#projects", label: "04 / Projects" },
  { href: "#experience", label: "05 / Experience" },
  { href: "#certs", label: "06 / Certifications" },
  { href: "#contact", label: "07 / Contact" },
];

export function NavBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);

    onScroll();

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div
          className={`flex items-center rounded-full border border-white/10 backdrop-blur-xl transition-all duration-300 ${
            scrolled ? "glass-strong h-16" : "glass h-[68px]"
          }`}
        >
          {/* Logo */}

          <Link to="/" className="flex items-center gap-3 pl-7 pr-10 shrink-0">
            <span className="relative flex h-3 w-3">
              <span className="absolute inset-0 rounded-full bg-cyan-400 animate-ping opacity-50" />
              <span className="relative rounded-full bg-cyan-400 h-3 w-3" />
            </span>

            <span className="font-mono text-[15px] font-semibold tracking-[0.12em] text-white">
              SHREYANSH
              <span className="text-cyan-400">.SYS</span>
            </span>
          </Link>

          {/* Navigation */}

          <nav className="flex flex-1 items-center justify-center gap-8 xl:gap-10">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="relative font-mono text-xs font tracking-[0.04em] text-zinc-300 transition-all duration-300 hover:text-cyan-300 group"
              >
                {item.label}

                <span className="absolute left-0 -bottom-2 h-px w-0 bg-cyan-400 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
