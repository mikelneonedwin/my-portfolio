import type { FullProject } from "@/types/db";
import { faker } from "@faker-js/faker";

type Options = {
  length?: number;
  featured?: boolean;
  slug?: string;
};

export function generateFakeProjects({
  length = Math.ceil(Math.random() * 10),
  featured,
  slug = faker.lorem.slug(),
}: Options = {}): FullProject[] {
  return Array.from({ length }).map(() => {
    const projectId = faker.string.nanoid();
    return {
      slug,
      company: faker.company.name(),
      description: faker.lorem.paragraphs(),
      featured: featured || faker.datatype.boolean(),
      github_url: faker.image.avatarGitHub(),
      id: projectId,
      live_url: faker.internet.url(),
      media: {
        type: "image",
        url: faker.image.urlPicsumPhotos(),
      },
      title: faker.lorem.word(),
      tools: [],
      year: faker.number.int({
        min: 2000,
        max: 2024,
      }),
      images: [
        {
          id: faker.number.int(),
          project_id: projectId,
          url: faker.image.urlPicsumPhotos(),
        },
        {
          id: faker.number.int(),
          project_id: projectId,
          url: faker.image.urlPicsumPhotos(),
        },
      ],
    };
  });
}
