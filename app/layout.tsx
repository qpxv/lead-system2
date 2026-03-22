import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Nav from "@/app/components/Nav";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Outreach — Lead Pipeline",
  description: "Personal outbound prospecting tool",
};

// Runs synchronously before first paint — no theme flash.
// Always sets data-theme so [data-theme="light/dark"] rules always apply.
const themeScript = `
(function(){
  try {
    var s = localStorage.getItem("theme");
    if (s === "light" || s === "dark") {
      document.documentElement.setAttribute("data-theme", s);
    } else {
      var dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    }
  } catch(e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: the inline script changes data-theme before
    // React hydrates, so the attribute won't match the server render — that's fine.
    <html lang="en" className={geist.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen flex flex-col">
        <Nav />
        {children}
      </body>
    </html>
  );
}
