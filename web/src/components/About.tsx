import { about, aboutHighlights, focusAreas, portrait, profile } from "../data/content";
import { focusIcon } from "./icons";
import { Reveal, SectionLabel, Spotlight } from "./fx";

type Token = { word: string; highlight: boolean };

const clean = (w: string) => w.replace(/[(),.]/g, "");

// Marca as palavras que pertencem a uma das expressões destacadas (sequência exata).
function tokenize(text: string): Token[] {
  const words = text.split(" ");
  const tokens = words.map((word) => ({ word, highlight: false }));
  for (const phrase of aboutHighlights) {
    const parts = phrase.split(" ");
    for (let i = 0; i + parts.length <= words.length; i++) {
      if (parts.every((p, j) => clean(words[i + j]) === p)) {
        for (let j = 0; j < parts.length; j++) tokens[i + j].highlight = true;
      }
    }
  }
  return tokens;
}

export default function About() {
  const tokens = tokenize(about);

  return (
    <section id="sobre" className="relative py-24 md:py-32">
      <div className="container-x">
        <div className="grid gap-y-10 lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:col-span-3">
            <SectionLabel index="01">Sobre</SectionLabel>
            <Reveal delay={0.1} className="max-w-[13rem]">
              <figure className="group relative">
                {/* Anel orbital atrás do retrato. */}
                <div
                  aria-hidden="true"
                  className="absolute -inset-3 rounded-[2rem] bg-[conic-gradient(from_140deg,transparent,rgba(143,179,255,.55),rgba(196,181,253,.35),transparent_60%)] opacity-60 blur-md transition-opacity duration-700 group-hover:opacity-100"
                />
                <div className="relative overflow-hidden rounded-[1.6rem] ring-1 ring-white/10">
                  <img
                    src={portrait}
                    alt={`Foto de ${profile.name}`}
                    width={695}
                    height={827}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/5] w-full object-cover object-[50%_30%] grayscale-[35%] transition-[filter,transform] duration-700 ease-out-expo group-hover:scale-[1.03] group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(4,5,10,.85))]" />
                  <figcaption className="absolute inset-x-0 bottom-0 p-4">
                    <p className="font-medium">{profile.name}</p>
                    <p className="mt-0.5 text-xs text-mist">{profile.roles.slice(0, 2).join(" · ")}</p>
                  </figcaption>
                </div>
              </figure>
            </Reveal>
          </div>
          <Reveal
            as="p"
            className="text-[clamp(1.25rem,1.9vw,1.95rem)] leading-[1.38] font-normal tracking-[-0.015em] text-ink/90 lg:col-span-9"
          >
            {tokens.map((t, i) => (
              <span key={i} className={t.highlight ? "text-glow" : undefined}>
                {t.word}
                {i < tokens.length - 1 && " "}
              </span>
            ))}
          </Reveal>
        </div>

        <ul className="mt-16 grid gap-3 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {focusAreas.map((f, i) => {
            const Icon = focusIcon[f.icon];
            return (
              <Reveal as="li" key={f.key} delay={i * 0.07}>
                <Spotlight className="panel group h-full p-5">
                  <div className="flex items-start justify-between">
                    <span className="grid size-10 place-items-center rounded-xl bg-white/[0.04] text-glow ring-1 ring-line ring-inset transition-transform duration-500 ease-out-expo group-hover:-translate-y-1 group-hover:rotate-[-6deg]">
                      <Icon className="size-4" strokeWidth={1.6} />
                    </span>
                    <span className="font-mono text-xs text-dim">0{i + 1}</span>
                  </div>
                  <h3 className="mt-8 text-base font-medium tracking-tight">{f.title}</h3>
                  <p className="mt-2 text-sm text-mist">{f.text}</p>
                </Spotlight>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
