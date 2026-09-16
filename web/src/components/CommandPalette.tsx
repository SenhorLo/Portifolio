import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Copy, CornerDownLeft, Hash, Search } from "lucide-react";
import { profile, projects, sections } from "../data/content";
import { GithubIcon, LinkedinIcon } from "./icons";

type Item = { id: string; group: string; label: string; hint?: string; icon: ReactNode; run: () => void };

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export default function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const close = () => onOpenChange(false);

  const items = useMemo<Item[]>(
    () => [
      ...sections.map((s) => ({
        id: `s-${s.id}`,
        group: "Seções",
        label: s.label,
        icon: <Hash className="size-4" />,
        run: () => document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" }),
      })),
      ...projects.map((p) => ({
        id: `p-${p.slug}`,
        group: "Projetos",
        label: p.name,
        hint: p.tags.join(" · "),
        icon: <span className="size-2.5 rounded-full" style={{ background: p.accent }} />,
        run: () => window.open(p.url, "_blank", "noopener"),
      })),
      {
        id: "copy-email",
        group: "Contato",
        label: "Copiar e-mail",
        hint: profile.email,
        icon: <Copy className="size-4" />,
        run: () => {
          navigator.clipboard?.writeText(profile.email).then(() => {
            setToast("E-mail copiado");
            window.setTimeout(() => setToast(null), 1800);
          });
        },
      },
      {
        id: "github",
        group: "Contato",
        label: "GitHub",
        hint: profile.githubLabel,
        icon: <GithubIcon className="size-4" />,
        run: () => window.open(profile.github, "_blank", "noopener"),
      },
      {
        id: "linkedin",
        group: "Contato",
        label: "LinkedIn",
        icon: <LinkedinIcon className="size-4" />,
        run: () => window.open(profile.linkedin, "_blank", "noopener"),
      },
    ],
    [],
  );

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return items;
    return items.filter((i) => normalize(`${i.label} ${i.hint ?? ""} ${i.group}`).includes(q));
  }, [items, query]);

  // Atalhos globais: Ctrl/⌘ + K abre e fecha, "/" abre.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement)?.closest?.("input, textarea, [contenteditable]");
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      } else if (e.key === "/" && !typing && !open) {
        e.preventDefault();
        onOpenChange(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (open) {
      lastFocus.current = document.activeElement as HTMLElement;
      setQuery("");
      setIndex(0);
      requestAnimationFrame(() => input.current?.focus());
    } else {
      lastFocus.current?.focus?.();
    }
  }, [open]);

  useEffect(() => setIndex(0), [query]);

  useEffect(() => {
    list.current?.querySelector(`[data-index="${index}"]`)?.scrollIntoView({ block: "nearest" });
  }, [index]);

  const runItem = (item?: Item) => {
    if (!item) return;
    close();
    // Deixa o painel fechar antes de rolar a página.
    window.setTimeout(item.run, 120);
  };

  const onKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => (i + 1) % Math.max(filtered.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) => (i - 1 + filtered.length) % Math.max(filtered.length, 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      runItem(filtered[index]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "Tab") {
      e.preventDefault(); // foco preso no campo de busca
    }
  };

  let lastGroup = "";

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-start justify-center px-4 pt-[14vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute inset-0 bg-void/70 backdrop-blur-sm" onClick={close} />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Navegação rápida"
              className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-abyss/95 shadow-[0_40px_120px_-20px_rgba(0,0,0,.8),inset_0_0_0_1px_rgba(255,255,255,.1)]"
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 420, damping: 34 }}
              onKeyDown={onKeyDown}
            >
              <div className="flex items-center gap-3 border-b border-line px-5">
                <Search className="size-4 text-mist" />
                <input
                  ref={input}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar seções, projetos, contato…"
                  className="h-14 flex-1 bg-transparent text-ink outline-none placeholder:text-dim"
                  role="combobox"
                  aria-expanded="true"
                  aria-controls="palette-list"
                  aria-activedescendant={filtered[index] ? `pal-${filtered[index].id}` : undefined}
                />
                <kbd className="rounded-md bg-white/5 px-1.5 py-0.5 font-mono text-[0.65rem] text-mist">ESC</kbd>
              </div>

              <ul ref={list} id="palette-list" role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
                {filtered.length === 0 && <li className="px-4 py-10 text-center text-sm text-mist">Nada encontrado.</li>}
                {filtered.map((item, i) => {
                  const header = item.group !== lastGroup ? item.group : null;
                  lastGroup = item.group;
                  const selected = i === index;
                  return (
                    <li key={item.id} role="presentation">
                      {header && <p className="px-3 pt-3 pb-1.5 font-mono text-[0.65rem] tracking-widest text-dim uppercase">{header}</p>}
                      <div
                        id={`pal-${item.id}`}
                        role="option"
                        aria-selected={selected}
                        data-index={i}
                        onPointerMove={() => setIndex(i)}
                        onClick={() => runItem(item)}
                        className="relative flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5"
                      >
                        {selected && (
                          <motion.span
                            layoutId="palette-sel"
                            className="absolute inset-0 rounded-xl bg-white/[0.06]"
                            transition={{ type: "spring", stiffness: 500, damping: 40 }}
                          />
                        )}
                        <span className="relative grid size-8 place-items-center rounded-lg bg-white/[0.04] text-mist">{item.icon}</span>
                        <span className="relative min-w-0 flex-1">
                          <span className="block text-sm text-ink">{item.label}</span>
                          {item.hint && <span className="block truncate text-xs text-dim">{item.hint}</span>}
                        </span>
                        {selected &&
                          (item.group === "Seções" ? (
                            <CornerDownLeft className="relative size-3.5 text-mist" />
                          ) : (
                            <ArrowUpRight className="relative size-3.5 text-mist" />
                          ))}
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="flex items-center gap-4 border-t border-line px-5 py-3 font-mono text-[0.65rem] text-dim">
                <span>↑↓ navegar</span>
                <span>↵ abrir</span>
                <span className="ml-auto">/ ou Ctrl K</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            className="fixed bottom-6 left-1/2 z-[95] -translate-x-1/2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-void"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
