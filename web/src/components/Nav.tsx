import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { Command, Menu, X } from "lucide-react";
import { profile, sections } from "../data/content";
import { useActiveSection } from "../hooks/useActiveSection";
import { GithubIcon, LinkedinIcon } from "./icons";

const EASE = [0.16, 1, 0.3, 1] as const;
const ids = sections.map((s) => s.id);

export function Brand({ className = "" }: { className?: string }) {
  return (
    <span className={`text-[0.95rem] tracking-tight ${className}`}>
      <span className="font-bold">{profile.brand.strong}</span>
      <span className="font-light text-glow">{profile.brand.light}</span>
    </span>
  );
}

export default function Nav({ onOpenPalette }: { onOpenPalette: () => void }) {
  const active = useActiveSection(ids);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  // Some ao rolar para baixo, volta ao rolar para cima.
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > 400 && y > prev + 2 && !open);
    if (y < prev - 2) setHidden(false);
  });

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

  return (
    <>
      <motion.div
        className="fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-gradient-to-r from-glow via-glow-2 to-ember"
        style={{ scaleX: progress }}
        aria-hidden="true"
      />

      <motion.header
        className="fixed inset-x-0 top-0 z-40"
        animate={{ y: hidden ? "-110%" : "0%" }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        <nav
          aria-label="Principal"
          className={`container-x flex items-center justify-between gap-4 transition-[padding] duration-500 ease-out-expo ${scrolled ? "py-3" : "py-5"}`}
        >
          <a href="#home" aria-label="LTODev — voltar ao topo" className="relative z-10">
            <Brand />
          </a>

          <div
            className={`hidden items-center rounded-full p-1 transition-[background-color,box-shadow,backdrop-filter] duration-500 lg:flex ${
              scrolled ? "bg-abyss/70 shadow-[inset_0_0_0_1px_var(--color-line)] backdrop-blur-xl" : ""
            }`}
          >
            <ul className="flex items-center">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    aria-current={active === s.id ? "location" : undefined}
                    className={`relative block rounded-full px-3.5 py-1.5 text-[0.8rem] transition-colors duration-200 ${
                      active === s.id ? "text-void" : "text-mist hover:text-ink"
                    }`}
                  >
                    {active === s.id && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 -z-10 rounded-full bg-ink"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenPalette}
              className="hidden items-center gap-2 rounded-full py-2 pr-2 pl-4 text-sm text-mist ring-1 ring-line transition-colors ring-inset hover:text-ink hover:ring-white/20 md:flex"
            >
              Navegar
              <kbd className="flex items-center gap-0.5 rounded-full bg-white/5 px-2 py-0.5 font-mono text-[0.7rem]">
                {isMac ? <Command className="size-3" /> : "Ctrl"} K
              </kbd>
            </button>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              className="relative z-10 grid size-11 place-items-center rounded-full ring-1 ring-line ring-inset lg:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-30 flex flex-col bg-void/95 backdrop-blur-2xl lg:hidden"
            initial={{ clipPath: "circle(0% at calc(100% - 3rem) 2.5rem)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 3rem) 2.5rem)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 3rem) 2.5rem)" }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <ul className="container-x mt-28 flex flex-col gap-1">
              {sections.map((s, i) => (
                <motion.li
                  key={s.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10, transition: { duration: 0.15 } }}
                  transition={{ duration: 0.6, ease: EASE, delay: 0.15 + i * 0.05 }}
                >
                  <a
                    href={`#${s.id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-4 border-b border-line py-4 text-3xl font-light tracking-tight"
                  >
                    <span className="font-mono text-xs text-glow">0{i + 1}</span>
                    {s.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <motion.div
              className="container-x mt-auto flex gap-3 pb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.5 } }}
              exit={{ opacity: 0 }}
            >
              <a href={profile.github} target="_blank" rel="noreferrer" className="chip py-2">
                <GithubIcon className="size-4" /> GitHub
              </a>
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className="chip py-2">
                <LinkedinIcon className="size-4" /> LinkedIn
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
