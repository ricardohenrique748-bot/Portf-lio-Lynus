/* ============================================================
   LYNUS TECH — Gestão de Manutenção — Orange Clean Theme
   ============================================================ */
const { useState, useEffect } = React;

// ---- Data ----
const SEMANAS  = ['S1','S2','S3','S4','S5','S6','S7','S8'];
const OS_ABT   = [8,12,7,15,10,9,14,12];
const OS_CON   = [14,18,12,20,16,13,19,17];
const MESES    = ['Jan','Fev','Mar','Abr','Mai','Jun'];

const EQUIPAMENTOS=[
  {id:'EQ-001',nome:'Compressor A1',    tipo:'Compressor',   loc:'Sala A',    status:'ok',  disp:98.2},
  {id:'EQ-002',nome:'Bomba Hidráulica', tipo:'Bomba',        loc:'Linha 1',   status:'ok',  disp:96.5},
  {id:'EQ-003',nome:'Motor Principal',  tipo:'Motor',        loc:'Central',   status:'warn',disp:87.3},
  {id:'EQ-004',nome:'Gerador G1',       tipo:'Gerador',      loc:'Externa',   status:'ok',  disp:99.1},
  {id:'EQ-005',nome:'Esteira 1',        tipo:'Transportador',loc:'Linha 1',   status:'ok',  disp:95.0},
  {id:'EQ-006',nome:'Esteira 2',        tipo:'Transportador',loc:'Linha 2',   status:'crit',disp:0},
  {id:'EQ-007',nome:'Painel Elétrico',  tipo:'Elétrico',     loc:'Central',   status:'ok',  disp:100},
  {id:'EQ-008',nome:'Ar Comprimido',    tipo:'Compressor',   loc:'Sala B',    status:'ok',  disp:97.8},
  {id:'EQ-009',nome:'Chiller 1',        tipo:'Climatização', loc:'Cobertura', status:'warn',disp:72.1},
  {id:'EQ-010',nome:'Compressor A2',    tipo:'Compressor',   loc:'Sala A',    status:'ok',  disp:96.0},
  {id:'EQ-011',nome:'Bomba de Água',    tipo:'Bomba',        loc:'Subsolo',   status:'ok',  disp:98.5},
  {id:'EQ-012',nome:'Motor Aux.',       tipo:'Motor',        loc:'Linha 2',   status:'ok',  disp:94.2},
  {id:'EQ-013',nome:'UPS 1',            tipo:'Elétrico',     loc:'TI',        status:'ok',  disp:100},
  {id:'EQ-014',nome:'Ventilação',       tipo:'HVAC',         loc:'Geral',     status:'ok',  disp:91.3},
  {id:'EQ-015',nome:'Caldeira B1',      tipo:'Caldeira',     loc:'Sala C',    status:'warn',disp:80.4},
  {id:'EQ-016',nome:'Torre Resf.',      tipo:'Resfriamento', loc:'Externa',   status:'ok',  disp:97.6},
];
const OS_LIST=[
  {id:'OS-0842',equip:'Esteira 2',       tipo:'Corretiva', prior:'Alta',  resp:'Carlos M.',abertura:'12/06',status:'crit',desc:'Correia partida — parada total'},
  {id:'OS-0841',equip:'Motor Principal', tipo:'Preventiva',prior:'Média', resp:'Ana S.',   abertura:'11/06',status:'warn',desc:'Vibração acima do limite'},
  {id:'OS-0840',equip:'Chiller 1',       tipo:'Preventiva',prior:'Média', resp:'Lucas T.', abertura:'10/06',status:'warn',desc:'Eficiência reduzida'},
  {id:'OS-0839',equip:'Caldeira B1',     tipo:'Preditiva', prior:'Alta',  resp:'Pedro R.', abertura:'09/06',status:'warn',desc:'Análise de óleo pendente'},
  {id:'OS-0838',equip:'Ar Comprimido',   tipo:'Corretiva', prior:'Baixa', resp:'Maria L.', abertura:'08/06',status:'ok',  desc:'Troca de filtro'},
  {id:'OS-0837',equip:'Painel Elétrico', tipo:'Preventiva',prior:'Alta',  resp:'Carlos M.',abertura:'07/06',status:'ok',  desc:'Revisão bimestral'},
];
const TECNICOS=[
  {nome:'Carlos M.',  esp:'Mecânica',      os:3,disp:'Disponível', status:'ok'  },
  {nome:'Ana S.',     esp:'Eletricidade',  os:2,disp:'Em OS-0841', status:'warn'},
  {nome:'Lucas T.',   esp:'Refrigeração',  os:1,disp:'Em OS-0840', status:'warn'},
  {nome:'Pedro R.',   esp:'Caldeiraria',   os:2,disp:'Em OS-0839', status:'warn'},
  {nome:'Maria L.',   esp:'Instrumentação',os:1,disp:'Disponível', status:'ok'  },
  {nome:'João F.',    esp:'Mecânica',      os:0,disp:'Disponível', status:'ok'  },
];
const PECAS=[
  {cod:'PÇ-441',nome:'Correia B-72 Industrial',    qtd:2, min:3, status:'crit',loc:'Prateleira A3'},
  {cod:'PÇ-218',nome:'Filtro Ar 2" Compressor',    qtd:8, min:5, status:'ok',  loc:'Prateleira B1'},
  {cod:'PÇ-312',nome:'Rolamento SKF 6205',          qtd:4, min:4, status:'warn',loc:'Prateleira A1'},
  {cod:'PÇ-097',nome:'Óleo Lubrificante Shell 15W', qtd:12,min:6, status:'ok',  loc:'Almoxarifado'},
  {cod:'PÇ-556',nome:'Selo Mecânico Bomba 50mm',   qtd:1, min:2, status:'crit',loc:'Prateleira C2'},
  {cod:'PÇ-223',nome:'Válvula Solenóide 3/4"',     qtd:6, min:3, status:'ok',  loc:'Prateleira B3'},
];
const AGENDA=[
  {data:'13/06',hora:'08:00',equip:'Compressor A1',    ativ:'Troca de filtros',       resp:'Carlos M.',tipo:'Prev.',dur:'2h'},
  {data:'14/06',hora:'09:30',equip:'Motor Principal',  ativ:'Lubrificação',            resp:'Ana S.',   tipo:'Prev.',dur:'1.5h'},
  {data:'15/06',hora:'13:00',equip:'Esteira 2',        ativ:'Reparo correia',          resp:'Carlos M.',tipo:'Corr.',dur:'4h'},
  {data:'16/06',hora:'07:00',equip:'Caldeira B1',      ativ:'Análise de óleo',         resp:'Pedro R.', tipo:'Pred.',dur:'3h'},
  {data:'17/06',hora:'10:00',equip:'Chiller 1',        ativ:'Carga de gás',            resp:'Lucas T.', tipo:'Corr.',dur:'5h'},
  {data:'18/06',hora:'08:30',equip:'Bomba Hidráulica', ativ:'Inspeção de vedações',    resp:'Lucas T.', tipo:'Pred.',dur:'2h'},
];

// ---- Indicadores — dados PCM ----
const MESES_12     = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
const DISP_MENSAL  = [91.2,92.4,91.8,93.0,93.5,94.2,93.8,94.5,95.1,94.8,95.3,94.2];
const MTBF_MENSAL  = [280,295,288,302,298,312,318,325,310,322,330,312];
const MTTR_MENSAL  = [5.8,5.4,5.0,4.8,4.6,4.2,4.5,4.1,4.3,4.0,3.9,4.2];
const OS_POR_STATUS= [{label:'Abertas',v:12,color:'#3B82F6'},{label:'Em andamento',v:8,color:'#F59E0B'},{label:'Concluídas',v:109,color:'#16A34A'},{label:'Atrasadas',v:5,color:'#DC2626'}];
const OS_POR_RESP  = [{nome:'Carlos M.',os:28},{nome:'Ana S.',os:22},{nome:'Lucas T.',os:18},{nome:'Pedro R.',os:16},{nome:'Maria L.',os:14},{nome:'João F.',os:11}];
const EQUIP_RANK   = [{nome:'Esteira 2',os:24,custo:18400},{nome:'Chiller 1',os:18,custo:14200},{nome:'Caldeira B1',os:16,custo:12800},{nome:'Motor Principal',os:14,custo:9600},{nome:'Compressor A1',os:11,custo:7200}];
const BACKLOG_PRIOR= [{prior:'Alta',qtd:8,color:'#DC2626'},{prior:'Média',qtd:14,color:'#F59E0B'},{prior:'Baixa',qtd:5,color:'#3B82F6'}];
const OS_DETAIL    = [
  {id:'OS-0842',equip:'Esteira 2',      placa:'EST-002',tipo:'Corretiva', status:'crit',abertura:'12/06',prazo:'14/06',resp:'Carlos M.',tParado:'8h', custo:3400,prior:'Alta'},
  {id:'OS-0841',equip:'Motor Principal',placa:'MOT-003',tipo:'Preventiva',status:'warn',abertura:'11/06',prazo:'15/06',resp:'Ana S.',   tParado:'2h', custo:1200,prior:'Média'},
  {id:'OS-0840',equip:'Chiller 1',      placa:'CHI-009',tipo:'Preventiva',status:'warn',abertura:'10/06',prazo:'16/06',resp:'Lucas T.', tParado:'4h', custo:2800,prior:'Média'},
  {id:'OS-0839',equip:'Caldeira B1',    placa:'CAL-015',tipo:'Preditiva', status:'warn',abertura:'09/06',prazo:'13/06',resp:'Pedro R.', tParado:'6h', custo:4200,prior:'Alta'},
  {id:'OS-0838',equip:'Ar Comprimido',  placa:'ARC-008',tipo:'Corretiva', status:'ok',  abertura:'08/06',prazo:'12/06',resp:'Maria L.', tParado:'1h', custo:680, prior:'Baixa'},
  {id:'OS-0837',equip:'Painel Elétrico',placa:'PAI-007',tipo:'Preventiva',status:'ok',  abertura:'07/06',prazo:'10/06',resp:'Carlos M.',tParado:'0h', custo:450, prior:'Alta'},
];

