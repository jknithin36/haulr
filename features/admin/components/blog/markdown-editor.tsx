"use client";

import {
  Heading02Icon,
  LeftToRightListBulletIcon,
  Link01Icon,
  QuoteDownIcon,
  TextBoldIcon,
  TextItalicIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useLayoutEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MarkdownPreview } from "@/features/admin/components/blog/markdown";
import { formatNumber } from "@/lib/format";

type Edit = { text: string; start: number; end: number };

/** Wrap the selection in markers, or insert a placeholder when nothing is selected. */
function wrap(
  value: string,
  start: number,
  end: number,
  before: string,
  after: string,
  placeholder: string,
): Edit {
  const selected = value.slice(start, end) || placeholder;
  const text =
    value.slice(0, start) + before + selected + after + value.slice(end);
  const from = start + before.length;
  return { text, start: from, end: from + selected.length };
}

/** Add a prefix to every line touched by the selection ("## ", "- ", "> "). */
function prefixLines(
  value: string,
  start: number,
  end: number,
  prefix: string,
  strip: RegExp,
): Edit {
  const lineStart = value.lastIndexOf("\n", start - 1) + 1;
  const nextBreak = value.indexOf("\n", end);
  const lineEnd = nextBreak === -1 ? value.length : nextBreak;
  const lines = value.slice(lineStart, lineEnd).split("\n");
  const allPrefixed = lines.every((l) => l.startsWith(prefix));
  const changed = lines
    .map((l) =>
      allPrefixed ? l.slice(prefix.length) : prefix + l.replace(strip, ""),
    )
    .join("\n");
  const text = value.slice(0, lineStart) + changed + value.slice(lineEnd);
  // Collapse to the end of the edited lines so typing continues the line.
  const caret = lineStart + changed.length;
  return { text, start: caret, end: caret };
}

const blockPrefix = /^(#{1,6}\s+|[-*+]\s+|>\s?|\d+[.)]\s+)/;

const tools: {
  label: string;
  shortcut?: string;
  icon: typeof TextBoldIcon;
  apply: (v: string, s: number, e: number) => Edit;
}[] = [
  {
    label: "Bold",
    shortcut: "⌘B",
    icon: TextBoldIcon,
    apply: (v, s, e) => wrap(v, s, e, "**", "**", "bold text"),
  },
  {
    label: "Italic",
    shortcut: "⌘I",
    icon: TextItalicIcon,
    apply: (v, s, e) => wrap(v, s, e, "_", "_", "italic text"),
  },
  {
    label: "Heading",
    icon: Heading02Icon,
    apply: (v, s, e) => prefixLines(v, s, e, "## ", blockPrefix),
  },
  {
    label: "List",
    icon: LeftToRightListBulletIcon,
    apply: (v, s, e) => prefixLines(v, s, e, "- ", blockPrefix),
  },
  {
    label: "Link",
    shortcut: "⌘K",
    icon: Link01Icon,
    apply: (v, s, e) => {
      const edit = wrap(v, s, e, "[", "](https://)", "link text");
      // Leave the cursor on the URL so it can be typed straight away.
      const url = edit.end + 2;
      return { ...edit, start: url, end: url + "https://".length };
    },
  },
  {
    label: "Quote",
    icon: QuoteDownIcon,
    apply: (v, s, e) => prefixLines(v, s, e, "> ", blockPrefix),
  },
];

export function MarkdownEditor({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [mode, setMode] = useState<"write" | "preview">("write");
  const pendingSelection = useRef<[number, number] | null>(null);

  // Restore focus and selection right after a toolbar edit is committed.
  // biome-ignore lint/correctness/useExhaustiveDependencies: runs after each value change.
  useLayoutEffect(() => {
    const el = ref.current;
    const range = pendingSelection.current;
    if (!el || !range) return;
    pendingSelection.current = null;
    el.focus();
    el.setSelectionRange(range[0], range[1]);
  }, [value]);

  function run(tool: (typeof tools)[number]) {
    const el = ref.current;
    if (!el) return;
    const edit = tool.apply(value, el.selectionStart, el.selectionEnd);
    pendingSelection.current = [edit.start, edit.end];
    onChange(edit.text);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (!(event.metaKey || event.ctrlKey)) return;
    const key = event.key.toLowerCase();
    const tool =
      key === "b"
        ? tools[0]
        : key === "i"
          ? tools[1]
          : key === "k"
            ? tools[4]
            : null;
    if (tool) {
      event.preventDefault();
      run(tool);
    }
  }

  const words = value.trim() ? value.trim().split(/\s+/).length : 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Tabs value={mode} onValueChange={(v) => setMode(v as typeof mode)}>
          <TabsList
            aria-label="Editor mode"
            className="bg-background group-data-horizontal/tabs:h-9"
          >
            <TabsTrigger
              value="write"
              className="px-3 data-active:bg-muted data-active:shadow-none"
            >
              Write
            </TabsTrigger>
            <TabsTrigger
              value="preview"
              className="px-3 data-active:bg-muted data-active:shadow-none"
            >
              Preview
            </TabsTrigger>
          </TabsList>
        </Tabs>
        {mode === "write" && (
          <div
            role="toolbar"
            aria-label="Formatting"
            className="flex items-center gap-0.5 rounded-lg bg-background p-[3px]"
          >
            {tools.map((tool) => (
              <Tooltip key={tool.label}>
                <TooltipTrigger
                  render={
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={tool.label}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => run(tool)}
                    />
                  }
                >
                  <HugeiconsIcon icon={tool.icon} strokeWidth={2} />
                </TooltipTrigger>
                <TooltipContent>
                  {tool.label}
                  {tool.shortcut && (
                    <span className="ml-1.5 opacity-60">{tool.shortcut}</span>
                  )}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        )}
      </div>

      {mode === "write" ? (
        <Textarea
          ref={ref}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={
            "Start writing…\n\n## A section heading\n\nUse **bold**, _italic_, lists and [links](https://haulr.com)."
          }
          spellCheck
          className="min-h-[420px] resize-y bg-background p-4 font-mono text-sm leading-relaxed md:text-sm dark:bg-background"
        />
      ) : (
        <div className="min-h-[420px] rounded-lg bg-background p-5 md:p-8">
          <MarkdownPreview source={value} className="max-w-2xl" />
        </div>
      )}

      <p className="text-xs text-muted-foreground tabular-nums">
        Markdown · {formatNumber(words)} {words === 1 ? "word" : "words"} ·
        about {Math.max(1, Math.round(words / 230))} min read
      </p>
    </div>
  );
}
