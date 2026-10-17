/** Small tooltip card shared by the admin charts. */
export function ChartTip({
  title,
  value,
  note,
}: {
  title: React.ReactNode;
  value: React.ReactNode;
  note?: React.ReactNode;
}) {
  return (
    <div className="grid gap-0.5 rounded-lg bg-popover px-3 py-2 text-xs text-popover-foreground shadow-lg ring-1 ring-foreground/10">
      <span className="text-muted-foreground">{title}</span>
      <span className="font-medium text-sm tabular-nums">{value}</span>
      {note && <span className="text-muted-foreground">{note}</span>}
    </div>
  );
}
