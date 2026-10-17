import type { Metadata } from "next";
import { Suspense } from "react";
import { getAdminPostIds } from "@/features/admin/admin-queries";
import {
  EditPost,
  EditPostSkeleton,
} from "@/features/admin/components/blog/edit-post";

export const metadata: Metadata = { title: "Edit post" };

export async function generateStaticParams() {
  const ids = await getAdminPostIds();
  return ids.map((id) => ({ id }));
}

export default function EditPostPage({
  params,
}: PageProps<"/admin/blog/[id]">) {
  return (
    <Suspense fallback={<EditPostSkeleton />}>
      {params.then(({ id }) => (
        <EditPost id={id} />
      ))}
    </Suspense>
  );
}
