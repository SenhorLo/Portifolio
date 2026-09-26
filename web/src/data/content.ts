// Todo o conteúdo do portfólio vive aqui. Fonte: versão anterior do site (docs/index.html).

export const profile = {
  name: "Lorenzo Tacca Orssatto",
  firstName: "Lorenzo",
  lastName: "Tacca Orssatto",
  brand: { strong: "LTO", light: "Dev" },
  lead:
    "Profissional em formação, com perfil colaborativo e foco em gerar valor para cada entrega. Busco evoluir continuamente, assumindo responsabilidades e contribuindo com soluções que impactem pessoas e negócios.",
  roles: ["Desenvolvedor FullStack", "Analista de integração", "Integração bancária", "Suporte técnico"],
  email: "lorenzotacca16@gmail.com",
  github: "https://github.com/SenhorLo",
  githubLabel: "github.com/SenhorLo",
  linkedin: "https://www.linkedin.com/in/lorenzo-tacca-orssatto-b4b31b329/",
};

export const about =
  "Sou estudante de Análise e Desenvolvimento de Sistemas na Universidade de Passo Fundo (UPF), com experiência prática em ambientes corporativos. Atuei na Elevor Softwares com implantação e suporte de sistemas ERP, e na Ialum no desenvolvimento de soluções web e integrações para processos logísticos, sempre com foco em organização, entrega e evolução contínua.";

// Trechos do texto "Sobre" que ganham destaque na leitura.
export const aboutHighlights = [
  "Análise e Desenvolvimento de Sistemas",
  "Elevor Softwares",
  "Ialum",
];

export type Focus = { key: string; title: string; text: string; icon: "integrations" | "data" | "delivery" | "ops" };

export const focusAreas: Focus[] = [
  { key: "integracoes", title: "Integrações", text: "APIs, automações e processos de ERP", icon: "integrations" },
  { key: "dados", title: "Dados", text: "SQL Server, Postgres, MongoDB", icon: "data" },
  { key: "entrega", title: "Entrega", text: "Docker, ambientes e deploys simples", icon: "delivery" },
  { key: "operacao", title: "Operação", text: "SSH e suporte ao cliente", icon: "ops" },
];

export type SkillGroup = { title: string; icon: "code" | "plug" | "db" | "infra" | "role" | "tools"; items: string[] };

export const skillGroups: SkillGroup[] = [
  {
    title: "Linguagens",
    icon: "code",
    items: ["Python", "C# (.NET / ASP.NET)", "Java", "JavaScript", "TypeScript", "React", "Tailwindcss"],
  },
  { title: "Back-end / APIs", icon: "plug", items: ["FastAPI", "REST", "SOAP", "SSW", "Next.js", "ERP", "CNAB"] },
  { title: "Bancos de dados", icon: "db", items: ["SQL Server", "PostgreSQL", "MongoDB", "Oracle"] },
  { title: "Infra / DevOps", icon: "infra", items: ["Docker", "SSH", "GitHub", "Cloud Computing"] },
  {
    title: "Atuação",
    icon: "role",
    items: ["Desenvolvedor FullStack", "Analista de integração", "Integração bancária", "Suporte técnico"],
  },
  { title: "Ferramentas", icon: "tools", items: ["Claude Code", "Lovable", "Cursor", "Gemini"] },
];

export type Job = {
  company: string;
  role: string;
  period: string;
  // Início e fim como [ano, mês] (mês 1–12), inclusivos — usados no gráfico de linha do tempo.
  start: [number, number];
  end: [number, number];
  bullets: string[];
  stack: string[];
};

