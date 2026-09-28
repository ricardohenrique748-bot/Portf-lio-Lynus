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
    { label: "Diagnóstico", href: "#diagnostico" },
    { label: "Serviços",    href: "#servicos" },
    { label: "Quem faz",    href: "#quem-faz" },
    { label: "Perguntas",   href: "#perguntas" },
  ],
  cta: "Agendar diagnóstico",
};

// Links de WhatsApp com mensagem pronta
const WHATSAPP_NUMERO = "5599991754232";
const waLink = (texto) => "https://wa.me/" + WHATSAPP_NUMERO + "?text=" + encodeURIComponent(texto);

const HERO = {
  title: ["Sistemas de gestão", "feitos por quem já", "viveu a operação."],
  titleAccentLine: 2,
  sub: "A Lynus cria sistemas web e apps sob medida para empresas de transporte, construção, indústria e agro. Compras, estoque, RH, financeiro, manutenção e PCM conectados num só lugar, no lugar de planilhas que não conversam.",
  ctaPrimary: "Agendar diagnóstico",
  ctaSecondary: "Falar no WhatsApp",
  whatsapp: waLink("Olá, Ricardo. Vi o site da Lynus e quero entender o diagnóstico de processos."),
  note: "Atendimento em todo o Brasil, 100% remoto quando você preferir.",
};

const LOGOS = ["Nuvora", "Paxil", "Helio", "Cortex", "Vantix", "Orbita"];

const STATS = [
  { v: 62, suf: "%", k: "Redução no MTTR", d: "tempo médio de resolução" },
  { v: 99.99, suf: "%", k: "Disponibilidade", d: "SLA garantido", dec: 2 },
  { v: 4.2, suf: "s", k: "Tempo até o alerta", d: "da detecção ao aviso", dec: 1 },
  { v: 200, suf: "+", k: "Integrações", d: "conecte sua stack" },
];

const FEATURES = {
  title: "Onde a empresa perde dinheiro sem perceber",
  sub: "Na maioria das operações, o problema não é falta de dado. É dado espalhado em planilha, nota fiscal, grupo de WhatsApp e cabeça de encarregado.",
  items: [
    { icon: "cart", title: "Compra sem processo",
      desc: "Pedido chega por WhatsApp, sem cotação registrada e sem alçada de aprovação. Ninguém sabe quanto foi comprado de quem, nem por quê." },
    { icon: "box", title: "Estoque que não bate",
      desc: "A peça some, o inventário nunca fecha e o mesmo item é comprado duas vezes porque ninguém confia no saldo." },
    { icon: "wrench", title: "Manutenção só corretiva",
      desc: "A preventiva existe no papel, mas vence sem ninguém ver. O equipamento para e a quebra custa várias vezes mais que a revisão." },
    { icon: "users", title: "RH no papel",
      desc: "Férias, documentos, ASO, treinamentos e EPI controlados em pastas e planilhas. O vencimento só aparece quando vira multa ou afastamento." },
    { icon: "coin", title: "Financeiro fechando no escuro",
      desc: "O custo por centro de custo sai no fim do mês, quando sai. Decisão de preço e de corte é tomada sem saber onde o dinheiro realmente foi." },
    { icon: "unlink", title: "Áreas que não conversam",
      desc: "Compras não vê o estoque, a manutenção não vê as compras e o financeiro recebe tudo depois. Cada área redigita o que a outra já lançou." },
  ],
};

