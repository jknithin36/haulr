"use client";

import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { GradientAvatar } from "@/components/ui/gradient-avatar";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import type { Conversation } from "@/lib/demo-data/dashboard/messages";
import { cn } from "@/lib/utils";

export function ConversationList({
  conversations,
  activeId,
  query,
  onQueryChange,
  onSelect,
}: {
  conversations: Conversation[];
  activeId: string | null;
  query: string;
  onQueryChange: (value: string) => void;
  onSelect: (id: string) => void;
}) {
  const q = query.trim().toLowerCase();
  const visible = q
    ? conversations.filter((c) =>
        `${c.person} ${c.ref} ${c.item}`.toLowerCase().includes(q),
      )
    : conversations;

  return (
    <div className="flex min-h-0 flex-col gap-3">
      <InputGroup className="h-9 rounded-xl border-0 bg-muted/60 dark:bg-muted/60">
        <InputGroupAddon>
          <HugeiconsIcon icon={Search01Icon} strokeWidth={2} />
        </InputGroupAddon>
        <InputGroupInput
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search messages"
          aria-label="Search conversations"
        />
      </InputGroup>

      <ul className="-mx-1 flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto overscroll-contain px-1 pb-1">
        {visible.map((c) => {
          const last = c.messages.at(-1);
          const active = c.id === activeId;
          return (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => onSelect(c.id)}
                aria-current={active ? "true" : undefined}
                className={cn(
                  "flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors outline-none hover:bg-muted/60 focus-visible:ring-3 focus-visible:ring-ring/50",
                  active && "md:bg-muted md:hover:bg-muted",
                )}
              >
                <GradientAvatar seed={c.person} className="mt-0.5 size-10" />
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="flex items-baseline justify-between gap-2">
                    <span
                      className={cn(
                        "truncate text-sm font-medium",
                        c.unread > 0 && "font-semibold",
                      )}
                    >
                      {c.person}
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                      {c.lastTime}
                    </span>
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {c.ref} · {c.item}
                  </span>
                  <span className="flex items-center justify-between gap-2">
                    <span
                      className={cn(
                        "truncate text-sm text-muted-foreground",
                        c.unread > 0 && "text-foreground",
                      )}
                    >
                      {last?.from === "me" && "You: "}
                      {last?.text ?? last?.attachment}
                    </span>
                    {c.unread > 0 && (
                      <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-foreground px-1.5 text-[11px] font-medium text-background tabular-nums">
                        <span className="sr-only">Unread: </span>
                        {c.unread}
                      </span>
                    )}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
        {visible.length === 0 && (
          <li className="px-3 py-8 text-center text-sm text-muted-foreground">
            No conversations match “{query.trim()}”.
          </li>
        )}
      </ul>
    </div>
  );
}
