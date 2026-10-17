"use client";

import { ImageAdd01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRef } from "react";
import { PhotoRemoveButton } from "@/features/dashboard/components/photo-remove-button";

export type Photo = { id: string; url: string; name: string };

let photoSeq = 0;

function toPhotos(files: File[]): Photo[] {
  return files
    .filter((f) => f.type.startsWith("image/"))
    .map((f) => ({
      id: `photo-${++photoSeq}`,
      url: URL.createObjectURL(f),
      name: f.name,
    }));
}

/** Square thumbnails with a tile at the end that opens the file picker. */
export function PhotoUploader({
  id,
  photos,
  onAdd,
  onRemove,
  label = "Upload photos",
}: {
  id: string;
  photos: Photo[];
  onAdd: (photos: Photo[]) => void;
  onRemove: (photo: Photo) => void;
  label?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  return (
    <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
      {photos.map((p) => (
        <div
          key={p.id}
          className="relative aspect-square overflow-hidden rounded-xl bg-muted"
        >
          {/* biome-ignore lint/performance/noImgElement: local blob preview. */}
          <img src={p.url} alt={p.name} className="size-full object-cover" />
          <PhotoRemoveButton
            label={`Remove ${p.name}`}
            onClick={() => onRemove(p)}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => input.current?.click()}
        className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl bg-muted/70 px-2 text-center text-xs font-medium outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <HugeiconsIcon
          icon={ImageAdd01Icon}
          strokeWidth={2}
          className="size-5"
        />
        {label}
      </button>
      <input
        ref={input}
        id={id}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          // Copy first: clearing the input empties the live FileList.
          const files = Array.from(e.target.files ?? []);
          if (files.length) onAdd(toPhotos(files));
          e.target.value = "";
        }}
      />
    </div>
  );
}
