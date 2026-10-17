import { BulbIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Block } from "@/lib/demo-data/blog-posts";

function renderBlock(block: Block, i: number) {
  switch (block.type) {
    case "p":
      return (
        <p key={i} className="text-pretty">
          {block.text}
        </p>
      );
    case "h2":
      return (
        <h2
          key={i}
          id={block.id}
          className="scroll-mt-24 pt-6 text-2xl font-semibold tracking-tight text-foreground"
        >
          {block.text}
        </h2>
      );
    case "ul":
      return (
        <ul
          key={i}
          className="flex list-disc flex-col gap-2 pl-5 marker:text-foreground/40"
        >
          {block.items.map((item) => (
            <li key={item} className="pl-1">
              {item}
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol
          key={i}
          className="flex list-decimal flex-col gap-2 pl-5 marker:font-medium marker:text-foreground/60"
        >
          {block.items.map((item) => (
            <li key={item} className="pl-1">
              {item}
            </li>
          ))}
        </ol>
      );
    case "tip":
      return (
        <aside key={i} className="flex gap-4 rounded-2xl bg-muted/60 p-5">
          <HugeiconsIcon
            icon={BulbIcon}
            strokeWidth={2}
            className="mt-0.5 size-5 shrink-0 text-foreground"
          />
          <div className="flex flex-col gap-1">
            <p className="font-semibold text-foreground">{block.title}</p>
            <p className="text-pretty">{block.text}</p>
          </div>
        </aside>
      );
  }
}

export function PostBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="flex flex-col gap-5 text-[17px] leading-relaxed text-foreground/80">
      {blocks.map(renderBlock)}
    </div>
  );
}
