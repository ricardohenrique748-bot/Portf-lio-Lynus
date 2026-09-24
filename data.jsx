/* ============================================================
   LYNUS TECH — Content (pt-BR) + accent palettes
   ============================================================ */

// Accent palettes keyed by name. Each maps to the CSS custom props.
const ACCENTS = {
  azul:    { accent: "#6b8aff", accent2: "#36d0e8", name: "Azul" },
  laranja: { accent: "#ff8a3d", accent2: "#ffc24b", name: "Laranja" },
  ambar:   { accent: "#f5c518", accent2: "#ffe08a", name: "Âmbar" },
  verde:   { accent: "#34e0a1", accent2: "#7af0c8", name: "Verde" },
};

function hexToRgba(hex, a) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function applyAccent(name) {
  const a = ACCENTS[name] || ACCENTS.azul;
  const root = document.documentElement.style;
  root.setProperty("--accent", a.accent);
  root.setProperty("--accent-2", a.accent2);
  root.setProperty("--accent-soft", hexToRgba(a.accent, 0.14));
  root.setProperty("--accent-line", hexToRgba(a.accent, 0.34));
  root.setProperty("--accent-glow", hexToRgba(a.accent, 0.42));
}

const NAV = {
  links: [
    { label: "Início",      href: "#top" },
    { label: "Recursos",    href: "#recursos" },
    { label: "Soluções",    href: "#solucoes" },
    { label: "Sobre",       href: "#sobre" },
    { label: "Contato",     href: "#cta" },
  ],
  cta: "Falar no WhatsApp",
};

const HERO = {
  title: ["Problemas acontecem.", "A Lynus", "resolve."],
  titleAccentLine: 2,
  sub: "A Lynus Tech é a central completa para mapear, automatizar e otimizar os fluxos da sua operação. Detecção de gargalos em tempo real, automação de workflows e relatórios inteligentes — tudo em um só lugar.",
  ctaPrimary: "Começar agora",
  ctaSecondary: "Agendar demo",
  bullets: [
    { k: "Detecção em tempo real", d: "Em menos de 5s" },
    { k: "Automação de workflows", d: "Runbooks automáticos" },
    { k: "Relatórios inteligentes", d: "Post-mortem automático" },
  ],
  trustLabel: "Equipes de engenharia que confiam na Lynus",
};

const LOGOS = ["Nuvora", "Paxil", "Helio", "Cortex", "Vantix", "Orbita"];

const STATS = [
  { v: 62, suf: "%", k: "Redução no MTTR", d: "tempo médio de resolução" },
  { v: 99.99, suf: "%", k: "Disponibilidade", d: "SLA garantido", dec: 2 },
  { v: 4.2, suf: "s", k: "Tempo até o alerta", d: "da detecção ao aviso", dec: 1 },
  { v: 200, suf: "+", k: "Integrações", d: "conecte sua stack" },
];

const FEATURES = [
  {
    span: "wide", icon: "pulse", tag: "Detecção",
    title: "Detecção em tempo real",
    desc: "Monitore métricas, logs e traces num único painel. A correlação por IA agrupa sinais ruidosos em um incidente acionável — antes do primeiro cliente perceber.",
  },
  {
    span: "tall", icon: "flow", tag: "Automação",
    title: "Workflows que se executam sozinhos",
    desc: "Runbooks automáticos disparam a resposta — reiniciam serviços, isolam nós e notificam o time certo enquanto você dorme.",
  },
  {
    span: "norm", icon: "bell", tag: "On-call",
    title: "Plantão inteligente",
    desc: "Escalonamento que avisa a pessoa certa, na hora certa.",
  },
  {
    span: "norm", icon: "doc", tag: "Post-mortem",
    title: "Linha do tempo automática",
    desc: "Cada incidente vira um relatório pronto para o retrospecto.",
  },
  {
    span: "wide", icon: "plug", tag: "Integrações",
    title: "Conecte toda a sua stack",
    desc: "Slack, PagerDuty, Datadog, AWS, GitHub e mais de 200 ferramentas — em dois cliques.",
    chips: ["Slack", "Datadog", "AWS", "GitHub", "Jira", "+200"],
  },
];

