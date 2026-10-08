import { useCallback, useEffect, useRef, useState } from "react";
import LaunchScene from "../scenes/LaunchScene";
import { LAUNCH_BOOT, LAUNCH_FACTS, type Project } from "../data";

const DURATION = 6000;

export default function LaunchOverlay({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const prog = useRef(0);
  const [pct, setPct] = useState(0);
  const [factIndex, setFactIndex] = useState(0);
  const [done, setDone] = useState(false);
  const openedRef = useRef(false);
  const facts = LAUNCH_FACTS[project.key];
  const boot = LAUNCH_BOOT[project.key];

  const openSite = useCallback(() => {
    const w = window.open(project.url, "_blank", "noopener,noreferrer");
    if (!w) {
      const a = document.createElement("a");
      a.href = project.url;
      a.target = "_blank";
      a.rel = "noreferrer";
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
    openedRef.current = true;
  }, [project.url]);

  const finish = useCallback(() => {
    prog.current = 1;
    setPct(100);
    setDone(true);
    openSite();
  }, [openSite]);

  // drive progress
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / DURATION);
      prog.current = p;
      setPct(Math.round(p * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else if (!openedRef.current) finish();
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [finish]);

  // rotate facts
  useEffect(() => {
    if (done) return;
    const id = setInterval(
      () => setFactIndex((i) => (i + 1) % facts.length),
      DURATION / facts.length,
    );
    return () => clearInterval(id);
  }, [done, facts.length]);

  // lock scroll + escape to cancel
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, finish]);

  const fact = facts[factIndex];

  return (
    <div className="fixed inset-0 z-[60] flex flex-col overflow-hidden bg-ink">
      {/* 3D animation */}
      <div className="pointer-events-none absolute inset-0">
        <LaunchScene variant={project.key} prog={prog} />
      </div>
      <div className="scanlines pointer-events-none absolute inset-0" />
      <div className="vignette pointer-events-none absolute inset-0" />
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background: `radial-gradient(ellipse at 50% 55%, transparent 30%, #04050a 88%)`,
        }}
      />

      {/* top bar */}
      <div className="relative z-10 flex items-start justify-between gap-4 p-5 sm:p-7">
        <div>
          <div
            className="font-mono text-[10px] tracking-[0.45em]"
            style={{ color: project.accent }}
          >
            {done ? "LAUNCH COMPLETE" : "LAUNCH SEQUENCE INITIATED"}
          </div>
          <h2 className="mt-1 text-2xl font-bold text-white sm:text-4xl">{project.title}</h2>
          <div className="mt-1 font-mono text-[10px] tracking-widest text-slate-500">
            {project.tag} · {project.url.replace("https://", "")}
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-full border border-slate-600/50 px-4 py-2 font-mono text-[10px] tracking-[0.25em] text-slate-400 transition hover:border-rose-400/60 hover:text-rose-200"
        >
          ✕ CANCEL
        </button>
      </div>

      {/* centre: rotating fact */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-5">
        <div className="panel neon-border w-full max-w-xl rounded-2xl p-6 text-center">
          <div
            className="font-mono text-[10px] tracking-[0.4em]"
            style={{ color: project.accent }}
          >
            ● FACT ABOUT THIS PROJECT
          </div>
          <p
            key={factIndex}
            className="mt-3 min-h-20 text-lg leading-relaxed text-slate-100 sm:text-xl"
          >
            “{fact}”
          </p>
          <div className="mt-4 flex justify-center gap-1.5">
            {facts.map((_, i) => (
              <span
                key={i}
                className="h-1 w-6 rounded-full transition-colors"
                style={{
                  background: i === factIndex ? project.accent : "#1e293b",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* bottom: progress + controls */}
      <div className="relative z-10 p-5 sm:p-7">
        <div className="mx-auto max-w-2xl">
          {/* progress */}
          <div className="mb-2 flex items-end justify-between font-mono text-[10px] tracking-[0.3em] text-slate-400">
            <span>{done ? "PORTAL OPEN" : "OPENING PORTAL"}</span>
            <span className="tabular-nums" style={{ color: project.accent }}>
              {pct}%
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full border border-slate-600/40 bg-slate-950/80">
            <div
              className="h-full rounded-full transition-[width] duration-100"
              style={{
                width: `${pct}%`,
                background: `linear-gradient(90deg, #22d3ee, ${project.accent})`,
                boxShadow: `0 0 18px ${project.accent}`,
              }}
            />
          </div>

          {/* boot log */}
          <div className="mt-4 min-h-24 font-mono text-[11px] leading-relaxed text-emerald-300/80">
            {boot.slice(0, Math.max(1, Math.ceil((pct / 100) * boot.length))).map((l, i) => (
              <div key={i}>{l}</div>
            ))}
          </div>

          {/* actions */}
          <div className="mt-4 flex flex-wrap gap-2">
            {done ? (
              <>
                <button
                  onClick={openSite}
                  className="neon-border flex-1 rounded-xl px-6 py-3.5 font-mono text-sm font-bold tracking-[0.25em] text-white transition hover:brightness-125 active:scale-95"
                  style={{ background: `${project.accent}22` }}
                >
                  OPEN {project.title.toUpperCase()} ↗
                </button>
                <button
                  onClick={onClose}
                  className="rounded-xl border border-slate-600/50 px-6 py-3.5 font-mono text-xs tracking-[0.25em] text-slate-400 transition hover:border-cyan-400/60 hover:text-cyan-200"
                >
                  STAY HERE
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={finish}
                  className="flex-1 rounded-xl px-6 py-3.5 font-mono text-xs font-bold tracking-[0.25em] text-slate-950 transition hover:brightness-110 active:scale-95"
                  style={{ background: project.accent }}
                >
                  SKIP &amp; OPEN NOW ↗
                </button>
                <button
                  onClick={onClose}
                  className="rounded-xl border border-slate-600/50 px-6 py-3.5 font-mono text-xs tracking-[0.25em] text-slate-400 transition hover:border-rose-400/60 hover:text-rose-200"
                >
                  CANCEL
                </button>
              </>
            )}
          </div>
          <div className="mt-3 text-center font-mono text-[9px] tracking-[0.3em] text-slate-600">
            {done
              ? "IF THE TAB DID NOT OPEN, TAP THE BUTTON ABOVE"
              : "ESC TO CANCEL · ENTER TO SKIP"}
          </div>
        </div>
      </div>
    </div>
  );
}
