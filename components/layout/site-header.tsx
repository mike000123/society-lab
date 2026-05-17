import Link from "next/link";
import { Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const nav = [
  { href: "/learn", label: "Learn" },
  { href: "/simulate", label: "Simulate" },
  { href: "/discuss", label: "Discuss" },
  { href: "/governance", label: "Governance" },
  { href: "/map", label: "Map" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-800/80 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Globe2 className="h-5 w-5 text-primary" />
          <span className="font-semibold">System Shift Lab</span>
        </Link>
        <nav className="hidden gap-1 md:flex">
          {nav.map((item) => <Button key={item.href} variant="ghost" asChild><Link href={item.href}>{item.label}</Link></Button>)}
        </nav>
      </div>
    </header>
  );
}
