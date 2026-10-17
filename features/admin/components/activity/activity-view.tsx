"use client";

import { ClipboardIcon, LockIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/data-display";
import { GradientAvatar } from "@/components/ui/gradient-avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { recordTable } from "@/features/admin/components/table-styles";
import {
  type ActivityEntry,
  activityDays,
  activityLog,
  activityTypes,
} from "@/lib/demo-data/admin/activity";
import { teamMembers } from "@/lib/demo-data/admin/settings";

const ALL = "all";

const adminOptions = [
  { value: ALL, label: "All admins" },
  ...teamMembers.map((m) => ({ value: m.name, label: m.name })),
];
const typeOptions = [{ value: ALL, label: "All actions" }, ...activityTypes];
const dayOptions = [
  { value: ALL, label: "All dates" },
  ...activityDays.map((d) => ({
    value: d.value,
    label: `${d.label}, ${d.date}`,
  })),
];

function FilterSelect({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Select
      items={options}
      value={value}
      onValueChange={(v) => onChange((v as string) ?? ALL)}
    >
      <SelectTrigger
        aria-label={label}
        className="h-9 w-full bg-background sm:w-auto sm:min-w-40"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function AdminName({ name }: { name: string }) {
  return (
    <span className="flex items-center gap-2.5">
      <GradientAvatar seed={name} className="size-6 shrink-0" />
      <span className="font-medium">{name}</span>
    </span>
  );
}

function DayTable({ entries }: { entries: ActivityEntry[] }) {
  return (
    <>
      <div className={recordTable.panel}>
        <Table className="table-fixed">
          <colgroup>
            <col className="w-28" />
            <col className="w-52" />
            <col />
            <col className="w-60" />
          </colgroup>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className={recordTable.head}>Time</TableHead>
              <TableHead className={recordTable.head}>Admin</TableHead>
              <TableHead className={recordTable.head}>Action</TableHead>
              <TableHead className={recordTable.head}>Target</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id} className={recordTable.row}>
                <TableCell
                  className={`${recordTable.cell} text-muted-foreground tabular-nums`}
                >
                  {entry.time}
                </TableCell>
                <TableCell className={recordTable.cell}>
                  <AdminName name={entry.admin} />
                </TableCell>
                <TableCell className={`${recordTable.cell} whitespace-normal`}>
                  {entry.action}
                </TableCell>
                <TableCell
                  className={`${recordTable.cell} truncate text-muted-foreground`}
                  title={entry.target}
                >
                  {entry.target}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ul className="flex flex-col gap-2 md:hidden">
        {entries.map((entry) => (
          <li
            key={entry.id}
            className="flex flex-col gap-2.5 rounded-2xl bg-muted/50 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <AdminName name={entry.admin} />
              <span className="text-xs text-muted-foreground tabular-nums">
                {entry.time}
              </span>
            </div>
            <p className="text-sm">
              {entry.action}
              <span className="text-muted-foreground"> · {entry.target}</span>
            </p>
          </li>
        ))}
      </ul>
    </>
  );
}

export function ActivityView() {
  const [admin, setAdmin] = useState(ALL);
  const [type, setType] = useState(ALL);
  const [day, setDay] = useState(ALL);

  const groups = useMemo(() => {
    const matches = activityLog.filter(
      (entry) =>
        (admin === ALL || entry.admin === admin) &&
        (type === ALL || entry.type === type) &&
        (day === ALL || entry.day === day),
    );
    return activityDays
      .map((d) => ({ ...d, entries: matches.filter((e) => e.day === d.value) }))
      .filter((d) => d.entries.length > 0);
  }, [admin, type, day]);

  const filtered = admin !== ALL || type !== ALL || day !== ALL;

  function clear() {
    setAdmin(ALL);
    setType(ALL);
    setDay(ALL);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        <FilterSelect
          label="Admin"
          options={adminOptions}
          value={admin}
          onChange={setAdmin}
        />
        <FilterSelect
          label="Action type"
          options={typeOptions}
          value={type}
          onChange={setType}
        />
        <FilterSelect
          label="Date"
          options={dayOptions}
          value={day}
          onChange={setDay}
        />
        {filtered && (
          <Button variant="ghost" className="h-9 w-fit" onClick={clear}>
            Clear filters
          </Button>
        )}
      </div>

      {groups.length > 0 ? (
        groups.map((group) => (
          <section key={group.value} className="flex flex-col gap-3">
            <h2 className="text-sm font-medium">
              {group.label}
              <span className="font-normal text-muted-foreground">
                {" "}
                · {group.date}
              </span>
            </h2>
            <DayTable entries={group.entries} />
          </section>
        ))
      ) : (
        <EmptyState
          icon={ClipboardIcon}
          title="No matching actions"
          description="Try a different admin, action type or date."
          action={
            <Button variant="outline" onClick={clear}>
              Clear filters
            </Button>
          }
        />
      )}

      <p className="flex gap-2 text-sm text-muted-foreground">
        <HugeiconsIcon
          icon={LockIcon}
          strokeWidth={2}
          className="mt-0.5 size-4 shrink-0"
        />
        Every admin action is logged and can’t be edited or deleted.
      </p>
    </div>
  );
}
