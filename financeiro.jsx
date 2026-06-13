/* ============================================================
   LYNUS TECH — Sistema Financeiro (Dribbble-matched)
   ============================================================ */
const { useState, useEffect } = React;

// ---- Data ----
const MONTHS   = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
const RECEITA  = [182,228,197,288,318,298,348,388,362,428,398,465];
const DESPESAS = [140,170,152,214,230,205,260,285,265,315,295,338];
const CATEGORIAS = [
  {label:'Folha',         v:142, color:'#4C6EF5'},
  {label:'Fornecedores',  v:88,  color:'#6B8AFF'},
  {label:'Infraestrutura',v:54,  color:'#2A9D5C'},
  {label:'Marketing',     v:31,  color:'#D4861A'},
  {label:'Outros',        v:18,  color:'#B0A498'},
];
const TRANSACOES = [
  {desc:'Receita de Serviços — Nuvora Corp',  cat:'Receita',      valor:+95000, icone:'💼',bg:'rgba(76,110,245,0.1)',  hora:'14:24'},
  {desc:'Pagamento Fornecedor NF-2847',       cat:'Fornecedores', valor:-28400, icone:'🏭',bg:'rgba(217,48,37,0.1)',   hora:'15:23'},
  {desc:'Folha de Pagamento — Jun/26',        cat:'Folha',        valor:-62500, icone:'👥',bg:'rgba(212,134,26,0.1)',  hora:'09:01'},
  {desc:'Receita de Licenças — Cortex Ltda',  cat:'Receita',      valor:+42000, icone:'💡',bg:'rgba(42,157,92,0.1)',   hora:'11:45'},
  {desc:'Infraestrutura Cloud — Mai/26',       cat:'Infra',        valor: -8940, icone:'☁️',bg:'rgba(107,138,255,0.1)',hora:'08:30'},
];
const APAGAR = [
  {venc:'14/06',desc:'Fornecedor Helio — NF-3012',  cat:'Fornecedores',valor:18400,status:'crit'},
  {venc:'15/06',desc:'Aluguel Escritório Jun/26',    cat:'Imóvel',      valor:12500,status:'warn'},
  {venc:'18/06',desc:'Seguro Empresarial 2026',      cat:'Seguros',     valor: 4800,status:'ok' },
  {venc:'20/06',desc:'Fornecedor Nuvora — NF-1847',  cat:'Fornecedores',valor:32000,status:'ok' },
  {venc:'22/06',desc:'Licença Software Suite',       cat:'TI',          valor: 2400,status:'ok' },
  {venc:'25/06',desc:'Contabilidade Jun/26',          cat:'Serviços',   valor: 3500,status:'ok' },
  {venc:'30/06',desc:'Energia Elétrica Mai/26',       cat:'Utilities',  valor: 6800,status:'ok' },
];
const ARECEBER = [
  {venc:'13/06',cliente:'Cortex Ltda',  desc:'Contrato #2042',    valor:48000,status:'warn'},
  {venc:'15/06',cliente:'Vantix S.A.',  desc:'Licença Anual',     valor:24000,status:'ok' },
  {venc:'18/06',cliente:'Nuvora Corp',  desc:'Serviços Mai/26',   valor:95000,status:'ok' },
  {venc:'20/06',cliente:'Orbita Tech',  desc:'Integração API',    valor:38500,status:'ok' },
  {venc:'25/06',cliente:'Paxil S.A.',   desc:'Renovação Contrato',valor:42000,status:'ok' },
  {venc:'30/06',cliente:'Helio Ltda',   desc:'Consultoria',        valor:16000,status:'ok' },
];
const CONCILIACAO = [
  {data:'10/06',desc:'Depósito Nuvora',       banco:+95000,sistema:+95000,ok:true },
  {data:'10/06',desc:'Débito Folha',          banco:-62500,sistema:-62500,ok:true },
  {data:'09/06',desc:'TED Cortex',            banco:+42000,sistema:+42000,ok:true },
  {data:'08/06',desc:'Pgto Fornecedor 2847',  banco:-28400,sistema:-28400,ok:true },
  {data:'08/06',desc:'Taxa Bancária Jun',      banco:  -380,sistema:null,  ok:false},
  {data:'07/06',desc:'Depósito Paxil',        banco:+68500,sistema:+68500,ok:true },
];

// ---- Helpers ----
const soma  = a => a.reduce((s,v)=>s+v,0);
const fmtK  = v => v>=1e6?`R$ ${(v/1e6).toFixed(1)}M`:`R$ ${(v/1e3).toFixed(0)}K`;
const fmtR  = v => `R$ ${v.toLocaleString('pt-BR')}`;
const fmtTx = v => { const a=Math.abs(v); const s=a>=1000?`${(a/1e3).toFixed(0)}K`:a; return v>=0?`+R$ ${s}`:`-R$ ${s}`; };

