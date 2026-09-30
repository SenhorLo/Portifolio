import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowDownRight } from "lucide-react";
import { profile } from "../data/content";


const EASE = [0.16, 1, 0.3, 1] as const;

function Letters({ text, delay, className = "" }: { text: string; delay: number; className?: string }) {
  const reduce = useReducedMotion();
  let n = 0;
  return (
    <span className={`pb-[0.08em] ${className}`} aria-hidden="true">
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
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -140]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.15]);

  return (
    <header ref={section} id="home" className="relative isolate flex min-h-svh flex-col overflow-hidden">
      {/* Fundo: brilho estático (poster) + cena 3D por cima quando carregar. */}
      <motion.div className="absolute inset-0 -z-10" style={{ scale: sceneScale }} aria-hidden="true">
        <div className="absolute left-1/2 top-[52%] h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(192,91,240,.22),rgba(240,74,134,.08)_40%,transparent_68%)] md:left-[30%]" />
        <svg
          className="absolute inset-0 size-full text-white/15"
          viewBox="0 0 1600 900"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
        >
          <ellipse cx="470" cy="470" rx="620" ry="215" stroke="currentColor" strokeWidth="1" transform="rotate(-14 470 470)" />
          <ellipse cx="470" cy="470" rx="430" ry="430" stroke="currentColor" strokeWidth="1" opacity=".35" />
          <ellipse cx="470" cy="470" rx="820" ry="300" stroke="currentColor" strokeWidth="1" opacity=".45" transform="rotate(8 470 470)" />
        </svg>
        <div className="absolute inset-0 bg-[linear-gradient(270deg,rgba(11,4,16,.86)_0%,rgba(11,4,16,.45)_42%,transparent_72%)] max-md:bg-[linear-gradient(180deg,rgba(11,4,16,.25)_0%,rgba(11,4,16,.62)_50%,rgba(11,4,16,.25)_100%)]" />
      </motion.div>

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="container-x relative flex flex-1 flex-col justify-center pt-32 pb-24 md:pt-28"
      >

        {/* Composição: o blob (camada de fundo) à esquerda, o wordmark à direita. */}
        {/* Par centralizado: espaço reservado ao blob + wordmark, como na referência. */}
        <div className="flex items-center justify-center gap-[3vw]">
          <div className="hidden w-[18vw] shrink-0 lg:block" aria-hidden="true" />

          <h1 aria-label={`${profile.brand.strong}${profile.brand.light} — ${profile.name}`} className="text-center">
            <span className="block text-[clamp(3rem,13vw,13rem)] leading-[0.86] tracking-[-0.05em]">
              <Letters text={profile.brand.strong} delay={0.15} className="inline-block font-semibold" />
              <Letters
                text={profile.brand.light}
                delay={0.35}
                className="inline-block font-light text-[#e7d3ff]"
              />
            </span>
            <motion.span
              className="mt-6 block text-[clamp(0.85rem,2.1vw,2.1rem)] font-light tracking-[0.2em] text-ink/85 uppercase"
              initial={{ opacity: 0, y: reduce ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.7 }}
            >
              {profile.name}
            </motion.span>
          </h1>
        </div>

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
