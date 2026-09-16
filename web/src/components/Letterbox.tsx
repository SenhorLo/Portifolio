import { motion, useReducedMotion } from "motion/react";

/** Abertura de cinema: faixas pretas que se recolhem quando a página carrega. */
export default function Letterbox() {
  const reduce = useReducedMotion();
  if (reduce) return null;

  const transition = { duration: 1.6, ease: [0.76, 0, 0.24, 1] as const, delay: 0.25 };
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[65]">
      <motion.div
        className="absolute inset-x-0 top-0 h-[14vh] origin-top bg-black"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={transition}
      />
      <motion.div
        className="absolute inset-x-0 bottom-0 h-[14vh] origin-bottom bg-black"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={transition}
      />
    </div>
  );
}
