"use client"

import {
  RiCustomerService2Line,
  RiErrorWarningLine,
  RiRefreshLine,
} from "@remixicon/react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty-states-4-utils/empty"
import { Toaster } from "@/components/ui/sonner"

export default function EmptyStatesBlock() {
  return (
    <section className="flex w-full items-center justify-center bg-muted/30 px-6 py-16 text-foreground">
      <Toaster />
      <div className="w-full max-w-md border border-border bg-card">
        <Empty className="border-0">
          <EmptyHeader>
            <EmptyMedia
              variant="icon"
              className="bg-destructive/10 text-destructive"
            >
              <RiErrorWarningLine className="size-4" />
            </EmptyMedia>
            <EmptyTitle>Something went wrong</EmptyTitle>
            <EmptyDescription>
              We hit an unexpected error while loading your data. Check your
              connection and try again in a few moments.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex flex-col items-center gap-2 sm:flex-row">
              <Button
                onClick={() =>
                  toast.success("Retrying…", {
                    id: "retrying",
                    description: "Reloading your data.",
                  })
                }
              >
                <RiRefreshLine data-icon="inline-start" />
                Try Again
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  toast("Support", {
                    id: "support",
                    description: "Opening a support ticket.",
                  })
                }
              >
                <RiCustomerService2Line data-icon="inline-start" />
                Contact Support
              </Button>
            </div>
          </EmptyContent>
        </Empty>
      </div>
    </section>
  )
}
