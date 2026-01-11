import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Manager Matt LLC | AI-Accelerated Development",
  description:
    "Build products that matter. Faster. Clearer. Cheaper. AI-accelerated development with radically transparent estimates and delivery.",
  keywords: [
    "AI development",
    "software development",
    "web development",
    "mobile development",
    "MVP development",
    "startup development",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
