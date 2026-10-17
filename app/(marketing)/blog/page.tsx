import type { Metadata } from "next";
import { Suspense } from "react";
import {
  BlogIndex,
  BlogIndexSkeleton,
} from "@/features/blog/components/blog-index";

export const metadata: Metadata = {
  title: "Blog · Haulr",
  description:
    "Practical guides for shipping cars, furniture, and freight, and tips for drivers.",
};

export default function BlogPage() {
  return (
    <main className="flex flex-1 flex-col px-4">
      <Suspense fallback={<BlogIndexSkeleton />}>
        <BlogIndex />
      </Suspense>
    </main>
  );
}
