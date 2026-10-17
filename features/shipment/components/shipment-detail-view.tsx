"use client";

import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Calendar03Icon,
  CheckmarkBadge01Icon,
  FavouriteIcon,
  Flag02Icon,
  Image01Icon,
  Share08Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CtaBand } from "@/components/ui/cta-band";
import { Rating } from "@/components/ui/data-display";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { GradientAvatar } from "@/components/ui/gradient-avatar";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RouteLabel } from "@/components/ui/route-label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MessageDialog } from "@/features/message/components/message-dialog";
import {
  Countdown,
  ShipmentTicket,
} from "@/features/shipment/components/shipment-ticket";
import { useSessionRole } from "@/features/user/hooks/use-session-role";
import type {
  Offer,
  Question,
  ShipmentDetail,
  Viewer,
} from "@/lib/demo-data/shipment-details";
import {
  categoryBadge,
  formatPickup,
  type Shipment,
  shipmentCategories,
} from "@/lib/demo-data/shipments";
import {
  firstName,
  formatMiles,
  formatShortDay,
  formatUsd,
} from "@/lib/format";
import { cn } from "@/lib/utils";
import { fromIso } from "@/lib/wizard";

// MapLibre needs the browser.
const RouteMap = dynamic(
  () => import("@/components/maps/route-map").then((m) => m.RouteMap),
  { ssr: false, loading: () => <div className="size-full bg-muted/50" /> },
);

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

/* ----------------------------- Gallery ----------------------------- */

