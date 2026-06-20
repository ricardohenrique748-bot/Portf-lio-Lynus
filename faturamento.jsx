/* ============================================================
   LYNUS TECH — Faturamento & Cobranças
   ============================================================ */
const { useState } = React;

const MESES = ['Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set'];
const BARRAS = [58, 92, 48, 100, 86, 64, 38, 34];
const FILTROS = ['7 dias', '30 dias', 'Trimestre', 'Ano fiscal'];

const HISTORICO = [
  { nome: 'Camila Souza', tipo: 'Empréstimo', hora: '12:42', valor: 1200, parcelas: '3/12', saldo: 'R$ 8.400', status: 'Concluído' },
  { nome: 'Diego Martins', tipo: 'Fatura', hora: '11:05', valor: 3400, parcelas: '1/1', saldo: 'R$ 0', status: 'Concluído' },
  { nome: 'Nuvora Corp', tipo: 'Contrato', hora: '09:30', valor: 9800, parcelas: '2/6', saldo: 'R$ 29.400', status: 'Concluído' },
  { nome: 'Helio Ltda', tipo: 'Cobrança', hora: '08:12', valor: 540, parcelas: '1/1', saldo: 'R$ 0', status: 'Concluído' },
];

const fmt = v => `R$ ${v.toLocaleString('pt-BR')}`;
const initials = n => n.split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase();
const total = HISTORICO.reduce((s,h)=>s+h.valor,0);

function Ring({ pct, size = 30, stroke = 3, color = '#6c5ce0', track = '#ece9ff' }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={`${c*pct/100} ${c}`} strokeLinecap="round" />
    </svg>
  );
}

const BILLS = [
  { icon: '📅', label: 'Pronto para atribuir', value: 200, delta: '42', sub: 'BOLETOS · SEM 221', pct: 64 },
  { icon: '🖋️', label: 'Aguardando assinatura', value: 63, delta: '17', sub: 'ASSINADO · SEM 221', pct: 38 },
  { icon: '📆', label: 'Recusados', value: 5, delta: '5', sub: 'RECUSADO · SEM 2', pct: 18, down: true },
  { icon: '📋', label: 'Solicitação de informação', value: 13, delta: '17', sub: 'SOLICITADO · SEM 2', pct: 52 },
];

function NavIcon({ children, active, title }) {
  return <button className={'fat-nav-icon' + (active ? ' active' : '')} title={title}>{children}</button>;
}

const IcoHome = (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 11.5 12 4l9 7.5" />
    <path d="M5.5 10v9a1 1 0 0 0 1 1H9a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h2.5a1 1 0 0 0 1-1v-9" />
  </svg>
);

const IcoRelatorios = (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19V10" /><path d="M10 19V5" /><path d="M16 19v-7" /><path d="M22 19H2" />
  </svg>
);

const IcoDespesas = (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2.5" y="6" width="19" height="13" rx="2.2" />
    <path d="M2.5 10h19" />
    <circle cx="17" cy="14.5" r="1.4" fill="currentColor" stroke="none" />
  </svg>
);

const IcoAnual = (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3.5" y="5" width="17" height="16" rx="2.2" />
    <path d="M3.5 9.5h17" /><path d="M8 3v4" /><path d="M16 3v4" />
  </svg>
);

