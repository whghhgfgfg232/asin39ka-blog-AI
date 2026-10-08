// Moderation log from the Arena Discord server (Sapphire bot), verbatim + explained.
// Staff nicknames are intentionally omitted — only the role is shown.

export type CaseType = "warn" | "mute" | "unmute" | "ban";

export type ModCase = {
  id: string;
  type: CaseType;
  date: string; // DD.MM.YYYY
  time: string;
  title: string;
  reason: string;
  role: "Moderator" | "Helper" | "System";
  duration?: string;
  topic: TopicKey | "none";
  plain: string;
  lesson: string;
};

export type TopicKey = "language" | "video" | "bugs" | "extensions";

export const TOPICS: Record<TopicKey, { label: string; color: string; icon: string }> = {
  language: { label: "English-only rule", color: "#38bdf8", icon: "🌐" },
  video: { label: "Removed feature (Video Arena)", color: "#a78bfa", icon: "🎬" },
  bugs: { label: "Bug-report & forum process", color: "#f87171", icon: "🐞" },
  extensions: { label: "Self-made extensions", color: "#fbbf24", icon: "🧩" },
};

export const CASES: ModCase[] = [
  {
    id: "eqgWTJW",
    type: "warn",
    date: "21.06.2026",
    time: "20:45",
    title: "You got warned - Case eqgWTJW",
    reason: "Please English only when chatting in the server",
    role: "Moderator",
    topic: "language",
    plain:
      "I posted in a language other than English. The Arena server is English-only, so I got my first strike.",
    lesson: "Write in English only, even for a quick message.",
  },
  {
    id: "cZEyqjd",
    type: "warn",
    date: "30.07.2026",
    time: "20:03",
    title: "You got warned - Case cZEyqjd",
    reason:
      "Note that Video Arena has been removed from the server. You can find Video Arena on our site here: https://arena.ai/video. More information can be found in this announcement #announcements",
    role: "Moderator",
    topic: "video",
    plain:
      "I kept trying to use or ask about Video Arena inside Discord, but it had already been moved out of the server to arena.ai/video. The change was in the announcements, and I missed it.",
    lesson: "Read #announcements. Video Arena lives at arena.ai/video now, not in Discord.",
  },
  {
    id: "k8LCWC5",
    type: "warn",
    date: "04.09.2026",
    time: "22:45",
    title: "You got warned - Case k8LCWC5",
    reason:
      "We've explained already the proper process to report bugs. Please follow these instructions, or you may be removed from the server.",
    role: "Helper",
    topic: "bugs",
    plain:
      "I reported bugs in the wrong place or without the required format. The process had already been explained to me. This was the first warning that said I could be removed.",
    lesson: "Every bug report goes in the right channel, using the exact template.",
  },
  {
    id: "UdDxxPy",
    type: "warn",
    date: "20.09.2026",
    time: "21:33",
    title: "You got warned - Case UdDxxPy",
    reason:
      "Please do not share or discuss extensions for Arena that you've made. We're unable to verify the safety of those exenstions, and do not want to give the impression we're endorsing them by them being dicussed in this server.",
    role: "Moderator",
    topic: "extensions",
    plain:
      "I shared a browser extension I built for Arena. The staff can't check whether extensions like that are safe, and they don't want it to look like the server endorses them.",
    lesson: "Don't post or discuss self-made Arena extensions in the server.",
  },
  {
    id: "MUTE-1H",
    type: "mute",
    date: "20.09.2026",
    time: "23:05",
    title: "You got muted",
    reason:
      "You were previously warned about sharing extensions. Please be aware that continuing to do so may result in a permanent ban from the server.",
    role: "Helper",
    duration: "1 hour",
    topic: "extensions",
    plain:
      "About 1.5 hours after the extension warning, I brought the extension up again. I got muted for an hour, and this was the first time a permanent ban was mentioned.",
    lesson: "A mute is the last stop. The next step is the door.",
  },
  {
    id: "UNMUTE",
    type: "unmute",
    date: "21.09.2026",
    time: "00:05",
    title: "You got unmuted",
    reason: "Expired",
    role: "System",
    topic: "none",
    plain: "The 1-hour mute ran out and I could talk again.",
    lesson: "This was the clean slate. It lasted 11 days.",
  },
  {
    id: "BAN-PERM",
    type: "ban",
    date: "02.10.2026",
    time: "20:54",
    title: "You got banned",
    reason:
      "Consistently misusing the forum and bug-reporting channels despite multiple explanations of how these reporting methods are intended to be used.",
    role: "Helper",
    duration: "Permanent",
    topic: "bugs",
    plain:
      "The final reason was the same problem as warning #3: I kept using the forum and bug-report channels the wrong way after being told several times how they work. With four warnings and a mute already on my record, the result was a permanent ban.",
    lesson: "Permanent. My appeal was rejected.",
  },
];

export const LOSSES: { icon: string; title: string; desc: string }[] = [
  {
    icon: "📢",
    title: "Updates & announcements",
    desc: "No more #announcements: new model drops, changelogs and feature news, like the Video Arena move, as they happen.",
  },
  {
    icon: "🐞",
    title: "Reporting bugs",
    desc: "The bug-report channels are closed to me. If I find a bug on Arena, I can't file it with the team in the server.",
  },
  {
    icon: "💬",
    title: "Commenting on bugs",
    desc: "I can't add details, reproduce steps or confirm \"same here\" on other people's bug threads anymore.",
  },
  {
    icon: "🗂️",
    title: "Forum & feedback",
    desc: "No forum posts, no feature requests and no feedback on models or the leaderboard where the team reads it.",
  },
  {
    icon: "🧑‍🤝‍🧑",
    title: "Community chat",
    desc: "No more talking with other Arena users: comparing models, swapping prompts, showing off results.",
  },
  {
    icon: "🛟",
    title: "Help from staff",
    desc: "No more direct help from moderators and helpers when something on Arena breaks or confuses me.",
  },
  {
    icon: "🚀",
    title: "Showing my projects",
    desc: "My arena.site builds (the Core, the GD Mall, the Weather System) no longer reach the Arena community there.",
  },
  {
    icon: "🏷️",
    title: "Roles, history & rejoining",
    desc: "My message history and place in the server are gone. The ban is permanent, so I can't rejoin with this account.",
  },
];

export const KEPT: { icon: string; title: string; desc: string }[] = [
  {
    icon: "🌐",
    title: "The Arena website",
    desc: "The ban only covers Discord. I can still use Arena AI on the web.",
  },
  {
    icon: "🎬",
    title: "Video Arena",
    desc: "It moved to arena.ai/video. That's what warning #2 was about.",
  },
  {
    icon: "🧱",
    title: "My arena.site projects",
    desc: "The Core, the GD Mall, the Weather System, the blog and the 2.5D center are all still online.",
  },
  {
    icon: "▶️",
    title: "YouTube + this site",
    desc: "I still have my own channels to share what I build.",
  },
];

export const RULES_LEARNED: string[] = [
  "English only. Every message, every channel.",
  "Read #announcements before asking about a missing feature.",
  "Bug reports: correct channel and the exact required format. No exceptions.",
  "The forum isn't a chat room. Follow the post format.",
  "Never share self-made extensions in the server.",
  "A warning is a signal. A mute is the final signal.",
];
