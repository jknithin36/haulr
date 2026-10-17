import { meter, spaceLabel, type Trip } from "@/lib/demo-data/trips";
import { cn } from "@/lib/utils";

type Kind = "car" | "pallet" | "block";

type Layout = {
  kind: Kind;
  slots: number;
  booked: number;
  slotW: number;
  slotH: number;
  decks: 1 | 2;
  walls: boolean;
};

function layoutFor(trip: Trip): Layout {
  const m = meter(trip);
  const booked = m.filled;
  switch (trip.vehicle) {
    case "car-carrier":
      return {
        kind: "car",
        slots: trip.capacity,
        booked,
        slotW: 114,
        slotH: 50,
        decks: trip.capacity > 3 ? 2 : 1,
        walls: false,
      };
    case "enclosed":
      return {
        kind: "car",
        slots: trip.capacity,
        booked,
        slotW: 114,
        slotH: 50,
        decks: trip.capacity > 3 ? 2 : 1,
        walls: true,
      };
    case "flatbed":
      return {
        kind: "pallet",
        slots: trip.capacity,
        booked,
        slotW: 62,
        slotH: 46,
        decks: 1,
        walls: false,
      };
    case "van":
      return {
        kind: "block",
        slots: m.segments,
        booked,
        slotW: 26,
        slotH: 72,
        decks: 1,
        walls: true,
      };
    default:
      return {
        kind: "block",
        slots: m.segments,
        booked,
        slotW: 40,
        slotH: 100,
        decks: 1,
        walls: true,
      };
  }
}

const GAP = 8;
const X0 = 20;
const BED = 136; // top of the chassis
const UPPER_Y = 14;

type Slot = { x: number; y: number; booked: boolean };

function placeSlots(t: Layout) {
  const upper = t.decks === 2 ? Math.ceil(t.slots / 2) : t.slots;
  const lower = t.slots - upper;
  const width = upper * t.slotW + (upper - 1) * GAP;
  const row = (count: number, y: number) =>
    Array.from({ length: count }, (_, i) => ({
      x: X0 + i * (t.slotW + GAP),
      y,
    }));

  const positions =
    t.decks === 2
      ? [...row(upper, UPPER_Y), ...row(lower, BED - 4 - t.slotH)]
      : row(upper, BED - 4 - t.slotH);

  // Spots fill from the front (the cab end), top deck first.
  const order = [...positions.keys()].sort(
    (a, b) =>
      positions[b].x - positions[a].x || positions[a].y - positions[b].y,
  );
  const bookedSet = new Set(order.slice(0, t.booked));
  const slots: Slot[] = positions.map((p, i) => ({
    ...p,
    booked: bookedSet.has(i),
  }));
  return { slots, width };
}

function Car({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path
        d="M3 26V19q0-4 5-5l16-2 12-8q3-2 7-2h23q4 0 7 3l10 7 10 2q5 1 5 6v6z"
        className="fill-foreground"
      />
      <path d="M40 6h12v6H31z" className="fill-background" />
      <path d="M56 6h10q2 0 4 2l5 4H56z" className="fill-background" />
      {[24, 78].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy={27} r={6.5} className="fill-foreground" />
          <circle cx={cx} cy={27} r={2.5} className="fill-background" />
        </g>
      ))}
    </g>
  );
}

function Pallet({
  x,
  y,
  w,
  h,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
}) {
  return (
    <g>
      <rect
        x={x + 4}
        y={y + 4}
        width={w - 8}
        height={h - 14}
        rx={3}
        className="fill-foreground"
      />
      <rect
        x={x + 2}
        y={y + h - 8}
        width={w - 4}
        height={4}
        rx={1}
        className="fill-foreground/60"
      />
    </g>
  );
}

