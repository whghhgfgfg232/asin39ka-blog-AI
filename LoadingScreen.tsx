import { useEffect, useRef, useState } from "react";
import { FACTS } from "../data";

type Stage = "intro" | "loading";

const BOOT_LINES = [
  "> initializing webgl context …",
  "> loading scene: tv_room.glb …",
  "> mounting agent daemon …",
  "> cloudflare tunnel: standby …",
  "> core temperature: 800°C nominal …",
  "> ready.",
];

export default function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [stage, setStage] = useState<Stage>("intro");
  const [progress, setProgress] = useState(0);
  const [factIndex, setFactIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const timer = useRef<number | null>(null);

  // progress + fact rotation while loading
  useEffect(() => {
    if (stage !== "loading") return;
    const started = performance.now();
    const DURATION = 5200;
    const tick = () => {
      const p = Math.min(1, (performance.now() - started) / DURATION);
      setProgress(p);
      if (p < 1) timer.current = requestAnimationFrame(tick);
      else setTimeout(() => setLeaving(true), 500);
    };
    timer.current = requestAnimationFrame(tick);
    return () => {
      if (timer.current) cancelAnimationFrame(timer.current);
    };
  }, [stage]);

  // rotate facts
  useEffect(() => {
    if (stage !== "loading") return;
    const id = setInterval(() => setFactIndex((i) => (i + 1) % FACTS.length), 2600);
    return () => clearInterval(id);
  }, [stage]);

  // fade out then unmount
  useEffect(() => {
    if (!leaving) return;
    const id = setTimeout(onDone, 900);
    return () => clearTimeout(id);
  }, [leaving, onDone]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-ink transition-all duration-700 ${
        leaving ? "opacity-0 blur-xl scale-105" : "opacity-100"
      }`}
    >
      {/* animated background */}
      <div className="absolute inset-0 grid-bg opacity-70" />
      <div className="absolute -left-40 top-1/4 h-[38rem] w-[38rem] rounded-full bg-cyan-500/20 blur-[120px] animate-floaty" />
      <div
        className="absolute -right-32 bottom-0 h-[34rem] w-[34rem] rounded-full bg-violet-600/20 blur-[120px] animate-floaty"
        style={{ animationDelay: "1.6s" }}
      />
      <div className="absolute inset-0 scanlines" />
      <div className="absolute inset-0 vignette" />

      <div className="relative z-10 w-full max-w-3xl px-6 text-center">
        {/* logo */}
        <div className="mb-2 font-mono text-xs tracking-[0.5em] text-cyan-300/80">
          ASIN39K // 3D UNIVERSE
        </div>
        <h1 className="glow-cyan animate-flicker text-6xl font-bold tracking-tight text-white sm:text-8xl">
          ASIN<span className="text-cyan-300">39</span>K
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm text-slate-400 sm:text-base">
          Student of artificial intelligence · builder of 3D scenes · permanent resident of the TV room.
        </p>

        {stage === "intro" ? (
          <div className="mt-12 flex flex-col items-center gap-6">
            <button
              onClick={() => setStage("loading")}
              className="neon-border group relative rounded-full bg-cyan-400/10 px-14 py-5 font-mono text-lg font-bold tracking-[0.3em] text-cyan-200 transition-all duration-300 hover:bg-cyan-400/20 hover:text-white hover:shadow-[0_0_50px_rgba(34,211,238,0.45)] active:scale-95"

            >
              <span className="relative z-10">START</span>
            </button>
            <div className="font-mono text-[11px] tracking-widest text-slate-500">
              PRESS START TO ENTER THE UNIVERSE
            </div>
          </div>
        ) : (
          <div className="mt-12">
            {/* progress */}
            <div className="mx-auto h-2 w-full max-w-md overflow-hidden rounded-full border border-cyan-400/20 bg-slate-900/80">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400 shadow-[0_0_18px_rgba(34,211,238,0.8)] transition-[width] duration-100"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <div className="mx-auto mt-2 flex w-full max-w-md justify-between font-mono text-[11px] text-cyan-300/70">
              <span>LOADING SCENE</span>
              <span>{Math.round(progress * 100)}%</span>
            </div>

            {/* rotating fact */}
            <div className="panel neon-border mx-auto mt-10 max-w-xl rounded-2xl p-6 text-left">
              <div className="mb-3 flex items-center gap-2 font-mono text-[11px] tracking-[0.3em] text-violet-300">
                <span className="inline-block h-2 w-2 rounded-full bg-violet-400 pulse-ring" />
                FACT ABOUT ASIN39K
              </div>
              <p
                key={factIndex}
                className="min-h-16 text-base leading-relaxed text-slate-200 sm:text-lg"
                style={{ animation: "floaty 0.6s ease" }}
              >
                “{FACTS[factIndex]}”
              </p>
              <div className="mt-4 flex gap-1.5">
                {FACTS.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      i === factIndex ? "bg-cyan-300" : "bg-slate-700"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* boot log */}
            <div className="mx-auto mt-6 max-w-md text-left font-mono text-[11px] text-emerald-300/70">
              {BOOT_LINES.slice(0, Math.ceil(progress * BOOT_LINES.length)).map((l, i) => (
                <div key={i} className="truncate">
                  {l}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
