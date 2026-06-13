/* ============================================================
   LYNUS TECH — App root + Tweaks
   ============================================================ */
const { Nav, Hero, Features, SistemasShowcase, Dashboards, Sobre, CTASection, Footer, Cursor, PageLoader, ThreeBackground } = window.LynusSections;

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

  /* GSAP animations */
  useEffect(() => {
    if (!window.gsap) return;
    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    const D = 1.75;
    gsap.fromTo('.hero-badge',      { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: D });
    gsap.fromTo('.hero-title span', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.11, ease: 'power3.out', delay: D + 0.14 });
    gsap.fromTo('.hero-sub',        { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out', delay: D + 0.52 });
    gsap.fromTo('.hero-cta',        { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', delay: D + 0.68 });
    gsap.fromTo('.hero-bullets',    { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', delay: D + 0.82 });
    gsap.fromTo('.trust',           { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', delay: D + 1.0 });

    if (!window.ScrollTrigger) return;

    gsap.utils.toArray('.reveal').forEach(el => {
      gsap.fromTo(el, { y: 52, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.95, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 87%', once: true } });
    });

    gsap.fromTo('.bento-card', { y: 44, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.07, ease: 'power2.out',
        scrollTrigger: { trigger: '.bento', start: 'top 82%', once: true } });

    gsap.to('.bg-layer .glow',   { y: 180, ease: 'none', scrollTrigger: { scrub: 2 } });
    gsap.to('.bg-layer .glow-2', { y: -100, ease: 'none', scrollTrigger: { scrub: 3 } });
  }, []);

  /* 3D card tilt */
  useEffect(() => {
    const cleanup = [];
    document.querySelectorAll('.bento-card, .cta-box').forEach(card => {
      const onMove = (e) => {
        const r = card.getBoundingClientRect();
        const rx = -((e.clientY - r.top)  / r.height - 0.5) * 14;
        const ry =  ((e.clientX - r.left) / r.width  - 0.5) * 14;
        card.style.transition = 'transform 0.08s ease';
        card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(8px)`;
      };
      const onLeave = () => {
        card.style.transition = 'transform 0.6s cubic-bezier(.2,.8,.2,1)';
        card.style.transform = '';
      };
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
      cleanup.push(() => { card.removeEventListener('mousemove', onMove); card.removeEventListener('mouseleave', onLeave); });
    });
    return () => cleanup.forEach(f => f());
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
      <ThreeBackground />

      <div className="bg-layer" aria-hidden="true">
        <div className="glow"></div>
        <div className="glow-2"></div>
        <div className="grid"></div>
      </div>

      <Nav />
      <main>
        <Hero layout={heroLayout} />
        <Features />
        <SistemasShowcase />
        <Dashboards />
        <Sobre />
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
