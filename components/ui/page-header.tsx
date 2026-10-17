/** Title row shared by every dashboard page: heading, subtext, and an optional action. */
export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-balance text-2xl font-semibold tracking-tight md:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="text-pretty text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
