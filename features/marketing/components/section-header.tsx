/** The h2 every home page section opens with. */
export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
      {children}
    </h2>
  );
}

/**
 * Section title with an optional intro line. `children` sits beside it on
 * wide screens (tabs, a rating) and below it on phones.
 */
export function SectionHeader({
  title,
  description,
  children,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="flex max-w-2xl flex-col gap-3">
        <SectionTitle>{title}</SectionTitle>
        {description && (
          <p className="text-pretty text-muted-foreground md:text-lg">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}
