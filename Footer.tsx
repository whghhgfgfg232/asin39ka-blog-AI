import { PROJECTS } from "../data";
import type { LaunchFn } from "../App";

const FACTS = [
  { k: "USING AI SINCE", v: "June 2025" },
  { k: "LONGEST-USED AI", v: "ChatGPT · Arena AI" },
  { k: "YOUTUBE", v: "Channel active" },
  { k: "AGENT STACK", v: "Cloudflare tunnel · no MKEP" },
];

export default function Footer({ launch }: { launch: LaunchFn }) {
  return (
    <footer className="relative overflow-hidden border-t border-cyan-400/15 bg-ink px-4 py-16">
      <div className="grid-bg absolute inset-0 opacity-30" />
      <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[100px]" />

      <div className="reveal relative mx-auto max-w-6xl">
        {/* the ban card */}
        <div className="panel neon-border mx-auto max-w-2xl rounded-2xl p-6 text-center">
          <div className="mb-2 font-mono text-[10px] tracking-[0.4em] text-rose-300">
            OFFICIAL RECORD
          </div>
          <h3 className="text-xl font-bold text-white">
            Permanently banned from the Arena Discord
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            The reason: I kept using the channels incorrectly and not following the required
            formatting. My appeal was rejected. So I built a website instead — with 3D scenes,
            a reactor game and a mall full of coins.
          </p>
          <a
            href="#ban"
            className="mt-4 inline-block rounded-full border border-red-400/40 bg-red-500/10 px-5 py-2 font-mono text-[10px] tracking-[0.25em] text-red-200 transition hover:bg-red-500/20"
          >
            READ THE FULL CASE FILE ↑
          </a>
        </div>

        {/* facts */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {FACTS.map((f) => (
            <div
              key={f.k}
              className="rounded-xl border border-slate-600/25 bg-slate-950/40 px-4 py-3 text-center"
            >
              <div className="font-mono text-[9px] tracking-[0.25em] text-slate-500">{f.k}</div>
              <div className="mt-1 font-mono text-xs font-bold text-cyan-200">{f.v}</div>
            </div>
          ))}
        </div>

        {/* links */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {PROJECTS.map((p) => (
            <button
              key={p.url}
              onClick={() => launch(p.key)}
              className="rounded-full border border-slate-600/30 px-4 py-2 font-mono text-[10px] tracking-[0.15em] text-slate-400 transition hover:border-cyan-400/50 hover:text-cyan-200"
            >
              ▶ LAUNCH {p.title}
            </button>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="glow-cyan text-3xl font-extrabold tracking-tight text-white">
            ASIN<span className="text-cyan-300">39</span>K
          </div>
          <p className="mt-2 font-mono text-[10px] tracking-[0.3em] text-slate-600">
            3D UNIVERSE · REACT + THREE.JS + TAILWIND · ZERO MKEP
          </p>
        </div>
      </div>
    </footer>
  );
}
