"use client";

import { GradientSelector, type GradientOption } from "./gradient-selector-card";

export default function Demo() {
  const handleSelectionChange = (option: GradientOption, index: number) => {
    console.log("Selected:", option.label, "Index:", index);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <GradientSelector
        defaultSelected="5m"
        onSelectionChange={handleSelectionChange}
        className="w-full max-w-3xl"
      />
    </div>
  );
}