import { KpiCard } from "@/components/ui/kpi-card";
import { dataPeriod } from "@/lib/demo-data/admin/admin-user";
import { overviewKpis } from "@/lib/demo-data/admin/overview";

/** The month's headline numbers, each compared with the same days last month. */
export function OverviewKpis() {
  return (
    <>
      <p className="text-sm text-muted-foreground">
        {dataPeriod.label} · {dataPeriod.range}, compared with the same days
        last month
      </p>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {overviewKpis.map((kpi) => (
          <KpiCard
            key={kpi.label}
            label={kpi.label}
            value={
              kpi.suffix ? (
                <>
                  {kpi.value}{" "}
                  <span className="whitespace-nowrap font-normal font-sans text-muted-foreground text-sm tracking-normal">
                    {kpi.suffix}
                  </span>
                </>
              ) : (
                kpi.value
              )
            }
            change={kpi.change}
            direction={kpi.direction}
            goodWhen={kpi.goodWhen}
          />
        ))}
      </div>
    </>
  );
}
