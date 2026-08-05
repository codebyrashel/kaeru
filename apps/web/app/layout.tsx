import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Sidebar } from "@/components/sidebar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kaeru",
  description: "Track anime, manga, manhwa, manhua, and movies in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="h-screen overflow-hidden bg-surface-0 text-text-primary">
        <div className="flex h-screen">
          <Sidebar />
          <main className="flex-1 overflow-y-auto overflow-x-hidden">{children}</main>
        </div>
      </body>
    </html>
  );
}
