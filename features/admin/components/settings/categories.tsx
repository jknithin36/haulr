"use client";

import { BlockedIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { StatusBadge } from "@/components/ui/data-display";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { switchClass } from "@/features/admin/components/settings/general";
import { recordTable } from "@/features/admin/components/table-styles";
import { SettingsSection } from "@/features/dashboard/components/settings/section";
import { type Category, categories } from "@/lib/demo-data/admin/settings";
import { cn } from "@/lib/utils";

function Subtypes({ category }: { category: Category }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {category.subtypes.map((subtype) => (
        <li
          key={subtype}
          className={cn(
            "rounded-full bg-background px-2.5 py-0.5 text-xs font-medium",
            category.blocked && "text-muted-foreground",
          )}
        >
          {subtype}
        </li>
      ))}
    </ul>
  );
}

function ActiveControl({
  category,
  onChange,
}: {
  category: Category;
  onChange: (on: boolean) => void;
}) {
  if (category.blocked) {
    return (
      <StatusBadge tone="danger">
        <HugeiconsIcon icon={BlockedIcon} strokeWidth={2} className="size-3" />
        Blocked
      </StatusBadge>
    );
  }
  return (
    <Switch
      checked={category.active}
      onCheckedChange={onChange}
      aria-label={`${category.name} active`}
      className={cn("align-middle", switchClass)}
    />
  );
}

export function Categories() {
  const [rows, setRows] = useState(categories);

  function toggle(id: string, active: boolean) {
    setRows((prev) => prev.map((c) => (c.id === id ? { ...c, active } : c)));
  }

  return (
    <SettingsSection
      title="Categories"
      description="What customers can post. Turning a category off hides it from new posts; existing shipments stay live."
      className="max-w-3xl"
    >
      <div className={recordTable.panel}>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className={recordTable.head}>Category</TableHead>
              <TableHead className={recordTable.head}>Subtypes</TableHead>
              <TableHead className={`${recordTable.head} text-right`}>
                Active
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((category) => (
              <TableRow key={category.id} className={recordTable.row}>
                <TableCell className={`${recordTable.cell} w-36 font-medium`}>
                  {category.name}
                </TableCell>
                <TableCell className={`${recordTable.cell} whitespace-normal`}>
                  <Subtypes category={category} />
                </TableCell>
                <TableCell className={`${recordTable.cell} w-28 text-right`}>
                  <div className="flex justify-end">
                    <ActiveControl
                      category={category}
                      onChange={(on) => toggle(category.id, on)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ul className="flex flex-col gap-2 md:hidden">
        {rows.map((category) => (
          <li
            key={category.id}
            className="flex flex-col gap-3 rounded-2xl bg-muted/50 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="font-medium">{category.name}</span>
              <ActiveControl
                category={category}
                onChange={(on) => toggle(category.id, on)}
              />
            </div>
            <Subtypes category={category} />
          </li>
        ))}
      </ul>
    </SettingsSection>
  );
}
