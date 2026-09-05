"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Moon, SunMedium, Monitor, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

function SwitchField({
  id,
  label,
  description,
  icon,
  checked,
  onCheckedChange,
}: {
  id: string;
  label: string;
  description: string;
  icon?: React.ReactNode;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {icon}
          <Label className="font-medium" htmlFor={id}>
            {label}
          </Label>
        </div>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      <Switch checked={checked} id={id} onCheckedChange={onCheckedChange} />
    </div>
  );
}

export default function AppearanceSettings() {
  const [appearance, setAppearance] = React.useState({
    darkMode: false,
    systemTheme: true,
    reduceMotion: false,
  });

  const handleChange = (field: keyof typeof appearance, value: boolean) => {
    setAppearance((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="flex flex-col gap-2 shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="size-5" />
          Appearance
        </CardTitle>
        <CardDescription>
          Customize how the interface looks and feels
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <SwitchField
            id="darkMode"
            label="Dark Mode"
            description="Enable dark theme for low-light environments"
            icon={<Moon className="size-4 text-muted-foreground" />}
            checked={appearance.darkMode}
            onCheckedChange={(checked) => handleChange("darkMode", checked)}
          />

          <Separator />

          <SwitchField
            id="systemTheme"
            label="Use System Theme"
            description="Automatically match your device’s theme"
            icon={<Monitor className="size-4 text-muted-foreground" />}
            checked={appearance.systemTheme}
            onCheckedChange={(checked) => handleChange("systemTheme", checked)}
          />

          <Separator />

          <SwitchField
            id="reduceMotion"
            label="Reduce Motion"
            description="Minimize animations for accessibility and performance"
            icon={<SunMedium className="size-4 text-muted-foreground" />}
            checked={appearance.reduceMotion}
            onCheckedChange={(checked) => handleChange("reduceMotion", checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
