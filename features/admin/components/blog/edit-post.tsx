import { getAdminPost } from "@/features/admin/admin-queries";
import { PostEditor } from "@/features/admin/components/blog/post-editor";

export async function EditPost({ id }: { id: string }) {
  const post = await getAdminPost(id);
  // Keyed so switching posts starts the editor from fresh state.
  return <PostEditor key={post.id} post={post} />;
}

export function EditPostSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-6">
      <div className="h-5 w-16 rounded bg-muted" />
      <div className="h-9 w-48 rounded bg-muted" />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="flex flex-col gap-8">
          <div className="h-56 rounded-2xl bg-muted/60" />
          <div className="h-[480px] rounded-2xl bg-muted/60" />
        </div>
        <div className="h-80 rounded-2xl bg-muted/60" />
      </div>
    </div>
  );
}
