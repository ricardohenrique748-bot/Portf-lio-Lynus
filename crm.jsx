/* ============================================================
   LYNUS TECH — CRM
   ============================================================ */
const { useState, useEffect } = React;

// ---- Data ----
const MESES = ['Jan','Fev','Mar','Abr','Mai','Jun'];
const RECEITA_FUNIL_MES = [86, 104, 92, 128, 118, 146];

const ESTAGIOS = ['Novo','Qualificado','Proposta','Negociação','Fechado'];

const LEADS = [
  { id:1, nome:'João Batista',   empresa:'Nuvora Corp',  estagio:'Negociação', valor:48000, resp:'Elaine Santos', ultimo:'12/06' },
  { id:2, nome:'Marina Costa',   empresa:'Cortex Ltda',  estagio:'Proposta',    valor:24000, resp:'Diego Ferreira',ultimo:'11/06' },
  { id:3, nome:'Renato Oliveira',empresa:'Vantix S.A.',  estagio:'Qualificado', valor:15600, resp:'Elaine Santos', ultimo:'10/06' },
  { id:4, nome:'Patrícia Nunes', empresa:'Orbita Tech',  estagio:'Novo',        valor:9200,  resp:'Diego Ferreira',ultimo:'09/06' },
  { id:5, nome:'Sérgio Almeida', empresa:'Paxil S.A.',   estagio:'Fechado',     valor:32000, resp:'Elaine Santos', ultimo:'08/06' },
  { id:6, nome:'Camila Torres',  empresa:'Helio Ltda',   estagio:'Negociação', valor:41000, resp:'Diego Ferreira',ultimo:'07/06' },
  { id:7, nome:'Bruno Lacerda',  empresa:'TechSupply',   estagio:'Qualificado', valor:12800, resp:'Elaine Santos', ultimo:'06/06' },
  { id:8, nome:'Fernanda Reis',  empresa:'CloudNet S.A.',estagio:'Proposta',    valor:27500, resp:'Diego Ferreira',ultimo:'05/06' },
];

const ATIVIDADES = [
  { tipo:'Ligação',  desc:'Follow-up de proposta comercial', nome:'João Batista',   quando:'Hoje, 14:20' },
  { tipo:'E-mail',   desc:'Envio de contrato para assinatura', nome:'Sérgio Almeida',quando:'Hoje, 11:05' },
  { tipo:'Reunião',  desc:'Apresentação de produto',           nome:'Marina Costa',  quando:'Ontem, 16:30' },
  { tipo:'Ligação',  desc:'Qualificação inicial',               nome:'Bruno Lacerda', quando:'Ontem, 09:15' },
];

const soma = a => a.reduce((s,v)=>s+v,0);
const fmtBRL = v => `R$ ${v.toLocaleString('pt-BR')}`;
const fmtK   = v => v>=1000 ? `R$ ${(v/1000).toFixed(0)}K` : `R$ ${v}`;

// ---- SVG helpers ----
function mkPts(data,W,H,pad=10){
  const lo=Math.min(...data)*0.9, hi=Math.max(...data)*1.04, rng=hi-lo;
  return data.map((v,i)=>[+(pad+(i/(data.length-1))*(W-pad*2)).toFixed(1), +(H-pad-((v-lo)/rng)*(H-pad*2)).toFixed(1)]);
}
const pStr = pts => pts.map(p=>p.join(',')).join(' ');
const aStr = (pts,H) => `${pStr(pts)} ${pts[pts.length-1][0]},${H} ${pts[0][0]},${H}`;
function smoothPath(pts){
  if(!pts||pts.length<2) return '';
  const d=[`M ${pts[0][0]},${pts[0][1]}`];
  for(let i=0;i<pts.length-1;i++){
    const p0=pts[Math.max(0,i-1)],p1=pts[i],p2=pts[i+1],p3=pts[Math.min(pts.length-1,i+2)];
    const cp1x=(p1[0]+(p2[0]-p0[0])/6).toFixed(1),cp1y=(p1[1]+(p2[1]-p0[1])/6).toFixed(1);
    const cp2x=(p2[0]-(p3[0]-p1[0])/6).toFixed(1),cp2y=(p2[1]-(p3[1]-p1[1])/6).toFixed(1);
    d.push(`C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2[0]},${p2[1]}`);
  }
  return d.join(' ');
}

