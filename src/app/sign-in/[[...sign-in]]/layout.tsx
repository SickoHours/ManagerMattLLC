import { ClerkAuthProvider } from "@/components/providers/convex-provider";

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClerkAuthProvider>{children}</ClerkAuthProvider>;
}
