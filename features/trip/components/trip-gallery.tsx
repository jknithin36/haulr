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
import { cn } from "@/lib/utils";

const COUNT = 5;

/** Vehicle photos. Drivers haven't uploaded any yet, so tiles are placeholders. */
export function TripGallery({ title }: { title: string }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const go = (step: number) => setIndex((i) => (i + step + COUNT) % COUNT);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % COUNT);
      if (e.key === "ArrowLeft") setIndex((i) => (i + COUNT - 1) % COUNT);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const tile = (i: number, className?: string) => (
    <button
      key={i}
      type="button"
      onClick={() => {
        setIndex(i);
        setOpen(true);
      }}
      aria-label={`Open photo ${i + 1} of ${COUNT}`}
      className={cn(
        "flex items-center justify-center bg-muted/60 text-muted-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
    >
      <HugeiconsIcon icon={Image01Icon} strokeWidth={1.5} className="size-6" />
    </button>
  );

  return (
    <>
      <div className="grid h-72 grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-2xl md:h-[420px]">
        {tile(0, "col-span-4 row-span-2 md:col-span-2")}
        {tile(1, "max-md:hidden")}
        {tile(2, "max-md:hidden")}
        {tile(3, "max-md:hidden")}
        {tile(4, "max-md:hidden")}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex h-dvh w-screen max-w-none flex-col rounded-none bg-black p-0 text-white ring-0 sm:max-w-none">
          <DialogTitle className="sr-only">Photos of {title}</DialogTitle>
          <div className="relative flex flex-1 items-center justify-center p-6 md:p-16">
            <div className="flex aspect-4/3 w-full max-w-3xl flex-col items-center justify-center gap-3 rounded-2xl bg-white/5 text-white/50">
              <HugeiconsIcon
                icon={Image01Icon}
                strokeWidth={1.5}
                className="size-10"
              />
              <p className="text-sm">No photo uploaded yet</p>
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
            {index + 1} / {COUNT}
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
