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
    cart: <g {...p}><path d="M3 4h2l2.4 11h10.2L20 8H6.2" /><circle cx="9" cy="19" r="1.4" /><circle cx="17" cy="19" r="1.4" /></g>,
    box: <g {...p}><path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z" /><path d="M3 7.5 12 12l9-4.5M12 12v9" /></g>,
    wrench: <path {...p} d="M14.7 6.3a4 4 0 0 0 5 5L21 13l-8 8-3-3 8-8M14.7 6.3 13 5l-3.5 3.5a4 4 0 0 0-5 5L3 15l3 3 1.5-1.5a4 4 0 0 0 5-5" />,
    users: <g {...p}><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.3a6.5 6.5 0 0 1 3.5 5.7" /></g>,
    coin: <g {...p}><circle cx="12" cy="12" r="9" /><path d="M15 8.5c-.6-.9-1.7-1.5-3-1.5-1.9 0-3 1-3 2.4 0 3.3 6 1.9 6 5.2 0 1.4-1.2 2.4-3 2.4-1.4 0-2.5-.6-3.1-1.6M12 5.5V7M12 17v1.5" /></g>,
    unlink: <g {...p}><path d="M9.5 14.5 7 17a3.5 3.5 0 0 1-5-5l2.5-2.5M14.5 9.5 17 7a3.5 3.5 0 0 1 5 5l-2.5 2.5" /><path d="M8 4v2M4 8h2M16 20v-2M20 16h-2" /></g>,
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
          <a className="btn btn-primary btn-sm" href="#contato">{NAV.cta}</a>
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
              <a className="btn btn-primary" href="#contato">{HERO.ctaPrimary} →</a>
              <a className="btn btn-ghost" href={HERO.whatsapp} target="_blank" rel="noopener noreferrer">{HERO.ctaSecondary}</a>
            </div>
            <p className="hero-note">{HERO.note}</p>
          </div>

        </div>
      </div>
    </header>
  );
}


