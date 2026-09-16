import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { sections } from "../data/content";
import { useActiveSection } from "../hooks/useActiveSection";

/**
 * Fundo fixo do site inteiro:
 *  - nebulosas em gradiente cuja cor muda conforme a seção ativa (transição via @property);
 *  - campo de estrelas em canvas 2D com três camadas de profundidade (parallax no scroll);
 *  - trama de pontos sutil, mascarada nas bordas.
 */

type Palette = [string, string, string];

const palettes: Record<string, Palette> = {
  home: ["#1a2a66", "#2c1a5e", "#0c2c44"],
  sobre: ["#213a8a", "#3b2080", "#0c3350"],
  habilidades: ["#0b4670", "#223b8f", "#0e4a46"],
  experiencia: ["#3d2385", "#5a2a12", "#1f3a8a"],
  projetos: ["#223b8f", "#4a1f70", "#5a3410"],
  formacao: ["#0d4a48", "#213a8a", "#34207a"],
  contato: ["#2b3596", "#4a1f70", "#0b4670"],
};

const ids = sections.map((s) => s.id);

type Star = { x: number; y: number; r: number; depth: number; phase: number; speed: number; hue: number };

function StarField() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const c = canvas.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;

    let stars: Star[] = [];
    let w = 0;
    let h = 0;
    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const seed = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      c.width = Math.round(w * dpr);
      c.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(340, (w * h) / 4200));
      stars = Array.from({ length: count }, () => {
        const depth = Math.random();
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r: 0.4 + depth * 1.3,
          depth,
          phase: Math.random() * Math.PI * 2,
          speed: 0.6 + Math.random() * 1.6,
          hue: Math.random() < 0.12 ? 28 : Math.random() < 0.5 ? 222 : 255,
        };
      });
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const scroll = window.scrollY;
      for (const s of stars) {
        // Estrelas mais "próximas" deslizam mais rápido que as distantes.
        const y = (((s.y - scroll * (0.04 + s.depth * 0.18)) % h) + h) % h;
        const tw = reduce ? 0.8 : 0.55 + 0.45 * Math.sin(t * 0.001 * s.speed + s.phase);
        ctx.beginPath();
        ctx.arc(s.x, y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${s.hue}, 80%, ${s.hue === 28 ? 72 : 90}%, ${(0.35 + s.depth * 0.65) * tw})`;
        ctx.fill();
        if (s.depth > 0.92) {
          ctx.beginPath();
          ctx.arc(s.x, y, s.r * 4, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${s.hue}, 90%, 80%, ${0.08 * tw})`;
          ctx.fill();
        }
      }
    };

    const loop = (t: number) => {
      draw(t);
      raf = requestAnimationFrame(loop);
    };

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && !reduce) raf = requestAnimationFrame(loop);
    };
    const onResize = () => {
      seed();
      draw(performance.now());
    };
    // Com movimento reduzido só redesenha no scroll (parallax suave continua desligado no loop).
    const onScroll = () => reduce && draw(performance.now());

    seed();
    draw(0);
    if (!reduce) raf = requestAnimationFrame(loop);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduce]);

  return <canvas ref={canvas} className="absolute inset-0 size-full" />;
}

export default function Cosmos() {
  const active = useActiveSection(ids) ?? "home";
  const [a, b, c] = palettes[active] ?? palettes.home;

  return (
    <div
      aria-hidden="true"
      className="cosmos pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ ["--neb-a" as string]: a, ["--neb-b" as string]: b, ["--neb-c" as string]: c }}
    >
      <div className="cosmos-nebula absolute inset-0" />
      <div className="cosmos-dots absolute inset-0" />
      <StarField />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(4,5,10,.55)_100%)]" />
    </div>
  );
}
