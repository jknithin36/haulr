"use client";

import { ImageAdd01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Image picker with a local preview. `src` is a blob URL owned by the parent. */
export function ImageField({
  id,
  src,
  onChange,
  label,
  hint,
  fallback,
  aspect = "aspect-[16/9]",
}: {
  id: string;
  src: string | null;
  onChange: (src: string | null) => void;
  label: string;
  hint?: string;
  /** Shown faded when no image is chosen (e.g. the cover, for the social image). */
  fallback?: string | null;
  aspect?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const shown = src ?? fallback ?? null;

  useEffect(() => {
    return () => {
      if (src) URL.revokeObjectURL(src);
    };
  }, [src]);

  function choose(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) onChange(URL.createObjectURL(file));
    event.target.value = "";
  }

  return (
    <div className="flex flex-col gap-3">
      <input
        ref={fileRef}
        id={id}
        type="file"
        accept="image/*"
        className="sr-only"
        tabIndex={-1}
        onChange={choose}
      />
      {shown ? (
        <div
          className={cn(
            "relative overflow-hidden rounded-xl bg-background",
            aspect,
          )}
        >
          {/* biome-ignore lint/performance/noImgElement: local preview of a chosen file (blob URL). */}
          <img src={shown} alt={label} className="size-full object-cover" />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className={cn(
            "flex flex-col items-center justify-center gap-2 rounded-xl bg-background text-sm text-muted-foreground transition-colors hover:text-foreground",
            aspect,
          )}
        >
          <HugeiconsIcon
            icon={ImageAdd01Icon}
            strokeWidth={2}
            className="size-5"
          />
          {label}
        </button>
      )}
      <div className="flex flex-wrap items-center gap-2">
        {shown && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="bg-background"
            onClick={() => fileRef.current?.click()}
          >
            {src ? "Replace" : "Choose image"}
          </Button>
        )}
        {src && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange(null)}
          >
            Remove
          </Button>
        )}
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
    </div>
  );
}
