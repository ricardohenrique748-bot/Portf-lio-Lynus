/* ============================================================
   LYNUS TECH — Sistema de Compras
   ============================================================ */
const { useState, useEffect } = React;

// ---- Data ----
const MESES = ['Jan','Fev','Mar','Abr','Mai','Jun'];
const GASTO_MES  = [42, 58, 51, 74, 63, 89];
const PEDIDOS_MES= [12, 18, 14, 22, 19, 27];

const PEDIDOS = [
  {id:'PO-0091',fornecedor:'TechSupply Ltda',    item:'Servidor Dell PowerEdge',   cat:'TI',            valor:48500,data:'12/06',status:'aprovado', prazo:'18/06'},
  {id:'PO-0090',fornecedor:'Office Pro S.A.',    item:'Mobiliário Escritório',      cat:'Infraestrutura',valor:18200,data:'11/06',status:'pendente', prazo:'20/06'},
  {id:'PO-0089',fornecedor:'Nuvora Corp',        item:'Licenças Microsoft 365',     cat:'Software',      valor:12400,data:'10/06',status:'aprovado', prazo:'15/06'},
  {id:'PO-0088',fornecedor:'LogiStore Ltda',     item:'Material de Escritório',     cat:'Suprimentos',   valor: 3200,data:'09/06',status:'recebido', prazo:'12/06'},
  {id:'PO-0087',fornecedor:'CloudNet S.A.',      item:'Serviço de Conectividade',   cat:'TI',            valor: 8900,data:'08/06',status:'recebido', prazo:'10/06'},
  {id:'PO-0086',fornecedor:'Helio Equipamentos', item:'Nobreak APC 1500VA',         cat:'Infraestrutura',valor: 6800,data:'07/06',status:'cancelado',prazo:'14/06'},
];
const FORNECEDORES = [
  {nome:'TechSupply Ltda',    cnpj:'12.345.678/0001-90',cat:'TI',            avaliacao:4.8,status:'ativo',  pedidos:14,volume:124000},
  {nome:'Office Pro S.A.',    cnpj:'23.456.789/0001-11',cat:'Infraestrutura',avaliacao:4.5,status:'ativo',  pedidos:8, volume:68400},
  {nome:'Nuvora Corp',        cnpj:'34.567.890/0001-22',cat:'Software',      avaliacao:4.9,status:'ativo',  pedidos:22,volume:198000},
  {nome:'LogiStore Ltda',     cnpj:'45.678.901/0001-33',cat:'Suprimentos',   avaliacao:4.2,status:'ativo',  pedidos:31,volume:42600},
  {nome:'CloudNet S.A.',      cnpj:'56.789.012/0001-44',cat:'TI',            avaliacao:4.6,status:'ativo',  pedidos:6, volume:53400},
  {nome:'Helio Equipamentos', cnpj:'67.890.123/0001-55',cat:'Infraestrutura',avaliacao:3.8,status:'inativo',pedidos:4, volume:27200},
];
const REQUISICOES = [
  {id:'REQ-0214',depto:'TI',          item:'Switch Cisco 24 portas',  qtd:2, urgencia:'Alta',  status:'aprovada', solicitante:'Carlos M.'},
  {id:'REQ-0213',depto:'RH',          item:'Cadeiras Ergonômicas',     qtd:10,urgencia:'Média', status:'pendente', solicitante:'Ana S.'},
  {id:'REQ-0212',depto:'Marketing',   item:'Câmera Sony A7III',        qtd:1, urgencia:'Baixa', status:'pendente', solicitante:'Lucas T.'},
  {id:'REQ-0211',depto:'Financeiro',  item:'Scanner Documentos',       qtd:2, urgencia:'Média', status:'aprovada', solicitante:'Maria L.'},
  {id:'REQ-0210',depto:'TI',          item:'HD Externo 4TB',           qtd:5, urgencia:'Alta',  status:'rejeitada',solicitante:'Pedro R.'},
  {id:'REQ-0209',depto:'Operacional', item:'EPI — Kit Segurança',      qtd:20,urgencia:'Alta',  status:'aprovada', solicitante:'João F.'},
];
const APROVACOES = [
  {id:'PO-0090', item:'Mobiliário Escritório',  valor:18200,solicitante:'Ana S.',  depto:'RH',        data:'11/06'},
  {id:'REQ-0213',item:'Cadeiras Ergonômicas',   valor: 8500,solicitante:'Ana S.',  depto:'RH',        data:'11/06'},
  {id:'REQ-0212',item:'Câmera Sony A7III',      valor: 6200,solicitante:'Lucas T.',depto:'Marketing', data:'10/06'},
];
const ORCAMENTO_CATS = [
  {cat:'TI',             orcado:120000,gasto:89400,pct:74},
  {cat:'Software',       orcado: 80000,gasto:62100,pct:78},
  {cat:'Infraestrutura', orcado: 60000,gasto:51800,pct:86},
  {cat:'Suprimentos',    orcado: 30000,gasto:18400,pct:61},
  {cat:'RH / Benefícios',orcado: 50000,gasto:32000,pct:64},
  {cat:'Marketing',      orcado: 40000,gasto:28600,pct:72},
];

const fmtBRL = v => `R$ ${v.toLocaleString('pt-BR')}`;
const fmtK   = v => v>=1000?`R$ ${(v/1000).toFixed(0)}K`:`R$ ${v}`;

