/* ============================================================
   LYNUS TECH — Sistema de RH
   ============================================================ */
const { useState, useEffect } = React;

// ---- Data ----
const MESES = ['Jan','Fev','Mar','Abr','Mai','Jun'];
const HEADCOUNT_MES = [118, 121, 124, 126, 129, 132];

const DEPTOS = [
  { label:'Operações',    v:46, color:'#7C4FE0' },
  { label:'Manutenção',   v:28, color:'#B08CF0' },
  { label:'Financeiro',   v:14, color:'#C9821A' },
  { label:'Comercial',    v:22, color:'#1E9E6B' },
  { label:'Administrativo',v:22,color:'#A79FBF' },
];

const CORES_AVATAR = ['#7C4FE0','#C9821A','#1E9E6B','#D93A5C','#4C6EF5','#B08CF0'];
const iniciais = nome => nome.split(' ').map(p=>p[0]).slice(0,2).join('').toUpperCase();

const COLABORADORES = [
  { id:1, nome:'Ana Souza',       cargo:'Analista Financeiro',  depto:'Financeiro',    admissao:'12/03/2022', status:'ativo',    salario:5200 },
  { id:2, nome:'Carlos Mendes',   cargo:'Técnico de Manutenção',depto:'Manutenção',    admissao:'04/07/2021', status:'ativo',    salario:4100 },
  { id:3, nome:'Beatriz Lima',    cargo:'Coordenadora de RH',   depto:'Administrativo',admissao:'19/01/2020', status:'ativo',    salario:6800 },
  { id:4, nome:'Diego Ferreira',  cargo:'Supervisor de Operações',depto:'Operações',   admissao:'02/09/2023', status:'ferias',   salario:5900 },
  { id:5, nome:'Elaine Santos',   cargo:'Executiva de Vendas',  depto:'Comercial',     admissao:'23/05/2024', status:'ativo',    salario:4700 },
  { id:6, nome:'Fábio Rocha',     cargo:'Analista de PCM',      depto:'Manutenção',    admissao:'11/11/2019', status:'afastado', salario:5100 },
  { id:7, nome:'Gabriela Alves',  cargo:'Assistente Administrativo',depto:'Administrativo',admissao:'30/06/2025',status:'ativo', salario:3200 },
  { id:8, nome:'Henrique Dias',   cargo:'Operador de Produção', depto:'Operações',     admissao:'14/02/2023', status:'ativo',    salario:3400 },
];

const PONTO = [
  { data:'12/06', nome:'Ana Souza',     entrada:'08:02', saida:'17:58', horas:'8h56', status:'ok'    },
  { data:'12/06', nome:'Carlos Mendes', entrada:'08:24', saida:'18:01', horas:'8h37', status:'atraso'},
  { data:'12/06', nome:'Beatriz Lima',  entrada:'07:55', saida:'17:50', horas:'8h55', status:'ok'    },
  { data:'12/06', nome:'Diego Ferreira',entrada:'—',     saida:'—',     horas:'—',    status:'ferias'},
  { data:'12/06', nome:'Elaine Santos', entrada:'08:05', saida:'18:10', horas:'9h05', status:'ok'    },
  { data:'12/06', nome:'Fábio Rocha',   entrada:'—',     saida:'—',     horas:'—',    status:'falta' },
  { data:'12/06', nome:'Gabriela Alves',entrada:'08:00', saida:'17:55', horas:'8h55', status:'ok'    },
];

const ANIVERSARIANTES = [
  { nome:'Elaine Santos',  data:'18/06' },
  { nome:'Fábio Rocha',    data:'24/06' },
  { nome:'Henrique Dias',  data:'29/06' },
];

const soma = a => a.reduce((s,v)=>s+v,0);
const fmtBRL = v => `R$ ${v.toLocaleString('pt-BR')}`;

