import { useCallback, useEffect, useState } from "react";
import LoadingScreen from "./components/LoadingScreen";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import LaunchOverlay from "./components/LaunchOverlay";
import TVRoomSection from "./components/TVRoomSection";
import AgentSection from "./components/AgentSection";
import CoreSection from "./components/CoreSection";
import MallSection from "./components/MallSection";
import Weather from "./components/Weather";
import Blog from "./components/Blog";
import BanSection from "./components/BanSection";
import ShoppingCenter from "./components/ShoppingCenter";
import { FACTS, PROJECT_BY_KEY, type Project } from "./data";

export type LaunchFn = (key: string) => void;

function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-24">
      <div className="grid-bg absolute inset-0 opacity-60" />
      <div className="absolute -left-40 top-10 h-[32rem] w-[32rem] rounded-full bg-cyan-500/15 blur-[130px] animate-floaty" />
      <div
        className="absolute -right-40 bottom-0 h-[30rem] w-[30rem] rounded-full bg-violet-600/15 blur-[130px] animate-floaty"
        style={{ animationDelay: "2s" }}
      />
      <div className="scanlines pointer-events-none absolute inset-0" />
      <div className="vignette pointer-events-none absolute inset-0" />

      <div className="relative z-10 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/5 px-4 py-1.5 font-mono text-[10px] tracking-[0.35em] text-cyan-200">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 pulse-ring" />
          3D UNIVERSE · ONLINE
        </div>

        <h1 className="animate-flicker text-6xl font-extrabold tracking-tight text-white sm:text-8xl lg:text-9xl">
          <span className="glow-cyan">ASIN</span>
          <span className="bg-gradient-to-br from-cyan-300 to-violet-400 bg-clip-text text-transparent">
            39
          </span>
          <span className="glow-violet">K</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
          Student of artificial intelligence since{" "}
          <span className="text-cyan-300">June 2025</span>. Builder of 3D scenes. I talk to an AI
          through my <span className="text-cyan-300">TV</span>, my agent runs servers through a{" "}
          <span className="text-emerald-300">Cloudflare tunnel</span>, and I was unfairly
          permanently banned from the Arena Discord.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#room"
            className="neon-border rounded-full bg-cyan-400/10 px-8 py-4 font-mono text-sm font-bold tracking-[0.25em] text-cyan-100 transition hover:bg-cyan-400/20 hover:text-white hover:shadow-[0_0_50px_rgba(34,211,238,0.4)] active:scale-95"
          >
            ENTER THE TV ROOM ↓
          </a>
          <a
            href="#core"
            className="rounded-full border border-slate-600/50 px-8 py-4 font-mono text-sm font-bold tracking-[0.25em] text-slate-300 transition hover:border-amber-300/60 hover:text-amber-200 active:scale-95"
          >
            PLAY THE CORE 🎮
          </a>
        </div>
      </div>

      {/* scroll hint */}
      <div className="absolute bottom-24 left-1/2 z-10 -translate-x-1/2 animate-floaty font-mono text-[10px] tracking-[0.4em] text-slate-500">
        SCROLL ↓
      </div>

      {/* fact marquee */}
      <div className="absolute bottom-8 left-0 right-0 z-10 overflow-hidden border-y border-slate-700/30 bg-slate-950/40 py-3 backdrop-blur">
        <div className="marquee-track flex w-max gap-8 whitespace-nowrap font-mono text-[11px] tracking-[0.2em] text-slate-500">
          {[...FACTS, ...FACTS].map((f, i) => (
            <span key={i} className="flex items-center gap-8">
              <span className="text-cyan-400/60">◆</span>
              {f}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [project, setProject] = useState<Project | null>(null);

  const launch = useCallback((key: string) => {
    const p = PROJECT_BY_KEY[key];
    if (p) setProject(p);
  }, []);

  // reveal-on-scroll for .reveal elements
  useEffect(() => {
    if (!loaded) return;
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [loaded]);

  return (
    <div className="relative">
      {!loaded && <LoadingScreen onDone={() => setLoaded(true)} />}
      <Nav />
      <main className={loaded ? "" : "pointer-events-none"}>
        <Hero />
        <TVRoomSection />
        <AgentSection />
        <CoreSection launch={launch} />
        <MallSection launch={launch} />
        <Weather launch={launch} />
        <BanSection />
        <Blog launch={launch} />
        <ShoppingCenter launch={launch} />
      </main>
      <Footer launch={launch} />

      {project && (
        <LaunchOverlay project={project} onClose={() => setProject(null)} />
      )}
    </div>
  );
}