// ---- SVG helpers ----
function mkPts(data,W,H,pad=10){
  const lo=Math.min(...data)*0.9,hi=Math.max(...data)*1.04,rng=hi-lo;
  return data.map((v,i)=>[+(pad+(i/(data.length-1))*(W-pad*2)).toFixed(1),+(H-pad-((v-lo)/rng)*(H-pad*2)).toFixed(1)]);
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

// ---- Logo animado Lynus Financeiro ----
function LogoMark(){
  return(
    <svg width="148" height="64" viewBox="0 0 148 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{display:'block'}}>
      <defs>
        <linearGradient id="lgBar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#60b4ff"/>
          <stop offset="100%" stopColor="#1a4fbf"/>
        </linearGradient>
        <linearGradient id="lgText" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e8f0ff"/>
          <stop offset="60%" stopColor="#93c5fd"/>
          <stop offset="100%" stopColor="#60a5fa"/>
        </linearGradient>
        <linearGradient id="lgSub" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#D4861A"/>
          <stop offset="100%" stopColor="#f59e0b"/>
        </linearGradient>
      </defs>

      {/* Barra 1 — baixa */}
      <rect x="3" y="36" width="7" height="12" rx="1.8" fill="url(#lgBar)" opacity="0.45">
        <animate attributeName="height" values="12;17;12" dur="2.6s" begin="0s"   repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"/>
        <animate attributeName="y"      values="36;31;36" dur="2.6s" begin="0s"   repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"/>
      </rect>
      {/* Barra 2 — média-baixa */}
      <rect x="13" y="28" width="7" height="20" rx="1.8" fill="url(#lgBar)" opacity="0.6">
        <animate attributeName="height" values="20;14;20" dur="2.6s" begin="0.35s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"/>
        <animate attributeName="y"      values="28;34;28" dur="2.6s" begin="0.35s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"/>
      </rect>
      {/* Barra 3 — média-alta */}
      <rect x="23" y="18" width="7" height="30" rx="1.8" fill="url(#lgBar)" opacity="0.8">
        <animate attributeName="height" values="30;23;30" dur="2.6s" begin="0.7s"  repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"/>
        <animate attributeName="y"      values="18;25;18" dur="2.6s" begin="0.7s"  repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"/>
      </rect>
      {/* Barra 4 — alta */}
      <rect x="33" y="8"  width="7" height="40" rx="1.8" fill="url(#lgBar)">
        <animate attributeName="height" values="40;46;40" dur="2.6s" begin="1.05s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"/>
        <animate attributeName="y"      values="8;2;8"    dur="2.6s" begin="1.05s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"/>
      </rect>

      {/* Linha de tendência */}
      <polyline points="6,36 16,28 26,18 36,8" stroke="#93c5fd" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.45"/>

      {/* LYNUS */}
      <text x="48" y="36" fontFamily="'Quattrocento Sans', serif" fontWeight="700" fontSize="22" fill="url(#lgText)" letterSpacing="2">LYNUS</text>

      {/* Linha separadora */}
      <line x1="48" y1="41" x2="144" y2="41" stroke="rgba(147,197,253,0.2)" strokeWidth="0.8"/>

      {/* FINANCEIRO */}
      <text x="49" y="52" fontFamily="'Quattrocento Sans', sans-serif" fontWeight="400" fontSize="8" fill="url(#lgSub)" letterSpacing="3.2">FINANCEIRO</text>
    </svg>
  );
}

// ---- Mini sparkline ----
function Spark({data,color='#4C6EF5',w=64,h=32}){
  const pts=mkPts(data,w,h,2),uid=`sp${Math.random().toString(36).slice(2,6)}`;
  return(
    <svg viewBox={`0 0 ${w} ${h}`} style={{width:w,height:h,flexShrink:0,display:'block'}}>
      <defs><linearGradient id={uid} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity=".25"/><stop offset="100%" stopColor={color} stopOpacity="0"/></linearGradient></defs>
      <polygon points={aStr(pts,h)} fill={`url(#${uid})`}/>
      <polyline points={pStr(pts)} fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/>
    </svg>
  );
}

// ---- Mini bars ----
function MiniBars({data,color='#D4861A'}){
  const max=Math.max(...data),n=data.length,bw=Math.max(4,Math.floor(60/n)-3);
  return(
    <svg viewBox="0 0 64 32" style={{width:64,height:32,flexShrink:0,display:'block'}}>
      {data.map((v,i)=>{ const h=Math.max(2,(v/max)*28); return <rect key={i} x={i*(bw+2)+1} y={30-h} width={bw} height={h} fill={color} rx="2" opacity={i===n-1?1:0.45}/>; })}
    </svg>
  );
}

// ---- Animated counter ----
function Num({n,prefix='',suffix=''}){
  const [v,setV]=useState(0);
  useEffect(()=>{ let s=null; const step=ts=>{ if(!s)s=ts; const p=Math.min((ts-s)/900,1),e=1-Math.pow(1-p,3); setV(Math.round(n*e)); if(p<1)requestAnimationFrame(step); }; const id=setTimeout(()=>requestAnimationFrame(step),200); return()=>clearTimeout(id); },[n]);
  return <>{prefix}{v.toLocaleString('pt-BR')}{suffix}</>;
}

// ---- H progress bar ----
function HBar({label,v,max,color,anim}){
  return(
    <div style={{marginBottom:'10px'}}>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:'4px'}}>
        <span style={{fontSize:'12px',color:'var(--text-2)'}}>{label}</span>
        <span style={{fontSize:'11.5px',fontFamily:'var(--mono)',color:'var(--text)',fontWeight:600}}>R$ {v}K</span>
      </div>
      <div style={{height:'5px',background:'var(--surface-2)',borderRadius:'3px',overflow:'hidden'}}>
        <div style={{height:'100%',width:anim?`${(v/max)*100}%`:'0%',background:color,borderRadius:'3px',transition:'width 1.1s cubic-bezier(.4,0,.2,1)'}}/>
      </div>
    </div>
  );
}

