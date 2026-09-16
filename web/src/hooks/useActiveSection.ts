import { useEffect, useState } from "react";

// Seção ativa = a que cruza uma linha a 35% da altura da viewport.
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-35% 0px -64% 0px" },
    );
    els.forEach((el) => io.observe(el));

    // Acima da primeira seção nenhum link fica ativo.
    const onScroll = () => {
      if (window.scrollY < els[0].offsetTop - window.innerHeight * 0.35) setActive(null);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [ids]);

  return active;
}
