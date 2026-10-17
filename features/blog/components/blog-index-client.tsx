"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostCard } from "@/features/blog/components/post-card";
import {
  type BlogCategory,
  blogCategories,
  type Post,
} from "@/lib/demo-data/blog-posts";

type Filter = "all" | BlogCategory;

/** Featured post and the category-filtered grid. `posts` is newest first. */
export function BlogIndexClient({ posts }: { posts: Post[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [featured, ...rest] = posts;
  const list =
    filter === "all" ? rest : posts.filter((post) => post.category === filter);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 pt-10 pb-16 md:pt-16 md:pb-24">
      <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="flex max-w-2xl flex-col gap-3">
          <p className="text-sm font-medium text-muted-foreground">Blog</p>
          <h1 className="text-balance text-3xl font-semibold tracking-tight md:text-5xl">
            Guides for shipping and driving
          </h1>
          <p className="text-pretty text-muted-foreground md:text-lg">
            Practical advice for moving cars, furniture, and freight, and for
            the drivers who carry them.
          </p>
        </div>
        <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
          <TabsList
            aria-label="Filter posts"
            className="group-data-horizontal/tabs:h-9"
          >
            <TabsTrigger value="all" className="px-3">
              All
            </TabsTrigger>
            {blogCategories.map((c) => (
              <TabsTrigger key={c.value} value={c.value} className="px-3">
                {c.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </header>

      {filter === "all" && <PostCard post={featured} featured />}

      <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
