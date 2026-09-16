import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowUp } from "lucide-react";
import { profile, sections } from "../data/content";
import { GithubIcon, LinkedinIcon } from "./icons";
import { Brand } from "./Nav";
import { Magnetic } from "./fx";

/**
 * Rodapé com um "nascer de planeta": uma borda luminosa curva que sobe
 * conforme o rodapé entra na tela, com o conteúdo pousado sobre ela.
 */
export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const rise = useTransform(scrollYProgress, [0, 1], [reduce ? "0%" : "38%", "0%"]);
  const glow = useTransform(scrollYProgress, [0.3, 1], [0.2, 1]);

  return (
    <footer ref={ref} className="relative isolate mt-10 overflow-hidden pt-32">
      {/* Planeta: elipse gigante cuja borda superior forma o horizonte. */}
      <motion.div aria-hidden="true" className="absolute inset-x-0 top-24 -z-10 h-[140%]" style={{ y: rise }}>
        <motion.div
          className="absolute top-0 left-1/2 h-[60vw] min-h-[40rem] w-[180vw] -translate-x-1/2 -translate-y-24 rounded-[100%] bg-[radial-gradient(closest-side,rgba(143,179,255,.22),transparent)]"
          style={{ opacity: glow }}
        />
        <div className="absolute top-0 left-1/2 h-[60vw] min-h-[40rem] w-[180vw] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(ellipse_at_50%_0%,#0b1024_0%,#05060c_45%,var(--color-void)_70%)] shadow-[inset_0_1px_0_rgba(196,214,255,.9),inset_0_18px_60px_-20px_rgba(143,179,255,.55),0_-10px_60px_-10px_rgba(143,179,255,.45)]" />
        <motion.div
          className="absolute top-0 left-1/2 h-px w-[46vw] -translate-x-1/2 bg-gradient-to-r from-transparent via-white to-transparent"
          style={{ opacity: glow }}
        />
      </motion.div>

      <div className="container-x relative pt-16 md:pt-24">
        <div className="flex flex-col items-center text-center">
          <p className="eyebrow">Obrigado pela visita</p>
          <p className="mt-6 text-[clamp(1.8rem,3.4vw,3rem)] leading-[1] font-medium tracking-[-0.035em]">
            {profile.firstName}{" "}
            <span className="font-serif font-normal italic text-[#bccdff]">{profile.lastName}</span>
          </p>
          <p className="mt-4 text-mist">{profile.roles.slice(0, 2).join(" · ")}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Magnetic>
              <a
                href="#home"
                className="group inline-flex items-center gap-2 rounded-full bg-ink py-2 pr-2 pl-5 text-sm font-medium text-void transition-colors hover:bg-white"
              >
                Voltar ao topo
                <span className="grid size-8 place-items-center rounded-full bg-void text-ink transition-transform duration-300 group-hover:-translate-y-0.5">
                  <ArrowUp className="size-4" />
                </span>
              </a>
            </Magnetic>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="grid size-11 place-items-center rounded-full bg-white/[0.03] ring-1 ring-line transition-colors ring-inset hover:bg-white/[0.08]"
            >
              <GithubIcon className="size-4" />
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="grid size-11 place-items-center rounded-full bg-white/[0.03] ring-1 ring-line transition-colors ring-inset hover:bg-white/[0.08]"
            >
              <LinkedinIcon className="size-4" />
            </a>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-line py-8 text-sm text-mist md:flex-row">
          <div className="flex items-center gap-4">
            <Brand className="text-ink" />
            <span className="h-4 w-px bg-line" aria-hidden="true" />
            <span>
              © {new Date().getFullYear()} {profile.name}
            </span>
          </div>
          <nav aria-label="Rodapé">
            <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2">
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="transition-colors hover:text-ink">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
