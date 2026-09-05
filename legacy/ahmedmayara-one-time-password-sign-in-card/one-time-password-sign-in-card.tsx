import { z } from "zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "./button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "./input-otp";
import { Separator } from "./separator";

const FormSchema = z.object({
  code: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

export const Component = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof FormSchema>> = (data) => {
    console.log(data);
  };

  return (
    <Card className="flex w-full max-w-[480px] shadow-none flex-col gap-6 p-5 md:p-8">
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
                d="M13 19c0-3.31 2.69-6 6-6c1.1 0 2.12.3 3 .81V6a2 2 0 0 0-2-2H4c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h9.09c-.05-.33-.09-.66-.09-1M4 8V6l8 5l8-5v2l-8 5zm13.75 14.16l-2.75-3L16.16 18l1.59 1.59L21.34 16l1.16 1.41z"
              />
            </svg>
          </div>
        </div>

        <div className="flex flex-col space-y-1.5 text-center">
          <CardTitle className="md:text-xl font-medium">
            Enter your one-time password
          </CardTitle>
          <CardDescription className="tracking-[-0.006em]">
            We've sent a code to your email. Please enter it below.
          </CardDescription>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="p-0">
        <Form {...form}>
          <form
            className="flex flex-col"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem className="gap-4">
                    <FormLabel className="sr-only">Code</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup className="gap-4">
                          <InputOTPSlot
                            index={0}
                            className="size-[60px] md:size-14 text-lg border rounded-md"
                          />
                          <InputOTPSlot
                            index={1}
                            className="size-[60px] md:size-14 text-lg border rounded-md"
                          />
                          <InputOTPSlot
                            index={2}
                            className="size-[60px] md:size-14 text-lg border rounded-md"
                          />
                          <InputOTPSlot
                            index={3}
                            className="size-[60px] md:size-14 text-lg border rounded-md"
                          />
                          <InputOTPSlot
                            index={4}
                            className="size-[60px] md:size-14 text-lg border rounded-md"
                          />
                          <InputOTPSlot
                            index={5}
                            className="size-[60px] md:size-14 text-lg border rounded-md"
                          />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Continue
              </Button>
            </div>

            <Separator className="mt-6 mb-2.5" />

            <div className="text-sm flex items-center gap-1">
              <p className="text-muted-foreground">
                Experiencing issues receiving the code?
              </p>
              <Button variant="link" size="sm" className="p-0 underline">
                Resend Code
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
