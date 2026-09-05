"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Network } from "lucide-react";
export function PreferencesDialog() {
  const [options, setOptions] = useState({
    subtitles: false,
    hd: false,
    vpn: false,
    history: false,
    favourite: false,
  });

  const [chooseTheme, setChooseTheme] = useState("Default");

  const toggleOption = (key: keyof typeof options) =>
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleApply = () => {
    const selected = Object.entries(options)
      .filter(([_, value]) => value)
      .map(([key]) => key);

    if (selected.length > 0) {
      alert(`✅ Settings Applied:\n${selected.join(", ")}\nTheme: ${chooseTheme}`);
    } else {
      alert(`⚠️ No options selected!\nTheme: ${chooseTheme}`);
    }
  };

  const preferences = [
    { key: "subtitles", label: "Enable Subtitles" },
    { key: "hd", label: "HD Mode" },
    { key: "history", label: "Video History" },
    { key: "favourite", label: "Add Movies to Favourite" },
  ];

  // ✅ Theme list to loop through
  const themes = [
    { key: "Light", label: "Light" },
    { key: "Dark", label: "Dark" },
    { key: "Default", label: "Default" },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-foreground hover:bg-foreground/40 text-background">
          Settings
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Choose Preferences</DialogTitle>
          <DialogDescription>
            Select your preferred viewing and app options below.
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable area */}
        <div className="mt-4 max-h-[300px] overflow-y-auto p-3 space-y-3 custom-scrollbar">
          <div className="flex items-center gap-1.5">
          <Input placeholder="Search" />
          <Button>Search</Button>
          </div>
          <Separator className="my-2" />
          <div>
            <h3 className="font-medium text-sm mb-2">Choose Theme</h3>
            <div className="flex flex-col gap-2">
              {themes.map(({ key, label }) => (
                <label
                  key={key}
                  className="flex items-center gap-2 p-2 border border-border rounded-sm cursor-pointer"
                >
                  <Checkbox
                    id={key}
                    checked={chooseTheme === key}
                    onCheckedChange={() => setChooseTheme(key)}
                  />
                  <Label className="cursor-pointer" htmlFor={key}>{label}</Label>
                </label>
              ))}
            </div>
          </div>
              <Separator className="my-2" />
          <div>
            <h3 className="font-medium text-sm mt-4 mb-2">Preferences</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {preferences.map(({ key, label }, index) => (
                <label
                  key={`${key}-${index}`}
                  className="flex items-center gap-3 rounded-xl border p-3 cursor-pointer hover:bg-muted transition"
                >
                  <Checkbox
                    checked={options[key as keyof typeof options]}
                    onCheckedChange={() => toggleOption(key as keyof typeof options)}
                  />
                  <span className="text-sm font-medium">{label}</span>
                </label>
              ))}
            </div>
            <Separator className="my-2" />
          </div>
          {/* VPN on off container */}
          <div className="border border-border p-2 rounded-sm">
            <h3 className="font-medium text-sm mb-2">VPN Access</h3>
            <div className="flex justify-between">
              <p className="text-lg font-mono leading-tight flex items-center">
              <Network size={15} />
              Free VPN
              </p>
              <Switch />
            </div>

          </div>

        </div>

        <DialogFooter className="mt-6 flex justify-between">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <Button
            onClick={handleApply}
            className="bg-foreground hover:bg-foreground/40 text-background"
          >
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
