/* ============================================================
   LYNUS TECH — Page sections
   ============================================================ */

function ThreeBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const T = window.THREE;
    const canvas = canvasRef.current;
    if (!T || !canvas) return;

    const renderer = new T.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new T.Scene();
    const camera = new T.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.z = 7;

    const mkPts = (count, spread, color, size) => {
      const geo = new T.BufferGeometry();
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        pos[i*3]   = (Math.random() - 0.5) * spread;
        pos[i*3+1] = (Math.random() - 0.5) * spread;
        pos[i*3+2] = (Math.random() - 0.5) * spread * 0.6;
      }
      geo.setAttribute('position', new T.BufferAttribute(pos, 3));
      const mat = new T.PointsMaterial({ color, size, transparent: true, opacity: 0.7, sizeAttenuation: true });
      return new T.Points(geo, mat);
    };

    const p1 = mkPts(900, 26, 0x6b8aff, 0.028);
    const p2 = mkPts(220, 22, 0x36d0e8, 0.05);
    const p3 = mkPts(120, 18, 0xffffff, 0.018);
    scene.add(p1, p2, p3);

    let mx = 0, my = 0, sy = 0;
    let lx = 0, ly = 0;
    const lerp = (a, b, t) => a + (b - a) * t;

    const onMouse = (e) => { mx = (e.clientX / window.innerWidth - 0.5) * 2; my = (e.clientY / window.innerHeight - 0.5) * 2; };
    const onScroll = () => { sy = window.scrollY; };
    window.addEventListener('mousemove', onMouse, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    const clock = new T.Clock();
    let rafId;
    const tick = () => {
      rafId = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();
      lx = lerp(lx, mx, 0.025);
      ly = lerp(ly, my, 0.025);
      p1.rotation.y = t * 0.022 + lx * 0.14;
      p1.rotation.x = ly * 0.09;
      p2.rotation.y = t * 0.014 - lx * 0.07;
      p2.rotation.x = -ly * 0.05;
      p3.rotation.y = t * 0.03  + lx * 0.04;
      camera.position.y = -sy * 0.0012;
      renderer.render(scene, camera);
    };
    tick();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);
    canvas.classList.add('three-ready');

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="three-bg" aria-hidden="true" />;
}

function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const m = useRef({ mx: 0, my: 0, rx: 0, ry: 0, raf: null });

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const lerp = (a, b, t) => a + (b - a) * t;
    const onMove = (e) => { m.current.mx = e.clientX; m.current.my = e.clientY; };
    const loop = () => {
      m.current.rx = lerp(m.current.rx, m.current.mx, 0.1);
      m.current.ry = lerp(m.current.ry, m.current.my, 0.1);
      ring.style.transform = `translate(${m.current.rx}px, ${m.current.ry}px)`;
      m.current.raf = requestAnimationFrame(loop);
    };
    const bindHover = () => {
      document.querySelectorAll('a, button, .btn, .bento-card, .nav-links a').forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => ring.classList.remove('cursor-hover'));
      });
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    m.current.raf = requestAnimationFrame(loop);
    document.body.classList.add('custom-cursor');
    setTimeout(bindHover, 800);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(m.current.raf);
      document.body.classList.remove('custom-cursor');
    };
  }, []);

  return <span className="cursor-bubble" ref={ringRef} aria-hidden="true" />;
}

function PageLoader() {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => {
      document.body.style.overflow = '';
      setTimeout(() => setGone(true), 650);
    }, 1400);
    return () => clearTimeout(t);
  }, []);

  if (gone) return null;

  return (
    <div className="page-loader">
      <div className="loader-mark">
        <div className="logo-bars" aria-hidden="true">
          {[2,4,6,5,3].map((h, ci) => (
            <div key={ci} className="logo-col">
              {Array.from({ length: h }, (_, ri) => (
                <div key={ri}
                  className={'logo-px' + (ri === h - 1 ? ' logo-px-top' : '')}
                  style={{ animationDelay: `${ci * 0.07 + ri * 0.04}s` }}
                />
              ))}
            </div>
          ))}
        </div>
        <span className="logo-text loader-text">LYNUS</span>
      </div>
      <div className="loader-track"><div className="loader-fill" /></div>
    </div>
  );
}

