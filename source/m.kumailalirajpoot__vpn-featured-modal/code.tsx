"use client"

import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Shield, Zap, Globe, Ban } from "lucide-react" // Lucide icons

export function TurboVpn() {
  const [vpnOn, setVpnOn] = useState(false)

  // Dynamic features list with descriptions
  const [features, setFeatures] = useState([
    {
      id: "thirdPartyAccess",
      label: "Third-Party App Access",
      description: "Allow selected apps to use VPN while keeping others on normal connection.",
      enabled: false,
      icon: Globe,
    },
    {
      id: "blockAds",
      label: "Block Ads",
      description: "Automatically block intrusive ads and trackers for a cleaner browsing experience.",
      enabled: false,
      icon: Ban,
    },
    {
      id: "fastSpeed",
      label: "Fast Speed",
      description: "Enable high-speed servers for faster streaming and downloads.",
      enabled: false,
      icon: Zap,
    },
  ])

  // Toggle handler
  const toggleFeature = (id: string, value: boolean) => {
    setFeatures((prev) =>
      prev.map((f) => (f.id === id ? { ...f, enabled: value } : f))
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Open VPN Settings</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-500" />
            Turbo VPN
          </DialogTitle>
          <DialogDescription>
            Manage your VPN and toggle available features.
          </DialogDescription>
        </DialogHeader>

        {/* VPN Main Switch */}
        <div className="flex items-center justify-between p-3 border-b">
          <Label className="text-base font-medium">VPN</Label>
          <Switch checked={vpnOn} onCheckedChange={setVpnOn} />
        </div>

        {/* Feature Toggles (Loop) */}
        <div className="space-y-3 mt-3 p-3">
          {features.map(({ id, label, description, enabled, icon: Icon }) => (
            <div
              key={id}
              className="flex items-center justify-between bg-muted/40 rounded-lg px-3 py-3"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-primary" />
                  <Label className="text-sm font-medium">{label}</Label>
                </div>
                <p className="text-xs text-muted-foreground pl-6">{description}</p>
              </div>
              <Switch
                checked={enabled}
                onCheckedChange={(val) => toggleFeature(id, val)}
                disabled={!vpnOn}
              />
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button onClick={() => setVpnOn(false)} variant="outline">
            Disconnect
          </Button>
          <Button disabled={!vpnOn}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
