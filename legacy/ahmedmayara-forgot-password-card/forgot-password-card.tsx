import { z } from "zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { Input } from "./input";
import { Button } from "./button";
import { Separator } from "./separator";

import { RiDoorLockFill } from "@remixicon/react";

const FormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export const Component = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof FormSchema>> = (data) => {
    console.log(data);
  };

  return (
    <Card className="flex w-full max-w-[440px] shadow-none flex-col gap-6 p-5 md:p-8">
      <CardHeader className="flex flex-col items-center gap-2">
        <div className="relative flex size-[68px] shrink-0 items-center justify-center rounded-full backdrop-blur-xl md:size-24 before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-b before:from-neutral-500 before:to-transparent before:opacity-10">
          <div className="relative z-10 flex size-12 items-center justify-center rounded-full bg-background dark:bg-muted/80 shadow-xs ring-1 ring-inset ring-border md:size-16">
            <RiDoorLockFill className="size-6 text-muted-foreground/80 md:size-8" />
          </div>
        </div>

        <div className="flex flex-col space-y-1.5 text-center">
          <CardTitle className="md:text-xl font-medium">
            Forgot your password?
          </CardTitle>
          <CardDescription className="tracking-[-0.006em]">
            Enter your email address to reset your password.
          </CardDescription>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="p-0">
        <Form {...form}>
          <form
            className="flex flex-col gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    Email <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="name@domain.com"
                      className="rounded-lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Continue
            </Button>

            <p className="text-muted-foreground text-xs">
              Please enter the email address associated with your account. You
              will receive an email with instructions on how to reset your
              password.
            </p>

            <Separator />

            <div className="text-sm flex items-center gap-1">
              <p className="text-muted-foreground">
                Don’t have access anymore?
              </p>
              <Button variant="link" size="sm" className="p-0 underline">
                Try another method
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
