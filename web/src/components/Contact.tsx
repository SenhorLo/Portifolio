import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Check, Copy, Send } from "lucide-react";
import { contactBlurb, profile } from "../data/content";
import { GithubIcon, LinkedinIcon } from "./icons";
import { Magnetic, MaskedHeading, Reveal, SectionHeader, Spotlight } from "./fx";

const EASE = [0.16, 1, 0.3, 1] as const;

type Errors = Partial<Record<"nome" | "email" | "mensagem", string>>;

function Field({
  id,
  label,
  error,
  textarea,
  type = "text",
  autoComplete,
}: {
  id: "nome" | "email" | "mensagem";
  label: string;
  error?: string;
  textarea?: boolean;
  type?: string;
  autoComplete?: string;
}) {
  const base =
    "peer block w-full rounded-2xl bg-white/[0.03] px-4 pt-6 pb-2.5 text-[0.95rem] text-ink ring-1 ring-line outline-none ring-inset transition-shadow duration-200 placeholder:text-transparent focus:ring-glow/70 aria-[invalid=true]:ring-red-400/70";
  return (
    <div className="relative">
      {textarea ? (
        <textarea id={id} name={id} rows={5} placeholder={label} aria-invalid={!!error} aria-describedby={`${id}-err`} className={`${base} resize-none`} />
      ) : (
        <input id={id} name={id} type={type} placeholder={label} autoComplete={autoComplete} aria-invalid={!!error} aria-describedby={`${id}-err`} className={base} />
      )}
      <label
        htmlFor={id}
        className="pointer-events-none absolute top-2.5 left-5 text-xs text-mist transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-[0.95rem] peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-glow"
      >
        {label}
      </label>
      <p id={`${id}-err`} className="mt-1.5 min-h-5 pl-2 text-xs text-red-300" aria-live="polite">
        {error}
      </p>
    </div>
  );
}

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState("");

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const nome = String(data.get("nome") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const mensagem = String(data.get("mensagem") ?? "").trim();

    const next: Errors = {};
    if (!nome) next.nome = "Informe seu nome.";
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Informe um e-mail válido.";
    if (!mensagem) next.mensagem = "Escreva sua mensagem.";
    setErrors(next);
    if (Object.keys(next).length) {
      setStatus("Confira os campos e tente novamente.");
      return;
    }

    const subject = encodeURIComponent(`Contato pelo portfólio — ${nome}`);
    const body = encodeURIComponent(`Nome: ${nome}\nEmail: ${email}\n\nMensagem:\n${mensagem}\n`);
    setStatus("Abrindo seu aplicativo de e-mail…");
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contato" className="relative overflow-hidden py-24 md:py-32">
      <div
        className="pointer-events-none absolute bottom-[-30%] left-1/2 -z-10 h-[80vmin] w-[120vmin] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(closest-side,rgba(143,179,255,.16),rgba(196,181,253,.06)_55%,transparent)]"
        aria-hidden="true"
      />
      <div className="container-x">
        <SectionHeader index="06" label="Contato">
          <MaskedHeading
            text="Vamos"
            accent="conversar?"
            className="text-[clamp(2.4rem,5.6vw,5.6rem)] leading-[0.95] font-medium tracking-[-0.045em]"
          />
        </SectionHeader>

        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:col-span-5 xl:col-span-4">
            <Reveal className="max-w-sm text-mist">{contactBlurb}</Reveal>

            <Reveal delay={0.1} className="mt-10">
              <p className="eyebrow">E-mail</p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <a
                  href={`mailto:${profile.email}`}
                  className="group relative text-[clamp(1.05rem,1.6vw,1.35rem)] tracking-tight break-all"
                >
                  {profile.email}
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-glow transition-transform duration-500 ease-out-expo group-hover:origin-left group-hover:scale-x-100" />
                </a>
                <button
                  type="button"
                  onClick={copyEmail}
                  className="relative grid size-10 place-items-center overflow-hidden rounded-full text-mist ring-1 ring-line transition-colors ring-inset hover:text-ink"
                  aria-label={copied ? "E-mail copiado" : "Copiar e-mail"}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={copied ? "ok" : "copy"}
                      initial={{ y: 14, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -14, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {copied ? <Check className="size-4 text-glow" /> : <Copy className="size-4" />}
                    </motion.span>
                  </AnimatePresence>
                </button>
                <AnimatePresence>
                  {copied && (
                    <motion.span
                      className="font-mono text-xs text-glow"
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      role="status"
                    >
                      Copiado!
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>

            <Reveal delay={0.2} className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2">
              {[
                { href: profile.github, label: "GitHub", sub: profile.githubLabel, Icon: GithubIcon },
                { href: profile.linkedin, label: "LinkedIn", sub: "Lorenzo Tacca Orssatto", Icon: LinkedinIcon },
              ].map(({ href, label, sub, Icon }) => (
                <Spotlight
                  as="a"
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="panel group flex items-center gap-3.5 p-4 text-sm"
                >
                  <Icon className="size-5 shrink-0" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">{label}</span>
                    <span className="block truncate text-sm text-mist">{sub}</span>
                  </span>
                  <ArrowUpRight className="size-4 text-mist transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink" />
                </Spotlight>
              ))}
            </Reveal>
          </div>

          <Reveal delay={0.15} className="lg:col-span-7 xl:col-start-6">
            <Spotlight as="form" noValidate onSubmit={onSubmit} className="panel grid gap-1.5 p-6 md:p-7">
              <div className="mb-4 flex items-baseline justify-between gap-4">
                <p className="text-base font-medium tracking-tight">Envio de e-mail</p>
                <p className="text-sm text-mist">Abre no seu app de e-mail</p>
              </div>
              <div className="grid gap-2 md:grid-cols-2 md:gap-4">
                <Field id="nome" label="Nome" error={errors.nome} autoComplete="name" />
                <Field id="email" label="E-mail" type="email" error={errors.email} autoComplete="email" />
              </div>
              <Field id="mensagem" label="Mensagem" textarea error={errors.mensagem} />
              <div className="mt-2 flex flex-wrap items-center gap-4">
                <Magnetic strength={0.2}>
                  <button
                    type="submit"
                    className="group inline-flex items-center gap-2 rounded-full bg-ink py-2 pr-2 pl-5 text-sm font-medium text-void transition-colors hover:bg-white"
                  >
                    Enviar e-mail
                    <span className="grid size-8 place-items-center rounded-full bg-void text-ink transition-transform duration-500 ease-out-expo group-hover:-rotate-12">
                      <Send className="size-3.5" />
                    </span>
                  </button>
                </Magnetic>
                <motion.p
                  key={status}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="text-sm text-mist"
                  aria-live="polite"
                >
                  {status}
                </motion.p>
              </div>
            </Spotlight>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
