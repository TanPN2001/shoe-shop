import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import LayoutHeader from "@/components/layout/layout.header";
import LayoutFooter from "@/components/layout/layout.footer";
import LayoutSupport from "@/components/layout/layout.support";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EZMan Store",
  description: "Thế giới thời trang đẳng cấp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} relative antialiased bg-ezman-bg min-h-screen`}>
        <LayoutHeader />
        {children}
        <LayoutFooter />
        <LayoutSupport />
        <Toaster />
      </body>
    </html>
  );
}
