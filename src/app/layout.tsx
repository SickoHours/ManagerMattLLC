import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Oswald } from "next/font/google";
import "./globals.css";
import { PublicConvexProvider } from "@/components/providers/convex-provider";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Manager Matt LLC | Vibe Coder",
  description:
    "The internet's first portfolio from a self-proclaimed, shameless, unapologetic vibe coder who actually ships production software. To paying clients. Who come back for more.",
  keywords: [
    "vibe coder",
    "AI development",
    "software development",
    "web development",
    "Claude AI",
    "startup development",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${oswald.variable}`}>
      <body className="min-h-screen font-sans antialiased" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
        <PublicConvexProvider>{children}</PublicConvexProvider>
      </body>
    </html>
  );
}