// ---- Icons ----
function IcoDash()  {return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1.5" fill="currentColor"/><rect x="9" y="1.5" width="5.5" height="5.5" rx="1.5" fill="currentColor" opacity=".5"/><rect x="1.5" y="9" width="5.5" height="5.5" rx="1.5" fill="currentColor" opacity=".5"/><rect x="9" y="9" width="5.5" height="5.5" rx="1.5" fill="currentColor" opacity=".5"/></svg>;}
function IcoPedido(){return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M2 8h8M2 12h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;}
function IcoForn()  {return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="2" y="6" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.7"/><path d="M5 6V4a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>;}
function IcoReq()   {return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M3 2h10a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.7"/><path d="M5 6h6M5 9h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;}
function IcoAprova(){return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.7"/><path d="M5.5 8.5l2 2 3-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>;}
function IcoOrcam() {return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M2 12l3-4 3 2.5 3-5 3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;}
function IcoRelat() {return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.7"/><path d="M5 9v2M8 6v5M11 8v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>;}
function IcoExport(){return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M8 2v8M5 5l3-3 3 3M3 11.5v1.5a1 1 0 001 1h8a1 1 0 001-1v-1.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>;}
function IcoConfig(){return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.7"/><path d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1.1 1.1M11.5 11.5l1.1 1.1M3.4 12.6l1.1-1.1M11.5 4.5l1.1-1.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;}
function IcoBack()  {return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;}
function IcoSearch(){return <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="5.5" cy="5.5" r="4" stroke="#9CA3AF" strokeWidth="1.5"/><path d="M8.5 8.5l3 3" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/></svg>;}
function IcoSort()  {return <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 4h9M3.5 6.5h6M5 9h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>;}
function IcoCal()   {return <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><rect x="1" y="2.5" width="12" height="10.5" rx="1.8" stroke="currentColor" strokeWidth="1.5"/><path d="M4.5 1v3M9.5 1v3M1 7h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>;}
function IcoStar()  {return <svg width="12" height="12" viewBox="0 0 12 12" fill="#E8572A"><path d="M6 1l1.4 2.9L10.5 4l-2.2 2.2.5 3.3L6 8l-2.8 1.5.5-3.3L1.5 4l3.1-.1z"/></svg>;}

// ---- Bar chart helpers ----
function PillBar({x,y,w,h,fill,rx=6}){
  if(h<=0) return null;
  const r=Math.min(rx,w/2,h/2);
  const d=`M ${x},${y+h} L ${x},${y+r} Q ${x},${y} ${x+r},${y} L ${x+w-r},${y} Q ${x+w},${y} ${x+w},${y+r} L ${x+w},${y+h} Z`;
  return <path d={d} fill={fill}/>;
}

function GastoChart({data,labels}){
  const [anim,setAnim]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setAnim(true),150);return()=>clearTimeout(t);},[]);
  const Y_MAX=100,BAR_W=34,GAP=18,Y_PAD=28,X_PAD=28,TOP_PAD=30,CHART_H=130;
  const maxIdx=data.indexOf(Math.max(...data));
  const totalW=Y_PAD+data.length*(BAR_W+GAP)-GAP+4;
  return(
    <svg viewBox={`0 0 ${totalW} ${TOP_PAD+CHART_H+X_PAD}`} style={{width:'100%',height:'auto',display:'block'}}>
      {[0,25,50,75,100].map(v=>{
        const yp=TOP_PAD+CHART_H-(v/Y_MAX)*CHART_H;
        return(<g key={v}>
          <text x={Y_PAD-8} y={yp+4} textAnchor="end" fontSize="9.5" fill="#9CA3AF" fontFamily="monospace">{v>0?`${v}k`:'0'}</text>
          <line x1={Y_PAD} y1={yp} x2={totalW} y2={yp} stroke="#F3F4F6" strokeWidth="1"/>
        </g>);
      })}
      {data.map((v,i)=>{
        const bx=Y_PAD+i*(BAR_W+GAP);
        const bh=anim?(v/Y_MAX)*CHART_H:0;
        const by=TOP_PAD+CHART_H-bh;
        const isHigh=i===maxIdx;
        return(<g key={i}>
          <PillBar x={bx} y={anim?by:TOP_PAD+CHART_H} w={BAR_W} h={anim?bh:0} fill={isHigh?'#E8572A':'#FFCAB5'} rx={7}/>
          {isHigh&&anim&&<g>
            <rect x={bx-4} y={by-24} width={BAR_W+8} height={19} rx={6} fill="#E8572A"/>
            <polygon points={`${bx+BAR_W/2-4},${by-5} ${bx+BAR_W/2+4},${by-5} ${bx+BAR_W/2},${by}`} fill="#E8572A"/>
            <text x={bx+BAR_W/2} y={by-11} textAnchor="middle" fontSize="10" fill="white" fontWeight="700">{v}k</text>
          </g>}
          <text x={bx+BAR_W/2} y={TOP_PAD+CHART_H+18} textAnchor="middle" fontSize="10" fill="#9CA3AF" fontFamily="monospace">{labels[i]}</text>
        </g>);
      })}
    </svg>
  );
}

function DualBarChart({dataA,dataB,labels,colorA='#E8572A',colorB='#6B7280'}){
  const [anim,setAnim]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setAnim(true),250);return()=>clearTimeout(t);},[]);
  const maxV=Math.max(...dataA,...dataB)*1.05;
  const BW=12,GAP_IN=4,GAP_G=14,CHART_H=110;
  const gW=BW*2+GAP_IN;
  const totalW=30+labels.length*(gW+GAP_G)-GAP_G+4;
  return(
    <svg viewBox={`0 0 ${totalW} ${CHART_H+26}`} style={{width:'100%',height:'auto',display:'block'}}>
      {[0.33,0.66,1].map(f=><line key={f} x1={30} y1={(1-f)*CHART_H} x2={totalW} y2={(1-f)*CHART_H} stroke="#F3F4F6" strokeWidth="1"/>)}
      {labels.map((lb,i)=>{
        const gx=30+i*(gW+GAP_G);
        const hA=anim?(dataA[i]/maxV)*CHART_H:0;
        const hB=anim?(dataB[i]/maxV)*CHART_H:0;
        return(<g key={i}>
          <PillBar x={gx}           y={CHART_H-hA} w={BW} h={hA} fill={colorA} rx={4}/>
          <PillBar x={gx+BW+GAP_IN} y={CHART_H-hB} w={BW} h={hB} fill={colorB} rx={4}/>
          <text x={gx+gW/2} y={CHART_H+16} textAnchor="middle" fontSize="9.5" fill="#9CA3AF" fontFamily="monospace">{lb}</text>
        </g>);
      })}
    </svg>
  );
}

