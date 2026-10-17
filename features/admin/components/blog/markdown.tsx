import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/*
 * A deliberately small Markdown renderer for the post editor preview.
 * It builds React elements (never HTML strings), so anything a writer types,
 * including <script>, is rendered as plain text by React.
 */

type MdBlock =
  | { type: "h"; level: 2 | 3; text: string }
  | { type: "p"; text: string }
  | { type: "ul" | "ol"; items: string[] }
  | { type: "quote"; text: string };

const listItem = { ul: /^\s*[-*+]\s+(.*)$/, ol: /^\s*\d+[.)]\s+(.*)$/ };

function parseBlocks(source: string): MdBlock[] {
  const lines = source.replace(/\r\n?/g, "\n").split("\n");
  const blocks: MdBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === "") {
      i++;
      continue;
    }

    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading) {
      // One H1 per page (the post title), so # and ## both become section headings.
      blocks.push({
        type: "h",
        level: heading[1].length <= 2 ? 2 : 3,
        text: heading[2].trim(),
      });
      i++;
      continue;
    }

    if (/^\s*>/.test(line)) {
      const quoted: string[] = [];
      while (i < lines.length && /^\s*>/.test(lines[i])) {
        quoted.push(lines[i].replace(/^\s*>\s?/, ""));
        i++;
      }
      blocks.push({ type: "quote", text: quoted.join(" ").trim() });
      continue;
    }

    const kind = listItem.ul.test(line)
      ? "ul"
      : listItem.ol.test(line)
        ? "ol"
        : null;
    if (kind) {
      const items: string[] = [];
      let match = listItem[kind].exec(lines[i] ?? "");
      while (i < lines.length && match) {
        items.push(match[1].trim());
        i++;
        match = listItem[kind].exec(lines[i] ?? "");
      }
      blocks.push({ type: kind, items });
      continue;
    }

    const paragraph: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^(#{1,6})\s|^\s*>|^\s*[-*+]\s|^\s*\d+[.)]\s/.test(lines[i])
    ) {
      paragraph.push(lines[i].trim());
      i++;
    }
    blocks.push({ type: "p", text: paragraph.join(" ") });
  }

  return blocks;
}

/** Only links that can't run script: web, mail, site-relative and in-page. */
function safeHref(href: string) {
  const url = href.trim();
  if (/^(https?:|mailto:)/i.test(url)) return url;
  if (/^[/#]/.test(url) && !url.startsWith("//")) return url;
  return null;
}

const inlinePattern =
  /\*\*(.+?)\*\*|__(.+?)__|\*(.+?)\*|_(.+?)_|\[([^\]]+)\]\(([^)\s]+)\)/;

function renderInline(text: string, key = "i"): ReactNode[] {
  const out: ReactNode[] = [];
  let rest = text;
  let n = 0;

  while (rest) {
    const match = inlinePattern.exec(rest);
    if (!match) {
      out.push(rest);
      break;
    }
    if (match.index > 0) out.push(rest.slice(0, match.index));
    const k = `${key}-${n++}`;
    const [whole, bold1, bold2, em1, em2, linkText, linkHref] = match;

    if (bold1 ?? bold2) {
      out.push(
        <strong key={k} className="font-semibold text-foreground">
          {renderInline(bold1 ?? bold2, k)}
        </strong>,
      );
    } else if (em1 ?? em2) {
      out.push(<em key={k}>{renderInline(em1 ?? em2, k)}</em>);
    } else {
      const href = safeHref(linkHref);
      out.push(
        href ? (
          <a
            key={k}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-foreground underline underline-offset-4"
          >
            {renderInline(linkText, k)}
          </a>
        ) : (
          <span key={k}>{renderInline(linkText, k)}</span>
        ),
      );
    }
    rest = rest.slice(match.index + whole.length);
  }

  return out;
}

/** Styled to match the public article body (components/blog/post-body.tsx). */
export function MarkdownPreview({
  source,
  className,
}: {
  source: string;
  className?: string;
}) {
  const blocks = parseBlocks(source);

  if (blocks.length === 0) {
    return (
      <p className={cn("text-muted-foreground", className)}>
        Nothing to preview yet.
      </p>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-5 text-[17px] leading-relaxed text-foreground/80",
        className,
      )}
    >
      {blocks.map((block, i) => {
        const key = `b${i}`;
        switch (block.type) {
          case "h":
            return block.level === 2 ? (
              <h2
                key={key}
                className="pt-6 text-2xl font-semibold tracking-tight text-foreground first:pt-0"
              >
                {renderInline(block.text, key)}
              </h2>
            ) : (
              <h3
                key={key}
                className="pt-3 text-xl font-semibold tracking-tight text-foreground first:pt-0"
              >
                {renderInline(block.text, key)}
              </h3>
            );
          case "p":
            return (
              <p key={key} className="text-pretty">
                {renderInline(block.text, key)}
              </p>
            );
          case "ul":
          case "ol": {
            const List = block.type;
            return (
              <List
                key={key}
                className={cn(
                  "flex flex-col gap-2 pl-5",
                  block.type === "ul"
                    ? "list-disc marker:text-foreground/40"
                    : "list-decimal marker:font-medium marker:text-foreground/60",
                )}
              >
                {block.items.map((item, j) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: list items are positional.
                  <li key={j} className="pl-1">
                    {renderInline(item, `${key}-${j}`)}
                  </li>
                ))}
              </List>
            );
          }
          case "quote":
            return (
              <blockquote
                key={key}
                className="rounded-2xl bg-muted/60 p-5 text-pretty"
              >
                {renderInline(block.text, key)}
              </blockquote>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
