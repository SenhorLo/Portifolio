import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { skillGroups } from "../data/content";
import { Plus } from "lucide-react";
import { skillIcon } from "./icons";
import { MaskedHeading, Reveal, SectionHeader, Spotlight } from "./fx";

export default function Skills() {
  const all = [...new Set(skillGroups.flatMap((g) => g.items))];
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="habilidades" className="relative py-24 md:py-32">
      <div className="container-x">
        <SectionHeader
          index="02"
          label="Habilidades"
          ghost="Stack"
          meta={
            <Reveal className="font-mono text-sm text-mist">
              {skillGroups.length} categorias · {all.length} tecnologias e áreas
            </Reveal>
          }
        >
          <MaskedHeading
            text="Tecnologias e áreas em que"
            accent="atuo ou estudo."
            className="max-w-3xl text-[clamp(1.5rem,2.7vw,2.7rem)] leading-[1.12] font-light tracking-[0.05em] uppercase"
          />
        </SectionHeader>
      </div>

      <div className="container-x mt-12 grid gap-8 md:mt-16 lg:grid-cols-12 lg:gap-x-10">
        {/* Mesma altura do acordeão ao lado: o conteúdo se distribui na vertical. */}
        <Reveal className="h-full lg:col-span-4 xl:col-span-3">
          <Spotlight className="panel-iris flex h-full flex-col justify-between p-7">
            <p className="eyebrow text-white/70">Categorias</p>
            <p className="mt-6 text-[clamp(3rem,5.5vw,5rem)] leading-none font-medium tracking-[-0.04em] text-white">
              {String(skillGroups.length).padStart(2, "0")}
            </p>
            <p className="mt-6 text-sm leading-relaxed text-white/75">
              {all.length} tecnologias e áreas entre linguagens, back-end, dados, infraestrutura e ferramentas.
            </p>
          </Spotlight>
        </Reveal>

        {/* Acordeão: uma categoria aberta por vez, sobre painel próprio. */}
        <Spotlight className="panel p-2 md:p-4 lg:col-span-8 xl:col-span-9 xl:col-start-4">
          <ul>
            {skillGroups.map((g, i) => {
              const Icon = skillIcon[g.icon];
              const on = open === i;
              return (
                <Reveal as="li" key={g.title} delay={(i % 3) * 0.05}>
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpen(on ? null : i)}
                      aria-expanded={on}
                      aria-controls={`skill-${i}`}
                      className={`group flex w-full items-center gap-4 px-3 py-4 text-left transition-colors duration-300 md:px-4 ${
                        i > 0 ? "border-t border-line" : ""
                      } ${on ? "text-ink" : "text-ink/85 hover:text-ink"}`}
                    >
                      <span className="font-mono text-xs text-dim">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <Icon
                        className={`size-4 shrink-0 transition-colors duration-300 ${on ? "text-glow-2" : "text-glow"}`}
                        strokeWidth={1.6}
                      />
                      <span className="flex-1 text-[clamp(0.95rem,1.2vw,1.1rem)] font-light tracking-[0.08em] uppercase">
                        {g.title}
                      </span>
                      <span className="font-mono text-xs text-dim">
                        {String(g.items.length).padStart(2, "0")}
                      </span>
                      <span className="iris-ring grid size-8 shrink-0 place-items-center rounded-full">
                        <Plus
                          className={`size-4 transition-transform duration-500 ease-out-expo ${on ? "rotate-45" : "group-hover:rotate-90"}`}
                        />
                      </span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.div
                        id={`skill-${i}`}
                        className="overflow-hidden"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <ul className="flex flex-wrap gap-1.5 px-3 pb-5 pl-[3.6rem] md:px-4 md:pl-[4.6rem]">
                          {g.items.map((item) => (
                            <li key={item} className="chip">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Reveal>
              );
            })}
          </ul>
        </Spotlight>
      </div>
    </section>
  );
}
