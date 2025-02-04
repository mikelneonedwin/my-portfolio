import { AuthProvider } from "@/context/auth";
import { ThemeProvider } from "@/context/theme-provider";
import { getAdminData } from "@/data/admin";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import NextjsTopLoader from "nextjs-toploader";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export async function generateMetadata(): Promise<Metadata> {
  const adminData = await getAdminData();
  const name = adminData.name || "Your Name";
  return {
    title: {
      default: `${name} - Portfolio`,
      template: `%s | ${name}`,
    },
    description: "A showcase of my work and skills as a full-stack developer",
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "https://yourportfolio.com",
      siteName: `${name} - Portfolio`,
      images: [
        {
          url: "https://yourportfolio.com/og-image.jpg",
          width: 1200,
          height: 630,
          alt: `${name} - Portfolio`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@yourtwitterhandle",
      creator: "@yourtwitterhandle",
    },
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
        </body>
      </html>
    </>
  );
}
