import type { ReactNode } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

export function IllustratedTabHero({
  actions,
  children,
  className,
  description,
  eyebrow,
  imageAlt,
  imageClassName,
  imageSrc,
  title,
}: {
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
  description: string;
  eyebrow: string;
  imageAlt: string;
  imageClassName?: string;
  imageSrc: string;
  title: string;
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-[2.5rem] border border-[rgba(28,36,48,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,252,247,0.92))] p-5 shadow-[0_28px_70px_rgba(28,36,48,0.06)] sm:p-6 lg:p-7",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[rgba(59,130,246,0.05)] via-[rgba(212,168,79,0.06)] to-transparent" />

      <div className="relative grid gap-6 lg:grid-cols-[minmax(0,0.88fr)_minmax(18rem,0.95fr)] lg:items-center">
        <div className="space-y-5">
          <p className="atlas-kicker">{eyebrow}</p>
          <div className="space-y-4">
            <h1 className="atlas-display max-w-3xl text-4xl leading-[0.95] text-slate-900 sm:text-5xl lg:text-[3.75rem]">
              {title}
            </h1>
            <p className="atlas-lede max-w-2xl">{description}</p>
          </div>

          {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.75)] shadow-[0_16px_38px_rgba(28,36,48,0.06)]">
          <div className="relative aspect-[16/9] w-full">
            <Image
              alt={imageAlt}
              className={cn("object-cover", imageClassName)}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              src={imageSrc}
            />
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[rgba(255,255,255,0.14)] to-transparent" />
        </div>
      </div>

      {children ? <div className="relative mt-6">{children}</div> : null}
    </section>
  );
}
