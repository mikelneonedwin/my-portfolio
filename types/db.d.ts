import type {
  Generated,
  Insertable,
  JSONColumnType,
  Selectable,
  Updateable,
} from "kysely";

interface SkillsTable {
  id: Generated<number>;
  name: string;
  icon_url: string | null;
}

export type NewSkill = Insertable<SkillsTable>;
export type Skill = Selectable<SkillsTable>;
export type UpdateSkill = Updateable<SkillsTable>;

export type OnlinePlatform =
  | typeof import("@/constants")["PLATFORMS"][number]
  | (string & {});

interface SocialsTable {
  id: Generated<number>;
  name: OnlinePlatform;
  url: string;
}

export type Social = Selectable<SocialsTable>;
export type NewSocial = Insertable<SocialsTable>;
export type UpdateSocial = Updateable<SocialsTable>;

interface ProjectsTable {
  id: Generated<string>;
  title: string;
  description: string;
  tools: JSONColumnType<string[]>;
  year: number;
  media: {
    type: "image" | "video" | "external";
    url: string;
  } | null;
  live_url: string | null;
  github_url: string | null;
  company: string | null;
  slug: string;
  featured: boolean;
}

export type Project = Selectable<ProjectsTable>;
export type FullProject = Project & {
  images: Array<Selectable<ImagesTable>>;
};
export type NewProject = Insertable<ProjectsTable>;
export type UpdateProject = Updateable<ProjectsTable>;

interface ImagesTable {
  id: Generated<number>;
  project_id: string;
  url: string;
}

export interface Database {
  skills: SkillsTable;
  socials: SocialsTable;
  projects: ProjectsTable;
  images: ImagesTable;
}

export interface KvMapper {
  name: string;
  email: string;
  phone: string;
  prefix: string;
  suffix: string;
  image: string;
  dob: `${number}-${number}-${number}`;
  job: string;
  bio: string;
}
