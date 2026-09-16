import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { profile } from "../data/content";
import { GithubIcon, LinkedinIcon } from "./icons";
import { Magnetic } from "./fx";
import { useMedia } from "../hooks/useMedia";

const Singularity = lazy(() => import("../three/Singularity"));

const EASE = [0.16, 1, 0.3, 1] as const;

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

function Letters({ text, delay, className = "" }: { text: string; delay: number; className?: string }) {
  const reduce = useReducedMotion();
  let n = 0;
  return (
    <span className={`block pb-[0.08em] ${className}`} aria-hidden="true">
      {text.split(" ").map((word, w) => (
        <span key={w}>
          <span className="inline-block overflow-hidden whitespace-nowrap pb-[0.08em] align-bottom">
            {Array.from(word).map((ch) => {
              const i = n++;
              return (
                <motion.span
                  key={i}
                  className="inline-block will-change-transform"
                  initial={reduce ? { opacity: 0 } : { y: "110%", rotate: 6 }}
                  animate={reduce ? { opacity: 1 } : { y: "0%", rotate: 0 }}
                  transition={{ duration: reduce ? 0.3 : 1.1, ease: EASE, delay: reduce ? 0 : delay + i * 0.035 }}
                >
                  {ch}
                </motion.span>
              );
            })}
          </span>
          {w < text.split(" ").length - 1 && " "}
        </span>
      ))}
    </span>
  );
}

function RoleTicker() {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % profile.roles.length), 2600);
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <span className="relative inline-grid h-[1.4em] overflow-hidden align-bottom">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={profile.roles[i]}
          className="whitespace-nowrap text-ink"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.55, ease: EASE }}
        >
          {profile.roles[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function Hero() {
  const section = useRef<HTMLElement>(null);
  const scrollRef = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const reduce = useReducedMotion();
  const mobile = useMedia("(max-width: 767px)");
  const [sceneReady, setSceneReady] = useState(false);
  const [inView, setInView] = useState(true);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end start"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => (scrollRef.current = v));
  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -140]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.15]);

  // Monta a cena 3D só depois que a página está interativa.
  useEffect(() => {
    if (!hasWebGL()) return;
    const start = () => setSceneReady(true);
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: object) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(start, { timeout: 1200 });
    else window.setTimeout(start, 300);
  }, []);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <header ref={section} id="home" className="relative isolate flex min-h-svh flex-col overflow-hidden">
      {/* Fundo: brilho estático (poster) + cena 3D por cima quando carregar. */}
      <motion.div className="absolute inset-0 -z-10" style={{ scale: sceneScale }} aria-hidden="true">
        <div className="absolute left-1/2 top-[52%] h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(143,179,255,.18),rgba(196,181,253,.06)_40%,transparent_68%)] md:left-[72%]" />
        <motion.div
          className="absolute inset-0 md:left-[40%] md:-right-[4%]"
          initial={{ opacity: 0 }}
          animate={{ opacity: sceneReady ? 1 : 0 }}
          transition={{ duration: 1.6, ease: "easeOut" }}
        >
          {sceneReady && (
            <Suspense fallback={null}>
              <Singularity scroll={scrollRef} pointer={pointer} mobile={mobile} paused={!!reduce || !inView} />
            </Suspense>
          )}
        </motion.div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,5,10,.85)_0%,rgba(4,5,10,.55)_32%,transparent_62%)] max-md:bg-[linear-gradient(180deg,rgba(4,5,10,.2)_0%,rgba(4,5,10,.6)_50%,rgba(4,5,10,.2)_100%)]" />
      </motion.div>

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="container-x relative flex flex-1 flex-col justify-center pt-32 pb-24 md:pt-28"
      >
        <motion.p
          className="eyebrow mb-8 flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-glow opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-glow" />
          </span>
          Portfólio · {profile.brand.strong}
          {profile.brand.light}
        </motion.p>

        <h1
          aria-label={profile.name}
          className="max-w-[14ch] text-[clamp(2.6rem,6.6vw,6.4rem)] font-medium leading-[0.92] tracking-[-0.04em]"
        >
          <Letters text={profile.firstName} delay={0.15} />
          <Letters
            text={profile.lastName}
            delay={0.45}
            className="font-serif text-[0.78em] font-normal italic tracking-[-0.02em] text-[#bccdff]"
          />
        </h1>

        <motion.div
          className="mt-9 grid max-w-md gap-7"
          initial={{ opacity: 0, y: reduce ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.9 }}
        >
          <p className="text-[0.95rem] leading-relaxed text-mist md:text-base">{profile.lead}</p>

          <div className="flex flex-wrap items-center gap-3">
            <Magnetic>
              <a
                href="#contato"
                className="group inline-flex items-center gap-2 rounded-full bg-ink py-2 pr-2 pl-5 text-sm font-medium text-void transition-colors duration-200 hover:bg-white"
              >
                Fale comigo
                <span className="grid size-7 place-items-center rounded-full bg-void text-ink transition-transform duration-300 ease-out-expo group-hover:rotate-45">
                  <ArrowUpRight className="size-3.5" />
                </span>
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm text-ink ring-1 ring-line transition-colors duration-200 ring-inset hover:bg-white/5 hover:ring-white/20"
              >
                <GithubIcon className="size-4" /> GitHub
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm text-ink ring-1 ring-line transition-colors duration-200 ring-inset hover:bg-white/5 hover:ring-white/20"
              >
                <LinkedinIcon className="size-4" /> LinkedIn
              </a>
            </Magnetic>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="container-x relative flex items-end justify-between gap-6 pb-8 text-sm text-mist"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.3 }}
      >
        <div className="flex items-center gap-3">
          <span className="eyebrow hidden sm:inline">Atuação</span>
          <span className="h-px w-8 bg-line max-sm:hidden" />
          <RoleTicker />
        </div>
        <a href="#sobre" className="group flex items-center gap-3 text-mist transition-colors hover:text-ink">
          <span className="eyebrow hidden sm:inline group-hover:text-ink">Role para explorar</span>
          <span className="grid size-10 place-items-center rounded-full ring-1 ring-line ring-inset">
            <ArrowDownRight className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" />
          </span>
        </a>
      </motion.div>
    </header>
  );
}
