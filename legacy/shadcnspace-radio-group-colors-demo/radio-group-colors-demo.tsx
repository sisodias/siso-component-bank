"use client";

import { Label } from "./label";
import { RadioGroup, RadioGroupItem } from "./radio-group";

const RadioGroupColorsDemo = () => {
  return (
    <RadioGroup
      defaultValue="destructive"
      className="flex items-center gap-6 justify-center"
    >
      <div className="flex items-center gap-2">
        <RadioGroupItem
          value="destructive"
          id="color-destructive"
          className="border-destructive text-destructive cursor-pointer"
        />
        <Label htmlFor="color-destructive" className="text-destructive cursor-pointer font-medium leading-none">
          Error
        </Label>
      </div>

      <div className="flex items-center gap-2">
        <RadioGroupItem
          value="success"
          id="color-success"
          className="border-teal-500 text-teal-500 cursor-pointer"
        />
        <Label htmlFor="color-success" className="text-teal-500 cursor-pointer font-medium leading-none">
          Approved
        </Label>
      </div>

      <div className="flex items-center gap-2">
        <RadioGroupItem
          value="info"
          id="color-info"
          className="border-amber-500 text-amber-500 cursor-pointer"
        />
        <Label htmlFor="color-info" className="text-amber-500 cursor-pointer font-medium leading-none">
          Alert
        </Label>
      </div>
    </RadioGroup>
  );
};

export default RadioGroupColorsDemo;