"use client";

import { Download04Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { downloadFile, toCsv } from "@/features/admin/admin-download";
import { overviewKpis } from "@/lib/demo-data/admin/overview";

/** Downloads the key numbers as a CSV, built in the browser. */
export function ExportReportButton() {
  function download() {
    const rows = [
      ["Metric", "Month to date (Oct 1–17, 2026)", "Change vs last month"],
      ...overviewKpis.map((kpi) => [
        kpi.label,
        kpi.suffix ? `${kpi.value} ${kpi.suffix}` : kpi.value,
        `${kpi.direction === "up" ? "+" : "-"}${kpi.change}`,
      ]),
    ];
    // The byte-order mark makes Excel read the en dash in the header as UTF-8.
    downloadFile(
      `\uFEFF${toCsv(rows)}\n`,
      "haulr-report-2026-10-01-to-10-17.csv",
      "text/csv;charset=utf-8",
    );
  }

  return (
    <Button variant="outline" onClick={download}>
      <HugeiconsIcon icon={Download04Icon} strokeWidth={2} />
      Export report
    </Button>
  );
}
