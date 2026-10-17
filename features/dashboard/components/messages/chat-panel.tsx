"use client";

import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Attachment01Icon,
  Cancel01Icon,
  SecurityCheckIcon,
  SentIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/data-display";
import { GradientAvatar } from "@/components/ui/gradient-avatar";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import type { Conversation } from "@/lib/demo-data/dashboard/messages";
import { cn } from "@/lib/utils";

export function ChatPanel({
  conversation,
  accountName,
  onBack,
  onSend,
}: {
  conversation: Conversation;
  accountName: string;
  onBack: () => void;
  onSend: (text: string, attachment?: string) => void;
}) {
  const [draft, setDraft] = useState("");
  const [file, setFile] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const textarea = useRef<HTMLTextAreaElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const count = conversation.messages.length;

  // Keep the newest message in view when switching threads or sending.
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-run on thread/length change.
  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTo({ top: el.scrollHeight });
  }, [conversation.id, count]);

  const canSend = draft.trim().length > 0 || file !== null;

  function send() {
    if (!canSend) return;
    onSend(draft.trim(), file ?? undefined);
    setDraft("");
    setFile(null);
    textarea.current?.focus();
  }

  const { context } = conversation;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex flex-col gap-3 pb-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="-ml-2 md:hidden"
            onClick={onBack}
            aria-label="Back to conversations"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
          </Button>
          <GradientAvatar seed={conversation.person} className="size-10" />
          <div className="flex min-w-0 flex-col">
            <p className="truncate font-medium">{conversation.person}</p>
            {!context && (
              <p className="truncate text-sm text-muted-foreground">
                {conversation.ref} · {conversation.item}
              </p>
            )}
          </div>
        </div>

        {context && (
          <div className="flex items-center gap-3 rounded-xl bg-muted/50 py-2 pr-2 pl-4 text-sm">
            <p className="min-w-0 flex-1 truncate">
              <span className="font-medium tabular-nums">
                {conversation.ref}
              </span>
              <span className="text-muted-foreground"> · {context.title}</span>
            </p>
            <StatusBadge tone="info">{context.status}</StatusBadge>
            <Link
              href={context.href}
              aria-label={context.linkLabel}
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "max-sm:size-7 max-sm:px-0",
              )}
            >
              <span className="max-sm:hidden">{context.linkLabel}</span>
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                strokeWidth={2}
                data-icon="inline-end"
              />
            </Link>
          </div>
        )}
      </div>

      <div
        ref={scroller}
        className="-mx-2 flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-2"
      >
        <p className="mx-auto flex max-w-md items-center gap-1.5 pt-4 pb-6 text-center text-xs text-pretty text-muted-foreground">
          <HugeiconsIcon
            icon={SecurityCheckIcon}
            strokeWidth={2}
            className="size-3.5 shrink-0"
          />
          Keep payments on Haulr. Never pay a driver outside the app.
        </p>
        <ol className="mt-auto flex flex-col gap-4 pb-4">
          <AnimatePresence initial={false}>
            {conversation.messages.map((m) => {
              const mine = m.from === "me";
              return (
                <motion.li
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className={cn(
                    "flex items-end gap-2",
                    mine && "flex-row-reverse",
                  )}
                >
                  <GradientAvatar
                    seed={mine ? accountName : conversation.person}
                    className="mb-5 size-7"
                  />
                  <div
                    className={cn(
                      "flex max-w-[78%] flex-col gap-1 sm:max-w-[70%]",
                      mine ? "items-end" : "items-start",
                    )}
                  >
                    {m.attachment && (
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-2xl px-3 py-2 text-sm",
                          mine
                            ? "bg-foreground text-background"
                            : "bg-muted text-foreground",
                        )}
                      >
                        <HugeiconsIcon
                          icon={Attachment01Icon}
                          strokeWidth={2}
                          className="size-4 shrink-0"
                        />
                        <span className="truncate">{m.attachment}</span>
                      </span>
                    )}
                    {m.text && (
                      <p
                        className={cn(
                          "rounded-2xl px-3.5 py-2 text-sm leading-relaxed whitespace-pre-wrap wrap-break-word",
                          mine
                            ? "rounded-br-md bg-foreground text-background"
                            : "rounded-bl-md bg-muted text-foreground",
                        )}
                      >
                        {m.text}
                      </p>
                    )}
                    <span className="px-1 text-[11px] text-muted-foreground tabular-nums">
                      {m.time}
                    </span>
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ol>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="pt-2"
      >
        <InputGroup className="rounded-2xl border-0 bg-muted/60 dark:bg-muted/60">
          {file && (
            <InputGroupAddon align="block-start">
              <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-background py-1 pr-1 pl-2.5 text-xs font-medium text-foreground">
                <HugeiconsIcon
                  icon={Attachment01Icon}
                  strokeWidth={2}
                  className="size-3.5 shrink-0"
                />
                <span className="truncate">{file}</span>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  aria-label={`Remove ${file}`}
                  className="flex size-5 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <HugeiconsIcon
                    icon={Cancel01Icon}
                    strokeWidth={2}
                    className="size-3"
                  />
                </button>
              </span>
            </InputGroupAddon>
          )}
          <InputGroupTextarea
            ref={textarea}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                !e.shiftKey &&
                !e.nativeEvent.isComposing
              ) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="Write a message…"
            aria-label={`Message ${conversation.person}`}
            rows={1}
            className="max-h-40 min-h-11 px-3.5 pt-3"
          />
          <InputGroupAddon align="block-end" className="justify-between">
            <input
              ref={fileInput}
              type="file"
              className="sr-only"
              tabIndex={-1}
              aria-hidden
              onChange={(e) => {
                const picked = e.target.files?.[0];
                if (picked) setFile(picked.name);
                e.target.value = "";
              }}
            />
            <InputGroupButton
              size="sm"
              className="text-muted-foreground"
              onClick={() => fileInput.current?.click()}
            >
              <HugeiconsIcon icon={Attachment01Icon} strokeWidth={2} />
              Attach
            </InputGroupButton>
            <InputGroupButton
              type="submit"
              variant="default"
              size="sm"
              disabled={!canSend}
            >
              Send
              <HugeiconsIcon icon={SentIcon} strokeWidth={2} />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </form>
    </div>
  );
}
