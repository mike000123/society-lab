import Image from "next/image";

import { cn } from "@/lib/utils";

const legend = ["Economy", "Power", "Cities", "Ecology"];

export function CivilizationIllustration({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative overflow-hidden rounded-[2.5rem] border border-[rgba(28,36,48,0.08)] bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.96),rgba(241,235,220,0.72)_34%,rgba(225,235,244,0.84)_72%,rgba(214,228,239,0.92))] p-4 shadow-[0_32px_90px_rgba(28,36,48,0.12)] sm:p-6",
        className,
      )}
    >
      <div className="pointer-events-none absolute -left-20 top-[-4.5rem] h-48 w-48 rounded-full bg-[rgba(212,168,79,0.16)] blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-[-5rem] h-56 w-56 rounded-full bg-[rgba(59,130,246,0.12)] blur-3xl" />

      <div className="relative h-full overflow-hidden rounded-[2rem] border border-white/55 bg-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
        <div className="relative h-full min-h-[25rem] w-full lg:min-h-[38rem]">
          <Image
            alt="Society Lab homepage illustration"
            className="object-cover object-center"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            src="/atlas/home-hero.png"
          />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[rgba(255,252,247,0.45)] via-transparent to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[rgba(246,244,238,0.28)] via-transparent to-transparent" />
        </div>
      </div>

      <div className="absolute left-5 top-5 flex flex-wrap gap-2 sm:left-7 sm:top-7">
        <span className="rounded-full border border-white/70 bg-white/72 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-700 backdrop-blur">
          Atlas View
        </span>
        <span className="rounded-full border border-white/70 bg-white/56 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 backdrop-blur">
          Systems in motion
        </span>
      </div>

      <div className="absolute inset-x-4 bottom-4 grid grid-cols-2 gap-2 sm:inset-x-6 sm:grid-cols-4">
        {legend.map((item, index) => (
          <div
            className="rounded-full border border-white/75 bg-white/68 px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-700 backdrop-blur"
            key={item}
            style={{ boxShadow: index === 1 ? "0 12px 24px rgba(212,168,79,0.12)" : undefined }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