function SlotShape({ slot, t }: { slot: Slot; t: Layout }) {
  const { x, y, booked } = slot;
  const { slotW: w, slotH: h } = t;

  if (!booked) {
    return (
      <g>
        <rect
          x={x + 1}
          y={y + 1}
          width={w - 2}
          height={h - 2}
          rx={t.kind === "block" ? 5 : 10}
          strokeDasharray="5 4"
          strokeWidth={1.5}
          className="fill-background stroke-foreground/35"
        />
        {w >= 60 && (
          <text
            x={x + w / 2}
            y={y + h / 2}
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-muted-foreground text-[12px] font-medium"
          >
            Open
          </text>
        )}
      </g>
    );
  }

  if (t.kind === "car") {
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={w}
          height={h}
          rx={10}
          className="fill-foreground/[0.07]"
        />
        <Car x={x + (w - 100) / 2} y={y + h - 38} />
      </g>
    );
  }
  if (t.kind === "pallet") return <Pallet x={x} y={y} w={w} h={h} />;
  return (
    <rect x={x} y={y} width={w} height={h} rx={5} className="fill-foreground" />
  );
}

/** Side view of the vehicle with every spot drawn as booked or open. */
export function SpaceDiagram({ trip }: { trip: Trip }) {
  const t = layoutFor(trip);
  const { slots, width } = placeSlots(t);
  const cabX = X0 + width + 22;
  const viewW = cabX + 112;
  const top = t.decks === 2 ? UPPER_Y : BED - 4 - t.slotH;

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-muted/50 p-5 md:p-6">
      <svg
        viewBox={`0 ${top - 12} ${viewW} ${184 - top}`}
        role="img"
        aria-label={`Space diagram: ${spaceLabel(trip)}`}
        className="h-auto w-full"
      >
        {/* Walls for enclosed bodies, posts for open carriers. */}
        {t.walls ? (
          <rect
            x={X0 - 8}
            y={top - 8}
            width={width + 16}
            height={BED - top + 8}
            rx={10}
            strokeWidth={2}
            className="fill-none stroke-foreground/25"
          />
        ) : (
          t.decks === 2 && (
            <>
              <line
                x1={X0 - 6}
                x2={X0 + width + 6}
                y1={UPPER_Y + t.slotH + 6}
                y2={UPPER_Y + t.slotH + 6}
                strokeWidth={3}
                strokeLinecap="round"
                className="stroke-foreground/25"
              />
              {[X0 - 6, X0 + width + 6].map((x) => (
                <line
                  key={x}
                  x1={x}
                  x2={x}
                  y1={UPPER_Y + 2}
                  y2={BED}
                  strokeWidth={3}
                  strokeLinecap="round"
                  className="stroke-foreground/25"
                />
              ))}
            </>
          )
        )}

        {slots.map((slot) => (
          <SlotShape key={`${slot.x}-${slot.y}`} slot={slot} t={t} />
        ))}

        {/* Chassis */}
        <rect
          x={X0 - 10}
          y={BED}
          width={cabX + 100 - (X0 - 10)}
          height={8}
          rx={4}
          className="fill-foreground/80"
        />

        {/* Cab, facing right */}
        <path
          d={`M${cabX} ${BED}V${BED - 56}q0-8 8-8h46l26 28h8q6 0 6 6v30z`}
          className="fill-foreground/80"
        />
        <path
          d={`M${cabX + 50} ${BED - 56}h6l18 20h-24z`}
          className="fill-background"
        />

        {/* Wheels */}
        {[X0 + 34, X0 + 70, cabX + 24, cabX + 78].map((cx) => (
          <g key={cx}>
            <circle cx={cx} cy={BED + 18} r={13} className="fill-foreground" />
            <circle cx={cx} cy={BED + 18} r={5} className="fill-background" />
          </g>
        ))}
      </svg>

      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-sm">
        <p className="font-medium">
          {trip.unit === "car"
            ? `${trip.left} of ${trip.capacity} car spots left`
            : spaceLabel(trip)}
        </p>
        <ul className="flex items-center gap-4 text-muted-foreground">
          <li className="flex items-center gap-1.5">
            <span
              className={cn(
                "size-3 rounded-[3px]",
                t.kind === "car" ? "bg-foreground/70" : "bg-foreground",
              )}
            />
            Booked
          </li>
          <li className="flex items-center gap-1.5">
            <span className="size-3 rounded-[3px] border-[1.5px] border-dashed border-foreground/40" />
            Open
          </li>
        </ul>
      </div>
    </div>
  );
}
