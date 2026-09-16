import { useRef, type ElementType, type PointerEvent, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, type HTMLMotionProps } from "motion/react";

/** Atualiza --mx/--my para o brilho de borda (.spotlight) seguir o cursor. */
export function trackSpotlight(e: PointerEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - r.left}px`);
  el.style.setProperty("--my", `${e.clientY - r.top}px`);
}

type SpotlightProps = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
} & Record<string, unknown>;

/** Superfície com brilho de borda que acompanha o cursor. `as` troca a tag (a, form, article…). */
export function Spotlight({ as, className = "", children, ...rest }: SpotlightProps) {
  const Tag = (as ?? "div") as "div";
  return (
    <Tag className={`spotlight ${className}`} onPointerMove={trackSpotlight} {...(rest as object)}>
      {children}
    </Tag>
  );
}

/** Elemento que é "puxado" levemente pelo cursor. */
export function Magnetic({
  children,
  strength = 0.3,
  className = "",
  ...rest
}: { children: ReactNode; strength?: number } & HTMLMotionProps<"div">) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 });

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`inline-flex ${className}`}
      style={{ x, y }}
      onPointerMove={onMove}
      onPointerLeave={reset}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

const EASE = [0.16, 1, 0.3, 1] as const;

/** Entrada padrão de bloco: sobe e aparece uma única vez. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className = "",
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "article" | "p" | "h2" | "span";
}) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: reduce ? 0.2 : 1.1, ease: EASE, delay: reduce ? 0 : delay }}
    >
      {children}
    </Comp>
  );
}

/** Título de seção com as palavras subindo de dentro de uma máscara. */
export function MaskedHeading({
  text,
  accent,
  className = "",
}: {
  text: string;
  accent?: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  const all = accent ? [...words, accent] : words;
  return (
    <h2 className={className} aria-label={accent ? `${text} ${accent}` : text}>
      {all.map((w, i) => {
        const isAccent = !!accent && i === words.length;
        return (
          <span key={i}>
            <span aria-hidden="true" className="-mt-[0.14em] -mb-[0.12em] inline-block overflow-hidden pt-[0.14em] pb-[0.12em] align-bottom">
              <motion.span
                className={`inline-block ${isAccent ? "text-gradient pr-[0.08em] font-serif font-normal italic" : ""}`}
                initial={{ y: reduce ? 0 : "105%", opacity: reduce ? 0 : 1 }}
                whileInView={{ y: "0%", opacity: 1 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{ duration: reduce ? 0.2 : 1.2, ease: EASE, delay: reduce ? 0 : i * 0.05 }}
              >
                {w}
              </motion.span>
            </span>
            {i < all.length - 1 && " "}
          </span>
        );
      })}
    </h2>
  );
}

export function SectionLabel({ index, children }: { index: string; children: ReactNode }) {
  return (
    <Reveal y={12} className="mb-6 flex items-center gap-3">
      <span className="font-mono text-[0.7rem] text-glow">{index}</span>
      <span className="h-px w-10 bg-gradient-to-r from-glow/60 to-transparent" />
      <span className="eyebrow">{children}</span>
    </Reveal>
  );
}

/** Cabeçalho editorial: rótulo numa coluna estreita à esquerda, título ocupando o resto. */
export function SectionHeader({
  index,
  label,
  aside,
  children,
  meta,
}: {
  index: string;
  label: string;
  aside?: ReactNode;
  children: ReactNode;
  meta?: ReactNode;
}) {
  return (
    <div className="grid gap-y-1 lg:grid-cols-12 lg:gap-x-10">
      <div className="lg:col-span-3 lg:pt-3">
        <SectionLabel index={index}>{label}</SectionLabel>
        {aside && (
          <Reveal delay={0.1} className="hidden max-w-[16rem] text-sm leading-relaxed text-mist lg:block">
            {aside}
          </Reveal>
        )}
      </div>
      <div className="flex flex-wrap items-end justify-between gap-6 lg:col-span-9">
        {children}
        {meta}
      </div>
    </div>
  );
}
