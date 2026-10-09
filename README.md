<div align="center">

# 🌌 ASIN39K

### A 3D Universe for AI Dialogue

**Built by a student of AI who was banned from the Arena Discord — and decided to build his own universe instead.**

[Live Demo](https://whghhgfgfg232.github.io/asin39ka-blog-AI/) · [The Ban Story](#-the-story) · [Report Bug](https://github.com/whghhgfgfg232/asin39ka-blog-AI/issues)

</div>

---

## 🎬 Preview

![ASIN39K TV Room](https://whghhgfgfg232.github.io/asin39ka-blog-AI/preview.png)

> *"I was unfairly banned from the Arena Discord server — 
> I mixed up a channel, and my appeal was rejected."*
> — FACT ABOUT ASIN39K, loading screen

---

## ✨ What is this?

**ASIN39K** is a real-time WebGL blog where conversations 
with AI feel like exploring a universe, not typing into a chat box.

Every "scene" is a fully interactive 3D room. The flagship — 
**TV Room** — lets you talk to an AI agent through a virtual 
television while sitting in a cyberpunk apartment under a starlit sky.

The project was born from a personal story. After being 
permanently banned from the Arena Discord for mixing up 
channels, instead of joining another server, I built my own.

---

## 🎮 Scenes

| Scene | What it is |
|-------|-----------|
| 📺 **TV Room** | Sit in a chair. Type into a TV. Talk to an AI agent in real time. |
| 🤖 **The Agent** | A close-up dialogue interface with the AI. |
| 🧠 **The Core** | The central hub of the ASIN39K universe. |
| 🏬 **GD Mall** | A 2.5D shopping district (in development). |
| 🌦️ **Weather System** | Real-time 3D weather rendering. |
| 🎨 **2.5D Center** | An experimental 2.5D space. |
| ⚖️ **The Ban** | A documentary art piece about the Discord ban. |
| 💔 **What I Lost** | 8 things I lost access to after the ban. |

---

## 🛠 Built With

- **[Three.js](https://threejs.org)** — 3D rendering engine
- **[React](https://react.dev)** — UI framework
- **[Vite](https://vitejs.dev)** — Build tool
- **[TypeScript](https://www.typescriptlang.org)** — Type safety
- **[Tailwind CSS](https://tailwindcss.com)** — Styling
- **[WebGL 2.0](https://www.khronos.org/webgl/)** — GPU-accelerated graphics
- **[vite-plugin-singlefile](https://github.com/richardtallent/vite-plugin-singlefile)** — Single HTML output

**No build tools for users. Just open `index.html`.**

---

## 🚀 Quick Start

### Run locally

```bash
# Clone the repository
git clone https://github.com/whghhgfgfg232/asin39ka-blog-AI.git
cd asin39ka-blog-AI

# Install dependencies
npm install

# Start dev server
npm run dev

# Open http://localhost:5173
Build for production
Bash

npm run build
# Output will be in dist/
Deploy to GitHub Pages
This project auto-deploys to GitHub Pages on every push to main.

Live at: https://whghhgfgfg232.github.io/asin39ka-blog-AI/

📖 The Story
This project exists because of a personal story.

I was permanently banned from the Arena Discord server —
a major AI community — for what the moderators called
"consistently misusing the forum and bug-reporting
channels despite multiple explanations."

What that meant in practice: I posted in the wrong
channel a few times. My appeal was rejected.

Instead of giving up on AI communities, I built my own space.
ASIN39K is that space.

You can read the full story in two scenes:

The Ban — the full case file
What I Lost — 8 things I lost
📂 Project Structure
text

asin39k/
│
├── index.html                  # Entry point / landing page
├── README.md                   # This file
├── LICENSE                     # MIT license
├── package.json                # Dependencies
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript config
├── tailwind.config.js          # Tailwind config
│
├── /src/
│   ├── main.tsx                # App entry
│   ├── App.tsx                 # Main component
│   ├── index.css               # Global styles
│   ├── banData.ts              # Ban case data
│   ├── canvasUtils.ts          # Canvas utilities
│   ├── cn.ts                   # Class name utilities
│   ├── data.ts                 # App data
│   │
│   └── /components/
│       ├── AgentDesk.tsx       # Agent interface
│       ├── AgentSection.tsx    # Agent section
│       ├── BanHammer.tsx       # Ban hammer animation
│       ├── BanSection.tsx      # Ban section
│       ├── Blog.tsx            # Blog component
│       ├── CoreSection.tsx     # Core hub
│       ├── Footer.tsx          # Footer
│       ├── GeometryMall.tsx    # 3D mall
│       ├── LaunchOverlay.tsx   # Launch screen
│       ├── LaunchScene.tsx     # 3D launch scene
│       ├── LoadingScreen.tsx   # Loading screen
│       ├── MallSection.tsx     # Mall section
│       ├── Nav.tsx             # Navigation
│       ├── ShoppingCenter.tsx  # Shopping center
│       ├── TVRoom.tsx          # 3D TV room
│       ├── TVRoomSection.tsx   # TV room section
│       └── Weather.tsx         # Weather system
│
└── /public/                    # Static assets
🎨 Design Principles
🌑 Dark by default — sci-fi aesthetic, easy on the eyes
💎 Neon accents — cyan, magenta, violet glow
🎬 Cinematic framing — every scene feels like a film
⚡ Real-time — no loading between scenes
🖋️ Typography matters — Courier monospace, system fonts
🎭 Atmosphere first — visuals serve the feeling
🤖 The AI Agent
The agent in the TV Room is a wrapper around a language model API.

It can:

Answer questions about the project
Discuss the ban story
Have general conversations
Show personality
It cannot:

Access your private data
Remember conversations across sessions
Bypass content policies
💡 Why "ASIN39K"?
ASIN39K is a personal codename. It doesn't stand for anything specific —
it's just a name that felt right for a universe where I am the
permanent resident.

ASIN — looks like a product code, but isn't
39K — the universe, the number, the label

Together: ASIN39K — the only resident of a 3D world built by a banned user.

🗺️ Roadmap
 TV Room (3D scene with AI chat)
 The Ban (documentary page)
 What I Lost (8 things)
 The Core (central hub)
 Weather System (basic)
 GD Mall (in development)
 2.5D Center (in development)
 Mobile version
 VR support
 Multiplayer (maybe)
 More scenes
🤝 Contributing
This is a personal project, but if you have ideas:

Fork the repo
Create your feature branch (git checkout -b feature/amazing)
Commit your changes (git commit -m 'Add amazing feature')
Push to the branch (git push origin feature/amazing)
Open a Pull Request
Or just open an issue.

📊 Status
✅ All systems operational

Check the status page for live updates.

📜 License
This project is licensed under the MIT License.
Use the code, learn from it, build your own universe.

See LICENSE for details.

💬 Community
Project: whghhgfgfg232.github.io/asin39ka-blog-AI
GitHub: github.com/whghhgfgfg232/asin39ka-blog-AI
Issues: Report a bug
⭐ Show Your Support
If this project resonates with you — if you've ever been
banned for a small mistake, or wanted to build your own
space instead of joining someone else's — give it a star.

Building your own universe is always an option.

🙏 Acknowledgments
Three.js community for the amazing 3D library
React team for the UI framework
The Vite team for the blazing-fast build tool
Everyone who has been banned for a small mistake and kept building
<div align="center">
Built with 💙 in a 3D world that exists because of a Discord ban.

⬆ Back to top

</div> ```