// ---- Helpers ----
const statusBadge = s => {
  if(s==='aprovado'||s==='aprovada'||s==='ativo')     return 'cp-badge-green';
  if(s==='pendente')                                  return 'cp-badge-orange';
  if(s==='recebido')                                  return 'cp-badge-blue';
  if(s==='cancelado'||s==='rejeitada'||s==='inativo') return 'cp-badge-red';
  return 'cp-badge-gray';
};
const statusLabel = s => ({
  aprovado:'Aprovado',aprovada:'Aprovada',pendente:'Pendente',
  recebido:'Recebido',cancelado:'Cancelado',rejeitada:'Rejeitada',
  ativo:'Ativo',inativo:'Inativo'
}[s]||s);
const urgColor = u => u==='Alta'?'cp-badge-red':u==='Média'?'cp-badge-yellow':'cp-badge-gray';
const pdotColor = s => s==='aprovado'?'#16A34A':s==='pendente'?'#E8572A':s==='recebido'?'#4F46E5':'#9CA3AF';

// ================================================================
// VIEWS
// ================================================================

function DashboardView(){
  const [anim,setAnim]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setAnim(true),180);return()=>clearTimeout(t);},[]);

  const fornAtivos = FORNECEDORES.filter(f=>f.status==='ativo').length;
  const reqPend    = REQUISICOES.filter(r=>r.status==='pendente').length;

  const KPIS = [
    {
      bg:'#FFF4F0',
      icon:<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M3 6h16M3 11h11M3 16h13" stroke="#E8572A" strokeWidth="2" strokeLinecap="round"/></svg>,
      value: PEDIDOS.length, label:'Total Pedidos', badge:'+12%', variant:'orange',
    },
    {
      bg:'#EEF2FF',
      icon:<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="8" stroke="#4F46E5" strokeWidth="2"/><path d="M11 7v8M8.5 9.5c0-1.4 1.1-2.5 2.5-2.5s2.5 1.1 2.5 2.5-1.2 2-2.5 2-2.5 1.1-2.5 2.5 1.1 2.5 2.5 2.5 2.5-1.1 2.5-2.5" stroke="#4F46E5" strokeWidth="1.7" strokeLinecap="round"/></svg>,
      value:'R$ 89K', label:'Gasto no Mês', badge:'↑ 41%', variant:'red',
    },
    {
      bg:'#FFFBEB',
      icon:<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="8" stroke="#D97706" strokeWidth="2"/><path d="M11 7.5v5.5M11 15.5v.5" stroke="#D97706" strokeWidth="2" strokeLinecap="round"/></svg>,
      value: APROVACOES.length, label:'Aprovações Pend.', badge:'Ação nec.', variant:'yellow',
    },
    {
      bg:'#ECFDF5',
      icon:<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="3.5" y="9" width="15" height="10.5" rx="2" stroke="#16A34A" strokeWidth="2"/><path d="M7.5 9V7.5a3.5 3.5 0 017 0V9" stroke="#16A34A" strokeWidth="1.8" strokeLinecap="round"/></svg>,
      value: fornAtivos, label:'Fornecedores', badge:'Estável', variant:'green',
    },
    {
      bg:'#F5F3FF',
      icon:<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M4.5 3h13a1 1 0 011 1v14a1 1 0 01-1 1h-13a1 1 0 01-1-1V4a1 1 0 011-1z" stroke="#8B5CF6" strokeWidth="2"/><path d="M7 9h8M7 13h5" stroke="#8B5CF6" strokeWidth="1.7" strokeLinecap="round"/></svg>,
      value: reqPend, label:'Req. Pendentes', badge:`${REQUISICOES.length} total`, variant:'gray',
    },
  ];

  const statusGroups = [
    {label:'Aprovado', count:PEDIDOS.filter(p=>p.status==='aprovado').length, color:'#16A34A'},
    {label:'Recebido', count:PEDIDOS.filter(p=>p.status==='recebido').length, color:'#4F46E5'},
    {label:'Pendente', count:PEDIDOS.filter(p=>p.status==='pendente').length, color:'#E8572A'},
    {label:'Cancelado',count:PEDIDOS.filter(p=>p.status==='cancelado').length, color:'#9CA3AF'},
  ];

  const ACTIVITY = [
    0,1,2,1,0,3,2,1,2,0,1,3,2,1,0,
    1,2,0,3,2,1,0,2,1,3,2,0,1,2,1,
  ];

  return (<>
    {/* Greeting */}
    <div className="cp-greeting">
      <div>
        <div className="cp-greeting-sub">Bom dia,</div>
        <div className="cp-greeting-name">Ricardo Henrique</div>
      </div>
      <div className="cp-greeting-actions">
        <button className="cp-btn-date"><IcoCal/> Jun 2026 ▾</button>
        <button className="cp-export-btn"><IcoExport/> Exportar Dados</button>
      </div>
    </div>

    {/* KPIs */}
    <div className="cp-kpi-row">
      {KPIS.map((k,i)=>(
        <div key={i} className="cp-kpi-card">
          <div className="cp-kpi-icon" style={{background:k.bg}}>{k.icon}</div>
          <div className="cp-kpi-numrow">
            <div className="cp-kpi-value">{k.value}</div>
            <span className={`cp-badge cp-badge-${k.variant}`}>{k.badge}</span>
          </div>
          <div className="cp-kpi-label">{k.label}</div>
        </div>
      ))}
    </div>

    {/* Three columns */}
    <div className="cp-three-cols">

      {/* Pedidos Ativos */}
      <div className="cp-panel">
        <div className="cp-panel-hdr">
          <div>
            <div className="cp-panel-title">Pedidos Ativos</div>
            <div className="cp-panel-count">
              {PEDIDOS.filter(p=>p.status!=='cancelado').length}
              <span>Pedidos</span>
            </div>
          </div>
          <div style={{display:'flex',gap:'6px'}}>
            <button className="cp-arrow-btn">‹</button>
            <button className="cp-arrow-btn">›</button>
          </div>
        </div>
        <div className="cp-panel-list">
          {PEDIDOS.slice(0,5).map((p,i)=>(
            <div key={i} className="cp-panel-item">
              <div className="cp-item-dot" style={{background:pdotColor(p.status)}}/>
              <div style={{flex:1,overflow:'hidden'}}>
                <div className="cp-item-title">{p.item}</div>
                <div className="cp-item-sub">{p.fornecedor}</div>
              </div>
              <span className={`cp-badge ${statusBadge(p.status)}`}>{statusLabel(p.status)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Próximas Entregas */}
      <div className="cp-panel">
        <div className="cp-panel-hdr">
          <div>
            <div className="cp-panel-title">Próximas Entregas</div>
            <div className="cp-panel-count">
              {PEDIDOS.filter(p=>p.status==='aprovado').length}
              <span>Confirmadas</span>
            </div>
          </div>
        </div>
        <div className="cp-panel-list">
          {PEDIDOS.filter(p=>p.status==='aprovado'||p.status==='pendente').slice(0,5).map((p,i)=>(
            <div key={i} className="cp-panel-item">
              <div className="cp-item-avatar">{p.fornecedor.charAt(0)}</div>
              <div style={{flex:1,overflow:'hidden'}}>
                <div className="cp-item-title">{p.item}</div>
                <div className="cp-item-sub">{p.fornecedor} · {p.cat}</div>
              </div>
              <div className="cp-date-chip">{p.prazo}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Status de Compras */}
      <div className="cp-panel">
        <div className="cp-panel-title" style={{marginBottom:4}}>Status de Compras</div>
        <div className="cp-panel-count">{PEDIDOS.length}<span>Total</span></div>
        <div className="cp-status-bar">
          {statusGroups.map((s,i,arr)=>(
            <div key={i} style={{
              flex: s.count||0.2,
              background: s.color,
              height: '100%',
              borderRadius: i===0?'5px 0 0 5px':i===arr.length-1?'0 5px 5px 0':'0',
            }}/>
          ))}
        </div>
        <div className="cp-status-legend">
          {statusGroups.map((s,i)=>(
            <div key={i} className="cp-legend-row">
              <div className="cp-legend-dot" style={{background:s.color}}/>
              <span className="cp-legend-label">{s.label}</span>
              <span className="cp-legend-count">{s.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Bottom 2-col */}
    <div className="cp-two-cols">
      {/* Economia */}
      <div className="cp-panel">
        <div className="cp-panel-title" style={{marginBottom:10}}>Economia Negociada</div>
        <div style={{display:'flex',alignItems:'flex-end',gap:'8px',marginBottom:14}}>
          <span style={{fontSize:'38px',fontWeight:800,color:'var(--cp-green)',lineHeight:1,letterSpacing:'-0.03em'}}>
            R$ 12K
          </span>
          <span style={{fontSize:'14px',color:'var(--cp-text-2)',paddingBottom:'4px'}}>/&nbsp;mês</span>
        </div>
        <div style={{height:'8px',background:'#F3F4F6',borderRadius:'4px',overflow:'hidden',marginBottom:8}}>
          <div style={{
            height:'100%',
            width: anim?'74%':'0%',
            background:'var(--cp-green)',
            borderRadius:'4px',
            transition:'width 1.1s cubic-bezier(.4,0,.2,1)',
          }}/>
        </div>
        <div style={{fontSize:'12px',color:'var(--cp-text-3)'}}>74% da meta mensal (R$ 16K)</div>
      </div>

      {/* Atividade */}
      <div className="cp-panel">
        <div className="cp-panel-title" style={{marginBottom:14}}>Atividade de Pedidos — Últimos 6 meses</div>
        <div className="cp-activity-grid">
          {ACTIVITY.map((lvl,i)=>(
            <div key={i} className={`cp-activity-dot cp-activity-${lvl}`}/>
          ))}
        </div>
        <div style={{display:'flex',justifyContent:'space-between',marginTop:10,fontSize:'11px',color:'var(--cp-text-3)',fontFamily:'var(--cp-mono)'}}>
          {MESES.map(m=><span key={m}>{m}</span>)}
        </div>
      </div>
    </div>
  </>);
}

function PedidosView(){
  const [filtro,setFiltro]=useState('todos');
  const filtered=filtro==='todos'?PEDIDOS:PEDIDOS.filter(p=>p.status===filtro);
  return(
    <div className="cp-view-wrap">
      <div className="cp-filter-tabs">
        {['todos','aprovado','pendente','recebido','cancelado'].map(f=>(
          <button key={f} className={`cp-filter-tab${filtro===f?' active':''}`} onClick={()=>setFiltro(f)}>
            {f==='todos'?'Todos':statusLabel(f)}
          </button>
        ))}
      </div>
      <div className="cp-table-wrap">
        <div className="cp-table-hdr">
          <span className="cp-table-title">Pedidos de Compra ({filtered.length})</span>
          <span className={`cp-badge cp-badge-orange`}>{PEDIDOS.filter(p=>p.status==='pendente').length} pendentes</span>
        </div>
        <table className="cp-table">
          <thead><tr><th>PO</th><th>Fornecedor</th><th>Item</th><th>Categoria</th><th>Valor</th><th>Data</th><th>Prazo</th><th>Status</th></tr></thead>
          <tbody>{filtered.map((p,i)=>(
            <tr key={i}>
              <td className="cp-td-mono cp-td-bold">{p.id}</td>
              <td className="cp-td-bold">{p.fornecedor}</td>
              <td className="cp-td-muted" style={{maxWidth:160,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{p.item}</td>
              <td><span className="cp-badge cp-badge-gray">{p.cat}</span></td>
              <td className="cp-td-mono cp-td-bold">{fmtBRL(p.valor)}</td>
              <td className="cp-td-mono">{p.data}</td>
              <td className="cp-td-mono">{p.prazo}</td>
              <td><span className={`cp-badge ${statusBadge(p.status)}`}>{statusLabel(p.status)}</span></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

function FornecedoresView(){
  return(
    <div className="cp-view-wrap">
      <div className="cp-mini-stats">
        {[
          {l:'Total',v:FORNECEDORES.length,c:'var(--cp-orange)'},
          {l:'Ativos',v:FORNECEDORES.filter(f=>f.status==='ativo').length,c:'var(--cp-green)'},
          {l:'Inativos',v:FORNECEDORES.filter(f=>f.status==='inativo').length,c:'var(--cp-red)'},
          {l:'Volume Total',v:'R$ 514K',c:'var(--cp-blue)'},
        ].map((m,i)=>(
          <div key={i} className="cp-mini-stat">
            <div className="cp-mini-stat-label">{m.l}</div>
            <div className="cp-mini-stat-value" style={{color:m.c,fontSize:i===3?'19px':'26px'}}>{m.v}</div>
          </div>
        ))}
      </div>
      <div className="cp-table-wrap">
        <div className="cp-table-hdr"><span className="cp-table-title">Fornecedores Cadastrados</span></div>
        <table className="cp-table">
          <thead><tr><th>Nome</th><th>CNPJ</th><th>Categoria</th><th>Avaliação</th><th>Pedidos</th><th>Volume</th><th>Status</th></tr></thead>
          <tbody>{FORNECEDORES.map((f,i)=>(
            <tr key={i}>
              <td className="cp-td-bold">{f.nome}</td>
              <td className="cp-td-mono">{f.cnpj}</td>
              <td><span className="cp-badge cp-badge-gray">{f.cat}</span></td>
              <td><span style={{display:'flex',alignItems:'center',gap:'4px',fontWeight:600,fontSize:'13px'}}><IcoStar/>{f.avaliacao}</span></td>
              <td className="cp-td-mono" style={{textAlign:'center'}}>{f.pedidos}</td>
              <td className="cp-td-mono cp-td-bold">{fmtBRL(f.volume)}</td>
              <td><span className={`cp-badge ${statusBadge(f.status)}`}>{statusLabel(f.status)}</span></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

function RequisicaoView({tab}){
  const [filtro,setFiltro] = useState('todos');
  const [done,setDone]     = useState([]);

  const filtered     = filtro==='todos'?REQUISICOES:REQUISICOES.filter(r=>r.status===filtro);
  const pendAprov    = APROVACOES.filter(a=>!done.includes(a.id));
  const aprovar      = id => setDone(d=>[...d,id]);
  const reqPendCount = REQUISICOES.filter(r=>r.status==='pendente').length;

  return(
    <div className="cp-view-wrap">

      {/* ---- Requisições ---- */}
      {tab==='req'&&<>
        <div className="cp-filter-tabs">
          {['todos','aprovada','pendente','rejeitada'].map(f=>(
            <button key={f} className={`cp-filter-tab${filtro===f?' active':''}`} onClick={()=>setFiltro(f)}>
              {f==='todos'?'Todas':statusLabel(f)}
            </button>
          ))}
        </div>
        <div className="cp-table-wrap">
          <div className="cp-table-hdr">
            <span className="cp-table-title">Requisições de Compra ({filtered.length})</span>
            <span className="cp-badge cp-badge-orange">{reqPendCount} pendentes</span>
          </div>
          <table className="cp-table">
            <thead><tr><th>REQ</th><th>Departamento</th><th>Item</th><th>Qtd.</th><th>Urgência</th><th>Solicitante</th><th>Status</th></tr></thead>
            <tbody>{filtered.map((r,i)=>(
              <tr key={i}>
                <td className="cp-td-mono cp-td-bold">{r.id}</td>
                <td><span className="cp-badge cp-badge-gray">{r.depto}</span></td>
                <td className="cp-td-bold">{r.item}</td>
                <td className="cp-td-mono" style={{textAlign:'center'}}>{r.qtd}</td>
                <td><span className={`cp-badge ${urgColor(r.urgencia)}`}>{r.urgencia}</span></td>
                <td className="cp-td-muted">{r.solicitante}</td>
                <td><span className={`cp-badge ${statusBadge(r.status)}`}>{statusLabel(r.status)}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </>}

      {/* ---- Aprovações ---- */}
      {tab==='aprov'&&<>
        <div className="cp-mini-stats" style={{marginBottom:'20px'}}>
          {[
            {l:'Aguardando',    v:pendAprov.length,                                                c:'var(--cp-orange)'},
            {l:'Aprovados hoje',v:done.length,                                                     c:'var(--cp-green)'},
            {l:'Valor Pendente',v:`R$ ${(pendAprov.reduce((s,a)=>s+a.valor,0)/1000).toFixed(0)}K`,c:'var(--cp-yellow)'},
          ].map((m,i)=>(
            <div key={i} className="cp-mini-stat">
              <div className="cp-mini-stat-label">{m.l}</div>
              <div className="cp-mini-stat-value" style={{color:m.c,fontSize:i===2?'19px':'26px'}}>{m.v}</div>
            </div>
          ))}
        </div>
        {pendAprov.length===0&&<div className="cp-success-msg">✓ Todas as aprovações foram processadas!</div>}
        {pendAprov.map((a,i)=>(
          <div key={i} className="cp-card" style={{display:'flex',alignItems:'center',gap:'16px'}}>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:'14px',color:'var(--cp-text)'}}>{a.id} — {a.item}</div>
              <div style={{fontSize:'12.5px',color:'var(--cp-text-2)',marginTop:'3px'}}>
                Solicitante: {a.solicitante} · {a.depto} · {a.data}
              </div>
            </div>
            <div style={{fontWeight:700,fontSize:'15px',color:'var(--cp-text)',flexShrink:0}}>{fmtBRL(a.valor)}</div>
            <div style={{display:'flex',gap:'8px',flexShrink:0}}>
              <button className="cp-btn cp-btn-primary cp-btn-sm" onClick={()=>aprovar(a.id)}>Aprovar</button>
              <button className="cp-btn cp-btn-ghost cp-btn-sm"   onClick={()=>aprovar(a.id)}>Rejeitar</button>
            </div>
          </div>
        ))}
      </>}
    </div>
  );
}

function AprovacoesView(){
  const [done,setDone]=useState([]);
  const pendentes=APROVACOES.filter(a=>!done.includes(a.id));
  const aprovar=id=>setDone(d=>[...d,id]);
  return(
    <div className="cp-view-wrap">
      <div className="cp-mini-stats" style={{marginBottom:'20px'}}>
        {[
          {l:'Aguardando',v:pendentes.length,c:'var(--cp-orange)'},
          {l:'Aprovados hoje',v:done.length,c:'var(--cp-green)'},
          {l:'Valor Pendente',v:`R$ ${(pendentes.reduce((s,a)=>s+a.valor,0)/1000).toFixed(0)}K`,c:'var(--cp-yellow)'},
        ].map((m,i)=>(
          <div key={i} className="cp-mini-stat">
            <div className="cp-mini-stat-label">{m.l}</div>
            <div className="cp-mini-stat-value" style={{color:m.c,fontSize:i===2?'19px':'26px'}}>{m.v}</div>
          </div>
        ))}
      </div>
      {pendentes.length===0&&<div className="cp-success-msg">✓ Todas as aprovações foram processadas!</div>}
      {pendentes.map((a,i)=>(
        <div key={i} className="cp-card" style={{display:'flex',alignItems:'center',gap:'16px'}}>
          <div style={{flex:1}}>
            <div style={{fontWeight:700,fontSize:'14px',color:'var(--cp-text)'}}>{a.id} — {a.item}</div>
            <div style={{fontSize:'12.5px',color:'var(--cp-text-2)',marginTop:'3px'}}>Solicitante: {a.solicitante} · {a.depto} · {a.data}</div>
          </div>
          <div style={{fontWeight:700,fontSize:'15px',color:'var(--cp-text)',flexShrink:0}}>{fmtBRL(a.valor)}</div>
          <div style={{display:'flex',gap:'8px',flexShrink:0}}>
            <button className="cp-btn cp-btn-primary cp-btn-sm" onClick={()=>aprovar(a.id)}>Aprovar</button>
            <button className="cp-btn cp-btn-ghost cp-btn-sm" onClick={()=>aprovar(a.id)}>Rejeitar</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function OrcamentoView(){
  const [anim,setAnim]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setAnim(true),200);return()=>clearTimeout(t);},[]);
  const totalOrcado=ORCAMENTO_CATS.reduce((s,c)=>s+c.orcado,0);
  const totalGasto =ORCAMENTO_CATS.reduce((s,c)=>s+c.gasto,0);
  return(
    <div className="cp-view-wrap">
      <div className="cp-mini-stats">
        {[
          {l:'Orçamento Total',v:fmtK(totalOrcado),c:'var(--cp-orange)'},
          {l:'Gasto Acumulado',v:fmtK(totalGasto),c:'var(--cp-text)'},
          {l:'Saldo Disponível',v:fmtK(totalOrcado-totalGasto),c:'var(--cp-green)'},
          {l:'Utilização',v:`${Math.round(totalGasto/totalOrcado*100)}%`,c:'var(--cp-yellow)'},
        ].map((m,i)=>(
          <div key={i} className="cp-mini-stat">
            <div className="cp-mini-stat-label">{m.l}</div>
            <div className="cp-mini-stat-value" style={{color:m.c,fontSize:'19px'}}>{m.v}</div>
          </div>
        ))}
      </div>
      <div className="cp-chart-wrap">
        <div className="cp-chart-title" style={{marginBottom:'20px'}}>Utilização por Categoria</div>
        {ORCAMENTO_CATS.map((c,i)=>(
          <div key={i} style={{marginBottom:'16px'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'6px',fontSize:'13px'}}>
              <span style={{fontWeight:600,color:'var(--cp-text)'}}>{c.cat}</span>
              <span style={{color:'var(--cp-text-2)',fontFamily:'var(--cp-mono)',fontSize:'12px'}}>{fmtBRL(c.gasto)} / {fmtBRL(c.orcado)}</span>
            </div>
            <div style={{height:'8px',background:'#F3F4F6',borderRadius:'4px',overflow:'hidden'}}>
              <div style={{height:'100%',width:anim?`${c.pct}%`:'0%',background:c.pct>=85?'var(--cp-red)':c.pct>=70?'var(--cp-orange)':'var(--cp-green)',borderRadius:'4px',transition:`width 0.9s cubic-bezier(.4,0,.2,1) ${i*0.08}s`}}/>
            </div>
            <div style={{fontSize:'11px',color:'var(--cp-text-3)',marginTop:'4px'}}>{c.pct}% utilizado</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RelatoriosView(){
  const KPIS=[
    {l:'Gasto vs Orçamento',v:'74%',    meta:'< 80%',  st:'ok'  },
    {l:'Prazo Médio PO',    v:'6.2 dias',meta:'< 7d',  st:'ok'  },
    {l:'Pedidos no Prazo',  v:'88%',    meta:'≥ 90%',  st:'warn'},
    {l:'Economia Negociada',v:'R$ 12K', meta:'/mês',   st:'ok'  },
    {l:'Fornec. Aprovados', v:'83%',    meta:'≥ 85%',  st:'warn'},
    {l:'POs Canceladas',    v:'8%',     meta:'< 5%',   st:'crit'},
  ];
  return(
    <div className="cp-view-wrap">
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'14px',marginBottom:'20px'}}>
        {KPIS.map((k,i)=>(
          <div key={i} className="cp-card" style={{marginBottom:0}}>
            <div style={{fontSize:'12px',color:'var(--cp-text-3)',marginBottom:'6px'}}>{k.l}</div>
            <div style={{fontSize:'24px',fontWeight:800,color:k.st==='ok'?'var(--cp-green)':k.st==='warn'?'var(--cp-yellow)':'var(--cp-red)'}}>{k.v}</div>
            <div style={{fontSize:'11.5px',color:'var(--cp-text-3)',marginTop:'4px'}}>Meta: {k.meta}</div>
          </div>
        ))}
      </div>
      <div className="cp-table-wrap">
        <div className="cp-table-hdr"><span className="cp-table-title">Gasto por Categoria — Últimos 6 meses</span></div>
        <table className="cp-table">
          <thead><tr><th>Categoria</th>{MESES.map(m=><th key={m}>{m}</th>)}<th>Total</th></tr></thead>
          <tbody>
            {[
              {cat:'TI',        vals:[12,18,14,22,17,28]},
              {cat:'Software',  vals:[ 8,10, 9,14,12,16]},
              {cat:'Infraestr.',vals:[ 9,14,11,18,14,21]},
              {cat:'Suprimentos',vals:[3, 5, 4, 7, 5, 8]},
            ].map((r,i)=>(
              <tr key={i}>
                <td className="cp-td-bold">{r.cat}</td>
                {r.vals.map((v,j)=><td key={j} className="cp-td-mono">{v}K</td>)}
                <td className="cp-td-mono cp-td-bold" style={{color:'var(--cp-orange)'}}>{r.vals.reduce((a,b)=>a+b,0)}K</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ExportarView(){
  const [done,setDone]=useState(null);
  const go=f=>{setDone(null);setTimeout(()=>setDone(f),900);};
  const items=[
    {fmt:'PDF',      label:'Relatório de Pedidos',     desc:'POs do período com status e valores.',   Icon:<IcoPedido/>},
    {fmt:'Excel',    label:'Planilha de Fornecedores',  desc:'Cadastro completo com avaliações.',      Icon:<IcoForn/>},
    {fmt:'CSV',      label:'Histórico de Requisições',  desc:'Todas as requisições para análise.',     Icon:<IcoReq/>},
    {fmt:'PDF KPIs', label:'Relatório de Orçamento',   desc:'Utilização por categoria formatada.',    Icon:<IcoOrcam/>},
  ];
  return(
    <div className="cp-view-wrap" style={{maxWidth:'540px'}}>
      {done&&<div className="cp-success-msg">✓ {done} exportado com sucesso!</div>}
      {items.map((f,i)=>(
        <div key={i} className="cp-card" style={{display:'flex',alignItems:'center',gap:'16px'}}>
          <div style={{width:40,height:40,borderRadius:'10px',background:'var(--cp-orange-s)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--cp-orange)',flexShrink:0}}>{f.Icon}</div>
          <div style={{flex:1}}>
            <div style={{fontWeight:600,fontSize:'14px',color:'var(--cp-text)'}}>{f.label}</div>
            <div style={{fontSize:'12.5px',color:'var(--cp-text-2)',marginTop:'2px'}}>{f.desc}</div>
          </div>
          <button className="cp-btn cp-btn-ghost cp-btn-sm" onClick={()=>go(f.fmt)}>Exportar</button>
        </div>
      ))}
    </div>
  );
}

function ConfigView(){
  const [saved,setSaved]=useState(false);
  const [form,setForm]=useState({
    empresa:'Lynus Tech Ltda', moeda:'BRL',
    aprovLimite:'R$ 10.000',  notif:'Email + WhatsApp',
    prazoDefault:'7 dias',
  });
  const save=()=>{setSaved(true);setTimeout(()=>setSaved(false),3000);};
  return(
    <div className="cp-view-wrap" style={{maxWidth:'520px'}}>
      {saved&&<div className="cp-success-msg">✓ Configurações salvas!</div>}
      <div className="cp-card" style={{display:'flex',flexDirection:'column',gap:'16px'}}>
        {[
          {l:'Empresa',k:'empresa'},
          {l:'Moeda Padrão',k:'moeda'},
          {l:'Limite de Aprovação Automática',k:'aprovLimite'},
          {l:'Notificações via',k:'notif'},
          {l:'Prazo Padrão de Entrega',k:'prazoDefault'},
        ].map(f=>(
          <div key={f.k}>
            <label style={{fontSize:'12.5px',fontWeight:600,color:'var(--cp-text-2)',display:'block',marginBottom:'6px'}}>{f.l}</label>
            <input className="cp-input" value={form[f.k]} onChange={e=>setForm(v=>({...v,[f.k]:e.target.value}))}/>
          </div>
        ))}
        <button className="cp-btn cp-btn-primary" style={{width:'100%',marginTop:'4px'}} onClick={save}>Salvar Configurações</button>
      </div>
    </div>
  );
}

// ================================================================
// LOGO MARK
// ================================================================
function LogoMark(){
  return(
    <svg width="160" height="54" viewBox="0 0 160 54" fill="none">
      <defs>
        <linearGradient id="lgCbody" x1="4" y1="10" x2="38" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFA040"/>
          <stop offset="100%" stopColor="#C83010"/>
        </linearGradient>
        <linearGradient id="lgCwheel" x1="4" y1="32" x2="38" y2="46" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFB860"/>
          <stop offset="100%" stopColor="#D84020"/>
        </linearGradient>
        <linearGradient id="lgCtag" x1="38" y1="12" x2="44" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFD080"/>
          <stop offset="100%" stopColor="#E85520"/>
        </linearGradient>
      </defs>

      {/* Handle — curve from left post down into cart */}
      <path d="M 4,22 C 4,12 10,9 18,10 L 18,21"
            stroke="url(#lgCbody)" strokeWidth="2.8" strokeLinecap="round" fill="none"/>

      {/* Cart body */}
      <path d="M 16,21 L 37,21 L 35,33 L 18,33 Z" fill="url(#lgCbody)"/>

      {/* Items inside — 3 translucent bars */}
      <rect x="19" y="23" width="4"   height="8" rx="1.5" fill="rgba(255,255,255,0.48)"/>
      <rect x="24.5" y="23" width="4" height="8" rx="1.5" fill="rgba(255,255,255,0.30)"/>
      <rect x="30" y="23" width="3.5" height="8" rx="1.5" fill="rgba(255,255,255,0.16)"/>

      {/* Bottom rail */}
      <path d="M 16,33 L 37,33" stroke="url(#lgCbody)" strokeWidth="2.2" strokeLinecap="round" opacity="0.5"/>

      {/* Price tag hanging off the cart */}
      <path d="M 37,22 L 42,22 L 44,16 L 38,16 Z" fill="url(#lgCtag)" opacity="0.85"/>
      <circle cx="39" cy="16.5" r="1.2" fill="white" opacity="0.7"/>
      <line x1="41.5" y1="19" x2="41.5" y2="21" stroke="white" strokeWidth="1" opacity="0.6" strokeLinecap="round"/>

      {/* Wheel 1 — spinning CW */}
      <g>
        <animateTransform attributeName="transform" type="rotate"
          from="0 20 40" to="360 20 40" dur="2s" repeatCount="indefinite" calcMode="linear"/>
        <circle cx="20" cy="40" r="4.8" fill="url(#lgCwheel)"/>
        <circle cx="20" cy="40" r="1.9" fill="white" opacity="0.85"/>
        <line x1="20" y1="35.2" x2="20" y2="44.8" stroke="white" strokeWidth="1.4" opacity="0.45"/>
        <line x1="15.2" y1="40" x2="24.8" y2="40" stroke="white" strokeWidth="1.4" opacity="0.45"/>
      </g>

      {/* Wheel 2 — spinning CW same speed */}
      <g>
        <animateTransform attributeName="transform" type="rotate"
          from="0 33 40" to="360 33 40" dur="2s" repeatCount="indefinite" calcMode="linear"/>
        <circle cx="33" cy="40" r="4.8" fill="url(#lgCwheel)"/>
        <circle cx="33" cy="40" r="1.9" fill="white" opacity="0.85"/>
        <line x1="33" y1="35.2" x2="33" y2="44.8" stroke="white" strokeWidth="1.4" opacity="0.45"/>
        <line x1="28.2" y1="40" x2="37.8" y2="40" stroke="white" strokeWidth="1.4" opacity="0.45"/>
      </g>

      {/* Motion lines (speed effect) */}
      <line x1="6" y1="27" x2="1.5" y2="27" stroke="#E8572A" strokeWidth="1.3" strokeLinecap="round" opacity="0.55"/>
      <line x1="6.5" y1="30" x2="1.5" y2="30" stroke="#E8572A" strokeWidth="1.0" strokeLinecap="round" opacity="0.38"/>
      <line x1="7"   y1="33" x2="2.5" y2="33" stroke="#E8572A" strokeWidth="0.8" strokeLinecap="round" opacity="0.24"/>

      {/* LYNUS */}
      <text x="52" y="30" fontFamily="'Quattrocento Sans', sans-serif"
            fontWeight="700" fontSize="18" fill="#FFFFFF" letterSpacing="2.5">LYNUS</text>

      {/* Separator */}
      <line x1="52" y1="36" x2="158" y2="36" stroke="#E8572A" strokeWidth="0.7" opacity="0.35"/>

      {/* COMPRAS */}
      <text x="53" y="48" fontFamily="'Quattrocento Sans', sans-serif"
            fontWeight="700" fontSize="9.5" fill="#E8572A" letterSpacing="3.2">COMPRAS</text>
    </svg>
  );
}

// ================================================================
// NAV + APP
// ================================================================
const NAV_GROUPS = [
  {group:'Menu', items:[
    {id:'dashboard',   title:'Dashboard',    Icon:IcoDash,   badge:null},
    {id:'pedidos',     title:'Pedidos (PO)', Icon:IcoPedido, badge:PEDIDOS.filter(p=>p.status==='pendente').length||null},
    {id:'fornecedores',title:'Fornecedores', Icon:IcoForn,   badge:null},
    {id:'requisicoes', title:'Requisições',  Icon:IcoReq,    badge:REQUISICOES.filter(r=>r.status==='pendente').length||null},
  ]},
  {group:'Gestão', items:[
    {id:'orcamento',   title:'Orçamento',    Icon:IcoOrcam,  badge:null},
  ]},
  {group:'Relatórios', items:[
    {id:'relatorios',  title:'Relatórios',   Icon:IcoRelat,  badge:null},
    {id:'exportar',    title:'Exportar',     Icon:IcoExport, badge:null},
  ]},
  {group:'Sistema', items:[
    {id:'config',      title:'Configurações',Icon:IcoConfig, badge:null},
  ]},
];

const VIEW_TITLE = {
  dashboard:'Dashboard', pedidos:'Pedidos de Compra', fornecedores:'Fornecedores',
  requisicoes:'Requisições', aprovacoes:'Aprovações', orcamento:'Orçamento',
  relatorios:'Relatórios', exportar:'Exportar Dados', config:'Configurações',
};

function App(){
  const [view,setView]       = useState('dashboard');
  const [reqTab,setReqTab]   = useState('req');

  const REQ_PEND   = REQUISICOES.filter(r=>r.status==='pendente').length;
  const APROV_PEND = APROVACOES.length;

  const VIEWS = {
    dashboard:   <DashboardView/>,
    pedidos:     <PedidosView/>,
    fornecedores:<FornecedoresView/>,
    requisicoes: <RequisicaoView tab={reqTab}/>,
    orcamento:   <OrcamentoView/>,
    relatorios:  <RelatoriosView/>,
    exportar:    <ExportarView/>,
    config:      <ConfigView/>,
  };
  const MAIN_NAV = NAV_GROUPS.flatMap(g=>g.items).filter(it=>it.id!=='exportar'&&it.id!=='config');

  return(
    <div className="cp-layout">
      {/* Top Navigation */}
      <nav className="cp-topnav">
        {/* Logo */}
        <div className="cp-topnav-logo"><LogoMark/></div>
        <div className="cp-topnav-divider"/>

        {/* Main nav links */}
        <div className="cp-topnav-links">
          {MAIN_NAV.map(it=>(
            <button key={it.id} className={`cp-topnav-btn${view===it.id?' active':''}`} onClick={()=>setView(it.id)}>
              <it.Icon/>
              {it.id==='pedidos'?'Pedidos':it.title}
              {it.badge&&<span className="cp-topnav-badge">{it.badge}</span>}
            </button>
          ))}
        </div>

        {/* Right actions */}
        <div className="cp-topnav-right">
          <div className="cp-topnav-divider"/>
          <button
            title="Exportar"
            className={`cp-topnav-icon-btn${view==='exportar'?' active':''}`}
            onClick={()=>setView('exportar')}
          ><IcoExport/></button>
          <button
            title="Configurações"
            className={`cp-topnav-icon-btn${view==='config'?' active':''}`}
            onClick={()=>setView('config')}
          ><IcoConfig/></button>
          <div className="cp-topnav-divider"/>
          <a href="index.html" style={{textDecoration:'none'}}>
            <button className="cp-topnav-btn" style={{paddingRight:'6px'}}>
              <IcoBack/> Site
            </button>
          </a>
        </div>
      </nav>

      {/* Sub navigation — aparece apenas em Requisições */}
      {view==='requisicoes'&&(
        <div className="cp-subnav">
          <div className="cp-subnav-links">
            <button
              className={`cp-subnav-btn${reqTab==='req'?' active':''}`}
              onClick={()=>setReqTab('req')}
            >
              Requisições
              {REQ_PEND>0&&<span className="cp-subnav-badge">{REQ_PEND}</span>}
            </button>
            <button
              className={`cp-subnav-btn${reqTab==='aprov'?' active':''}`}
              onClick={()=>setReqTab('aprov')}
            >
              Aprovações
              {APROV_PEND>0&&<span className="cp-subnav-badge">{APROV_PEND}</span>}
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="cp-main">
        {view !== 'dashboard' && (
          <div className="cp-topbar">
            <div>
              <div className="cp-page-title">
                {view==='requisicoes'
                  ? (reqTab==='req' ? 'Requisições de Compra' : 'Aprovações')
                  : VIEW_TITLE[view]}
              </div>
              <div className="cp-page-sub">Sistema de Compras · Jun 2026</div>
            </div>
            <div className="cp-topbar-right">
              <button className="cp-btn-date"><IcoCal/> Jun 2026 ▾</button>
            </div>
          </div>
        )}
        <div className="cp-content">{VIEWS[view]}</div>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
