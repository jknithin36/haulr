"use client";

import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Image01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

/** Pickup photo tiles plus a full-screen viewer, like the listing gallery. */
export function PickupPhotos({
  photos,
  item,
  takenAt,
}: {
  photos: string[];
  item: string;
  takenAt: string;
}) {
  const count = photos.length;
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const go = (step: number) => setIndex((i) => (i + step + count) % count);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % count);
      if (e.key === "ArrowLeft") setIndex((i) => (i + count - 1) % count);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, count]);

  return (
    <>
      <ul className="grid grid-cols-3 gap-2 md:grid-cols-6">
        {photos.map((caption, i) => (
          <li key={caption}>
            <button
              type="button"
              onClick={() => {
                setIndex(i);
                setOpen(true);
              }}
              aria-label={`Open ${caption.toLowerCase()} photo`}
              className="group flex w-full flex-col gap-1.5 rounded-xl text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <span className="flex aspect-4/3 w-full items-center justify-center rounded-xl bg-background text-muted-foreground transition-colors group-hover:text-foreground">
                <HugeiconsIcon
                  icon={Image01Icon}
                  strokeWidth={1.5}
                  className="size-6"
                />
              </span>
              <span className="px-0.5 text-xs text-muted-foreground">
                {caption}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex h-dvh w-screen max-w-none flex-col rounded-none bg-black p-0 text-white ring-0 sm:max-w-none">
          <DialogTitle className="sr-only">Pickup photos of {item}</DialogTitle>
          <div className="relative flex flex-1 items-center justify-center p-6 md:p-16">
            <div className="flex aspect-4/3 w-full max-w-3xl flex-col items-center justify-center gap-3 rounded-2xl bg-white/5 text-white/50">
              <HugeiconsIcon
                icon={Image01Icon}
                strokeWidth={1.5}
                className="size-10"
              />
              <p className="text-sm">{photos[index]}</p>
            </div>
            <Button
              variant="ghost"
              size="icon-lg"
              aria-label="Previous photo"
              onClick={() => go(-1)}
              className="absolute left-4 rounded-full text-white hover:bg-white/10 hover:text-white"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
            </Button>
            <Button
              variant="ghost"
              size="icon-lg"
              aria-label="Next photo"
              onClick={() => go(1)}
              className="absolute right-4 rounded-full text-white hover:bg-white/10 hover:text-white"
            >
              <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
            </Button>
          </div>
          <p className="pb-6 text-center text-sm text-white/60 tabular-nums">
            {photos[index]} · {takenAt} · {index + 1} / {count}
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
