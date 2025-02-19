import { getSocials } from "@/data";
import ContactPage from "./client";

export default async function Contact() {
  const socials = await getSocials();
  return <ContactPage initialState={socials} />;
}
