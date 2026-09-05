import { cn } from "@/lib/utils";
import { useState } from "react";
import { Badge } from '@/components/ui/badge';

export const Component = () => {
  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex items-center gap-4">
        <Badge appearance="stroke">Stroke</Badge>
        <Badge variant="primary">Primary</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="success">Success</Badge>
      </div>
      <div className="flex items-center gap-4">
        <Badge variant="warning">Warining</Badge>
        <Badge variant="info">Info</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="mono">Mono</Badge>
      </div>
    </div>
  );
};
