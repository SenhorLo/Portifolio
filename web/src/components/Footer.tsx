import { motion, useReducedMotion } from "motion/react";
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
  const reduce = useReducedMotion();

  return (
    <footer className="relative isolate mt-10 overflow-hidden pt-24">
      <div className="container-x relative pt-16 md:pt-24">
        <div className="flex flex-col items-center text-center">
          <motion.p
            className="eyebrow"
            initial={{ opacity: 0, y: reduce ? 0 : 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Obrigado pela visita
          </motion.p>
          <p className="mt-6 text-[clamp(1.4rem,2.8vw,2.4rem)] leading-[1.1] font-light tracking-[0.08em] uppercase">
            {profile.firstName}{" "}
            <span className="text-[#f0c8ff]">{profile.lastName}</span>
          </p>
          <p className="mt-4 text-mist">{profile.roles.slice(0, 2).join(" · ")}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Magnetic>
              <a
                href="#home"
                className="btn-iris group"
              >
                Voltar ao topo
                <span className="grid size-8 place-items-center rounded-full bg-void/45 text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.25)] transition-transform duration-300 group-hover:-translate-y-0.5">
                  <ArrowUp className="size-4" />
                </span>
              </a>
            </Magnetic>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="iris-ring grid size-11 place-items-center rounded-full transition-colors hover:bg-white/[0.06]"
            >
              <GithubIcon className="size-4" />
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="iris-ring grid size-11 place-items-center rounded-full transition-colors hover:bg-white/[0.06]"
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
