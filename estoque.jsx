/* ============================================================
   LYNUS TECH — Sistema de Estoque
   ============================================================ */
const { useState, useEffect } = React;

// ---- Data ----
const MESES = ['Jan','Fev','Mar','Abr','Mai','Jun'];
const ENTRADAS_MES = [82, 96, 74, 110, 92, 128];
const SAIDAS_MES   = [70, 84, 68, 96,  88, 104];

const CATEGORIAS = [
  { label: 'Matéria-prima',      v: 186, color: '#0F9D74' },
  { label: 'Embalagens',         v: 94,  color: '#34C9A0' },
  { label: 'Ferramentas',        v: 58,  color: '#C98A12' },
  { label: 'EPI',                v: 34,  color: '#5B7A70' },
  { label: 'Peças de reposição', v: 21,  color: '#94AFA5' },
];

const PRODUTOS = [
  { sku:'EST-0142', nome:'Chapa de Aço 2mm',        cat:'Matéria-prima',  qtd:420, min:150, custo:38.5,  local:'A1-03', status:'ok'   },
  { sku:'EST-0198', nome:'Caixa Papelão Reforçada',  cat:'Embalagens',     qtd:1280,min:500, custo:2.9,   local:'B2-11', status:'ok'   },
  { sku:'EST-0071', nome:'Parafuso Sextavado M8',    cat:'Matéria-prima',  qtd:96,  min:200, custo:0.35,  local:'A3-07', status:'baixo'},
  { sku:'EST-0233', nome:'Luva de Proteção Nitrílica',cat:'EPI',           qtd:18,  min:80,  custo:6.4,   local:'C1-02', status:'critico'},
  { sku:'EST-0089', nome:'Motor Redutor 1/4 CV',     cat:'Peças de reposição', qtd:6, min:10, custo:412.0, local:'D4-01', status:'critico'},
  { sku:'EST-0156', nome:'Fita Adesiva Industrial',  cat:'Embalagens',     qtd:340, min:100, custo:8.2,   local:'B2-04', status:'ok'   },
  { sku:'EST-0301', nome:'Chave de Impacto 1/2"',    cat:'Ferramentas',    qtd:12,  min:6,   custo:289.0, local:'E1-05', status:'ok'   },
  { sku:'EST-0044', nome:'Óculos de Proteção',       cat:'EPI',            qtd:64,  min:60,  custo:9.9,   local:'C1-01', status:'baixo'},
];

const MOVIMENTACOES = [
  { data:'12/06', tipo:'entrada', produto:'Chapa de Aço 2mm',         qtd:180, resp:'Carlos M.', motivo:'Reposição fornecedor' },
  { data:'12/06', tipo:'saida',   produto:'Caixa Papelão Reforçada',  qtd:220, resp:'Linha 2',    motivo:'Consumo produção' },
  { data:'11/06', tipo:'saida',   produto:'Parafuso Sextavado M8',    qtd:340, resp:'Linha 1',    motivo:'Consumo produção' },
  { data:'11/06', tipo:'entrada', produto:'Luva de Proteção Nitrílica',qtd:40, resp:'Ana S.',     motivo:'Compra emergencial' },
  { data:'10/06', tipo:'saida',   produto:'Motor Redutor 1/4 CV',     qtd:2,   resp:'Manutenção',  motivo:'Substituição OS-2291' },
  { data:'09/06', tipo:'entrada', produto:'Fita Adesiva Industrial',  qtd:100, resp:'Pedro R.',   motivo:'Reposição fornecedor' },
  { data:'08/06', tipo:'saida',   produto:'Óculos de Proteção',       qtd:24,  resp:'RH',          motivo:'Distribuição EPI' },
];

const fmtBRL = v => `R$ ${v.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2})}`;
const fmtK   = v => v>=1000 ? `${(v/1000).toFixed(1)}K` : `${v}`;
const soma   = a => a.reduce((s,v)=>s+v,0);

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

