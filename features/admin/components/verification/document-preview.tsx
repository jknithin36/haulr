import type { VerificationItem } from "@/lib/demo-data/admin/verification";
import { formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * Drawn stand-ins for uploaded documents. The demo has no real files, so each
 * kind gets a plain layout with grey blocks where unreadable text would be.
 */
export function DocumentPreview({ item }: { item: VerificationItem }) {
  const doc =
    item.kind === "license" ? (
      <LicenseCard item={item} />
    ) : item.kind === "insurance" ? (
      <InsuranceCertificate item={item} />
    ) : item.kind === "vehicle" ? (
      <VehicleRegistration item={item} />
    ) : (
      <BusinessCertificate item={item} />
    );

  return (
    <div
      className={cn(
        "w-full select-none text-zinc-900",
        item.blurry && "blur-[2.5px]",
      )}
      aria-hidden
    >
      {doc}
    </div>
  );
}

function Bar({ className }: { className?: string }) {
  return (
    <span className={cn("block h-1.5 rounded-full bg-zinc-200", className)} />
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[8px] font-medium tracking-wide text-zinc-400 uppercase">
        {label}
      </span>
      <span className="text-[11px] font-semibold tracking-wide uppercase">
        {children}
      </span>
    </div>
  );
}

function Paper({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "mx-auto flex flex-col bg-white shadow-[0_1px_3px_rgb(0_0_0/0.08),0_8px_24px_-8px_rgb(0_0_0/0.12)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

function stateOf(item: VerificationItem) {
  return (
    item.fields.find((f) => f.label === "State")?.value ??
    item.location.split(", ")[1] ??
    ""
  );
}

function LicenseCard({ item }: { item: VerificationItem }) {
  const license = item.fields.find((f) => f.label === "License")?.value;
  const expires = item.fields.find((f) => f.label === "Expires")?.value;
  const [first, ...rest] = item.nameOnDocument.split(" ");
  return (
    <Paper className="w-full max-w-md overflow-hidden rounded-xl sm:aspect-[1.586]">
      <div className="flex items-center justify-between bg-zinc-100 px-4 py-2.5">
        <span className="text-xs font-bold tracking-[0.2em] uppercase">
          {stateOf(item)}
        </span>
        <span className="text-[9px] font-semibold tracking-widest text-zinc-500 uppercase">
          Driver license · Class D
        </span>
      </div>
      <div className="flex flex-1 gap-4 p-4">
        <div className="relative aspect-[3/4] w-[28%] shrink-0 overflow-hidden rounded-md bg-zinc-200">
          <span className="absolute top-[18%] left-1/2 size-[38%] -translate-x-1/2 rounded-full bg-zinc-300" />
          <span className="absolute -bottom-[12%] left-1/2 h-[42%] w-[78%] -translate-x-1/2 rounded-t-full bg-zinc-300" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2.5">
          <Field label="4d DLN">
            {license && license !== "Unreadable" ? license : "•••• •••• •"}
          </Field>
          <Field label="1 Last name">{rest.join(" ")}</Field>
          <Field label="2 First name">{first}</Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="3 DOB">
              <Bar className="mt-1 w-12" />
            </Field>
            <Field label="4b Exp">
              {expires && expires !== "Unreadable" ? expires : "•• ••••"}
            </Field>
          </div>
          <div className="flex flex-col gap-1.5 pt-1">
            <Bar className="w-4/5" />
            <Bar className="w-3/5" />
          </div>
        </div>
      </div>
      <div className="flex items-end justify-between px-4 pb-3">
        <svg
          viewBox="0 0 120 24"
          className="h-5 w-24 text-zinc-400"
          aria-hidden="true"
        >
          <path
            d="M2 18c8-14 14-14 16-4s6 8 12-2 10-8 12 0 8 6 14-4 12-6 14 2 10 6 18-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <span className="text-[8px] tracking-widest text-zinc-400 uppercase">
          Not valid for federal ID
        </span>
      </div>
    </Paper>
  );
}

function InsuranceCertificate({ item }: { item: VerificationItem }) {
  const get = (label: string) =>
    item.fields.find((f) => f.label === label)?.value ?? "";
  const [from, to] = get("Valid").split(" – ");
  return (
    <Paper className="aspect-[8.5/11] w-full max-w-sm rounded-sm p-6">
      <div className="flex items-start justify-between gap-3 border-b border-zinc-200 pb-3">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-bold tracking-wide uppercase">
            Certificate of liability insurance
          </span>
          <span className="text-[9px] text-zinc-500">
            This certificate is issued as a matter of information only.
          </span>
        </div>
        <span className="text-[9px] text-zinc-500 tabular-nums">
          10/17/2026
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4 border-b border-zinc-200 py-3">
        <div className="flex flex-col gap-1.5">
          <span className="text-[8px] font-medium text-zinc-400 uppercase">
            Insured
          </span>
          <span className="text-[11px] font-semibold">
            {item.nameOnDocument}
          </span>
          <Bar className="w-4/5" />
          <span className="text-[10px]">{item.location}</span>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[8px] font-medium text-zinc-400 uppercase">
            Insurer
          </span>
          <span className="text-[11px] font-semibold">{get("Insurer")}</span>
          <Bar className="w-3/4" />
          <Bar className="w-1/2" />
        </div>
      </div>
      <div className="flex flex-col gap-0 py-3 text-[9px]">
        <div className="grid grid-cols-[1.4fr_1fr_1fr] gap-2 pb-1.5 font-medium text-zinc-400 uppercase">
          <span>Coverage</span>
          <span>Policy</span>
          <span className="text-right">Limit</span>
        </div>
        <div className="grid grid-cols-[1.4fr_1fr_1fr] gap-2 rounded bg-zinc-50 py-1.5">
          <span className="font-semibold">Motor truck cargo</span>
          <span className="truncate tabular-nums">{get("Policy")}</span>
          <span className="text-right font-semibold tabular-nums">
            {item.coverage !== undefined && formatUsd(item.coverage)}
          </span>
        </div>
        {[0, 1, 2].map((k) => (
          <div
            key={k}
            className="grid grid-cols-[1.4fr_1fr_1fr] items-center gap-2 py-2"
          >
            <Bar className="w-4/5" />
            <Bar className="w-3/4" />
            <Bar className="ml-auto w-1/2" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 border-t border-zinc-200 py-3 text-[10px]">
        <div className="flex flex-col gap-0.5">
          <span className="text-[8px] font-medium text-zinc-400 uppercase">
            Effective
          </span>
          <span className="font-semibold tabular-nums">{from}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[8px] font-medium text-zinc-400 uppercase">
            Expires
          </span>
          <span className="font-semibold tabular-nums">{to}</span>
        </div>
      </div>
      <div className="mt-auto flex flex-col gap-1.5">
        <Bar className="w-full" />
        <Bar className="w-11/12" />
        <Bar className="w-2/3" />
      </div>
    </Paper>
  );
}

function VehicleRegistration({ item }: { item: VerificationItem }) {
  const get = (label: string) =>
    item.fields.find((f) => f.label === label)?.value ?? "";
  const plate = get("Plate").replace(/^[A-Z]{2} /, "");
  return (
    <Paper className="w-full max-w-md rounded-md p-5">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
        <span className="text-[11px] font-bold tracking-wide uppercase">
          Texas vehicle registration
        </span>
        <span className="text-[9px] text-zinc-500">Receipt · 2026–2027</span>
      </div>
      <div className="grid grid-cols-[1fr_auto] gap-5 pt-4">
        <div className="flex flex-col gap-3">
          <Field label="Owner">{item.nameOnDocument}</Field>
          <Field label="Year / make / model">{get("Vehicle")}</Field>
          <Field label="Body">{get("Type")}</Field>
          <Field label="VIN">16VCX2025N3••••••</Field>
          <div className="flex flex-col gap-1.5 pt-1">
            <Bar className="w-4/5" />
            <Bar className="w-1/2" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex h-14 w-28 flex-col items-center justify-center rounded-md border-2 border-zinc-800 bg-white">
            <span className="text-[7px] font-semibold tracking-[0.25em] text-zinc-500">
              TEXAS
            </span>
            <span className="font-mono text-base font-bold tracking-wider">
              {plate}
            </span>
          </div>
          <span className="text-[8px] text-zinc-400 uppercase">
            Photo of plate
          </span>
        </div>
      </div>
    </Paper>
  );
}

function BusinessCertificate({ item }: { item: VerificationItem }) {
  const get = (label: string) =>
    item.fields.find((f) => f.label === label)?.value ?? "";
  return (
    <Paper className="aspect-[8.5/11] w-full max-w-sm items-center rounded-sm p-7 text-center">
      <span className="size-12 rounded-full border-2 border-zinc-300" />
      <span className="mt-3 text-[9px] tracking-[0.2em] text-zinc-500 uppercase">
        State of {get("State")} · Secretary of State
      </span>
      <span className="mt-4 text-sm font-bold tracking-wide uppercase">
        Certificate of formation
      </span>
      <span className="text-[10px] text-zinc-500">
        Limited liability company
      </span>
      <span className="mt-6 text-base font-semibold">
        {item.nameOnDocument}
      </span>
      <span className="mt-1 text-[10px] text-zinc-500 tabular-nums">
        Filed {get("Registered")} · Control no. 001187342
      </span>
      <div className="mt-6 flex w-full flex-col items-center gap-1.5">
        <Bar className="w-full" />
        <Bar className="w-11/12" />
        <Bar className="w-full" />
        <Bar className="w-4/5" />
      </div>
      <div className="mt-auto flex w-full items-end justify-between">
        <Bar className="w-1/3" />
        <span className="size-10 rounded-full bg-zinc-100" />
      </div>
    </Paper>
  );
}
