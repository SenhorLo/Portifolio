import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useFinePointer } from "../hooks/useMedia";

/**
 * Cursor customizado (só em mouse): um ponto preciso + um anel com atraso.
 * Sobre links/botões o anel cresce; elementos com data-cursor mostram um rótulo.
 */
export default function Cursor() {
  const fine = useFinePointer();
  const reduce = useReducedMotion();
  const enabled = fine && !reduce;

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 500, damping: 40, mass: 0.5 });
  const [hover, setHover] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [down, setDown] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-cursor");

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const t = e.target as Element | null;
      const labelled = t?.closest<HTMLElement>("[data-cursor]");
      setLabel(labelled?.dataset.cursor ?? null);
      setHover(!!t?.closest("a, button, input, textarea, label, [role='button']"));
    };
    const leave = () => setVisible(false);
    const press = () => setDown(true);
    const release = () => setDown(false);

    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", press);
    window.addEventListener("pointerup", release);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", press);
      window.removeEventListener("pointerup", release);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const ringSize = label ? 88 : hover ? 52 : 34;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[80]" style={{ opacity: visible ? 1 : 0 }}>
      <motion.div className="absolute top-0 left-0" style={{ x: rx, y: ry }}>
        <motion.div
          className="grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full"
          animate={{
            width: ringSize,
            height: ringSize,
            scale: down ? 0.85 : 1,
            backgroundColor: label ? "rgba(233,237,246,1)" : "rgba(233,237,246,0)",
            borderColor: label ? "rgba(233,237,246,0)" : hover ? "rgba(143,179,255,.9)" : "rgba(233,237,246,.35)",
          }}
          style={{ borderWidth: 1, borderStyle: "solid" }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          <AnimatePresence>
            {label && (
              <motion.span
                className="font-mono text-[0.65rem] tracking-wider text-void uppercase"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.2 }}
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
      <motion.div className="absolute top-0 left-0" style={{ x, y }}>
        <div
          className={`size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink transition-opacity duration-150 ${label ? "opacity-0" : ""}`}
        />
      </motion.div>
    </div>
  );
}