function Spark({data,color='#0F9D74',w=64,h=32}){
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

function HBar({label,v,max,color,anim}){
  return(
    <div style={{marginBottom:'10px'}}>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:'4px'}}>
        <span style={{fontSize:'12px',color:'var(--text-2)'}}>{label}</span>
        <span style={{fontSize:'11.5px',fontFamily:'var(--mono)',color:'var(--text)',fontWeight:600}}>{v} un.</span>
      </div>
      <div style={{height:'5px',background:'var(--surface-2)',borderRadius:'3px',overflow:'hidden'}}>
        <div style={{height:'100%',width:anim?`${(v/max)*100}%`:'0%',background:color,borderRadius:'3px',transition:'width 1.1s cubic-bezier(.4,0,.2,1)'}}/>
      </div>
    </div>
  );
}

function FluxoChart(){
  const W=520, H=140;
  const ep=mkPts(ENTRADAS_MES,W,H), sp=mkPts(SAIDAS_MES,W,H);
  return(
    <svg viewBox={`-2 0 ${W+4} ${H+22}`} style={{width:'100%',height:'auto',display:'block'}}>
      <defs>
        <linearGradient id="esgE" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0F9D74" stopOpacity=".18"/><stop offset="100%" stopColor="#0F9D74" stopOpacity="0"/></linearGradient>
        <linearGradient id="esgS" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#C98A12" stopOpacity=".1"/><stop offset="100%" stopColor="#C98A12" stopOpacity="0"/></linearGradient>
        <clipPath id="escr"><rect x="0" y="0" width={W} height={H+2}><animate attributeName="width" from="0" to={W} dur="1.4s" fill="freeze"/></rect></clipPath>
      </defs>
      {[0.25,0.5,0.75].map(f=><line key={f} x1="0" y1={H*f} x2={W} y2={H*f} stroke="rgba(15,42,34,0.06)" strokeWidth="1"/>)}
      {MESES.map((m,i)=><text key={m} x={10+(i/(MESES.length-1))*(W-20)} y={H+16} textAnchor="middle" fontSize="9.5" fill="#94AFA5" fontFamily="var(--mono)">{m}</text>)}
      <g clipPath="url(#escr)">
        <polygon points={aStr(ep,H)} fill="url(#esgE)"/>
        <path d={smoothPath(ep)} fill="none" stroke="#0F9D74" strokeWidth="2" strokeLinejoin="round"/>
        <polygon points={aStr(sp,H)} fill="url(#esgS)"/>
        <path d={smoothPath(sp)} fill="none" stroke="#C98A12" strokeWidth="1.8" strokeLinejoin="round"/>
      </g>
    </svg>
  );
}

// ---- Icons ----
const IcoDash = ()=><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1" y="1" width="6.5" height="6.5" rx="1.5" fill="currentColor"/><rect x="10.5" y="1" width="6.5" height="6.5" rx="1.5" fill="currentColor"/><rect x="1" y="10.5" width="6.5" height="6.5" rx="1.5" fill="currentColor"/><rect x="10.5" y="10.5" width="6.5" height="6.5" rx="1.5" fill="currentColor"/></svg>;
const IcoBox  = ()=><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 5.5l7-3.5 7 3.5-7 3.5-7-3.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M2 5.5v7l7 3.5 7-3.5v-7" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M9 9v6.5" stroke="currentColor" strokeWidth="1.5"/></svg>;
const IcoSwap = ()=><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 6h10M10 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M15 12H5M8 9l-3 3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IcoGear = ()=><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="2.8" stroke="currentColor" strokeWidth="1.5"/><path d="M9 1.5v2M9 14.5v2M1.5 9h2M14.5 9h2M4.1 4.1l1.4 1.4M12.5 12.5l1.4 1.4M4.1 13.9l1.4-1.4M12.5 5.5l1.4-1.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>;
const IcoBack = ()=><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M7 4L3 9l4 5M3 9h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;

