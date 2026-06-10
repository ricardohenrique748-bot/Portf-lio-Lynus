/* ============================================================
   LYNUS TECH — Live command-center dashboard (the hero piece)
   ============================================================ */
const { useState, useEffect, useRef, useMemo } = React;

/* animated integer/decimal that eases from current value to a target.
   Uses setInterval (requestAnimationFrame is throttled in some preview contexts). */
function useCountUp(target, dec = 0, dur = 1400) {
  const [val, setVal] = useState(0);
  const fromRef = useRef(0);
  useEffect(() => {
    const from = fromRef.current;
    const start = Date.now();
    const id = setInterval(() => {
      const p = Math.min(1, (Date.now() - start) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      const cur = from + (target - from) * e;
      fromRef.current = cur;
      setVal(cur);
      if (p >= 1) { fromRef.current = target; setVal(target); clearInterval(id); }
    }, 33);
    return () => clearInterval(id);
  }, [target]);
  return dec ? val.toFixed(dec) : Math.round(val).toLocaleString("pt-BR");
}

function StatTile({ label, value, suf, dec, delta, up }) {
  const v = useCountUp(value, dec);
  return (
    <div className="dash-stat">
      <span className="dash-stat-label">{label}</span>
      <span className="dash-stat-val">{v}<i>{suf}</i></span>
      <span className={"dash-stat-delta " + (up ? "up" : "down")}>
        {up ? "▲" : "▼"} {delta}
      </span>
    </div>
  );
}

/* animated area chart */
function AreaChart({ accent }) {
  const pts = useMemo(() => {
    const base = [4, 5, 4, 7, 6, 9, 7, 11, 8, 6, 9, 13, 10, 8, 12, 9];
    return base;
  }, []);
  const w = 520, h = 120, pad = 6;
  const max = Math.max(...pts) + 2;
  const step = (w - pad * 2) / (pts.length - 1);
  const coords = pts.map((p, i) => [pad + i * step, h - pad - (p / max) * (h - pad * 2)]);
  const line = coords.map((c, i) => (i === 0 ? "M" : "L") + c[0].toFixed(1) + " " + c[1].toFixed(1)).join(" ");
  const area = line + ` L ${coords[coords.length - 1][0].toFixed(1)} ${h} L ${coords[0][0].toFixed(1)} ${h} Z`;
  const ref = useRef(null);
  useEffect(() => {
    const path = ref.current;
    if (!path) return;
    const len = path.getTotalLength();
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len;
    path.getBoundingClientRect();
    path.style.transition = "stroke-dashoffset 1.6s cubic-bezier(.4,.7,.2,1)";
    path.style.strokeDashoffset = 0;
  }, []);
  return (
    <svg className="dash-chart-svg" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.32" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((g) => (
        <line key={g} x1="0" x2={w} y1={h * g} y2={h * g} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      ))}
      <path d={area} fill="url(#areaFill)" />
      <path ref={ref} d={line} fill="none" stroke="var(--accent)" strokeWidth="2.4"
            strokeLinejoin="round" strokeLinecap="round" />
      {coords.map((c, i) => (
        <circle key={i} cx={c[0]} cy={c[1]} r={i === coords.length - 1 ? 3.6 : 0}
                fill="var(--accent)" stroke="#0a0a0c" strokeWidth="2" />
      ))}
    </svg>
  );
}

const SEV = {
  crit: { label: "Crítico", c: "var(--crit)", s: "var(--crit-soft)" },
  high: { label: "Alto", c: "var(--warn)", s: "var(--warn-soft)" },
  med: { label: "Médio", c: "var(--accent)", s: "var(--accent-soft)" },
};

const SEED_INCIDENTS = [
  { id: "INC-2041", sev: "crit", svc: "api-gateway", msg: "Latência p99 acima de 2s", t: 0, who: "M. Alves" },
  { id: "INC-2039", sev: "high", svc: "checkout-svc", msg: "Taxa de erro 5xx em 4,1%", t: 3, who: "Auto-runbook" },
  { id: "INC-2037", sev: "med", svc: "auth-service", msg: "Pico de tentativas de login", t: 8, who: "J. Pereira" },
  { id: "INC-2034", sev: "med", svc: "billing-worker", msg: "Fila de jobs acumulando", t: 14, who: "Resolvido" },
];

const NEW_POOL = [
  { sev: "high", svc: "search-cluster", msg: "Node 03 não responde ao health check", who: "Auto-runbook" },
  { sev: "crit", svc: "payments-svc", msg: "Timeout no provedor de pagamento", who: "M. Alves" },
  { sev: "med", svc: "cdn-edge", msg: "Cache hit ratio abaixo do esperado", who: "L. Costa" },
  { sev: "high", svc: "db-primary", msg: "Conexões próximas do limite do pool", who: "Auto-runbook" },
];

