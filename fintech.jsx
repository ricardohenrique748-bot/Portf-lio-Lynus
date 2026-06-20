/* ============================================================
   LYNUS TECH — Fintech (Cartões & Antifraude)
   ============================================================ */
const { useState } = React;

const APROVADAS = [62, 70, 58, 78, 66, 82, 74, 88, 80];
const RECUSADAS = [14, 18, 11, 20, 13, 22, 16, 19, 15];
const FRAUDES = [
  { acao: 'Cartão congelado por suspeita', categoria: 'Limites excedidos', casos: 6, revisoes: 22, cor: '#5b4ee8' },
  { acao: 'Transação revertida', categoria: 'Disputa do cliente', casos: 3, revisoes: 14, cor: '#1fae6c' },
  { acao: 'Cartão cancelado', categoria: 'Fraude confirmada', casos: 1, revisoes: 8, cor: '#ef4d5e' },
];

function mkLinePath(data, w, h, pad = 6) {
  const lo = Math.min(...data), hi = Math.max(...data), rng = hi - lo || 1;
  const pts = data.map((v, i) => [pad + (i / (data.length - 1)) * (w - pad * 2), h - pad - ((v - lo) / rng) * (h - pad * 2)]);
  return pts.map(p => p.join(',')).join(' ');
}

const FILTROS = ['Últimos 30 dias', 'Todos os cartões', 'Todas as regiões'];

