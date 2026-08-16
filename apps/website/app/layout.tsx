import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "../components/layout/header";
import { Footer } from "../components/layout/footer";
import { AuthProvider } from "../components/auth/auth-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.krevvy.com'),
  title: "Krevvy | Premium Consumer Products",
  description: "Discover our collection of premium, modern consumer products designed for the Indian lifestyle.",
  openGraph: {
    title: "Krevvy | Premium Consumer Products",
    description: "Discover our collection of premium, modern consumer products designed for the Indian lifestyle.",
    url: '/',
    siteName: 'Krevvy',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Krevvy | Premium Consumer Products",
    description: "Discover our collection of premium, modern consumer products designed for the Indian lifestyle.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans selection:bg-foreground selection:text-background">
        <AuthProvider>
          <Header />
          <main className="flex-grow flex flex-col">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
