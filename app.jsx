/* ============================================================
   LYNUS TECH — App root + Tweaks
   ============================================================ */
const { Nav, Hero, Stats, Features, CTASection, Footer, Cursor, PageLoader } = window.LynusSections;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "azul",
  "heroLayout": "centered",
  "background": "glow",
  "dashDensity": "command"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useEffect(() => { window.LYNUS.applyAccent(t.accent); }, [t.accent]);
  useEffect(() => { document.body.setAttribute("data-bg", t.background); }, [t.background]);

  /* Lenis smooth scroll */
  useEffect(() => {
    if (!window.Lenis) return;
    const lenis = new Lenis({ duration: 1.3, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    if (window.ScrollTrigger) lenis.on('scroll', ScrollTrigger.update);
    let raf;
    const tick = (time) => { lenis.raf(time); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); };
  }, []);

  /* GSAP animations */
  useEffect(() => {
    if (!window.gsap) return;
    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    const D = 1.75; /* hero entrance delay — after loader */

    /* Hero entrance timeline */
    gsap.fromTo('.hero-badge',   { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: D });
    gsap.fromTo('.hero-title span', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.11, ease: 'power3.out', delay: D + 0.14 });
    gsap.fromTo('.hero-sub',     { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out', delay: D + 0.52 });
    gsap.fromTo('.hero-cta',     { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', delay: D + 0.68 });
    gsap.fromTo('.hero-bullets', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', delay: D + 0.82 });
    gsap.fromTo('.trust',        { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', delay: D + 1.0 });

    if (!window.ScrollTrigger) return;

    /* Section scroll reveals */
    gsap.utils.toArray('.reveal').forEach(el => {
      gsap.fromTo(el,
        { y: 52, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.95, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 87%', once: true } }
      );
    });

    /* Bento cards stagger */
    gsap.fromTo('.bento-card',
      { y: 44, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.07, ease: 'power2.out',
        scrollTrigger: { trigger: '.bento', start: 'top 82%', once: true } }
    );

    /* Parallax glow */
    gsap.to('.bg-layer .glow', {
      y: 180, ease: 'none',
      scrollTrigger: { scrub: 2 }
    });
    gsap.to('.bg-layer .glow-2', {
      y: -100, ease: 'none',
      scrollTrigger: { scrub: 3 }
    });
  }, []);

  /* Magnetic buttons */
  useEffect(() => {
    const cleanup = [];
    document.querySelectorAll('.btn').forEach(btn => {
      const onMove = (e) => {
        const r = btn.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width  - 0.5) * 20;
        const y = ((e.clientY - r.top)  / r.height - 0.5) * 14;
        btn.style.transform = `translate(${x}px, ${y}px)`;
      };
      const onLeave = () => { btn.style.transform = ''; };
      btn.addEventListener('mousemove', onMove);
      btn.addEventListener('mouseleave', onLeave);
      cleanup.push(() => { btn.removeEventListener('mousemove', onMove); btn.removeEventListener('mouseleave', onLeave); });
    });
    return () => cleanup.forEach(f => f());
  }, []);

  const heroLayout = t.heroLayout === "split" ? "split" : "centered";

  return (
    <>
      <PageLoader />
      <Cursor />

      <div className="bg-layer" aria-hidden="true">
        <div className="glow"></div>
        <div className="glow-2"></div>
        <div className="grid"></div>
      </div>

      <Nav />
      <main>
        <Hero layout={heroLayout} />
        <Stats />
        <Features />
        <CTASection />
      </main>
      <Footer />

      <TweaksPanel>
        <TweakSection label="Cor de destaque" />
        <TweakColor label="Accent" value={window.LYNUS.ACCENTS[t.accent].accent}
          options={["#6b8aff", "#ff8a3d", "#f5c518", "#34e0a1"]}
          onChange={(hex) => {
            const map = { "#6b8aff": "azul", "#ff8a3d": "laranja", "#f5c518": "ambar", "#34e0a1": "verde" };
            setTweak("accent", map[hex] || "azul");
          }} />

        <TweakSection label="Layout do hero" />
        <TweakRadio label="Composição" value={t.heroLayout}
          options={["centered", "split"]}
          onChange={(v) => setTweak("heroLayout", v)} />

        <TweakSection label="Fundo" />
        <TweakRadio label="Tratamento" value={t.background}
          options={["glow", "grid", "minimal"]}
          onChange={(v) => setTweak("background", v)} />
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
