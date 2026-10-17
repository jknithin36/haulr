"use client";

import { useEffect, useReducer, useState } from "react";
import { AccountStep } from "@/components/wizard/account-step";
import { SuccessScreen } from "@/components/wizard/success-screen";
import { WizardShell } from "@/components/wizard/wizard-shell";
import { ShareTripPreview } from "@/features/trip/components/share-trip-preview";
import {
  PriceStep,
  RouteStep,
  ScheduleStep,
  SpaceStep,
  type TripPatch,
  TripReviewStep,
  VehicleStep,
} from "@/features/trip/components/share-trip-steps";
import {
  emptyTripDraft,
  TRIP_DRAFT_KEY,
  type TripDraft,
  tripStepValid,
} from "@/features/trip/trip-draft";
import { useSessionRole } from "@/features/user/hooks/use-session-role";
import { clearDraft, loadDraft, saveDraft, toIso } from "@/lib/wizard";

const ACCOUNT = 7;
const SUCCESS = 8;

function reducer(
  state: TripDraft,
  action: TripPatch | { reset: TripDraft },
): TripDraft {
  if (typeof action === "function") return { ...state, ...action(state) };
  if ("reset" in action) return action.reset as TripDraft;
  return { ...state, ...action };
}

/** The "share your truck space" wizard, saved to localStorage as you go. */
export function ShareTripFlow() {
  // Signed-in people skip the account step.
  const isLoggedIn = Boolean(useSessionRole());
  const totalSteps = isLoggedIn ? 6 : 7;
  const [draft, dispatch] = useReducer(reducer, emptyTripDraft);
  const [ready, setReady] = useState(false);
  const [today, setToday] = useState("");
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const saved = loadDraft<TripDraft>(TRIP_DRAFT_KEY);
    if (saved) dispatch({ reset: { ...emptyTripDraft, ...saved } });
    setToday(toIso(new Date()));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (draft.step === SUCCESS) clearDraft(TRIP_DRAFT_KEY);
    else saveDraft(TRIP_DRAFT_KEY, draft);
  }, [draft, ready]);

  const update = (patch: TripPatch) => dispatch(patch);
  const goTo = (step: number) => {
    setDirection(step >= draft.step ? 1 : -1);
    dispatch({ step });
  };
  const step = draft.step;

  if (!ready) {
    return (
      <WizardShell
        stepKey="loading"
        direction={1}
        current={0}
        total={totalSteps}
        exitHref="/loads"
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
        exitHref="/loads"
        showProgress={false}
        exitLabel="Done"
        wide
      >
        <SuccessScreen
          title="Your trip is live!"
          text="Shippers can now book space on your trip. We’ll let you know when someone requests a spot."
          primary={{ label: "View my trip", href: "/loads/mike" }}
          secondaryLabel="Share another trip"
          onSecondary={() => {
            setDirection(1);
            // Keep the garage so new vehicles stick around.
            dispatch({
              reset: { ...emptyTripDraft, addedVehicles: draft.addedVehicles },
            });
          }}
          sharePath="/loads/mike"
          preview={<ShareTripPreview draft={draft} />}
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
      exitHref="/loads"
      onSaveAndExit={() => saveDraft(TRIP_DRAFT_KEY, draft)}
      preview={<ShareTripPreview draft={draft} />}
      previewNote="This is how shippers will see your trip."
      nav={{
        hidden: step === ACCOUNT,
        onBack: step > 1 ? () => goTo(step - 1) : undefined,
        onNext: step === 6 ? post : () => goTo(step + 1),
        nextLabel: step === 6 ? "Post trip" : "Continue",
        nextDisabled: !tripStepValid(draft, step),
      }}
    >
      {step === 1 && <VehicleStep draft={draft} update={update} />}
      {step === 2 && <RouteStep draft={draft} update={update} />}
      {step === 3 && (
        <ScheduleStep draft={draft} update={update} today={today} />
      )}
      {step === 4 && <SpaceStep draft={draft} update={update} />}
      {step === 5 && <PriceStep draft={draft} update={update} />}
      {step === 6 && <TripReviewStep draft={draft} goTo={goTo} />}
      {step === ACCOUNT && (
        <>
          <AccountStep
            savedText="Your trip is saved. You won’t lose anything."
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