function Wordmark() {
  const BASE    = [2, 4, 6, 5, 3];
  const MAX     = [4, 6, 8, 7, 5];
  const targets = useRef([...BASE]);
  const [heights, setHeights] = useState(BASE);
  const [live,    setLive]    = useState(false);

  /* start equalizer after build-in animation */
  useEffect(() => {
    const t = setTimeout(() => setLive(true), 2600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!live) return;
    const id = setInterval(() => {
      targets.current = targets.current.map((h, i) =>
        Math.random() < 0.55
          ? Math.max(1, Math.min(MAX[i], h + (Math.random() < 0.5 ? 1 : -1)))
          : h
      );
      setHeights(prev => prev.map((h, i) => {
        if (h < targets.current[i]) return h + 1;
        if (h > targets.current[i]) return h - 1;
        return h;
      }));
    }, 150);
    return () => clearInterval(id);
  }, [live]);

  return (
    <a className="wordmark" href="#top" aria-label="Lynus Tech">
      <div className="logo-mark">
        <div className="logo-bars" aria-hidden="true">
          {heights.map((h, ci) => (
            <div key={ci} className="logo-col">
              {Array.from({ length: h }, (_, ri) => (
                <div
                  key={ri}
                  className={'logo-px' + (ri === h - 1 ? ' logo-px-top' : '')}
                  style={{ animationDelay: live ? '0s' : `${1.5 + ci * 0.07 + ri * 0.04}s` }}
                />
              ))}
            </div>
          ))}
        </div>
        <span className="logo-text">LYNUS</span>
      </div>
    </a>
  );
}

/* minimal line icons */
function Icon({ name }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" };
  const paths = {
    pulse: <polyline {...p} points="3 12 8 12 11 5 14 19 17 12 21 12" />,
    flow: <g {...p}><rect x="3" y="3" width="6" height="6" rx="1.5" /><rect x="15" y="15" width="6" height="6" rx="1.5" /><path d="M9 6h4a3 3 0 0 1 3 3v6" /></g>,
    bell: <path {...p} d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6M10 20a2 2 0 0 0 4 0" />,
    doc: <g {...p}><path d="M7 3h7l5 5v13H7z" /><path d="M14 3v5h5M10 13h6M10 17h6" /></g>,
    plug: <g {...p}><path d="M12 3v6M9 9h6M8 9v3a4 4 0 0 0 8 0V9M12 16v5" /></g>,
    bolt: <path {...p} d="M13 3 5 13h6l-1 8 8-10h-6z" />,
    shield: <path {...p} d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z" />,
  };
  return <svg className="ic" viewBox="0 0 24 24" width="22" height="22">{paths[name]}</svg>;
}

function Nav() {
  const { NAV } = window.LYNUS;
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  return (
    <nav className={"nav" + (scrolled ? " nav-scrolled" : "")}>
      <div className="wrap nav-inner">
        <Wordmark />
        <div className="nav-links">
          {NAV.links.map((l) => <a key={l.label} href={l.href}>{l.label}</a>)}
        </div>
        <div className="nav-actions">
          <a className="nav-signin" href="login.html">{NAV.signin}</a>
          <a className="btn btn-primary btn-sm" href="#cta">{NAV.cta}</a>
        </div>
      </div>
    </nav>
  );
}

function Hero({ layout }) {
  const { HERO, LOGOS } = window.LYNUS;
  return (
    <header className={"hero hero-" + layout} id="top">
      <div className="wrap">
        <div className="hero-grid">
          <div className="hero-copy reveal">
            <span className="hero-badge">
              <span className="hero-badge-dot"></span>
              {HERO.badge}
              <span className="hero-badge-pill">{HERO.badgePill}</span>
            </span>
            <h1 className="hero-title">
              {HERO.title.map((line, i) => (
                <span key={i} className={i === HERO.titleAccentLine ? "accent-line" : ""}>{line} </span>
              ))}
            </h1>
            <p className="hero-sub">{HERO.sub}</p>
            <div className="hero-cta">
              <a className="btn btn-primary" href="#cta">{HERO.ctaPrimary} →</a>
              <a className="btn btn-ghost" href="#plataforma">▷ {HERO.ctaSecondary}</a>
            </div>
            <ul className="hero-bullets">
              {HERO.bullets.map((b) => (
                <li key={b.k}>
                  <span className="hero-bullet-check">✓</span>
                  <span><strong>{b.k}</strong><em>{b.d}</em></span>
                </li>
              ))}
            </ul>
          </div>
          <div className="hero-visual reveal">
            <LynusDashboard density={layout === "split" ? "focus" : "command"} />
          </div>
        </div>


      </div>
    </header>
  );
}


