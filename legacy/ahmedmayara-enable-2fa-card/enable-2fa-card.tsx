import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./card";
import { Separator } from "./separator";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "./input-otp";
import { cn } from "../_utils/cn";

const STEPS: {
  title: string;
  description: string;
  isCurrent?: boolean;
  content?: React.ReactNode;
}[] = [
  {
    title: "Download app",
    description: "Download a mobile authentication app.",
  },
  {
    title: "Scan QR code",
    description:
      "Scan this QR code using a mobile authentication app. This will generate a verification code.",
    content: (
      <div className="inline-block p-1 border rounded-lg">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/4/41/QR_Code_Example.svg"
          alt="QR Code"
          className="size-32 dark:invert"
        />
      </div>
    ),
  },
  {
    title: "Enter code",
    description:
      "Enter the verification code provided by your mobile authentication app.",
    content: (
      <InputOTP maxLength={6}>
        <InputOTPGroup className="gap-2.5">
          <InputOTPSlot index={0} className="border rounded-lg" />
          <InputOTPSlot index={1} className="border rounded-lg" />
          <InputOTPSlot index={2} className="border rounded-lg" />
          <InputOTPSlot index={3} className="border rounded-lg" />
          <InputOTPSlot index={4} className="border rounded-lg" />
          <InputOTPSlot index={5} className="border rounded-lg" />
        </InputOTPGroup>
      </InputOTP>
    ),
  },
];

export const Component = () => {
  return (
    <Card className="flex w-full max-w-[500px] shadow-none flex-col gap-6 p-5 md:p-8">
      <CardHeader className="flex flex-col items-center gap-2">
        <div className="relative flex size-[68px] shrink-0 items-center justify-center rounded-full backdrop-blur-xl md:size-24 before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-b before:from-neutral-500 before:to-transparent before:opacity-10">
          <div className="relative z-10 flex size-12 items-center justify-center rounded-full bg-background dark:bg-muted/80 shadow-xs ring-1 ring-inset ring-border md:size-16">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              className="size-6 text-muted-foreground/80 md:size-8"
            >
              <path
                fill="currentColor"
                fill-rule="evenodd"
                d="M3.378 5.082C3 5.62 3 7.22 3 10.417v1.574c0 5.638 4.239 8.375 6.899 9.536c.721.315 1.082.473 2.101.473c1.02 0 1.38-.158 2.101-.473C16.761 20.365 21 17.63 21 11.991v-1.574c0-3.198 0-4.797-.378-5.335c-.377-.537-1.88-1.052-4.887-2.081l-.573-.196C13.595 2.268 12.812 2 12 2s-1.595.268-3.162.805L8.265 3c-3.007 1.03-4.51 1.545-4.887 2.082M13.5 15a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1.401A2.999 2.999 0 0 1 12 8a3 3 0 0 1 1.5 5.599z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>

        <div className="flex flex-col space-y-1.5 text-center">
          <CardTitle className="md:text-xl font-medium">
            Enable Two-Factor Authentication
          </CardTitle>
          <CardDescription className="tracking-[-0.006em]">
            Secure your account with an additional layer of protection.
          </CardDescription>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="p-0">
        <div className="grid items-start justify-start grid-cols-1!">
          {STEPS.map((step, index) => (
            <div
              key={index}
              className={cn(
                "relative flex flex-row items-start before:absolute before:start-0 gap-3 last:after:hidden after:absolute after:top-9 after:bottom-2 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-border",
                index !== STEPS.length - 1 && "pb-6"
              )}
            >
              <div className="flex flex-col items-center self-stretch">
                <span className="z-10 text-xs font-semibold flex shrink-0 items-center justify-center rounded-full bg-muted ring-1 ring-inset ring-border text-foreground size-7">
                  {index + 1}
                </span>
              </div>
              <div className="flex flex-col items-start">
                <p className="text-sm leading-5 tracking-[-0.006em] font-semibold text-foreground">
                  {step.title}
                </p>
                <p className="text-sm leading-5 tracking-[-0.006em] text-muted-foreground">
                  {step.description}
                </p>
                <div className="mt-2.5">{step.content && step.content}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