// ---- Smooth line chart (balance card) ----
function BalanceChart(){
  const W=520,H=110;
  const balData=[32,48,40,58,44,62,52,70,55,74,60,78];
  const pts=mkPts(balData,W,H,8);
  const uid='bcg';
  return(
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%',height:'auto',display:'block'}}>
      <defs>
        <linearGradient id={uid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4C6EF5" stopOpacity=".15"/>
          <stop offset="100%" stopColor="#4C6EF5" stopOpacity="0"/>
        </linearGradient>
        <clipPath id="bccr"><rect x="0" y="0" width={W} height={H}><animate attributeName="width" from="0" to={W} dur="1.4s" fill="freeze"/></rect></clipPath>
      </defs>
      {[0.33,0.66,1].map(f=><line key={f} x1="0" y1={H*f} x2={W} y2={H*f} stroke="rgba(0,0,0,0.05)" strokeWidth="1"/>)}
      <g clipPath="url(#bccr)">
        <path d={`${smoothPath(pts)} L ${pts[pts.length-1][0]},${H} L ${pts[0][0]},${H} Z`} fill={`url(#${uid})`}/>
        <path d={smoothPath(pts)} fill="none" stroke="#4C6EF5" strokeWidth="2.2" strokeLinejoin="round"/>
      </g>
    </svg>
  );
}

// ---- Full line chart (Fluxo) ----
function LineChart(){
  const W=520,H=140;
  const rp=mkPts(RECEITA,W,H),dp=mkPts(DESPESAS,W,H);
  return(
    <svg viewBox={`-2 0 ${W+4} ${H+22}`} style={{width:'100%',height:'auto',display:'block'}}>
      <defs>
        <linearGradient id="lfgR" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4C6EF5" stopOpacity=".18"/><stop offset="100%" stopColor="#4C6EF5" stopOpacity="0"/></linearGradient>
        <linearGradient id="lfgD" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#D93025" stopOpacity=".1"/><stop offset="100%" stopColor="#D93025" stopOpacity="0"/></linearGradient>
        <clipPath id="lfcr"><rect x="0" y="0" width={W} height={H+2}><animate attributeName="width" from="0" to={W} dur="1.4s" fill="freeze"/></rect></clipPath>
      </defs>
      {[0.25,0.5,0.75].map(f=><line key={f} x1="0" y1={H*f} x2={W} y2={H*f} stroke="rgba(0,0,0,0.06)" strokeWidth="1"/>)}
      {MONTHS.map((m,i)=><text key={m} x={10+(i/(MONTHS.length-1))*(W-20)} y={H+16} textAnchor="middle" fontSize="9.5" fill="#B0A498" fontFamily="var(--mono)">{m}</text>)}
      <g clipPath="url(#lfcr)">
        <polygon points={aStr(rp,H)} fill="url(#lfgR)"/>
        <path d={smoothPath(rp)} fill="none" stroke="#4C6EF5" strokeWidth="2" strokeLinejoin="round"/>
        <polygon points={aStr(dp,H)} fill="url(#lfgD)"/>
        <path d={smoothPath(dp)} fill="none" stroke="#D93025" strokeWidth="1.8" strokeLinejoin="round"/>
      </g>
    </svg>
  );
}

// ---- Semi-circle gauge ----
function Gauge({pct,color='#2D4838'}){
  const r=48,stroke=11,circ=Math.PI*r;
  const fill=(pct/100)*circ;
  return(
    <svg viewBox="0 0 110 68" width="150" height="95" style={{display:'block'}}>
      <path d={`M ${55-r},60 A ${r},${r} 0 0 1 ${55+r},60`} fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth={stroke} strokeLinecap="round"/>
      <path d={`M ${55-r},60 A ${r},${r} 0 0 1 ${55+r},60`} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={`${fill.toFixed(1)} ${circ.toFixed(1)}`} style={{transition:'stroke-dasharray 1.2s cubic-bezier(.4,0,.2,1)'}}/>
      <text x="55" y="54" textAnchor="middle" fontSize="19" fontWeight="700" fill="#1A1614" fontFamily="var(--font)">{pct}%</text>
    </svg>
  );
}

// ================================================================
// SIDEBAR ICONS
// ================================================================
const IcoDash   = ()=><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1" y="1" width="6.5" height="6.5" rx="1.5" fill="currentColor"/><rect x="10.5" y="1" width="6.5" height="6.5" rx="1.5" fill="currentColor"/><rect x="1" y="10.5" width="6.5" height="6.5" rx="1.5" fill="currentColor"/><rect x="10.5" y="10.5" width="6.5" height="6.5" rx="1.5" fill="currentColor"/></svg>;
const IcoBars   = ()=><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1" y="10" width="4" height="7" rx="1" fill="currentColor"/><rect x="7" y="6" width="4" height="11" rx="1" fill="currentColor"/><rect x="13" y="2" width="4" height="15" rx="1" fill="currentColor"/></svg>;
const IcoDoc    = ()=><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="3" y="1.5" width="12" height="15" rx="2" stroke="currentColor" strokeWidth="1.5"/><line x1="6" y1="6" x2="12" y2="6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><line x1="6" y1="9" x2="12" y2="9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><line x1="6" y1="12" x2="10" y2="12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>;
const IcoUp     = ()=><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5"/><path d="M9 12V6M6 9l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IcoDown   = ()=><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5"/><path d="M9 6v6M6 9l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IcoBank   = ()=><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 16h14M9 2L2 8h14L9 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><rect x="4" y="8" width="2" height="8" fill="currentColor" rx="0.5"/><rect x="8" y="8" width="2" height="8" fill="currentColor" rx="0.5"/><rect x="12" y="8" width="2" height="8" fill="currentColor" rx="0.5"/></svg>;
const IcoCal    = ()=><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="3.5" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M6 1.5v3M12 1.5v3M2 8h14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>;
const IcoTrend  = ()=><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 14l5-5 3.5 3 5.5-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 5h4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IcoExport = ()=><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2v10M5 8l4-4 4 4M4 16h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IcoGear   = ()=><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="2.8" stroke="currentColor" strokeWidth="1.5"/><path d="M9 1.5v2M9 14.5v2M1.5 9h2M14.5 9h2M4.1 4.1l1.4 1.4M12.5 12.5l1.4 1.4M4.1 13.9l1.4-1.4M12.5 5.5l1.4-1.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>;
const IcoBack   = ()=><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M7 4L3 9l4 5M3 9h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;

// ================================================================
// PAINEL VIEW (Dribbble clone)
// ================================================================
function PainelView(){
  const lucros=RECEITA.map((r,i)=>r-DESPESAS[i]);
  const recTotal=soma(RECEITA);
  const desTotal=soma(DESPESAS);
  const lucroTotal=recTotal-desTotal;
  const margem=Math.round((lucroTotal/recTotal)*100);
  return(
    <>
      {/* GREETING */}
      <div className="fin-greeting">
        <div>
          <h2>Olá, Admin!</h2>
          <p>Explore informações e atividade financeira</p>
        </div>
        <div className="fin-greeting-right">
          <div className="fin-searchbox">
            <svg width="14" height="14" fill="none" viewBox="0 0 16 16"><circle cx="7" cy="7" r="5.5" stroke="#B0A498" strokeWidth="1.5"/><path d="M11.5 11.5L14 14" stroke="#B0A498" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <input type="text" placeholder="Buscar..."/>
          </div>
          <button className="fin-icon-btn">💬</button>
          <button className="fin-icon-btn">🔔</button>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="fin-stat-row">
        {/* Card 1 — Gasto este mês */}
        <div className="fin-card">
          <div className="fin-card-inner">
            <div>
              <div className="fin-card-label">Gasto este mês</div>
              <div className="fin-card-value"><Num n={205} prefix="R$ " suffix="K"/></div>
              <div className="fin-card-delta up">↑ 12% vs Mai</div>
            </div>
            <MiniBars data={DESPESAS.slice(-6)} color="#D4861A"/>
          </div>
        </div>

        {/* Card 2 — Novos contratos */}
        <div className="fin-card">
          <div className="fin-card-inner">
            <div>
              <div className="fin-card-label">Novos Contratos</div>
              <div className="fin-card-value"><Num n={8}/></div>
              <div className="fin-card-delta up">↑ 3 este mês</div>
            </div>
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'6px'}}>
              <div style={{width:36,height:36,borderRadius:'50%',background:'rgba(76,110,245,0.1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'18px'}}>👥</div>
              <Spark data={[4,5,4,6,7,8]} color="#4C6EF5" w={50} h={22}/>
            </div>
          </div>
        </div>

        {/* Card 3 — Receita */}
        <div className="fin-card">
          <div className="fin-card-inner">
            <div>
              <div className="fin-card-label">Receita do Mês</div>
              <div className="fin-card-value"><Num n={298} prefix="R$ " suffix="K"/></div>
              <div className="fin-card-delta up">↑ 18% vs Mai</div>
            </div>
            <div style={{width:40,height:40,borderRadius:'50%',background:'rgba(212,134,26,0.12)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'20px'}}>💰</div>
          </div>
        </div>

        {/* Card 4 — Atividade (DARK) */}
        <div className="fin-card dark">
          <div className="fin-card-inner">
            <div>
              <div className="fin-card-label">Atividade</div>
              <div className="fin-card-value"><Num n={127} prefix="R$ " suffix="K"/></div>
              <div className="fin-card-delta muted">Lucro acumulado Jun</div>
            </div>
            <Spark data={lucros.slice(-6)} color="rgba(255,255,255,0.75)" w={60} h={30}/>
          </div>
        </div>
      </div>

      {/* ROW 2: balance chart | earnings gauge | profile */}
      <div className="fin-row2">

        {/* Balance */}
        <div className="fin-box">
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'6px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
              <span className="fin-box-title">Saldo</span>
              <span className="fin-ok-pill">● Em dia</span>
            </div>
            <select className="fin-select"><option>Mensal</option><option>Anual</option></select>
          </div>
          <div className="fin-balance-stats">
            <div>
              <div className="fin-balance-stat-label">Economias</div>
              <div className="fin-balance-stat-value">32.4%</div>
              <div className="fin-balance-stat-delta up">+2.45%</div>
            </div>
            <div>
              <div className="fin-balance-stat-label">Saldo</div>
              <div className="fin-balance-stat-value">R$ 3.2M</div>
              <div className="fin-balance-stat-delta down">-4.75%</div>
            </div>
          </div>
          <BalanceChart/>
        </div>

        {/* Earnings / resultado */}
        <div className="fin-box">
          <div className="fin-box-title">Resultado</div>
          <div className="fin-box-sub" style={{marginBottom:'10px'}}>Total Despesas</div>
          <div style={{fontSize:'26px',fontWeight:700,color:'var(--text)',letterSpacing:'-0.03em'}}><Num n={2900} prefix="R$ " suffix="K"/></div>
          <div style={{fontSize:'12.5px',color:'var(--text-2)',marginTop:'4px',marginBottom:'12px',lineHeight:1.5}}>Margem {margem}% maior vs 2025</div>
          <div className="fin-gauge-area">
            <Gauge pct={margem} color="#2D4838"/>
            <div className="fin-gauge-desc">Lucro líquido sobre receita total</div>
          </div>
        </div>

        {/* Profile */}
        <div className="fin-box fin-profile">
          <div className="fin-profile-avatar">AD</div>
          <div className="fin-profile-name">Admin Lynus</div>
          <div className="fin-profile-email">admin@lynus.tech</div>
          <div className="fin-profile-stats">
            <div className="fin-profile-stat"><div className="fin-profile-stat-v">12</div><div className="fin-profile-stat-l">Relatórios</div></div>
            <div className="fin-profile-stat"><div className="fin-profile-stat-v">4</div><div className="fin-profile-stat-l">Alertas</div></div>
            <div className="fin-profile-stat"><div className="fin-profile-stat-v">99%</div><div className="fin-profile-stat-l">SLA</div></div>
          </div>
        </div>
      </div>

      {/* ROW 3: feature card | transfers | safety */}
      <div className="fin-row3">

        {/* Meta / feature card */}
        <div className="fin-feature-card">
          {/* decorative SVG background */}
          <svg className="fin-feature-bg" viewBox="0 0 220 180" fill="none" aria-hidden="true">
            <rect x="20" y="30" width="130" height="80" rx="12" fill="#1A1614"/>
            <rect x="30" y="40" width="110" height="8" rx="4" fill="rgba(255,255,255,0.25)"/>
            <rect x="30" y="56" width="80" height="6" rx="3" fill="rgba(255,255,255,0.15)"/>
            <rect x="30" y="68" width="90" height="6" rx="3" fill="rgba(255,255,255,0.1)"/>
            <rect x="100" y="90" width="60" height="14" rx="7" fill="#4C6EF5" opacity="0.7"/>
            <rect x="20" y="125" width="60" height="42" rx="10" fill="rgba(76,110,245,0.3)"/>
            <rect x="90" y="130" width="50" height="34" rx="10" fill="rgba(42,157,92,0.25)"/>
            <rect x="150" y="118" width="55" height="46" rx="10" fill="rgba(212,134,26,0.2)"/>
          </svg>
          <div style={{position:'relative',zIndex:1}}>
            <div className="fin-feature-title">Meta Anual de Receita</div>
            <div className="fin-feature-desc">Você está em <strong>{Math.round((soma(RECEITA.slice(0,6))/4600)*100)}%</strong> da sua meta anual. Continue assim!</div>
            <div style={{marginTop:'14px',height:'8px',background:'rgba(0,0,0,0.08)',borderRadius:'4px',overflow:'hidden'}}>
              <div style={{height:'100%',width:`${Math.round((soma(RECEITA.slice(0,6))/4600)*100)}%`,background:'linear-gradient(90deg,#4C6EF5,#2A9D5C)',borderRadius:'4px'}}/>
            </div>
          </div>
          <button className="fin-feature-btn">Ver Relatório →</button>
        </div>

        {/* Transfers */}
        <div className="fin-box">
          <div className="fin-box-title" style={{marginBottom:'14px'}}>Suas Transferências</div>
          {TRANSACOES.slice(0,4).map((t,i)=>(
            <div key={i} className="fin-transfer-item">
              <div className="fin-transfer-icon" style={{background:t.bg}}>{t.icone}</div>
              <div style={{flex:1,minWidth:0}}>
                <div className="fin-transfer-name" style={{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{t.desc.split('—')[0].trim()}</div>
                <div className="fin-transfer-date">Hoje, {t.hora}</div>
              </div>
              <div className={`fin-transfer-amt ${t.valor>=0?'pos':'neg'}`}>{fmtTx(t.valor)}</div>
            </div>
          ))}
        </div>

        {/* Safety */}
        <div className="fin-box fin-safety">
          <div className="fin-safety-icon">🔒</div>
          <div className="fin-safety-title">Backup em dia!</div>
          <div className="fin-safety-desc">Último backup financeiro realizado hoje às 02:00. Todos os dados protegidos.</div>
          <button className="fin-safety-btn">Atualizar Segurança</button>
        </div>
      </div>
    </>
  );
}

// ================================================================
// OTHER VIEWS
// ================================================================
function FluxoView(){
  const [anim,setAnim]=useState(false);
  useEffect(()=>{ const t=setTimeout(()=>setAnim(true),200); return()=>clearTimeout(t); },[]);
  const maxV=Math.max(...RECEITA,...DESPESAS)*1.05;
  const W_total=MONTHS.length*70,H=130;
  const saldoAcum=RECEITA.reduce((acc,r,i)=>{ acc.push((acc[i-1]||0)+(r-DESPESAS[i])); return acc; },[]);
  return(
    <div className="fin-view-wrap">
      <div style={{display:'flex',gap:'14px',marginBottom:'20px'}}>
        {[{l:'Total Entradas',v:soma(RECEITA)*1000,c:'var(--ok)'},{l:'Total Saídas',v:soma(DESPESAS)*1000,c:'var(--crit)'},{l:'Saldo Final',v:(soma(RECEITA)-soma(DESPESAS))*1000,c:'var(--accent)'}].map((m,i)=>(
          <div key={i} className="stat-card" style={{flex:1}}><div className="stat-label">{m.l}</div><div className="stat-value" style={{color:m.c,fontSize:'20px'}}>{fmtK(m.v)}</div></div>
        ))}
      </div>
      <div className="chart-box" style={{marginBottom:'20px'}}>
        <div className="chart-head"><div><div className="chart-title">Fluxo Mensal</div><div className="chart-sub">Entradas e Saídas · 2026 · R$ mil</div></div>
          <div style={{display:'flex',gap:'12px'}}>
            <span style={{fontSize:'11px',display:'flex',alignItems:'center',gap:'5px',color:'var(--text-2)'}}><span style={{width:7,height:7,borderRadius:'50%',background:'var(--ok)',display:'inline-block'}}/> Entradas</span>
            <span style={{fontSize:'11px',display:'flex',alignItems:'center',gap:'5px',color:'var(--text-2)'}}><span style={{width:7,height:7,borderRadius:'50%',background:'var(--crit)',display:'inline-block'}}/> Saídas</span>
          </div>
        </div>
        <div style={{overflowX:'auto'}}>
          <svg viewBox={`0 0 ${W_total} ${H+28}`} style={{width:'100%',minWidth:'400px',height:'auto',display:'block'}}>
            {[0.33,0.66,1].map(f=><line key={f} x1="0" y1={H*(1-f)} x2={W_total} y2={H*(1-f)} stroke="rgba(0,0,0,0.06)" strokeWidth="1"/>)}
            {MONTHS.map((m,i)=>{ const gx=i*70+5,bw=24,gap=4,hR=anim?(RECEITA[i]/maxV)*H:0,hD=anim?(DESPESAS[i]/maxV)*H:0; return(<g key={m}><rect x={gx} y={H-hR} width={bw} height={hR} fill="var(--ok)" rx="2" style={{transition:`height 0.7s ease ${i*.05}s,y 0.7s ease ${i*.05}s`}}/><rect x={gx+bw+gap} y={H-hD} width={bw} height={hD} fill="var(--crit)" rx="2" style={{transition:`height 0.7s ease ${i*.05}s,y 0.7s ease ${i*.05}s`}} opacity="0.75"/><text x={gx+bw} y={H+16} textAnchor="middle" fontSize="10" fill="#B0A498" fontFamily="var(--mono)">{m}</text></g>); })}
          </svg>
        </div>
      </div>
      <div className="table-box">
        <div className="table-head"><div className="table-title">Saldo Acumulado Mensal</div></div>
        <table className="data-table">
          <thead><tr><th>Mês</th><th>Entradas</th><th>Saídas</th><th>Resultado</th><th>Saldo Acumulado</th></tr></thead>
          <tbody>{MONTHS.map((m,i)=>{ const res=(RECEITA[i]-DESPESAS[i])*1000; return(<tr key={m}><td className="td-main td-mono">{m}/26</td><td className="td-pos">R$ {RECEITA[i]}K</td><td className="td-neg">-R$ {DESPESAS[i]}K</td><td className={res>=0?'td-pos':'td-neg'}>{res>=0?'+':''}{fmtK(Math.abs(res))}</td><td style={{fontFamily:'var(--mono)',color:'var(--accent)',fontWeight:600}}>R$ {saldoAcum[i]}K</td></tr>); })}</tbody>
        </table>
      </div>
    </div>
  );
}

function DREView(){
  const rec=3900000,imp=390000,csv=576000,depPes=1704000,forn=1056000,infra=648000,mkt=372000,out=216000,dep=120000,finRes=-45000,ir=147146;
  const rl=rec-imp,lb=rl-csv,ebitda=lb-(depPes+forn+infra+mkt+out),ebit=ebitda-dep,ebt=ebit+finRes,ll=ebt-ir;
  const dre=[
    {label:'Receita Operacional Bruta',        v:rec,    indent:0,bold:false,sep:false},
    {label:'(-) Deduções e Impostos (10%)',    v:-imp,   indent:1,bold:false,sep:false},
    {label:'(=) Receita Operacional Líquida',  v:rl,     indent:0,bold:true, sep:true },
    {label:'(-) Custo dos Serviços (CSV)',      v:-csv,   indent:1,bold:false,sep:false},
    {label:'(=) Lucro Bruto',                   v:lb,     indent:0,bold:true, sep:true },
    {label:'Desp. de Pessoal',                  v:-depPes,indent:1,bold:false,sep:false},
    {label:'Fornecedores e Serviços',           v:-forn,  indent:1,bold:false,sep:false},
    {label:'Infraestrutura e TI',               v:-infra, indent:1,bold:false,sep:false},
    {label:'Marketing',                         v:-mkt,   indent:1,bold:false,sep:false},
    {label:'Outras Despesas',                   v:-out,   indent:1,bold:false,sep:false},
    {label:'(=) EBITDA',                         v:ebitda, indent:0,bold:true, sep:true },
    {label:'(-) Depreciação e Amortização',     v:-dep,   indent:1,bold:false,sep:false},
    {label:'(=) EBIT',                           v:ebit,   indent:0,bold:true, sep:true },
    {label:'(+/-) Resultado Financeiro Líq.',   v:finRes, indent:1,bold:false,sep:false},
    {label:'(=) EBT',                            v:ebt,    indent:0,bold:true, sep:true },
    {label:'(-) IR e CSLL (34%)',                v:-ir,    indent:1,bold:false,sep:false},
    {label:'(=) Lucro Líquido do Exercício',     v:ll,     indent:0,bold:true, sep:true },
  ];
  return(
    <div className="fin-view-wrap">
      <div style={{display:'flex',gap:'14px',marginBottom:'20px'}}>
        {[{l:'Receita',v:fmtK(rec),c:'var(--ok)'},{l:'Lucro Bruto',v:fmtK(lb),c:'var(--accent)'},{l:'EBITDA',v:fmtK(ebitda),c:'var(--warn)'},{l:'Lucro Líquido',v:fmtK(ll),c:'var(--ok)'}].map((m,i)=>(
          <div key={i} className="stat-card" style={{flex:1}}><div className="stat-label">{m.l}</div><div className="stat-value" style={{color:m.c,fontSize:'20px'}}>{m.v}</div></div>
        ))}
      </div>
      <div className="table-box">
        <div className="table-head"><div className="table-title">Demonstração do Resultado — 2026</div><span className="badge badge-accent">Regime de Competência</span></div>
        <table className="data-table">
          <thead><tr><th style={{width:'60%'}}>Conta</th><th>Valor (R$)</th><th>% Receita</th></tr></thead>
          <tbody>{dre.map((r,i)=>(<tr key={i} style={{background:r.sep?'var(--surface-2)':''}}><td style={{paddingLeft:r.indent?'36px':'16px',color:r.bold?'var(--text)':'var(--text-2)',fontWeight:r.bold?700:400}}>{r.label}</td><td className={`td-mono ${r.v>=0?'td-pos':'td-neg'}`}>{r.v>=0?'+':''}{fmtR(Math.abs(r.v))}</td><td className="td-muted td-mono">{Math.abs((r.v/rec)*100).toFixed(1)}%</td></tr>))}</tbody>
        </table>
      </div>
    </div>
  );
}

function APagarView(){
  const total=APAGAR.reduce((s,p)=>s+p.valor,0);
  const venc=APAGAR.filter(p=>p.status!=='ok').reduce((s,p)=>s+p.valor,0);
  return(
    <div className="fin-view-wrap">
      <div style={{display:'flex',gap:'14px',marginBottom:'20px'}}>
        {[{l:'Total a Pagar',v:fmtK(total),c:'var(--crit)',d:`${APAGAR.length} lançamentos`},{l:'Vencendo em Breve',v:fmtK(venc),c:'var(--warn)',d:'Próximos 5 dias'},{l:'Em Dia',v:fmtK(total-venc),c:'var(--ok)',d:`${APAGAR.filter(p=>p.status==='ok').length} lançamentos`}].map((m,i)=>(
          <div key={i} className="stat-card" style={{flex:1}}><div className="stat-label">{m.l}</div><div className="stat-value" style={{color:m.c,fontSize:'20px'}}>{m.v}</div><div className="stat-delta neutral">{m.d}</div></div>
        ))}
      </div>
      <div className="table-box">
        <div className="table-head"><div className="table-title">Contas a Pagar — Jun 2026</div><span className="badge badge-crit">{APAGAR.filter(p=>p.status!=='ok').length} urgentes</span></div>
        <table className="data-table">
          <thead><tr><th>Vencimento</th><th>Descrição</th><th>Categoria</th><th>Valor</th><th>Status</th></tr></thead>
          <tbody>{APAGAR.map((p,i)=>(<tr key={i}><td className="td-mono">{p.venc}</td><td className="td-main">{p.desc}</td><td className="td-muted">{p.cat}</td><td className="td-neg">-{fmtR(p.valor)}</td><td><span className={`badge badge-${p.status}`}>{p.status==='ok'?'Programado':p.status==='warn'?'Vence em breve':'Urgente'}</span></td></tr>))}</tbody>
        </table>
      </div>
    </div>
  );
}

function AReceberView(){
  const total=ARECEBER.reduce((s,r)=>s+r.valor,0);
  const atrasado=ARECEBER.filter(r=>r.status!=='ok').reduce((s,r)=>s+r.valor,0);
  return(
    <div className="fin-view-wrap">
      <div style={{display:'flex',gap:'14px',marginBottom:'20px'}}>
        {[{l:'Total a Receber',v:fmtK(total),c:'var(--ok)',d:`${ARECEBER.length} clientes`},{l:'Em Atraso',v:fmtK(atrasado),c:'var(--crit)',d:`${ARECEBER.filter(r=>r.status!=='ok').length} cliente(s)`},{l:'Confirmado',v:fmtK(total-atrasado),c:'var(--accent)',d:'Prazo normal'}].map((m,i)=>(
          <div key={i} className="stat-card" style={{flex:1}}><div className="stat-label">{m.l}</div><div className="stat-value" style={{color:m.c,fontSize:'20px'}}>{m.v}</div><div className="stat-delta neutral">{m.d}</div></div>
        ))}
      </div>
      <div className="table-box">
        <div className="table-head"><div className="table-title">Contas a Receber — Jun 2026</div></div>
        <table className="data-table">
          <thead><tr><th>Vencimento</th><th>Cliente</th><th>Descrição</th><th>Valor</th><th>Status</th></tr></thead>
          <tbody>{ARECEBER.map((r,i)=>(<tr key={i}><td className="td-mono">{r.venc}</td><td className="td-main">{r.cliente}</td><td className="td-muted">{r.desc}</td><td className="td-pos">+{fmtR(r.valor)}</td><td><span className={`badge badge-${r.status}`}>{r.status==='ok'?'No prazo':'Em atraso'}</span></td></tr>))}</tbody>
        </table>
      </div>
    </div>
  );
}

function ConciliacaoView(){
  return(
    <div className="fin-view-wrap">
      <div style={{display:'flex',gap:'14px',marginBottom:'20px'}}>
        {[{l:'Lançamentos',v:CONCILIACAO.length,c:'var(--accent)'},{l:'Conciliados',v:CONCILIACAO.filter(c=>c.ok).length,c:'var(--ok)'},{l:'Divergências',v:CONCILIACAO.filter(c=>!c.ok).length,c:'var(--crit)'}].map((m,i)=>(
          <div key={i} className="stat-card" style={{flex:1}}><div className="stat-label">{m.l}</div><div className="stat-value" style={{color:m.c,fontSize:'24px'}}>{m.v}</div></div>
        ))}
      </div>
      <div className="table-box">
        <div className="table-head"><div className="table-title">Conciliação Bancária — Jun 2026</div><span className="badge badge-crit">{CONCILIACAO.filter(c=>!c.ok).length} divergência(s)</span></div>
        <table className="data-table">
          <thead><tr><th>Data</th><th>Descrição</th><th>Banco</th><th>Sistema</th><th>Divergência</th><th>Status</th></tr></thead>
          <tbody>{CONCILIACAO.map((c,i)=>{
            const div=c.ok?0:(c.banco-(c.sistema||0));
            return(<tr key={i}><td className="td-mono">{c.data}</td><td className="td-main">{c.desc}</td><td className={`td-mono ${c.banco>=0?'td-pos':'td-neg'}`}>{fmtTx(c.banco)}</td><td className={`td-mono ${c.sistema>=0?'td-pos':'td-neg'}`}>{c.sistema!==null?fmtTx(c.sistema):'—'}</td><td className={`td-mono ${c.ok?'td-pos':'td-neg'}`}>{c.ok?'—':fmtTx(div)}</td><td><span className={`badge badge-${c.ok?'ok':'crit'}`}>{c.ok?'OK':'Divergente'}</span></td></tr>);
          })}</tbody>
        </table>
      </div>
    </div>
  );
}

function MensalView(){
  const [anim,setAnim]=useState(false);
  useEffect(()=>{ const t=setTimeout(()=>setAnim(true),200); return()=>clearTimeout(t); },[]);
  return(
    <div className="fin-view-wrap">
      <div style={{display:'flex',gap:'14px',marginBottom:'20px',flexWrap:'wrap'}}>
        {[{l:'Receita Jun',v:'R$ 298K',c:'var(--ok)'},{l:'Despesas Jun',v:'R$ 205K',c:'var(--crit)'},{l:'Lucro Jun',v:'R$ 93K',c:'var(--accent)'},{l:'Margem Jun',v:'31%',c:'var(--warn)'}].map((m,i)=>(
          <div key={i} className="stat-card" style={{flex:'1 1 130px'}}><div className="stat-label">{m.l}</div><div className="stat-value" style={{color:m.c,fontSize:'22px'}}>{m.v}</div></div>
        ))}
      </div>
      <div className="chart-row chart-1-1" style={{marginBottom:'16px'}}>
        <div className="chart-box">
          <div className="chart-head"><div><div className="chart-title">Receita vs Despesas</div><div className="chart-sub">Anual 2026 · R$ mil</div></div></div>
          <LineChart/>
        </div>
        <div className="chart-box">
          <div className="chart-head"><div><div className="chart-title">Despesas por Categoria</div><div className="chart-sub">Acumulado 2026 · R$ mil</div></div></div>
          {CATEGORIAS.map(c=><HBar key={c.label} label={c.label} v={c.v} max={142} color={c.color} anim={anim}/>)}
        </div>
      </div>
    </div>
  );
}

function AnualView(){
  const anos=['2023','2024','2025','2026'];
  const recAnual=[1840,2640,3300,3900];
  const desAnual=[1520,2100,2580,2960];
  return(
    <div className="fin-view-wrap">
      <div style={{display:'flex',gap:'14px',marginBottom:'20px'}}>
        {[{l:'Receita 2026',v:'R$ 3.9M',d:'↑ 18% vs 2025',c:'var(--ok)'},{l:'Despesas 2026',v:'R$ 2.9M',d:'↑ 12% vs 2025',c:'var(--crit)'},{l:'Lucro 2026',v:'R$ 1.0M',d:'↑ 32% vs 2025',c:'var(--accent)'},{l:'Margem 2026',v:'25.5%',d:'↑ 4.2pp vs 2025',c:'var(--warn)'}].map((m,i)=>(
          <div key={i} className="stat-card" style={{flex:1}}><div className="stat-label">{m.l}</div><div className="stat-value" style={{color:m.c,fontSize:'20px'}}>{m.v}</div><div className="stat-delta up">{m.d}</div></div>
        ))}
      </div>
      <div className="table-box">
        <div className="table-head"><div className="table-title">Comparativo Anual</div></div>
        <table className="data-table">
          <thead><tr><th>Ano</th><th>Receita</th><th>Despesas</th><th>Lucro</th><th>Margem</th><th>Crescimento</th></tr></thead>
          <tbody>{anos.map((a,i)=>{ const rec=recAnual[i]*1000,des=desAnual[i]*1000,luc=rec-des,mg=((luc/rec)*100).toFixed(1),cresc=i===0?'—':`↑ ${(((recAnual[i]-recAnual[i-1])/recAnual[i-1])*100).toFixed(0)}%`; return(<tr key={a}><td className="td-main td-mono">{a}</td><td className="td-pos">R$ {(rec/1e6).toFixed(1)}M</td><td className="td-neg">R$ {(des/1e6).toFixed(1)}M</td><td style={{color:'var(--ok)',fontFamily:'var(--mono)',fontWeight:600}}>R$ {(luc/1e3).toFixed(0)}K</td><td className="td-mono">{mg}%</td><td style={{color:i===0?'var(--text-3)':'var(--ok)',fontWeight:600}}>{cresc}</td></tr>); })}</tbody>
        </table>
      </div>
    </div>
  );
}

function ExportarView(){
  const [done,setDone]=useState(null);
  const go=f=>{ setDone(null); setTimeout(()=>setDone(f),1000); };
  return(
    <div className="fin-view-wrap" style={{maxWidth:'520px'}}>
      <div style={{marginBottom:'20px'}}><h3 style={{fontSize:'15px',fontWeight:700,color:'var(--text)'}}>Exportar Dados Financeiros</h3><p style={{fontSize:'13px',color:'var(--text-2)',marginTop:'4px'}}>Escolha o formato e o período.</p></div>
      {done&&<div className="auth-msg-ok" style={{marginBottom:'14px',padding:'12px 16px',borderRadius:'10px'}}>✓ {done} gerado com sucesso!</div>}
      {[{fmt:'PDF',icon:'📄',label:'Relatório PDF',desc:'Documento formatado para impressão e apresentação.'},{fmt:'Excel',icon:'📊',label:'Planilha Excel',desc:'Todos os dados em formato editável para análise.'},{fmt:'CSV',icon:'📋',label:'Arquivo CSV',desc:'Formato universal para importar em qualquer sistema.'},{fmt:'JSON',icon:'⚙️',label:'Exportação JSON',desc:'Dados estruturados para integração com APIs.'}].map((f,i)=>(
        <div key={i} className="chart-box" style={{marginBottom:'10px',display:'flex',alignItems:'center',gap:'14px',padding:'14px 18px'}}>
          <span style={{fontSize:'22px'}}>{f.icon}</span>
          <div style={{flex:1}}><div style={{fontWeight:600,color:'var(--text)',fontSize:'13.5px'}}>{f.label}</div><div style={{fontSize:'12px',color:'var(--text-2)',marginTop:'2px'}}>{f.desc}</div></div>
          <button className="btn btn-ghost btn-sm" onClick={()=>go(f.fmt)}>Exportar</button>
        </div>
      ))}
    </div>
  );
}

function ConfigView(){
  const [saved,setSaved]=useState(false);
  const [form,setForm]=useState({empresa:'Lynus Tech Ltda',cnpj:'12.345.678/0001-90',moeda:'BRL',exercicio:'2026',email:'financeiro@lynus.tech',notif:true});
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  return(
    <div className="fin-view-wrap" style={{maxWidth:'520px'}}>
      <div style={{marginBottom:'20px'}}><h3 style={{fontSize:'15px',fontWeight:700,color:'var(--text)'}}>Configurações do Sistema</h3></div>
      {saved&&<div className="auth-msg-ok" style={{marginBottom:'14px',padding:'12px 16px',borderRadius:'10px'}}>✓ Configurações salvas com sucesso.</div>}
      <div className="chart-box" style={{display:'flex',flexDirection:'column',gap:'16px'}}>
        {[{l:'Razão Social',k:'empresa'},{l:'CNPJ',k:'cnpj'},{l:'Moeda Padrão',k:'moeda'},{l:'Exercício Fiscal',k:'exercicio'},{l:'E-mail de Notificações',k:'email'}].map(f=>(
          <div key={f.k}>
            <label style={{fontSize:'12.5px',fontWeight:500,color:'var(--text-2)',display:'block',marginBottom:'5px'}}>{f.l}</label>
            <input type="text" value={form[f.k]} onChange={e=>set(f.k,e.target.value)} style={{width:'100%',padding:'10px 13px',background:'var(--surface-2)',border:'1px solid var(--border-strong)',borderRadius:'9px',color:'var(--text)',fontFamily:'var(--font)',fontSize:'13.5px',outline:'none'}}/>
          </div>
        ))}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div><div style={{fontSize:'13px',fontWeight:500,color:'var(--text)'}}>Notificações por e-mail</div><div style={{fontSize:'12px',color:'var(--text-2)'}}>Receber alertas de vencimentos</div></div>
          <button onClick={()=>set('notif',!form.notif)} style={{width:'44px',height:'24px',borderRadius:'12px',background:form.notif?'var(--ok)':'rgba(0,0,0,0.12)',border:'none',cursor:'pointer',position:'relative',transition:'background 0.2s',flexShrink:0}}>
            <span style={{width:'18px',height:'18px',borderRadius:'50%',background:'#fff',position:'absolute',top:'3px',left:form.notif?'23px':'3px',transition:'left 0.2s',display:'block'}}/>
          </button>
        </div>
        <button className="btn btn-primary" style={{width:'100%',padding:'12px'}} onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),3000);}}>Salvar Configurações</button>
      </div>
    </div>
  );
}

// ================================================================
// NAVIGATION GROUPS (for secondary views)
// ================================================================
const NAV_ITEMS=[
  {id:'painel',     title:'Painel',          Icon:IcoDash  },
  {id:'fluxo',      title:'Fluxo de Caixa',  Icon:IcoBars  },
  {id:'dre',        title:'DRE',             Icon:IcoDoc   },
  {id:'apagar',     title:'A Pagar',         Icon:IcoUp    },
  {id:'areceber',   title:'A Receber',       Icon:IcoDown  },
  {id:'conciliacao',title:'Conciliação',     Icon:IcoBank  },
  {id:'mensal',     title:'Mensal',          Icon:IcoCal   },
  {id:'anual',      title:'Anual',           Icon:IcoTrend },
  {id:'exportar',   title:'Exportar',        Icon:IcoExport},
  {id:'config',     title:'Configurações',   Icon:IcoGear  },
];
const VIEW_TITLE={painel:'Painel',fluxo:'Fluxo de Caixa',dre:'DRE',apagar:'Contas a Pagar',areceber:'Contas a Receber',conciliacao:'Conciliação Bancária',mensal:'Relatório Mensal',anual:'Relatório Anual',exportar:'Exportar',config:'Configurações'};

// ================================================================
// APP
// ================================================================
function App(){
  const [view,setView]=useState('painel');
  const views={
    painel:<PainelView/>, fluxo:<FluxoView/>, dre:<DREView/>,
    apagar:<APagarView/>, areceber:<AReceberView/>, conciliacao:<ConciliacaoView/>,
    mensal:<MensalView/>, anual:<AnualView/>, exportar:<ExportarView/>, config:<ConfigView/>
  };
  return(
    <div className="fin-layout">

      {/* SIDEBAR WITH LABELS */}
      <aside className="fin-sidebar">
        {/* Logo animado */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',padding:'0 12px 0 8px',marginBottom:'16px'}}>
          <LogoMark/>
        </div>

        {/* Nav with labels */}
        <nav className="fin-sidebar-nav">
          {NAV_ITEMS.slice(0,6).map(it=>(
            <button key={it.id} className={`fin-nav-btn${view===it.id?' active':''}`} onClick={()=>setView(it.id)}>
              <it.Icon/>{it.title}
            </button>
          ))}
          <div className="fin-sidebar-sep"/>
          {NAV_ITEMS.slice(6).map(it=>(
            <button key={it.id} className={`fin-nav-btn${view===it.id?' active':''}`} onClick={()=>setView(it.id)}>
              <it.Icon/>{it.title}
            </button>
          ))}
        </nav>

        {/* Bottom: back + user */}
        <div className="fin-sidebar-bottom">
          <div className="fin-sidebar-sep"/>
          <button className="fin-nav-btn" onClick={()=>window.location.href='index.html'}>
            <IcoBack/>Voltar ao site
          </button>
          <div className="fin-sidebar-user">
            <div className="fin-avatar-sm">AD</div>
            <div className="fin-sidebar-user-name">Admin</div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div className="fin-main">
        {view !== 'painel' && (
          <div className="fin-topbar">
            <div>
              <div className="fin-topbar-title">{VIEW_TITLE[view]}</div>
              <div className="fin-topbar-sub">Sistema Financeiro · Jun 2026</div>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
              <button className="fin-icon-btn">🔔</button>
              <div className="fin-avatar-sm" style={{width:36,height:36,fontSize:13}}>AD</div>
            </div>
          </div>
        )}
        {view === 'painel'
          ? <div className="fin-content">{views[view]}</div>
          : views[view]
        }
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