function Features() {
  const { FEATURES } = window.LYNUS;
  return (
    <section className="section" id="dores">
      <div className="wrap">
        <div className="section-head reveal">
          <h2>{FEATURES.title}</h2>
          <p>{FEATURES.sub}</p>
        </div>
        <div className="dores-grid reveal">
          {FEATURES.items.map((f) => (
            <article key={f.title} className="bento-card glass">
              <div className="bento-icon"><Icon name={f.icon} /></div>
              <h3 className="bento-title">{f.title}</h3>
              <p className="bento-desc">{f.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Diagnostico() {
  const { DIAGNOSTICO } = window.LYNUS;
  return (
    <section className="section" id="diagnostico">
      <div className="wrap diag-grid">
        <div className="diag-box glass reveal">
          <span className="eyebrow"><span className="dot"></span>{DIAGNOSTICO.eyebrow}</span>
          <h3 className="diag-box-title">{DIAGNOSTICO.boxTitle}</h3>
          <p className="diag-box-text">{DIAGNOSTICO.boxText}</p>
          <ul className="diag-entregas">
            {DIAGNOSTICO.entregas.map((e) => (
              <li key={e}><span className="hero-bullet-check">✓</span>{e}</li>
            ))}
          </ul>
          <a className="btn btn-primary" href="#contato">{DIAGNOSTICO.cta} →</a>
        </div>
        <div className="reveal">
          <h2 className="diag-title">{DIAGNOSTICO.title}</h2>
          <p className="diag-sub">{DIAGNOSTICO.sub}</p>
          <ol className="diag-dias">
            {DIAGNOSTICO.dias.map((d) => (
              <li key={d.d}>
                <span className="diag-dia">{d.d}</span>
                <span><strong>{d.t}</strong>{d.x}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function SolucoesGrid() {
  const { SOLUCOES } = window.LYNUS;
  return (
    <section className="section solucoes-section" id="servicos">
      <div className="wrap">
        <div className="section-head reveal">
          <span className="eyebrow"><span className="dot"></span>{SOLUCOES.eyebrow}</span>
          <h2>{SOLUCOES.title}</h2>
          <p>{SOLUCOES.sub}</p>
        </div>
        <div className="solucoes-grid reveal">
          {SOLUCOES.items.map((s) => {
            const Tag = s.href ? "a" : "div";
            return (
              <Tag key={s.id} href={s.href} className="solucao-card glass">
                <div className="bento-icon"><Icon name={s.icon} /></div>
                <h3 className="solucao-title">{s.title}</h3>
                <p className="solucao-desc">{s.desc}</p>
                <ul className="solucao-itens">
                  {s.itens.map((it) => <li key={it}>{it}</li>)}
                </ul>
                {s.href && <span className="solucao-link">Ver demonstração <span>→</span></span>}
              </Tag>
            );
          })}
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
    <section className="section sobre-section" id="quem-faz">
      <div className="wrap">
        <div className="quem-grid reveal">
          <div>
            <span className="eyebrow"><span className="dot"/>{SOBRE.eyebrow}</span>
            <h2 className="quem-title">{SOBRE.title}</h2>
            {SOBRE.paragrafos.map((p, i) => <p key={i} className="quem-p">{p}</p>)}
          </div>
          <ol className="quem-trajeto">
            {SOBRE.trajeto.map((s) => (
              <li key={s.t}><strong>{s.t}</strong><span>{s.x}</span></li>
            ))}
          </ol>
        </div>

        <div className="reveal">
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

      </div>
    </section>
  );
}

function Processo() {
  const { PROCESSO } = window.LYNUS;
  return (
    <section className="section">
      <div className="wrap">
        <div className="section-head reveal">
          <h2>{PROCESSO.title}</h2>
        </div>
        <ol className="processo-grid reveal">
          {PROCESSO.etapas.map((e, i) => (
            <li key={e.t}>
              <span className="processo-num">{i + 1}</span>
              <h3>{e.t}</h3>
              <p>{e.x}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Faq() {
  const { FAQ } = window.LYNUS;
  return (
    <section className="section" id="perguntas">
      <div className="wrap">
        <div className="section-head reveal">
          <h2>{FAQ.title}</h2>
        </div>
        <div className="faq reveal">
          {FAQ.items.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const { CONTATO, waLink } = window.LYNUS;
  const [form, setForm] = React.useState({ nome: '', empresa: '', porte: '', area: CONTATO.areas[0] });
  const [error, setError] = React.useState('');
  const set = k => e => setForm(p => ({...p, [k]: e.target.value}));
  const send = e => {
    e.preventDefault();
    const nome = form.nome.trim();
    const empresa = form.empresa.trim();
    if (!nome || !empresa || !form.porte) {
      setError('Preencha nome, empresa e número de colaboradores para continuar.');
      return;
    }
    setError('');
    const msg = `Olá, Ricardo. Sou ${nome}, da ${empresa}. Temos ${form.porte} colaboradores. Área que mais precisa de controle: ${form.area}. Quero saber sobre o diagnóstico de processos.`;
    if (window.lynusTrack) window.lynusTrack('lead', { method: 'formulario', porte: form.porte, area: form.area });
    window.open(waLink(msg), '_blank', 'noopener');
  };

  return (
    <section className="section contact-section" id="contato">
      <div className="wrap">
        <div className="contact-box glass reveal">
          <div className="contact-glow"/>

          <div className="contact-cols">
            <div className="contact-head">
              <span className="eyebrow"><span className="dot"/>Contato</span>
              <h2>{CONTATO.title}</h2>
              <p>{CONTATO.sub}</p>
              <div className="contact-dados">
                <span>E-mail: <a href={"mailto:" + CONTATO.email}>{CONTATO.email}</a></span>
                <span>{CONTATO.local}</span>
              </div>
            </div>

            <form className="contact-form" onSubmit={send} noValidate>
              <div className="cf-field">
                <label className="cf-label" htmlFor="cf-nome">Seu nome</label>
                <input id="cf-nome" className="cf-input" autoComplete="name"
                  value={form.nome} onChange={set('nome')} required/>
              </div>
              <div className="cf-field">
                <label className="cf-label" htmlFor="cf-empresa">Empresa</label>
                <input id="cf-empresa" className="cf-input" autoComplete="organization"
                  value={form.empresa} onChange={set('empresa')} required/>
              </div>
              <div className="cf-row">
                <div className="cf-field">
                  <label className="cf-label" htmlFor="cf-porte">Número de colaboradores</label>
                  <select id="cf-porte" className="cf-input" value={form.porte} onChange={set('porte')} required>
                    <option value="">Selecione</option>
                    {CONTATO.portes.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div className="cf-field">
                  <label className="cf-label" htmlFor="cf-area">Área que mais precisa de controle</label>
                  <select id="cf-area" className="cf-input" value={form.area} onChange={set('area')}>
                    {CONTATO.areas.map((a) => <option key={a}>{a}</option>)}
                  </select>
                </div>
              </div>
              <p className="cf-error" role="alert">{error}</p>
              <button className="btn btn-primary cf-submit" type="submit">Enviar pelo WhatsApp →</button>
              <small className="cf-note">{CONTATO.privacidade}</small>
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
    <footer className="footer">
      <div className="wrap footer-inner">
        <div className="footer-brand">
          <p>{FOOTER.tagline}</p>
        </div>
        <div className="footer-cols">
          {FOOTER.cols.map((col) => (
            <div key={col.h} className="footer-col">
              <h4>{col.h}</h4>
              {col.items.map((it) => it.href
                ? <a key={it.label} href={it.href} {...(it.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{it.label}</a>
                : <span key={it.label} className="footer-text">{it.label}</span>)}
            </div>
          ))}
        </div>
      </div>
      <div className="wrap footer-bottom">
        <span>{FOOTER.copyright}</span>
      </div>
    </footer>
  );
}

/* ---- Mini dashboard preview (CSS-only mockup) ---- */
window.LynusSections = { Nav, Hero, Features, Diagnostico, SolucoesGrid, Vantagens, Sobre, Processo, Faq, CTASection, Footer, Cursor, PageLoader, ThreeBackground };
