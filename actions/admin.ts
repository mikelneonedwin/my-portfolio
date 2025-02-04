"use server";

import { addSocial, removeSocial } from "@/data/admin";
import { authorize } from "@/utils/server";
import { z } from "zod";

export const createSocial = async (
  key: SocialPlatforms,
  value: string,
  token: string
) => {
  try {
    z.string().parse(token);
    z.string().url().or(z.string().email()).or(z.string().min(11)).parse(value);
    z.string().parse(key);
    await authorize(token);
    addSocial(key, value);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Error creating social:", err);
    return "Sorry, an error occured";
  }
};

export const deleteSocial = async (key: SocialPlatforms, token: string) => {
  try {
    z.string().min(1).parse(key);
    z.string().min(1).parse(token);
    await authorize(token);
    removeSocial(key);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Error while deleting social", err);
    return "Sorry, an error occured";
  }
};
