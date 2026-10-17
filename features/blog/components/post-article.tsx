import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { CtaBand } from "@/components/ui/cta-band";
import { getPost, getRelatedPosts } from "@/features/blog/blog-queries";
import { PostBody } from "@/features/blog/components/post-body";
import { PostCard } from "@/features/blog/components/post-card";
import { PostCover } from "@/features/blog/components/post-cover";
import { PostByline } from "@/features/blog/components/post-meta";
import { SharePost } from "@/features/blog/components/share-post";
import { TableOfContents } from "@/features/blog/components/table-of-contents";
import { categoryLabel } from "@/lib/demo-data/blog-posts";

export async function PostArticle({ slug }: { slug: string }) {
  const post = await getPost(slug);
  const headings = post.body.flatMap((b) =>
    b.type === "h2" ? [{ id: b.id, text: b.text }] : [],
  );
  const related = await getRelatedPosts(post);
  const forDrivers = post.category === "driving";

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 pt-8 pb-16 md:pt-12 md:pb-24">
      <article className="flex flex-col gap-10">
        <header className="flex max-w-3xl flex-col gap-5">
          <Link
            href="/blog"
            className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <HugeiconsIcon
              icon={ArrowLeft02Icon}
              strokeWidth={2}
              className="size-4"
            />
            All posts
          </Link>
          <p className="text-sm font-medium text-muted-foreground">
            {categoryLabel(post.category)}
          </p>
          <h1 className="text-balance text-3xl font-semibold tracking-tight md:text-5xl">
            {post.title}
          </h1>
          <p className="text-pretty text-lg text-muted-foreground md:text-xl">
            {post.excerpt}
          </p>
          <PostByline post={post} />
        </header>

        <PostCover
          post={post}
          size="lg"
          className="aspect-16/9 md:aspect-21/9"
        />

        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_14rem] lg:gap-16">
          <div className="flex max-w-[68ch] flex-col gap-10">
            <PostBody blocks={post.body} />
            <SharePost title={post.title} />
          </div>
          <aside className="max-lg:hidden">
            <div className="sticky top-24">
              <TableOfContents headings={headings} />
            </div>
          </aside>
        </div>
      </article>

      <CtaBand
        href={forDrivers ? "/shipments" : "/shipments/new"}
        action={forDrivers ? "Browse shipments" : "Post a shipment"}
      >
        <p className="text-pretty">
          <span className="font-medium">
            {forDrivers
              ? "Have room on your next trip?"
              : "Ready to move something?"}
          </span>{" "}
          <span className="text-muted-foreground">
            {forDrivers
              ? "Find shipments on your route and send your best offer."
              : "Post your shipment for free and get offers from drivers."}
          </span>
        </p>
      </CtaBand>

      <section className="flex flex-col gap-8 pt-6">
        <h2 className="text-2xl font-semibold tracking-tight">Keep reading</h2>
        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      </section>
    </div>
  );
}

export function PostArticleSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-6xl animate-pulse flex-col gap-6 pt-12">
      <div className="h-4 w-24 rounded bg-muted" />
      <div className="h-12 w-2/3 rounded bg-muted" />
      <div className="h-6 w-1/2 rounded bg-muted" />
      <div className="aspect-21/9 rounded-2xl bg-muted/60" />
    </div>
  );
}
