/* ============================================================
   LYNUS TECH — Page sections
   ============================================================ */

function Wordmark() {
  return (
    <a className="wordmark" href="#top" aria-label="Lynus Tech">
      <span className="lyn">LYN</span>
      <span className="u-wrap">
        US
        <span className="pixels" aria-hidden="true">
          <i></i><i></i><i className="c"></i>
          <i></i><i className="c"></i><i></i>
          <i className="c"></i><i></i><i></i>
        </span>
      </span>
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
          <a className="nav-signin" href="#">{NAV.signin}</a>
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
          <div className="hero-visual reveal" id="plataforma">
            <LynusDashboard density={layout === "split" ? "focus" : "command"} />
          </div>
        </div>

        <div className="trust reveal">
          <span className="trust-label">{HERO.trustLabel}</span>
          <div className="trust-logos">
            {LOGOS.map((n) => <span key={n} className="trust-logo">{n}</span>)}
          </div>
        </div>
      </div>
    </header>
  );
}

function Stats() {
  const { STATS } = window.LYNUS;
  return (
    <section className="section stats-section" id="solucoes">
      <div className="wrap">
        <div className="stats-row reveal">
          {STATS.map((s) => <StatBig key={s.k} {...s} />)}
        </div>
      </div>
    </section>
  );
}
function StatBig({ v, suf, k, d, dec }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    let started = false;
    const poll = setInterval(() => {
      if (started || !ref.current) return;
      const r = ref.current.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.9 && r.bottom > 0) {
        started = true;
        clearInterval(poll);
        const dur = 1500, start = Date.now();
        const anim = setInterval(() => {
          const p = Math.min(1, (Date.now() - start) / dur);
          const e = 1 - Math.pow(1 - p, 3);
          setVal(v * e);
          if (p >= 1) { setVal(v); clearInterval(anim); }
        }, 33);
      }
    }, 120);
    return () => clearInterval(poll);
  }, []);
  const disp = dec ? val.toFixed(dec) : Math.round(val).toLocaleString("pt-BR");
  return (
    <div className="stat-big" ref={ref}>
      <span className="stat-big-v">{disp}<i>{suf}</i></span>
      <span className="stat-big-k">{k}</span>
      <span className="stat-big-d">{d}</span>
    </div>
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
          <Wordmark />
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

window.LynusSections = { Nav, Hero, Stats, Features, CTASection, Footer };