const SOLUCOES = {
  eyebrow: "Nossas soluções",
  title: "Uma plataforma. Todas as frentes da sua operação.",
  sub: "Módulos conectados que cobrem cada etapa do fluxo — organize, edite ou expanda conforme sua operação cresce.",
  items: [
    { id: "financeiro", title: "Financeiro", desc: "Controle de receitas, despesas, DRE e fluxo de caixa com indicadores em tempo real.", icon: "💰", href: "financeiro.html", tags: ["DRE", "Fluxo de caixa"], accent: "#6b8aff" },
    { id: "estoque", title: "Estoque", desc: "Controle de entradas, saídas e níveis de estoque, com alertas de ruptura e giro por item.", icon: "📦", href: "estoque.html", tags: ["Inventário", "Giro"], accent: "#34e0a1" },
    { id: "compras", title: "Compras", desc: "Gestão de pedidos, fornecedores, orçamentos e aprovações de compras num único fluxo.", icon: "🛒", href: "pcm.html", tags: ["Fornecedores", "Aprovações"], accent: "#ffb547" },
    { id: "rh", title: "RH", desc: "Gestão de colaboradores, ponto, documentos e indicadores de pessoas centralizados.", icon: "👥", href: "rh.html", tags: ["Colaboradores", "Ponto"], accent: "#f5c518" },
    { id: "crm", title: "CRM", desc: "Relacionamento com clientes, funil de vendas e histórico de contatos em um só lugar.", icon: "🤝", href: "crm.html", tags: ["Funil", "Clientes"], accent: "#36d0e8" },
    { id: "pcm", title: "PCM", desc: "Planejamento e controle de manutenções preventivas, preditivas e corretivas.", icon: "🔧", href: "manutencao.html", tags: ["Preventiva", "Ordens de serviço"], accent: "#ff8a3d" },
  ],
};

const VANTAGENS = [
  { icon: "deploy",   title: "Implantação",       desc: "Baixos custos de implantação, integração e customização." },
  { icon: "cloud",    title: "Infra em nuvem",    desc: "Opção de infraestrutura em nuvem (SaaS), sem custos adicionais." },
  { icon: "discount", title: "Descontos especiais", desc: "Descontos especiais para grandes volumes." },
  { icon: "headset",  title: "Atendimento",       desc: "Atendimento direto do fabricante em português." },
  { icon: "shield",   title: "Segurança de dados", desc: "Criptografia e backups automáticos para proteger suas informações." },
];

const CTA = {
  eyebrow: "Pronto quando você estiver",
  title: "Durma tranquilo. A Lynus está de plantão.",
  sub: "Comece grátis em minutos. Sem cartão de crédito, sem configuração complexa.",
  primary: "Começar agora",
  secondary: "Falar com vendas",
};

const FOOTER = {
  tagline: "A central de resposta a incidentes para equipes que não podem parar.",
  cols: [
    { h: "Produto", items: ["Plataforma", "Automação", "On-call", "Status pages", "Preços"] },
    { h: "Empresa", items: ["Sobre", "Clientes", "Carreiras", "Blog", "Contato"] },
    { h: "Recursos", items: ["Documentação", "API", "Changelog", "Comunidade", "Status"] },
    { h: "Legal", items: ["Privacidade", "Termos", "Segurança", "LGPD"] },
  ],
  copyright: "© 2026 Lynus Tech. Todos os direitos reservados. CNPJ 68.200.725/0001-67",
};

