"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** "On this page" list that follows the section being read. */
export function TableOfContents({
  headings,
}: {
  headings: { id: string; text: string }[];
}) {
  const [active, setActive] = useState(headings[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-80px 0px -70% 0px" },
    );
    for (const h of headings) {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [headings]);

  return (
    <nav aria-label="On this page" className="flex flex-col gap-3 text-sm">
      <p className="font-medium">On this page</p>
      <ul className="flex flex-col gap-2">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              aria-current={active === h.id ? "location" : undefined}
              className={cn(
                "block text-muted-foreground transition-colors hover:text-foreground",
                active === h.id && "font-medium text-foreground",
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
