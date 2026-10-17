import { StatusBadge } from "@/components/ui/data-display";
import { RouteLabel } from "@/components/ui/route-label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  tableCardClassName,
  tableCardHeadClassName,
  tableCardRowClassName,
} from "@/features/dashboard/components/dashboard-table";
import {
  type Earning,
  formatMoney,
  type PaymentMade,
  statusTone,
} from "@/lib/demo-data/dashboard/payments";
import { cn } from "@/lib/utils";

const headCell = cn(tableCardHeadClassName, "px-4");
const bodyCell = "px-4 py-3.5";

function JobLabel({ job }: { job: Earning["job"] }) {
  return (
    <span className="flex min-w-0 flex-col gap-0.5">
      <span className="font-medium">
        {job.route ? (
          <RouteLabel
            from={job.route[0]}
            to={job.route[1]}
            arrowClassName="text-muted-foreground"
          />
        ) : (
          job.title
        )}
      </span>
      <span className="text-xs text-muted-foreground tabular-nums">
        {job.ref}
      </span>
    </span>
  );
}

export function EarningsTable({ earnings }: { earnings: Earning[] }) {
  return (
    <>
      <div className={cn("hidden md:block", tableCardClassName)}>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className={headCell}>Date</TableHead>
              <TableHead className={headCell}>Job</TableHead>
              <TableHead className={`${headCell} text-right`}>Amount</TableHead>
              <TableHead className={`${headCell} text-right`}>
                Fee (5%)
              </TableHead>
              <TableHead className={`${headCell} text-right`}>
                You get
              </TableHead>
              <TableHead className={`${headCell} text-right`}>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {earnings.map((row) => (
              <TableRow key={row.id} className={tableCardRowClassName}>
                <TableCell
                  className={`${bodyCell} text-muted-foreground tabular-nums`}
                >
                  {row.date}
                </TableCell>
                <TableCell className={bodyCell}>
                  <JobLabel job={row.job} />
                </TableCell>
                <TableCell className={`${bodyCell} text-right tabular-nums`}>
                  {formatMoney(row.amount)}
                </TableCell>
                <TableCell
                  className={`${bodyCell} text-right text-muted-foreground tabular-nums`}
                >
                  {formatMoney(row.fee)}
                </TableCell>
                <TableCell
                  className={`${bodyCell} text-right font-medium tabular-nums`}
                >
                  {formatMoney(row.net)}
                </TableCell>
                <TableCell className={`${bodyCell} text-right`}>
                  <StatusBadge
                    tone={statusTone[row.status]}
                    className="ml-auto"
                  >
                    {row.status}
                  </StatusBadge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ul className="flex flex-col gap-2 md:hidden">
        {earnings.map((row) => (
          <li
            key={row.id}
            className="flex flex-col gap-3 rounded-2xl bg-muted/50 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <JobLabel job={row.job} />
              <StatusBadge tone={statusTone[row.status]}>
                {row.status}
              </StatusBadge>
            </div>
            <dl className="grid grid-cols-3 gap-2 text-sm">
              <div className="flex flex-col gap-0.5">
                <dt className="text-xs text-muted-foreground">Amount</dt>
                <dd className="tabular-nums">{formatMoney(row.amount)}</dd>
              </div>
              <div className="flex flex-col gap-0.5">
                <dt className="text-xs text-muted-foreground">Fee (5%)</dt>
                <dd className="text-muted-foreground tabular-nums">
                  {formatMoney(row.fee)}
                </dd>
              </div>
              <div className="flex flex-col gap-0.5">
                <dt className="text-xs text-muted-foreground">You get</dt>
                <dd className="font-medium tabular-nums">
                  {formatMoney(row.net)}
                </dd>
              </div>
            </dl>
            <p className="text-xs text-muted-foreground">{row.date}</p>
          </li>
        ))}
      </ul>
    </>
  );
}

function PaymentDate({ date }: { date: PaymentMade["date"] }) {
  return date ? (
    <span>{date}</span>
  ) : (
    <>
      <span aria-hidden>—</span>
      <span className="sr-only">Not yet charged</span>
    </>
  );
}

export function PaymentsMadeTable({ payments }: { payments: PaymentMade[] }) {
  return (
    <>
      <div className={cn("hidden md:block", tableCardClassName)}>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className={headCell}>Date</TableHead>
              <TableHead className={headCell}>Shipment</TableHead>
              <TableHead className={`${headCell} text-right`}>Amount</TableHead>
              <TableHead className={headCell}>Type</TableHead>
              <TableHead className={`${headCell} text-right`}>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((row) => (
              <TableRow key={row.id} className={tableCardRowClassName}>
                <TableCell
                  className={`${bodyCell} text-muted-foreground tabular-nums`}
                >
                  <PaymentDate date={row.date} />
                </TableCell>
                <TableCell className={bodyCell}>
                  <span className="flex flex-col gap-0.5">
                    <span className="font-medium">{row.shipment.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {row.shipment.ref}
                    </span>
                  </span>
                </TableCell>
                <TableCell
                  className={`${bodyCell} text-right font-medium tabular-nums`}
                >
                  {formatMoney(row.amount)}
                </TableCell>
                <TableCell className={`${bodyCell} text-muted-foreground`}>
                  {row.type}
                </TableCell>
                <TableCell className={`${bodyCell} text-right`}>
                  <StatusBadge
                    tone={statusTone[row.status]}
                    className="ml-auto"
                  >
                    {row.status}
                  </StatusBadge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ul className="flex flex-col gap-2 md:hidden">
        {payments.map((row) => (
          <li
            key={row.id}
            className="flex flex-col gap-3 rounded-2xl bg-muted/50 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="flex flex-col gap-0.5">
                <span className="font-medium">{row.shipment.title}</span>
                <span className="text-xs text-muted-foreground">
                  {row.shipment.ref}
                </span>
              </span>
              <span className="font-medium tabular-nums">
                {formatMoney(row.amount)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-muted-foreground">
                {row.type}
                {row.date && <> · {row.date}</>}
              </span>
              <StatusBadge tone={statusTone[row.status]}>
                {row.status}
              </StatusBadge>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
