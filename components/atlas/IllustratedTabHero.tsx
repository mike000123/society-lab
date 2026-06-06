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
    <div className={cn("space-y-5", className)}>
      <section className="relative ml-[calc(50%-50vw)] w-screen overflow-hidden border-y border-[rgba(28,36,48,0.08)] bg-white shadow-[0_24px_60px_rgba(28,36,48,0.05)]">
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[58%] md:block lg:w-[55%] xl:w-[53%]">
          <Image
            alt={imageAlt}
            className={cn("object-cover object-right-center", imageClassName)}
            fill
            priority={false}
            sizes="(min-width: 1280px) 53vw, (min-width: 1024px) 55vw, 58vw"
            src={imageSrc}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,1)_0%,rgba(255,255,255,0.92)_14%,rgba(255,255,255,0.58)_34%,rgba(255,255,255,0.16)_56%,rgba(255,255,255,0)_74%)]" />
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[rgba(255,255,255,0.28)] to-transparent" />

        <div className="relative z-10 mx-auto max-w-[88rem] px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          <div className="flex min-h-[18rem] max-w-[37rem] flex-col justify-center gap-5 md:min-h-[20rem] lg:min-h-[22rem] lg:max-w-[40rem]">
            <p className="atlas-kicker">{eyebrow}</p>
            <div className="space-y-4">
              <h1 className="atlas-display max-w-[30rem] text-4xl leading-[0.95] text-slate-900 sm:text-5xl lg:text-[3.6rem]">
                {title}
              </h1>
              <p className="atlas-lede max-w-[29rem] text-slate-700">{description}</p>
            </div>

            {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
          </div>
        </div>
      </section>

      {children ? <div className="relative">{children}</div> : null}
    </div>
  );
}
