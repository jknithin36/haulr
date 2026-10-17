"use client";

import { Add01Icon, TruckIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EmptyState, StatusBadge } from "@/components/ui/data-display";
import { PageHeader } from "@/components/ui/page-header";
import { AddVehicleSheet } from "@/features/dashboard/components/vehicles/add-vehicle-sheet";
import { kindIcon } from "@/features/dashboard/components/vehicles/vehicle-icons";
import type { Vehicle } from "@/lib/demo-data/dashboard/vehicles";

export function VehiclesViewClient({
  initialVehicles,
}: {
  initialVehicles: Vehicle[];
}) {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [adding, setAdding] = useState(false);

  const addButton = (
    <Button size="lg" className="w-fit px-3" onClick={() => setAdding(true)}>
      <HugeiconsIcon
        icon={Add01Icon}
        strokeWidth={2}
        data-icon="inline-start"
      />
      Add a vehicle
    </Button>
  );

  return (
    <MotionConfig reducedMotion="user">
      <PageHeader
        title="My vehicles"
        description="Add a vehicle to send offers and share space."
        action={addButton}
      />

      {vehicles.length === 0 ? (
        <EmptyState
          icon={TruckIcon}
          title="No vehicles yet"
          description="No vehicles yet. Add your first vehicle to start earning."
          action={
            <Button onClick={() => setAdding(true)}>Add a vehicle</Button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <AnimatePresence initial={false}>
            {vehicles.map((v) => (
              <motion.div
                key={v.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                <VehicleCard vehicle={v} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <AddVehicleSheet
        open={adding}
        onOpenChange={setAdding}
        onSave={(v) => setVehicles((prev) => [...prev, v])}
      />
    </MotionConfig>
  );
}

function VehicleCard({ vehicle: v }: { vehicle: Vehicle }) {
  return (
    <article className="flex h-full flex-col gap-5 rounded-2xl bg-muted/50 p-3 pb-5 text-sm">
      <div className="relative grid aspect-[5/2] place-items-center overflow-hidden rounded-xl bg-background/70">
        {v.photo ? (
          // biome-ignore lint/performance/noImgElement: local blob preview.
          <img
            src={v.photo}
            alt={`${v.name}, front`}
            className="size-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-3 text-foreground/70">
            <HugeiconsIcon
              icon={kindIcon[v.kind]}
              strokeWidth={1.5}
              className="size-16"
            />
            <span className="h-px w-24 border-t border-dashed border-foreground/20" />
          </div>
        )}
        <StatusBadge
          tone={v.status === "Verified" ? "success" : "warning"}
          className="absolute top-3 left-3"
        >
          {v.status}
        </StatusBadge>
      </div>

      <div className="flex flex-col gap-0.5 px-2">
        <h2 className="text-base font-semibold">{v.name}</h2>
        <p className="text-muted-foreground">{v.type}</p>
      </div>

      <dl className="grid gap-3 px-2">
        <SpecRow label="Capacity" value={v.capacity} />
        <SpecRow label="Plate" value={v.plate} />
        <SpecRow label="Insurance" value={v.insurance} />
      </dl>
    </article>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[6rem_1fr] gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  );
}
