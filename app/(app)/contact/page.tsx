import { getSocials } from "@/data/admin";
import ContactPage from "./client";

export default async function Contact() {
  const socials = await getSocials();
  return <ContactPage data={socials} />;
}
