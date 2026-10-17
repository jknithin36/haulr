import { NotificationsViewClient } from "@/features/dashboard/components/notifications/notifications-view-client";
import { getNotifications } from "@/features/dashboard/dashboard-queries";

export async function NotificationsView() {
  const notifications = await getNotifications();
  return <NotificationsViewClient initialNotifications={notifications} />;
}
