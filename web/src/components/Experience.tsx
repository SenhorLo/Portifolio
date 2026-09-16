import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { jobs, type Job } from "../data/content";
import { MaskedHeading, Reveal, SectionLabel, Spotlight } from "./fx";

const EASE = [0.16, 1, 0.3, 1] as const;
const monthIndex = ([y, m]: [number, number]) => y * 12 + (m - 1);
const duration = (j: Job) => monthIndex(j.end) - monthIndex(j.start) + 1;

export default function Experience() {
  const track = useRef<HTMLOListElement>(null);
  const items = useRef<(HTMLLIElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start 0.7", "end 0.6"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  // O cargo ativo é o card que cruza o meio da tela.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    items.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="experiencia" className="relative py-24 md:py-32">
      <div className="container-x grid gap-16 lg:grid-cols-12 lg:gap-x-10">
        <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start xl:col-span-4">
          <SectionLabel index="03">Experiência</SectionLabel>
          <MaskedHeading
            text="Onde transformei"
            accent="estudo em entrega."
            className="text-[clamp(1.9rem,3.2vw,3.25rem)] leading-[1.02] font-medium tracking-[-0.035em]"
          />
          <Reveal delay={0.2} className="mt-6 max-w-sm text-mist">
            Implantação e suporte de sistemas ERP, desenvolvimento web e integrações para processos logísticos.
          </Reveal>
        </div>

        <ol ref={track} className="relative grid content-start gap-10 pl-10 md:pl-14 lg:col-span-7 xl:col-span-7 xl:col-start-6">
          <div className="absolute top-2 bottom-2 left-[7px] w-px bg-line md:left-[11px]" aria-hidden="true" />
          <motion.div
            className="absolute top-2 bottom-2 left-[7px] w-px origin-top bg-gradient-to-b from-glow via-glow-2 to-transparent md:left-[11px]"
            style={{ scaleY }}
            aria-hidden="true"
          />

          {jobs.map((job, i) => {
            const on = i === active;
            return (
              <li
                key={job.company}
                ref={(el) => {
                  items.current[i] = el;
                }}
                data-index={i}
                className="relative"
              >
                <span
                  className="absolute top-8 -left-10 grid size-[15px] place-items-center rounded-full bg-void ring-1 ring-glow/60 md:-left-14 md:size-[23px]"
                  aria-hidden="true"
                >
                  <motion.span
                    className="size-1.5 rounded-full bg-glow md:size-2"
                    animate={{
                      scale: on ? 1.4 : 1,
                      boxShadow: on ? "0 0 16px 4px rgba(143,179,255,.9)" : "0 0 0 0 rgba(143,179,255,0)",
                    }}
                    transition={{ duration: 0.4, ease: EASE }}
                  />
                </span>
                <Reveal delay={i * 0.05}>
                  <Spotlight
                    as="article"
                    className={`panel p-7 transition-opacity duration-500 md:p-8 ${on ? "opacity-100" : "lg:opacity-60"}`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="font-mono text-xs tracking-wider text-glow uppercase">{job.period}</span>
                      <span className="flex items-center gap-2">
                        <span className="chip py-1 text-xs text-mist">
                          {duration(job)} {duration(job) === 1 ? "mês" : "meses"}
                        </span>
                        {i === 0 && <span className="chip py-1 text-xs text-mist">Mais recente</span>}
                      </span>
                    </div>
                    <h3 className="mt-5 text-[clamp(1.4rem,2vw,1.85rem)] leading-none font-medium tracking-[-0.03em]">
                      {job.company}
                    </h3>
                    <p className="mt-1.5 font-serif text-lg text-mist italic">{job.role}</p>

                    <ul className="mt-6 grid gap-2.5 text-[0.92rem]">
                      {job.bullets.map((b) => (
                        <li key={b} className="flex gap-4 text-ink/85">
                          <span className="mt-[0.7em] h-px w-4 shrink-0 bg-glow/60" aria-hidden="true" />
                          {b}
                        </li>
                      ))}
                    </ul>

                    <ul className="mt-6 flex flex-wrap gap-1.5 border-t border-line pt-5" aria-label="Tecnologias">
                      {job.stack.map((s) => (
                        <li key={s} className="chip text-xs">
                          {s}
                        </li>
                      ))}
                    </ul>
                  </Spotlight>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
