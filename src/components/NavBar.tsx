import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV = [
  { href: "#hero", label: "01 / Home" },
  { href: "#about", label: "02 / About" },
  { href: "#skills", label: "03 / Skills" },
  { href: "#projects", label: "04 / Projects" },
  { href: "#experience", label: "05 / Experience" },
  { href: "#certs", label: "06 / Certifications" },
  { href: "#resume", label: "07 / Resume" },
  { href: "#contact", label: "08 / Contact" },
];

export function NavBar() {
  const [scrolled, setScrolled] = useState(false);

  const [open, setOpen] = useState(false);

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
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div
          className={`
          relative
          flex
          items-center
          justify-between
          rounded-full
          border
          border-white/10
          backdrop-blur-xl
          transition-all
          duration-300

          ${scrolled ? "glass-strong h-16" : "glass h-[17]"}
          `}
        >
          {/* LOGO */}

          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="
            flex
            items-center
            gap-3
            pl-5
            md:pl-7
            shrink-0
            "
          >
            <span className="relative flex h-3 w-3">
              <span
                className="
                absolute inset-0
                rounded-full
                bg-cyan-400
                animate-ping
                opacity-50
                "
              />

              <span
                className="
                relative
                rounded-full
                bg-cyan-400
                h-3
                w-3
                "
              />
            </span>

            <span
              className="
              font-mono
              text-sm
              sm:text-[15px]
              font-semibold
              tracking-[0.12em]
              text-white
              "
            >
              SHREYANSH
              <span className="text-cyan-400">.SYS</span>
            </span>
          </Link>

          {/* DESKTOP NAV */}

          <nav
            className="
            hidden
            lg:flex
            flex-1
            items-center
            justify-center
            gap-5
            xl:gap-8
            "
          >
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="
                relative
                font-mono
                text-xs
                tracking-[0.04em]
                text-zinc-300
                transition
                hover:text-cyan-300
                group
                "
              >
                {item.label}

                <span
                  className="
                  absolute
                  left-0
                  -bottom-2
                  h-px
                  w-0
                  bg-cyan-400
                  transition-all
                  group-hover:w-full
                  "
                />
              </a>
            ))}
          </nav>

          {/* MOBILE BUTTON */}

          <button
            onClick={() => setOpen((v) => !v)}
            className="
            lg:hidden
            mr-5
            text-cyan-300
            "
            aria-label="Toggle navigation"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* MOBILE MENU */}

          <AnimatePresence>
            {open && (
              <motion.nav
                initial={{
                  opacity: 0,
                  y: -12,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -12,
                }}
                className="
                absolute
                top-20
                left-0
                right-0

                rounded-2xl
                border
                border-white/10

                glass-strong
                backdrop-blur-xl

                p-5

                flex
                flex-col
                gap-5

                lg:hidden
                "
              >
                {NAV.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="
                    font-mono
                    text-sm
                    text-zinc-300
                    hover:text-cyan-300
                    transition
                    "
                  >
                    {item.label}
                  </a>
                ))}
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
