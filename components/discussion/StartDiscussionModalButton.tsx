import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

/** Navigates to the full-page discussion creation flow at /discussions/new. */
export function StartDiscussionModalButton() {
  return (
    <Button asChild className="rounded-full px-5">
      <Link href="/discussions/new">
        Start a discussion
        <ArrowRight className="h-4 w-4" />
      </Link>
    </Button>
  );
}
