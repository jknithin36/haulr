import Link from "next/link";
import { PostCover } from "@/features/blog/components/post-cover";
import { PostByline } from "@/features/blog/components/post-meta";
import { categoryLabel, type Post } from "@/lib/demo-data/blog-posts";
import { cn } from "@/lib/utils";

export function PostCard({
  post,
  featured = false,
}: {
  post: Post;
  featured?: boolean;
}) {
  return (
    <article
      className={cn(
        "group relative flex flex-col gap-5",
        featured &&
          "md:grid md:grid-cols-[1.3fr_1fr] md:items-center md:gap-10",
      )}
    >
      <PostCover
        post={post}
        size={featured ? "lg" : "md"}
        className={cn(
          "aspect-16/10 transition-[filter] duration-300 group-hover:brightness-[0.97]",
          featured && "md:aspect-4/3",
        )}
      />
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-muted-foreground">
          {categoryLabel(post.category)}
        </p>
        <h3
          className={cn(
            "text-balance font-semibold tracking-tight",
            featured ? "text-2xl md:text-4xl" : "text-xl",
          )}
        >
          <Link
            href={`/blog/${post.slug}`}
            className="outline-none after:absolute after:inset-0 after:rounded-2xl focus-visible:after:ring-3 focus-visible:after:ring-ring/50 group-hover:underline group-hover:decoration-foreground/30 group-hover:underline-offset-4"
          >
            {post.title}
          </Link>
        </h3>
        <p
          className={cn(
            "text-pretty text-muted-foreground",
            featured && "md:text-lg",
          )}
        >
          {post.excerpt}
        </p>
        <div className="pt-1">
          <PostByline post={post} />
        </div>
      </div>
    </article>
  );
}
