import type { Metadata, Viewport } from "next";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site-config";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/layout/providers";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Track anime, manga, manhwa, manhua & movies`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Track anime, manga, manhwa, manhua & movies`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Track anime, manga, manhwa, manhua & movies`,
    description: SITE_DESCRIPTION,
    images: ["/opengraph-image"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-screen bg-surface-0 text-text-primary overflow-y-auto">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}