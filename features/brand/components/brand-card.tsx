"use client";

import { Download04Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/ui/logo";
import {
  type BrandAsset,
  brandInk,
  lockup,
} from "@/lib/demo-data/brand-assets";
import { formatNumber } from "@/lib/format";

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/** Draws the asset at full size and downloads it as a PNG. */
async function exportPng(asset: BrandAsset, fontFamily: string) {
  const { width, height, mark } = asset;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const fontSize = mark * lockup.fontSize;
  const font = `600 ${fontSize}px ${fontFamily}`;
  await document.fonts.load(font);
  const logo = await loadImage("/logo.svg");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  ctx.font = font;
  ctx.letterSpacing = `${fontSize * lockup.letterSpacing}px`;
  ctx.fillStyle = brandInk;
  ctx.textBaseline = "middle";

  const markWidth = mark * lockup.markRatio;
  const gap = mark * lockup.gap;
  const textWidth = ctx.measureText("Haulr").width;
  const left = (width - (markWidth + gap + textWidth)) / 2;

  ctx.drawImage(logo, left, (height - mark) / 2, markWidth, mark);
  // Nudge the wordmark down a touch so it centers optically on the mark.
  ctx.fillText("Haulr", left + markWidth + gap, height / 2 + fontSize * 0.04);

  const link = document.createElement("a");
  link.download = `haulr-${asset.id}-${width}x${height}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

export function BrandCard({ asset }: { asset: BrandAsset }) {
  const wordmark = useRef<HTMLSpanElement>(null);
  const [busy, setBusy] = useState(false);
  // Preview sizes are a share of the frame width, so it matches the export exactly.
  const unit = (px: number) => `${(px / asset.width) * 100}cqw`;

  return (
    <article className="flex flex-col gap-4 rounded-2xl bg-muted/50 p-4">
      <div
        className="@container relative overflow-hidden rounded-xl bg-white shadow-xs"
        style={{ aspectRatio: `${asset.width} / ${asset.height}` }}
      >
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ gap: unit(asset.mark * lockup.gap), color: brandInk }}
        >
          <span className="flex" style={{ height: unit(asset.mark) }}>
            <LogoMark className="h-full" />
          </span>
          <span
            ref={wordmark}
            className="font-heading leading-none font-semibold"
            style={{
              fontSize: unit(asset.mark * lockup.fontSize),
              letterSpacing: `${lockup.letterSpacing}em`,
            }}
          >
            Haulr
          </span>
        </div>
      </div>

      <div className="flex items-end justify-between gap-3 px-1">
        <div className="flex flex-col gap-0.5">
          <h2 className="font-semibold">{asset.title}</h2>
          <p className="text-sm text-muted-foreground">
            {formatNumber(asset.width)} × {formatNumber(asset.height)} ·{" "}
            {asset.description}
          </p>
        </div>
        <Button
          variant="outline"
          size="lg"
          disabled={busy}
          className="shrink-0 bg-background"
          onClick={async () => {
            if (!wordmark.current) return;
            setBusy(true);
            try {
              await exportPng(
                asset,
                getComputedStyle(wordmark.current).fontFamily,
              );
            } finally {
              setBusy(false);
            }
          }}
        >
          <HugeiconsIcon icon={Download04Icon} strokeWidth={2} />
          PNG
        </Button>
      </div>
    </article>
  );
}
