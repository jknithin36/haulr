import { getPosts } from "@/features/blog/blog-queries";
import { BlogIndexClient } from "@/features/blog/components/blog-index-client";

/** Server half of the blog index: loads the posts, then hands them to the filterable list. */
export async function BlogIndex() {
  const posts = await getPosts();
  return <BlogIndexClient posts={posts} />;
}

export function BlogIndexSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-6xl animate-pulse flex-col gap-12 pt-10 md:pt-16">
      <div className="flex max-w-2xl flex-col gap-3">
        <div className="h-5 w-12 rounded bg-muted" />
        <div className="h-12 w-2/3 rounded bg-muted" />
        <div className="h-6 w-1/2 rounded bg-muted" />
      </div>
      <div className="aspect-16/10 rounded-2xl bg-muted/60 md:aspect-21/9" />
    </div>
  );
}
