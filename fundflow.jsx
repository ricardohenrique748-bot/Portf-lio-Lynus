/* ============================================================
   LYNUS TECH — FundFlow (Finanças pessoais)
   ============================================================ */
const { useState } = React;

const DESPESAS = [
  { m: 'Mai', v: 38 }, { m: 'Jun', v: 52 }, { m: 'Jul', v: 96, active: true, tag: 'R$ 45 mil' },
  { m: 'Ago', v: 60 }, { m: 'Set', v: 44 },
];
const SAUDE = [18, 30, 22, 40, 28, 46, 34, 52, 40];

const TRANSACOES = [
  { nome: 'YouTube', data: '15 jun', status: 'pending', valor: -50 },
  { nome: 'João Silva', data: '14 jun', status: 'done', valor: -100 },
  { nome: 'Sans Brothers', data: '13 jun', status: 'done', valor: 120 },
  { nome: 'João Silva', data: '8 jun', status: 'done', valor: -100 },
  { nome: 'Cinema City', data: '6 jun', status: 'done', valor: -75 },
  { nome: 'Conversão USD', data: '1 jun', status: 'done', valor: -250 },
];

const PAGAMENTOS = [
  { nome: 'Assinatura Stripe', data: 'Hoje', tag: 'Links de pagamento', valor: 1200, icon: '◐' },
  { nome: 'Mensalidade Figlam', data: '23 jun', tag: 'Profissional', valor: 155, icon: '▤' },
  { nome: 'Assinatura Loom', data: '15 jul', tag: 'Loom Business', valor: 100, icon: '◑' },
];

const CONTATOS = [
  { i: 'FA', cor: '#6c5ce0' },
  { i: 'CL', cor: '#f5a623' },
  { i: 'MN', cor: '#1fae6c' },
];

function fmt(v) { const s = Math.abs(v); return `${v < 0 ? '-' : '+'}R$ ${s}`; }

function mkPath(data, w, h, pad = 4) {
  const lo = Math.min(...data), hi = Math.max(...data), rng = hi - lo || 1;
  return data.map((v, i) => [pad + (i/(data.length-1))*(w-pad*2), h-pad-((v-lo)/rng)*(h-pad*2)]).map(p=>p.join(',')).join(' ');
}

