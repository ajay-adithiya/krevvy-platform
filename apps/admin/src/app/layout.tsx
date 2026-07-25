import "./globals.css";
import type { Metadata } from "next";
import { Geist } from "next/font/google";

import { cn } from "@/lib/utils";
import QueryProvider from "@/components/providers/query-provider";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Krevvy Admin",
  description: "Krevvy Admin Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}