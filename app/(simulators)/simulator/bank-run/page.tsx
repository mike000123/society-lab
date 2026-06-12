"use client";

import dynamic from "next/dynamic";
import { PageSkeleton } from "@/components/ui/page-skeleton";

const SimulatorContent = dynamic(() => import("./SimulatorContent"), {
  ssr: false,
  loading: () => <PageSkeleton rows={4} />,
});

export default function Page() {
  return <SimulatorContent />;
}
