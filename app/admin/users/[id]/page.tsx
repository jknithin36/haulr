import type { Metadata } from "next";
import { Suspense } from "react";
import { getAdminUser, getAdminUserIds } from "@/features/admin/admin-queries";
import {
  UserDetail,
  UserDetailSkeleton,
} from "@/features/admin/components/users/user-detail";

export async function generateStaticParams() {
  const ids = await getAdminUserIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/admin/users/[id]">): Promise<Metadata> {
  const { id } = await params;
  const user = await getAdminUser(id);
  return { title: user.name };
}

export default function AdminUserPage({
  params,
}: PageProps<"/admin/users/[id]">) {
  return (
    <Suspense fallback={<UserDetailSkeleton />}>
      {params.then(({ id }) => (
        <UserDetail id={id} />
      ))}
    </Suspense>
  );
}
