import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { BlogView } from "@/features/admin/components/blog/blog-view";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Blog" };

export default function AdminBlogPage() {
  return (
    <>
      <PageHeader
        title="Blog"
        action={
          <Link
            href="/admin/blog/new"
            className={cn(buttonVariants(), "w-fit")}
          >
            <HugeiconsIcon
              icon={PlusSignIcon}
              strokeWidth={2}
              data-icon="inline-start"
            />
            New post
          </Link>
        }
      />
      <BlogView />
    </>
  );
}
