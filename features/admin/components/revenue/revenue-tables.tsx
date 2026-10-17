import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { summaryTable } from "@/features/admin/components/table-styles";
import { feesByPlan, subscriptions } from "@/lib/demo-data/admin/revenue";
import { formatUsd } from "@/lib/format";

export function FeesByPlan() {
  return (
    <>
      <Table className="max-md:hidden">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className={summaryTable.head}>Plan</TableHead>
            <TableHead className={`${summaryTable.head} text-right`}>
              Fee rate
            </TableHead>
            <TableHead className={`${summaryTable.head} text-right`}>
              Bookings
            </TableHead>
            <TableHead className={`${summaryTable.head} text-right`}>
              Booking value
            </TableHead>
            <TableHead className={`${summaryTable.head} text-right`}>
              Fees earned
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {feesByPlan.map((row) => (
            <TableRow key={row.plan} className={summaryTable.row}>
              <TableCell className={`${summaryTable.cell} font-medium`}>
                {row.plan}
              </TableCell>
              <TableCell
                className={`${summaryTable.cell} text-right text-muted-foreground tabular-nums`}
              >
                {row.feeRate}
              </TableCell>
              <TableCell
                className={`${summaryTable.cell} text-right tabular-nums`}
              >
                {row.bookings}
              </TableCell>
              <TableCell
                className={`${summaryTable.cell} text-right tabular-nums`}
              >
                {formatUsd(row.bookingValue)}
              </TableCell>
              <TableCell
                className={`${summaryTable.cell} text-right font-medium tabular-nums`}
              >
                {formatUsd(row.fees)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ul className="flex flex-col md:hidden">
        {feesByPlan.map((row) => (
          <li
            key={row.plan}
            className="flex items-start justify-between gap-3 border-border/60 border-b py-3 text-sm last:border-0"
          >
            <span className="flex flex-col gap-0.5">
              <span className="font-medium">
                {row.plan}{" "}
                <span className="font-normal text-muted-foreground">
                  · {row.feeRate} fee
                </span>
              </span>
              <span className="text-muted-foreground tabular-nums">
                {row.bookings} bookings · {formatUsd(row.bookingValue)}
              </span>
            </span>
            <span className="font-medium tabular-nums">
              {formatUsd(row.fees)}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}

const subscriptionRows = [
  {
    label: "Active",
    value: `${subscriptions.activePro} Pro · ${subscriptions.activeBusiness} Business`,
  },
  { label: "New this month", value: String(subscriptions.newThisMonth) },
  { label: "Cancelled", value: String(subscriptions.cancelled) },
  { label: "Monthly churn", value: subscriptions.churn },
  { label: "Monthly recurring revenue", value: subscriptions.mrr },
];

export function Subscriptions() {
  return (
    <dl className="flex flex-col">
      {subscriptionRows.map((row) => (
        <div
          key={row.label}
          className="flex items-baseline justify-between gap-4 border-border/60 border-b py-3 text-sm last:border-0"
        >
          <dt className="text-muted-foreground">{row.label}</dt>
          <dd className="font-medium tabular-nums">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
