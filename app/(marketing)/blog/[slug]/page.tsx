import type { Metadata } from "next";
import { Suspense } from "react";
import { getPost, getPosts } from "@/features/blog/blog-queries";
import {
  PostArticle,
  PostArticleSkeleton,
} from "@/features/blog/components/post-article";

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const post = await getPost((await params).slug);
  return {
    title: `${post.title} · Haulr`,
    description: post.excerpt,
    authors: [{ name: post.author.name }],
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.published,
    },
  };
}

export default function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  return (
    <main className="flex flex-1 flex-col px-4">
      <Suspense fallback={<PostArticleSkeleton />}>
        {params.then(({ slug }) => (
          <PostArticle slug={slug} />
        ))}
      </Suspense>
    </main>
  );
}
