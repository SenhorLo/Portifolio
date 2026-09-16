import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { skillGroups } from "../data/content";
import { skillIcon } from "./icons";
import { MaskedHeading, Reveal, SectionHeader, Spotlight } from "./fx";

const wrap = (min: number, max: number, v: number) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

/** Letreiro infinito: anda sozinho e acelera (ou inverte) com a velocidade do scroll. */
function VelocityMarquee({ items, baseVelocity }: { items: string[]; baseVelocity: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(velocity, [-2000, 0, 2000], [-4, 0, 4], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    if (!inView || reduce) return;
    const f = factor.get();
    if (f < 0) direction.current = -1;
    else if (f > 0) direction.current = 1;
    const move = direction.current * baseVelocity * (delta / 1000) * (1 + Math.abs(f));
    baseX.set(baseX.get() + move);
  });

  const row = items.map((item, i) => (
    <span key={i} className="flex shrink-0 items-center gap-8 pr-8">
      <span>{item}</span>
      <span className="size-2 rounded-full bg-glow/50" aria-hidden="true" />
    </span>
  ));

  return (
    <div ref={ref} className="marquee-mask min-w-0 overflow-hidden" aria-hidden="true">
      <motion.div
        style={{ x }}
        className="flex w-max text-[clamp(1.5rem,3.2vw,3rem)] leading-none font-light tracking-[-0.03em] whitespace-nowrap"
      >
        {row}
        {row}
      </motion.div>
    </div>
  );
}

// Grid assimétrico: cada linha soma 12 colunas.
const bentoSpan = ["lg:col-span-5", "lg:col-span-4", "lg:col-span-3", "lg:col-span-3", "lg:col-span-5", "lg:col-span-4"];

export default function Skills() {
  const all = [...new Set(skillGroups.flatMap((g) => g.items))];
  const half = Math.ceil(all.length / 2);

  return (
    <section id="habilidades" className="relative py-24 md:py-32">
      <div className="container-x">
        <SectionHeader
          index="02"
          label="Habilidades"
          meta={
            <Reveal className="font-mono text-sm text-mist">
              {skillGroups.length} categorias · {all.length} tecnologias e áreas
            </Reveal>
          }
        >
          <MaskedHeading
            text="Tecnologias e áreas em que"
            accent="atuo ou estudo."
            className="max-w-3xl text-[clamp(1.9rem,3.2vw,3.25rem)] leading-[1.02] font-medium tracking-[-0.035em]"
          />
        </SectionHeader>
      </div>

      <div className="mt-14 grid grid-cols-[minmax(0,1fr)] gap-2 overflow-hidden text-ink/90 md:mt-16">
        <VelocityMarquee items={all.slice(0, half)} baseVelocity={-2.2} />
        <div className="min-w-0 text-transparent [-webkit-text-stroke:1px_rgb(255_255_255/0.35)]">
          <VelocityMarquee items={all.slice(half)} baseVelocity={2.2} />
        </div>
      </div>

      <ul className="container-x mt-12 grid gap-3 md:mt-16 md:grid-cols-2 lg:grid-cols-12">
        {skillGroups.map((g, i) => {
          const Icon = skillIcon[g.icon];
          return (
            <Reveal as="li" key={g.title} delay={(i % 3) * 0.08} className={bentoSpan[i]}>
              <Spotlight className="panel group h-full p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className="size-4 text-glow" strokeWidth={1.6} />
                    <h3 className="text-[0.95rem] font-medium tracking-tight">{g.title}</h3>
                  </div>
                  <span className="font-mono text-xs text-dim">{String(g.items.length).padStart(2, "0")}</span>
                </div>
                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {g.items.map((item) => (
                    <li key={item} className="chip">
                      {item}
                    </li>
                  ))}
                </ul>
              </Spotlight>
            </Reveal>
          );
        })}
      </ul>
    </section>
  );
}
