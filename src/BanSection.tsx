import { useMemo, useState } from "react";
import BanHammer from "../scenes/BanHammer";
import {
  CASES,
  KEPT,
  LOSSES,
  RULES_LEARNED,
  TOPICS,
  type CaseType,
  type ModCase,
  type TopicKey,
} from "../banData";

const TYPE_STYLE: Record<CaseType, { color: string; label: string; verb: string }> = {
  warn: { color: "#facc15", label: "WARNING", verb: "warn" },
  mute: { color: "#fb923c", label: "MUTE", verb: "mute" },
  unmute: { color: "#64748b", label: "UNMUTE", verb: "" },
  ban: { color: "#ef4444", label: "BAN", verb: "ban" },
};

/* ------------------------------------------------------------------ */
/*  Discord-style embed                                                */
/* ------------------------------------------------------------------ */

function linkify(text: string) {
  const parts = text.split(/(https:\/\/arena\.ai\/video|#announcements)/g);
  return parts.map((p, i) =>
    p === "https://arena.ai/video" ? (
      <a
        key={i}
        href={p}
        target="_blank"
        rel="noreferrer"
        className="text-sky-400 hover:underline"
      >
        {p}
      </a>
    ) : p === "#announcements" ? (
      <span key={i} className="rounded bg-indigo-500/25 px-1 text-indigo-200">
        # announcements
      </span>
    ) : (
      <span key={i}>{p}</span>
    ),
  );
}

function DiscordEmbed({ c }: { c: ModCase }) {
  const st = TYPE_STYLE[c.type];
  return (
    <div className="flex gap-3 rounded-xl bg-[#313338] p-3 font-sans text-[13px] leading-snug text-[#dbdee1] shadow-xl sm:p-4">
      {/* avatar */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 text-sm font-bold text-white">
        S
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-semibold text-white">Sapphire</span>
          <span className="rounded bg-[#5865f2] px-1 text-[10px] font-semibold text-white">
            ✓ BOT
          </span>
          <span className="text-[11px] text-[#949ba4]">
            {c.date}, {c.time}
          </span>
        </div>
        <div
          className="mt-1.5 rounded border-l-4 bg-[#2b2d31] px-3 py-2.5"
          style={{ borderColor: st.color }}
        >
          <div className="font-semibold text-white">{c.title}</div>
          <div className="mt-2">
            <div className="text-[12px] font-semibold text-white">Reason</div>
            <div className="break-words">{linkify(c.reason)}</div>
          </div>
          {c.duration && (
            <div className="mt-2">
              <div className="text-[12px] font-semibold text-white">Duration</div>
              <div className={c.type === "ban" ? "font-semibold text-red-400" : ""}>
                {c.duration}
              </div>
            </div>
          )}
          <div className="mt-2">
            <div className="text-[12px] font-semibold text-white">Responsible</div>
            <div>
              <span className="rounded bg-indigo-500/25 px-1 text-indigo-200">
                @{c.role === "System" ? "Sapphire" : c.role}
              </span>{" "}
              <span className="text-[#949ba4]">
                {c.role === "System" ? "(bot)" : "(server staff · nickname hidden)"}
              </span>
            </div>
          </div>
          {st.verb && (
            <div className="mt-2 text-[12px] text-[#b5bac1]">
              You may be able to appeal your {st.verb} here:{" "}
              <span className="text-sky-400">Appeal site</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */

export default function BanSection() {
  const [filter, setFilter] = useState<TopicKey | "all">("all");
  const [active, setActive] = useState<string>("BAN-PERM");

  const shown = useMemo(
    () => CASES.filter((c) => filter === "all" || c.topic === filter),
    [filter],
  );

  const topicCounts = useMemo(() => {
    const m: Record<TopicKey, number> = { language: 0, video: 0, bugs: 0, extensions: 0 };
    CASES.forEach((c) => {
      if (c.topic !== "none") m[c.topic]++;
    });
    return m;
  }, []);

  const punitive = CASES.filter((c) => c.type !== "unmute");

  return (
    <section id="ban" className="relative overflow-hidden bg-[#060306]">
      {/* ---------- 3D hero ---------- */}
      <div className="relative h-[82vh] min-h-[560px]">
        <BanHammer />
        <div className="scanlines pointer-events-none absolute inset-0" />
        <div className="vignette pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#060306]" />

        <div className="pointer-events-none absolute inset-x-0 top-24 z-10 px-6 text-center sm:top-28">
          <div className="mb-2 font-mono text-[11px] tracking-[0.5em] text-red-300/80">
            CASE FILE · ARENA DISCORD SERVER
          </div>
          <h2
            className="text-4xl font-extrabold text-white sm:text-6xl"
            style={{ textShadow: "0 0 10px #ef4444aa, 0 0 34px #ef444455" }}
          >
            THE BAN
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-400">
            Four warnings, one mute, one permanent ban, over 103 days. Here's the full log,
            what each case means and what it cost me.
          </p>
        </div>

        {/* stat strip */}
        <div className="absolute inset-x-0 bottom-8 z-10 px-4">
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-2 sm:grid-cols-5">
            {[
              ["4", "WARNINGS", "#facc15"],
              ["1", "MUTE · 60 MIN", "#fb923c"],
              ["103", "DAYS: 1ST WARN → BAN", "#f87171"],
              ["7", "LOG ENTRIES TOTAL", "#a78bfa"],
              ["∞", "BAN DURATION", "#ef4444"],
            ].map(([v, k, c]) => (
              <div
                key={k}
                className="rounded-xl border border-red-500/15 bg-black/50 px-3 py-2.5 text-center backdrop-blur"
              >
                <div className="font-mono text-2xl font-extrabold" style={{ color: c }}>
                  {v}
                </div>
                <div className="font-mono text-[9px] tracking-[0.2em] text-slate-500">{k}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 pb-28">
        {/* ---------- why: the short version ---------- */}
        <div className="reveal panel rounded-3xl border-red-500/20 p-6 sm:p-8">
          <div className="font-mono text-[10px] tracking-[0.4em] text-red-300">
            WHY I WAS BANNED: THE SHORT VERSION
          </div>
          <p className="mt-3 text-lg leading-relaxed text-slate-200 sm:text-xl">
            The official reason: I was{" "}
            <span className="font-semibold text-red-300">
              "consistently misusing the forum and bug-reporting channels despite multiple
              explanations"
            </span>
            . That's the same thing I'd already been warned for on 04.09.2026. It wasn't one
            message, though. It was the whole record: a language warning, a Video Arena warning,
            a bug-report warning, an extensions warning, and a mute for bringing the extension up
            again.
          </p>

          {/* escalation ladder */}
          <div className="mt-6 flex items-center gap-1 overflow-x-auto pb-1">
            {punitive.map((c, i) => {
              const st = TYPE_STYLE[c.type];
              return (
                <div key={c.id} className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setFilter("all");
                      setActive(c.id);
                      document
                        .getElementById(`case-${c.id}`)
                        ?.scrollIntoView({ behavior: "smooth", block: "center" });
                    }}
                    className="whitespace-nowrap rounded-lg border px-3 py-2 text-left font-mono transition hover:brightness-125"
                    style={{
                      borderColor: `${st.color}66`,
                      background: `${st.color}${c.type === "ban" ? "33" : "14"}`,
                    }}
                  >
                    <div className="text-[9px] tracking-[0.2em]" style={{ color: st.color }}>
                      {st.label}
                    </div>
                    <div className="text-[11px] text-slate-300">{c.date.slice(0, 5)}</div>
                  </button>
                  {i < punitive.length - 1 && <span className="text-slate-600">→</span>}
                </div>
              );
            })}
          </div>

          <div className="mt-6 rounded-2xl border border-slate-600/30 bg-slate-950/50 p-5">
            <div className="font-mono text-[10px] tracking-[0.35em] text-cyan-300">MY SIDE</div>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              I didn't set out to break anything. I mixed up channels, didn't follow the required
              formatting, and didn't adjust fast enough after the explanations. The server treats
              the reporting channels strictly, so a pile of small mistakes added up to a permanent
              ban. I appealed, and the appeal was rejected. To me the punishment feels too heavy
              for what happened, but the log below is exactly what the bot sent me, word for word.
            </p>
          </div>
        </div>

        {/* ---------- root causes ---------- */}
        <div className="reveal mt-14">
          <h3 className="mb-4 text-center font-mono text-xs tracking-[0.4em] text-slate-400">
            WHAT THE CASES WERE ABOUT
          </h3>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {(Object.keys(TOPICS) as TopicKey[]).map((k) => {
              const t = TOPICS[k];
              const on = filter === k;
              return (
                <button
                  key={k}
                  onClick={() => setFilter(on ? "all" : k)}
                  className="panel rounded-2xl p-4 text-left transition hover:-translate-y-0.5"
                  style={{
                    borderColor: on ? t.color : undefined,
                    boxShadow: on ? `0 0 30px ${t.color}44` : undefined,
                  }}
                >
                  <div className="text-2xl">{t.icon}</div>
                  <div className="mt-2 text-sm font-semibold text-slate-100">{t.label}</div>
                  <div className="mt-1 font-mono text-[11px]" style={{ color: t.color }}>
                    {topicCounts[k]} case{topicCounts[k] > 1 ? "s" : ""}
                    {k === "bugs" && " · incl. the ban"}
                    {k === "extensions" && " · incl. the mute"}
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${(topicCounts[k] / 2) * 100}%`, background: t.color }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
          <div className="mt-3 text-center font-mono text-[10px] tracking-widest text-slate-600">
            {filter === "all"
              ? "CLICK A CATEGORY TO FILTER THE LOG"
              : `FILTER: ${TOPICS[filter].label.toUpperCase()} · CLICK AGAIN TO CLEAR`}
          </div>
        </div>

        {/* ---------- full timeline ---------- */}
        <div className="mt-12">
          <h3 className="mb-6 text-center font-mono text-xs tracking-[0.4em] text-slate-400">
            THE FULL MODERATION LOG, EXPLAINED
          </h3>
          <div className="relative">
            <div className="absolute bottom-0 left-4 top-0 w-px bg-gradient-to-b from-yellow-400/40 via-orange-400/40 to-red-500/70 md:left-1/2" />
            <div className="space-y-8">
              {shown.map((c, i) => {
                const st = TYPE_STYLE[c.type];
                const topic = c.topic !== "none" ? TOPICS[c.topic] : null;
                const isActive = active === c.id;
                const num = CASES.indexOf(c) + 1;
                return (
                  <div
                    key={c.id}
                    id={`case-${c.id}`}
                    className="relative grid gap-4 pl-10 md:grid-cols-2 md:gap-10 md:pl-0"
                    onMouseEnter={() => setActive(c.id)}
                  >
                    {/* node */}
                    <div
                      className="absolute left-4 top-6 z-10 flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full border-2 md:left-1/2"
                      style={{
                        borderColor: st.color,
                        background: isActive ? st.color : "#060306",
                        boxShadow: isActive ? `0 0 20px ${st.color}` : "none",
                      }}
                    >
                      {c.type === "ban" && (
                        <span className="pulse-ring absolute inset-0 rounded-full" style={{ background: st.color }} />
                      )}
                    </div>

                    {/* discord embed */}
                    <div className={i % 2 ? "md:order-2" : ""}>
                      <div className="mb-2 flex items-center gap-2 font-mono text-[10px] tracking-[0.25em]">
                        <span style={{ color: st.color }}>
                          #{num} · {st.label}
                        </span>
                        {c.type !== "unmute" && c.type !== "mute" && c.type !== "ban" && (
                          <span className="text-slate-600">CASE {c.id}</span>
                        )}
                      </div>
                      <DiscordEmbed c={c} />
                    </div>

                    {/* explanation */}
                    <div className={i % 2 ? "md:order-1" : ""}>
                      <div
                        className="panel h-full rounded-2xl p-5 transition"
                        style={{
                          borderColor: isActive ? `${st.color}88` : undefined,
                        }}
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          {topic && (
                            <span
                              className="rounded-full px-2.5 py-1 font-mono text-[10px]"
                              style={{ color: topic.color, background: `${topic.color}18` }}
                            >
                              {topic.icon} {topic.label}
                            </span>
                          )}
                          <span className="font-mono text-[10px] text-slate-500">
                            {c.date} · {c.time}
                          </span>
                        </div>
                        <div className="mt-3 font-mono text-[10px] tracking-[0.3em] text-slate-500">
                          WHAT HAPPENED
                        </div>
                        <p className="mt-1 text-sm leading-relaxed text-slate-200">{c.plain}</p>
                        <div className="mt-4 rounded-lg border border-slate-700/50 bg-slate-950/50 px-3 py-2">
                          <span className="font-mono text-[10px] tracking-[0.25em] text-emerald-300">
                            TAKEAWAY ·{" "}
                          </span>
                          <span className="text-sm text-slate-300">{c.lesson}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ---------- what I lost ---------- */}
        <div className="reveal mt-20">
          <div className="text-center">
            <div className="font-mono text-[10px] tracking-[0.4em] text-red-300">
              ACCESS REVOKED
            </div>
            <h3 className="mt-2 text-3xl font-bold text-white sm:text-4xl">What I lost</h3>
            <p className="mx-auto mt-2 max-w-xl text-sm text-slate-400">
              A permanent ban closes every channel in the server to me, not just the bug-report
              ones.
            </p>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {LOSSES.map((l) => (
              <div
                key={l.title}
                className="group relative overflow-hidden rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-950/40 to-slate-950/80 p-5 transition hover:border-red-400/50"
              >
                <div className="absolute right-3 top-3 rounded-full border border-red-500/40 bg-red-500/10 px-2 py-0.5 font-mono text-[8px] tracking-[0.2em] text-red-300">
                  REVOKED
                </div>
                <div className="text-3xl grayscale transition group-hover:grayscale-0">{l.icon}</div>
                <div className="mt-3 font-semibold text-slate-100 line-through decoration-red-500/70 decoration-2">
                  {l.title}
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{l.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ---------- what I still have + appeal ---------- */}
        <div className="reveal mt-14 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          <div className="panel rounded-3xl p-6">
            <div className="font-mono text-[10px] tracking-[0.4em] text-emerald-300">
              STILL WORKING
            </div>
            <h3 className="mt-1 text-xl font-bold text-white">What the ban didn't take</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {KEPT.map((k) => (
                <div
                  key={k.title}
                  className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{k.icon}</span>
                    <span className="text-sm font-semibold text-emerald-100">{k.title}</span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{k.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="panel rounded-3xl p-6">
            <div className="font-mono text-[10px] tracking-[0.4em] text-violet-300">APPEAL</div>
            <h3 className="mt-1 text-xl font-bold text-white">Appeal status</h3>
            <ol className="mt-5 space-y-4">
              {[
                ["Banned", "02.10.2026 · 20:54", "#ef4444", true],
                ["Appeal submitted", "via the Appeal site", "#a78bfa", true],
                ["Reviewed", "by server staff", "#a78bfa", true],
                ["Rejected", "the ban stays permanent", "#ef4444", true],
              ].map(([t, s, c], i) => (
                <li key={t as string} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[10px] font-bold text-slate-950"
                    style={{ background: c as string }}
                  >
                    {i === 3 ? "✕" : i + 1}
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-slate-100">{t}</div>
                    <div className="font-mono text-[11px] text-slate-500">{s}</div>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-center font-mono text-xs tracking-[0.2em] text-red-300">
              FINAL STATUS: PERMANENTLY BANNED
            </div>
          </div>
        </div>

        {/* ---------- rules learned ---------- */}
        <div className="reveal panel neon-border mt-14 rounded-3xl p-6 sm:p-8">
          <div className="font-mono text-[10px] tracking-[0.4em] text-cyan-300">
            IF YOU'RE IN THE ARENA SERVER
          </div>
          <h3 className="mt-1 text-xl font-bold text-white sm:text-2xl">
            Don't repeat my record. Read this first.
          </h3>
          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {RULES_LEARNED.map((r, i) => (
              <li
                key={r}
                className="flex items-start gap-3 rounded-xl border border-slate-700/40 bg-slate-950/40 px-4 py-3"
              >
                <span className="font-mono text-xs font-bold text-cyan-300">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm text-slate-300">{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
