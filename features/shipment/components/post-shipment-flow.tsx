"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { AccountStep } from "@/components/wizard/account-step";
import {
  HoursCountdown,
  SuccessScreen,
} from "@/components/wizard/success-screen";
import { WizardShell } from "@/components/wizard/wizard-shell";
import {
  CategoryStep,
  DatesStep,
  DetailsStep,
  OffersStep,
  type Patch,
  type Photo,
  ReviewStep,
  RouteStep,
} from "@/features/shipment/components/post-shipment-steps";
import { ShipmentTicket } from "@/features/shipment/components/shipment-ticket";
import {
  draftEstimate,
  draftMiles,
  draftTitle,
  emptyShipmentDraft,
  SHIPMENT_DRAFT_KEY,
  type ShipmentDraft,
  shipmentStepValid,
} from "@/features/shipment/shipment-draft";
import { useSessionRole } from "@/features/user/hooks/use-session-role";
import type { Shipment } from "@/lib/demo-data/shipments";
import {
  addDays,
  clearDraft,
  loadDraft,
  placeholderPlace,
  saveDraft,
  toIso,
  uid,
} from "@/lib/wizard";

const ACCOUNT = 7;
const SUCCESS = 8;

function reducer(
  state: ShipmentDraft,
  action: Patch | { reset: ShipmentDraft },
): ShipmentDraft {
  if (typeof action === "function") return { ...state, ...action(state) };
  if ("reset" in action) return action.reset;
  return { ...state, ...action };
}

/** The draft as a driver-facing ticket, with placeholders for blanks. */
function toShipment(d: ShipmentDraft, today: string): Shipment {
  const estimate = draftEstimate(d);
  const from = d.pickupFrom || addDays(today, 3);
  return {
    id: "draft",
    category: d.category ?? "car",
    item: draftTitle(d).trim() || "Your item",
    from: d.pickup ?? placeholderPlace("Pickup city"),
    to: d.dropoff ?? placeholderPlace("Dropoff city"),
    miles: draftMiles(d),
    pickupFrom: from,
    pickupTo: d.pickupTo || (d.pickupFrom ? d.pickupFrom : addDays(today, 5)),
    budget: d.budget ? Number(d.budget) : (estimate?.mid ?? 0),
    offers: 0,
    closesInMs: Number(d.closesIn) * 3600_000,
    postedHoursAgo: 0,
    verifiedShipper: false,
  };
}

function Preview({ draft, today }: { draft: ShipmentDraft; today: string }) {
  return (
    // The ticket is a link elsewhere; here it's only a picture of the post.
    <div inert className="select-none">
      <ShipmentTicket shipment={toShipment(draft, today)} />
    </div>
  );
}

export function PostShipmentFlow() {
  // Signed-in people skip the account step.
  const isLoggedIn = Boolean(useSessionRole());
  const totalSteps = isLoggedIn ? 6 : 7;
  const [draft, dispatch] = useReducer(reducer, emptyShipmentDraft);
  const [ready, setReady] = useState(false);
  const [today, setToday] = useState("");
  const [direction, setDirection] = useState(1);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const photosRef = useRef(photos);
  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  // Restore the saved draft once we're in the browser.
  useEffect(() => {
    const saved = loadDraft<ShipmentDraft>(SHIPMENT_DRAFT_KEY);
    if (saved) dispatch({ reset: { ...emptyShipmentDraft, ...saved } });
    setToday(toIso(new Date()));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (draft.step === SUCCESS) clearDraft(SHIPMENT_DRAFT_KEY);
    else saveDraft(SHIPMENT_DRAFT_KEY, draft);
  }, [draft, ready]);

  // Free the photo previews when leaving the page.
  useEffect(
    () => () => {
      for (const p of photosRef.current) URL.revokeObjectURL(p.url);
    },
    [],
  );

  const update = (patch: Patch) => dispatch(patch);
  const goTo = (step: number) => {
    setDirection(step >= draft.step ? 1 : -1);
    dispatch({ step });
  };

  const step = draft.step;
  const valid = shipmentStepValid(draft, step);

  if (!ready) {
    return (
      <WizardShell
        stepKey="loading"
        direction={1}
        current={0}
        total={totalSteps}
        exitHref="/shipments"
      >
        <div className="h-96" />
      </WizardShell>
    );
  }

  if (step === SUCCESS) {
    return (
      <WizardShell
        stepKey="success"
        direction={1}
        current={totalSteps}
        total={totalSteps}
        exitHref="/shipments"
        showProgress={false}
        exitLabel="Done"
        wide
      >
        <SuccessScreen
          title="Your shipment is live!"
          text="Drivers can now send you offers. We’ll notify you as soon as the first one arrives."
          detail={
            <div className="flex w-fit flex-col gap-0.5 rounded-2xl bg-muted/50 px-5 py-4">
              <p className="text-sm text-muted-foreground">Offers close in</p>
              <p className="font-heading text-2xl font-semibold">
                <HoursCountdown hours={Number(draft.closesIn)} />
              </p>
            </div>
          }
          primary={{ label: "View my shipment", href: "/shipments/civic" }}
          secondaryLabel="Post another"
          onSecondary={() => {
            for (const p of photos) URL.revokeObjectURL(p.url);
            setPhotos([]);
            setDirection(1);
            dispatch({ reset: emptyShipmentDraft });
          }}
          sharePath="/shipments/civic"
          preview={<Preview draft={draft} today={today} />}
        />
      </WizardShell>
    );
  }

  const post = () => goTo(isLoggedIn ? SUCCESS : ACCOUNT);

  return (
    <WizardShell
      stepKey={step}
      direction={direction}
      current={step}
      total={totalSteps}
      exitHref="/shipments"
      onSaveAndExit={() => saveDraft(SHIPMENT_DRAFT_KEY, draft)}
      preview={<Preview draft={draft} today={today} />}
      previewNote="This is how drivers will see your shipment."
      nav={{
        hidden: step === ACCOUNT,
        onBack: step > 1 ? () => goTo(step - 1) : undefined,
        onNext: step === 6 ? post : () => goTo(step + 1),
        nextLabel: step === 6 ? "Post shipment" : "Continue",
        nextDisabled: !valid,
      }}
    >
      {step === 1 && <CategoryStep draft={draft} update={update} />}
      {step === 2 && (
        <DetailsStep
          draft={draft}
          update={update}
          photos={photos}
          onAddPhotos={(files) =>
            setPhotos((prev) => [
              ...prev,
              ...files
                .filter((f) => f.type.startsWith("image/"))
                .map((f) => ({
                  id: uid(),
                  url: URL.createObjectURL(f),
                  name: f.name,
                })),
            ])
          }
          onRemovePhoto={(id) => {
            const gone = photos.find((p) => p.id === id);
            if (gone) URL.revokeObjectURL(gone.url);
            setPhotos(photos.filter((p) => p.id !== id));
          }}
        />
      )}
      {step === 3 && <RouteStep draft={draft} update={update} />}
      {step === 4 && <DatesStep draft={draft} update={update} today={today} />}
      {step === 5 && <OffersStep draft={draft} update={update} />}
      {step === 6 && <ReviewStep draft={draft} photos={photos} goTo={goTo} />}
      {step === ACCOUNT && (
        <>
          <AccountStep
            savedText="Your shipment is saved. You won’t lose anything."
            submitLabel="Create account and post"
            onDone={() => goTo(SUCCESS)}
          />
          <div>
            <button
              type="button"
              onClick={() => goTo(6)}
              className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Back to review
            </button>
          </div>
        </>
      )}
    </WizardShell>
  );
}
