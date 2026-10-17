"use client";

import { SentIcon, Shield01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { GradientAvatar } from "@/components/ui/gradient-avatar";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  Message,
  MessageContent,
  MessageFooter,
} from "@/components/ui/message";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller";
import { firstName } from "@/lib/format";

type ChatMessage = { id: string; mine: boolean; text: string; time: string };

const timeFormat = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
});

/**
 * "Message <name>" button that opens a chat with that person. Messages are
 * local to this dialog for now (there's no backend yet).
 */
export function MessageDialog({
  name,
  context,
  suggestions = [],
  trigger,
}: {
  name: string;
  /** What the conversation is about, e.g. the trip or shipment. */
  context: string;
  /** Quick openers shown while the chat is empty. */
  suggestions?: string[];
  /** The button that opens the dialog (rendered via `render`). */
  trigger: React.ReactElement;
}) {
  const first = firstName(name);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");

  const send = (text: string) => {
    const body = text.trim();
    if (!body) return;
    setMessages((prev) => [
      ...prev,
      {
        id: `m${prev.length}-${Date.now()}`,
        mine: true,
        text: body,
        time: timeFormat.format(new Date()),
      },
    ]);
    setDraft("");
  };

  return (
    <Dialog>
      <DialogTrigger render={trigger}>Message {first}</DialogTrigger>
      <DialogContent className="flex h-[min(640px,calc(100dvh-2rem))] flex-col gap-0 p-0 sm:max-w-lg">
        <DialogHeader className="flex-row items-center gap-3 px-5 pt-5 pb-4">
          <GradientAvatar seed={name} className="size-10" />
          <div className="min-w-0">
            <DialogTitle>{name}</DialogTitle>
            <DialogDescription className="truncate">
              {context}
            </DialogDescription>
          </div>
        </DialogHeader>

        <MessageScrollerProvider autoScroll>
          <MessageScroller className="flex-1 bg-muted/40">
            <MessageScrollerViewport aria-label={`Conversation with ${name}`}>
              <MessageScrollerContent className="gap-3 px-5 py-4">
                <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
                  <HugeiconsIcon
                    icon={Shield01Icon}
                    strokeWidth={2}
                    className="size-3.5"
                  />
                  Keep payments on Haulr. Never pay outside the app.
                </p>

                {messages.length === 0 ? (
                  <div className="flex flex-1 flex-col items-center justify-center gap-4 py-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      Say hi to {first}. Ask about timing, space, or pickup.
                    </p>
                    {suggestions.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-2">
                        {suggestions.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => send(s)}
                            className="rounded-full bg-background px-3 py-1.5 text-sm shadow-xs transition-colors hover:bg-muted"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  messages.map((m) => (
                    <MessageScrollerItem key={m.id} messageId={m.id}>
                      <Message align={m.mine ? "end" : "start"}>
                        <MessageContent>
                          <Bubble variant={m.mine ? "default" : "outline"}>
                            <BubbleContent>{m.text}</BubbleContent>
                          </Bubble>
                          <MessageFooter>{m.time}</MessageFooter>
                        </MessageContent>
                      </Message>
                    </MessageScrollerItem>
                  ))
                )}
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <MessageScrollerButton />
          </MessageScroller>
        </MessageScrollerProvider>

        <form
          className="p-4"
          onSubmit={(e) => {
            e.preventDefault();
            send(draft);
          }}
        >
          <InputGroup>
            <InputGroupTextarea
              aria-label={`Message ${first}`}
              placeholder={`Write a message to ${first}…`}
              value={draft}
              rows={1}
              className="max-h-32 min-h-10"
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(draft);
                }
              }}
            />
            <InputGroupAddon align="block-end" className="justify-end">
              <InputGroupButton
                type="submit"
                variant="default"
                size="sm"
                disabled={!draft.trim()}
              >
                Send
                <HugeiconsIcon icon={SentIcon} strokeWidth={2} />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
