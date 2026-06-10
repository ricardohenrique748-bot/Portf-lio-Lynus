/* ============================================================
   LYNUS TECH — App root + Tweaks
   ============================================================ */
const { Nav, Hero, Stats, Features, CTASection, Footer } = window.LynusSections;

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
  useEffect(() => { window.LYNUS.startVisibility(); }, []);

  const heroLayout = t.heroLayout === "split" ? "split" : "centered";

  return (
    <>
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