function IncidentRow({ it, fresh }) {
  const s = SEV[it.sev];
  return (
    <div className={"dash-inc" + (fresh ? " fresh" : "")}>
      <span className="dash-inc-bar" style={{ background: s.c }}></span>
      <div className="dash-inc-main">
        <div className="dash-inc-top">
          <span className="dash-inc-sev" style={{ color: s.c, background: s.s }}>{s.label}</span>
          <span className="dash-inc-id">{it.id}</span>
          <span className="dash-inc-svc">{it.svc}</span>
        </div>
        <div className="dash-inc-msg">{it.msg}</div>
      </div>
      <div className="dash-inc-meta">
        <span className="dash-inc-who">{it.who}</span>
        <span className="dash-inc-time">{it.t === 0 ? "agora" : `há ${it.t}m`}</span>
      </div>
    </div>
  );
}

const SERVICES = [
  { n: "api-gateway", st: "crit" }, { n: "checkout", st: "warn" }, { n: "auth", st: "ok" },
  { n: "billing", st: "ok" }, { n: "search", st: "warn" }, { n: "notify", st: "ok" },
  { n: "cdn-edge", st: "ok" }, { n: "db-primary", st: "ok" },
];

function Clock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(i);
  }, []);
  return <span className="dash-clock">{now.toLocaleTimeString("pt-BR")}</span>;
}

function LynusDashboard({ density = "command" }) {
  const [tab, setTab] = useState("overview");
  const [incidents, setIncidents] = useState(SEED_INCIDENTS);
  const [freshId, setFreshId] = useState(null);
  const counter = useRef(2042);
  const poolIdx = useRef(0);

  // periodically inject a new incident at the top
  useEffect(() => {
    const i = setInterval(() => {
      const tmpl = NEW_POOL[poolIdx.current % NEW_POOL.length];
      poolIdx.current++;
      const id = "INC-" + counter.current++;
      const ni = { ...tmpl, id, t: 0 };
      setFreshId(id);
      setIncidents((prev) => [ni, ...prev.map((p) => ({ ...p, t: p.t + 1 }))].slice(0, 5));
      setTimeout(() => setFreshId(null), 1400);
    }, 5200);
    return () => clearInterval(i);
  }, []);

  const activeCount = incidents.filter((x) => x.who !== "Resolvido").length;

  return (
    <div className={"dash glass " + (density === "focus" ? "dash-focus" : "")}>
      {/* window chrome */}
      <div className="dash-chrome">
        <div className="dash-dots"><i></i><i></i><i></i></div>
        <div className="dash-tabs">
          {[["overview", "Visão geral"], ["incidents", "Incidentes"], ["services", "Serviços"]].map(([k, l]) => (
            <button key={k} className={"dash-tab" + (tab === k ? " on" : "")} onClick={() => setTab(k)}>{l}</button>
          ))}
        </div>
        <div className="dash-live"><span className="dash-live-dot"></span>AO VIVO <Clock /></div>
      </div>

      <div className="dash-body">
        {/* stat row */}
        <div className="dash-stats">
          <StatTile label="Incidentes ativos" value={activeCount} suf="" delta="2 hoje" up />
          <StatTile label="MTTR" value={11} suf="min" delta="38% vs. mês" up={false} />
          <StatTile label="Uptime 24h" value={99.98} suf="%" dec={2} delta="estável" up />
          <StatTile label="Alertas / 24h" value={1284} suf="" delta="12% pico" up />
        </div>

        <div className="dash-grid">
          {/* incident feed */}
          <div className="dash-panel dash-feed">
            <div className="dash-panel-head">
              <span className="dash-panel-title">Incidentes ativos</span>
              <span className="dash-panel-sub">{activeCount} requerem atenção</span>
            </div>
            <div className="dash-feed-list">
              {incidents.map((it) => <IncidentRow key={it.id} it={it} fresh={it.id === freshId} />)}
            </div>
          </div>

          {/* right column */}
          <div className="dash-col">
            <div className="dash-panel dash-chart">
              <div className="dash-panel-head">
                <span className="dash-panel-title">Volume de incidentes</span>
                <span className="dash-panel-sub">últimas 16h</span>
              </div>
              <AreaChart />
            </div>

            <div className="dash-panel dash-health">
              <div className="dash-panel-head">
                <span className="dash-panel-title">Saúde dos serviços</span>
                <span className="dash-oncall">
                  <span className="dash-avatar">MA</span> de plantão · M. Alves
                </span>
              </div>
              <div className="dash-health-grid">
                {SERVICES.map((s) => (
                  <div key={s.n} className={"dash-svc st-" + s.st} title={s.n}>
                    <span className="dash-svc-led"></span>
                    <span className="dash-svc-name">{s.n}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.LynusDashboard = LynusDashboard;
