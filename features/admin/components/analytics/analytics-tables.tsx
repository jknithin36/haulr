import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { summaryTable } from "@/features/admin/components/table-styles";
import { topStates, trafficSources } from "@/lib/demo-data/admin/analytics";
import { formatNumber } from "@/lib/format";

const maxShare = Math.max(...topStates.map((s) => s.share));

function ShareBar({ share }: { share: number }) {
  return (
    <span className="block h-1.5 w-full overflow-hidden rounded-full bg-foreground/[0.07]">
      <span
        className="block h-full rounded-full bg-foreground"
        style={{ width: `${(share / maxShare) * 100}%` }}
      />
    </span>
  );
}

export function TopStates() {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className={summaryTable.head}>State</TableHead>
          <TableHead className={`${summaryTable.head} text-right`}>
            Bookings
          </TableHead>
          <TableHead className={`${summaryTable.head} w-[40%] max-sm:hidden`}>
            <span className="sr-only">Share bar</span>
          </TableHead>
          <TableHead className={`${summaryTable.head} text-right`}>
            Share
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {topStates.map((row) => (
          <TableRow key={row.state} className={summaryTable.row}>
            <TableCell className={`${summaryTable.cell} font-medium`}>
              {row.state}
            </TableCell>
            <TableCell
              className={`${summaryTable.cell} text-right tabular-nums`}
            >
              {row.bookings}
            </TableCell>
            <TableCell className={`${summaryTable.cell} max-sm:hidden`}>
              <ShareBar share={row.share} />
            </TableCell>
            <TableCell
              className={`${summaryTable.cell} text-right text-muted-foreground tabular-nums`}
            >
              {row.share.toFixed(1)}%
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function TrafficSources() {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className={summaryTable.head}>Source</TableHead>
          <TableHead className={`${summaryTable.head} text-right`}>
            Visitors
          </TableHead>
          <TableHead className={`${summaryTable.head} text-right`}>
            Signups
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {trafficSources.map((row) => (
          <TableRow key={row.source} className={summaryTable.row}>
            <TableCell className={`${summaryTable.cell} font-medium`}>
              {row.source}
            </TableCell>
            <TableCell
              className={`${summaryTable.cell} text-right tabular-nums`}
            >
              {formatNumber(row.visitors)}
            </TableCell>
            <TableCell
              className={`${summaryTable.cell} text-right tabular-nums`}
            >
              {formatNumber(row.signups)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
