import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function AtlasPage({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("mx-auto max-w-7xl space-y-16 pb-20 md:space-y-20", className)}>{children}</div>;
}
