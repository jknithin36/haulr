import { KpiCard } from "@/components/ui/kpi-card";
import { dataPeriod } from "@/lib/demo-data/admin/admin-user";
import { revenueSummary } from "@/lib/demo-data/admin/revenue";

/** Revenue totals for the period, each compared with the same days last month. */
export function RevenueSummary() {
  return (
    <>
      <p className="text-sm text-muted-foreground">
        {dataPeriod.label} · {dataPeriod.range}, compared with the same days
        last month
      </p>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {revenueSummary.map((item) => (
          <KpiCard
            key={item.label}
            label={item.detail ? `${item.label} (${item.detail})` : item.label}
            value={item.value}
            change={item.change}
          />
        ))}
      </div>
    </>
  );
}
