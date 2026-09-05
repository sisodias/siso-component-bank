"use client" 
import { GradientMesh } from "@/components/ui/gradient-mesh";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field-1"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Github } from "@aliimam/logos"
import { cn } from "@/lib/utils"

export function DemoPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" aria-label="home" className="flex gap-2 items-center">
            <img
              src="https://raw.githubusercontent.com/aliimam-in/aliimam/refs/heads/main/apps/www/public/brand/ai-logo-white.png"
              alt="Your Image"
              height={50}
              width={50}
              className="h-10 z-10 w-full hidden dark:block object-contain"
            />
            <img
              src="https://raw.githubusercontent.com/aliimam-in/aliimam/refs/heads/main/apps/www/public/brand/ai-logo-black.png"
              alt="Your Image"
              height={50}
              width={50}
              className="h-10 z-10 w-full dark:hidden block object-contain"
            />
          </a>
        </div>
        <div className="flex flex-1 w-full items-center justify-center">
          <div className="w-screen">
            <form className="flex flex-col gap-6">
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" type="email" placeholder="contact@aliimam.in" required />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input id="password" 
          placeholder="password" type="password" required />
        </Field>
        <Field>
          <Button type="submit">Login</Button>
        </Field>
        <FieldSeparator>Or continue with</FieldSeparator>
        <Field>
          <Button className="flex gap-2" variant="outline" type="button">
             <Github/> <span>Login with GitHub </span>
          </Button>
          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <a href="#" className="underline underline-offset-4">
              Sign up
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <GradientMesh
          colors={["#bcecf6", "#00aaff", "#ffd447"]}
          distortion={8}
          swirl={0.2}
          speed={1}
          rotation={90}
          waveAmp={0.2}
          waveFreq={20}
          waveSpeed={0.2}
          grain={0.06}
        />
      </div>
    </div>
  );
}