function Spark({data,color='#3D5AFE',w=64,h=32}){
  const pts=mkPts(data,w,h,2), uid=`sp${Math.random().toString(36).slice(2,6)}`;
  return(
    <svg viewBox={`0 0 ${w} ${h}`} style={{width:w,height:h,flexShrink:0,display:'block'}}>
      <defs><linearGradient id={uid} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity=".25"/><stop offset="100%" stopColor={color} stopOpacity="0"/></linearGradient></defs>
      <polygon points={aStr(pts,h)} fill={`url(#${uid})`}/>
      <polyline points={pStr(pts)} fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/>
    </svg>
  );
}

function Num({n,prefix='',suffix=''}){
  const [v,setV]=useState(0);
  useEffect(()=>{ let s=null; const step=ts=>{ if(!s)s=ts; const p=Math.min((ts-s)/900,1),e=1-Math.pow(1-p,3); setV(Math.round(n*e)); if(p<1)requestAnimationFrame(step); }; const id=setTimeout(()=>requestAnimationFrame(step),200); return()=>clearTimeout(id); },[n]);
  return <>{prefix}{v.toLocaleString('pt-BR')}{suffix}</>;
}

function ReceitaChart(){
  const W=520, H=140;
  const pts=mkPts(RECEITA_FUNIL_MES,W,H);
  return(
    <svg viewBox={`-2 0 ${W+4} ${H+22}`} style={{width:'100%',height:'auto',display:'block'}}>
      <defs>
        <linearGradient id="crg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3D5AFE" stopOpacity=".2"/><stop offset="100%" stopColor="#3D5AFE" stopOpacity="0"/></linearGradient>
        <clipPath id="crcr"><rect x="0" y="0" width={W} height={H+2}><animate attributeName="width" from="0" to={W} dur="1.4s" fill="freeze"/></rect></clipPath>
      </defs>
      {[0.25,0.5,0.75].map(f=><line key={f} x1="0" y1={H*f} x2={W} y2={H*f} stroke="rgba(20,28,60,0.06)" strokeWidth="1"/>)}
      {MESES.map((m,i)=><text key={m} x={10+(i/(MESES.length-1))*(W-20)} y={H+16} textAnchor="middle" fontSize="9.5" fill="#9FA5C4" fontFamily="var(--mono)">{m}</text>)}
      <g clipPath="url(#crcr)">
        <polygon points={aStr(pts,H)} fill="url(#crg)"/>
        <path d={smoothPath(pts)} fill="none" stroke="#3D5AFE" strokeWidth="2.2" strokeLinejoin="round"/>
      </g>
    </svg>
  );
}

// ---- Icons ----
const IcoDash = ()=><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1" y="1" width="6.5" height="6.5" rx="1.5" fill="currentColor"/><rect x="10.5" y="1" width="6.5" height="6.5" rx="1.5" fill="currentColor"/><rect x="1" y="10.5" width="6.5" height="6.5" rx="1.5" fill="currentColor"/><rect x="10.5" y="10.5" width="6.5" height="6.5" rx="1.5" fill="currentColor"/></svg>;
const IcoUsers= ()=><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="7" cy="6" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M2 16c0-3.3 2.2-5.5 5-5.5S12 12.7 12 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="13.5" cy="6.5" r="2.2" stroke="currentColor" strokeWidth="1.3" opacity=".7"/><path d="M11.5 16c0-2.3 1.4-4 3.5-4.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity=".7"/></svg>;
const IcoFunil= ()=><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 3h14l-5 6.5v5L7 16v-6.5L2 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>;
const IcoGear = ()=><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="2.8" stroke="currentColor" strokeWidth="1.5"/><path d="M9 1.5v2M9 14.5v2M1.5 9h2M14.5 9h2M4.1 4.1l1.4 1.4M12.5 12.5l1.4 1.4M4.1 13.9l1.4-1.4M12.5 5.5l1.4-1.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>;
const IcoBack = ()=><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M7 4L3 9l4 5M3 9h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;