// ---- SVG helpers ----
function mkPts(data,W,H,pad=10){
  const lo=Math.min(...data)*0.95, hi=Math.max(...data)*1.03, rng=hi-lo;
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

function Num({n,prefix='',suffix=''}){
  const [v,setV]=useState(0);
  useEffect(()=>{ let s=null; const step=ts=>{ if(!s)s=ts; const p=Math.min((ts-s)/900,1),e=1-Math.pow(1-p,3); setV(Math.round(n*e)); if(p<1)requestAnimationFrame(step); }; const id=setTimeout(()=>requestAnimationFrame(step),200); return()=>clearTimeout(id); },[n]);
  return <>{prefix}{v.toLocaleString('pt-BR')}{suffix}</>;
}

function HBar({label,v,max,color,anim}){
  return(
    <div style={{marginBottom:'10px'}}>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:'4px'}}>
        <span style={{fontSize:'12px',color:'var(--text-2)'}}>{label}</span>
        <span style={{fontSize:'11.5px',fontFamily:'var(--mono)',color:'var(--text)',fontWeight:600}}>{v}</span>
      </div>
      <div style={{height:'5px',background:'var(--surface-2)',borderRadius:'3px',overflow:'hidden'}}>
        <div style={{height:'100%',width:anim?`${(v/max)*100}%`:'0%',background:color,borderRadius:'3px',transition:'width 1.1s cubic-bezier(.4,0,.2,1)'}}/>
      </div>
    </div>
  );
}

function HeadcountChart(){
  const W=520, H=140;
  const pts=mkPts(HEADCOUNT_MES,W,H);
  return(
    <svg viewBox={`-2 0 ${W+4} ${H+22}`} style={{width:'100%',height:'auto',display:'block'}}>
      <defs>
        <linearGradient id="rhg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7C4FE0" stopOpacity=".2"/><stop offset="100%" stopColor="#7C4FE0" stopOpacity="0"/></linearGradient>
        <clipPath id="rhcr"><rect x="0" y="0" width={W} height={H+2}><animate attributeName="width" from="0" to={W} dur="1.4s" fill="freeze"/></rect></clipPath>
      </defs>
      {[0.25,0.5,0.75].map(f=><line key={f} x1="0" y1={H*f} x2={W} y2={H*f} stroke="rgba(38,20,66,0.06)" strokeWidth="1"/>)}
      {MESES.map((m,i)=><text key={m} x={10+(i/(MESES.length-1))*(W-20)} y={H+16} textAnchor="middle" fontSize="9.5" fill="#A79FBF" fontFamily="var(--mono)">{m}</text>)}
      <g clipPath="url(#rhcr)">
        <polygon points={aStr(pts,H)} fill="url(#rhg)"/>
        <path d={smoothPath(pts)} fill="none" stroke="#7C4FE0" strokeWidth="2.2" strokeLinejoin="round"/>
      </g>
    </svg>
  );
}

// ---- Icons ----
const IcoDash = ()=><svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1.5" fill="currentColor"/><rect x="9" y="1.5" width="5.5" height="5.5" rx="1.5" fill="currentColor" opacity=".5"/><rect x="1.5" y="9" width="5.5" height="5.5" rx="1.5" fill="currentColor" opacity=".5"/><rect x="9" y="9" width="5.5" height="5.5" rx="1.5" fill="currentColor" opacity=".5"/></svg>;
const IcoUsers= ()=><svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="6" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.5"/><path d="M1.5 14c0-2.8 2-4.5 4.5-4.5s4.5 1.7 4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="12" cy="6" r="2" stroke="currentColor" strokeWidth="1.3" opacity=".7"/><path d="M10.5 14c0-2 1.3-3.6 3-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity=".7"/></svg>;
const IcoCal  = ()=><svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="2.5" width="13" height="11.5" rx="1.8" stroke="currentColor" strokeWidth="1.5"/><path d="M4.5 1v3M11.5 1v3M1.5 6.5h13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>;
const IcoBack = ()=><svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M9 3L4 8l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;

function Avatar({nome,size=38}){
  const idx = nome.charCodeAt(0)%CORES_AVATAR.length;
  return <div className="rh-avatar-lg" style={{width:size,height:size,fontSize:size*0.34,background:CORES_AVATAR[idx]}}>{iniciais(nome)}</div>;
}

