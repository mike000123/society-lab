import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RoadmapCards } from "@/components/sections/roadmap-cards";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-800 bg-panel p-6 md:p-10">
        <p className="text-cyan-300">Systemic intelligence platform</p>
        <h1 className="mt-2 text-3xl font-bold md:text-5xl">Prototype ideas → production-ready MVP foundation</h1>
        <p className="mt-3 max-w-3xl text-slate-300">Learn systemic failures, test policy alternatives, and debate with structure. This MVP sets architecture for future modules without backend complexity yet.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button asChild><Link href="/simulate">Open Simulator</Link></Button>
          <Button variant="outline" asChild><Link href="/discuss">View Discussion Mock</Link></Button>
        </div>
      </section>
      <RoadmapCards />
    </div>
  );
}
