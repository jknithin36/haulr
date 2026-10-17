import { cn } from "@/lib/utils";

/** Small h2 with optional supporting line, used above dashboard sections. */
export function SectionHeading({
  title,
  description,
}: {
  title: string;
  description?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <h2 className="font-medium text-base">{title}</h2>
      {description && (
        <p className="text-pretty text-sm text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}

/** Heading for a group of settings, sitting above its Panel. */
export function SettingsSection({
  title,
  description,
  className,
  children,
}: {
  title: string;
  description?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("flex flex-col gap-4", className)}>
      <SectionHeading title={title} description={description} />
      {children}
    </section>
  );
}

/** One label/value line inside a settings Panel, with an optional action on the right. */
export function SettingsRow({
  label,
  value,
  action,
  className,
}: {
  label: React.ReactNode;
  value?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-x-4 gap-y-3 py-4 first:pt-0 last:pb-0",
        className,
      )}
    >
      <div className="flex min-w-0 flex-col gap-0.5">
        <div className="font-medium">{label}</div>
        {value && <div className="text-sm text-muted-foreground">{value}</div>}
      </div>
      {action}
    </div>
  );
}