function Features() {
  const { FEATURES } = window.LYNUS;
  return (
    <section className="section" id="recursos">
      <div className="wrap">
        <div className="section-head reveal">
          <span className="eyebrow"><span className="dot"></span>Recursos</span>
          <h2>Uma central. Todo o ciclo do incidente.</h2>
          <p>Da detecção ao post-mortem, a Lynus reúne tudo o que seu time precisa para responder rápido — sem trocar de ferramenta.</p>
        </div>
        <div className="bento reveal">
          {FEATURES.map((f, i) => (
            <article key={f.title} className={"bento-card glass bento-b" + (i + 1)}>
              <div className="bento-icon"><Icon name={f.icon} /></div>
              <span className="bento-tag">{f.tag}</span>
              <h3 className="bento-title">{f.title}</h3>
              <p className="bento-desc">{f.desc}</p>
              {f.chips && (
                <div className="bento-chips">
                  {f.chips.map((c) => <span key={c} className="chip">{c}</span>)}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Dashboards() {
  const { SISTEMAS } = window.LYNUS;
  return (
    <section className="section dash-section" id="plataforma">
      <div className="wrap">
        <div className="section-head reveal" style={{marginBottom:'56px'}}>
          <div className="eyebrow"><span className="dot"/>&nbsp;Dashboards</div>
          <h2>Visualize sua operação em tempo real</h2>
          <p>Painéis interativos com dados ao vivo para cada área da sua empresa. Tome decisões baseadas em informação real, não em suposições.</p>
        </div>
        <div className="dash-grid">
          {SISTEMAS.map(s => (
            <a key={s.id} href={s.href} className="dash-card glass reveal" style={{'--card-accent': s.accent}}>
              <div className="dash-preview">
                <MockScreen type={s.preview} accent={s.accent}/>
              </div>
              <div className="dash-info">
                <span className="dash-icon">{s.icon}</span>
                <div>
                  <h3 className="dash-title">{s.title}</h3>
                  <p className="dash-desc">{s.desc}</p>
                </div>
              </div>
              <div className="dash-tags">
                {s.tags.map(t => <span key={t} className="dash-tag">{t}</span>)}
              </div>
              <div className="dash-footer">
                <span className="dash-link">Abrir dashboard <span>→</span></span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Sobre() {
  const { SOBRE } = window.LYNUS;
  return (
    <section className="section sobre-section" id="sobre">
      <div className="wrap">

        {/* Header + founder */}
        <div className="section-head reveal" style={{marginBottom:'48px'}}>
          <div className="eyebrow"><span className="dot"/>&nbsp;{SOBRE.eyebrow}</div>
          <h2>{SOBRE.title}</h2>
          <p className="sobre-mission">{SOBRE.mission}</p>
          <div className="sobre-founder">
            <div className="sobre-founder-avatar">
              <img src="ricardo.jpg" alt="Ricardo Henrique" />
            </div>
            <div>
              <strong>{SOBRE.founder.name}</strong>
              <span>{SOBRE.founder.role}</span>
            </div>
            <p className="sobre-founder-bio">{SOBRE.founder.bio}</p>
          </div>
        </div>

        {/* Values */}
        <div className="sobre-values reveal">
          {SOBRE.values.map(v => (
            <div key={v.label} className="sobre-value glass">
              <span className="sobre-value-icon">{v.icon}</span>
              <h4>{v.label}</h4>
              <p>{v.text}</p>
            </div>
          ))}
        </div>

        {/* Story + timeline */}
        <div className="sobre-story-wrap reveal">
          <div className="sobre-story-left">
            <h3>De onde viemos</h3>
            {SOBRE.storyNarrative.map((p, i) => <p key={i}>{p}</p>)}
            <div className="sobre-timeline">
              {SOBRE.timeline.map(s => (
                <div key={s.year} className="sobre-tl-item">
                  <span className="sobre-tl-year">{s.year}</span>
                  <span className="sobre-tl-text">{s.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="sobre-story-right">
            <div className="radar-wrap">
              <div className="radar-scope">
                <div className="radar-ring r1"/>
                <div className="radar-ring r2"/>
                <div className="radar-ring r3"/>
                <div className="radar-cross-h"/>
                <div className="radar-cross-v"/>
                <div className="radar-sweep"/>
                {/* Power BI */}
                <div className="radar-app" style={{top:'22%',left:'69%',animationDelay:'0.38s','--ac':'#F2C811'}}>
                  <svg viewBox="0 0 16 12" width="18" height="14" fill="none">
                    <rect x="0" y="7" width="3" height="5" rx=".4" fill="#F2C811"/>
                    <rect x="4" y="4" width="3" height="8" rx=".4" fill="#F2C811"/>
                    <rect x="8" y="1" width="3" height="11" rx=".4" fill="#F2C811"/>
                    <rect x="12" y="5" width="3" height="7" rx=".4" fill="#F2C811" opacity=".55"/>
                  </svg>
                </div>
                {/* VS Code */}
                <div className="radar-app" style={{top:'68%',left:'68%',animationDelay:'1.13s','--ac':'#007ACC'}}>
                  <svg viewBox="0 0 18 13" width="18" height="13" fill="none">
                    <path d="M5 1L1 6.5L5 12" stroke="#007ACC" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M13 1L17 6.5L13 12" stroke="#007ACC" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="7" y1="6.5" x2="11" y2="6.5" stroke="#007ACC" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                {/* Excel */}
                <div className="radar-app" style={{top:'72%',left:'35%',animationDelay:'1.75s','--ac':'#217346'}}>
                  <svg viewBox="0 0 16 16" width="16" height="16">
                    <rect width="16" height="16" rx="2.5" fill="#217346"/>
                    <path d="M4.5 4.5L11.5 11.5M11.5 4.5L4.5 11.5" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
                  </svg>
                </div>
                {/* GitHub */}
                <div className="radar-app" style={{top:'44%',left:'19%',animationDelay:'2.33s','--ac':'#cdd9e5'}}>
                  <svg viewBox="0 0 16 16" width="16" height="16" fill="#cdd9e5">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38l-.01-1.49c-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48L14 15c0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                  </svg>
                </div>
                {/* SAP */}
                <div className="radar-app" style={{top:'27%',left:'37%',animationDelay:'2.75s','--ac':'#0070F2'}}>
                  <svg viewBox="0 0 26 14" width="26" height="14">
                    <rect width="26" height="14" rx="2" fill="#0070F2"/>
                    <text x="3" y="11" fill="white" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="10">SAP</text>
                  </svg>
                </div>
                <div className="radar-center"><span>L</span></div>
              </div>
              <div className="radar-status">
                <span className="radar-status-dot"/>
                <span className="radar-status-text">SCANNING</span>
                <span className="radar-status-coords">5 sinais detectados</span>
              </div>
            </div>
            {/* Mission statement */}
            <div className="sobre-mission-box glass">
              <span className="sobre-mission-label">Nossa missão</span>
              <p>{SOBRE.missionStatement}</p>
            </div>
          </div>
        </div>

        {/* Numbers */}
        <div className="sobre-numbers reveal">
          {SOBRE.numbers.map(n => (
            <div key={n.label} className="sobre-num">
              <span className="sobre-num-val">{n.v}</span>
              <span className="sobre-num-label">{n.label}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

function CTASection() {
  const { CTA } = window.LYNUS;
  return (
    <section className="section cta-section" id="cta">
      <div className="wrap">
        <div className="cta-box glass reveal">
          <div className="cta-glow"></div>
          <span className="eyebrow"><span className="dot"></span>{CTA.eyebrow}</span>
          <h2>{CTA.title}</h2>
          <p>{CTA.sub}</p>
          <div className="cta-actions">
            <a className="btn btn-primary" href="#">{CTA.primary} →</a>
            <a className="btn btn-ghost" href="#">{CTA.secondary}</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const { FOOTER } = window.LYNUS;
  return (
    <footer className="footer" id="precos">
      <div className="wrap footer-inner">
        <div className="footer-brand">
          <p>{FOOTER.tagline}</p>
        </div>
        <div className="footer-cols">
          {FOOTER.cols.map((col) => (
            <div key={col.h} className="footer-col">
              <h4>{col.h}</h4>
              {col.items.map((it) => <a key={it} href="#">{it}</a>)}
            </div>
          ))}
        </div>
      </div>
      <div className="wrap footer-bottom">
        <span>{FOOTER.copyright}</span>
        <span className="footer-status"><span className="footer-status-dot"></span>Todos os sistemas operacionais</span>
      </div>
    </footer>
  );
}

/* ---- Mini dashboard preview (CSS-only mockup) ---- */
function MockScreen({ type, accent: a }) {
  const dim  = 'rgba(255,255,255,0.05)';
  const bd   = 'rgba(255,255,255,0.09)';
  const t3   = 'rgba(255,255,255,0.18)';
  const row  = (items) => (
    <div style={{display:'flex',gap:'5px'}}>
      {items.map((k,i)=>(
        <div key={i} style={{flex:1,background:k.hi?`${a}18`:dim,border:`1px solid ${k.hi?a+'32':bd}`,borderRadius:'5px',padding:'5px'}}>
          <div style={{height:'3px',background:t3,borderRadius:'2px',marginBottom:'3px',width:'65%'}}/>
          <div style={{height:'8px',background:k.c,borderRadius:'2px',width:k.w||'70%',opacity:k.hi?0.9:0.5}}/>
          {k.sub&&<div style={{height:'3px',background:t3,borderRadius:'2px',marginTop:'3px',width:'40%'}}/>}
        </div>
      ))}
    </div>
  );
  const tableRows = (n, ac) => (
    <div style={{background:dim,border:`1px solid ${bd}`,borderRadius:'6px',padding:'5px 8px',display:'flex',flexDirection:'column',gap:'4px'}}>
      {Array.from({length:n}).map((_,i)=>(
        <div key={i} style={{display:'flex',gap:'5px',alignItems:'center'}}>
          <div style={{width:'9%',height:'4px',background:i===0?`${ac}55`:t3,borderRadius:'2px'}}/>
          <div style={{flex:1,height:'4px',background:t3,borderRadius:'2px'}}/>
          <div style={{width:'22%',height:'9px',background:i===0?`${ac}28`:i===1?'rgba(52,224,161,.18)':'rgba(255,181,71,.18)',borderRadius:'6px'}}/>
        </div>
      ))}
    </div>
  );
  return (
    <div style={{width:'100%',aspectRatio:'16/10',background:'#0C0D13',overflow:'hidden',display:'flex',flexDirection:'column',borderRadius:'10px'}}>
      {/* topbar */}
      <div style={{height:'26px',background:'rgba(255,255,255,0.03)',borderBottom:`1px solid ${bd}`,display:'flex',alignItems:'center',padding:'0 10px',gap:'6px',flexShrink:0}}>
        <div style={{width:'56px',height:'6px',background:`${a}50`,borderRadius:'3px'}}/>
        <div style={{marginLeft:'auto',display:'flex',gap:'4px'}}>
          <div style={{width:'20px',height:'6px',background:dim,borderRadius:'3px'}}/>
          <div style={{width:'28px',height:'6px',background:`${a}35`,borderRadius:'3px'}}/>
        </div>
      </div>
      {/* body */}
      <div style={{flex:1,display:'flex',overflow:'hidden'}}>
        {/* sidebar */}
        <div style={{width:'42px',background:'rgba(255,255,255,0.02)',borderRight:`1px solid ${bd}`,display:'flex',flexDirection:'column',alignItems:'center',gap:'7px',padding:'10px 0',flexShrink:0}}>
          {[1,2,3,4,5].map(i=><div key={i} style={{width:'26px',height:'5px',borderRadius:'3px',background:i===1?`${a}55`:dim}}/>)}
        </div>
        {/* content */}
        <div style={{flex:1,padding:'8px',display:'flex',flexDirection:'column',gap:'6px',overflow:'hidden'}}>

          {type==='finance'&&<>
            {row([{hi:true,c:a,sub:1},{c:'#ff5c6c',w:'55%'},{c:'#34e0a1',w:'75%'},{c:t3,w:'45%'}])}
            <div style={{flex:1,background:dim,border:`1px solid ${bd}`,borderRadius:'6px',padding:'6px 8px',display:'flex',alignItems:'flex-end',gap:'2px',overflow:'hidden'}}>
              {[38,52,45,68,60,78,86,74,90,84,100,93].map((h,i)=>(
                <div key={i} style={{flex:1,height:`${h*0.73}%`,background:i===10?a:`${a}22`,borderRadius:'2px 2px 0 0'}}/>
              ))}
            </div>
            {tableRows(3,a)}
          </>}

          {type==='maintenance'&&<>
            {row([{hi:true,c:a},{c:'#34e0a1',w:'60%'},{c:'#ffb547',w:'65%'},{c:t3,w:'45%'}])}
            <div style={{flex:1,background:dim,border:`1px solid ${bd}`,borderRadius:'6px',padding:'6px',display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'4px',alignContent:'start'}}>
              {['ok','ok','warn','ok','ok','crit','ok','ok'].map((s,i)=>(
                <div key={i} style={{background:'rgba(255,255,255,0.02)',border:`1px solid ${s==='ok'?'#34e0a118':s==='warn'?'#ffb54728':'#ff5c6c28'}`,borderRadius:'4px',padding:'5px 3px',display:'flex',flexDirection:'column',alignItems:'center',gap:'3px'}}>
                  <div style={{width:'6px',height:'6px',borderRadius:'50%',background:s==='ok'?'#34e0a1':s==='warn'?'#ffb547':'#ff5c6c',boxShadow:`0 0 5px ${s==='ok'?'#34e0a155':s==='warn'?'#ffb54755':'#ff5c6c55'}`}}/>
                  <div style={{height:'3px',background:t3,borderRadius:'2px',width:'75%'}}/>
                </div>
              ))}
            </div>
            <div style={{background:dim,border:`1px solid ${bd}`,borderRadius:'6px',padding:'5px 7px',display:'flex',flexDirection:'column',gap:'4px'}}>
              {[{c:a},{c:'#ffb547'},{c:'#34e0a1'}].map((o,i)=>(
                <div key={i} style={{display:'flex',alignItems:'center',gap:'5px'}}>
                  <div style={{width:'5px',height:'5px',borderRadius:'50%',background:o.c,flexShrink:0}}/>
                  <div style={{flex:1,height:'4px',background:t3,borderRadius:'2px'}}/>
                  <div style={{width:'22%',height:'8px',background:`${o.c}28`,borderRadius:'4px'}}/>
                </div>
              ))}
            </div>
          </>}

          {type==='pcm'&&<>
            {row([{hi:true,c:a},{c:'rgba(52,224,161,.55)',w:'75%'},{c:'rgba(255,181,71,.55)',w:'60%'}])}
            <div style={{flex:1,display:'flex',gap:'5px',overflow:'hidden'}}>
              <div style={{width:'42%',background:dim,border:`1px solid ${bd}`,borderRadius:'6px',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <div style={{position:'relative',width:'46px',height:'46px',flexShrink:0}}>
                  <div style={{position:'absolute',inset:0,borderRadius:'50%',background:`conic-gradient(${a} 0% 60%, rgba(52,224,161,.7) 60% 80%, rgba(255,181,71,.7) 80% 100%)`}}/>
                  <div style={{position:'absolute',inset:'10px',borderRadius:'50%',background:'#0C0D13'}}/>
                </div>
              </div>
              <div style={{flex:1,background:dim,border:`1px solid ${bd}`,borderRadius:'6px',padding:'7px 6px',display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
                {[75,50,90,42,65].map((h,i)=>(
                  <div key={i} style={{display:'flex',alignItems:'center',gap:'3px'}}>
                    <div style={{width:'3px',height:'3px',borderRadius:'50%',background:t3,flexShrink:0}}/>
                    <div style={{flex:h/100,height:'4px',background:`${a}60`,borderRadius:'2px',transition:'flex 1s ease'}}/>
                    <div style={{flex:1-h/100,height:'4px',background:t3,borderRadius:'2px'}}/>
                  </div>
                ))}
              </div>
            </div>
            {tableRows(3,a)}
          </>}

        </div>
      </div>
    </div>
  );
}

function SistemasShowcase() {
  const { SISTEMAS } = window.LYNUS;
  return (
    <section className="section sistemas-section reveal" id="sistemas">
      <div className="wrap">
        <div className="section-head" style={{marginBottom:'60px'}}>
          <div className="eyebrow"><span className="dot"/>&nbsp;Nossas Soluções</div>
          <h2>Sistemas feitos para operar</h2>
          <p>Cada plataforma construída para resolver um problema real — com dados em tempo real e UX pensada para o dia a dia da sua equipe.</p>
        </div>
        <div className="sistemas-grid">
          {SISTEMAS.map((s, i) => (
            <a key={s.id} href={s.href} className="sistema-card reveal" style={{'--card-accent': s.accent, animationDelay: `${i * 0.12}s`}}>
              <div className="sistema-num">0{i+1}</div>
              <div className="sistema-preview">
                <MockScreen type={s.preview} accent={s.accent}/>
              </div>
              <div className="sistema-body">
                <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                  <span className="sistema-icon">{s.icon}</span>
                  <h3 className="sistema-title">{s.title}</h3>
                </div>
                <p className="sistema-desc">{s.desc}</p>
                <div className="sistema-tags">
                  {s.tags.map(tag => (
                    <span key={tag} className="sistema-tag">{tag}</span>
                  ))}
                </div>
                <div className="sistema-cta">Ver sistema <span>→</span></div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

window.LynusSections = { Nav, Hero, Features, SistemasShowcase, Dashboards, Sobre, CTASection, Footer, Cursor, PageLoader, ThreeBackground };
