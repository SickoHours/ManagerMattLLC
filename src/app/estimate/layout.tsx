import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get Your Estimate | Manager Matt LLC",
  description:
    "Configure your build and get a transparent estimate with P10/P50/P90 ranges. See every assumption and cost driver.",
};

export default function EstimateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
