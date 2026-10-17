"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { formatUsd } from "@/lib/format";

type ResolutionChoice = "full" | "partial" | "release" | "insurance";

export type Resolution = {
  choice: ResolutionChoice;
  amount?: number;
  note: string;
};

export function describeResolution(
  r: Resolution,
  max: number,
  shipper: string,
) {
  switch (r.choice) {
    case "full":
      return `Full refund of ${formatUsd(max)} to ${shipper}`;
    case "partial":
      return `Partial refund of ${formatUsd(r.amount ?? 0)} to ${shipper}`;
    case "release":
      return "No refund, payment released to the driver";
    case "insurance":
      return "Sent to the driver’s insurance claim";
  }
}

export function ResolutionForm({
  max,
  onResolve,
}: {
  /** Amount in dispute; a partial refund can't be more than this. */
  max: number;
  onResolve: (resolution: Resolution) => void;
}) {
  const [choice, setChoice] = useState<ResolutionChoice | null>(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const value = Number(amount);
  const tooMuch = choice === "partial" && value > max;
  const amountOk = choice !== "partial" || (value > 0 && value <= max);
  const valid = choice !== null && amountOk && note.trim().length > 0;

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        if (!valid || !choice) return;
        onResolve({
          choice,
          amount: choice === "partial" ? value : undefined,
          note: note.trim(),
        });
      }}
    >
      <FieldSet className="gap-3">
        <FieldLegend variant="label">Resolution</FieldLegend>
        <RadioGroup
          value={choice}
          onValueChange={(v) => setChoice(v as ResolutionChoice)}
          className="gap-1"
        >
          <Option value="full" label="Full refund to the shipper" />
          <div className="flex flex-col">
            <Option value="partial" label="Partial refund" />
            {choice === "partial" && (
              <Field data-invalid={tooMuch} className="pt-1 pb-2 pl-9">
                <InputGroup className="h-9 bg-background">
                  <InputGroupAddon>
                    <InputGroupText>$</InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput
                    aria-label="Partial refund amount"
                    inputMode="decimal"
                    placeholder="0"
                    value={amount}
                    onChange={(e) =>
                      setAmount(e.target.value.replace(/[^\d.]/g, ""))
                    }
                    aria-invalid={tooMuch}
                    className="tabular-nums"
                    autoFocus
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupText className="font-normal tabular-nums">
                      of {formatUsd(max)}
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                {tooMuch && (
                  <FieldError>Can’t be more than {formatUsd(max)}.</FieldError>
                )}
              </Field>
            )}
          </div>
          <Option
            value="release"
            label="No refund, release payment to the driver"
          />
          <Option
            value="insurance"
            label="Send to the driver’s insurance claim"
          />
        </RadioGroup>
      </FieldSet>

      <Field>
        <FieldLabel htmlFor="decision-note">Decision note</FieldLabel>
        <Textarea
          id="decision-note"
          rows={4}
          required
          placeholder="Explain the decision. Both users will see this."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="bg-background"
        />
      </Field>

      <Button type="submit" size="lg" disabled={!valid} className="w-full">
        Resolve dispute
      </Button>
    </form>
  );
}

function Option({ value, label }: { value: ResolutionChoice; label: string }) {
  const id = `resolution-${value}`;
  return (
    <Label
      htmlFor={id}
      className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 leading-snug font-normal transition-colors hover:bg-background has-data-checked:bg-background"
    >
      <RadioGroupItem id={id} value={value} />
      {label}
    </Label>
  );
}
