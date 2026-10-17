import { MessagesViewClient } from "@/features/dashboard/components/messages/messages-view-client";
import {
  getAccount,
  getConversations,
} from "@/features/dashboard/dashboard-queries";

export async function MessagesView() {
  const [conversations, account] = await Promise.all([
    getConversations(),
    getAccount(),
  ]);
  return (
    <MessagesViewClient
      initialConversations={conversations}
      accountName={account.name}
    />
  );
}
