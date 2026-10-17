"use client";

import { ViewIcon, ViewOffSlashIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

export function PasswordInput(props: React.ComponentProps<"input">) {
  const [visible, setVisible] = useState(false);
  return (
    <InputGroup className="h-9">
      <InputGroupInput {...props} type={visible ? "text" : "password"} />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          size="icon-xs"
          aria-label={visible ? "Hide password" : "Show password"}
          onClick={() => setVisible((v) => !v)}
        >
          <HugeiconsIcon
            icon={visible ? ViewOffSlashIcon : ViewIcon}
            strokeWidth={2}
          />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}
