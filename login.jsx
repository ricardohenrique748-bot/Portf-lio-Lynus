/* ============================================================
   LYNUS TECH — Login / Cadastro
   ============================================================ */
const { useState, useEffect, useRef } = React;

/* ---- Three.js background ---- */
function ThreeBg() {
  const ref = useRef(null);
  useEffect(() => {
    const T = window.THREE, canvas = ref.current;
    if (!T || !canvas) return;
    const renderer = new T.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    const scene = new T.Scene();
    const camera = new T.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.z = 7;
    const mkPts = (n, spread, color, size) => {
      const geo = new T.BufferGeometry();
      const pos = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) { pos[i*3]=(Math.random()-.5)*spread; pos[i*3+1]=(Math.random()-.5)*spread; pos[i*3+2]=(Math.random()-.5)*spread*.6; }
      geo.setAttribute('position', new T.BufferAttribute(pos, 3));
      return new T.Points(geo, new T.PointsMaterial({ color, size, transparent: true, opacity: 0.6, sizeAttenuation: true }));
    };
    const p1 = mkPts(700, 26, 0x6b8aff, 0.028);
    const p2 = mkPts(160, 22, 0x36d0e8, 0.05);
    scene.add(p1, p2);
    let mx = 0, my = 0, lx = 0, ly = 0;
    const lerp = (a, b, t) => a + (b - a) * t;
    const onMouse = e => { mx = (e.clientX/window.innerWidth-.5)*2; my = (e.clientY/window.innerHeight-.5)*2; };
    window.addEventListener('mousemove', onMouse, { passive: true });
    const clock = new T.Clock();
    let raf;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();
      lx = lerp(lx, mx, 0.025); ly = lerp(ly, my, 0.025);
      p1.rotation.y = t * 0.022 + lx * 0.14; p1.rotation.x = ly * 0.09;
      p2.rotation.y = t * 0.014 - lx * 0.07; p2.rotation.x = -ly * 0.05;
      renderer.render(scene, camera);
    };
    tick();
    canvas.classList.add('three-ready');
    const onResize = () => { camera.aspect = window.innerWidth/window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('mousemove', onMouse); window.removeEventListener('resize', onResize); renderer.dispose(); };
  }, []);
  return <canvas ref={ref} className="three-bg" aria-hidden="true" />;
}

/* ---- Cursor (dot + bubble, centered via translate(-50%,-50%)) ---- */
function Cursor() {
  const dotRef    = useRef(null);
  const bubbleRef = useRef(null);
  const raw  = useRef({ x: -200, y: -200 });
  const lerped = useRef({ x: -200, y: -200 });

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return;
    const dot = dotRef.current, bubble = bubbleRef.current;
    if (!dot || !bubble) return;

    const lerp = (a, b, t) => a + (b - a) * t;
    const onMove = e => { raw.current.x = e.clientX; raw.current.y = e.clientY; };
    window.addEventListener('mousemove', onMove, { passive: true });

    let raf;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      lerped.current.x = lerp(lerped.current.x, raw.current.x, 0.1);
      lerped.current.y = lerp(lerped.current.y, raw.current.y, 0.1);
      dot.style.transform    = `translate(${raw.current.x}px,${raw.current.y}px) translate(-50%,-50%)`;
      bubble.style.transform = `translate(${lerped.current.x}px,${lerped.current.y}px) translate(-50%,-50%)`;
    };
    requestAnimationFrame(loop);
    document.body.classList.add('custom-cursor');

    const on  = () => bubble.classList.add('cursor-hover');
    const off = () => bubble.classList.remove('cursor-hover');
    setTimeout(() => {
      document.querySelectorAll('a,button').forEach(el => {
        el.addEventListener('mouseenter', on);
        el.addEventListener('mouseleave', off);
      });
    }, 400);

    return () => { cancelAnimationFrame(raf); window.removeEventListener('mousemove', onMove); document.body.classList.remove('custom-cursor'); };
  }, []);

  return (
    <>
      <span className="login-cursor-dot"    ref={dotRef}    aria-hidden="true" />
      <span className="login-cursor-bubble" ref={bubbleRef} aria-hidden="true" />
    </>
  );
}

/* ---- Logo mark ---- */
function LogoMark() {
  const cols = [2,4,6,5,3];
  return (
    <a href="index.html" className="wordmark" aria-label="Voltar ao site">
      <div className="logo-mark">
        <div className="logo-bars" aria-hidden="true">
          {cols.map((h, ci) => (
            <div key={ci} className="logo-col">
              {Array.from({length: h}, (_, ri) => (
                <div key={ri} className={'logo-px'+(ri===h-1?' logo-px-top':'')}
                  style={{animationDelay:`${ci*.07+ri*.04}s`}} />
              ))}
            </div>
          ))}
        </div>
        <span className="logo-text">LYNUS</span>
      </div>
    </a>
  );
}

