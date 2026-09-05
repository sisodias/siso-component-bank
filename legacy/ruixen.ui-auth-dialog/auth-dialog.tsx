"use client"

import { useState, useId } from "react"
import { Button } from "./button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "./dialog"
import { Input } from "./input"
import { Label } from "./label"
import { Eye, EyeOff } from "lucide-react"

export default function AuthDialog() {
  const [mode, setMode] = useState<"signup" | "login">("signup")
  const [showPassword, setShowPassword] = useState(false)
  const id = useId()

  const toggleMode = () => setMode(mode === "signup" ? "login" : "signup")
  const togglePassword = () => setShowPassword(!showPassword)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-lg">Sign up / Login</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md !rounded-2xl">
        <div className="flex flex-col items-center gap-2">
          <DialogHeader>
            <DialogTitle className="sm:text-center">
              {mode === "signup" ? "Sign Up" : "Login"}
            </DialogTitle>
            <DialogDescription className="sm:text-center">
              {mode === "signup"
                ? "We just need a few details to get you started."
                : "Enter your credentials to log in."}
            </DialogDescription>
          </DialogHeader>
        </div>

        <form className="space-y-4">
          {mode === "signup" && (
            <div className="space-y-4">
              <div className="*:not-first:mt-2">
                <Label htmlFor={`${id}-name`}>Full name</Label>
                <Input
                  id={`${id}-name`}
                  placeholder="Matt Welsh"
                  type="text"
                  required
                  className="rounded-lg"
                />
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="*:not-first:mt-2">
              <Label htmlFor={`${id}-email`}>Email</Label>
              <Input
                id={`${id}-email`}
                placeholder="hi@yourcompany.com"
                type="email"
                required
                className="rounded-lg"
              />
            </div>
            <div className="relative">
              <Label htmlFor={`${id}-password`}>Password</Label>
              <Input
                id={`${id}-password`}
                placeholder="Enter your password"
                type={showPassword ? "text" : "password"}
                required
                className="rounded-lg pr-10"
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-3 top-[38px] text-muted-foreground"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button type="button" className="w-full rounded-lg">
            {mode === "signup" ? "Sign Up" : "Login"}
          </Button>
        </form>

        <div className="mt-2 text-center text-sm text-muted-foreground">
          {mode === "signup" ? (
            <>
              Already have an account?{" "}
              <button className="underline" onClick={toggleMode}>
                Login
              </button>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <button className="underline" onClick={toggleMode}>
                Sign Up
              </button>
            </>
          )}
        </div>

        {mode === "signup" && (
          <>
            <div className="before:bg-border after:bg-border flex items-center gap-3 before:h-px before:flex-1 after:h-px after:flex-1 my-4">
              <span className="text-muted-foreground text-xs">Or</span>
            </div>
            <Button variant="outline" className="w-full rounded-lg">
              Continue with Google
            </Button>
            <p className="text-muted-foreground text-center text-xs mt-2">
              By signing up you agree to our{" "}
              <a className="underline hover:no-underline" href="#">
                Terms
              </a>
              .
            </p>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