/* ---- reliable visibility manager (IntersectionObserver is flaky in sandbox) ---- */
const _visList = [];
function observeVisible(el, cb) {
  if (!el) return;
  _visList.push({ el, cb, done: false });
}
function _checkVisible() {
  const vh = window.innerHeight || document.documentElement.clientHeight;
  for (const item of _visList) {
    if (item.done || !item.el.isConnected) continue;
    const r = item.el.getBoundingClientRect();
    if (r.top < vh * 0.9 && r.bottom > 0) {
      item.done = true;
      item.cb();
    }
  }
}
window.addEventListener("scroll", _checkVisible, { passive: true });
window.addEventListener("resize", _checkVisible);
function startVisibility() {
  _checkVisible();
  requestAnimationFrame(_checkVisible);
  setTimeout(_checkVisible, 120);
}

const SOBRE = {
  eyebrow: "Nossa história",
  title: "Construída por quem viveu a operação de perto",
  mission: "A Lynus nasce da experiência real dentro de operações industriais, manutenção de frota, planejamento e gestão de processos. Antes de ser uma empresa de tecnologia, ela vem da prática: do dia a dia com ordens de serviço, preventivas atrasadas, compras urgentes e decisões tomadas sem dados confiáveis.",
  founder: {
    name: "Ricardo Henrique",
    role: "Fundador",
    bio: "Profissional com atuação em planejamento de manutenção, PCM, compras, gestão de indicadores e desenvolvimento de sistemas.",
    photo: "ricardo.jpg",
  },
  coFounder: {
    name: "Walisson Felipe",
    role: "Co-fundador",
    bio: "Profissional com atuação em análise de dados, Power BI, SQL, automação de relatórios e inteligência empresarial aplicada a processos corporativos.",
    initials: "WF",
  },
  values: [
    { icon: "⚡", label: "Velocidade", text: "Operações não podem esperar. Criamos ferramentas que agilizam decisões, reduzem burocracia e aproximam o problema da solução." },
    { icon: "🎯", label: "Precisão", text: "Indicadores, ordens de serviço, custos e dados operacionais precisam estar corretos e disponíveis. Decidir com base em informação real — não em achismos." },
    { icon: "🔗", label: "Integração", text: "Setores isolados geram perda de tempo e dinheiro. A Lynus integra manutenção, compras, financeiro e operação em um único fluxo rastreável." },
  ],
  storyNarrative: [
    "A Lynus nasceu da vivência dentro da operação. Dos desafios enfrentados em campo, nas oficinas, nas rotinas de planejamento e nas cobranças por resultado.",
    "Manutenções sem histórico confiável, peças solicitadas por mensagem, compras perdidas em e-mail, indicadores feitos manualmente e equipes dependendo da memória de uma única pessoa para tomar decisões. A partir dessas dores surgiu a missão.",
  ],
  missionStatement: "Criar soluções digitais acessíveis, inteligentes e práticas para empresas que precisam organizar sua operação, controlar seus processos e tomar decisões com mais segurança.",
  timeline: [
    { year: "2022", text: "Início da experiência prática em operações industriais, manutenção, planejamento e controle de processos." },
    { year: "2023", text: "Desenvolvimento das primeiras ideias voltadas para controle de manutenção, ordens de serviço e gestão operacional." },
    { year: "2024", text: "Expansão para sistemas integrados: compras, financeiro, estoque, dashboards e automação de processos." },
    { year: "2025", text: "Consolidação da Lynus como empresa de tecnologia com foco em plataformas digitais e gestão inteligente." },
    { year: "2026", text: "Evolução para soluções completas em sistemas empresariais, PCM, dashboards e desenvolvimento sob demanda." },
  ],
  numbers: [
    { v: "25+", label: "Sistemas ativos" },
    { v: "100%", label: "Foco em operações" },
    { v: "0", label: "Planilhas necessárias" },
    { v: "24/7", label: "Dados em tempo real" },
  ],
};

window.LYNUS = { ACCENTS, applyAccent, hexToRgba, NAV, HERO, LOGOS, STATS, FEATURES, SOLUCOES, VANTAGENS, CTA, FOOTER, SOBRE, observeVisible, startVisibility };
