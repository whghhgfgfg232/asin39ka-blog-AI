import { useEffect, useRef, useState } from "react";
import AgentDesk from "../scenes/AgentDesk";
import { TERMINAL_SCRIPT } from "../data";

const BOOT_LINES = [
  "$ agent --boot",
  "[agent] daemon started · pid 1337",
  "[agent] host: asin39k-pc · linux",
  "[tunnel] standby …",
];

const CHIPS = [
  { k: "TUNNEL", v: "CLOUDFLARE · ONLINE", c: "text-emerald-300" },
  { k: "MKEP", v: "NOT REQUIRED", c: "text-cyan-300" },
  { k: "CODEX", v: "DOESN'T WORK FOR US", c: "text-rose-300" },
  { k: "CLAUDE CODE", v: "PAID · SKIPPED", c: "text-amber-300" },
];

export default function AgentSection() {
  const [lines, setLines] = useState<string[]>(BOOT_LINES);
  const [control, setControl] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(
    () => () => {
      timers.current.forEach((t) => window.clearTimeout(t));
    },
    [],
  );

  const run = (cmd: string) => {
    const script = TERMINAL_SCRIPT.find((s) => s.cmd === cmd);
    if (!script) return;
    script.lines.forEach((line, i) => {
      timers.current.push(
        window.setTimeout(() => setLines((l) => [...l, line]), 260 * i),
      );
    });
    if (cmd === "Take Control") {
      setControl(true);
      timers.current.push(window.setTimeout(() => setControl(false), 6500));
    }
  };

  return (
    <section id="agent" className="relative min-h-screen overflow-hidden bg-ink">
      <div className="absolute inset-0">
        <AgentDesk lines={lines} control={control} />
      </div>
      <div className="scanlines pointer-events-none absolute inset-0" />
      <div className="vignette pointer-events-none absolute inset-0" />

      <div className="pointer-events-none absolute left-0 right-0 top-24 z-10 px-6 text-center sm:top-28">
        <div className="pointer-events-auto inline-block">
          <div className="mb-2 font-mono text-[11px] tracking-[0.5em] text-emerald-300/80">
            SCENE 02 · SCROLLED PAST THE TV
          </div>
          <h2 className="glow-cyan text-4xl font-bold text-white sm:text-6xl">MY COMPUTER</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-400">
            An agent launches servers on my machine and controls my computer. It works without
            MKEP — it's just a Cloudflare tunnel. Codex doesn't work for us, and Claude Code is
            paid.
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-6 sm:px-8 sm:pb-10">
        <div className="panel mx-auto max-w-3xl rounded-2xl p-4 sm:p-5">
          <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {CHIPS.map((c) => (
              <div
                key={c.k}
                className="rounded-lg border border-slate-600/30 bg-slate-950/50 px-3 py-2"
              >
                <div className="font-mono text-[9px] tracking-[0.25em] text-slate-500">
                  {c.k}
                </div>
                <div className={`font-mono text-[11px] font-bold ${c.c}`}>{c.v}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {TERMINAL_SCRIPT.map((s) => (
              <button
                key={s.cmd}
                onClick={() => run(s.cmd)}
                className="rounded-full border border-emerald-400/25 bg-emerald-400/5 px-4 py-2 font-mono text-[11px] tracking-wider text-emerald-200 transition hover:border-emerald-300/60 hover:bg-emerald-400/15 hover:text-white active:scale-95"
              >
                {s.cmd}
              </button>
            ))}
          </div>
          <div className="mt-3 font-mono text-[10px] tracking-widest text-slate-500">
            {control
              ? "REMOTE CONTROL SESSION ACTIVE — the agent is driving this machine"
              : "AGENT DAEMON LISTENING · CLOUDFLARE EDGE · ZERO COST"}
          </div>
        </div>
      </div>
    </section>
  );
}
