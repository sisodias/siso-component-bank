"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ShieldCheck, Smartphone, KeyRound, Lock } from "lucide-react";

export default function Google2FADialog() {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");

  const handleVerify = () => {
    console.log("2FA code entered:", code);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl font-medium">
          Enable Google 2-Step Verification
        </Button>
      </DialogTrigger>

      <DialogContent
        className="max-w-md rounded-2xl p-6 sm:p-8 shadow-lg"
        aria-describedby={undefined}
      >
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
            <ShieldCheck className="size-5 text-green-500" />
            Secure Your Account
          </DialogTitle>
          <DialogDescription>
            Set up Google 2-Step Verification to add an extra layer of security
            to your account.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Step 1 */}
          <div className="flex items-start gap-3">
            <Smartphone className="size-5 mt-1 text-muted-foreground" />
            <div>
              <h3 className="font-medium mb-1">Step 1: Get the App</h3>
              <p className="text-sm text-muted-foreground">
                Install the Google Authenticator app on your phone from the App Store
                or Google Play.
              </p>
            </div>
          </div>

          <Separator />

          {/* Step 2 */}
          <div className="flex items-start gap-3">
            <KeyRound className="size-5 mt-1 text-muted-foreground" />
            <div>
              <h3 className="font-medium mb-1">Step 2: Add Your Account</h3>
              <p className="text-sm text-muted-foreground">
                In the Authenticator app, tap the plus icon and choose{" "}
                <strong>“Enter a setup key”</strong>. Enter the key we provide to link your account.
              </p>
            </div>
          </div>

          <Separator />

          {/* Step 3 */}
          <div className="flex items-start gap-3">
            <Lock className="size-5 mt-1 text-muted-foreground" />
            <div className="w-full">
              <h3 className="font-medium mb-2">Step 3: Enter Your 6-Digit Code</h3>
              <Input
                placeholder="Enter code"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-40 text-center tracking-widest text-lg"
              />
            </div>
          </div>

          <Separator />

          {/* Step 4 */}
          <div className="space-y-2">
            <h3 className="font-medium">Step 4: Verify & Enable</h3>
            <p className="text-sm text-muted-foreground">
              Enter your code and click “Verify” to complete setup.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleVerify}>Verify</Button>
            </div>
          </div>

          <div className="mt-5 text-xs text-muted-foreground border-t pt-3 text-center">
            🔒 Keep your backup codes in a safe place. Don’t share your
            verification code with anyone.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
