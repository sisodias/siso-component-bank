"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Option {
  value: string;
  label: string;
}

interface ContextAwareSelectProps {
  userRole: string;
}

const DynamicSelect: React.FC<ContextAwareSelectProps> = ({ userRole }) => {
  const [country, setCountry] = useState<string | undefined>();
  const [stateOptions, setStateOptions] = useState<Option[]>([]);

  // Country options (could be fetched from API)
  const countries: Option[] = [
    { value: "india", label: "India" },
    { value: "usa", label: "USA" },
    { value: "uk", label: "UK" },
  ];

  // Dynamic state options based on country and userRole
  useEffect(() => {
    if (!country) {
      setStateOptions([]);
      return;
    }

    let options: Option[] = [];
    switch (country) {
      case "india":
        options = userRole === "admin"
          ? [{ value: "maharashtra", label: "Maharashtra" }, { value: "karnataka", label: "Karnataka" }]
          : [{ value: "delhi", label: "Delhi" }, { value: "tamilnadu", label: "Tamil Nadu" }];
        break;
      case "usa":
        options = userRole === "admin"
          ? [{ value: "california", label: "California" }, { value: "texas", label: "Texas" }]
          : [{ value: "newyork", label: "New York" }, { value: "florida", label: "Florida" }];
        break;
      case "uk":
        options = [{ value: "london", label: "London" }, { value: "manchester", label: "Manchester" }];
        break;
    }

    setStateOptions(options);
  }, [country, userRole]);

  const [state, setState] = useState<string | undefined>();

  return (
    <div className="space-y-4 max-w-sm mx-auto mt-10">
      <Select onValueChange={(val) => { setCountry(val); setState(undefined); }}>
        <SelectTrigger>
          <SelectValue placeholder="Select country" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Country</SelectLabel>
            {countries.map((c) => (
              <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select value={state} onValueChange={setState} disabled={!stateOptions.length}>
        <SelectTrigger>
          <SelectValue placeholder="Select state/province" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>State / Province</SelectLabel>
            {stateOptions.map((s) => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <div className="text-sm text-gray-700">
        Selected: {country ? country : "None"} {state ? `> ${state}` : ""}
      </div>
    </div>
  );
};

export default DynamicSelect;