// ---- Logo ----
function LogoMark(){
  // gear outline: teeth with arc roots
  function gearPath(cx,cy,n,ro,ri,hwf=0.22){
    const step=(2*Math.PI)/n, hw=step*hwf;
    const px=(a,r)=>(cx+r*Math.cos(a)).toFixed(2);
    const py=(a,r)=>(cy+r*Math.sin(a)).toFixed(2);
    let d='';
    for(let i=0;i<n;i++){
      const a=i*step-Math.PI/2, na=(i+1)*step-Math.PI/2;
      if(i===0) d+=`M${px(a-hw,ri)},${py(a-hw,ri)} `;
      d+=`L${px(a-hw,ro)},${py(a-hw,ro)} L${px(a+hw,ro)},${py(a+hw,ro)} L${px(a+hw,ri)},${py(a+hw,ri)} A${ri},${ri} 0 0 1 ${px(na-hw,ri)},${py(na-hw,ri)} `;
    }
    return d+'Z';
  }
  // big gear: cx=14 cy=32, n=12 teeth; small gear: cx=29 cy=15, n=7 teeth
  // center distance ≈ 20.2 ≈ ro_big(13)+ro_small(8)=21 → teeth nearly touching
  const bgD=gearPath(14,32,12,13,9.5,0.22);
  const sgD=gearPath(29,15, 7, 8, 5.8,0.23);
  return(
    <svg width="160" height="54" viewBox="0 0 160 54" fill="none">
      <defs>
        {/* fixed-space gradients → light stays still as gears spin */}
        <linearGradient id="lgBig" x1="14" y1="19" x2="14" y2="45" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FB923C"/>
          <stop offset="100%" stopColor="#B83A10"/>
        </linearGradient>
        <linearGradient id="lgSml" x1="29" y1="7" x2="29" y2="23" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FCD34D"/>
          <stop offset="100%" stopColor="#E8572A"/>
        </linearGradient>
        <linearGradient id="lgTxt" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1C1C1E"/>
          <stop offset="72%" stopColor="#1C1C1E"/>
          <stop offset="100%" stopColor="#E8572A"/>
        </linearGradient>
      </defs>

      {/* ── big gear — clockwise 12 s ── */}
      <g>
        <animateTransform attributeName="transform" type="rotate"
          from="0 14 32" to="360 14 32"
          dur="12s" repeatCount="indefinite" calcMode="linear"/>
        <path d={bgD} fill="url(#lgBig)"/>
        {/* spoke ring */}
        {[0,60,120,180,240,300].map(deg=>{
          const rad=deg*Math.PI/180;
          return <line key={deg}
            x1={(14+3.5*Math.cos(rad)).toFixed(2)} y1={(32+3.5*Math.sin(rad)).toFixed(2)}
            x2={(14+8*Math.cos(rad)).toFixed(2)}   y2={(32+8*Math.sin(rad)).toFixed(2)}
            stroke="rgba(0,0,0,0.15)" strokeWidth="1.4" strokeLinecap="round"/>;
        })}
        <circle cx="14" cy="32" r="4.8" fill="white"/>
        <circle cx="14" cy="32" r="3.2" fill="url(#lgBig)"/>
        <circle cx="14" cy="32" r="1.4" fill="white"/>
      </g>

      {/* ── small gear — counter-clockwise 7 s ── */}
      <g>
        <animateTransform attributeName="transform" type="rotate"
          from="0 29 15" to="-360 29 15"
          dur="7s" repeatCount="indefinite" calcMode="linear"/>
        <path d={sgD} fill="url(#lgSml)"/>
        {[0,51.4,102.9,154.3,205.7,257.1,308.6].map((deg,i)=>{
          const rad=deg*Math.PI/180;
          return <line key={i}
            x1={(29+2*Math.cos(rad)).toFixed(2)} y1={(15+2*Math.sin(rad)).toFixed(2)}
            x2={(29+5*Math.cos(rad)).toFixed(2)} y2={(15+5*Math.sin(rad)).toFixed(2)}
            stroke="rgba(0,0,0,0.15)" strokeWidth="1" strokeLinecap="round"/>;
        })}
        <circle cx="29" cy="15" r="3"   fill="white"/>
        <circle cx="29" cy="15" r="2"   fill="url(#lgSml)"/>
        <circle cx="29" cy="15" r="0.8" fill="white"/>
      </g>

      {/* ── text ── */}
      <text x="48" y="31" fontFamily="'Quattrocento Sans', sans-serif" fontWeight="700" fontSize="18" fill="url(#lgTxt)" letterSpacing="2.5">LYNUS</text>
      <line x1="48" y1="36" x2="156" y2="36" stroke="#E8572A" strokeWidth="0.75" opacity="0.4"/>
      <text x="49" y="48" fontFamily="'Quattrocento Sans', sans-serif" fontWeight="700" fontSize="11" fill="#E8572A" letterSpacing="5">PCM</text>
    </svg>
  );
}