const DIAGNOSTICO = {
  eyebrow: "Oferta de entrada",
  boxTitle: "Diagnóstico de Processos e Custos",
  boxText: "Escolhemos com você a área que mais dói, ou olhamos a empresa inteira. Pegamos os dados do jeito que estão e devolvemos um retrato claro de onde está o desperdício e onde agir primeiro.",
  entregas: [
    "Mapa dos processos atuais, com retrabalhos e pontos sem controle",
    "Indicadores da área levantados com os seus próprios dados",
    "Esboço das telas do sistema que resolve o problema",
    "Relatório com as 5 ações de maior retorno",
    "Reunião de apresentação com a gestão",
  ],
  cta: "Quero o diagnóstico",
  title: "Uma semana, valor fechado, sem contrato longo",
  sub: "Se depois disso fizer sentido automatizar, você já sabe exatamente o que o sistema precisa resolver. Se não fizer, o relatório continua seu.",
  dias: [
    { d: "Dia 1",      t: "Conversa com as áreas",             x: "Como compras, estoque, RH, financeiro e manutenção trabalham hoje." },
    { d: "Dia 2 a 4",  t: "Levantamento de dados e fluxos",    x: "Planilhas, notas fiscais, requisições, ordens de serviço e relatórios do sistema atual." },
    { d: "Dia 5 e 6",  t: "Análise e desenho da solução",      x: "Indicadores por área e esboço das telas do sistema recomendado." },
    { d: "Dia 7",      t: "Apresentação",                      x: "Resultado, prioridades e quais módulos resolvem primeiro." },
  ],
};

const SOLUCOES = {
  eyebrow: "Serviços",
  title: "Módulos que conversam entre si",
  sub: "Você começa pelo módulo que mais dói e adiciona os outros depois. Cada novo módulo já nasce ligado aos anteriores, sem redigitar nada.",
  items: [
    { id: "compras", title: "Compras e suprimentos", icon: "cart", href: "pcm.html",
      desc: "Da requisição ao pedido, com histórico de fornecedor e aprovação registrada.",
      itens: ["Requisição, cotação e comparativo", "Aprovação por alçada", "Pedido de compra e recebimento"] },
    { id: "estoque", title: "Estoque e almoxarifado", icon: "box", href: "estoque.html",
      desc: "Saldo confiável, com cada saída ligada a quem retirou e para onde foi.",
      itens: ["Entradas, saídas e transferências", "Inventário e ponto de pedido", "Consumo por centro de custo"] },
    { id: "pcm", title: "Manutenção e PCM", icon: "wrench", href: "manutencao.html",
      desc: "Planejamento e controle da manutenção de frota, máquinas e instalações.",
      itens: ["OS e plano de preventiva por km, hora ou data", "Backlog e programação", "Disponibilidade, MTBF e MTTR"] },
    { id: "rh", title: "RH e departamento pessoal", icon: "users", href: "rh.html",
      desc: "Cadastro e rotinas dos colaboradores, com alerta antes de vencer.",
      itens: ["Admissão e documentos", "Férias, ASO e treinamentos", "Controle de entrega de EPI"] },
    { id: "financeiro", title: "Financeiro e custos", icon: "coin", href: "financeiro.html",
      desc: "O dinheiro de todas as áreas num só lugar, organizado por centro de custo.",
      itens: ["Contas a pagar e a receber", "Fluxo de caixa", "DRE gerencial e custo por centro de custo"] },
    { id: "paineis", title: "Painéis, apps e integrações", icon: "plug",
      desc: "A informação lançada no campo e vista pela gestão, sem esperar o fim do mês.",
      itens: ["Painéis de indicadores dentro do próprio sistema", "Apps Android que funcionam offline", "Integração com ERP, telemetria e planilhas"] },
  ],
};

const VANTAGENS = [
  { icon: "deploy",   title: "Implantação",       desc: "Baixos custos de implantação, integração e customização." },
  { icon: "cloud",    title: "Infra em nuvem",    desc: "Opção de infraestrutura em nuvem (SaaS), sem custos adicionais." },
  { icon: "discount", title: "Descontos especiais", desc: "Descontos especiais para grandes volumes." },
  { icon: "headset",  title: "Atendimento",       desc: "Atendimento direto do fabricante em português." },
  { icon: "shield",   title: "Segurança de dados", desc: "Criptografia e backups automáticos para proteger suas informações." },
];

const PROCESSO = {
  title: "Como um projeto acontece",
  etapas: [
    { t: "Diagnóstico",           x: "Entendemos a operação e medimos o custo atual." },
    { t: "Escopo e proposta",     x: "Prazo, valor e entregas definidos por escrito antes de começar." },
    { t: "Entregas curtas",       x: "Versões funcionando a cada duas semanas, testadas com a sua equipe." },
    { t: "Implantação e suporte", x: "Treinamento de quem usa e acompanhamento após a entrada em produção." },
  ],
};