function Gallery({ detail, item }: { detail: ShipmentDetail; item: string }) {
  const slots = Array.from({ length: 5 }, (_, i) => detail.photos[i]);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const go = (step: number) => setIndex((i) => (i + step + 5) % 5);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % 5);
      if (e.key === "ArrowLeft") setIndex((i) => (i + 4) % 5);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const tile = (i: number, className?: string) => {
    const photo = slots[i];
    return (
      <button
        key={i}
        type="button"
        onClick={() => {
          setIndex(i);
          setOpen(true);
        }}
        aria-label={`Open photo ${i + 1} of 5`}
        className={cn(
          "group relative overflow-hidden bg-muted/60 outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
          className,
        )}
      >
        {photo ? (
          // biome-ignore lint/performance/noImgElement: shipper uploads can be any size or host.
          <img
            src={photo.src}
            alt={photo.alt}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <span className="flex size-full items-center justify-center text-muted-foreground">
            <HugeiconsIcon
              icon={Image01Icon}
              strokeWidth={1.5}
              className="size-6"
            />
          </span>
        )}
      </button>
    );
  };

  const current = slots[index];

  return (
    <>
      <div className="grid h-72 grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-2xl md:h-105">
        {tile(0, "col-span-4 row-span-2 md:col-span-2")}
        {tile(1, "max-md:hidden")}
        {tile(2, "max-md:hidden")}
        {tile(3, "max-md:hidden")}
        {tile(4, "max-md:hidden")}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex h-dvh w-screen max-w-none flex-col rounded-none bg-black p-0 text-white ring-0 sm:max-w-none">
          <DialogTitle className="sr-only">Photos of {item}</DialogTitle>
          <div className="relative flex flex-1 items-center justify-center p-6 md:p-16">
            {current ? (
              // biome-ignore lint/performance/noImgElement: shipper uploads can be any size or host.
              <img
                src={current.src}
                alt={current.alt}
                className="max-h-full max-w-full rounded-lg object-contain"
              />
            ) : (
              <div className="flex aspect-4/3 w-full max-w-3xl flex-col items-center justify-center gap-3 rounded-2xl bg-white/5 text-white/50">
                <HugeiconsIcon
                  icon={Image01Icon}
                  strokeWidth={1.5}
                  className="size-10"
                />
                <p className="text-sm">No photo uploaded yet</p>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon-lg"
              aria-label="Previous photo"
              onClick={() => go(-1)}
              className="absolute left-4 rounded-full text-white hover:bg-white/10 hover:text-white"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
            </Button>
            <Button
              variant="ghost"
              size="icon-lg"
              aria-label="Next photo"
              onClick={() => go(1)}
              className="absolute right-4 rounded-full text-white hover:bg-white/10 hover:text-white"
            >
              <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
            </Button>
          </div>
          <p className="pb-6 text-center text-sm text-white/60 tabular-nums">
            {index + 1} / 5
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ----------------------------- Actions ----------------------------- */

function Actions({ item }: { item: string }) {
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [reported, setReported] = useState(false);

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: item, url }).catch(() => {});
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        aria-pressed={saved}
        onClick={() => setSaved(!saved)}
      >
        <HugeiconsIcon
          icon={FavouriteIcon}
          strokeWidth={2}
          className={cn(saved && "fill-foreground")}
        />
        {saved ? "Saved" : "Save"}
      </Button>
      <Button variant="ghost" onClick={share}>
        <HugeiconsIcon icon={Share08Icon} strokeWidth={2} />
        {copied ? "Link copied" : "Share"}
      </Button>
      <Dialog onOpenChange={(open) => open && setReported(false)}>
        <DialogTrigger render={<Button variant="ghost" />}>
          <HugeiconsIcon icon={Flag02Icon} strokeWidth={2} />
          Report
        </DialogTrigger>
        <DialogContent>
          {reported ? (
            <DialogHeader>
              <DialogTitle>Thanks for letting us know</DialogTitle>
              <DialogDescription>
                Our team will review this listing within 24 hours.
              </DialogDescription>
            </DialogHeader>
          ) : (
            <form
              className="grid gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                setReported(true);
              }}
            >
              <DialogHeader>
                <DialogTitle>Report this listing</DialogTitle>
                <DialogDescription>
                  Tell us what looks wrong. The shipper won’t see who reported
                  it.
                </DialogDescription>
              </DialogHeader>
              <Textarea
                required
                placeholder="What’s wrong with this listing?"
              />
              <DialogFooter>
                <Button type="submit">Send report</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ------------------------------ Route ------------------------------ */

function RouteSection({
  shipment: s,
  detail,
}: {
  shipment: Shipment;
  detail: ShipmentDetail;
}) {
  const stops = [
    {
      label: "Pickup",
      place: `${s.from.label} ${detail.pickupZip}`.trim(),
      when: formatPickup(s),
    },
    {
      label: "Dropoff",
      place: `${s.to.label} ${detail.dropoffZip}`.trim(),
      when: detail.deliverBy ? `Deliver by ${detail.deliverBy}` : "Flexible",
    },
  ];

  return (
    <Section title="Route">
      <div className="h-72 overflow-hidden rounded-2xl bg-muted/50 md:h-80">
        <RouteMap from={s.from} to={s.to} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {stops.map((stop) => (
          <div key={stop.label} className="rounded-xl bg-muted/50 p-4">
            <p className="text-xs text-muted-foreground">{stop.label}</p>
            <p className="font-medium">{stop.place}</p>
            <p className="text-sm text-muted-foreground">{stop.when}</p>
          </div>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        The exact addresses are shared with the driver after booking.
      </p>
    </Section>
  );
}

/* ---------------------------- Questions ---------------------------- */

function Questions({
  initial,
  shipperName,
  viewerName,
}: {
  initial: Question[];
  shipperName: string;
  viewerName: string;
}) {
  const [questions, setQuestions] = useState(initial);
  const [draft, setDraft] = useState("");

  return (
    <Section title="Questions from drivers">
      {questions.length > 0 ? (
        <ul className="flex flex-col gap-4">
          {questions.map((q) => (
            <li
              key={q.id}
              className="flex flex-col gap-2 rounded-xl bg-muted/50 p-4"
            >
              <p>
                <span className="font-medium">Q: {q.question}</span>{" "}
                <span className="text-muted-foreground">· {q.askedBy}</span>
              </p>
              {q.answer ? (
                <p>
                  A: {q.answer}{" "}
                  <span className="text-muted-foreground">· {shipperName}</span>
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Waiting for {firstName(shipperName)}’s answer
                </p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground">No questions yet.</p>
      )}
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const question = draft.trim();
          if (!question) return;
          setQuestions([
            ...questions,
            { id: `q${Date.now()}`, question, askedBy: viewerName },
          ]);
          setDraft("");
        }}
      >
        <Input
          aria-label="Ask a question"
          placeholder="Ask a question…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="h-9"
        />
        <Button type="submit" size="lg" disabled={!draft.trim()}>
          Ask
        </Button>
      </form>
      <p className="text-sm text-muted-foreground">
        Questions and answers are public. Don’t share phone numbers or addresses
        here.
      </p>
    </Section>
  );
}

/* --------------------------- Offer panel --------------------------- */

type MyOffer = {
  price: number;
  pickup: Date;
  delivery?: Date;
  vehicle: string;
  message: string;
};

function DateField({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value?: Date;
  onChange: (date?: Date) => void;
  disabled: { before?: Date; after?: Date };
}) {
  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      <Popover>
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              size="lg"
              className={cn(
                "justify-start bg-background",
                !value && "text-muted-foreground",
              )}
            />
          }
        >
          <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} />
          {value ? formatShortDay(value) : "Choose a date"}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            defaultMonth={value ?? disabled.before}
            disabled={[
              ...(disabled.before ? [{ before: disabled.before }] : []),
              ...(disabled.after ? [{ after: disabled.after }] : []),
            ]}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

function OfferForm({
  shipment: s,
  shipperName,
  vehicles,
  initial,
  onSubmit,
  onCancel,
}: {
  shipment: Shipment;
  shipperName: string;
  vehicles: string[];
  initial?: MyOffer;
  onSubmit: (offer: MyOffer) => void;
  onCancel?: () => void;
}) {
  const [price, setPrice] = useState(initial ? String(initial.price) : "");
  const [pickup, setPickup] = useState<Date | undefined>(initial?.pickup);
  const [delivery, setDelivery] = useState<Date | undefined>(initial?.delivery);
  const [vehicle, setVehicle] = useState(initial?.vehicle ?? vehicles[0]);
  const [message, setMessage] = useState(initial?.message ?? "");
  const amount = Number(price);
  const valid = amount > 0 && !!pickup;

  return (
    <form
      className="grid gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!valid || !pickup) return;
        onSubmit({ price: amount, pickup, delivery, vehicle, message });
      }}
    >
      <h3 className="font-semibold">
        {initial ? "Edit your offer" : "Send your offer"}
      </h3>
      <div className="grid gap-1.5">
        <Label htmlFor="offer-price">Your price</Label>
        <InputGroup className="h-9 bg-background">
          <InputGroupAddon>$</InputGroupAddon>
          <InputGroupInput
            id="offer-price"
            inputMode="numeric"
            placeholder="0"
            value={price}
            onChange={(e) => setPrice(e.target.value.replace(/[^\d]/g, ""))}
          />
        </InputGroup>
      </div>
      <DateField
        label="I can pick up on"
        value={pickup}
        onChange={setPickup}
        disabled={{
          before: fromIso(s.pickupFrom),
          after: fromIso(s.pickupTo),
        }}
      />
      <DateField
        label="Estimated delivery"
        value={delivery}
        onChange={setDelivery}
        disabled={{ before: pickup ?? fromIso(s.pickupFrom) }}
      />
      <div className="grid gap-1.5">
        <Label>Vehicle</Label>
        <Select
          items={vehicles.map((v) => ({ value: v, label: v }))}
          value={vehicle}
          onValueChange={(v) => setVehicle(v as string)}
        >
          <SelectTrigger className="h-9 w-full bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {vehicles.map((v) => (
              <SelectItem key={v} value={v}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="offer-message">Message to the shipper</Label>
        <Textarea
          id="offer-message"
          placeholder={`Tell ${firstName(shipperName)} why you’re a good fit…`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="bg-background"
        />
      </div>
      <div className="flex gap-2">
        {onCancel && (
          <Button type="button" variant="outline" size="lg" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" size="lg" className="flex-1" disabled={!valid}>
          {initial ? "Update offer" : "Send offer"}
        </Button>
      </div>
      <p className="text-center text-xs text-muted-foreground">
        Free to send. You only pay a fee if you’re booked.
      </p>
    </form>
  );
}

function OfferPanel({
  shipment: s,
  detail,
  vehicles,
  offers,
  myOffer,
  onSend,
  onWithdraw,
}: {
  shipment: Shipment;
  detail: ShipmentDetail;
  vehicles: string[];
  offers: Offer[];
  myOffer: MyOffer | null;
  onSend: (offer: MyOffer) => void;
  onWithdraw: () => void;
}) {
  const signedIn = Boolean(useSessionRole());
  const [editing, setEditing] = useState(false);
  const shipperFirst = firstName(detail.shipper.name);
  const lowest = offers.length ? Math.min(...offers.map((o) => o.price)) : null;
  const average = offers.length
    ? Math.round(offers.reduce((sum, o) => sum + o.price, 0) / offers.length)
    : null;

  const notice = (children: React.ReactNode) => (
    <div className="rounded-xl bg-background p-4 text-sm">{children}</div>
  );

  let body: React.ReactNode;
  if (detail.status === "booked") {
    body = notice("This shipment has been booked.");
  } else if (detail.status === "closed") {
    body = notice(`Offers are closed. ${shipperFirst} is choosing a driver.`);
  } else if (!signedIn) {
    body = (
      <Link
        href="/login"
        className={cn(buttonVariants({ size: "lg" }), "w-full")}
      >
        Log in to send an offer
      </Link>
    );
  } else if (vehicles.length === 0) {
    body = notice(
      <>
        You need to add a vehicle before sending offers.{" "}
        <Link
          href="/vehicles/new"
          className="font-medium underline underline-offset-4"
        >
          Add a vehicle
        </Link>
      </>,
    );
  } else if (myOffer && !editing) {
    body = (
      <div className="flex items-center justify-between gap-3 rounded-xl bg-background p-4 text-sm">
        <p>
          Your offer:{" "}
          <span className="font-semibold tabular-nums">
            {formatUsd(myOffer.price)}
          </span>
        </p>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
            Edit
          </Button>
          <Button variant="ghost" size="sm" onClick={onWithdraw}>
            Withdraw
          </Button>
        </div>
      </div>
    );
  } else {
    body = (
      <OfferForm
        shipment={s}
        shipperName={detail.shipper.name}
        vehicles={vehicles}
        initial={editing ? (myOffer ?? undefined) : undefined}
        onCancel={editing ? () => setEditing(false) : undefined}
        onSubmit={(offer) => {
          onSend(offer);
          setEditing(false);
        }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-muted/50 p-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground">Budget</p>
          <p className="font-heading text-3xl font-semibold tabular-nums">
            {formatUsd(s.budget)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Offers close in</p>
          <Countdown
            ms={s.closesInMs}
            className="font-heading text-lg font-semibold"
          />
        </div>
      </div>
      <dl className="grid grid-cols-3 gap-2 text-center">
        {[
          { label: "Offers", value: String(offers.length) },
          { label: "Lowest", value: lowest ? formatUsd(lowest) : "—" },
          { label: "Average", value: average ? formatUsd(average) : "—" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl bg-background px-2 py-3">
            <dd className="font-semibold tabular-nums">{stat.value}</dd>
            <dt className="text-xs text-muted-foreground">{stat.label}</dt>
          </div>
        ))}
      </dl>
      {body}
    </div>
  );
}

/* ------------------------------ Offers ----------------------------- */

function OffersList({
  offers,
  isOwner,
  highlightId,
}: {
  offers: Offer[];
  isOwner: boolean;
  highlightId?: string;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold">Offers ({offers.length})</h2>
      {offers.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No offers yet. Be the first to send one.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          <AnimatePresence initial={false}>
            {offers.map((o) => (
              <motion.li
                key={o.id}
                layout
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  "flex items-center gap-3 rounded-xl p-3 transition-colors duration-1000",
                  o.id === highlightId ? "bg-emerald-500/10" : "bg-muted/50",
                )}
              >
                <GradientAvatar seed={o.driver} />
                <div className="min-w-0 flex-1 text-sm">
                  <p className="flex items-center gap-2 font-medium">
                    {o.driver}
                    <span className="font-normal text-muted-foreground">
                      <Rating value={o.rating} className="proportional-nums" />{" "}
                      · {o.jobs} jobs
                    </span>
                  </p>
                  <p className="truncate text-muted-foreground">
                    {o.vehicle} · Delivers by {o.deliverBy}
                  </p>
                </div>
                <div className="text-right text-sm">
                  <p className="font-semibold tabular-nums">
                    {formatUsd(o.price)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {o.sentHoursAgo === 0
                      ? "Just now"
                      : `${o.sentHoursAgo}h ago`}
                  </p>
                </div>
                {isOwner && <Button size="sm">Accept</Button>}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </section>
  );
}

/* ------------------------------- Page ------------------------------ */

export function ShipmentDetailView({
  shipment: s,
  detail,
  offers: initialOffers,
  similar,
  viewer,
}: {
  shipment: Shipment;
  detail: ShipmentDetail;
  offers: Offer[];
  similar: Shipment[];
  viewer: Viewer;
}) {
  const signedIn = Boolean(useSessionRole());
  const isOwner = viewer.id === detail.shipper.id;
  const [offers, setOffers] = useState(initialOffers);
  const [myOffer, setMyOffer] = useState<MyOffer | null>(null);
  const [highlightId, setHighlightId] = useState<string>();

  const category = shipmentCategories.find((c) => c.value === s.category);

  const sendOffer = (offer: MyOffer) => {
    const mine: Offer = {
      id: "mine",
      driver: viewer.name,
      rating: 4.8,
      jobs: 27,
      vehicle: offer.vehicle,
      price: offer.price,
      deliverBy: offer.delivery ? formatShortDay(offer.delivery) : "TBD",
      sentHoursAgo: 0,
    };
    setOffers((prev) => [mine, ...prev.filter((o) => o.id !== "mine")]);
    setMyOffer(offer);
    setHighlightId("mine");
    setTimeout(() => setHighlightId(undefined), 2500);
  };

  const withdraw = () => {
    setOffers((prev) => prev.filter((o) => o.id !== "mine"));
    setMyOffer(null);
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 pt-6 pb-16 md:pb-24">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/shipments" />}>
                  Shipments
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/shipments" />}>
                  {category?.label}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{s.item}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Actions item={s.item} />
        </div>

        <Gallery detail={detail} item={s.item} />

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
          <div className="flex min-w-0 flex-col gap-10">
            <div className="flex flex-col gap-3">
              <span className="inline-flex h-6 w-fit items-center rounded-full bg-muted px-2.5 text-xs font-medium">
                {categoryBadge(s.category)}
              </span>
              <h1 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
                {s.item}
              </h1>
              <p className="flex flex-wrap items-center gap-x-1.5 text-lg">
                <RouteLabel
                  from={s.from.label}
                  to={s.to.label}
                  arrowClassName="size-4"
                />
                <span className="text-muted-foreground">
                  · {formatMiles(s.miles)}
                </span>
              </p>
              <p className="text-sm text-muted-foreground">
                Posted {s.postedHoursAgo}{" "}
                {s.postedHoursAgo === 1 ? "hour" : "hours"} ago · {detail.views}{" "}
                views
              </p>
            </div>

            <RouteSection shipment={s} detail={detail} />

            {detail.fields.length > 0 && (
              <Section title="About this shipment">
                <dl className="grid gap-x-8 sm:grid-cols-2">
                  {detail.fields.map((field) => (
                    <div
                      key={field.label}
                      className="flex flex-col gap-0.5 border-b border-dashed border-foreground/10 py-3"
                    >
                      <dt className="text-sm text-muted-foreground">
                        {field.label}
                      </dt>
                      <dd className="font-medium">{field.value}</dd>
                    </div>
                  ))}
                </dl>
              </Section>
            )}

            {detail.notes && (
              <Section title="Notes from the shipper">
                <blockquote className="rounded-xl bg-muted/50 p-5 text-pretty">
                  “{detail.notes}”
                </blockquote>
              </Section>
            )}

            <Section title="Shipper">
              <div className="flex flex-wrap items-center gap-4 rounded-xl bg-muted/50 p-5">
                <GradientAvatar
                  seed={detail.shipper.name}
                  className="size-12"
                />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <p className="font-semibold">{detail.shipper.name}</p>
                  <p className="text-sm text-muted-foreground">
                    <Rating
                      value={detail.shipper.rating}
                      className="proportional-nums"
                    />{" "}
                    · {detail.shipper.shipments} shipments · Member since{" "}
                    {detail.shipper.memberSince}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {[
                      detail.shipper.verifiedPhone && "Verified phone",
                      detail.shipper.verifiedEmail && "Verified email",
                    ]
                      .filter(Boolean)
                      .map((badge) => (
                        <span
                          key={badge as string}
                          className="inline-flex h-6 items-center gap-1 rounded-full bg-background px-2.5 text-xs font-medium"
                        >
                          <HugeiconsIcon
                            icon={CheckmarkBadge01Icon}
                            strokeWidth={2}
                            className="size-3.5"
                          />
                          {badge}
                        </span>
                      ))}
                  </div>
                </div>
                {signedIn && !isOwner && (
                  <MessageDialog
                    name={detail.shipper.name}
                    context={`${s.item} · ${s.from.label} to ${s.to.label}`}
                    suggestions={[
                      "Is the pickup date flexible?",
                      "Is the item ready to load?",
                      "Can I pick up a day early?",
                    ]}
                    trigger={<Button variant="outline" size="lg" />}
                  />
                )}
              </div>
            </Section>

            <Questions
              initial={detail.questions}
              shipperName={detail.shipper.name}
              viewerName={viewer.name}
            />
          </div>

          <aside className="flex flex-col gap-8 lg:sticky lg:top-20 lg:self-start">
            <OfferPanel
              shipment={s}
              detail={detail}
              vehicles={viewer.vehicles}
              offers={offers}
              myOffer={myOffer}
              onSend={sendOffer}
              onWithdraw={withdraw}
            />
            <OffersList
              offers={offers}
              isOwner={isOwner}
              highlightId={highlightId}
            />
          </aside>
        </div>

        <section className="flex flex-col gap-6 pt-10">
          <h2 className="text-2xl font-semibold tracking-tight">
            Similar shipments on this route
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((other) => (
              <li key={other.id}>
                <ShipmentTicket shipment={other} />
              </li>
            ))}
          </ul>
        </section>

        <CtaBand>
          <p className="font-medium">Have something to ship?</p>
        </CtaBand>
      </div>
    </MotionConfig>
  );
}
