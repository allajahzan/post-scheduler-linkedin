import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { ClientOnly } from "@/components/layout/client-only";
import { DM_Sans } from "next/font/google";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  preload: true,
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Post Scheduler - LinkedIn Automation",
  description: "Manage scheduled posts for LinkedIn workflow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.className} h-full antialiased`}>
      <head>
        <link rel="icon" href="favicon.ico" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ClientOnly>
          <QueryProvider>
            {children}
            <Toaster />
          </QueryProvider>
        </ClientOnly>
      </body>
    </html>
  );
}
