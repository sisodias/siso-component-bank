"use client";

import { useState, useId } from "react";
import { Switch } from "./switch";
import { Label } from "./label";
import { BellOff, BellRing } from "lucide-react";

const SwitchWithIconDemo = () => {
  const id = useId();
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id={id}
        checked={enabled}
        onCheckedChange={setEnabled}
      />
      <Label htmlFor={id} className="cursor-pointer flex items-center gap-1">
        Notifications{" "}
        {enabled ? (
          <BellOff className="size-4" />
        ) : (
          <BellRing className="size-4" />
        )}
      </Label>
    </div>
  );
};

export default SwitchWithIconDemo;
