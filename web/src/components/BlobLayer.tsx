import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useMedia } from "../hooks/useMedia";

const Blob = lazy(() => import("../three/Blob"));

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Camada fixa com a massa 3D: ela atravessa a página inteira, flutuando de um
 * lado para o outro conforme o scroll, e perde brilho fora do hero para não
 * competir com o texto.
 */
export default function BlobLayer() {
  const progress = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const reduce = useReducedMotion();
  // Até 1024px o layout é de uma coluna: a massa sobe e fica menor.
  const mobile = useMedia("(max-width: 1023px)");
  const [ready, setReady] = useState(false);
  const [hidden, setHidden] = useState(false);

  const { scrollYProgress } = useScroll();
  useMotionValueEvent(scrollYProgress, "change", (v) => (progress.current = v));
  // Forte no hero, discreto no resto da página — e ainda mais discreto no celular,
  // onde a massa passa por trás do texto.
  const rest = mobile ? 0.28 : 0.45;
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.22, 0.9, 1], [1, mobile ? 0.7 : 0.8, rest, rest, mobile ? 0.6 : 0.85]);

  useEffect(() => {
    if (!hasWebGL()) return;
    const start = () => setReady(true);
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: object) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(start, { timeout: 1200 });
    else window.setTimeout(start, 300);
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onVisibility = () => setHidden(document.hidden);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <motion.div className="pointer-events-none fixed inset-0 -z-10" style={{ opacity }} aria-hidden="true">
      {ready && (
        <Suspense fallback={null}>
          <Blob progress={progress} pointer={pointer} mobile={mobile} paused={!!reduce || hidden} />
        </Suspense>
      )}
    </motion.div>
  );
}
