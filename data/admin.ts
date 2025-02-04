import { TESTING } from "@/constants";
import { adminKv } from "@/lib/firebase-admin";
import { faker } from "@faker-js/faker";
import { cache } from "react";

export const getAdminData = cache(async () => {
  if (TESTING) {
    const allowedEmails = Array.from({ length: 5 }, () =>
      faker.internet.email()
    );
    return {
      allowedEmails,
      title: faker.person.prefix(),
      email: allowedEmails[0],
      avatar: faker.image.avatarGitHub(),
      name: faker.person.fullName(),
      images: Array.from({ length: 5 }, () => faker.image.avatarGitHub()),
      phone: faker.phone.number(),
      socials: {
        GitHub: faker.internet.url(),
        Instagram: faker.internet.url(),
        LinkedIn: faker.internet.url(),
        Snapchat: faker.internet.url(),
        Telegram: faker.internet.url(),
        TikTok: faker.internet.url(),
        Tumblr: faker.internet.url(),
        Website: faker.internet.url(),
        WhatsApp: faker.internet.url(),
        X: faker.internet.url(),
        YouTube: faker.internet.url(),
      },
      job: faker.person.jobTitle(),
      bio: faker.lorem.paragraph(),
      skills: Array.from({ length: 5 }, () => ({
        name: faker.lorem.word(),
        icon: faker.image.avatarGitHub(),
      })),
    } satisfies Admin;
  } else {
    const snapshot = await adminKv.ref("admin").get();
    const data = snapshot.val() as Admin;
    return {
      ...data,
      allowedEmails: Object.values(data.allowedEmails),
    } satisfies Admin;
  }
});

export const addSocial = async (social: SocialPlatforms, value: string) => {
  await adminKv.ref(`admin/socials/${social}`).set(value);
};

export const removeSocial = async (social: string) => {
  await adminKv.ref(`admin/socials/${social}`).remove();
};

export const getSocials = async () => {
  const admin = await getAdminData();
  return Object.entries({
    Email: `mailto:${admin.email}`,
    Phone: `tel:${admin.phone}`,
    ...admin.socials,
  }) as Array<[SocialPlatforms, string]>;
};

export const getAllowedEmails = async () => {
  const admin = await getAdminData();
  return admin.allowedEmails;
};

export const addAllowedEmail = async (email: string) => {
  await adminKv.ref("admin/allowedEmails").push(email);
};

export const removeAllowedEmail = async (email: string) => {
  adminKv
    .ref("admin/allowedEmails")
    .transaction((emails: Record<string, string>) => {
      const entries = Object.entries(emails);
      return Object.fromEntries(entries.filter(([, value]) => value !== email));
    });
};
