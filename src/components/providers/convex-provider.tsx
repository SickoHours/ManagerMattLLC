"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

// Safely create Convex client - handle missing env var
function createConvexClient() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) {
    console.error("NEXT_PUBLIC_CONVEX_URL is not defined");
    return null;
  }
  return new ConvexReactClient(url);
}

const convex = createConvexClient();

// Public provider - Convex without Clerk (for all routes)
export function PublicConvexProvider({ children }: { children: ReactNode }) {
  if (!convex) {
    // Render children without Convex if env var is missing
    // This allows the site to at least display something
    return <>{children}</>;
  }
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}

// Clerk-only provider - just for admin UI components (UserButton, etc.)
export function ClerkAuthProvider({ children }: { children: ReactNode }) {
  return <ClerkProvider>{children}</ClerkProvider>;
}
