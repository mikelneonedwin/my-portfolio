interface Project {
  title: string;
  id: string;
  description: string;
  tools: string[];
  year: number;
  media: {
    type: "image" | "video" | "link";
    url: string;
  };
  liveUrl?: string;
  githubUrl?: string;
  company?: string;
  slug: string;
  featured?: boolean;
  images?: string[];
}

interface Admin {
  name: string;
  email: string;
  phone: string;
  title?: string;
  images: string[];
  avatar: string;
  allowedEmails: string[];
  job: string;
  bio: string;
  skills: Array<{
    name: string;
    icon: string;
  }>;
  socials: Partial<Record<SocialPlatforms, string>>;
}

type SocialPlatforms =
  | "WhatsApp"
  | "GitHub"
  | "Facebook"
  | "TikTok"
  | "Website"
  | "YouTube"
  | "LinkedIn"
  | "Tumblr"
  | "X"
  | "Instagram"
  | "snapchat"
  | "Telegram"
  | "Pinterest"
  | "Reddit"
  | "Twitter"
  | "Discord"
  | "Slack"
  | "Twitch"
  | "Spotify"
  | "SoundCloud"
  | "Medium"
  | "Dev To"
  | "Stack Overflow"
  | "Dribbble"
  | "Audiomack"
  | "Email"
  | "Snapchat"
  | "Phone";
