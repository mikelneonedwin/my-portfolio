export const HAS_SESSION_COOKIE = "has-session";
export const SESSION_COOKIE = "session";
export const TESTING = Boolean(process.env.TESTING);
export const PLATFORMS = [
  "Audiomack",
  "Daily.dev",
  "Dev To",
  "Discord",
  "Dribbble",
  "Facebook",
  "GitHub",
  "Instagram",
  "LinkedIn",
  "Medium",
  "Pinterest",
  "Reddit",
  "Slack",
  "Telegram",
  "Snapchat",
  "SoundCloud",
  "Spotify",
  "Stack Overflow",
  "TikTok",
  "Tumblr",
  "Twitch",
  "Twitter",
  "WhatsApp",
  "Website",
  "X",
  "YouTube",
] as const;
export const SITE =
  // VERCEL
  process.env.VERCEL_PROJECT_PRODUCTION_URL ||
  // RENDER
  process.env.RENDER_EXTERNAL_URL ||
  process.env.RENDER_EXTERNAL_HOSTNAME ||
  // NETLIFY
  process.env.URL ||
  // RAILWAY
  process.env.RAILWAY_PUBLIC_DOMAIN ||
  // CLOUDFLARE
  process.env.CF_PAGES_URL;