// ---- SVG Icons ----
function IcoDash(){return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1.5" fill="currentColor"/><rect x="9" y="1.5" width="5.5" height="5.5" rx="1.5" fill="currentColor" opacity=".55"/><rect x="1.5" y="9" width="5.5" height="5.5" rx="1.5" fill="currentColor" opacity=".55"/><rect x="9" y="9" width="5.5" height="5.5" rx="1.5" fill="currentColor" opacity=".55"/></svg>;}
function IcoOS(){return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M2 8h8M2 12h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;}
function IcoEquip(){return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.7"/><path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.4 3.4l1.4 1.4M11.2 11.2l1.4 1.4M3.4 12.6l1.4-1.4M11.2 4.8l1.4-1.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;}
function IcoAgenda(){return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="3" width="13" height="11.5" rx="2" stroke="currentColor" strokeWidth="1.7"/><path d="M5 1.5v3M11 1.5v3M1.5 7.5h13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;}
function IcoTecnico(){return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5.5" r="2.8" stroke="currentColor" strokeWidth="1.7"/><path d="M2 14.5c0-3.31 2.69-6 6-6s6 2.69 6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>;}
function IcoPecas(){return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1.5L2 5v6l6 3.5L14 11V5L8 1.5z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/><path d="M2 5l6 3.5M14 5l-6 3.5M8 8.5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;}
function IcoKPI(){return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1.5 11.5l3.5-4 3 3 3.5-5 3 2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;}
function IcoExport(){return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2v8M5 5l3-3 3 3M3 11.5v1.5a1 1 0 001 1h8a1 1 0 001-1v-1.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>;}
function IcoConfig(){return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.7"/><path d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1.1 1.1M11.5 11.5l1.1 1.1M3.4 12.6l1.1-1.1M11.5 4.5l1.1-1.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;}
function IcoBack(){return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;}
function IcoSearch(){return <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="5.5" cy="5.5" r="4" stroke="#9CA3AF" strokeWidth="1.5"/><path d="M8.5 8.5l3 3" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/></svg>;}
function IcoSort(){return <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 4h9M3.5 6.5h6M5 9h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>;}
function IcoCal(){return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="2.5" width="12" height="10.5" rx="1.8" stroke="currentColor" strokeWidth="1.5"/><path d="M4.5 1v3M9.5 1v3M1 7h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>;}

// ---- Rounded-top bar helper (pill shape) ----
function PillBar({x, y, w, h, fill, rx=6}){
  if(h<=0) return null;
  const r=Math.min(rx, w/2, h/2);
  const d=`M ${x},${y+h} L ${x},${y+r} Q ${x},${y} ${x+r},${y} L ${x+w-r},${y} Q ${x+w},${y} ${x+w},${y+r} L ${x+w},${y+h} Z`;
  return <path d={d} fill={fill}/>;
}

// ---- Main bar chart (Dribbble style) ----
function OsBarChart({data, labels}){
  const [anim,setAnim]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setAnim(true),150);return()=>clearTimeout(t);},[]);
  const Y_MAX=25, Y_STEP=5;
  const yLabels=[0,5,10,15,20,25];
  const BAR_W=34, GAP=18, Y_PAD=38, X_PAD=28, TOP_PAD=30;
  const CHART_H=130;
  const maxIdx=data.indexOf(Math.max(...data));
  const totalW=Y_PAD+data.length*(BAR_W+GAP)-GAP+4;
  const totalH=TOP_PAD+CHART_H+X_PAD;
  return(
    <svg viewBox={`0 0 ${totalW} ${totalH}`} style={{width:'100%',height:'auto',display:'block'}}>
      {/* Y grid + labels */}
      {yLabels.map((v,i)=>{
        const yp=TOP_PAD+CHART_H-(v/Y_MAX)*CHART_H;
        return(<g key={i}>
          <text x={Y_PAD-8} y={yp+4} textAnchor="end" fontSize="9.5" fill="#9CA3AF" fontFamily="monospace">{v>0?`${v}k`:'0'}</text>
          <line x1={Y_PAD} y1={yp} x2={totalW} y2={yp} stroke="#F3F4F6" strokeWidth="1"/>
        </g>);
      })}
      {/* Bars */}
      {data.map((v,i)=>{
        const bx=Y_PAD+i*(BAR_W+GAP);
        const bh=anim?(v/Y_MAX)*CHART_H:0;
        const by=TOP_PAD+CHART_H-bh;
        const isHigh=i===maxIdx;
        const fill=isHigh?'#E8572A':'#FFCAB5';
        return(<g key={i} style={{transition:`opacity 0.3s ease ${i*0.06}s`}}>
          <PillBar x={bx} y={anim?by:TOP_PAD+CHART_H} w={BAR_W} h={anim?bh:0} fill={fill} rx={7}/>
          {/* tooltip for highlighted */}
          {isHigh&&anim&&(
            <g>
              <rect x={bx-4} y={by-24} width={BAR_W+8} height={19} rx={6} fill="#E8572A"/>
              <polygon points={`${bx+BAR_W/2-4},${by-5} ${bx+BAR_W/2+4},${by-5} ${bx+BAR_W/2},${by}`} fill="#E8572A"/>
              <text x={bx+BAR_W/2} y={by-11} textAnchor="middle" fontSize="10" fill="white" fontWeight="700">{v}</text>
            </g>
          )}
          {/* x label */}
          <text x={bx+BAR_W/2} y={TOP_PAD+CHART_H+18} textAnchor="middle" fontSize="10" fill="#9CA3AF" fontFamily="monospace">{labels[i]}</text>
        </g>);
      })}
    </svg>
  );
}

// ---- Dual bar chart (Profit/Loss style) ----
function DualBarChart({dataA, dataB, labels, colorA='#E8572A', colorB='#1C1C1E'}){
  const [anim,setAnim]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setAnim(true),250);return()=>clearTimeout(t);},[]);
  const maxV=Math.max(...dataA,...dataB)*1.05;
  const BW=12, GAP_INNER=4, GAP_GROUP=14, Y_PAD=30, X_PAD=22, CHART_H=110;
  const groupW=BW*2+GAP_INNER;
  const totalW=Y_PAD+labels.length*(groupW+GAP_GROUP)-GAP_GROUP+4;
  const totalH=CHART_H+X_PAD+8;
  return(
    <svg viewBox={`0 0 ${totalW} ${totalH}`} style={{width:'100%',height:'auto',display:'block'}}>
      {[0.33,0.66,1].map(f=>{
        const yp=(1-f)*CHART_H;
        return <line key={f} x1={Y_PAD} y1={yp} x2={totalW} y2={yp} stroke="#F3F4F6" strokeWidth="1"/>;
      })}
      {labels.map((lb,i)=>{
        const gx=Y_PAD+i*(groupW+GAP_GROUP);
        const hA=anim?(dataA[i]/maxV)*CHART_H:0;
        const hB=anim?(dataB[i]/maxV)*CHART_H:0;
        return(<g key={i}>
          <PillBar x={gx}      y={CHART_H-hA} w={BW} h={hA} fill={colorA} rx={4}/>
          <PillBar x={gx+BW+GAP_INNER} y={CHART_H-hB} w={BW} h={hB} fill={colorB} rx={4}/>
          <text x={gx+groupW/2} y={CHART_H+16} textAnchor="middle" fontSize="9.5" fill="#9CA3AF" fontFamily="monospace">{lb}</text>
        </g>);
      })}
    </svg>
  );
}

// ================================================================
// VIEWS
// ================================================================
// ---- Line Chart ----
function LineChart({data,labels,color='#3B82F6',min:minProp,max:maxProp,unit='',refLine,refLabel,chartH=90}){
  const [anim,setAnim]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setAnim(true),200);return()=>clearTimeout(t);},[]);
  const lo=minProp??Math.min(...data)*0.97,hi=maxProp??Math.max(...data)*1.02,rng=hi-lo;
  const W=380,H=chartH,PAD_L=36,PAD_B=20,PAD_T=10;
  const pts=data.map((v,i)=>[PAD_L+(i/(data.length-1))*(W-PAD_L),PAD_T+H-(((v-lo)/rng)*H)]);
  const pStr=pts.map(p=>p.join(',')).join(' ');
  const areaStr=`${pStr} ${pts[pts.length-1][0]},${PAD_T+H} ${pts[0][0]},${PAD_T+H}`;
  const uid=`lc${Math.random().toString(36).slice(2,6)}`;
  const ySteps=4;
  const refY=refLine!=null?PAD_T+H-(((refLine-lo)/rng)*H):null;
  return(
    <svg viewBox={`0 0 ${W} ${PAD_T+H+PAD_B}`} style={{width:'100%',height:'auto',display:'block'}}>
      <defs>
        <linearGradient id={uid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity=".18"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
        <clipPath id={`cl${uid}`}>
          <rect x={PAD_L} y={0} width={anim?W:0} height={PAD_T+H+PAD_B} style={{transition:'width 1s ease'}}/>
        </clipPath>
      </defs>
      {/* meta reference line */}
      {refY!=null&&(
        <g>
          <line x1={PAD_L} y1={refY} x2={W} y2={refY} stroke="#DC2626" strokeWidth="1.2" strokeDasharray="5,4" opacity="0.55"/>
          <rect x={W-46} y={refY-9} width={44} height={14} rx={4} fill="#DC2626" opacity="0.12"/>
          <text x={W-24} y={refY+1} textAnchor="middle" fontSize="8.5" fill="#DC2626" fontWeight="700" fontFamily="monospace">{refLabel??`meta`}</text>
        </g>
      )}
      {Array.from({length:ySteps+1}).map((_,i)=>{
        const v=lo+(rng/ySteps)*i;
        const y=PAD_T+H-((v-lo)/rng)*H;
        return(<g key={i}>
          <line x1={PAD_L} y1={y} x2={W} y2={y} stroke="#F3F4F6" strokeWidth="1"/>
          <text x={PAD_L-4} y={y+4} textAnchor="end" fontSize="9" fill="#9CA3AF" fontFamily="monospace">{v.toFixed(rng<10?1:0)}{unit}</text>
        </g>);
      })}
      <g clipPath={`url(#cl${uid})`}>
        <polygon points={areaStr} fill={`url(#${uid})`}/>
        <polyline points={pStr} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
        {pts.map((p,i)=><circle key={i} cx={p[0]} cy={p[1]} r="3" fill="white" stroke={color} strokeWidth="1.8"/>)}
      </g>
      {labels.map((lb,i)=>{
        const x=PAD_L+(i/(labels.length-1))*(W-PAD_L);
        return <text key={i} x={x} y={PAD_T+H+14} textAnchor="middle" fontSize="9" fill="#9CA3AF" fontFamily="monospace">{lb}</text>;
      })}
    </svg>
  );
}