const IcoExport = (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M4 19h16"/></svg>);
const IcoBack = (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M11 18l-6-6 6-6"/></svg>);
const IcoAlert = (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.3 3.86 1.8 18a1.6 1.6 0 0 0 1.37 2.4h17.66A1.6 1.6 0 0 0 22.2 18L13.7 3.86a1.6 1.6 0 0 0-2.74 0z"/></svg>);
const IcoCopy = (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>);
const IcoArrowR = (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>);

function Donut({ segs, size = 70, stroke = 9 }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  let acc = 0;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      {segs.map((s, i) => {
        const dash = c * s.pct / 100;
        const el = <circle key={i} cx={size/2} cy={size/2} r={r} fill="none" stroke={s.color}
          strokeWidth={stroke} strokeDasharray={`${dash} ${c-dash}`} strokeDashoffset={-acc} strokeLinecap="round" />;
        acc += dash;
        return el;
      })}
    </svg>
  );
}

function App() {
  const w = 480, h = 160;
  const pathAprov = mkLinePath(APROVADAS, w, h);
  const pathRecus = mkLinePath(RECUSADAS, w, h);

  return (
    <div className="ft-layout">
      <div className="ft-main">
        <div className="ft-topbar">
          <div className="ft-topbar-left">
            <h1>Painel de Cartões &amp; Antifraude</h1>
            <span className="ft-report-sub">Relatório · atualizado às 10:18 · Ano fiscal 2026</span>
          </div>
          <div className="ft-topbar-right">
            <a className="ft-btn-ghost" href="index.html" style={{textDecoration:'none'}}>{IcoBack} Voltar ao site</a>
            <button className="ft-btn-ghost">{IcoExport} Exportar</button>
          </div>
        </div>

        <div className="ft-filters">
          {FILTROS.map(f => <span key={f} className="ft-chip">{f}</span>)}
        </div>

        <div className="ft-kpi-row">
          <div className="ft-kpi-card highlight">
            <div className="ft-kpi-top">
              <span className="ft-kpi-tag teal">Cartões ativos</span>
              <span className="ft-kpi-status">Em uso</span>
            </div>
            <div className="ft-kpi-value">1.284</div>
            <div className="ft-kpi-delta up">▲ +42 este mês</div>
          </div>
          <div className="ft-kpi-card">
            <div className="ft-kpi-top">
              <span className="ft-kpi-tag muted">Transações bloqueadas</span>
              <span className="ft-kpi-status">Últimos 7 dias</span>
            </div>
            <div className="ft-kpi-value">186</div>
            <div className="ft-kpi-delta">R$ 48.200 protegidos</div>
          </div>
          <div className="ft-kpi-card">
            <div className="ft-kpi-top">
              <span className="ft-kpi-tag crit">Taxa de aprovação</span>
              <span className="ft-kpi-status">Mês atual</span>
            </div>
            <div className="ft-kpi-value">94,2%</div>
            <div className="ft-kpi-delta up">▲ +1,3 p.p.</div>
          </div>
        </div>

        <div className="ft-body-grid">
          <div className="ft-left-col">

            <div className="ft-mid-grid">
              <div className="ft-cardbox">
                <div className="ft-card-mock">
                  <div className="ft-chip" />
                  <div className="ft-card-number">•••• •••• •••• 4821</div>
                  <div className="ft-card-foot">
                    <span className="ft-card-status">Cartão corporativo</span>
                    <span className="ft-card-status">04/29</span>
                  </div>
                </div>
                <div className="ft-card-actions">
                  <span className="ft-card-status">Status: ativo</span>
                  <button className="ft-freeze-btn">Congelar cartão</button>
                </div>
              </div>

              <div className="ft-chart-box">
                <div className="ft-chart-legend">
                  <span className="domain">Aprovadas</span>
                  <span className="domains">Recusadas</span>
                </div>
                <svg className="ft-line-svg" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
                  <polyline points={pathAprov} fill="none" stroke="#5b4ee8" strokeWidth="2.5" />
                  <polyline points={pathRecus} fill="none" stroke="#f5a623" strokeWidth="2.5" opacity="0.8" />
                </svg>
                <div className="ft-chart-foot">Transações por dia · últimos 9 dias</div>
              </div>
            </div>

            <div className="ft-table-card">
              <div className="ft-table-head">
                <span className="ft-table-title">Ações antifraude</span>
                <div className="ft-pill-toggle">
                  <span>Em análise</span>
                  <span className="active">Resolvidas</span>
                </div>
              </div>
              <table className="ft-table">
                <thead>
                  <tr><th>Ação</th><th>Categoria</th><th>Casos</th><th>Revisões</th></tr>
                </thead>
                <tbody>
                  {FRAUDES.map((f, i) => (
                    <tr key={i}>
                      <td><span className="ft-row-dot"><span className="ft-dot" style={{background:f.cor}}/>{f.acao}</span></td>
                      <td>{f.categoria}</td>
                      <td>{f.casos}</td>
                      <td>{f.revisoes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

          <div className="ft-right">
            <div className="ft-rewards-card">
              <div className="ft-rewards-top">
                <span className="ft-table-title" style={{fontSize:13}}>Pontuação de risco</span>
                <div className="ft-rewards-icon">{IcoAlert}</div>
              </div>
              <div className="ft-rewards-pts">18% de risco</div>
              <div className="ft-rewards-label">Carteira de cartões ativa</div>
              <div className="ft-budget-row">
                <Donut segs={[{pct:18,color:'#ef4d5e'},{pct:27,color:'#f5a623'},{pct:55,color:'#1fae6c'}]} size={64} stroke={9} />
                <div>
                  <div className="ft-budget-label" style={{fontWeight:800,fontSize:18}}>Baixo</div>
                  <div className="ft-budget-sub">Nível geral de risco</div>
                </div>
              </div>
              <span className="ft-reveal-link">Ver análise completa {IcoArrowR}</span>
            </div>

            <div className="ft-audit-card">
              <div className="ft-audit-title">Linha de auditoria</div>
              <div className="ft-audit-sub">Última alteração registrada</div>
              <div className="ft-audit-person">
                <span className="ft-audit-name">Operações &amp; Financeiro</span>
                <span className="ft-audit-time">12:41</span>
              </div>
              <div className="ft-audit-actions">
                <button className="ft-audit-copy">{IcoCopy} Copiar</button>
                <button className="ft-audit-export">Exportar {IcoArrowR}</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