// ================================================================
// VIEWS
// ================================================================
function PainelView(){
  const [anim,setAnim]=useState(false);
  useEffect(()=>{ const t=setTimeout(()=>setAnim(true),200); return()=>clearTimeout(t); },[]);

  const totalItens = soma(PRODUTOS.map(p=>p.qtd));
  const valorTotal  = soma(PRODUTOS.map(p=>p.qtd*p.custo));
  const abaixoMin   = PRODUTOS.filter(p=>p.status!=='ok').length;
  const giro        = ((soma(SAIDAS_MES)/ (totalItens/MESES.length))*100/10).toFixed(1);
  const criticos     = PRODUTOS.filter(p=>p.status==='critico');

  return(
    <>
      <div className="es-greeting">
        <div>
          <h2>Olá, Admin!</h2>
          <p>Visão geral do estoque e movimentações recentes</p>
        </div>
        <div className="es-greeting-right" style={{display:'flex',gap:'10px'}}>
          <button className="es-icon-btn">🔔</button>
          <button className="es-icon-btn">⚙️</button>
        </div>
      </div>

      <div className="es-stat-row">
        <div className="es-card">
          <div className="es-card-inner">
            <div>
              <div className="es-card-label">Itens em estoque</div>
              <div className="es-card-value"><Num n={totalItens}/></div>
              <div className="es-card-delta up">↑ 6% vs mês anterior</div>
            </div>
            <Spark data={ENTRADAS_MES} color="#0F9D74"/>
          </div>
        </div>
        <div className="es-card">
          <div className="es-card-inner">
            <div>
              <div className="es-card-label">Valor total em estoque</div>
              <div className="es-card-value"><Num n={Math.round(valorTotal)} prefix="R$ "/></div>
              <div className="es-card-delta up">↑ 3,2% vs mês anterior</div>
            </div>
            <div style={{width:40,height:40,borderRadius:'50%',background:'var(--accent-soft)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'20px'}}>📦</div>
          </div>
        </div>
        <div className="es-card">
          <div className="es-card-inner">
            <div>
              <div className="es-card-label">Abaixo do mínimo</div>
              <div className="es-card-value"><Num n={abaixoMin}/></div>
              <div className="es-card-delta down">{criticos.length} em nível crítico</div>
            </div>
            <div className="es-badge-crit-pill">⚠ Atenção</div>
          </div>
        </div>
        <div className="es-card dark">
          <div className="es-card-inner">
            <div>
              <div className="es-card-label">Giro médio mensal</div>
              <div className="es-card-value"><Num n={giro} suffix="%"/></div>
              <div className="es-card-delta muted">Saídas / estoque médio</div>
            </div>
            <Spark data={SAIDAS_MES} color="rgba(255,255,255,0.75)"/>
          </div>
        </div>
      </div>

      <div className="es-row2">
        <div className="chart-box">
          <div className="chart-head">
            <div><div className="chart-title">Entradas vs Saídas</div><div className="chart-sub">Últimos 6 meses · unidades (centenas)</div></div>
            <div style={{display:'flex',gap:'12px'}}>
              <span style={{fontSize:'11px',display:'flex',alignItems:'center',gap:'5px',color:'var(--text-2)'}}><span style={{width:7,height:7,borderRadius:'50%',background:'var(--accent)',display:'inline-block'}}/> Entradas</span>
              <span style={{fontSize:'11px',display:'flex',alignItems:'center',gap:'5px',color:'var(--text-2)'}}><span style={{width:7,height:7,borderRadius:'50%',background:'var(--warn)',display:'inline-block'}}/> Saídas</span>
            </div>
          </div>
          <FluxoChart/>
        </div>
        <div className="chart-box">
          <div className="chart-title" style={{marginBottom:'14px'}}>Estoque por categoria</div>
          {CATEGORIAS.map(c=><HBar key={c.label} label={c.label} v={c.v} max={186} color={c.color} anim={anim}/>)}
        </div>
      </div>

      <div className="table-box">
        <div className="table-head">
          <div className="table-title">Itens em nível crítico</div>
          <span className="badge badge-crit">{criticos.length} urgentes</span>
        </div>
        <table className="data-table">
          <thead><tr><th>SKU</th><th>Produto</th><th>Categoria</th><th>Qtd. atual</th><th>Mínimo</th><th>Local</th><th>Status</th></tr></thead>
          <tbody>
            {PRODUTOS.filter(p=>p.status!=='ok').map(p=>(
              <tr key={p.sku}>
                <td className="td-mono">{p.sku}</td>
                <td className="td-main">{p.nome}</td>
                <td className="td-muted">{p.cat}</td>
                <td className="td-neg">{p.qtd} un.</td>
                <td className="td-mono td-muted">{p.min} un.</td>
                <td className="td-mono td-muted">{p.local}</td>
                <td><span className={`badge badge-${p.status==='critico'?'crit':'warn'}`}>{p.status==='critico'?'Crítico':'Baixo'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function ProdutosView(){
  const [busca,setBusca]=useState('');
  const filtrados = PRODUTOS.filter(p => p.nome.toLowerCase().includes(busca.toLowerCase()) || p.sku.toLowerCase().includes(busca.toLowerCase()));
  return(
    <div className="es-view-wrap">
      <div style={{display:'flex',gap:'14px',marginBottom:'20px'}}>
        {[{l:'SKUs cadastrados',v:PRODUTOS.length,c:'var(--accent)'},{l:'Valor em estoque',v:fmtBRL(soma(PRODUTOS.map(p=>p.qtd*p.custo))),c:'var(--ok)'},{l:'Abaixo do mínimo',v:PRODUTOS.filter(p=>p.status!=='ok').length,c:'var(--crit)'}].map((m,i)=>(
          <div key={i} className="stat-card" style={{flex:1}}><div className="stat-label">{m.l}</div><div className="stat-value" style={{color:m.c,fontSize:'20px'}}>{m.v}</div></div>
        ))}
      </div>
      <div className="table-box">
        <div className="table-head">
          <div className="table-title">Produtos</div>
          <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Buscar por nome ou SKU..." style={{padding:'7px 12px',borderRadius:'8px',border:'1px solid var(--border)',background:'var(--surface-2)',fontFamily:'var(--font)',fontSize:'12.5px',outline:'none',width:'220px'}}/>
        </div>
        <table className="data-table">
          <thead><tr><th>SKU</th><th>Produto</th><th>Categoria</th><th>Qtd.</th><th>Mínimo</th><th>Custo un.</th><th>Local</th><th>Status</th></tr></thead>
          <tbody>
            {filtrados.map(p=>(
              <tr key={p.sku}>
                <td className="td-mono">{p.sku}</td>
                <td className="td-main">{p.nome}</td>
                <td className="td-muted">{p.cat}</td>
                <td className="td-mono">{p.qtd} un.</td>
                <td className="td-mono td-muted">{p.min} un.</td>
                <td className="td-mono">{fmtBRL(p.custo)}</td>
                <td className="td-mono td-muted">{p.local}</td>
                <td><span className={`badge badge-${p.status==='ok'?'ok':p.status==='baixo'?'warn':'crit'}`}>{p.status==='ok'?'Normal':p.status==='baixo'?'Baixo':'Crítico'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MovimentacoesView(){
  const entradas = MOVIMENTACOES.filter(m=>m.tipo==='entrada').length;
  const saidas   = MOVIMENTACOES.filter(m=>m.tipo==='saida').length;
  return(
    <div className="es-view-wrap">
      <div style={{display:'flex',gap:'14px',marginBottom:'20px'}}>
        {[{l:'Movimentações (7d)',v:MOVIMENTACOES.length,c:'var(--accent)'},{l:'Entradas',v:entradas,c:'var(--ok)'},{l:'Saídas',v:saidas,c:'var(--warn)'}].map((m,i)=>(
          <div key={i} className="stat-card" style={{flex:1}}><div className="stat-label">{m.l}</div><div className="stat-value" style={{color:m.c,fontSize:'22px'}}>{m.v}</div></div>
        ))}
      </div>
      <div className="table-box">
        <div className="table-head"><div className="table-title">Últimas movimentações</div></div>
        <table className="data-table">
          <thead><tr><th>Data</th><th>Tipo</th><th>Produto</th><th>Qtd.</th><th>Responsável</th><th>Motivo</th></tr></thead>
          <tbody>
            {MOVIMENTACOES.map((m,i)=>(
              <tr key={i}>
                <td className="td-mono">{m.data}</td>
                <td><span className={`badge badge-${m.tipo==='entrada'?'ok':'warn'}`}>{m.tipo==='entrada'?'Entrada':'Saída'}</span></td>
                <td className="td-main">{m.produto}</td>
                <td className={m.tipo==='entrada'?'td-pos':'td-neg'}>{m.tipo==='entrada'?'+':'-'}{m.qtd} un.</td>
                <td className="td-muted">{m.resp}</td>
                <td className="td-muted">{m.motivo}</td>
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
  const [form,setForm]=useState({empresa:'Lynus Tech Ltda',armazem:'Galpão Central — SP',politica:'FIFO',email:'estoque@lynus.tech',alertas:true});
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  return(
    <div className="es-view-wrap" style={{maxWidth:'520px'}}>
      <div style={{marginBottom:'20px'}}><h3 style={{fontSize:'15px',fontWeight:700,color:'var(--text)'}}>Configurações do Estoque</h3></div>
      {saved && <div className="auth-msg-ok" style={{marginBottom:'14px',padding:'12px 16px',borderRadius:'10px'}}>✓ Configurações salvas com sucesso.</div>}
      <div className="chart-box" style={{display:'flex',flexDirection:'column',gap:'16px'}}>
        {[{l:'Razão Social',k:'empresa'},{l:'Armazém principal',k:'armazem'},{l:'Política de saída',k:'politica'},{l:'E-mail de alertas',k:'email'}].map(f=>(
          <div key={f.k}>
            <label style={{fontSize:'12.5px',fontWeight:500,color:'var(--text-2)',display:'block',marginBottom:'5px'}}>{f.l}</label>
            <input type="text" value={form[f.k]} onChange={e=>set(f.k,e.target.value)} style={{width:'100%',padding:'10px 13px',background:'var(--surface-2)',border:'1px solid var(--border-strong)',borderRadius:'9px',color:'var(--text)',fontFamily:'var(--font)',fontSize:'13.5px',outline:'none'}}/>
          </div>
        ))}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div><div style={{fontSize:'13px',fontWeight:500,color:'var(--text)'}}>Alertas de estoque baixo</div><div style={{fontSize:'12px',color:'var(--text-2)'}}>Notificar quando um item atingir o mínimo</div></div>
          <button onClick={()=>set('alertas',!form.alertas)} style={{width:'44px',height:'24px',borderRadius:'12px',background:form.alertas?'var(--ok)':'rgba(15,42,34,0.15)',border:'none',cursor:'pointer',position:'relative',transition:'background 0.2s',flexShrink:0}}>
            <span style={{width:'18px',height:'18px',borderRadius:'50%',background:'#fff',position:'absolute',top:'3px',left:form.alertas?'23px':'3px',transition:'left 0.2s',display:'block'}}/>
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
  { id:'painel',   title:'Painel',          Icon:IcoDash },
  { id:'produtos', title:'Produtos',        Icon:IcoBox  },
  { id:'movs',     title:'Movimentações',   Icon:IcoSwap },
  { id:'config',   title:'Configurações',   Icon:IcoGear },
];
const VIEW_TITLE = { painel:'Painel', produtos:'Produtos', movs:'Movimentações', config:'Configurações' };

function App(){
  const [view,setView]=useState('painel');
  const views = { painel:<PainelView/>, produtos:<ProdutosView/>, movs:<MovimentacoesView/>, config:<ConfigView/> };
  return(
    <div className="es-layout">
      <aside className="es-sidebar">
        <div className="es-logo">
          <div className="es-logo-mark">📦</div>
          <div>
            <div className="es-logo-text">LYNUS</div>
            <div className="es-logo-sub">ESTOQUE</div>
          </div>
        </div>
        <nav className="es-sidebar-nav">
          {NAV_ITEMS.map(it=>(
            <button key={it.id} className={`es-nav-btn${view===it.id?' active':''}`} onClick={()=>setView(it.id)}>
              <it.Icon/><span>{it.title}</span>
            </button>
          ))}
        </nav>
        <div className="es-sidebar-bottom">
          <div className="es-sidebar-sep"/>
          <button className="es-nav-btn" onClick={()=>window.location.href='index.html'}>
            <IcoBack/><span>Voltar ao site</span>
          </button>
          <div className="es-sidebar-user">
            <div className="es-avatar-sm">AD</div>
            <div className="es-sidebar-user-name">Admin</div>
          </div>
        </div>
      </aside>
      <div className="es-main">
        {view !== 'painel' && (
          <div className="es-topbar">
            <div>
              <div className="es-topbar-title">{VIEW_TITLE[view]}</div>
              <div className="es-topbar-sub">Sistema de Estoque · Jun 2026</div>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
              <button className="es-icon-btn">🔔</button>
              <div className="es-avatar-sm" style={{width:36,height:36,fontSize:13}}>AD</div>
            </div>
          </div>
        )}
        {view === 'painel' ? <div className="es-content">{views[view]}</div> : views[view]}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
