import "./globals.css";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";

export const metadata: Metadata = {
  title: "Society Lab",
  description: "A civic intelligence lab for systemic policy thinking, simulations, and structured debate.",
};

// Inline script: runs before React hydrates to prevent flash of wrong theme
const themeScript = `(function(){try{var t=localStorage.getItem("theme");document.documentElement.classList.add(t==="light"?"light":"dark");}catch(e){document.documentElement.classList.add("dark");}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <div className="grid-overlay fixed inset-0 -z-10 opacity-20" />
        <SiteHeader />
        <main className="px-4 py-6 md:px-8">{children}</main>
      </body>
    </html>
  );
}
