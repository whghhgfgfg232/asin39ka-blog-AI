// ---------- Loading screen facts (about Asin39K) ----------
export const FACTS: string[] = [
  "I was unfairly banned from the Arena Discord server — I mixed up a channel, and my appeal was rejected.",
  "I started using artificial intelligence in June 2025.",
  "I have a YouTube channel.",
  "The AI services I've used the longest are ChatGPT and Arena AI.",
  "I actually interact with the AI on my TV — it's a whole 3D room.",
  "My agent launches servers on my machine. No MKEP — just a Cloudflare tunnel.",
  "Codex doesn't work for us, and Claude Code is paid. So we tunnel instead.",
  "I built the Core: a 3D game about controlling a reactor from 800 to 1600 degrees.",
];

// ---------- Navigation ----------
export const NAV_ITEMS: { id: string; label: string }[] = [
  { id: "room", label: "TV Room" },
  { id: "agent", label: "The Agent" },
  { id: "core", label: "The Core" },
  { id: "mall", label: "GD Mall" },
  { id: "weather", label: "Weather" },
  { id: "ban", label: "The Ban" },
  { id: "blog", label: "Blog" },
  { id: "center", label: "2.5D Center" },
];

// ---------- AI chat replies for the TV scene ----------
export const AI_REPLIES: { match: RegExp; reply: string }[] = [
  {
    match: /who are you|your name|asin/i,
    reply:
      "I'm Asin39K — student of artificial intelligence, builder of 3D scenes, and permanent resident of the TV room. Banned from Arena Discord, never banned from building.",
  },
  {
    match: /arena|ban|discord/i,
    reply:
      "Permanently banned from the Arena Discord on 02.10.2026. The record: 4 warnings (English-only, Video Arena, bug reports, extensions), a 1-hour mute, then the ban for misusing the forum and bug-report channels. Appeal rejected. Full case file in 'The Ban' section.",
  },
  {
    match: /server|tunnel|agent|cloudflare|mkep/i,
    reply:
      "My agent launches servers directly on my machine and controls my computer. No MKEP — it's just a Cloudflare tunnel. Codex doesn't work for us and Claude Code is paid, so the tunnel is the way.",
  },
  {
    match: /core|reactor|temperature|degree/i,
    reply:
      "The Core runs from 800 to 1600 degrees. Keep it inside the target band or the containment field fails. It's a wonderful little 3D game.",
  },
  {
    match: /mall|geometry|dash|coin|shop/i,
    reply:
      "The Geometry Dash Mall has two floors, shops, restaurants, GG, an automated bot and a lot of coins. Collect them all.",
  },
  {
    match: /weather|reward|coin|lightning/i,
    reply:
      "Today's forecast: thunderstorm. Daily reward: 150 coins and a lightning bolt. Claim it before the storm passes.",
  },
  {
    match: /when.*ai|started|june|2025/i,
    reply:
      "I started using artificial intelligence in June 2025. My longest-serving AI tools: ChatGPT and Arena AI.",
  },
  {
    match: /youtube|channel|video/i,
    reply:
      "I run a YouTube channel — 3D scenes, AI experiments and the occasional rant about Discord channel formatting.",
  },
];

export const DEFAULT_REPLIES: string[] = [
  "Signal received through the TV-LINK. I am the room's resident intelligence — Asin39K wired me into this screen.",
  "Interesting. My training data says Asin39K has been building 3D worlds since June 2025.",
  "I live in this TV. The agent tunnels into the machine, and I render the answers. No MKEP required.",
  "Try asking me about the Core, the mall, the weather system, the agent, or the ban.",
];

// ---------- Agent terminal script ----------
export const TERMINAL_SCRIPT: { cmd: string; lines: string[] }[] = [
  {
    cmd: "Launch Server",
    lines: [
      "$ agent --launch dev-server",
      "[agent] spawning process … ok",
      "[server] vite ready on http://localhost:5173",
      "[server] scene bundle compiled in 812ms",
    ],
  },
  {
    cmd: "Open Tunnel",
    lines: [
      "$ cloudflared tunnel --url http://localhost:5173",
      "[tunnel] registering connection …",
      "[tunnel] https://asin39k-room.trycloudflare.com",
      "[tunnel] no MKEP required — pure cloudflare edge",
    ],
  },
  {
    cmd: "Take Control",
    lines: [
      "$ agent --control host",
      "[agent] acquiring shell … granted",
      "[agent] mouse + keyboard bridge online",
      "[agent] this machine is now remotely driven",
    ],
  },
  {
    cmd: "Why not Codex?",
    lines: [
      "[note] codex cli … unavailable for us",
      "[note] claude code … paid subscription",
      "[fallback] cloudflare tunnel selected",
      "[fallback] cost: 0 coins. status: permanent.",
    ],
  },
];

// ---------- Projects (real links) ----------
export type LaunchKey = "core" | "mall" | "weather" | "blog" | "center";
export type Project = {
  key: LaunchKey;
  title: string;
  blurb: string;
  url: string;
  tag: string;
  accent: string;
};

