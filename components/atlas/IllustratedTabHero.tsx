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
        "relative overflow-hidden rounded-[2.5rem] border border-[rgba(28,36,48,0.08)] bg-white px-5 py-5 shadow-[0_28px_70px_rgba(28,36,48,0.06)] sm:px-6 sm:py-6 lg:px-7 lg:py-7",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0">
        <Image
          alt={imageAlt}
          className={cn("object-cover object-right-center", imageClassName)}
          fill
          priority={false}
          sizes="100vw"
          src={imageSrc}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(246,244,238,0.98)_0%,rgba(246,244,238,0.96)_18%,rgba(246,244,238,0.84)_34%,rgba(246,244,238,0.52)_52%,rgba(246,244,238,0.18)_72%,rgba(246,244,238,0.04)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[rgba(255,255,255,0.42)] via-[rgba(255,255,255,0.08)] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[rgba(255,255,255,0.18)] to-transparent" />
      </div>

      <div className="relative min-h-[18rem] sm:min-h-[20rem] lg:min-h-[22rem]">
        <div className="flex h-full max-w-[42rem] flex-col justify-center gap-5 py-2 sm:max-w-[44rem] lg:max-w-[46rem]">
          <p className="atlas-kicker">{eyebrow}</p>
          <div className="space-y-4">
            <h1 className="atlas-display max-w-3xl text-4xl leading-[0.95] text-slate-900 sm:text-5xl lg:text-[3.75rem]">
              {title}
            </h1>
            <p className="atlas-lede max-w-2xl text-slate-700">{description}</p>
          </div>

          {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
        </div>
      </div>

      {children ? <div className="relative mt-6">{children}</div> : null}
    </section>
  );
}
