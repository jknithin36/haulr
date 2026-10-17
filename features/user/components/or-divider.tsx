import { Separator } from "@/components/ui/separator";

export function OrDivider() {
  return (
    <div className="flex items-center gap-3 text-sm text-muted-foreground">
      <Separator className="flex-1" />
      <span>or</span>
      <Separator className="flex-1" />
    </div>
  );
}
