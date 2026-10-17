"use client";

import { Message01Icon } from "@hugeicons/core-free-icons";
import { MotionConfig } from "motion/react";
import { useEffect, useState } from "react";
import { EmptyState } from "@/components/ui/data-display";
import { ChatPanel } from "@/features/dashboard/components/messages/chat-panel";
import { ConversationList } from "@/features/dashboard/components/messages/conversation-list";
import type { Conversation } from "@/lib/demo-data/dashboard/messages";
import { cn } from "@/lib/utils";

function formatNow() {
  const time = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  return `Today, ${time}`;
}

export function MessagesViewClient({
  initialConversations,
  accountName,
}: {
  initialConversations: Conversation[];
  /** Seeds the avatar next to the user's own messages. */
  accountName: string;
}) {
  const [conversations, setConversations] = useState(initialConversations);
  const [activeId, setActiveId] = useState<string | null>(
    initialConversations[0]?.id ?? null,
  );
  // On small screens the list and the chat take turns.
  const [chatOpen, setChatOpen] = useState(false);
  const [query, setQuery] = useState("");

  function markRead(id: string) {
    setConversations((list) =>
      list.map((c) => (c.id === id && c.unread ? { ...c, unread: 0 } : c)),
    );
  }

  // On desktop the first thread is already open, so it counts as read.
  // biome-ignore lint/correctness/useExhaustiveDependencies: run once on mount.
  useEffect(() => {
    if (activeId && window.matchMedia("(min-width: 768px)").matches) {
      markRead(activeId);
    }
  }, []);

  function open(id: string) {
    setActiveId(id);
    setChatOpen(true);
    markRead(id);
  }

  function send(text: string, attachment?: string) {
    if (!activeId) return;
    const message = {
      id: `local-${Date.now()}`,
      from: "me" as const,
      text,
      attachment,
      time: formatNow(),
    };
    setConversations((list) =>
      list.map((c) =>
        c.id === activeId
          ? { ...c, lastTime: "Just now", messages: [...c.messages, message] }
          : c,
      ),
    );
  }

  if (conversations.length === 0) {
    return (
      <EmptyState
        icon={Message01Icon}
        title="No messages yet"
        description="Conversations with drivers and shippers will appear here."
      />
    );
  }

  const active = conversations.find((c) => c.id === activeId) ?? null;

  return (
    <MotionConfig reducedMotion="user">
      <div className="-mb-12 grid h-[calc(100svh-5.5rem)] min-h-[28rem] grid-cols-1 gap-6 md:-mb-14 md:h-[calc(100svh-8.5rem)] md:grid-cols-[18rem_1fr] lg:grid-cols-[20rem_1fr]">
        <section
          aria-label="Conversations"
          className={cn(
            "flex min-h-0 flex-col gap-4",
            chatOpen && "max-md:hidden",
          )}
        >
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Messages
          </h1>
          <ConversationList
            conversations={conversations}
            activeId={activeId}
            query={query}
            onQueryChange={setQuery}
            onSelect={open}
          />
        </section>

        <section
          aria-label={active ? `Chat with ${active.person}` : "Chat"}
          className={cn(
            "min-h-0 md:rounded-2xl md:bg-background",
            !chatOpen && "max-md:hidden",
          )}
        >
          {active && (
            <ChatPanel
              // A fresh panel per thread, so drafts never leak between threads.
              key={active.id}
              conversation={active}
              accountName={accountName}
              onBack={() => setChatOpen(false)}
              onSend={send}
            />
          )}
        </section>
      </div>
    </MotionConfig>
  );
}
