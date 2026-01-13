import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

// Allowed admin emails
const ADMIN_EMAILS = [
  "anthonymsanchez32@gmail.com",
];

export default clerkMiddleware(async (auth, req) => {
  // Only enforce Clerk auth on admin and sign-in routes
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
  // Only run middleware on admin routes and sign-in routes
  // Public routes don't need Clerk middleware at all
  matcher: [
    "/admin(.*)",
    "/sign-in(.*)",
    "/api/admin(.*)",
  ],
};
