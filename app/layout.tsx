import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/auth";
import { ThemeProvider } from "@/context/theme-provider";
import { getImage, getJob, getName, getTwitterUsername } from "@/data";
import { Analytics } from "@vercel/analytics/react";
import clsx from "clsx";
import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import NextjsTopLoader from "nextjs-toploader";
import "./globals.css";
import { getSite } from "@/utils/shared";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export async function generateMetadata(): Promise<Metadata> {
  const name = await getName();
  const image = await getImage();
  const job = await getJob();
  const twitterUsername = await getTwitterUsername();
  const siteName = name ? `${name} - Portfolio` : "Portfolio";
  return {
    title: {
      default: siteName,
      template: name ? `%s | ${name}` : "",
    },
    description: clsx("A showcase of my work and skills", job && `as a ${job}`),
    openGraph: {
      type: "website",
      locale: "en_US",
      url: getSite(),
      siteName,
      images: image
        ? [
            {
              url: image,
              width: 1200,
              height: 630,
              alt: siteName,
            },
          ]
        : [],
    },
    twitter: twitterUsername
      ? {
          card: "summary_large_image",
          site: `@${twitterUsername}`,
          creator: `@${twitterUsername}`,
        }
      : null,
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body className={`${inter.variable} ${poppins.variable} font-sans`}>
          <NextjsTopLoader showSpinner={false} />
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </AuthProvider>
          <Analytics />
          <Toaster />
        </body>
      </html>
    </>
  );
}
