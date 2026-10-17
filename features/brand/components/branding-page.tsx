import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { LogoMark } from "@/components/ui/logo";
import { BrandCard } from "@/features/brand/components/brand-card";
import { brandAssets } from "@/lib/demo-data/brand-assets";

export function BrandingPage() {
  const [post, ...wide] = brandAssets;

  return (
    <main className="flex min-h-svh flex-1 flex-col px-4">
      <header className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight"
        >
          <LogoMark />
          Haulr
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <HugeiconsIcon
            icon={ArrowLeft02Icon}
            strokeWidth={2}
            className="size-4"
          />
          Back to site
        </Link>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 pt-8 pb-16 md:pt-12 md:pb-24">
        <div className="flex max-w-2xl flex-col gap-3">
          <p className="text-sm font-medium text-muted-foreground">Branding</p>
          <h1 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Haulr brand images
          </h1>
          <p className="text-pretty text-muted-foreground md:text-lg">
            Ready-to-post images with our logo on a clean white background.
            Download each one at full size as a PNG.
          </p>
        </div>

        <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <BrandCard asset={post} />
          <div className="grid gap-4">
            {wide.map((asset) => (
              <BrandCard key={asset.id} asset={asset} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