// ================================================================
// VIEWS
// ================================================================
function PainelView(){
  const [anim,setAnim]=useState(false);
  useEffect(()=>{ const t=setTimeout(()=>setAnim(true),200); return()=>clearTimeout(t); },[]);

  const total    = COLABORADORES.length;
  const ativos   = COLABORADORES.filter(c=>c.status==='ativo').length;
  const afastados= COLABORADORES.filter(c=>c.status==='afastado').length;
  const admissoesMes = 1;
  const turnover = '2.1%';

  return(
    <>
      <div className="rh-greeting">
        <div>
          <div className="rh-greeting-sub">Bem-vinda de volta,</div>
          <div className="rh-greeting-name">Beatriz Lima</div>
        </div>
        <div style={{display:'flex',gap:'10px'}}>
          <button className="btn btn-ghost btn-sm">🔔 Notificações</button>
          <button className="btn btn-primary btn-sm">+ Novo colaborador</button>
        </div>
      </div>

      <div className="rh-kpi-row">
        <div className="rh-kpi-card">
          <div className="rh-kpi-icon" style={{background:'var(--accent-soft)'}}>👥</div>
          <div className="rh-kpi-value"><Num n={total}/></div>
          <div className="rh-kpi-label">Colaboradores ativos</div>
        </div>
        <div className="rh-kpi-card">
          <div className="rh-kpi-icon" style={{background:'var(--ok-soft)'}}>📈</div>
          <div className="rh-kpi-value">{turnover}</div>
          <div className="rh-kpi-label">Turnover mensal</div>
        </div>
        <div className="rh-kpi-card">
          <div className="rh-kpi-icon" style={{background:'var(--warn-soft)'}}>🆕</div>
          <div className="rh-kpi-value"><Num n={admissoesMes}/></div>
          <div className="rh-kpi-label">Admissões no mês</div>
        </div>
        <div className="rh-kpi-card">
          <div className="rh-kpi-icon" style={{background:'var(--crit-soft)'}}>🏥</div>
          <div className="rh-kpi-value"><Num n={afastados}/></div>
          <div className="rh-kpi-label">Afastamentos ativos</div>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1.4fr 1fr',gap:'16px',marginBottom:'20px'}}>
        <div className="chart-box">
          <div className="chart-head"><div><div className="chart-title">Headcount</div><div className="chart-sub">Últimos 6 meses · nº de colaboradores</div></div></div>
          <HeadcountChart/>
        </div>
        <div className="chart-box">
          <div className="chart-title" style={{marginBottom:'14px'}}>Colaboradores por área</div>
          {DEPTOS.map(d=><HBar key={d.label} label={d.label} v={d.v} max={46} color={d.color} anim={anim}/>)}
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1.6fr 1fr',gap:'16px'}}>
        <div className="table-box">
          <div className="table-head"><div className="table-title">Ponto de hoje</div><span className="badge badge-warn">{PONTO.filter(p=>p.status==='atraso').length} atraso(s)</span></div>
          <table className="data-table">
            <thead><tr><th>Colaborador</th><th>Entrada</th><th>Saída</th><th>Horas</th><th>Status</th></tr></thead>
            <tbody>
              {PONTO.map((p,i)=>(
                <tr key={i}>
                  <td className="td-main">{p.nome}</td>
                  <td className="td-mono">{p.entrada}</td>
                  <td className="td-mono">{p.saida}</td>
                  <td className="td-mono td-muted">{p.horas}</td>
                  <td><span className={`badge badge-${p.status==='ok'?'ok':p.status==='atraso'?'warn':p.status==='falta'?'crit':'muted'}`}>{p.status==='ok'?'Em dia':p.status==='atraso'?'Atraso':p.status==='falta'?'Falta':'Férias'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="chart-box">
          <div className="chart-title" style={{marginBottom:'14px'}}>Aniversariantes do mês</div>
          {ANIVERSARIANTES.map(a=>(
            <div key={a.nome} style={{display:'flex',alignItems:'center',gap:'10px',padding:'8px 0',borderBottom:'1px solid var(--border)'}}>
              <Avatar nome={a.nome} size={32}/>
              <div style={{flex:1}}>
                <div className="rh-person-name">{a.nome}</div>
              </div>
              <span className="badge badge-accent">🎂 {a.data}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function ColaboradoresView(){
  const [busca,setBusca]=useState('');
  const filtrados = COLABORADORES.filter(c => c.nome.toLowerCase().includes(busca.toLowerCase()) || c.depto.toLowerCase().includes(busca.toLowerCase()));
  return(
    <div className="rh-view-wrap">
      <div style={{display:'flex',gap:'14px',marginBottom:'20px'}}>
        {[{l:'Total de colaboradores',v:COLABORADORES.length,c:'var(--accent)'},{l:'Ativos',v:COLABORADORES.filter(c=>c.status==='ativo').length,c:'var(--ok)'},{l:'Em férias / afastados',v:COLABORADORES.filter(c=>c.status!=='ativo').length,c:'var(--warn)'}].map((m,i)=>(
          <div key={i} className="stat-card" style={{flex:1}}><div className="stat-label">{m.l}</div><div className="stat-value" style={{color:m.c,fontSize:'20px'}}>{m.v}</div></div>
        ))}
      </div>
      <div className="table-box">
        <div className="table-head">
          <div className="table-title">Colaboradores</div>
          <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Buscar por nome ou área..." style={{padding:'7px 12px',borderRadius:'8px',border:'1px solid var(--border)',background:'var(--surface-2)',fontFamily:'var(--font)',fontSize:'12.5px',outline:'none',width:'220px'}}/>
        </div>
        <table className="data-table">
          <thead><tr><th>Colaborador</th><th>Cargo</th><th>Área</th><th>Admissão</th><th>Salário</th><th>Status</th></tr></thead>
          <tbody>
            {filtrados.map(c=>(
              <tr key={c.id}>
                <td>
                  <div style={{display:'flex',alignItems:'center',gap:'9px'}}>
                    <Avatar nome={c.nome} size={28}/>
                    <span className="td-main">{c.nome}</span>
                  </div>
                </td>
                <td className="td-muted">{c.cargo}</td>
                <td className="td-muted">{c.depto}</td>
                <td className="td-mono">{c.admissao}</td>
                <td className="td-mono">{fmtBRL(c.salario)}</td>
                <td><span className={`badge badge-${c.status==='ativo'?'ok':c.status==='ferias'?'accent':'crit'}`}>{c.status==='ativo'?'Ativo':c.status==='ferias'?'Férias':'Afastado'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PontoView(){
  const ok = PONTO.filter(p=>p.status==='ok').length;
  const problemas = PONTO.filter(p=>p.status==='atraso'||p.status==='falta').length;
  return(
    <div className="rh-view-wrap">
      <div style={{display:'flex',gap:'14px',marginBottom:'20px'}}>
        {[{l:'Registros hoje',v:PONTO.length,c:'var(--accent)'},{l:'Em dia',v:ok,c:'var(--ok)'},{l:'Atrasos / faltas',v:problemas,c:'var(--crit)'}].map((m,i)=>(
          <div key={i} className="stat-card" style={{flex:1}}><div className="stat-label">{m.l}</div><div className="stat-value" style={{color:m.c,fontSize:'22px'}}>{m.v}</div></div>
        ))}
      </div>
      <div className="table-box">
        <div className="table-head"><div className="table-title">Frequência — 12/06/2026</div></div>
        <table className="data-table">
          <thead><tr><th>Colaborador</th><th>Entrada</th><th>Saída</th><th>Horas trabalhadas</th><th>Status</th></tr></thead>
          <tbody>
            {PONTO.map((p,i)=>(
              <tr key={i}>
                <td className="td-main">{p.nome}</td>
                <td className="td-mono">{p.entrada}</td>
                <td className="td-mono">{p.saida}</td>
                <td className="td-mono td-muted">{p.horas}</td>
                <td><span className={`badge badge-${p.status==='ok'?'ok':p.status==='atraso'?'warn':p.status==='falta'?'crit':'muted'}`}>{p.status==='ok'?'Em dia':p.status==='atraso'?'Atraso':p.status==='falta'?'Falta':'Férias'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ConfigView(){
  const [saved,setSaved]=useState(false);
  const [form,setForm]=useState({empresa:'Lynus Tech Ltda',jornada:'44h semanais',tolerancia:'10 min',email:'rh@lynus.tech',notif:true});
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  return(
    <div className="rh-view-wrap" style={{maxWidth:'520px'}}>
      <div style={{marginBottom:'20px'}}><h3 style={{fontSize:'15px',fontWeight:700,color:'var(--text)'}}>Configurações de RH</h3></div>
      {saved && <div className="auth-msg-ok" style={{marginBottom:'14px',padding:'12px 16px',borderRadius:'10px'}}>✓ Configurações salvas com sucesso.</div>}
      <div className="chart-box" style={{display:'flex',flexDirection:'column',gap:'16px'}}>
        {[{l:'Razão Social',k:'empresa'},{l:'Jornada padrão',k:'jornada'},{l:'Tolerância de ponto',k:'tolerancia'},{l:'E-mail de notificações',k:'email'}].map(f=>(
          <div key={f.k}>
            <label style={{fontSize:'12.5px',fontWeight:500,color:'var(--text-2)',display:'block',marginBottom:'5px'}}>{f.l}</label>
            <input type="text" value={form[f.k]} onChange={e=>set(f.k,e.target.value)} style={{width:'100%',padding:'10px 13px',background:'var(--surface-2)',border:'1px solid var(--border-strong)',borderRadius:'9px',color:'var(--text)',fontFamily:'var(--font)',fontSize:'13.5px',outline:'none'}}/>
          </div>
        ))}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div><div style={{fontSize:'13px',fontWeight:500,color:'var(--text)'}}>Notificar aniversários e admissões</div><div style={{fontSize:'12px',color:'var(--text-2)'}}>Enviar lembretes por e-mail</div></div>
          <button onClick={()=>set('notif',!form.notif)} style={{width:'44px',height:'24px',borderRadius:'12px',background:form.notif?'var(--ok)':'rgba(38,20,66,0.15)',border:'none',cursor:'pointer',position:'relative',transition:'background 0.2s',flexShrink:0}}>
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
  { id:'painel',        title:'Painel',        Icon:IcoDash  },
  { id:'colaboradores',  title:'Colaboradores', Icon:IcoUsers },
  { id:'ponto',          title:'Ponto',         Icon:IcoCal   },
];
const VIEW_TITLE = { painel:'Painel', colaboradores:'Colaboradores', ponto:'Ponto e Frequência', config:'Configurações' };

function App(){
  const [view,setView]=useState('painel');
  const views = { painel:<PainelView/>, colaboradores:<ColaboradoresView/>, ponto:<PontoView/>, config:<ConfigView/> };
  return(
    <div className="rh-layout">
      <div className="rh-topnav">
        <div className="rh-topnav-logo">
          <div className="rh-topnav-logo-mark">👥</div>
          <div>
            <div className="rh-topnav-logo-text">LYNUS</div>
            <div className="rh-topnav-logo-sub">RH</div>
          </div>
        </div>
        <div className="rh-topnav-divider"/>
        <div className="rh-topnav-links">
          {NAV_ITEMS.map(it=>(
            <button key={it.id} className={`rh-topnav-btn${view===it.id?' active':''}`} onClick={()=>setView(it.id)}>
              <it.Icon/>{it.title}
            </button>
          ))}
          <button className={`rh-topnav-btn${view==='config'?' active':''}`} onClick={()=>setView('config')}>⚙️ Configurações</button>
        </div>
        <div className="rh-topnav-right">
          <button className="rh-topnav-icon-btn" onClick={()=>window.location.href='index.html'}><IcoBack/></button>
          <div className="rh-avatar-sm">BL</div>
        </div>
      </div>

      <div className="rh-main">
        {view !== 'painel' && (
          <div className="rh-topbar">
            <div>
              <div className="rh-page-title">{VIEW_TITLE[view]}</div>
              <div className="rh-page-sub">Sistema de RH · Jun 2026</div>
            </div>
          </div>
        )}
        <div className="rh-content">{views[view]}</div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
