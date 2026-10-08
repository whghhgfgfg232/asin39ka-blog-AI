import { useEffect, useRef, useState } from "react";
import type { LaunchFn } from "@/App";

type Weather = {
  name: string;
  icon: string;
  desc: string;
  temp: string;
  gradient: string;
  reward: string;
  rewardIcon: string;
};

const WEATHERS: Weather[] = [
  {
    name: "Thunderstorm",
    icon: "⛈️",
    desc: "Heavy data-storms rolling over the district. The reward is charged with lightning.",
    temp: "17°",
    gradient: "from-indigo-950 via-slate-900 to-slate-950",
    reward: "150 coins + lightning bolt",
    rewardIcon: "⚡",
  },
  {
    name: "Neon Rain",
    icon: "🌧️",
    desc: "Warm rain lit by the mall's neon. Coins reflect in every puddle.",
    temp: "14°",
    gradient: "from-cyan-950 via-slate-900 to-slate-950",
    reward: "120 coins + umbrella skin",
    rewardIcon: "☂️",
  },
  {
    name: "Solar Flare",
    icon: "☀️",
    desc: "The sun is compiling at 100%. Everything renders in bloom.",
    temp: "34°",
    gradient: "from-amber-950 via-slate-900 to-slate-950",
    reward: "200 coins + flare aura",
    rewardIcon: "🔥",
  },
  {
    name: "Data Blizzard",
    icon: "❄️",
    desc: "Packets falling like snow. Latency: beautiful.",
    temp: "-6°",
    gradient: "from-sky-950 via-slate-900 to-slate-950",
    reward: "170 coins + frost effect",
    rewardIcon: "🧊",
  },
  {
    name: "Fog of Compilation",
    icon: "🌫️",
    desc: "You can't see the build output. Nobody can. Ship it anyway.",
    temp: "9°",
    gradient: "from-zinc-900 via-slate-900 to-slate-950",
    reward: "90 coins + fog cloak",
    rewardIcon: "🌫️",
  },
];

function useCountUp(target: number, run: boolean) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 1200);
      setV(Math.floor(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run]);
  return v;
}