const IcoPeople = (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><path d="M16.5 14c2.8.3 4.5 2 4.5 6"/><circle cx="16" cy="7" r="2.7"/></svg>);
const IcoPie = (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v10l8.5 5"/><circle cx="12" cy="12" r="10"/></svg>);
const IcoBag = (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>);
const IcoCode = (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l-5-6 5-6"/><path d="M15 6l5 6-5 6"/></svg>);
const IcoSettings = (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 13a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V19a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 9 17.36a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.64 13a1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.64 7a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 2.64a1.7 1.7 0 0 0 1-1.55V1a2 2 0 1 1 4 0v.09A1.7 1.7 0 0 0 15 2.64a1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.36 7a1.7 1.7 0 0 0 1.55 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.55 1z"/></svg>);
const IcoBack = (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M11 18l-6-6 6-6"/></svg>);
const IcoArrowR = (<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>);

function App() {
  const [moeda, setMoeda] = useState('BRL');
  const [valor, setValor] = useState('100,00');
  const w = 320, h = 60;

  return (
    <div className="fl-layout">
      <aside className="fl-sidebar">
        <div className="fl-brand-mark">F</div>
        <button className="fl-nav-icon" title="Contatos">{IcoPeople}</button>
        <button className="fl-nav-icon active" title="Visão geral">{IcoPie}</button>
        <button className="fl-nav-icon" title="Carteira">{IcoBag}</button>
        <button className="fl-nav-icon" title="Integrações">{IcoCode}</button>
        <div className="fl-nav-bottom">
          <button className="fl-nav-icon" title="Configurações">{IcoSettings}</button>
          <a className="fl-nav-icon" href="index.html" title="Voltar ao site">{IcoBack}</a>
        </div>
      </aside>

      <div className="fl-main">
        <div className="fl-topbar">
          <div className="fl-brand">
            <div className="fl-brand-icon">F</div>
            <div>
              <div className="fl-brand-name">FundFlow</div>
              <div className="fl-brand-sub">Comece a organizar suas finanças</div>
            </div>
          </div>
          <div className="fl-card-pill">•••• 4168 · 01/29</div>
        </div>

        <div className="fl-body">
          <div className="fl-left">

            <div className="fl-balance-card">
              <div className="fl-balance-head">
                <div>
                  <div className="fl-balance-label">Saldo total</div>
                  <div className="fl-balance-value">R$ 73.558,00</div>
                </div>
                <div className="fl-curr-toggle">
                  <span className={moeda==='EUR'?'active':''} onClick={()=>setMoeda('EUR')}>EUR</span>
                  <span className={moeda==='BRL'?'active':''} onClick={()=>setMoeda('BRL')}>BRL</span>
                </div>
              </div>

              <div className="fl-circles">
                <div className="fl-circle fl-circle-visa">
                  <span className="fl-circle-value">R$ 10.208</span>
                  <span className="fl-circle-label">Visa</span>
                </div>
                <div className="fl-circle fl-circle-main">
                  <span className="fl-circle-value">R$ 23.558</span>
                  <span className="fl-circle-label">Mastercard</span>
                </div>
                <div className="fl-circle fl-circle-savings">
                  <span className="fl-circle-value">R$ 39.792</span>
                  <span className="fl-circle-label">Poupança</span>
                </div>
              </div>

              <div className="fl-balance-actions">
                <button className="fl-btn-light">Receber</button>
                <button className="fl-btn-dark">Enviar</button>
              </div>
            </div>

            <div className="fl-stats-row">
              <div className="fl-stat-card">
                <div className="fl-stat-head">
                  <span className="fl-stat-title">Estatística de despesas</span>
                  <span className="fl-stat-period">Mensal</span>
                </div>
                <div className="fl-bars-mini">
                  {DESPESAS.map((d,i)=>(
                    <div key={i} className="col">
                      {d.tag && <span className="fl-bars-tip">{d.tag}</span>}
                      <div className={'bar'+(d.active?' active':'')} style={{height:`${d.v}%`}} />
                      <span className="m">{d.m.toUpperCase()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="fl-stat-card health">
                <div className="fl-stat-head">
                  <span className="fl-stat-title">Saúde financeira</span>
                  <span className="fl-stat-period">↗</span>
                </div>
                <div className="fl-health-value">85%</div>
                <div className="fl-health-sub">desde o mês passado</div>
                <svg className="fl-health-svg" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
                  <polyline points={mkPath(SAUDE,w,h)} fill="none" stroke="#fff" strokeWidth="2.5"/>
                </svg>
              </div>
            </div>

            <div className="fl-table-card">
              <div className="fl-table-head">
                <span className="fl-table-title">Próximos pagamentos</span>
                <button className="fl-btn-mini">Ver tudo</button>
              </div>
              {PAGAMENTOS.map((p,i)=>(
                <div key={i} className="fl-pay-row">
                  <div className="fl-pay-icon">{p.icon}</div>
                  <div>
                    <div className="fl-pay-name">{p.nome}</div>
                    <div className="fl-pay-date">{p.data}</div>
                  </div>
                  <span className="fl-pay-tag">{p.tag}</span>
                  <span className="fl-pay-value">R$ {p.valor}</span>
                </div>
              ))}
            </div>

          </div>

          <div className="fl-right">
            <div className="fl-tx-card">
              <div className="fl-tx-head">
                <span className="fl-table-title">Transações</span>
                <button className="fl-btn-mini">Ver tudo</button>
              </div>
              <div className="fl-tx-sub">Últimas transferências</div>
              {TRANSACOES.map((t,i)=>(
                <div key={i} className="fl-tx-row">
                  <div className="fl-tx-icon">↗</div>
                  <div>
                    <div className="fl-tx-name">{t.nome}</div>
                    <div className="fl-tx-date">{t.data}</div>
                  </div>
                  <span className={'fl-tx-status '+t.status}>{t.status==='pending'?'Pendente':'Concluído'}</span>
                  <span className="fl-tx-value">{fmt(t.valor)}</span>
                </div>
              ))}
            </div>

            <div className="fl-tip-card">
              <div className="fl-tip-title">Como reduzir despesas em 25%?</div>
              <div className="fl-tip-text">Veja essas dicas úteis para economizar dinheiro no seu dia a dia.</div>
              <span className="fl-tip-link">Saiba mais {IcoArrowR}</span>
            </div>

            <div className="fl-transfer-card">
              <div className="fl-transfer-head">
                <span className="fl-table-title">Transferência rápida</span>
                <span className="fl-transfer-link">Contatos</span>
              </div>
              <div className="fl-contacts">
                <div className="fl-contact-add">+</div>
                {CONTATOS.map((c,i)=>(
                  <div key={i} className="fl-contact-avatar" style={{background:c.cor}}>{c.i}</div>
                ))}
              </div>
              <div className="fl-amount-row">
                <input className="fl-amount-input" value={`R$ ${valor}`} onChange={e=>setValor(e.target.value.replace(/^R\$\s*/,''))} />
                <button className="fl-send-btn">Enviar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