// ---- Donut Chart ----
function DonutChart({segments}){
  const total=segments.reduce((s,sg)=>s+sg.v,0);
  const R=52,r=34,cx=70,cy=70;
  let angle=-Math.PI/2;
  const arcs=segments.map(sg=>{
    const sweep=(sg.v/total)*2*Math.PI;
    const x1=cx+R*Math.cos(angle),y1=cy+R*Math.sin(angle);
    angle+=sweep;
    const x2=cx+R*Math.cos(angle),y2=cy+R*Math.sin(angle);
    const xi1=cx+r*Math.cos(angle-sweep),yi1=cy+r*Math.sin(angle-sweep);
    const xi2=cx+r*Math.cos(angle),yi2=cy+r*Math.sin(angle);
    const large=sweep>Math.PI?1:0;
    return{...sg,d:`M ${x1},${y1} A ${R},${R} 0 ${large} 1 ${x2},${y2} L ${xi2},${yi2} A ${r},${r} 0 ${large} 0 ${xi1},${yi1} Z`};
  });
  return(
    <div style={{display:'flex',alignItems:'center',gap:'20px'}}>
      <svg viewBox="0 0 140 140" style={{width:130,height:130,flexShrink:0}}>
        {arcs.map((a,i)=><path key={i} d={a.d} fill={a.color} stroke="white" strokeWidth="2"/>)}
        <text x={cx} y={cy-6} textAnchor="middle" fontSize="13" fontWeight="700" fill="#1C1C1E">{Math.round(segments[0].v/total*100)}%</text>
        <text x={cx} y={cy+10} textAnchor="middle" fontSize="9" fill="#6B7280">Preventiva</text>
      </svg>
      <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
        {segments.map((s,i)=>(
          <div key={i} style={{display:'flex',alignItems:'center',gap:'8px'}}>
            <span style={{width:10,height:10,borderRadius:2,background:s.color,flexShrink:0,display:'inline-block'}}/>
            <span style={{fontSize:'12px',color:'#6B7280'}}>{s.label}</span>
            <span style={{fontWeight:700,fontSize:'13px',color:'#1C1C1E',marginLeft:'auto',paddingLeft:8}}>{s.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- Horizontal Bar Chart ----
function HBarChart({data,maxV,colorFn}){
  const [anim,setAnim]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setAnim(true),200);return()=>clearTimeout(t);},[]);
  return(
    <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
      {data.map((d,i)=>{
        const pct=anim?((d.v??d.os??d.qtd)/maxV)*100:0;
        const color=colorFn?colorFn(d,i):'#E8572A';
        return(
          <div key={i}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'3px',fontSize:'12px'}}>
              <span style={{color:'#1C1C1E',fontWeight:600}}>{d.nome??d.prior}</span>
              <span style={{color:'#6B7280',fontFamily:'monospace'}}>{d.v??d.os??d.qtd}{d.unit??''}</span>
            </div>
            <div style={{height:'7px',background:'#F3F4F6',borderRadius:'4px',overflow:'hidden'}}>
              <div style={{height:'100%',width:`${pct}%`,background:color,borderRadius:'4px',transition:`width 0.8s cubic-bezier(.4,0,.2,1) ${i*0.07}s`}}/>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DashboardView(){
  const ok      = EQUIPAMENTOS.filter(e=>e.status==='ok').length;
  const dispTec = TECNICOS.filter(t=>t.status==='ok').length;
  const urgOS   = OS_LIST.filter(o=>o.status==='crit').length;

  const KPI=[
    {label:'OS Abertas',         value:OS_LIST.length, unit:'',    sub:'Mês anterior: 9',          delta:'↑ 33%',   dType:'down', color:'#E8572A', bar:null},
    {label:'Equipamentos OK',    value:`${ok}/${EQUIPAMENTOS.length}`,unit:'', sub:`${EQUIPAMENTOS.filter(e=>e.status!=='ok').length} com alerta`, delta:'Estável', dType:'muted', color:'#059669', bar:(ok/EQUIPAMENTOS.length)*100},
    {label:'Técnicos Disp.',     value:dispTec,        unit:'',    sub:`de ${TECNICOS.length} total`, delta:'Normal', dType:'up',   color:'#6366F1', bar:null},
    {label:'SLA',                value:'94.2',         unit:'%',   sub:'Meta: ≥ 95%',              delta:'↓ 0.8pp', dType:'warn', color:'#D97706', bar:94.2},
  ];

  const statusC=s=>s==='crit'?'#DC2626':s==='warn'?'#D97706':'#059669';
  const statusL=s=>s==='crit'?'Urgente':s==='warn'?'Pendente':'Em andamento';

  return(
    <>
      {/* Alert banner */}
      {urgOS>0&&(
        <div className="mn-alert">
          <div className="mn-alert-dot"/>
          <span style={{fontWeight:700,color:'#DC2626',fontSize:'13.5px'}}>{urgOS} OS urgente{urgOS>1?'s':''}</span>
          <span style={{color:'var(--mn-text-3)',fontSize:'13px'}}>requerem atenção imediata</span>
          <button style={{marginLeft:'auto',background:'#DC2626',color:'white',border:'none',borderRadius:'9px',padding:'8px 18px',fontSize:'12.5px',fontWeight:700,cursor:'pointer',fontFamily:'var(--mn-font)'}}>Ver OS →</button>
        </div>
      )}

      {/* KPI cards */}
      <div className="mn-stat-row">
        {KPI.map((k,i)=>(
          <div key={i} className="mn-stat-card" style={{'--mn-stat-color':k.color}}>
            <div className="mn-stat-label">{k.label}</div>
            <div style={{display:'flex',alignItems:'flex-end',gap:'2px',marginBottom:'12px'}}>
              <div className="mn-stat-value" style={{color:k.color}}>{k.value}</div>
              {k.unit&&<div style={{fontSize:'16px',fontWeight:700,color:k.color,marginBottom:'6px',lineHeight:1}}>{k.unit}</div>}
            </div>
            {k.bar!==null&&(
              <div className="mn-progress-track" style={{marginBottom:'10px'}}>
                <div className="mn-progress-fill" style={{width:`${k.bar}%`,background:k.color}}/>
              </div>
            )}
            <div className="mn-stat-footer">
              <span className="mn-stat-last">{k.sub}</span>
              <span className={`mn-delta ${k.dType}`}>{k.delta}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="mn-chart-row">
        <div className="mn-chart-card">
          <div className="mn-chart-header">
            <div>
              <div className="mn-chart-title">OS por Semana</div>
              <div className="mn-chart-sub">Volume de ordens abertas · 8 semanas</div>
            </div>
            <select className="mn-period-select"><option>Esta Semana</option><option>Este Mês</option></select>
          </div>
          <OsBarChart data={OS_ABT} labels={SEMANAS}/>
        </div>
        <div className="mn-chart-card">
          <div className="mn-chart-header">
            <div><div className="mn-chart-title">Abertas vs Concluídas</div><div className="mn-chart-sub">Comparativo semanal</div></div>
          </div>
          <div className="mn-chart-legend">
            <div className="mn-legend-item"><span className="mn-legend-dot" style={{background:'#E8572A'}}/> Abertas</div>
            <div className="mn-legend-item"><span className="mn-legend-dot" style={{background:'#111827'}}/> Concluídas</div>
          </div>
          <DualBarChart dataA={OS_ABT} dataB={OS_CON} labels={SEMANAS}/>
        </div>
      </div>

      {/* OS table */}
      <div className="mn-table-card">
        <div className="mn-table-head">
          <div>
            <span className="mn-table-title">OS Recentes</span>
            <div style={{fontSize:'12px',color:'var(--mn-text-3)',marginTop:'2px'}}>{OS_LIST.length} ordens · {urgOS} urgentes</div>
          </div>
          <div className="mn-table-actions">
            <div className="mn-search-box"><IcoSearch/><input type="text" placeholder="Buscar OS..."/></div>
            <button className="mn-sort-btn"><IcoSort/> Filtrar</button>
          </div>
        </div>
        <table className="mn-data-table">
          <thead><tr><th>Ordem</th><th>Equipamento</th><th>Descrição</th><th>Tipo</th><th>Prioridade</th><th>Responsável</th><th>Status</th></tr></thead>
          <tbody>{OS_LIST.map((o,i)=>(
            <tr key={i}>
              <td className="mn-td-mono mn-td-bold" style={{color:'var(--mn-orange)'}}>{o.id}</td>
              <td className="mn-td-bold">{o.equip}</td>
              <td className="mn-td-muted" style={{maxWidth:180,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{o.desc}</td>
              <td><span className="mn-badge mn-badge-muted">{o.tipo}</span></td>
              <td><span className={`mn-badge mn-badge-${o.prior==='Alta'?'crit':o.prior==='Média'?'warn':'muted'}`}>{o.prior}</span></td>
              <td style={{fontWeight:500}}>{o.resp}</td>
              <td><span className="mn-status-dot" style={{color:statusC(o.status)}}>{statusL(o.status)}</span></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </>
  );
}

function OSView(){
  const [tipo,setTipo]=useState('todos');
  const filtered=tipo==='todos'?OS_LIST:OS_LIST.filter(o=>o.tipo===tipo);
  return(
    <div className="mn-view-wrap">
      <div className="mn-filter-tabs">
        {['todos','Corretiva','Preventiva','Preditiva'].map(t=>(
          <button key={t} className={`mn-filter-tab${tipo===t?' active':''}`} onClick={()=>setTipo(t)}>
            {t==='todos'?'Todas':t}
          </button>
        ))}
      </div>
      <div className="mn-table-card">
        <div className="mn-table-head">
          <span className="mn-table-title">Ordens de Serviço ({filtered.length})</span>
          <span className={`mn-badge mn-badge-crit`}>{OS_LIST.filter(o=>o.status==='crit').length} urgentes</span>
        </div>
        <table className="mn-data-table">
          <thead><tr><th>OS</th><th>Equipamento</th><th>Descrição</th><th>Tipo</th><th>Prioridade</th><th>Responsável</th><th>Abertura</th><th>Status</th></tr></thead>
          <tbody>{filtered.map((o,i)=>(
            <tr key={i}>
              <td className="mn-td-mono mn-td-bold">{o.id}</td>
              <td className="mn-td-bold">{o.equip}</td>
              <td className="mn-td-muted" style={{maxWidth:160,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{o.desc}</td>
              <td className="mn-td-muted">{o.tipo}</td>
              <td><span className={`mn-badge mn-badge-${o.prior==='Alta'?'crit':o.prior==='Média'?'warn':'muted'}`}>{o.prior}</span></td>
              <td>{o.resp}</td>
              <td className="mn-td-mono">{o.abertura}</td>
              <td><span className={`mn-badge mn-badge-${o.status==='crit'?'crit':o.status==='warn'?'orange':'ok'}`}>{o.status==='crit'?'Urgente':o.status==='warn'?'Pendente':'Em andamento'}</span></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

function EquipamentosView(){
  const [filter,setFilter]=useState('todos');
  const filtered=filter==='todos'?EQUIPAMENTOS:EQUIPAMENTOS.filter(e=>e.status===filter);
  const counts={ok:EQUIPAMENTOS.filter(e=>e.status==='ok').length,warn:EQUIPAMENTOS.filter(e=>e.status==='warn').length,crit:EQUIPAMENTOS.filter(e=>e.status==='crit').length};
  const dispC=d=>d>=95?'#059669':d>=80?'#D97706':'#DC2626';
  return(
    <div className="mn-view-wrap">
      <div className="mn-mini-stats">
        {[
          {l:'Total',        v:EQUIPAMENTOS.length, c:'#E8572A', sub:'na frota'},
          {l:'Operacionais', v:counts.ok,           c:'#059669', sub:`${Math.round(counts.ok/EQUIPAMENTOS.length*100)}% disponíveis`},
          {l:'Atenção',      v:counts.warn,         c:'#D97706', sub:'monitoramento'},
          {l:'Críticos',     v:counts.crit,         c:'#DC2626', sub:'fora de operação'},
        ].map((m,i)=>(
          <div key={i} className="mn-mini-stat" style={{'--mn-stat-color':m.c}}>
            <div className="mn-mini-stat-label">{m.l}</div>
            <div className="mn-mini-stat-value" style={{color:m.c}}>{m.v}</div>
            <div style={{fontSize:'11px',color:'var(--mn-text-3)',marginTop:'3px'}}>{m.sub}</div>
          </div>
        ))}
      </div>
      <div style={{marginBottom:'18px'}}>
        <div className="mn-filter-tabs">
          {[{k:'todos',l:'Todos'},{k:'ok',l:'Operacionais'},{k:'warn',l:'Atenção'},{k:'crit',l:'Críticos'}].map(f=>(
            <button key={f.k} className={`mn-filter-tab${filter===f.k?' active':''}`} onClick={()=>setFilter(f.k)}>{f.l}</button>
          ))}
        </div>
      </div>
      <div className="mn-equip-grid">
        {filtered.map((e,i)=>(
          <div key={i} className="mn-equip-card" style={{'--mn-card-color':dispC(e.disp)}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'16px'}}>
              <div>
                <div style={{fontWeight:700,fontSize:'14px',color:'var(--mn-text)',lineHeight:1.3,marginBottom:'3px'}}>{e.nome}</div>
                <div style={{fontSize:'11.5px',color:'var(--mn-text-3)'}}>{e.tipo}</div>
              </div>
              <span className={`mn-badge mn-badge-${e.status==='ok'?'ok':e.status==='warn'?'warn':'crit'}`} style={{fontSize:'10.5px',flexShrink:0,marginLeft:'8px'}}>
                {e.status==='ok'?'OK':e.status==='warn'?'Atenção':'Crítico'}
              </span>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:'8px'}}>
              <div>
                <div style={{fontSize:'10px',fontWeight:700,letterSpacing:'0.07em',textTransform:'uppercase',color:'var(--mn-text-3)',marginBottom:'4px'}}>Disponibilidade</div>
                <div style={{fontSize:'28px',fontWeight:700,letterSpacing:'-0.04em',color:dispC(e.disp),lineHeight:1}}>{e.disp}%</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontFamily:'var(--mn-mono)',fontSize:'11px',color:'var(--mn-text-3)',marginBottom:'2px'}}>{e.id}</div>
                <div style={{fontSize:'12px',color:'var(--mn-text-2)',fontWeight:500}}>{e.loc}</div>
              </div>
            </div>
            <div className="mn-progress-track">
              <div className="mn-progress-fill" style={{width:`${e.disp}%`,background:dispC(e.disp)}}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


function AgendaView(){
  return(
    <div className="mn-view-wrap">
      <div className="mn-table-card">
        <div className="mn-table-head">
          <span className="mn-table-title">Agenda — Próxima Semana</span>
          <span className="mn-badge mn-badge-accent">{AGENDA.length} atividades</span>
        </div>
        <table className="mn-data-table">
          <thead><tr><th>Data</th><th>Hora</th><th>Equipamento</th><th>Atividade</th><th>Tipo</th><th>Responsável</th><th>Duração</th></tr></thead>
          <tbody>{AGENDA.map((a,i)=>(
            <tr key={i}>
              <td className="mn-td-mono">{a.data}</td>
              <td className="mn-td-mono">{a.hora}</td>
              <td className="mn-td-bold">{a.equip}</td>
              <td className="mn-td-muted">{a.ativ}</td>
              <td><span className={`mn-badge mn-badge-${a.tipo==='Prev.'?'accent':a.tipo==='Corr.'?'crit':'warn'}`}>{a.tipo}</span></td>
              <td>{a.resp}</td>
              <td className="mn-td-mono">{a.dur}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

function TecnicosView(){
  const avail=TECNICOS.filter(t=>t.status==='ok').length;
  const COLORS=['#E8572A','#059669','#6366F1','#D97706','#EC4899','#0EA5E9'];
  return(
    <div className="mn-view-wrap">
      <div className="mn-mini-stats">
        {[
          {l:'Total',      v:TECNICOS.length, c:'#E8572A', sub:'na equipe'},
          {l:'Disponíveis',v:avail,           c:'#059669', sub:'prontos para OS'},
          {l:'Em OS',      v:TECNICOS.length-avail, c:'#D97706', sub:'em campo'},
        ].map((m,i)=>(
          <div key={i} className="mn-mini-stat">
            <div className="mn-mini-stat-label">{m.l}</div>
            <div className="mn-mini-stat-value" style={{color:m.c}}>{m.v}</div>
            <div style={{fontSize:'11px',color:'var(--mn-text-3)',marginTop:'3px'}}>{m.sub}</div>
          </div>
        ))}
      </div>
      <div className="mn-equip-grid" style={{gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))'}}>
        {TECNICOS.map((t,i)=>(
          <div key={i} className="mn-equip-card" style={{'--mn-card-color':t.status==='ok'?'#059669':'#D97706'}}>
            <div className="mn-avatar" style={{background:t.status==='ok'?'rgba(5,150,105,0.1)':'rgba(217,119,6,0.1)',color:COLORS[i%COLORS.length]}}>
              {t.nome.split(' ').map(n=>n[0]).join('').slice(0,2)}
            </div>
            <div style={{fontWeight:700,fontSize:'14px',color:'var(--mn-text)',marginBottom:'2px'}}>{t.nome}</div>
            <div style={{fontSize:'12px',color:'var(--mn-text-3)',marginBottom:'14px'}}>{t.esp}</div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'10px'}}>
              <span className={`mn-badge mn-badge-${t.status==='ok'?'ok':'warn'}`} style={{fontSize:'10.5px'}}>
                {t.status==='ok'?'Disponível':'Em OS'}
              </span>
              <span style={{fontFamily:'var(--mn-mono)',fontSize:'12px',color:'var(--mn-text-2)',fontWeight:600}}>{t.os} OS</span>
            </div>
            <div style={{fontSize:'11.5px',color:'var(--mn-text-3)',borderTop:'1px solid var(--mn-border)',paddingTop:'10px',lineHeight:1.4}}>
              {t.disp}
            </div>
          </div>
        ))}
      </div>
      <div className="mn-table-card" style={{marginTop:'18px'}}>
        <div className="mn-table-head"><span className="mn-table-title">Equipe Técnica</span></div>
        <table className="mn-data-table">
          <thead><tr><th>Técnico</th><th>Especialidade</th><th>OS Ativas</th><th>Situação</th><th>Status</th></tr></thead>
          <tbody>{TECNICOS.map((t,i)=>(
            <tr key={i}>
              <td className="mn-td-bold">{t.nome}</td>
              <td className="mn-td-muted">{t.esp}</td>
              <td className="mn-td-mono" style={{textAlign:'center'}}>{t.os}</td>
              <td className="mn-td-muted">{t.disp}</td>
              <td><span className={`mn-badge mn-badge-${t.status==='ok'?'ok':'orange'}`}>{t.status==='ok'?'Disponível':'Em atividade'}</span></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

function PecasView(){
  return(
    <div className="mn-view-wrap">
      <div className="mn-mini-stats">
        {[{l:'Itens em Estoque',v:PECAS.length,c:'#E8572A'},{l:'Estoque Crítico',v:PECAS.filter(p=>p.status==='crit').length,c:'#DC2626'},{l:'Atenção',v:PECAS.filter(p=>p.status==='warn').length,c:'#D97706'}].map((m,i)=>(
          <div key={i} className="mn-mini-stat"><div className="mn-mini-stat-label">{m.l}</div><div className="mn-mini-stat-value" style={{color:m.c}}>{m.v}</div></div>
        ))}
      </div>
      <div className="mn-table-card">
        <div className="mn-table-head">
          <span className="mn-table-title">Peças e Estoque</span>
          <span className="mn-badge mn-badge-crit">{PECAS.filter(p=>p.status==='crit').length} reposições urgentes</span>
        </div>
        <table className="mn-data-table">
          <thead><tr><th>Código</th><th>Peça</th><th>Qtd. Atual</th><th>Qtd. Mínima</th><th>Localização</th><th>Status</th></tr></thead>
          <tbody>{PECAS.map((p,i)=>(
            <tr key={i}>
              <td className="mn-td-mono mn-td-bold">{p.cod}</td>
              <td className="mn-td-bold">{p.nome}</td>
              <td style={{fontFamily:'var(--mn-mono)',fontWeight:600,textAlign:'center',color:p.status==='ok'?'#16A34A':p.status==='warn'?'#D97706':'#DC2626'}}>{p.qtd}</td>
              <td className="mn-td-mono" style={{textAlign:'center'}}>{p.min}</td>
              <td className="mn-td-muted">{p.loc}</td>
              <td><span className={`mn-badge mn-badge-${p.status==='ok'?'ok':p.status==='warn'?'warn':'crit'}`}>{p.status==='ok'?'Normal':p.status==='warn'?'Atenção':'Crítico'}</span></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

function IndicadoresView(){
  const [filtros,setFiltros]=useState({periodo:'Jun 2026',empresa:'Todos',frota:'Todas',equip:'Todos',tipo:'Todos',statusOS:'Todos',resp:'Todos',cc:'Todos'});
  const setF=(k,v)=>setFiltros(f=>({...f,[k]:v}));
  const sel=s=>`<option>${s}</option>`;

  const KPIS=[
    {label:'Total de OS',        valor:134,     unit:'',    delta:'+12%',   dType:'up',   meta:'—',      color:'#3B82F6', bar:null},
    {label:'OS em Andamento',    valor:8,       unit:'',    delta:'-11%',   dType:'up',   meta:'< 12',   color:'#F59E0B', bar:null},
    {label:'OS Abertas',         valor:12,      unit:'',    delta:'+33%',   dType:'down', meta:'< 10',   color:'#E8572A', bar:null},
    {label:'OS Fechadas',        valor:109,     unit:'',    delta:'+14%',   dType:'up',   meta:'≥ 100',  color:'#059669', bar:null},
    {label:'Disponibilidade',    valor:'94.2',  unit:'%',   delta:'+0.7pp', dType:'warn', meta:'≥ 95%',  color:'#D97706', bar:94.2},
    {label:'Horas de Manutenção',valor:'42',    unit:'h',   delta:'+8h',    dType:'down', meta:'< 30h',  color:'#DC2626', bar:null},
    {label:'MTTR',               valor:'4.2',   unit:'h',   delta:'-0.4h',  dType:'up',   meta:'< 5h',   color:'#059669', bar:null},
    {label:'MTBF',               valor:'312',   unit:'h',   delta:'+4h',    dType:'up',   meta:'> 300h', color:'#059669', bar:null},
  ];

  const statusColor=s=>s==='crit'?'#DC2626':s==='warn'?'#F59E0B':'#059669';
  const statusTxt  =s=>s==='crit'?'Urgente':s==='warn'?'Pendente':'Concluído';
  const priorColor =p=>p==='Alta'?'mn-badge-crit':p==='Média'?'mn-badge-warn':'mn-badge-muted';
  const deltaColor =d=>d==='up'?'#059669':d==='down'?'#DC2626':'#D97706';

  const SELECT_STYLE={fontSize:'12px',border:'1px solid var(--mn-border)',borderRadius:'8px',padding:'6px 10px',background:'white',color:'var(--mn-text-2)',outline:'none',cursor:'pointer',fontFamily:'var(--mn-font)'};

  return(
    <div className="mn-view-wrap" style={{paddingTop:0}}>

      {/* ── FILTROS ── */}
      <div style={{background:'white',border:'1px solid var(--mn-border)',borderRadius:'var(--mn-radius)',padding:'14px 18px',marginBottom:'20px',display:'flex',gap:'10px',flexWrap:'wrap',alignItems:'center'}}>
        <span style={{fontSize:'12px',fontWeight:700,color:'var(--mn-text-2)',marginRight:4}}>Filtros:</span>
        {[
          {k:'periodo', label:'Período',            opts:['Jun 2026','Mai 2026','Abr 2026','1T 2026','2025']},
          {k:'empresa', label:'Empresa/Contrato',   opts:['Todos','Lynus Tech','Contrato A','Contrato B']},
          {k:'frota',   label:'Frota',              opts:['Todas','Frota 1','Frota 2','Frota Externa']},
          {k:'equip',   label:'Equipamento',        opts:['Todos','Esteira 2','Chiller 1','Motor Principal','Caldeira B1']},
          {k:'tipo',    label:'Tipo de Manutenção', opts:['Todos','Preventiva','Corretiva','Preditiva']},
          {k:'statusOS',label:'Status OS',          opts:['Todos','Abertas','Em Andamento','Concluídas','Atrasadas']},
          {k:'resp',    label:'Responsável',        opts:['Todos','Carlos M.','Ana S.','Lucas T.','Pedro R.','Maria L.']},
          {k:'cc',      label:'Centro de Custo',    opts:['Todos','CC-001 Produção','CC-002 Utilidades','CC-003 TI']},
        ].map(f=>(
          <div key={f.k} style={{display:'flex',flexDirection:'column',gap:'2px'}}>
            <label style={{fontSize:'9.5px',fontWeight:600,color:'var(--mn-text-3)',letterSpacing:'0.06em',textTransform:'uppercase'}}>{f.label}</label>
            <select style={SELECT_STYLE} value={filtros[f.k]} onChange={e=>setF(f.k,e.target.value)}>
              {f.opts.map(o=><option key={o}>{o}</option>)}
            </select>
          </div>
        ))}
      </div>

      {/* ── 8 KPI CARDS ── */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'14px',marginBottom:'24px'}}>
        {KPIS.map((k,i)=>(
          <div key={i} className="mn-stat-card" style={{'--mn-stat-color':k.color}}>
            <div className="mn-stat-label">{k.label}</div>
            <div style={{display:'flex',alignItems:'flex-end',gap:'2px',margin:'8px 0 10px'}}>
              <div style={{fontSize:'36px',fontWeight:700,letterSpacing:'-0.05em',lineHeight:1,color:k.color}}>{k.valor}</div>
              <div style={{fontSize:'16px',fontWeight:700,color:k.color,marginBottom:'4px',lineHeight:1}}>{k.unit}</div>
            </div>
            {k.bar!==null&&(
              <div className="mn-progress-track" style={{marginBottom:'10px'}}>
                <div className="mn-progress-fill" style={{width:`${k.bar}%`,background:k.color}}/>
              </div>
            )}
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{fontSize:'11px',fontWeight:700,color:deltaColor(k.dType)}}>{k.delta} vs mês</span>
              <span style={{fontSize:'10.5px',color:'var(--mn-text-3)'}}>meta: {k.meta}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── DISPONIBILIDADE — gráfico em destaque ── */}
      {(()=>{
        const atual=DISP_MENSAL[DISP_MENSAL.length-1];
        const minD=Math.min(...DISP_MENSAL), maxD=Math.max(...DISP_MENSAL);
        const avg=(DISP_MENSAL.reduce((a,b)=>a+b,0)/DISP_MENSAL.length).toFixed(1);
        const abaixoMeta=DISP_MENSAL.filter(v=>v<95).length;
        return(
          <div className="mn-chart-card" style={{marginBottom:'16px'}}>
            <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:'18px',flexWrap:'wrap',gap:'12px'}}>
              <div>
                <div className="mn-chart-title">Disponibilidade da Frota</div>
                <div className="mn-chart-sub">Evolução mensal · Jan–Dez 2026 · Meta: 95%</div>
              </div>
              <div style={{display:'flex',gap:'20px',flexWrap:'wrap'}}>
                {[
                  {l:'Atual',     v:`${atual}%`,  c:atual>=95?'#059669':'#D97706'},
                  {l:'Mínima',    v:`${minD}%`,   c:'#DC2626'},
                  {l:'Máxima',    v:`${maxD}%`,   c:'#059669'},
                  {l:'Média',     v:`${avg}%`,     c:'#3B82F6'},
                  {l:'< Meta',    v:`${abaixoMeta} meses`, c:'#DC2626'},
                ].map((s,i)=>(
                  <div key={i} style={{textAlign:'center'}}>
                    <div style={{fontSize:'10px',fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',color:'var(--mn-text-3)',marginBottom:'3px'}}>{s.l}</div>
                    <div style={{fontSize:'16px',fontWeight:700,color:s.c,letterSpacing:'-0.02em'}}>{s.v}</div>
                  </div>
                ))}
              </div>
            </div>
            <LineChart
              data={DISP_MENSAL} labels={MESES_12}
              color='#3B82F6' min={88} max={97} unit='%'
              refLine={95} refLabel='meta 95%'
              chartH={130}
            />
          </div>
        );
      })()}

      {/* ── GRÁFICOS LINHA 1: OS por Status ── */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1.4fr',gap:'16px',marginBottom:'16px'}}>
        {/* OS por Status — barras verticais */}
        <div className="mn-chart-card">
          <div className="mn-chart-header">
            <div><div className="mn-chart-title">OS por Status</div><div className="mn-chart-sub">Distribuição atual</div></div>
          </div>
          <div style={{display:'flex',alignItems:'flex-end',gap:'18px',height:'120px',paddingBottom:'4px'}}>
            {OS_POR_STATUS.map((s,i)=>{
              const maxV=Math.max(...OS_POR_STATUS.map(x=>x.v));
              return(
                <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:'4px',height:'100%',justifyContent:'flex-end'}}>
                  <span style={{fontSize:'13px',fontWeight:700,color:s.color}}>{s.v}</span>
                  <div style={{width:'100%',borderRadius:'6px 6px 0 0',background:s.color,height:`${(s.v/maxV)*85}%`,opacity:0.85,minHeight:4}}/>
                  <span style={{fontSize:'10px',color:'var(--mn-text-3)',textAlign:'center',lineHeight:1.2}}>{s.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* MTBF / MTTR evolução */}
        <div className="mn-chart-card">
          <div className="mn-chart-header">
            <div><div className="mn-chart-title">Evolução MTBF / MTTR</div><div className="mn-chart-sub">Últimos 12 meses</div></div>
          </div>
          <div style={{marginBottom:'10px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'4px'}}>
              <span style={{width:10,height:3,borderRadius:2,background:'#059669',display:'inline-block'}}/>
              <span style={{fontSize:'11px',color:'var(--mn-text-2)'}}>MTBF (h) — meta &gt; 300h</span>
            </div>
            <LineChart data={MTBF_MENSAL} labels={MESES_12} color='#059669' min={260} max={345} unit='h' refLine={300} refLabel='meta 300h' chartH={70}/>
          </div>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'4px'}}>
              <span style={{width:10,height:3,borderRadius:2,background:'#DC2626',display:'inline-block'}}/>
              <span style={{fontSize:'11px',color:'var(--mn-text-2)'}}>MTTR (h) — meta &lt; 5h</span>
            </div>
            <LineChart data={MTTR_MENSAL} labels={MESES_12} color='#DC2626' min={3} max={7} unit='h' refLine={5} refLabel='meta 5h' chartH={70}/>
          </div>
        </div>
      </div>

      {/* ── GRÁFICOS LINHA 2: Preventiva x Corretiva + OS por Responsável ── */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1.3fr',gap:'16px',marginBottom:'16px'}}>
        {/* Donut preventiva x corretiva */}
        <div className="mn-chart-card">
          <div className="mn-chart-header">
            <div><div className="mn-chart-title">Preventiva × Corretiva</div><div className="mn-chart-sub">Distribuição das OS</div></div>
          </div>
          <DonutChart segments={[
            {label:'Preventiva',v:78, color:'#16A34A'},
            {label:'Corretiva', v:22, color:'#DC2626'},
            {label:'Preditiva', v:12, color:'#3B82F6'},
          ]}/>
        </div>

        {/* OS por Responsável */}
        <div className="mn-chart-card">
          <div className="mn-chart-header">
            <div><div className="mn-chart-title">OS por Responsável</div><div className="mn-chart-sub">Volume acumulado</div></div>
          </div>
          <HBarChart data={OS_POR_RESP.map(d=>({...d,v:d.os}))} maxV={30} colorFn={(_,i)=>['#E8572A','#F59E0B','#3B82F6','#16A34A','#6366F1','#9CA3AF'][i]}/>
        </div>
      </div>

      {/* ── GRÁFICOS LINHA 3: Ranking Equipamentos + MTBF/MTTR + Backlog ── */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1.3fr 0.9fr',gap:'16px',marginBottom:'20px'}}>
        {/* Ranking equipamentos */}
        <div className="mn-chart-card">
          <div className="mn-chart-header">
            <div><div className="mn-chart-title">Top Equipamentos</div><div className="mn-chart-sub">Mais manutenções</div></div>
          </div>
          <HBarChart data={EQUIP_RANK.map(d=>({...d,v:d.os}))} maxV={25} colorFn={(_,i)=>i===0?'#DC2626':i===1?'#F59E0B':'#3B82F6'}/>
        </div>

        {/* Backlog por prioridade */}
        <div className="mn-chart-card">
          <div className="mn-chart-header">
            <div><div className="mn-chart-title">Backlog por Prioridade</div><div className="mn-chart-sub">Total: {BACKLOG_PRIOR.reduce((s,b)=>s+b.qtd,0)} OS</div></div>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'14px',marginTop:'8px'}}>
            {BACKLOG_PRIOR.map((b,i)=>(
              <div key={i}>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:'12px',marginBottom:'5px'}}>
                  <span style={{fontWeight:600,color:b.color}}>{b.prior}</span>
                  <span style={{fontWeight:700,color:b.color}}>{b.qtd} OS</span>
                </div>
                <div style={{height:'10px',background:'#F3F4F6',borderRadius:'6px',overflow:'hidden'}}>
                  <div style={{height:'100%',width:`${(b.qtd/27)*100}%`,background:b.color,borderRadius:'6px',transition:'width 1s ease'}}/>
                </div>
              </div>
            ))}
          </div>
          <div style={{marginTop:'16px',paddingTop:'12px',borderTop:'1px solid var(--mn-border)'}}>
            {EQUIP_RANK.slice(0,3).map((e,i)=>(
              <div key={i} style={{display:'flex',justifyContent:'space-between',fontSize:'11.5px',padding:'3px 0',borderBottom:'1px solid #F3F4F6'}}>
                <span style={{color:'var(--mn-text)',fontWeight:600}}>{e.nome}</span>
                <span style={{color:'#E8572A',fontFamily:'monospace',fontWeight:700}}>R$ {(e.custo/1000).toFixed(1)}K</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TABELA DETALHADA ── */}
      <div className="mn-table-card">
        <div className="mn-table-head">
          <span className="mn-table-title">Tabela Detalhada de OS</span>
          <div className="mn-table-actions">
            <div className="mn-search-box"><IcoSearch/><input type="text" placeholder="Buscar OS..."/></div>
            <button className="mn-sort-btn"><IcoSort/> Filtrar</button>
          </div>
        </div>
        <div style={{overflowX:'auto'}}>
          <table className="mn-data-table" style={{minWidth:'1000px'}}>
            <thead><tr>
              <th>Nº OS</th><th>Equipamento</th><th>Placa/Código</th><th>Tipo</th>
              <th>Status</th><th>Abertura</th><th>Prazo</th><th>Responsável</th>
              <th>T. Parado</th><th>Custo</th><th>Prioridade</th>
            </tr></thead>
            <tbody>{OS_DETAIL.map((o,i)=>(
              <tr key={i}>
                <td className="mn-td-mono mn-td-bold">{o.id}</td>
                <td className="mn-td-bold">{o.equip}</td>
                <td className="mn-td-mono" style={{color:'var(--mn-text-2)'}}>{o.placa}</td>
                <td><span className="mn-badge mn-badge-muted">{o.tipo}</span></td>
                <td><span className="mn-badge" style={{background:`${statusColor(o.status)}18`,color:statusColor(o.status)}}>{statusTxt(o.status)}</span></td>
                <td className="mn-td-mono">{o.abertura}</td>
                <td className="mn-td-mono" style={{color:o.status==='crit'?'#DC2626':'inherit'}}>{o.prazo}</td>
                <td>{o.resp}</td>
                <td className="mn-td-mono" style={{color:parseInt(o.tParado)>4?'#DC2626':parseInt(o.tParado)>1?'#D97706':'#16A34A',fontWeight:600}}>{o.tParado}</td>
                <td className="mn-td-mono" style={{fontWeight:700,color:'#E8572A'}}>R$ {o.custo.toLocaleString('pt-BR')}</td>
                <td><span className={`mn-badge ${priorColor(o.prior)}`}>{o.prior}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ExportarView(){
  const [done,setDone]=useState(null);
  const go=f=>{setDone(null);setTimeout(()=>setDone(f),900);};
  const items=[
    {fmt:'PDF',    label:'Relatório de OS',         desc:'OS abertas e concluídas no período.', Icon:<IcoOS/>},
    {fmt:'Excel',  label:'Planilha de Equipamentos', desc:'Status, disponibilidade e histórico.', Icon:<IcoEquip/>},
    {fmt:'CSV',    label:'Histórico Completo',       desc:'Todos os registros para análise.',     Icon:<IcoKPI/>},
    {fmt:'PDF KPIs',label:'Relatório de KPIs',      desc:'Indicadores de desempenho formatados.',Icon:<IcoKPI/>},
  ];
  return(
    <div className="mn-view-wrap" style={{maxWidth:'540px'}}>
      {done&&<div className="mn-success-msg">✓ {done} exportado com sucesso!</div>}
      {items.map((f,i)=>(
        <div key={i} className="mn-chart-card" style={{display:'flex',alignItems:'center',gap:'16px',marginBottom:'12px'}}>
          <div style={{width:40,height:40,borderRadius:'10px',background:'var(--mn-orange-s)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--mn-orange)',flexShrink:0}}>{f.Icon}</div>
          <div style={{flex:1}}>
            <div style={{fontWeight:600,fontSize:'14px',color:'var(--mn-text)'}}>{f.label}</div>
            <div style={{fontSize:'12.5px',color:'var(--mn-text-2)',marginTop:'2px'}}>{f.desc}</div>
          </div>
          <button className="mn-btn mn-btn-ghost mn-btn-sm" onClick={()=>go(f.fmt)}>Exportar</button>
        </div>
      ))}
    </div>
  );
}

function ConfigView(){
  const [saved,setSaved]=useState(false);
  const [form,setForm]=useState({planta:'Planta Principal',turno:'A',alertaCrit:'WhatsApp + Email',alertaWarn:'Email',backupFreq:'Diário'});
  const save=()=>{setSaved(true);setTimeout(()=>setSaved(false),3000);};
  return(
    <div className="mn-view-wrap" style={{maxWidth:'520px'}}>
      {saved&&<div className="mn-success-msg">✓ Configurações salvas!</div>}
      <div className="mn-chart-card" style={{display:'flex',flexDirection:'column',gap:'16px'}}>
        {[{l:'Nome da Planta',k:'planta'},{l:'Turno Padrão',k:'turno'},{l:'Alerta Crítico via',k:'alertaCrit'},{l:'Alerta Atenção via',k:'alertaWarn'},{l:'Frequência de Backup',k:'backupFreq'}].map(f=>(
          <div key={f.k}>
            <label style={{fontSize:'12.5px',fontWeight:600,color:'var(--mn-text-2)',display:'block',marginBottom:'6px'}}>{f.l}</label>
            <input className="mn-input" value={form[f.k]} onChange={e=>setForm(v=>({...v,[f.k]:e.target.value}))}/>
          </div>
        ))}
        <button className="mn-btn mn-btn-primary" style={{width:'100%',marginTop:'4px'}} onClick={save}>Salvar Configurações</button>
      </div>
    </div>
  );
}

// ================================================================
// NAV
// ================================================================
const NAV_GROUPS=[
  {group:'Menu', items:[
    {id:'dashboard', title:'Dashboard',         Icon:IcoDash,    badge:null},
    {id:'os',        title:'Ordens de Serviço', Icon:IcoOS,      badge:OS_LIST.filter(o=>o.status==='crit').length||null},
    {id:'equip',     title:'Equipamentos',      Icon:IcoEquip,   badge:null},
    {id:'agenda',    title:'Agenda',            Icon:IcoAgenda,  badge:null},
  ]},
  {group:'Operacional', items:[
    {id:'tecnicos',  title:'Técnicos',          Icon:IcoTecnico, badge:null},
    {id:'pecas',     title:'Estoque',           Icon:IcoPecas,   badge:PECAS.filter(p=>p.status==='crit').length||null},
  ]},
  {group:'Relatórios', items:[
    {id:'indicadores',title:'Indicadores',      Icon:IcoKPI,     badge:null},
    {id:'exportar',  title:'Exportar',          Icon:IcoExport,  badge:null},
  ]},
  {group:'Sistema', items:[
    {id:'config',    title:'Configurações',     Icon:IcoConfig,  badge:null},
  ]},
];

const VIEW_TITLE={dashboard:'Dashboard',os:'Ordens de Serviço',equip:'Equipamentos',agenda:'Agenda',tecnicos:'Técnicos',pecas:'Estoque',indicadores:'Indicadores',exportar:'Exportar',config:'Configurações'};

// ================================================================
// APP
// ================================================================
function App(){
  const [view,setView]=useState('dashboard');
  const VIEWS={
    dashboard:<DashboardView/>, os:<OSView/>, equip:<EquipamentosView/>,
    agenda:<AgendaView/>, tecnicos:<TecnicosView/>, pecas:<PecasView/>,
    indicadores:<IndicadoresView/>, exportar:<ExportarView/>, config:<ConfigView/>,
  };
  return(
    <div className="mn-layout">
      {/* ---- SIDEBAR ---- */}
      <aside className="mn-sidebar">
        {/* Logo */}
        <div className="mn-sidebar-header" style={{justifyContent:'center',paddingLeft:'12px',paddingRight:'12px'}}>
          <LogoMark/>
        </div>

        {/* Nav groups */}
        {NAV_GROUPS.map(g=>(
          <div key={g.group} className="mn-nav-group">
            <div className="mn-nav-group-label">{g.group}</div>
            {g.items.map(it=>(
              <button key={it.id} className={`mn-nav-btn${view===it.id?' active':''}`} onClick={()=>setView(it.id)}>
                <it.Icon/>
                {it.title}
                {it.badge&&<span className="mn-nav-badge">{it.badge}</span>}
              </button>
            ))}
          </div>
        ))}

        {/* Bottom */}
        <div className="mn-sidebar-bottom">
          <a href="index.html" style={{textDecoration:'none'}}>
            <button className="mn-nav-btn"><IcoBack/> Voltar ao site</button>
          </a>
        </div>
      </aside>

      {/* ---- MAIN ---- */}
      <main className="mn-main">
        <div className="mn-topbar">
          <div>
            <div className="mn-page-title">{VIEW_TITLE[view]}</div>
            <div className="mn-page-sub">Planejamento e Controle de Manutenção · Jun 2026</div>
          </div>
          <div className="mn-topbar-right">
            <button className="mn-date-btn"><IcoCal/> Jun 2026 ▾</button>
          </div>
        </div>
        <div className="mn-content">
          {VIEWS[view]}
        </div>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