export default function Weather({ launch }: { launch: LaunchFn }) {
  const [day, setDay] = useState(3);
  const [wIndex, setWIndex] = useState(0);
  const [claimed, setClaimed] = useState(false);
  const burstRef = useRef<HTMLDivElement>(null);
  const coins = useCountUp(150, claimed);
  const w = WEATHERS[wIndex];

  const claim = () => {
    if (claimed) return;
    setClaimed(true);
    if (burstRef.current) {
      burstRef.current.classList.remove("hidden");
      setTimeout(() => burstRef.current?.classList.add("hidden"), 1600);
    }
  };

  const nextDay = () => {
    setDay((d) => d + 1);
    setWIndex((i) => (i + 1) % WEATHERS.length);
    setClaimed(false);
  };

  return (
    <section id="weather" className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink px-4 py-28">
      <div className="grid-bg absolute inset-0 opacity-50" />
      {/* rain */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="rain-line absolute top-0 w-px bg-gradient-to-b from-transparent via-cyan-300/50 to-transparent"
            style={{
              left: `${(i * 97) % 100}%`,
              height: `${60 + (i % 5) * 22}px`,
              animationDuration: `${0.7 + (i % 4) * 0.22}s`,
              animationDelay: `${(i % 7) * 0.31}s`,
            }}
          />
        ))}
      </div>
      {/* lightning */}
      <div className="lightning-flash pointer-events-none absolute inset-0 bg-white/60" />

      <div className="reveal relative z-10 mx-auto w-full max-w-5xl">
        <div className="mb-8 text-center">
          <div className="mb-2 font-mono text-[11px] tracking-[0.5em] text-cyan-300/80">
            SCENE 05 · FICTIONAL WEATHER SYSTEM
          </div>
          <h2 className="glow-cyan text-4xl font-bold text-white sm:text-6xl">WEATHER &amp; REWARDS</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-400">
            A fictional weather system with daily rewards. Today:{" "}
            <span className="text-cyan-300">150 coins</span> and a{" "}
            <span className="text-amber-300">lightning bolt</span> await you.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
          {/* forecast card */}
          <div className={`panel neon-border relative overflow-hidden rounded-3xl bg-gradient-to-br ${w.gradient} p-8`}>
            <div className="flex items-start justify-between">
              <div>
                <div className="font-mono text-[10px] tracking-[0.35em] text-slate-400">
                  TODAY'S FORECAST · DAY {day}
                </div>
                <h3 className="mt-1 text-3xl font-bold text-white">{w.name}</h3>
                <div className="mt-1 font-mono text-sm text-cyan-300">{w.temp} · wind 12 km/h</div>
              </div>
              <div className="animate-floaty text-7xl drop-shadow-[0_0_25px_rgba(34,211,238,0.6)]">
                {w.icon}
              </div>
            </div>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-slate-300">{w.desc}</p>

            {/* mini stats */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                ["HUMIDITY", "88%"],
                ["VISIBILITY", "2.1 km"],
                ["UV INDEX", "Low"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl border border-slate-600/30 bg-slate-950/40 px-3 py-2">
                  <div className="font-mono text-[9px] tracking-[0.25em] text-slate-500">{k}</div>
                  <div className="font-mono text-sm text-slate-200">{v}</div>
                </div>
              ))}
            </div>

            {/* weekly strip */}
            <div className="mt-6 flex items-center gap-2">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex h-9 flex-1 items-center justify-center rounded-lg border font-mono text-xs ${
                    i + 1 === day
                      ? "border-cyan-400/60 bg-cyan-400/15 text-cyan-200"
                      : i + 1 < day
                        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                        : "border-slate-600/30 bg-slate-900/40 text-slate-600"
                  }`}
                >
                  {i + 1 < day ? "✓" : i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* reward card */}
          <div className="panel flex flex-col rounded-3xl p-8">
            <div className="font-mono text-[10px] tracking-[0.35em] text-slate-400">
              DAILY REWARD
            </div>
            <div className="mt-4 flex items-center gap-4">
              <div className="coin-spin relative h-16 w-16 shrink-0">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-300 to-amber-600 shadow-[0_0_30px_rgba(251,191,36,0.6)]" />
                <div className="absolute inset-2 rounded-full border-4 border-amber-200/70" />
                <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-amber-900">
                  $
                </div>
              </div>
              <div>
                <div className="font-mono text-4xl font-extrabold tabular-nums text-amber-300">
                  {coins}
                </div>
                <div className="font-mono text-[10px] tracking-[0.3em] text-slate-500">
                  COINS {claimed ? "RECEIVED" : "PENDING"}
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-amber-400/25 bg-amber-400/5 px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{w.rewardIcon}</span>
                <div>
                  <div className="font-mono text-xs text-amber-200">BONUS ITEM</div>
                  <div className="text-sm text-slate-200">{w.reward}</div>
                </div>
              </div>
            </div>

            <button
              onClick={claim}
              disabled={claimed}
              className={`mt-6 w-full rounded-xl px-6 py-4 font-mono text-sm font-bold tracking-[0.25em] transition active:scale-95 ${
                claimed
                  ? "cursor-default border border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                  : "bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 hover:brightness-110 shadow-[0_0_40px_rgba(251,191,36,0.35)]"
              }`}
            >
              {claimed ? "✓ CLAIMED — COME BACK TOMORROW" : "CLAIM TODAY'S REWARD"}
            </button>
            <button
              onClick={nextDay}
              className="mt-3 w-full rounded-xl border border-slate-600/40 px-6 py-3 font-mono text-[11px] tracking-[0.25em] text-slate-400 transition hover:border-cyan-400/50 hover:text-cyan-200"
            >
              FAST-FORWARD 24H ⏩
            </button>
            <button
              onClick={() => launch("weather")}
              className="mt-3 w-full rounded-xl border border-sky-400/40 bg-sky-400/10 px-6 py-3 font-mono text-[11px] font-bold tracking-[0.25em] text-sky-200 transition hover:bg-sky-400/20 hover:text-white"
            >
              ▶ LAUNCH THE ORIGINAL FORECAST
            </button>

            {/* coin burst */}
            <div ref={burstRef} className="pointer-events-none absolute inset-0 hidden overflow-hidden rounded-3xl">
              {Array.from({ length: 14 }).map((_, i) => (
                <span
                  key={i}
                  className="animate-floaty absolute text-2xl"
                  style={{
                    left: `${(i * 71) % 95}%`,
                    top: `${(i * 37) % 90}%`,
                    animationDelay: `${i * 0.06}s`,
                  }}
                >
                  {i % 3 === 0 ? "⚡" : "🪙"}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
