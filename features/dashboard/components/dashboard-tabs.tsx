import { TabsList } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

/** Tab row used across the dashboard: a little shorter than the default. */
export function DashboardTabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsList>) {
  return (
    <TabsList
      className={cn("group-data-horizontal/tabs:h-9", className)}
      {...props}
    />
  );
}
