import { useEffect, useState } from "react";
import { NAV_ITEMS } from "../data";

export default function Nav() {
  const [progress, setProgress] = useState(0);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const p = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
      setProgress(p);
      setSolid(h.scrollTop > 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* progress bar */}
      <div className="fixed left-0 right-0 top-0 z-40 h-0.5 bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <header
        className={`fixed left-0 right-0 top-0 z-30 transition-all duration-300 ${
          solid ? "bg-ink/80 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <a href="#room" className="group flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-violet-500 font-mono text-sm font-bold text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.5)]">
              A
            </span>
            <span className="font-mono text-sm font-extrabold tracking-[0.2em] text-white">
              ASIN<span className="text-cyan-300">39</span>K
            </span>
          </a>

          <nav className="flex max-w-[70%] gap-1 overflow-x-auto rounded-full border border-slate-700/40 bg-slate-950/50 px-2 py-1.5 backdrop-blur-md [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {NAV_ITEMS.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className="whitespace-nowrap rounded-full px-3 py-1 font-mono text-[10px] tracking-[0.15em] text-slate-400 transition hover:bg-cyan-400/10 hover:text-cyan-200 sm:text-[11px]"
              >
                {n.label}
              </a>
            ))}
          </nav>
        </div>
      </header>
    </>
  );
}
