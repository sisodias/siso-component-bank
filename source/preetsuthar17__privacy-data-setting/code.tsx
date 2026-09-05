"use client";

import {
  AlertCircle,
  Bell,
  Database,
  Globe,
  Shield,
} from "lucide-react";

import * as React from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// Reusable switch field
function SwitchField({
  id,
  label,
  description,
  icon,
  checked,
  onCheckedChange,
  badge,
}: {
  id: string;
  label: string;
  description: string;
  icon?: React.ReactNode;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  badge?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {icon}
          <Label className="font-medium" htmlFor={id}>
            {label}
          </Label>
          {badge}
        </div>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      <Switch checked={checked} id={id} onCheckedChange={onCheckedChange} />
    </div>
  );
}

export default function PrivacyDataSettings() {
  // Local state for privacy settings
  const [privacy, setPrivacy] = React.useState({
    analytics: true,
    crashReports: true,
    usageData: false,
    marketing: false,
  });

  const handleChange = (field: keyof typeof privacy, value: boolean) => {
    setPrivacy((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="gap-2 flex flex-col shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield aria-hidden="true" className="size-5" />
          Privacy & Data
        </CardTitle>
        <CardDescription>
          Control what data is collected and how it's used
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <SwitchField
            checked={privacy.analytics}
            description="Help improve the app by sharing anonymous usage analytics"
            icon={<Database className="size-4 text-muted-foreground" />}
            id="analytics"
            label="Analytics"
            onCheckedChange={(checked) => handleChange("analytics", checked)}
          />

          <Separator />

          <SwitchField
            checked={privacy.crashReports}
            description="Automatically send crash reports to help fix bugs"
            icon={<AlertCircle className="size-4 text-muted-foreground" />}
            id="crashReports"
            label="Crash Reports"
            onCheckedChange={(checked) => handleChange("crashReports", checked)}
          />

          <Separator />

          <SwitchField
            checked={privacy.usageData}
            description="Share detailed usage patterns for product improvement"
            icon={<Globe className="size-4 text-muted-foreground" />}
            id="usageData"
            label="Usage Data"
            onCheckedChange={(checked) => handleChange("usageData", checked)}
          />

          <Separator />

          <SwitchField
            checked={privacy.marketing}
            description="Receive product updates and promotional content"
            icon={<Bell className="size-4 text-muted-foreground" />}
            id="marketing"
            label="Marketing Communications"
            onCheckedChange={(checked) => handleChange("marketing", checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