/* ---- Social icons ---- */
const ICON_GOOGLE = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.122-.843 2.072-1.796 2.716v2.258h2.908C16.658 14.131 17.64 11.824 17.64 9.2z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
);
const ICON_X = (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const ICON_APPLE = (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
  </svg>
);

const SOCIALS = [
  { id: 'google', label: 'Continuar com Google', icon: ICON_GOOGLE },
  { id: 'x',      label: 'Continuar com X',      icon: ICON_X      },
  { id: 'apple',  label: 'Continuar com Apple',   icon: ICON_APPLE  },
];

/* ---- Input field ---- */
function Field({ label, type = 'text', value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  const isPass = type === 'password';
  return (
    <div className="auth-field">
      <label className="auth-label">{label}</label>
      <div className="auth-input-wrap">
        <input
          className="auth-input"
          type={isPass && show ? 'text' : type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={isPass ? 'current-password' : type === 'email' ? 'email' : 'name'}
        />
        {isPass && (
          <button type="button" className="auth-eye" onClick={() => setShow(s => !s)} aria-label="Ver senha">
            {show ? '🙈' : '👁'}
          </button>
        )}
      </div>
    </div>
  );
}

/* ---- Main auth card ---- */
function AuthCard() {
  const [tab,   setTab]  = useState('login');
  const [nome,  setNome] = useState('');
  const [email, setEmail]= useState('');
  const [senha, setSenha]= useState('');
  const [conf,  setConf] = useState('');
  const [loading, setLoad]= useState(false);
  const [msg,   setMsg]  = useState(null);

  const cardRef = useRef(null);

  useEffect(() => {
    if (!window.gsap || !cardRef.current) return;
    gsap.fromTo(cardRef.current, { y: 44, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out', delay: 0.15 });
  }, []);

  const submit = async e => {
    e.preventDefault();
    if (tab === 'cadastro' && senha !== conf) { setMsg({ type:'err', text:'As senhas não coincidem.' }); return; }
    setLoad(true); setMsg(null);
    await new Promise(r => setTimeout(r, 1200));
    setLoad(false);
    setMsg({ type:'ok', text: tab === 'login' ? 'Bem-vindo de volta!' : 'Conta criada com sucesso!' });
  };

  const switchTab = t => { setTab(t); setMsg(null); };

  return (
    <div className="auth-card glass" ref={cardRef}>
      <div className="auth-glow" />

      <div className="auth-header">
        <h1 className="auth-title">{tab === 'login' ? 'Bem-vindo de volta' : 'Criar conta'}</h1>
        <p className="auth-sub">{tab === 'login' ? 'Entre na sua conta Lynus Tech' : 'Comece grátis, sem cartão de crédito'}</p>
      </div>

      <div className="auth-tabs">
        <button className={'auth-tab'+(tab==='login'?' active':'')} onClick={()=>switchTab('login')}>Entrar</button>
        <button className={'auth-tab'+(tab==='cadastro'?' active':'')} onClick={()=>switchTab('cadastro')}>Cadastrar</button>
      </div>

      <form className="auth-form" onSubmit={submit}>
        {tab === 'cadastro' && (
          <Field label="Nome completo" value={nome} onChange={setNome} placeholder="Seu nome" />
        )}
        <Field label="E-mail" type="email" value={email} onChange={setEmail} placeholder="voce@empresa.com" />
        <Field label="Senha" type="password" value={senha} onChange={setSenha} placeholder="••••••••" />
        {tab === 'cadastro' && (
          <Field label="Confirmar senha" type="password" value={conf} onChange={setConf} placeholder="••••••••" />
        )}

        {tab === 'login' && (
          <a href="#" className="auth-forgot">Esqueceu a senha?</a>
        )}

        {msg && (
          <div className={'auth-msg auth-msg-'+ msg.type}>{msg.text}</div>
        )}

        <button type="submit" className={'btn btn-primary auth-submit'+(loading?' loading':'')} disabled={loading}>
          {loading ? <span className="auth-spinner" /> : (tab === 'login' ? 'Entrar →' : 'Criar conta →')}
        </button>
      </form>

      {/* Divider */}
      <div className="auth-divider"><span>ou continue com</span></div>

      {/* Social login */}
      <div className="auth-socials">
        {SOCIALS.map(s => (
          <button key={s.id} type="button" className={`social-btn social-btn-${s.id}`}>
            <span className="social-icon">{s.icon}</span>
            <span>{s.label}</span>
          </button>
        ))}
      </div>

      <p className="auth-switch">
        {tab === 'login' ? 'Não tem conta? ' : 'Já tem conta? '}
        <button className="auth-link" onClick={() => switchTab(tab==='login'?'cadastro':'login')}>
          {tab === 'login' ? 'Cadastre-se' : 'Entrar'}
        </button>
      </p>
    </div>
  );
}

/* ---- Page ---- */
function LoginPage() {
  useEffect(() => { window.LYNUS.applyAccent('azul'); }, []);
  return (
    <>
      <ThreeBg />
      <div className="bg-layer" aria-hidden="true">
        <div className="glow"></div>
        <div className="glow-2"></div>
      </div>
      <nav className="auth-nav">
        <div className="wrap nav-inner">
          <LogoMark />
          <a href="index.html" className="nav-signin">← Voltar ao site</a>
        </div>
      </nav>
      <main className="auth-main">
        <AuthCard />
      </main>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<LoginPage />);
