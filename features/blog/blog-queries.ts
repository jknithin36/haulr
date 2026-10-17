import "server-only";
import { notFound } from "next/navigation";
import { type Post, posts, sortedPosts } from "@/lib/demo-data/blog-posts";

// Reads go through this file so the in-memory demo posts can be swapped for a
// CMS without touching the components.

/** Every post, newest first. */
export async function getPosts() {
  return sortedPosts;
}

/** The post with this slug, or the not-found page. */
export async function getPost(slug: string) {
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();
  return post;
}

/** Newest posts other than `post`, same category first. */
export async function getRelatedPosts(post: Post, count = 3) {
  return sortedPosts
    .filter((p) => p.slug !== post.slug)
    .sort(
      (a, b) =>
        Number(b.category === post.category) -
        Number(a.category === post.category),
    )
    .slice(0, count);
}
