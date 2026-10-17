"use client";

import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";

/** Type a tag and press Enter or comma; Backspace on an empty field removes the last one. */
export function TagInput({
  id,
  value,
  onChange,
}: {
  id?: string;
  value: string[];
  onChange: (tags: string[]) => void;
}) {
  const [draft, setDraft] = useState("");

  function add(raw: string) {
    const tag = raw.trim().toLowerCase().replace(/\s+/g, " ");
    if (tag && !value.includes(tag)) onChange([...value, tag]);
    setDraft("");
  }

  return (
    <div className="flex min-h-9 flex-wrap items-center gap-1.5 rounded-lg border border-input bg-background px-1.5 py-1.5 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
      {value.map((tag) => (
        <span
          key={tag}
          className="inline-flex h-6 items-center gap-1 rounded-full bg-muted pr-1 pl-2.5 text-xs font-medium"
        >
          {tag}
          <button
            type="button"
            onClick={() => onChange(value.filter((t) => t !== tag))}
            aria-label={`Remove ${tag}`}
            className="grid size-4 place-items-center rounded-full text-muted-foreground hover:bg-foreground/10 hover:text-foreground"
          >
            <HugeiconsIcon
              icon={Cancel01Icon}
              strokeWidth={2}
              className="size-3"
            />
          </button>
        </span>
      ))}
      <input
        id={id}
        value={draft}
        onChange={(e) => {
          const next = e.target.value;
          if (next.endsWith(",")) add(next.slice(0, -1));
          else setDraft(next);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            add(draft);
          } else if (e.key === "Backspace" && !draft && value.length > 0) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={() => draft && add(draft)}
        placeholder={value.length === 0 ? "Add a tag" : ""}
        className="h-6 w-16 min-w-0 flex-1 bg-transparent px-1 text-sm outline-none placeholder:text-muted-foreground"
      />
    </div>
  );
}
