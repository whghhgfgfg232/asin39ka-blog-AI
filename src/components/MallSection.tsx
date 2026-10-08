import { useState } from "react";
import GeometryMall from "@/components/GeometryMall";
import type { LaunchFn } from "@/App";

export default function MallSection({ launch }: { launch: LaunchFn }) {
  const [collected, setCollected] = useState<number[]>([]);

  return (
    <section id="mall" className="relative min-h-screen overflow-hidden bg-ink">
      <div className="absolute inset-0">
        <GeometryMall collected={collected} onCollect={(i) => setCollected((c) => [...c, i])} />
      </div>
      <div className="scanlines pointer-events-none absolute inset-0" />
      <div className="vignette pointer-events-none absolute inset-0" />

      <div className="pointer-events-none absolute left-0 right-0 top-24 z-10 px-6 text-center sm:top-28">
        <div className="pointer-events-auto inline-block">
          <div className="mb-2 font-mono text-[11px] tracking-[0.5em] text-rose-300/80">
            SCENE 04 · 3D WORLD
          </div>
          <h2 className="glow-cyan text-4xl font-bold text-white sm:text-6xl">
            GEOMETRY DASH MALL
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-400">
            Two floors of shops and restaurants, GG, an automated bot patrolling the plaza — and
            coins everywhere.{" "}
            <span className="text-amber-300">Click the coins to collect them.</span>
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-6 sm:px-8 sm:pb-10">
        <div className="panel mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-4 rounded-2xl px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="coin-spin flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-amber-600 font-mono font-bold text-amber-900">
              $
            </span>
            <div>
              <div className="font-mono text-[9px] tracking-[0.3em] text-slate-500">
                COINS COLLECTED
              </div>
              <div className="font-mono text-2xl font-extrabold tabular-nums text-amber-300">
                {collected.length}
                <span className="text-sm text-slate-500"> / 8</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => launch("mall")}
            className="rounded-full border border-rose-400/30 bg-rose-400/10 px-5 py-2.5 font-mono text-[11px] tracking-[0.2em] text-rose-200 transition hover:bg-rose-400/20 hover:text-white"
          >
            ▶ LAUNCH ORIGINAL
          </button>
          <button
            onClick={() => setCollected([])}
            className="rounded-full border border-slate-600/40 px-5 py-2.5 font-mono text-[11px] tracking-[0.2em] text-slate-400 transition hover:border-cyan-400/50 hover:text-cyan-200"
          >
            RESPAWN COINS
          </button>
        </div>
      </div>
    </section>
  );
}
