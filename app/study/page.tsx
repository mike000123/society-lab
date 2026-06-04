import type { Metadata } from "next";

import { StudyHubPage } from "@/components/study/StudyHubPage";

export const metadata: Metadata = {
  title: "Study | Society Lab",
  description:
    "A curated study library for systems thinking, political economy, ecology, governance, corruption, media power, and civic redesign.",
};

export default function StudyPage() {
  return <StudyHubPage />;
}
