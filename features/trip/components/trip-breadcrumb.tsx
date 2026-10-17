"use client";

import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { RouteLabel } from "@/components/ui/route-label";
import {
  cityName,
  destination,
  formatDay,
  origin,
  type Trip,
} from "@/lib/demo-data/trips";

/** Loads › Miami → Boston › Oct 22. A client leaf: the breadcrumb links use hooks. */
export function TripBreadcrumb({ trip }: { trip: Trip }) {
  const from = origin(trip);
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink render={<Link href="/loads" />}>Loads</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink
            render={<Link href="/loads" />}
            className="inline-flex items-center gap-1"
          >
            <RouteLabel
              from={cityName(from.place)}
              to={cityName(destination(trip).place)}
              className="gap-x-1"
            />
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{formatDay(from.date)}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