// Ordem cronológica inversa: o mais recente primeiro.
export const jobs: Job[] = [
  {
    company: "Ialum",
    role: "Desenvolvedor FullStack",
    period: "Fevereiro → Maio / 2026",
    start: [2026, 2],
    end: [2026, 5],
    bullets: [
      "Desenvolvimento de aplicações web com Postgres, FastAPI, React e Tailwindcss.",
      "Desenvolvimento com Claude Code.",
      "Integração com APIs REST, SOAP e SSW para cotação de frete.",
      "Servidor SSH com Docker para hospedagem das aplicações.",
      "Integração com tabelas para cotação de frete de transportadoras.",
    ],
    stack: ["Postgres", "FastAPI", "React", "Tailwindcss", "Docker", "SSH"],
  },
  {
    company: "Elevor Softwares",
    role: "Analista de infraestrutura",
    period: "Março → Julho / 2025",
    start: [2025, 3],
    end: [2025, 7],
    bullets: [
      "Instalação e configuração de sistemas ERP em diferentes ambientes.",
      "Desenvolvimento e personalização de layouts de etiquetas.",
      "Criação de integrações via API para automação de notas fiscais e e-commerce.",
      "Monitoramento de ambientes em nuvem.",
    ],
    stack: ["ERP", "APIs", "Cloud"],
  },
];

export type Project = {
  slug: string;
  name: string;
  tags: string[];
  category: string;
  description: string;
  url: string;
  accent: string; // cor de destaque do projeto
};

const asset = (p: string) => `${import.meta.env.BASE_URL}assets/${p}`;

// Capturas reais das páginas iniciais (1440×900), em duas larguras.
export const shotSrc = (slug: string, w: 640 | 1200) => asset(`shots/${slug}-${w}.webp`);

export const portrait = asset("lorenzo.webp");

export const projects: Project[] = [
  {
    slug: "historyai",
    name: "HistoryAI",
    tags: ["React", "IA", "História alternativa"],
    category: "Web",
    description:
      "Plataforma interativa que explora cenários históricos alternativos com inteligência artificial — e se a história tivesse sido diferente?",
    url: "https://historyai-97ze.onrender.com/",
    accent: "#e8b53a",
  },
  {
    slug: "clinicy",
    name: "Clinicy",
    tags: ["Next.js", "Stripe", "Agenda inteligente"],
    category: "SaaS",
    description:
      "Agenda inteligente para consultórios com feriados nacionais, estaduais e municipais aplicados automaticamente, grade por profissional e gestão de múltiplas unidades.",
    url: "https://clinicy-theta.vercel.app/",
    accent: "#3fbfa3",
  },
  {
    slug: "decorar",
    name: "Decorar",
    tags: ["Next.js", "Autenticação", "Marketplace"],
    category: "Marketplace",
    description:
      "Marketplace de móveis e objetos de decoração com negociação direta entre vendedor e comprador, busca por cidade e estado, painel de vendedor para criar anúncios e gerenciar lojas.",
    url: "https://decorar-iota.vercel.app/",
    accent: "#d4a05c",
  },
  {
    slug: "pomoflow",
    name: "PomoFlow",
    tags: ["Web app", "Técnica Pomodoro", "Produtividade"],
    category: "Web",
    description:
      "App de estudo baseado na Técnica Pomodoro: blocos de foco de 25 minutos com pausas curtas e longas, rotinas organizadas por dia e período, painel de progresso semanal e modo claro/escuro.",
    url: "https://pomoflow-omega.vercel.app/",
    accent: "#f87171",
  },
  {
    slug: "horizonte",
    name: "Horizonte",
    tags: ["React", "Vite", "Canvas", "Scrollytelling"],
    category: "Divulgação científica",
    description:
      "Atlas interativo sobre buracos negros: uma descida guiada pelo scroll da órbita externa até a singularidade, com diagrama em escala das camadas, comparação de massas e dados observacionais.",
    url: "https://black-hole-puce.vercel.app/",
    accent: "#fb923c",
  },
  {
    slug: "farol",
    name: "Farol",
    tags: ["React", "Three.js", "Web Audio", "Scrollytelling"],
    category: "Divulgação científica",
    description:
      "Atlas interativo sobre pulsares: da descoberta de Jocelyn Bell em 1967 à anatomia de uma estrela de nêutrons, com cena 3D em tempo real, comparação de campos magnéticos e sonificação dos pulsos.",
    url: "https://pulsar-star.vercel.app/",
    accent: "#7dd3fc",
  },
  {
    slug: "doctorhouse",
    name: "House, M.D.",
    tags: ["React", "GSAP", "Lenis", "Scrollytelling"],
    category: "Fan site",
    description:
      "Homenagem cinematográfica à série House, M.D. (2004–2012): o método do diagnóstico diferencial em seis etapas, fichas da equipe, as oito temporadas e um diagnóstico interativo.",
    url: "https://doctorhouse-rosy.vercel.app/",
    accent: "#7fb0d6",
  },
  {
    slug: "colapso",
    name: "Colapso",
    tags: ["React", "Vite", "WebGL", "Scrollytelling"],
    category: "Divulgação científica",
    description:
      "Atlas interativo do último segundo de uma estrela massiva: dez capítulos que vão do registro histórico das supernovas às camadas do núcleo, ao colapso em dez segundos, aos neutrinos e aos elementos que sobraram.",
    url: "https://supernova-eight-rouge.vercel.app/",
    accent: "#f97b45",
  },
  {
    slug: "tourbillon",
    name: "Tourbillon",
    tags: ["JavaScript", "GSAP", "Lenis", "Scrollytelling"],
    category: "Conceito",
    description:
      "Estudo conceitual de página para o relógio Bugatti Tourbillon da Jacob & Co: o motor V16 em miniatura revelado pelo scroll, as especificações do calibre e a edição limitada a seis peças. Sem vínculo com as marcas.",
    url: "https://bugatti-clock.vercel.app/",
    accent: "#2fbd63",
  },
  {
    slug: "wec",
    name: "FIA WEC Fan Hub",
    tags: ["HTML", "CSS", "JavaScript", "Endurance"],
    category: "Fan site",
    description:
      "Fan hub do FIA World Endurance Championship 2026: Hypercar e LMGT3, calendário global, contagem regressiva e seção dedicada às 24 Horas de Le Mans.",
    url: "https://senhorlo.github.io/FIAWECHUB/",
    accent: "#0ea5c8",
  },
];

