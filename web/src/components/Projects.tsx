import { type PointerEvent } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { projects, shotSrc, type Project } from "../data/content";
import { MaskedHeading, Reveal, SectionHeader, trackSpotlight } from "./fx";

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
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
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

/** Card de projeto: capa em cima, texto embaixo. */
function ProjectCard({ p, index, total }: { p: Project; index: number; total: number }) {
  const glowX = useMotionValue(50);
  const glare = useTransform(glowX, (v) => `radial-gradient(600px circle at ${v}% 0%, ${p.accent}1f, transparent 45%)`);

  const onMove = (e: PointerEvent<HTMLElement>) => {
    trackSpotlight(e);
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    glowX.set(((e.clientX - r.left) / r.width) * 100);
  };

  return (
    <motion.article
      onPointerMove={onMove}
      className="spotlight panel group relative flex h-full flex-col p-3"
      data-cursor="Abrir"
    >
      <motion.div className="pointer-events-none absolute inset-0 rounded-[inherit]" style={{ background: glare }} />
      <Cover p={p} />

      <div className="relative flex flex-1 flex-col px-3 pt-6 pb-3">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-[clamp(1.05rem,1.4vw,1.25rem)] leading-tight font-light tracking-[0.06em] uppercase">
            {p.name}
          </h3>
          <span className="font-mono text-xs text-dim">
            {String(index + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
          </span>
        </div>
        <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[0.68rem] text-mist" aria-label="Tecnologias">
          {p.tags.map((t) => (
            <li key={t} className="flex items-center gap-2.5">
              <span className="size-1 rounded-full" style={{ background: p.accent }} aria-hidden="true" />
              {t}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[0.85rem] leading-relaxed text-mist line-clamp-4">{p.description}</p>
        <a
          href={p.url}
          target="_blank"
          rel="noreferrer"
          className="mt-auto flex items-center justify-between gap-3 pt-6 text-sm font-medium after:absolute after:inset-0 after:content-['']"
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
  return (
    <section id="projetos" className="relative py-24 md:py-32">
      <div className="container-x">
        <SectionHeader
          index="04"
          label="Projetos"
          ghost="Projetos"
          meta={
            <Reveal className="font-mono text-xs text-mist">
              {String(projects.length).padStart(2, "0")} projetos
            </Reveal>
          }
        >
          <MaskedHeading
            text="Seleção de iniciativas"
            accent="acadêmicas e práticas."
            className="max-w-3xl text-[clamp(1.5rem,min(2.7vw,5svh),2.7rem)] leading-[1.12] font-light tracking-[0.05em] uppercase"
          />
        </SectionHeader>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 md:mt-16 lg:grid-cols-3">
          {projects.map((p, i) => (
            <Reveal as="li" key={p.slug} delay={(i % 3) * 0.08}>
              <ProjectCard p={p} index={i} total={projects.length} />
            </Reveal>
          ))}
        </ul>

      </div>
    </section>
  );
}
