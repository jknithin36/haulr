import { getAdminUser } from "@/features/admin/admin-queries";
import { UserDetailClient } from "@/features/admin/components/users/user-detail-client";

export async function UserDetail({ id }: { id: string }) {
  const user = await getAdminUser(id);
  return <UserDetailClient user={user} />;
}

export function UserDetailSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-6">
      <div className="h-9 w-56 rounded bg-muted" />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {["a", "b", "c", "d", "e", "f"].map((k) => (
            <div key={k} className="h-24 rounded-2xl bg-muted/60" />
          ))}
        </div>
        <div className="h-72 rounded-2xl bg-muted/60" />
      </div>
    </div>
  );
}
