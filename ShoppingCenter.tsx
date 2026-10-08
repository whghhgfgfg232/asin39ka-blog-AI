import { useEffect, useRef, useState } from "react";
import type { LaunchFn } from "../App";

const SHOPS = [
  { name: "GG GAMES", color: "bg-fuchsia-500/80" },
  { name: "NOODLE BAR", color: "bg-orange-500/80" },
  { name: "COIN SHOP", color: "bg-amber-400/80" },
  { name: "ARCADE", color: "bg-cyan-400/80" },
  { name: "AI CAFÉ", color: "bg-violet-500/80" },
];

const WALKERS = [
  { delay: "0s", dur: "9s", top: "72%", scale: 1 },
  { delay: "-3s", dur: "11s", top: "78%", scale: 0.85 },
  { delay: "-6s", dur: "13s", top: "84%", scale: 1.1 },
];

export default function ShoppingCenter({ launch }: { launch: LaunchFn }) {
  const [m, setM] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      setM({
        x: ((e.clientX - r.left) / r.width - 0.5) * 2,
        y: ((e.clientY - r.top) / r.height - 0.5) * 2,
      });
    };
    const onLeave = () => setM({ x: 0, y: 0 });
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section id="center" className="relative min-h-screen overflow-hidden bg-ink py-28">
      <div className="absolute inset-0 grid-bg opacity-30" />

      <div className="relative mx-auto max-w-6xl px-4">
        <div className="mb-8 text-center">
          <div className="mb-2 font-mono text-[11px] tracking-[0.5em] text-pink-300/80">
            SCENE 07 · 2.5D
          </div>
          <h2 className="glow-cyan text-4xl font-bold text-white sm:text-6xl">
            SHOPPING CENTER
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-400">
            Another shopping center — this time in 2.5D. It turned out pretty well for me.{" "}
            <span className="font-mono text-cyan-300">Move your mouse to look around.</span>
          </p>
        </div>

        {/* 2.5D stage */}
        <div
          ref={ref}
          className="scene25 relative h-[26rem] overflow-hidden rounded-3xl border border-cyan-400/20 sm:h-[32rem]"
          style={{
            background:
              "linear-gradient(180deg,#1e1b4b 0%,#4c1d95 32%,#9d174d 62%,#f59e0b 100%)",
          }}
        >
          {/* stars */}
          <div className="pointer-events-none absolute inset-0">
            {Array.from({ length: 26 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white/80"
                style={{
                  left: `${(i * 137) % 100}%`,
                  top: `${(i * 53) % 30}%`,
                  width: i % 3 === 0 ? 3 : 2,
                  height: i % 3 === 0 ? 3 : 2,
                  opacity: 0.4 + ((i * 7) % 6) / 10,
                }}
              />
            ))}
          </div>

          {/* sun */}
          <div
            className="pointer-events-none absolute left-1/2 top-[38%] h-28 w-28 -translate-x-1/2 rounded-full bg-amber-200 blur-xl"
            style={{ boxShadow: "0 0 120px 60px rgba(253,224,71,0.35)" }}
          />

          {/* parallax world */}
          <div
            className="layer25 absolute inset-0"
            style={{
              transform: `rotateY(${m.x * 7}deg) rotateX(${-m.y * 4}deg)`,
            }}
          >
            {/* far skyline */}
            <div
              className="absolute bottom-[34%] left-0 right-0 flex items-end justify-center gap-1 px-6 opacity-70"
              style={{ transform: "translateZ(-180px)" }}
            >
              {[38, 62, 46, 84, 54, 70, 42, 90, 58, 48, 76, 40].map((h, i) => (
                <div
                  key={i}
                  className="w-8 rounded-t-sm bg-indigo-950/90 sm:w-12"
                  style={{ height: h }}
                >
                  <div className="mt-2 grid grid-cols-2 gap-1 p-1">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <div
                        key={j}
                        className={`h-1.5 w-full rounded-[1px] ${
                          (i + j) % 3 === 0 ? "bg-amber-300/70" : "bg-indigo-900/40"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* ground plaza */}
            <div
              className="absolute bottom-0 left-[-10%] right-[-10%] h-[36%]"
              style={{
                transform: "translateZ(-60px)",
                background:
                  "linear-gradient(180deg,#312e81 0%,#1e1b4b 40%,#0f172a 100%)",
              }}
            >
              <div className="absolute left-0 right-0 top-0 h-2 bg-cyan-400/30" />
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute top-6 h-1 w-16 bg-slate-600/40"
                  style={{ left: `${i * 11 + 4}%`, transform: "rotate(-4deg)" }}
                />
              ))}
            </div>

            {/* MALL building */}
            <div
              className="absolute bottom-[30%] left-1/2 w-[78%] max-w-2xl -translate-x-1/2"
              style={{ transform: "translateX(-50%) translateZ(40px)" }}
            >
              {/* roof sign */}
              <div className="mb-1 text-center font-mono text-sm font-extrabold tracking-[0.3em] text-cyan-200 drop-shadow-[0_0_12px_rgba(34,211,238,0.9)] sm:text-lg">
                ◢ 2.5D CENTER ◣
              </div>
              <div className="relative rounded-t-2xl border-2 border-cyan-300/40 bg-gradient-to-b from-slate-800 to-slate-900 p-3 shadow-[0_0_60px_rgba(34,211,238,0.25)]">
                {/* second floor */}
                <div className="mb-2 grid grid-cols-5 gap-2">
                  {SHOPS.map((s) => (
                    <div
                      key={s.name}
                      className={`group cursor-pointer rounded-md ${s.color} p-2 transition hover:brightness-125`}
                    >
                      <div className="h-10 rounded-sm bg-black/40 sm:h-14" />
                      <div className="mt-1 truncate text-center font-mono text-[7px] font-bold text-white sm:text-[9px]">
                        {s.name}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="h-1 rounded-full bg-cyan-400/40" />
                {/* ground floor */}
                <div className="mt-2 grid grid-cols-5 gap-2">
                  {SHOPS.map((s, i) => (
                    <div
                      key={s.name}
                      className={`group cursor-pointer rounded-md ${s.color} p-2 transition hover:brightness-125 ${
                        i === 2 ? "col-span-2" : ""
                      }`}
                    >
                      <div className="h-12 rounded-sm bg-black/40 sm:h-16" />
                      <div className="mt-1 truncate text-center font-mono text-[7px] font-bold text-white sm:text-[9px]">
                        {i === 2 ? "COIN SHOP + ARCADE" : s.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* entrance */}
              <div className="mx-auto h-8 w-40 rounded-b-lg bg-cyan-200/20 shadow-[inset_0_0_30px_rgba(34,211,238,0.5)]" />
            </div>

            {/* escalator */}
            <div
              className="absolute bottom-[30%] right-[4%] w-40 sm:w-56"
              style={{ transform: "translateZ(120px)" }}
            >
              <div className="relative h-28 overflow-hidden rounded-lg border border-cyan-300/30 bg-slate-950/70">
                <div
                  className="escalator-strip absolute inset-0"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(180deg,#334155 0px,#334155 12px,#1e293b 14px,#1e293b 28px)",
                    backgroundSize: "100% 56px",
                  }}
                />
                <div className="absolute inset-x-0 top-0 h-3 bg-gradient-to-r from-cyan-400/60 via-white/40 to-cyan-400/60" />
                <div className="absolute inset-x-0 bottom-0 h-3 bg-gradient-to-r from-cyan-400/60 via-white/40 to-cyan-400/60" />
                <div className="absolute inset-0 flex items-center justify-center font-mono text-[10px] tracking-[0.3em] text-cyan-200">
                  ESCALATOR ▲
                </div>
              </div>
            </div>

            {/* walkers */}
            {WALKERS.map((w, i) => (
              <div
                key={i}
                className="absolute"
                style={{
                  top: w.top,
                  left: 0,
                  transform: `translateZ(${80 + i * 30}px) scale(${w.scale})`,
                }}
              >
                <div
                  className="walk-across relative"
                  style={{ animationDuration: w.dur, animationDelay: w.delay }}
                >
                  <div className="animate-floaty flex flex-col items-center">
                    <div className="h-3 w-3 rounded-full bg-amber-200 shadow-[0_0_10px_rgba(253,230,138,0.8)]" />
                    <div
                      className={`h-7 w-5 rounded-t-md ${
                        i === 0 ? "bg-rose-400" : i === 1 ? "bg-cyan-300" : "bg-violet-300"
                      }`}
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* foreground plants */}
            <div
              className="absolute bottom-[-4%] left-[2%]"
              style={{ transform: "translateZ(200px)" }}
            >
              <div className="text-6xl drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]">🪴</div>
            </div>
            <div
              className="absolute bottom-[-4%] right-[3%]"
              style={{ transform: "translateZ(220px) scaleX(-1)" }}
            >
              <div className="text-6xl drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]">🪴</div>
            </div>
          </div>

          {/* badge */}
          <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/40 px-3 py-1 font-mono text-[10px] tracking-[0.3em] text-white/80 backdrop-blur">
            2.5D · CSS PERSPECTIVE
          </div>
          <div className="absolute bottom-4 right-4 rounded-full border border-white/20 bg-black/40 px-3 py-1 font-mono text-[10px] tracking-[0.3em] text-white/80 backdrop-blur">
            FPS ∞ · NO WEBGL
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => launch("center")}
            className="rounded-full bg-gradient-to-r from-pink-500 to-violet-500 px-6 py-3 font-mono text-xs font-bold tracking-[0.2em] text-white transition hover:brightness-110 active:scale-95"
          >
            ▶ LAUNCH THE ORIGINAL
          </button>
          <span className="font-mono text-[11px] text-slate-500">
            “it turned out pretty well for me”
          </span>
        </div>
      </div>
    </section>
  );
}
