import { useState } from "react";
import TVRoom, { type ChatMsg } from "../scenes/TVRoom";
import { AI_REPLIES, DEFAULT_REPLIES } from "../data";

const QUICK = [
  "Who are you?",
  "Tell me about the ban",
  "How does the agent work?",
  "What is the Core?",
  "Daily rewards?",
];

export default function TVRoomSection() {
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: "ai",
      text: "TV-LINK online. I'm the intelligence living in this screen — Asin39K actually talks to me through this TV. Ask me about the Core, the mall, the weather, the agent, or the ban.",
    },
  ]);
  const [thinking, setThinking] = useState(false);
  const [draft, setDraft] = useState("");

  const send = (text: string) => {
    const t = text.trim();
    if (!t || thinking) return;
    setMessages((m) => [...m, { role: "user", text: t }]);
    setDraft("");
    setThinking(true);
    window.setTimeout(
      () => {
        const hit = AI_REPLIES.find((r) => r.match.test(t));
        const reply = hit
          ? hit.reply
          : DEFAULT_REPLIES[Math.floor(Math.random() * DEFAULT_REPLIES.length)];
        setMessages((m) => [...m, { role: "ai", text: reply }]);
        setThinking(false);
      },
      900 + Math.random() * 800,
    );
  };

  return (
    <section id="room" className="relative min-h-screen overflow-hidden bg-ink">
      {/* 3D scene */}
      <div className="absolute inset-0">
        <TVRoom messages={messages} thinking={thinking} />
      </div>
      <div className="scanlines pointer-events-none absolute inset-0" />
      <div className="vignette pointer-events-none absolute inset-0" />

      {/* heading */}
      <div className="pointer-events-none absolute left-0 right-0 top-24 z-10 px-6 text-center sm:top-28">
        <div className="pointer-events-auto inline-block">
          <div className="mb-2 font-mono text-[11px] tracking-[0.5em] text-cyan-300/80">
            SCENE 01 · REAL-TIME WEBGL
          </div>
          <h2 className="glow-cyan text-4xl font-bold text-white sm:text-6xl">THE TV ROOM</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-slate-400">
            A room where a person interacts with an AI via a TV. Type below — your message
            appears on the screen in 3D.
          </p>
        </div>
      </div>

      {/* chat console */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-6 sm:px-8 sm:pb-10">
        <div className="panel mx-auto max-w-3xl rounded-2xl p-4 sm:p-5">
          <div className="mb-3 flex flex-wrap gap-2">
            {QUICK.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                className="rounded-full border border-cyan-400/25 bg-cyan-400/5 px-3 py-1.5 font-mono text-[11px] text-cyan-200 transition hover:border-cyan-300/60 hover:bg-cyan-400/15 hover:text-white"
              >
                {q}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(draft);
            }}
            className="flex gap-2"
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="type on the tv …"
              className="flex-1 rounded-xl border border-slate-600/40 bg-slate-950/70 px-4 py-3 font-mono text-sm text-cyan-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400/70 focus:shadow-[0_0_24px_rgba(34,211,238,0.25)]"
            />
            <button
              type="submit"
              disabled={thinking}
              className="rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-6 py-3 font-mono text-sm font-bold tracking-widest text-white transition hover:brightness-115 active:scale-95 disabled:opacity-40"
            >
              SEND
            </button>
          </form>
          <div className="mt-2 font-mono text-[10px] tracking-widest text-slate-500">
            {thinking ? "AI IS TYPING ON THE SCREEN …" : "TV-LINK CONNECTED · ROOM_01 · ASIN39K"}
          </div>
        </div>
      </div>
    </section>
  );
}
