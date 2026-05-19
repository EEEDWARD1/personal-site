import type { Metadata } from "next";
import Nav from "@/components/ui/nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Eduard Teodor | Software Developer",
  description:
    "Portfolio, projects, writing, and freelance work by Eduard Teodor, a London-based final-year Computer Science student and software developer.",
  metadataBase: new URL("https://eduardteodor.co.uk"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
          <Nav />
          {children}
        </div>
      </body>
    </html>
  );
}
