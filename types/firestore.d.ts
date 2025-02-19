interface ProjectCollection {
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

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface NewProject extends ProjectCollection {}
  interface Project extends ProjectCollection {
    id: string;
  }
}

export {};
