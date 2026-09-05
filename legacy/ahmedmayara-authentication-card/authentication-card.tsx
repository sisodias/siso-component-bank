import { cn } from "../_utils/cn";
import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import { Checkbox } from "./checkbox";
import { Input } from "./input";
import { Label } from "./label";
import { Separator } from "./separator";
import { Button } from "./button";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import { RiUserFill } from "@remixicon/react";

export const Component = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  return (
    <Card className="flex w-full max-w-[440px] shadow-none flex-col gap-6 p-5 md:p-8">
      <CardHeader className="flex flex-col items-center gap-2">
        <div className="relative flex size-[68px] shrink-0 items-center justify-center rounded-full backdrop-blur-xl md:size-24 before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-b before:from-neutral-500 before:to-transparent before:opacity-10">
          <div className="relative z-10 flex size-12 items-center justify-center rounded-full bg-background dark:bg-muted/80 shadow-xs ring-1 ring-inset ring-border md:size-16">
            <RiUserFill className="size-6 text-muted-foreground/80 md:size-8" />
          </div>
        </div>

        <div className="flex flex-col space-y-1.5 text-center">
          <CardTitle className="md:text-xl font-medium">
            Sign in to your account
          </CardTitle>
          <CardDescription className="tracking-[-0.006em]">
            Enter your credentials to access your account.
          </CardDescription>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="p-0">
        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-2.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="Enter your email"
              className="rounded-lg"
            />
          </div>

          <div className="flex flex-col gap-2.5">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                className="pe-9 rounded-lg"
                placeholder="Password"
                type={isVisible ? "text" : "password"}
              />
              <button
                className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                type="button"
                onClick={toggleVisibility}
                aria-label={isVisible ? "Hide password" : "Show password"}
                aria-pressed={isVisible}
                aria-controls="password"
              >
                {isVisible ? (
                  <EyeOffIcon size={16} aria-hidden="true" />
                ) : (
                  <EyeIcon size={16} aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-start gap-2">
              <Checkbox id="keep-me-logged-in" />
              <Label
                htmlFor="keep-me-logged-in"
                className="block cursor-pointer"
              >
                Keep me logged in
              </Label>
            </div>
            <Button variant="link" size="sm" className="p-0">
              Forgot password?
            </Button>
          </div>

          <Button type="button" className="w-full">
            Continue
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