const FAQ = {
  title: "Perguntas frequentes",
  items: [
    { q: "Preciso contratar todos os módulos?",
      a: "Não. A maioria dos clientes começa por uma área, geralmente compras e estoque ou manutenção, e adiciona as outras quando a primeira já está rodando." },
    { q: "Já uso um ERP. Vocês substituem?",
      a: "Não necessariamente. Muitas vezes o ERP cuida bem do fiscal e do contábil, e o que falta é o controle do dia a dia da operação. Nesse caso, integramos os dois." },
    { q: "Meus dados estão bagunçados em planilhas.",
      a: "É o ponto de partida mais comum. A organização desses dados faz parte do diagnóstico." },
    { q: "Como ficam a segurança e a LGPD?",
      a: "Os dados ficam sob contrato de confidencialidade, com acesso restrito por perfil. Informações pessoais de colaboradores são tratadas conforme a LGPD." },
    { q: "Como funciona o atendimento a distância?",
      a: "Atendemos empresas de todo o Brasil. Levantamento, reuniões, entregas e treinamento acontecem por videochamada, e o sistema roda na nuvem, acessível de qualquer unidade. Quando o projeto exige, fazemos visita presencial à operação." },
  ],
};

const CONTATO = {
  title: "Descubra onde sua operação está perdendo dinheiro",
  sub: "Preencha em 30 segundos. A conversa continua no WhatsApp, direto com o Ricardo.",
  email: "ricardoluz@lynustech.com.br",
  local: "São José do Rio Preto, SP. Atendimento em todo o Brasil.",
  portes: ["até 20", "de 21 a 50", "de 51 a 200", "mais de 200"],
  areas: ["Compras", "Estoque", "Manutenção e PCM", "RH e departamento pessoal", "Financeiro", "Várias áreas"],
  privacidade: "Seus dados são usados apenas para retornar o contato.",
};

const FOOTER = {
  tagline: "Sistemas de gestão para empresas de operação.",
  cols: [
    { h: "Site", items: [
      { label: "Diagnóstico", href: "#diagnostico" },
      { label: "Serviços",    href: "#servicos" },
      { label: "Quem faz",    href: "#quem-faz" },
      { label: "Perguntas",   href: "#perguntas" },
    ] },
    { h: "Contato", items: [
      { label: "WhatsApp", href: waLink("Olá, Ricardo. Vi o site da Lynus."), external: true },
      { label: "ricardoluz@lynustech.com.br", href: "mailto:ricardoluz@lynustech.com.br" },
      { label: "São José do Rio Preto, SP" },
    ] },
  ],
  copyright: "© 2026 Lynus Tecnologia. Todos os direitos reservados. CNPJ 68.200.725/0001-67",
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
  eyebrow: "Quem faz",
  title: "Quem está por trás da Lynus",
  paragrafos: [
    "Ricardo Luz é administrador de empresas com MBA em Logística. Antes de desenvolver software, passou anos em rotinas administrativas, almoxarifado, suprimentos e planejamento de manutenção de equipamentos pesados.",
    "Por isso a Lynus não precisa de tradução para requisição, alçada, inventário, OS ou centro de custo. Ela já sabe onde o controle costuma quebrar entre uma área e outra.",
  ],
  trajeto: [
    { t: "Administrativo e almoxarifado", x: "Rotinas administrativas, estoque de peças, entradas e saídas" },
    { t: "Suprimentos",                   x: "Compras, fornecedores e custo de reposição" },
    { t: "Planejamento de manutenção",    x: "PCM de linha amarela e frota diesel, até supervisor de planejamento" },
    { t: "Desenvolvimento full stack",    x: "Sistemas web, apps Android e iOS e automação" },
  ],
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
};

window.LYNUS = { ACCENTS, applyAccent, hexToRgba, NAV, HERO, LOGOS, STATS, FEATURES, DIAGNOSTICO, SOLUCOES, VANTAGENS, PROCESSO, FAQ, CONTATO, FOOTER, SOBRE, WHATSAPP_NUMERO, waLink, observeVisible, startVisibility };
