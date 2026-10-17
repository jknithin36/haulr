import type { Metadata } from "next";
import { PostEditor } from "@/features/admin/components/blog/post-editor";

export const metadata: Metadata = { title: "New post" };

export default function NewPostPage() {
  return <PostEditor />;
}
