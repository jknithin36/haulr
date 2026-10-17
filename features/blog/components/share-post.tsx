"use client";

import { Link01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function SharePost({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const shareTo = (base: string, params: Record<string, string>) => {
    const url = `${base}?${new URLSearchParams(params)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <p className="mr-1 text-sm font-medium">Share</p>
      <Button
        variant="outline"
        onClick={async () => {
          await navigator.clipboard.writeText(window.location.href);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
      >
        <HugeiconsIcon
          icon={copied ? Tick02Icon : Link01Icon}
          strokeWidth={2}
        />
        {copied ? "Copied" : "Copy link"}
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          shareTo("https://x.com/intent/post", {
            text: title,
            url: window.location.href,
          })
        }
      >
        X
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          shareTo("https://www.linkedin.com/sharing/share-offsite/", {
            url: window.location.href,
          })
        }
      >
        LinkedIn
      </Button>
    </div>
  );
}
