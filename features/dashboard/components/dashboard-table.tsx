import { TableHead } from "@/components/ui/table";
import { cn } from "@/lib/utils";

/** Column header in the light weight the dashboard's open tables use. */
export function MutedTableHead({
  className,
  ...props
}: React.ComponentProps<typeof TableHead>) {
  return (
    <TableHead
      className={cn("font-normal text-muted-foreground", className)}
      {...props}
    />
  );
}

/*
 * Tables that sit on a soft card (payments, billing history) share a frame,
 * a smaller header row, and quieter row borders.
 */
export const tableCardClassName = "rounded-2xl bg-muted/50 px-2 py-1";
export const tableCardHeadClassName =
  "h-11 text-xs font-medium text-muted-foreground";
export const tableCardRowClassName = "border-border/60 hover:bg-transparent";
