import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

// Allowed admin emails
const ADMIN_EMAILS = [
  "anthonymsanchez32@gmail.com",
];

export default clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req)) {
    // Protect the route (requires sign-in)
    await auth.protect();

    // Check if user email is in admin list
    const { sessionClaims } = await auth();
    const userEmail = sessionClaims?.email as string | undefined;

    if (!userEmail || !ADMIN_EMAILS.includes(userEmail.toLowerCase())) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
