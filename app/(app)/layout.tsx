import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { kv } from "@/lib/kv";
import { Suspense, type ReactNode } from "react";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const name = await kv.get("name");
  return (
    <div className="flex flex-col min-h-screen">
      <Header name={name} />
      <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
      <Suspense key="footer" fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
}