// ================================================================
// VIEWS
// ================================================================
function PainelView(){
  const leadsAtivos = LEADS.filter(l=>l.estagio!=='Fechado').length;
  const fechados    = LEADS.filter(l=>l.estagio==='Fechado').length;
  const conversao    = ((fechados/LEADS.length)*100).toFixed(0);
  const receitaFunil = soma(LEADS.filter(l=>l.estagio!=='Fechado').map(l=>l.valor));
  const ticketMedio  = Math.round(soma(LEADS.map(l=>l.valor))/LEADS.length);

  return(
    <>
      <div className="cr-greeting">
        <div>
          <h2>Olá, Diego!</h2>
          <p>Acompanhe o funil de vendas e os últimos contatos</p>
        </div>
        <div style={{display:'flex',gap:'10px'}}>
          <button className="cr-icon-btn">🔔</button>
          <button className="cr-icon-btn">⚙️</button>
        </div>
      </div>

      <div className="cr-stat-row">
        <div className="cr-card">
          <div className="cr-card-inner">
            <div>
              <div className="cr-card-label">Leads ativos</div>
              <div className="cr-card-value"><Num n={leadsAtivos}/></div>
              <div className="cr-card-delta up">↑ 4 esta semana</div>
            </div>
            <Spark data={[6,8,7,10,9,leadsAtivos]} color="#3D5AFE"/>
          </div>
        </div>
        <div className="cr-card">
          <div className="cr-card-inner">
            <div>
              <div className="cr-card-label">Taxa de conversão</div>
              <div className="cr-card-value"><Num n={conversao} suffix="%"/></div>
              <div className="cr-card-delta up">↑ 2pp vs mês anterior</div>
            </div>
            <div style={{width:40,height:40,borderRadius:'50%',background:'var(--ok-soft)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'20px'}}>🎯</div>
          </div>
        </div>
        <div className="cr-card">
          <div className="cr-card-inner">
            <div>
              <div className="cr-card-label">Ticket médio</div>
              <div className="cr-card-value"><Num n={ticketMedio} prefix="R$ "/></div>
              <div className="cr-card-delta muted">Média dos negócios</div>
            </div>
            <div style={{width:40,height:40,borderRadius:'50%',background:'var(--warn-soft)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'20px'}}>💳</div>
          </div>
        </div>
        <div className="cr-card dark">
          <div className="cr-card-inner">
            <div>
              <div className="cr-card-label">Receita em negociação</div>
              <div className="cr-card-value"><Num n={receitaFunil} prefix="R$ "/></div>
              <div className="cr-card-delta muted">Soma do funil aberto</div>
            </div>
            <Spark data={RECEITA_FUNIL_MES.slice(-6)} color="rgba(255,255,255,0.75)"/>
          </div>
        </div>
      </div>

      <div className="cr-row2">
        <div className="chart-box">
          <div className="chart-head"><div><div className="chart-title">Receita do funil</div><div className="chart-sub">Últimos 6 meses · R$ mil</div></div></div>
          <ReceitaChart/>
        </div>
        <div className="chart-box">
          <div className="chart-title" style={{marginBottom:'14px'}}>Atividades recentes</div>
          {ATIVIDADES.map((a,i)=>(
            <div key={i} style={{display:'flex',gap:'10px',padding:'8px 0',borderBottom: i<ATIVIDADES.length-1?'1px solid var(--border)':'none'}}>
              <span style={{fontSize:'16px'}}>{a.tipo==='Ligação'?'📞':a.tipo==='E-mail'?'✉️':'🤝'}</span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:'12.5px',fontWeight:600,color:'var(--text)'}}>{a.desc}</div>
                <div style={{fontSize:'11.5px',color:'var(--text-3)'}}>{a.nome} · {a.quando}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="table-box">
        <div className="table-head"><div className="table-title">Últimos contatos</div></div>
        <table className="data-table">
          <thead><tr><th>Lead</th><th>Empresa</th><th>Estágio</th><th>Valor</th><th>Responsável</th><th>Último contato</th></tr></thead>
          <tbody>
            {LEADS.slice(0,5).map(l=>(
              <tr key={l.id}>
                <td className="td-main">{l.nome}</td>
                <td className="td-muted">{l.empresa}</td>
                <td><span className="badge badge-accent">{l.estagio}</span></td>
                <td className="td-mono">{fmtBRL(l.valor)}</td>
                <td className="td-muted">{l.resp}</td>
                <td className="td-mono td-muted">{l.ultimo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function ClientesView(){
  const [busca,setBusca]=useState('');
  const filtrados = LEADS.filter(l => l.nome.toLowerCase().includes(busca.toLowerCase()) || l.empresa.toLowerCase().includes(busca.toLowerCase()));
  return(
    <div className="cr-view-wrap">
      <div style={{display:'flex',gap:'14px',marginBottom:'20px'}}>
        {[{l:'Total de leads',v:LEADS.length,c:'var(--accent)'},{l:'Receita em aberto',v:fmtK(soma(LEADS.filter(l=>l.estagio!=='Fechado').map(l=>l.valor))),c:'var(--ok)'},{l:'Fechados no mês',v:LEADS.filter(l=>l.estagio==='Fechado').length,c:'var(--warn)'}].map((m,i)=>(
          <div key={i} className="stat-card" style={{flex:1}}><div className="stat-label">{m.l}</div><div className="stat-value" style={{color:m.c,fontSize:'20px'}}>{m.v}</div></div>
        ))}
      </div>
      <div className="table-box">
        <div className="table-head">
          <div className="table-title">Clientes e Leads</div>
          <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Buscar por nome ou empresa..." style={{padding:'7px 12px',borderRadius:'8px',border:'1px solid var(--border)',background:'var(--surface-2)',fontFamily:'var(--font)',fontSize:'12.5px',outline:'none',width:'220px'}}/>
        </div>
        <table className="data-table">
          <thead><tr><th>Nome</th><th>Empresa</th><th>Estágio</th><th>Valor</th><th>Responsável</th><th>Último contato</th></tr></thead>
          <tbody>
            {filtrados.map(l=>(
              <tr key={l.id}>
                <td className="td-main">{l.nome}</td>
                <td className="td-muted">{l.empresa}</td>
                <td><span className={`badge ${l.estagio==='Fechado'?'badge-ok':'badge-accent'}`}>{l.estagio}</span></td>
                <td className="td-mono">{fmtBRL(l.valor)}</td>
                <td className="td-muted">{l.resp}</td>
                <td className="td-mono td-muted">{l.ultimo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FunilView(){
  return(
    <div className="cr-view-wrap">
      <div style={{display:'flex',gap:'14px',marginBottom:'20px'}}>
        {ESTAGIOS.map(e=>{
          const items=LEADS.filter(l=>l.estagio===e);
          return <div key={e} className="stat-card" style={{flex:1}}><div className="stat-label">{e}</div><div className="stat-value" style={{fontSize:'20px'}}>{items.length}</div><div className="stat-delta neutral">{fmtK(soma(items.map(l=>l.valor)))}</div></div>;
        })}
      </div>
      <div className="cr-funil">
        {ESTAGIOS.map(e=>{
          const items=LEADS.filter(l=>l.estagio===e);
          return(
            <div key={e} className="cr-funil-col">
              <div className="cr-funil-head"><span className="cr-funil-title">{e}</span><span className="cr-funil-count">{items.length}</span></div>
              {items.map(l=>(
                <div key={l.id} className="cr-funil-card">
                  <div className="cr-funil-card-name">{l.nome}</div>
                  <div style={{fontSize:'11px',color:'var(--text-3)',marginTop:'2px'}}>{l.empresa}</div>
                  <div className="cr-funil-card-val">{fmtBRL(l.valor)}</div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ConfigView(){
  const [saved,setSaved]=useState(false);
  const [form,setForm]=useState({empresa:'Lynus Tech Ltda',pipeline:'Padrão B2B',moeda:'BRL',email:'vendas@lynus.tech',notif:true});
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  return(
    <div className="cr-view-wrap" style={{maxWidth:'520px'}}>
      <div style={{marginBottom:'20px'}}><h3 style={{fontSize:'15px',fontWeight:700,color:'var(--text)'}}>Configurações do CRM</h3></div>
      {saved && <div className="auth-msg-ok" style={{marginBottom:'14px',padding:'12px 16px',borderRadius:'10px'}}>✓ Configurações salvas com sucesso.</div>}
      <div className="chart-box" style={{display:'flex',flexDirection:'column',gap:'16px'}}>
        {[{l:'Razão Social',k:'empresa'},{l:'Pipeline padrão',k:'pipeline'},{l:'Moeda',k:'moeda'},{l:'E-mail de notificações',k:'email'}].map(f=>(
          <div key={f.k}>
            <label style={{fontSize:'12.5px',fontWeight:500,color:'var(--text-2)',display:'block',marginBottom:'5px'}}>{f.l}</label>
            <input type="text" value={form[f.k]} onChange={e=>set(f.k,e.target.value)} style={{width:'100%',padding:'10px 13px',background:'var(--surface-2)',border:'1px solid var(--border-strong)',borderRadius:'9px',color:'var(--text)',fontFamily:'var(--font)',fontSize:'13.5px',outline:'none'}}/>
          </div>
        ))}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div><div style={{fontSize:'13px',fontWeight:500,color:'var(--text)'}}>Notificar mudanças de estágio</div><div style={{fontSize:'12px',color:'var(--text-2)'}}>Receber alertas quando um lead avançar no funil</div></div>
          <button onClick={()=>set('notif',!form.notif)} style={{width:'44px',height:'24px',borderRadius:'12px',background:form.notif?'var(--ok)':'rgba(20,28,60,0.15)',border:'none',cursor:'pointer',position:'relative',transition:'background 0.2s',flexShrink:0}}>
            <span style={{width:'18px',height:'18px',borderRadius:'50%',background:'#fff',position:'absolute',top:'3px',left:form.notif?'23px':'3px',transition:'left 0.2s',display:'block'}}/>
          </button>
        </div>
        <button className="btn btn-primary" style={{width:'100%',padding:'12px'}} onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),3000);}}>Salvar Configurações</button>
      </div>
    </div>
  );
}

// ================================================================
// NAVIGATION
// ================================================================
const NAV_ITEMS = [
  { id:'painel',    title:'Painel',    Icon:IcoDash  },
  { id:'clientes',  title:'Clientes',  Icon:IcoUsers },
  { id:'funil',     title:'Funil',     Icon:IcoFunil },
  { id:'config',    title:'Configurações', Icon:IcoGear },
];
const VIEW_TITLE = { painel:'Painel', clientes:'Clientes', funil:'Funil de Vendas', config:'Configurações' };

function App(){
  const [view,setView]=useState('painel');
  const views = { painel:<PainelView/>, clientes:<ClientesView/>, funil:<FunilView/>, config:<ConfigView/> };
  return(
    <div className="cr-layout">
      <aside className="cr-sidebar">
        <div className="cr-logo">
          <div className="cr-logo-mark">🤝</div>
          <div>
            <div className="cr-logo-text">LYNUS</div>
            <div className="cr-logo-sub">CRM</div>
          </div>
        </div>
        <nav className="cr-sidebar-nav">
          {NAV_ITEMS.map(it=>(
            <button key={it.id} className={`cr-nav-btn${view===it.id?' active':''}`} onClick={()=>setView(it.id)}>
              <it.Icon/><span>{it.title}</span>
            </button>
          ))}
        </nav>
        <div className="cr-sidebar-bottom">
          <div className="cr-sidebar-sep"/>
          <button className="cr-nav-btn" onClick={()=>window.location.href='index.html'}>
            <IcoBack/><span>Voltar ao site</span>
          </button>
          <div className="cr-sidebar-user">
            <div className="cr-avatar-sm">DF</div>
            <div className="cr-sidebar-user-name">Diego</div>
          </div>
        </div>
      </aside>
      <div className="cr-main">
        {view !== 'painel' && (
          <div className="cr-topbar">
            <div>
              <div className="cr-topbar-title">{VIEW_TITLE[view]}</div>
              <div className="cr-topbar-sub">CRM · Jun 2026</div>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
              <button className="cr-icon-btn">🔔</button>
              <div className="cr-avatar-sm" style={{width:36,height:36,fontSize:13}}>DF</div>
            </div>
          </div>
        )}
        {view === 'painel' ? <div className="cr-content">{views[view]}</div> : views[view]}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