export const PROJECTS: Project[] = [
  {
    key: "core",
    title: "The Core",
    blurb: "Control the core. Temperature 800–1600°. A wonderful 3D game.",
    url: "https://01a11646-a74b-7cd2-bd28-25bf34df0c3d.arena.site",
    tag: "3D GAME",
    accent: "#ffc400",
  },
  {
    key: "mall",
    title: "Geometry Dash Mall",
    blurb: "Two-story mall with GG, an automated bot, shops, restaurants and coins.",
    url: "https://01a110db-0606-78c7-aa1b-5a31a5b3ee0c.arena.site",
    tag: "3D WORLD",
    accent: "#f43f5e",
  },
  {
    key: "weather",
    title: "Weather System",
    blurb: "Fictional weather with daily rewards. Today: 150 coins + lightning bolt.",
    url: "https://01a106e7-03cd-79d3-aa90-3197ff8530b9.arena.site",
    tag: "SIM",
    accent: "#38bdf8",
  },
  {
    key: "blog",
    title: "Asin39K Blog",
    blurb: "Hi, I'm studying artificial intelligence. Notes, devlogs and 3D experiments.",
    url: "https://019f14fd-0334-75be-bd4a-04a895736924.arena.site",
    tag: "BLOG",
    accent: "#a78bfa",
  },
  {
    key: "center",
    title: "2.5D Shopping Center",
    blurb: "Another shopping center — this time in 2.5D. It turned out pretty well.",
    url: "https://01a101a5-2c67-7c33-88ff-eb7dfb9a7cdb.arena.site",
    tag: "2.5D",
    accent: "#f472b6",
  },
];

export const PROJECT_BY_KEY: Record<string, Project> = PROJECTS.reduce(
  (acc, p) => {
    acc[p.key] = p;
    return acc;
  },
  {} as Record<string, Project>,
);

/* ---------- Launch-sequence facts, per project ---------- */

export const LAUNCH_FACTS: Record<LaunchKey, string[]> = {
  core: [
    "The Core is a control game — temperature ranges from 800 to 1600 degrees.",
    "Above 1380° the reactor runs away twice as fast. That's not a bug.",
    "The colour ramp travels orange → amber → white → cyan as the core heats up.",
    "Hold the green band for 7 seconds and a brand-new target rolls in.",
    "Containment at 0% means a full reset — but your best score survives forever.",
  ],
  mall: [
    "Two floors, four shops, restaurants and a rooftop sign you can read from behind.",
    "GG waits at the entrance. The automated bot patrols the plaza on an endless loop.",
    "There are 8 coins hidden around the mall. Click them. Collect them all.",
    "The escalator stripes scroll forever. Nobody has explained why.",
    "It's Geometry Dash — but the levels are retail.",
  ],
  weather: [
    "Today's forecast: thunderstorm. Reward: 150 coins and a lightning bolt.",
    "Rewards cycle every 24 in-game hours — and you can fast-forward time.",
    "Every weather type ships its own bonus item skin, from frost cloaks to flare auras.",
    "The lightning in this scene strikes on a 7-second loop.",
    "The weather system is fictional. The coins are not. (They are.)",
  ],
  blog: [
    "Hi, I'm studying artificial intelligence — since June 2025.",
    "My longest-used AI services are ChatGPT and Arena AI.",
    "I also run a YouTube channel: 3D scenes, AI experiments, occasional rants.",
    "My agent launches servers on my machine — no MKEP, just a Cloudflare tunnel.",
    "Codex doesn't work for us and Claude Code is paid. So we tunnel.",
  ],
  center: [
    "A 2.5D shopping center built entirely from layered planes.",
    "It turned out pretty well for me.",
    "The original used pure CSS perspective — here it gets real depth.",
    "The shoppers walk on an infinite loop and never enter a single shop.",
    "No WebGL required. Until now.",
  ],
};

export const LAUNCH_BOOT: Record<LaunchKey, string[]> = {
  core: [
    "> mounting reactor …",
    "> thermal ramp 800–1600°C …",
    "> containment field … stable",
    "> handing over control",
  ],
  mall: [
    "> loading mall.geo …",
    "> spawning shops + restaurants …",
    "> coin ledger: 8 entries",
    "> unlocking front doors",
  ],
  weather: [
    "> seeding fictional clouds …",
    "> charging lightning bolt …",
    "> minting 150 coins …",
    "> opening the forecast",
  ],
  blog: [
    "> fetching posts …",
    "> reading ai-notes.md …",
    "> in training since june 2025 …",
    "> opening the blog",
  ],
  center: [
    "> stacking 2.5D layers …",
    "> aligning parallax …",
    "> starting escalators …",
    "> opening the doors",
  ],
};

// ---------- Blog posts ----------
export const POSTS: { title: string; date: string; excerpt: string; tag: string }[] = [
  {
    title: "Hi, I'm studying artificial intelligence",
    date: "2025-06",
    excerpt:
      "It started in June 2025. First ChatGPT, then Arena AI — and somewhere in between, 3D scenes became my favorite way to learn.",
    tag: "INTRO",
  },
  {
    title: "Why my agent runs on a Cloudflare tunnel",
    date: "2025-09",
    excerpt:
      "Codex doesn't work for us. Claude Code is paid. So the agent launches servers on my machine through a plain Cloudflare tunnel — no MKEP.",
    tag: "DEVOPS",
  },
  {
    title: "Banned from the Arena Discord",
    date: "2026-10",
    excerpt:
      "4 warnings, 1 mute, then a permanent ban on 02.10.2026 for misusing the forum and bug-report channels. My appeal was rejected. The full case file is above.",
    tag: "STORY",
  },
  {
    title: "Building a room where I talk to the AI on a TV",
    date: "2025-10",
    excerpt:
      "I actually interact with the AI on the TV. This post breaks down the scene: the room, the glow, the chat texture and the flicker.",
    tag: "3D",
  },
];