function App() {
  const [hover, setHover] = useState(3);
  const [menuOpen, setMenuOpen] = useState(false);
  const [filtro, setFiltro] = useState('30 dias');
  const maxBar = Math.max(...BARRAS);

  return (
    <div className="fat-layout">
      <div className="fat-sidebar-wrap">
        <div className="fat-sidebar-blob" />
        <aside className="fat-sidebar fat-sidebar-centered">
          <NavIcon active title="Home">{IcoHome}</NavIcon>
          <NavIcon title="Relatórios">{IcoRelatorios}</NavIcon>
          <NavIcon title="Despesas">{IcoDespesas}</NavIcon>
          <NavIcon title="Anual">{IcoAnual}</NavIcon>
          <div className="fat-nav-bottom">
            <a className="fat-back" href="index.html" title="Voltar ao site">←</a>
          </div>
        </aside>
      </div>

      <div className="fat-main">
        <div className="fat-filters">
          {FILTROS.map(f => (
            <span key={f} className={'fat-chip' + (filtro===f?' active':'')} onClick={()=>setFiltro(f)}>{f}</span>
          ))}
          <span className="fat-filters-sep" />
          <span className="fat-chip">Exercício 2026</span>
          <span className="fat-chip">Moeda: BRL</span>
        </div>

        <div className="fat-content">

          <div>
            <div className="fat-section-head">
              <span className="fat-section-title">Boletos</span>
              <span className="fat-section-chev">⌄</span>
            </div>
            <div className="fat-bills-row" style={{marginTop:14}}>
              {BILLS.map((b, i) => (
                <div key={i} className="fat-bill-card">
                  <div className="fat-bill-top">
                    <div className="fat-bill-icon">{b.icon}</div>
                    <div className="fat-bill-ring">
                      <Ring pct={b.pct} size={36} stroke={4} color={b.down ? '#ef4d5e' : '#6c5ce0'} />
                      <div className="fat-bill-ring-label" style={{color: b.down ? '#ef4d5e' : '#6c5ce0'}}>
                        {b.down ? '-' : '+'}{b.delta}%
                      </div>
                    </div>
                  </div>
                  <div className="fat-bill-label">{b.label}</div>
                  <div className="fat-bill-value">{b.value} <small>– {b.delta}</small></div>
                  <div className="fat-bill-sub">{b.sub}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="fat-section-head">
              <span className="fat-section-title">Faturas</span>
              <span className="fat-section-chev">⌄</span>
            </div>
            <div className="fat-invoices-grid" style={{marginTop:14}}>

              <div className="fat-owed-card">
                <div className="fat-owed-notch" />
                <div className="fat-owed-menu">⋮</div>
                <div className="fat-gauge">
                  <Ring pct={45} size={116} stroke={9} color="#fff" track="rgba(255,255,255,0.25)" />
                  <div className="fat-gauge-label">
                    <span className="fat-gauge-pct">45%</span>
                  </div>
                </div>
                <div className="fat-owed-label">Valor devido</div>
                <div className="fat-owed-value">R$ 933.879</div>
                <div className="fat-owed-sub">R$ 126.783 em aberto</div>
              </div>

              <div className="fat-stack">
                <div className="fat-mini-card">
                  <div className="fat-mini-top">
                    <div className="fat-mini-icon">💳</div>
                    <div className="fat-mini-ring">
                      <Ring pct={64} size={32} stroke={4} />
                      <div className="fat-mini-ring-label">64%</div>
                    </div>
                  </div>
                  <div className="fat-mini-label">Faturas pagas</div>
                  <div className="fat-mini-value">R$ 9.034</div>
                  <div className="fat-mini-sub">ANO FISCAL ATUAL</div>
                </div>
                <div className="fat-mini-card">
                  <div className="fat-mini-top">
                    <div className="fat-mini-icon">📍</div>
                    <div className="fat-mini-ring">
                      <Ring pct={85} size={32} stroke={4} />
                      <div className="fat-mini-ring-label">85%</div>
                    </div>
                  </div>
                  <div className="fat-mini-label">Trabalhos em andamento</div>
                  <div className="fat-mini-value">R$ 23.782</div>
                  <div className="fat-mini-sub">ANO FISCAL ATUAL</div>
                </div>
              </div>

              <div className="fat-chart-card">
                <div className="fat-chart-head">
                  <span className="fat-section-title">Faturamento mensal</span>
                  <span className="fat-chart-menu" onClick={()=>setMenuOpen(o=>!o)}>
                    ⋮
                    {menuOpen && (
                      <div className="fat-chart-dropdown">
                        <button onClick={()=>setMenuOpen(false)}>Extrato anual</button>
                        <button onClick={()=>setMenuOpen(false)}>Ver histórico</button>
                      </div>
                    )}
                  </span>
                </div>
                <div className="fat-chart-legend">
                  <span className="fat-legend-item"><span className="fat-legend-dot" style={{background:'#6c5ce0'}}/>Faturado</span>
                  <span className="fat-legend-item"><span className="fat-legend-dot" style={{background:'#ddd7ff'}}/>Projetado</span>
                </div>
                <div className="fat-bars">
                  {BARRAS.map((h, i) => (
                    <div key={i} className="fat-bar-col"
                      onMouseEnter={()=>setHover(i)} onMouseLeave={()=>setHover(3)}>
                      {hover === i && (
                        <div className="fat-bar-tooltip" style={{left:'50%'}}>{MESES[i]} 2026 · R$ {(h*1.2).toFixed(0)}K</div>
                      )}
                      <div className={'fat-bar' + (hover===i?' active':'')} style={{height:`${h/maxBar*100}%`}} />
                      <span className="fat-bar-month">{MESES[i]}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          <div>
            <div className="fat-section-head">
              <span className="fat-section-title">Histórico</span>
              <span className="fat-section-chev">⌄</span>
            </div>
            <div className="fat-table-card" style={{marginTop:14}}>
              <table className="fat-table">
                <thead>
                  <tr>
                    <th>Cliente</th><th>Tipo</th><th>Horário</th><th>Valor</th>
                    <th>Parcelas</th><th>Saldo</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {HISTORICO.map((h, i) => (
                    <tr key={i}>
                      <td>
                        <div className="fat-row-person">
                          <div className="fat-row-avatar">{initials(h.nome)}</div>
                          {h.nome}
                        </div>
                      </td>
                      <td>{h.tipo}</td>
                      <td className="fat-td-mono">{h.hora}</td>
                      <td className="fat-td-mono">{fmt(h.valor)}</td>
                      <td className="fat-td-mono">{h.parcelas}</td>
                      <td className="fat-td-mono">{h.saldo}</td>
                      <td><span className="fat-pill">{h.status}</span></td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3}>Total no período</td>
                    <td colSpan={4}>{fmt(total)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
