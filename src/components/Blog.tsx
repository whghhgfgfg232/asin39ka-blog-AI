import { POSTS, PROJECTS } from "@/data";
import type { LaunchFn } from "@/App";

export default function Blog({ launch }: { launch: LaunchFn }) {
  return (
    <section id="blog" className="relative min-h-screen overflow-hidden bg-ink px-4 py-28">
      <div className="grid-bg absolute inset-0 opacity-40" />
      <div className="absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-violet-600/15 blur-[120px]" />
      <div className="absolute -right-40 bottom-1/4 h-96 w-96 rounded-full bg-cyan-500/15 blur-[120px]" />

      <div className="reveal relative mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <div className="mb-2 font-mono text-[11px] tracking-[0.5em] text-violet-300/80">
            SCENE 06 · PERSONAL BLOG
          </div>
          <h2 className="glow-violet text-4xl font-bold text-white sm:text-6xl">
            HI, I'M STUDYING AI
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-400">
            Hi, I'm Asin39K. I'm studying artificial intelligence — since June 2025. This blog is
            where I keep devlogs about 3D scenes, tunnels, bans and cores.
          </p>
        </div>

        {/* posts */}
        <div className="grid gap-4 md:grid-cols-2">
          {POSTS.map((p) => (
            <article
              key={p.title}
              className="panel group rounded-2xl p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/40"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full border border-violet-400/30 bg-violet-400/10 px-3 py-1 font-mono text-[10px] tracking-[0.2em] text-violet-200">
                  {p.tag}
                </span>
                <span className="font-mono text-[10px] text-slate-500">{p.date}</span>
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-100 group-hover:text-cyan-200">
                {p.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{p.excerpt}</p>
              <div className="mt-4 font-mono text-[11px] tracking-widest text-cyan-400/70 transition group-hover:text-cyan-300">
                READ →
              </div>
            </article>
          ))}
        </div>

        {/* projects */}
        <div className="mt-14">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-cyan-400/40" />
            <h3 className="font-mono text-xs tracking-[0.4em] text-cyan-300">LIVE PROJECTS</h3>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-cyan-400/40" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PROJECTS.map((p) => (
              <button
                key={p.url}
                onClick={() => launch(p.key)}
                className="panel group flex flex-col rounded-2xl p-5 text-left transition duration-300 hover:-translate-y-1 hover:border-cyan-400/50"
              >
                <div className="flex items-center justify-between">
                  <span
                    className="rounded-full border px-2.5 py-1 font-mono text-[9px] tracking-[0.2em]"
                    style={{
                      color: p.accent,
                      borderColor: `${p.accent}55`,
                      background: `${p.accent}12`,
                    }}
                  >
                    {p.tag}
                  </span>
                  <span className="font-mono text-[9px] tracking-[0.2em] text-slate-500 transition group-hover:text-cyan-300">
                    ▶ LAUNCH
                  </span>
                </div>
                <h4 className="mt-3 font-bold text-slate-100 group-hover:text-white">{p.title}</h4>
                <p className="mt-1.5 flex-1 text-xs leading-relaxed text-slate-400">{p.blurb}</p>
                <div className="mt-3 truncate font-mono text-[9px] text-slate-600">
                  {p.url.replace("https://", "")}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
