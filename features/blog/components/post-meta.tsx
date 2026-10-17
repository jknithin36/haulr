import { GradientAvatar } from "@/components/ui/gradient-avatar";
import {
  formatPublished,
  type Post,
  readingTime,
} from "@/lib/demo-data/blog-posts";

export function PostByline({ post }: { post: Post }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <GradientAvatar seed={post.author.name} className="size-8" />
      <div className="min-w-0">
        <p className="font-medium">{post.author.name}</p>
        <p className="text-muted-foreground">
          <time dateTime={post.published}>
            {formatPublished(post.published)}
          </time>{" "}
          · {readingTime(post)} min read
        </p>
      </div>
    </div>
  );
}
