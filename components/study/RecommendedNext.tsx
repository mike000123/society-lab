"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Recommendation = {
  description: string;
  href: string;
  imageSrc: string;
  label: string;
  meta: string;
  title: string;
};

export function RecommendedNext({
  items,
}: {
  items: Recommendation[];
}) {
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="atlas-display text-[2rem] leading-tight text-slate-900">Recommended next</h2>
          <p className="mt-2 text-sm text-slate-600">Based on the questions and systems people most often explore across Society Lab.</p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-4">
        {items.map((item) => (
          <article
            className="overflow-hidden rounded-[1.45rem] border border-[rgba(28,36,48,0.08)] bg-white shadow-[0_16px_36px_rgba(28,36,48,0.05)]"
            key={item.title}
          >
            <div className="grid gap-0 sm:grid-cols-[7.5rem_minmax(0,1fr)] xl:grid-cols-[6.25rem_minmax(0,1fr)]">
              <div className="relative min-h-[8.5rem] overflow-hidden bg-[rgba(246,244,238,0.76)]">
                <Image
                  alt={item.title}
                  className="object-cover object-center"
                  fill
                  sizes="(min-width: 1280px) 8vw, 30vw"
                  src={item.imageSrc}
                />
              </div>
              <div className="space-y-2 px-4 py-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
                <h3 className="text-base font-semibold leading-6 text-slate-900">{item.title}</h3>
                <p className="text-xs leading-5 text-slate-500">{item.meta}</p>
                <p className="text-sm leading-6 text-slate-600">{item.description}</p>
                <Link className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-blue-700" href={item.href}>
                  Continue learning
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
