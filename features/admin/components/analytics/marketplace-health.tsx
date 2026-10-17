import { StatCard } from "@/components/ui/data-display";
import { marketplaceHealth } from "@/lib/demo-data/admin/analytics";

export function MarketplaceHealth() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {marketplaceHealth.map((stat) => (
        <StatCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          hint={stat.hint}
        />
      ))}
    </div>
  );
}
