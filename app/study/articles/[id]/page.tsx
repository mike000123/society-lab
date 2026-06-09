import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, FileText } from "lucide-react";
import Link from "next/link";

import { AtlasPage } from "@/components/atlas/AtlasPage";
import type { Database } from "@/lib/database.types";
import { parseStructuredArticle } from "@/lib/content/structured-article";
import { STUDY_CATEGORIES } from "@/lib/study/catalog";
import { createOptionalClient } from "@/lib/supabase/server";

type StudySubmission = Database["public"]["Tables"]["study_resource_submissions"]["Row"];

export const dynamic = "force-dynamic";

function renderBlock(block: ReturnType<typeof parseStructuredArticle>["blocks"][number], key: string) {
  if (block.type === "heading") {
    const HeadingTag = block.level === 2 ? "h2" : "h3";
    return (
      <HeadingTag
        className={block.level === 2 ? "atlas-display text-4xl leading-tight text-slate-900" : "text-2xl font-semibold text-slate-900"}
        key={key}
      >
        {block.text}
      </HeadingTag>
    );
  }

  if (block.type === "paragraph") {
    return (
      <p className="text-[1.02rem] leading-8 text-slate-700" key={key}>
        {block.text}
      </p>
    );
  }

  if (block.type === "list") {
    return (
      <ul className="grid gap-3" key={key}>
        {block.items.map((item) => (
          <li className="rounded-[1.25rem] border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.72)] px-4 py-3 text-sm leading-7 text-slate-700" key={item}>
            {item}
          </li>
        ))}
      </ul>
    );
  }

  if (block.type === "callout") {
    return (
      <div className="rounded-[1.4rem] border border-cyan-200 bg-cyan-50/70 px-4 py-4 text-sm leading-7 text-slate-700" key={key}>
        {block.text}
      </div>
    );
  }

  if (block.type === "cards") {
    return (
      <div className="space-y-4" key={key}>
        {block.title ? <p className="atlas-kicker">{block.title}</p> : null}
        <div className="grid gap-4 md:grid-cols-2">
          {block.items.map((item) => (
            <article className="rounded-[1.45rem] border border-[rgba(28,36,48,0.08)] bg-white p-5" key={`${item.title}-${item.body}`}>
              <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-700">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    );
  }

  if (block.type === "sources") {
    return (
      <div className="space-y-4" key={key}>
        {block.title ? <p className="atlas-kicker">{block.title}</p> : null}
        <div className="grid gap-3 md:grid-cols-2">
          {block.items.map((item) => (
            <a
              className="flex items-start justify-between gap-3 rounded-[1.3rem] border border-[rgba(28,36,48,0.08)] bg-white px-4 py-4 transition hover:border-[rgba(28,36,48,0.16)]"
              href={item.url}
              key={`${item.label}-${item.title}`}
              rel="noreferrer"
              target="_blank"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
                <p className="mt-2 text-sm font-medium text-slate-900">{item.title}</p>
              </div>
              <ExternalLink className="mt-0.5 h-4 w-4 flex-none text-primary" />
            </a>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

export default async function StudyCommunityArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createOptionalClient();

  if (!supabase) {
    notFound();
  }

  const { data: submission, error } = await supabase
    .from("study_resource_submissions")
    .select("*")
    .eq("id", id)
    .maybeSingle<StudySubmission>();

  if (error || !submission || submission.submission_kind !== "article" || !submission.body_markdown) {
    notFound();
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, username")
    .eq("id", submission.submitter_id)
    .maybeSingle();

  const contributorName = profile?.full_name ?? profile?.username ?? "Society Lab member";
  const category = STUDY_CATEGORIES.find((entry) => entry.id === submission.category_id);
  const article = parseStructuredArticle(submission.body_markdown);

  return (
    <AtlasPage className="space-y-8 pb-16">
      <div className="mx-auto w-full max-w-[850px] space-y-6">
        <Link className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900" href="/study?view=library">
          <ArrowLeft className="h-4 w-4" />
          Back to Study
        </Link>

        <header className="space-y-5 rounded-[2rem] border border-[rgba(28,36,48,0.08)] bg-white px-6 py-8 shadow-[0_18px_40px_rgba(28,36,48,0.05)] sm:px-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.88)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Community article
            </span>
            {category ? (
              <span className="rounded-full border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.88)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                {category.title}
              </span>
            ) : null}
            <span className="rounded-full border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.88)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              {submission.level}
            </span>
          </div>

          <h1 className="atlas-display max-w-4xl text-[3.2rem] leading-[0.98] text-slate-900 sm:text-[4rem]">
            {submission.title}
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-slate-600">{submission.summary}</p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <span className="inline-flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              By {contributorName}
            </span>
            {submission.published_at ? <span>Published {new Date(submission.published_at).toLocaleDateString()}</span> : null}
          </div>
        </header>

        <div className="space-y-8">
          {article.blocks.map((block, index) => renderBlock(block, `${block.type}-${index}`))}
        </div>
      </div>
    </AtlasPage>
  );
}
