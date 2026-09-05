"use client";

import {
  ClaudeAI,
  Cursor,
  Gemini,
  Github,
  OpenAI,
  Replicate,
} from "@aliimam/logos";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Login3 = () => {
  return (
    <section className="">
      <div className="">
        <div className="w-full">
          <div className="grid h-screen w-full lg:grid-cols-2">
            <div className="bg-accent flex flex-col gap-4 p-6 md:p-10">
              <div className="flex justify-center gap-2 md:justify-start">
                <a href="#" className="flex items-center gap-2 font-medium">
                  <img
                    src="https://raw.githubusercontent.com/aliimam-in/aliimam/refs/heads/main/apps/www/public/ai-logo.png"
                    alt="github"
                    className="h-full w-6 items-center justify-center object-contain"
                  />
                  Ali Imam
                </a>
              </div>
              <div className="flex flex-1 items-center justify-center">
                <div className="w-full max-w-lg">
                  <form className="space-y-20 p-10">
                    <div className="flex flex-col gap-2">
                      <h1 className="text-3xl font-semibold">
                        Welcome back, designer. <br /> Log in to your account
                        below.
                      </h1>
                    </div>
                    <div className="grid gap-6">
                      <Button variant="outline" className="w-full">
                        <Github />
                        Sign in with GitHub
                      </Button>

                      <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                        <span className="bg-accent text-muted-foreground relative z-10 px-2">
                          Or
                        </span>
                      </div>
                      <div className="grid gap-3">
                        <Input placeholder="Email" />
                      </div>
                      <div className="grid gap-3">
                        <Input placeholder="Password" />
                      </div>
                      <Button type="submit" className="w-full">
                        Log In
                      </Button>
                    </div>
                    <div className="space-y-3 text-center text-sm">
                      <p>Log in with a magic link instead</p>
                      New to Ali Imam?{" "}
                      <a href="#" className="underline underline-offset-4">
                        Create a studio account
                      </a>
                    </div>
                  </form>
                </div>
              </div>
              <div className="mb-20 flex items-center justify-center gap-2">
                <div className="w-full max-w-lg text-center text-sm">
                  <span> Trouble logging in? </span>
                  <a
                    href="#"
                    className="leading-2 underline underline-offset-4"
                  >
                    Reset your password
                  </a>
                  <p className="mt-3">
                    By using Ali Imam, you acknowledge that we collect and use
                    your personal information as described in our Privacy
                    Policy.
                  </p>
                </div>
              </div>
            </div>

            <div className="hidden h-full w-full flex-col space-y-6 lg:flex">
              <div className="">
                <img
                  src="https://raw.githubusercontent.com/aliimam-in/aliimam/refs/heads/main/apps/www/public/images/device/display.jpg"
                  alt="Ali Imam Background"
                  className="h-[700px] w-full object-cover"
                />
              </div>
              <p className="text-center">Trusted by design teams at</p>
              <div className="mb-6 flex justify-center px-20">
                <div className="mx-auto grid grid-cols-2 gap-3 md:grid-cols-3">
                  {[
                    <OpenAI type="wordmark" key="openai" size={80} />,
                    <ClaudeAI type="wordmark" key="claude" size={80} />,
                    <Replicate type="wordmark" key="replicate" size={80} />,
                    <Cursor type="wordmark" key="cursor" size={80} />,
                    <Gemini type="wordmark" key="gemini" size={80} />,
                    <Github type="wordmark" key="github" size={80} />,
                  ].map((Logo, i) => (
                    <div
                      key={i}
                      className="bg-code w-30 flex h-20 items-center justify-center rounded-md border md:h-24 md:w-40"
                    >
                      {Logo}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Login3 };
