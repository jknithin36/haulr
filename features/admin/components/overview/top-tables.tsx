import { Rating } from "@/components/ui/data-display";
import { GradientAvatar } from "@/components/ui/gradient-avatar";
import { RouteLabel } from "@/components/ui/route-label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { summaryTable } from "@/features/admin/components/table-styles";
import { topDrivers, topRoutes } from "@/lib/demo-data/admin/overview";
import { formatUsd } from "@/lib/format";

export function TopRoutes() {
  return (
    <>
      <Table className="max-md:hidden">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className={summaryTable.head}>Route</TableHead>
            <TableHead className={`${summaryTable.head} text-right`}>
              Bookings
            </TableHead>
            <TableHead className={`${summaryTable.head} text-right`}>
              Avg price
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {topRoutes.map((row) => (
            <TableRow
              key={`${row.from}-${row.to}`}
              className={summaryTable.row}
            >
              <TableCell className={`${summaryTable.cell} font-medium`}>
                <RouteLabel
                  from={row.from}
                  to={row.to}
                  arrowClassName="text-muted-foreground"
                />
              </TableCell>
              <TableCell
                className={`${summaryTable.cell} text-right tabular-nums`}
              >
                {row.bookings}
              </TableCell>
              <TableCell
                className={`${summaryTable.cell} text-right tabular-nums`}
              >
                {formatUsd(row.avgPrice)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ul className="flex flex-col md:hidden">
        {topRoutes.map((row) => (
          <li
            key={`${row.from}-${row.to}`}
            className="flex flex-col gap-1 border-border/60 border-b py-3 text-sm last:border-0"
          >
            <span className="font-medium">
              <RouteLabel
                from={row.from}
                to={row.to}
                arrowClassName="text-muted-foreground"
              />
            </span>
            <span className="text-muted-foreground tabular-nums">
              {row.bookings} bookings · avg {formatUsd(row.avgPrice)}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}

export function TopDrivers() {
  return (
    <>
      <Table className="max-md:hidden">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className={summaryTable.head}>Driver</TableHead>
            <TableHead className={`${summaryTable.head} text-right`}>
              Jobs
            </TableHead>
            <TableHead className={`${summaryTable.head} text-right`}>
              Earned
            </TableHead>
            <TableHead className={`${summaryTable.head} text-right`}>
              Rating
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {topDrivers.map((row) => (
            <TableRow key={row.name} className={summaryTable.row}>
              <TableCell className={summaryTable.cell}>
                <span className="flex items-center gap-2.5 font-medium">
                  <GradientAvatar seed={row.name} className="size-7" />
                  {row.name}
                </span>
              </TableCell>
              <TableCell
                className={`${summaryTable.cell} text-right tabular-nums`}
              >
                {row.jobs}
              </TableCell>
              <TableCell
                className={`${summaryTable.cell} text-right tabular-nums`}
              >
                {formatUsd(row.earned)}
              </TableCell>
              <TableCell className={`${summaryTable.cell} text-right`}>
                <Rating value={row.rating} className="justify-end" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ul className="flex flex-col md:hidden">
        {topDrivers.map((row) => (
          <li
            key={row.name}
            className="flex items-center gap-3 border-border/60 border-b py-3 text-sm last:border-0"
          >
            <GradientAvatar seed={row.name} className="size-8" />
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="font-medium">{row.name}</span>
              <span className="text-muted-foreground tabular-nums">
                {row.jobs} jobs · {formatUsd(row.earned)}
              </span>
            </span>
            <Rating value={row.rating} />
          </li>
        ))}
      </ul>
    </>
  );
}