export const degree = {
  institution: "Universidade de Passo Fundo (UPF)",
  title: "Bacharelado em Análise e Desenvolvimento de Sistemas",
  status: "em andamento",
  location: "Passo Fundo / RS",
  period: "2020 → 2025",
  forecast: "Previsão: 2026",
};

export type Course = { title: string; school: string; hours?: number; date: string; location?: string };

export const courses: Course[] = [
  { title: "IA para Dev: Usando o Windsurf para projetos prontos", school: "Alura", hours: 2, date: "07/07/2026" },
  { title: "IA para Dev: Lidando com projetos prontos com Cursor 2.0", school: "Alura", hours: 2, date: "01/07/2026" },
  { title: "IA para Dev: Automação de código e integração com Cursor", school: "Alura", hours: 8, date: "26/04/2026" },
  {
    title: "IA para Dev: Desenvolvendo códigos com ChatGPT, Grok, Claude e Gemini",
    school: "Alura",
    hours: 5,
    date: "15/04/2026",
  },
  { title: "Flash Skills: Web Apps dinâmicos com Lovable", school: "Alura", hours: 4, date: "20/02/2026" },
  { title: ".NET: Gerenciamento de memória para otimização de performance", school: "Alura", hours: 8, date: "08/02/2026" },
  { title: "Curso de inglês", school: "Aliança Inglesa Language School", date: "2021", location: "Rondonópolis / MT" },
];

export const contactBlurb =
  "Se quiser conversar sobre projetos, integrações ou oportunidades, me chame por e-mail ou LinkedIn.";

export const sections = [
  { id: "sobre", label: "Sobre" },
  { id: "habilidades", label: "Habilidades" },
  { id: "experiencia", label: "Experiência" },
  { id: "projetos", label: "Projetos" },
  { id: "formacao", label: "Formação" },
  { id: "contato", label: "Contato" },
] as const;
