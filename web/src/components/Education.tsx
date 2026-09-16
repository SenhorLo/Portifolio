import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { GraduationCap, MapPin } from "lucide-react";
import { courses, degree } from "../data/content";
import { MaskedHeading, Reveal, SectionHeader, Spotlight } from "./fx";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Education() {
  const [hovered, setHovered] = useState<number | null>(null);
  const aluraHours = courses.filter((c) => c.hours).reduce((sum, c) => sum + (c.hours ?? 0), 0);
  const aluraCount = courses.filter((c) => c.school === "Alura").length;

  return (
    <section id="formacao" className="relative py-24 md:py-32">
      <div className="container-x">
        <SectionHeader index="05" label="Formação">
          <MaskedHeading
            text="Formação"
            accent="& cursos."
            className="text-[clamp(1.9rem,3.2vw,3.25rem)] leading-[1.02] font-medium tracking-[-0.035em]"
          />
        </SectionHeader>

        <div className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-12">
          <Reveal className="lg:col-span-5 xl:col-span-4">
            <Spotlight className="panel relative h-full overflow-hidden p-7 md:p-8">
              <div
                className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-[radial-gradient(circle,rgba(143,179,255,.22),transparent_65%)]"
                aria-hidden="true"
              />
              <div className="flex items-center justify-between">
                <span className="grid size-12 place-items-center rounded-2xl bg-white/[0.04] text-glow ring-1 ring-line ring-inset">
                  <GraduationCap className="size-5" strokeWidth={1.6} />
                </span>
                <span className="chip text-xs">{degree.status}</span>
              </div>
              <p className="mt-10 eyebrow">{degree.institution}</p>
              <h3 className="mt-4 text-[clamp(1.3rem,1.8vw,1.7rem)] leading-[1.15] font-medium tracking-[-0.025em]">
                {degree.title}
              </h3>
              <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-line pt-6 text-sm">
                <div>
                  <dt className="text-dim">Período</dt>
                  <dd className="mt-1 font-mono text-ink">{degree.period}</dd>
                  <dd className="mt-1 text-mist">{degree.forecast}</dd>
                </div>
                <div>
                  <dt className="text-dim">Local</dt>
                  <dd className="mt-1 flex items-center gap-1.5 text-ink">
                    <MapPin className="size-3.5 text-glow" /> {degree.location}
                  </dd>
                </div>
              </dl>
            </Spotlight>
          </Reveal>

          <Reveal delay={0.1} className="panel p-3 md:p-4 lg:col-span-7 xl:col-span-8">
            <div className="flex flex-wrap items-center justify-between gap-2 px-4 pt-3 pb-4">
              <p className="eyebrow">Cursos</p>
              <p className="font-mono text-xs text-mist">
                {aluraCount} cursos na Alura · {aluraHours}h de carga horária
              </p>
            </div>
            <ul onPointerLeave={() => setHovered(null)}>
              {courses.map((c, i) => (
                <li key={c.title} className="relative [&:last-child>div]:border-0" onPointerEnter={() => setHovered(i)}>
                  <AnimatePresence>
                    {hovered === i && (
                      <motion.span
                        layoutId="course-hover"
                        className="absolute inset-0 rounded-2xl bg-white/[0.045]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35, ease: EASE }}
                      />
                    )}
                  </AnimatePresence>
                  <div className="relative grid grid-cols-[1fr_auto] gap-x-6 gap-y-1 border-b border-line px-4 py-4 md:grid-cols-[7rem_1fr_auto]">
                    <span className="order-3 font-mono text-xs text-dim md:order-none md:pt-1">{c.date}</span>
                    <div className="col-span-2 md:col-span-1">
                      <p className="text-[0.92rem] leading-snug text-ink">{c.title}</p>
                      <p className="mt-1 text-sm text-mist">
                        {c.school}
                        {c.location && <span className="text-dim"> · {c.location}</span>}
                      </p>
                    </div>
                    <span className="order-4 self-start justify-self-end font-mono text-xs text-glow md:order-none md:pt-1">
                      {c.hours ? `${c.hours}h` : ""}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
