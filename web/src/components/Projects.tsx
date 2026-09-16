import { useRef, type PointerEvent } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { projects, shotSrc, type Project } from "../data/content";
import { MaskedHeading, Reveal, SectionHeader, trackSpotlight } from "./fx";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Capa: a página inicial real do projeto dentro de uma janela de navegador. */
function Cover({ p }: { p: Project }) {
  const host = new URL(p.url).host;
  return (
    <div
      className="relative overflow-hidden rounded-[1.1rem] bg-abyss ring-1 ring-white/10"
      style={{ boxShadow: `0 30px 80px -40px ${p.accent}66` }}
    >
      <div className="flex items-center gap-3 border-b border-white/[0.06] bg-white/[0.03] px-3.5 py-2.5">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="size-2 rounded-full bg-white/15" />
          <span className="size-2 rounded-full bg-white/15" />
          <span className="size-2 rounded-full bg-white/15" />
        </span>
        <span className="min-w-0 flex-1 truncate rounded-md bg-white/[0.04] px-2.5 py-1 text-center font-mono text-[0.62rem] text-dim">
          {host}
        </span>
        <span
          className="rounded-full px-2 py-0.5 font-mono text-[0.58rem] tracking-wider uppercase"
          style={{ color: p.accent, background: `${p.accent}1a` }}
        >
          {p.category}
        </span>
      </div>
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={shotSrc(p.slug, 1200)}
          srcSet={`${shotSrc(p.slug, 640)} 640w, ${shotSrc(p.slug, 1200)} 1200w`}
          sizes="(min-width: 1024px) 34vw, (min-width: 640px) 50vw, 100vw"
          alt={`Página inicial do ${p.name}`}
          loading="lazy"
          decoding="async"
          width={1200}
          height={750}
          className="size-full object-cover object-top transition-transform duration-[900ms] ease-out-expo group-hover:scale-[1.045]"
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: `linear-gradient(180deg, transparent 55%, ${p.accent}33)` }}
        />
      </div>
    </div>
  );
}

function ProjectCard({ p, index, total }: { p: Project; index: number; total: number }) {
  const reduce = useReducedMotion();
  const rx = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const ry = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const glowX = useMotionValue(50);
  const glare = useTransform(glowX, (v) => `radial-gradient(600px circle at ${v}% 0%, ${p.accent}22, transparent 40%)`);

  const onMove = (e: PointerEvent<HTMLElement>) => {
    trackSpotlight(e);
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * 7);
    rx.set((0.5 - py) * 7);
    glowX.set(px * 100);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.article
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1200 }}
      className="spotlight panel group relative flex h-full flex-col p-3"
      data-cursor="Abrir"
    >
      <motion.div className="pointer-events-none absolute inset-0 rounded-[inherit]" style={{ background: glare }} />
      <Cover p={p} />
      <div className="flex flex-1 flex-col px-3 pt-5 pb-3">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-[clamp(1.2rem,1.5vw,1.5rem)] leading-none font-medium tracking-[-0.025em]">{p.name}</h3>
          <span className="font-mono text-xs text-dim">
            {String(index + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
          </span>
        </div>
        <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[0.72rem] text-mist" aria-label="Tecnologias">
          {p.tags.map((t) => (
            <li key={t} className="flex items-center gap-3">
              <span className="size-1 rounded-full" style={{ background: p.accent }} aria-hidden="true" />
              {t}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[0.85rem] leading-relaxed text-mist lg:line-clamp-3">{p.description}</p>
        <a
          href={p.url}
          target="_blank"
          rel="noreferrer"
          className="mt-auto flex items-center justify-between gap-3 pt-5 text-sm font-medium after:absolute after:inset-0 after:content-['']"
        >
          <span className="relative">
            Ver aplicação
            <span
              className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-500 ease-out-expo group-hover:scale-x-100"
              style={{ background: p.accent }}
            />
          </span>
          <span
            className="relative grid size-9 place-items-center rounded-full ring-1 ring-line transition-all duration-500 ease-out-expo ring-inset group-hover:rotate-45 group-hover:text-void"
            style={{ ["--a" as string]: p.accent }}
          >
            <span className="absolute size-9 scale-0 rounded-full bg-[var(--a)] transition-transform duration-500 ease-out-expo group-hover:scale-100" />
            <ArrowUpRight className="relative size-4" />
          </span>
        </a>
      </div>
    </motion.article>
  );
}

export default function Projects() {
  const section = useRef<HTMLElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const counter = useRef<HTMLSpanElement>(null);

  // Atualiza o indicador direto no DOM — sem re-renderizar os cards a cada quadro.
  const setProgress = (v: number) => {
    if (bar.current) bar.current.style.transform = `scaleX(${v})`;
    if (counter.current) {
      const n = Math.min(projects.length, Math.floor(v * (projects.length - 1)) + 1);
      counter.current.textContent = String(n).padStart(2, "0");
    }
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const el = rail.current!;
        const distance = () => el.scrollWidth - window.innerWidth;
        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (self) => setProgress(self.progress),
          },
        });
        // Cada card ganha um leve deslocamento de profundidade durante o trajeto.
        gsap.utils.toArray<HTMLElement>("[data-parallax]", el).forEach((card) => {
          gsap.fromTo(
            card,
            { y: 40 },
            {
              y: -40,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                containerAnimation: tween,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            },
          );
        });
        return () => setProgress(0);
      });
      // Fontes carregadas mudam larguras: recalcula o pin.
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
    },
    { scope: section },
  );

  return (
    <section id="projetos" ref={section} className="relative overflow-hidden py-24 md:py-32 lg:flex lg:h-svh lg:flex-col lg:justify-center lg:py-0">
      <div className="container-x">
        <SectionHeader
          index="04"
          label="Projetos"
          meta={
            <Reveal className="hidden items-center gap-4 font-mono text-xs text-mist lg:flex">
              <span>Role para navegar</span>
              <span className="relative h-px w-40 overflow-hidden bg-line">
                <span
                  ref={bar}
                  className="absolute inset-y-0 left-0 w-full origin-left scale-x-0 bg-gradient-to-r from-glow to-glow-2"
                />
              </span>
              <span className="tabular-nums text-ink">
                <span ref={counter}>01</span>
                <span className="text-dim"> / {String(projects.length).padStart(2, "0")}</span>
              </span>
            </Reveal>
          }
        >
          <MaskedHeading
            text="Seleção de iniciativas"
            accent="acadêmicas e práticas."
            className="max-w-3xl text-[clamp(1.9rem,min(3.2vw,6svh),3.25rem)] leading-[1.02] font-medium tracking-[-0.035em]"
          />
        </SectionHeader>
      </div>

      <div
        ref={rail}
        className="container-x mt-14 grid gap-5 sm:grid-cols-2 lg:mt-10 lg:ml-0 lg:flex lg:w-max lg:max-w-none lg:gap-5 lg:pr-[8vw] lg:pl-[max(clamp(1.25rem,4.5vw,6rem),calc((100vw_-_124rem)/2_+_6rem))] lg:will-change-transform"
      >
        {projects.map((p, i) => (
          <Reveal key={p.slug} delay={(i % 2) * 0.08} className="lg:w-[min(23rem,24vw,44svh)] lg:shrink-0">
            <div data-parallax className="h-full">
              <ProjectCard p={p} index={i} total={projects.length} />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
