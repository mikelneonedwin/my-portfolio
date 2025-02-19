import { faker } from "@faker-js/faker";
import { PLATFORMS } from "@/constants";

export function fakeSocials(): SelectedSocials[] {
  return Array.from({ length: 10 }).map((_, index) => ({
    id: faker.string.nanoid(),
    name: PLATFORMS[index],
    url: faker.internet.url(),
  }));
}
