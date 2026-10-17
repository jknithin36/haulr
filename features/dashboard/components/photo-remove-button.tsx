import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";

/** Small round "x" pinned to the corner of an uploaded photo preview. */
export function PhotoRemoveButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="secondary"
      size="icon-xs"
      aria-label={label}
      onClick={onClick}
      className="absolute top-1.5 right-1.5 rounded-full bg-background/90 shadow-sm hover:bg-background"
    >
      <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
    </Button>
  );
}
