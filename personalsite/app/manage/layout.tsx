import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function ManageLayout({ children }: { children: React.ReactNode }) {
  return <><Navigation /><main className="py-10 sm:py-12">{children}</main><Footer /></>;
}
