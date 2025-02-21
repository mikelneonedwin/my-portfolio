import SocialsList from '@/components/SocialsList';
import { getSocials } from '@/data/socials';

export default async function ContactsPage() {
  const socials = await getSocials();
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Contacts</h1>
      <SocialsList socials={socials}/>
    </div>
  );
}