import type { Metadata } from "next";
import { UsersView } from "@/features/admin/components/users/users-view";

export const metadata: Metadata = { title: "Users" };

export default function AdminUsersPage() {
  return <UsersView />;
}
