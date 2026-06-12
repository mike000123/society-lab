"use client";

import { Children, useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface CardCarouselProps {
  children: React.ReactNode;
  /** How many cards visible on the widest breakpoint (default 5) */
  perPage?: 3 | 5;
  className?: string;
}

const WIDTH_CLASSES: Record<3 | 5, string> = {
  5: "w-[calc(100%-1rem)] min-[520px]:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.667rem)] xl:w-[calc(20%-0.8rem)]",
  3: "w-[calc(100%-1rem)] min-[520px]:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)]",
};

export function CardCarousel({ children, perPage = 5, className }: CardCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  // Main listener + ResizeObserver
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", sync);
      ro.disconnect();
    };
  }, [sync]);

  // Re-sync after layout settles whenever the child count changes
  const childCount = Children.count(children);
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      sync();
      const t = setTimeout(sync, 120);
      return () => clearTimeout(t);
    });
    return () => cancelAnimationFrame(raf);
  }, [childCount, sync]);

  function step(dir: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    const dist = first ? first.offsetWidth + 16 : 260;
    el.scrollBy({ left: dir * dist, behavior: "smooth" });
  }

  const items = Children.toArray(children);
  const widthCls = WIDTH_CLASSES[perPage];

  return (
    <div className={cn("relative", className)}>
      <button
        aria-label="Previous"
        className={cn(
          "absolute -left-5 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(28,36,48,0.12)] bg-white shadow-[0_4px_14px_rgba(28,36,48,0.12)] transition hover:shadow-[0_6px_18px_rgba(28,36,48,0.18)]",
          !canLeft && "pointer-events-none opacity-0",
        )}
        onClick={() => step(-1)}
        type="button"
      >
        <ChevronLeft className="h-4 w-4 text-slate-600" />
      </button>

      <div
        className="flex gap-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        ref={trackRef}
      >
        {items.map((child, i) => (
          <div className={cn("flex-none", widthCls)} key={i}>
            {child}
          </div>
        ))}
      </div>

      <button
        aria-label="Next"
        className={cn(
          "absolute -right-5 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(28,36,48,0.12)] bg-white shadow-[0_4px_14px_rgba(28,36,48,0.12)] transition hover:shadow-[0_6px_18px_rgba(28,36,48,0.18)]",
          !canRight && "pointer-events-none opacity-0",
        )}
        onClick={() => step(1)}
        type="button"
      >
        <ChevronRight className="h-4 w-4 text-slate-600" />
      </button>
    </div>
  );
}
