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
    deploy: <g {...p}><rect x="2" y="3" width="14" height="10" rx="1.4" /><path d="M6 17h6M9 13v4" /><path d="M15 11l4-3-4-3M19 8h-6" /></g>,
    cloud: <g {...p}><path d="M7 17a4 4 0 0 1-.4-8 5 5 0 0 1 9.6-1.6A3.6 3.6 0 0 1 16 15.8" /><path d="M7 17h9" /></g>,
    discount: <g {...p}><circle cx="12" cy="12" r="9" /><circle cx="9" cy="9" r="1.4" fill="currentColor" stroke="none" /><circle cx="15" cy="15" r="1.4" fill="currentColor" stroke="none" /><path d="M9 15l6-6" /></g>,
    headset: <g {...p}><path d="M4 13v-1a8 8 0 0 1 16 0v1" /><rect x="2.5" y="12" width="4" height="6" rx="1.5" /><rect x="17.5" y="12" width="4" height="6" rx="1.5" /><path d="M20 18.5v.5a3 3 0 0 1-3 3h-3" /></g>,
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
          <a className="btn btn-primary btn-sm" href="https://wa.me/5599991754232" target="_blank" rel="noopener noreferrer">{NAV.cta}</a>
        </div>
      </div>
    </nav>
  );
}

function FluidFlowGridCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId;
    let width = 0;
    let height = 0;
    const mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
      height = canvas.parentElement ? canvas.parentElement.clientHeight : 580;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.scale(dpr, dpr);
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    let time = 0;
    const render = () => {
      time += 0.009;
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      const bgColor = '#080d1a';
      const lineBaseColor = '59, 130, 246';
      const accentBlue = '147, 197, 253';

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      const spacing = 34;
      const cols = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;
      ctx.lineWidth = 1.25;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * spacing;
          const y = j * spacing;
          let angle = Math.sin(x * 0.003 + time) + Math.cos(y * 0.003 + time);
          const dx = mouse.x - x;
          const dy = mouse.y - y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          let isNear = false;
          if (dist < 230 && dist > 0) {
            isNear = true;
            const pushAngle = Math.atan2(dy, dx) + Math.PI;
            const force = (1 - dist / 230);
            angle = angle * (1 - force) + pushAngle * force;
          }

          const lineLen = isNear ? 24 : 14;
          const x2 = x + Math.cos(angle) * lineLen;
          const y2 = y + Math.sin(angle) * lineLen;
          const alpha = isNear ? 0.85 : (0.16 + Math.sin(x * 0.01 + y * 0.01 + time) * 0.11);

          ctx.strokeStyle = isNear ? `rgba(${accentBlue}, ${alpha})` : `rgba(${lineBaseColor}, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="hero-fluid-card">
      <canvas ref={canvasRef} className="hero-fluid-canvas" />
      <div className="hero-fluid-overlay">
        <span className="hero-fluid-tag">⚡ VETOR DE FLUXO EM TEMPO REAL</span>
        <h3 className="hero-fluid-title">DYNAMIC FLOW STREAM</h3>
        <p className="hero-fluid-desc">
          Malha vetorial trigonométrica com campo de repulsão por física fluida para visualização de tráfego e telemetria de redes.
        </p>
      </div>
    </div>
  );
}

function HeroAIStream() {
  const [count, setCount] = useState(0);
  const TOKENS = [
    ..."Detecção autônoma: Cluster de pagamentos apresentou pico anômalo de 23% na latência e auto-recuperação iniciada em 180ms."
      .split(" ")
      .map(text => ({ text })),
    { text: "", cite: true },
    ..."Infraestrutura operando em redundância com 99.98% de estabilidade confirmada."
      .split(" ")
      .map(text => ({ text }))
  ];

  useEffect(() => {
    const t = setTimeout(() => {
      setCount(c => (c >= TOKENS.length ? 0 : c + 1));
    }, count >= TOKENS.length ? 4000 : 75);
    return () => clearTimeout(t);
  }, [count]);

  return (
    <div className="hero-ai-card">
      <div style={{ maxWidth: '640px', width: '100%', textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <span className="dot" style={{ background: '#34e0a1', boxShadow: '0 0 10px #34e0a1' }}></span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: '#6b8aff', letterSpacing: '0.1em' }}>
            LYNUS AGENT • DIAGNÓSTICO EM TEMPO REAL
          </span>
        </div>
        <p style={{ fontSize: '17px', lineHeight: '1.7', color: '#f0f2f5', minHeight: '100px' }}>
          {TOKENS.slice(0, count).map((t, i) => (
            t.cite ? (
              <span key={i} style={{ display: 'inline-block', margin: '0 4px', padding: '2px 8px', borderRadius: '6px', background: 'rgba(107,138,255,0.15)', border: '1px solid rgba(107,138,255,0.3)', color: '#93c5fd', fontSize: '12px' }}>
                🔗 telemetry.lynus.io
              </span>
            ) : (
              <span key={i}>{t.text} </span>
            )
          ))}
          {count < TOKENS.length && (
            <span style={{ display: 'inline-block', width: '3px', height: '16px', background: '#6b8aff', marginLeft: '4px', verticalAlign: 'middle', animation: 'pulse 1s infinite' }} />
          )}
        </p>
        <div style={{ display: 'flex', gap: '10px', marginTop: '24px', flexWrap: 'wrap' }}>
          <span className="chip" style={{ background: 'rgba(52,224,161,0.12)', color: '#34e0a1', borderColor: 'rgba(52,224,161,0.3)' }}>
            ✓ Auto-Remediação Ativa
          </span>
          <span className="chip" style={{ background: 'rgba(107,138,255,0.12)', color: '#6b8aff', borderColor: 'rgba(107,138,255,0.3)' }}>
            ⚡ 11ms MTTR
          </span>
          <span className="chip" style={{ background: 'rgba(255,255,255,0.06)', color: '#9a9da3' }}>
            🌐 Edge CDN Normalizado
          </span>
        </div>
      </div>
    </div>
  );
}

function Hero({ layout }) {
  const { HERO } = window.LYNUS;

  return (
    <header className={"hero hero-" + layout} id="top">
      <div className="wrap">
        <div className="hero-grid">
          <div className="hero-copy reveal">
            <h1 className="hero-title">
              {HERO.title.map((line, i) => (
                <span key={i} className={i === HERO.titleAccentLine ? "accent-line" : ""}>{line} </span>
              ))}
            </h1>
            <p className="hero-sub">{HERO.sub}</p>
            <div className="hero-cta">
              <a className="btn btn-primary" href="#cta">{HERO.ctaPrimary} →</a>
              <a className="btn btn-ghost" href="#recursos">▷ {HERO.ctaSecondary}</a>
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
          <h2>Do alerta ao post-mortem, num só lugar.</h2>
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

function SolucoesGrid() {
  const { SOLUCOES } = window.LYNUS;
  return (
    <section className="section solucoes-section" id="solucoes">
      <div className="wrap">
        <div className="section-head reveal">
          <span className="eyebrow"><span className="dot"></span>{SOLUCOES.eyebrow}</span>
          <h2>{SOLUCOES.title}</h2>
          <p>{SOLUCOES.sub}</p>
        </div>
        <div className="solucoes-grid reveal">
          {SOLUCOES.items.map((s) => (
            <a key={s.id} href={s.href} className="solucao-card glass" style={{'--card-accent': s.accent}}>
              <span className="solucao-icon">{s.icon}</span>
              <h3 className="solucao-title">{s.title}</h3>
              <p className="solucao-desc">{s.desc}</p>
              <div className="solucao-tags">
                {s.tags.map((tag) => <span key={tag} className="solucao-tag">{tag}</span>)}
              </div>
              <span className="solucao-link">Saiba mais <span>→</span></span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Vantagens() {
  const { VANTAGENS } = window.LYNUS;
  return (
    <section className="section vantagens-section">
      <div className="wrap">
        <div className="section-head reveal" style={{ marginBottom: '44px' }}>
          <span className="eyebrow"><span className="dot"></span>Por que a Lynus</span>
          <h2>Também oferecemos isso pra você.</h2>
        </div>
        <div className="vantagens-grid reveal">
          {VANTAGENS.map((v) => (
            <div key={v.title} className="vantagem-item">
              <div className="vantagem-icon"><Icon name={v.icon} /></div>
              <h3 className="vantagem-title">{v.title}</h3>
              <p className="vantagem-desc">{v.desc}</p>
            </div>
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
          <div className="sobre-founders">
            {/* Ricardo */}
            <div className="sobre-founder">
              <div className="sobre-founder-avatar">
                <img src={SOBRE.founder.photo} alt={SOBRE.founder.name} />
              </div>
              <div>
                <strong>{SOBRE.founder.name}</strong>
                <span>{SOBRE.founder.role}</span>
              </div>
              <p className="sobre-founder-bio">{SOBRE.founder.bio}</p>
            </div>
            {/* Walisson */}
            <div className="sobre-founder">
              <div className="sobre-founder-avatar sobre-founder-initials">
                <span>{SOBRE.coFounder.initials}</span>
              </div>
              <div>
                <strong>{SOBRE.coFounder.name}</strong>
                <span>{SOBRE.coFounder.role}</span>
              </div>
              <p className="sobre-founder-bio">{SOBRE.coFounder.bio}</p>
            </div>
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
  const [form, setForm] = React.useState({ name: '', email: '', msg: '' });
  const [sent, setSent] = React.useState(false);
  const [sending, setSending] = React.useState(false);
  const [error, setError] = React.useState('');
  const set = k => e => setForm(p => ({...p, [k]: e.target.value}));
  const send = async e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.msg) return;
    setSending(true);
    setError('');

    const { error: dbError } = await window.supabaseClient
      .from('contatos')
      .insert([{ name: form.name, email: form.email, message: form.msg }]);

    setSending(false);

    if (dbError) {
      setError('Não foi possível enviar agora. Tente novamente em instantes.');
      return;
    }

    setForm(p => ({ ...p, name: '', msg: '' }));
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };
  const WA_SISTEMAS   = "https://wa.me/5599991754232";
  const WA_DASHBOARDS = "https://wa.me/5599984035823";

  return (
    <section className="section contact-section" id="cta">
      <div className="wrap">
        <div className="contact-box glass reveal">
          <div className="contact-glow"/>

          {/* header */}
          <div className="contact-head">
            <span className="eyebrow"><span className="dot"/>Contato</span>
            <h2>Vamos conversar sobre o seu projeto</h2>
            <p>Preencha o formulário ou entre em contato diretamente — respondemos em até 24h.</p>
          </div>

          {/* two columns */}
          <div className="contact-cols">

            {/* info */}
            <div className="contact-info">
              <a className="ci-item" href={WA_SISTEMAS} target="_blank" rel="noopener noreferrer">
                <div className="ci-icon ci-icon-green">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 1.5A7.5 7.5 0 0 1 16.5 9c0 4.14-3.36 7.5-7.5 7.5a7.47 7.47 0 0 1-3.84-1.06L1.5 16.5l1.1-3.96A7.47 7.47 0 0 1 1.5 9 7.5 7.5 0 0 1 9 1.5Z" stroke="currentColor" strokeWidth="1.4"/>
                    <path d="M6.5 7.2c.1.4.4 1.1.9 1.8.6.8 1.3 1.5 2.2 1.9.4.2.9.1 1.2-.2l.3-.4c.2-.2.5-.3.7-.2l1.2.5c.3.1.4.5.3.8-.4 1-1.4 1.6-2.5 1.3-1.7-.4-3.3-2-3.8-3.6-.3-.9.2-2 1.2-2.4.3-.1.6 0 .7.3l.5 1.2c.1.2 0 .5-.2.7l-.3.3c-.2.2-.3.5-.2.8Z" fill="currentColor"/>
                  </svg>
                </div>
                <div className="ci-body">
                  <span className="ci-label">WhatsApp · Sistemas</span>
                  <span className="ci-value">Falar sobre sistemas →</span>
                </div>
              </a>

              <a className="ci-item" href={WA_DASHBOARDS} target="_blank" rel="noopener noreferrer">
                <div className="ci-icon ci-icon-green">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 1.5A7.5 7.5 0 0 1 16.5 9c0 4.14-3.36 7.5-7.5 7.5a7.47 7.47 0 0 1-3.84-1.06L1.5 16.5l1.1-3.96A7.47 7.47 0 0 1 1.5 9 7.5 7.5 0 0 1 9 1.5Z" stroke="currentColor" strokeWidth="1.4"/>
                    <path d="M6.5 7.2c.1.4.4 1.1.9 1.8.6.8 1.3 1.5 2.2 1.9.4.2.9.1 1.2-.2l.3-.4c.2-.2.5-.3.7-.2l1.2.5c.3.1.4.5.3.8-.4 1-1.4 1.6-2.5 1.3-1.7-.4-3.3-2-3.8-3.6-.3-.9.2-2 1.2-2.4.3-.1.6 0 .7.3l.5 1.2c.1.2 0 .5-.2.7l-.3.3c-.2.2-.3.5-.2.8Z" fill="currentColor"/>
                  </svg>
                </div>
                <div className="ci-body">
                  <span className="ci-label">WhatsApp · Dashboards</span>
                  <span className="ci-value">Falar sobre dashboards →</span>
                </div>
              </a>

              <div className="ci-note">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="5.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2"/>
                  <path d="M7 6v4M7 4.5v.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                Retornamos em até 24 horas úteis
              </div>
            </div>

            {/* form */}
            <form className="contact-form" onSubmit={send}>
                <div className="cf-row">
                  <div className="cf-field">
                    <label className="cf-label">Nome</label>
                    <input className="cf-input" type="text" placeholder="Seu nome completo"
                      value={form.name} onChange={set('name')} required/>
                  </div>
                  <div className="cf-field">
                    <label className="cf-label">E-mail</label>
                    <input className="cf-input" type="email" placeholder="seu@email.com"
                      value={form.email} onChange={set('email')} required/>
                  </div>
                </div>
                <div className="cf-field">
                  <label className="cf-label">Mensagem</label>
                  <textarea className="cf-input cf-textarea" placeholder="Conte sobre o seu projeto ou a sua necessidade..."
                    rows="5" value={form.msg} onChange={set('msg')} required/>
                </div>
                {error && <p className="cf-error">{error}</p>}

                <button className={"btn btn-primary cf-submit" + (sent ? " sent" : "")} type="submit" disabled={sending}>
                  {sent ? "✓ Mensagem enviada" : sending ? "Enviando..." : "Enviar mensagem →"}
                </button>
              </form>

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
window.LynusSections = { Nav, Hero, Features, SolucoesGrid, Vantagens, Sobre, CTASection, Footer, Cursor, PageLoader, ThreeBackground };
