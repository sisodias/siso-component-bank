"use client";

import React from "react";
import * as SubframeCore from "@subframe/core";
import { FeatherChevronDown } from "@subframe/core";

export const SubframeUtils = {
  twClassNames: SubframeCore.createTwClassNames([
    "text-caption",
    "text-caption-bold",
    "text-body",
    "text-body-bold",
    "text-heading-3",
    "text-heading-2",
    "text-heading-1",
    "text-monospace-body",
  ]),
};

interface ChevronProps
  extends React.ComponentProps<typeof SubframeCore.Collapsible.Chevron> {
  className?: string;
}

const Chevron = React.forwardRef<
  React.ElementRef<typeof FeatherChevronDown>,
  ChevronProps
>(function Chevron({ className, ...otherProps }: ChevronProps, ref) {
  return (
    <SubframeCore.Collapsible.Chevron {...otherProps}>
      <FeatherChevronDown
        className={SubframeUtils.twClassNames(
          "text-body font-body text-default-font",
          className
        )}
        ref={ref}
      />
    </SubframeCore.Collapsible.Chevron>
  );
});

interface ContentProps
  extends React.ComponentProps<typeof SubframeCore.Collapsible.Content> {
  children?: React.ReactNode;
  className?: string;
}

const Content = React.forwardRef<HTMLDivElement, ContentProps>(function Content(
  { children, className, ...otherProps }: ContentProps,
  ref
) {
  return children ? (
    <SubframeCore.Collapsible.Content asChild {...otherProps}>
      <div
        className={SubframeUtils.twClassNames(
          // было w-full → делаем гибким
          "flex w-auto flex-col items-start gap-2",
          className
        )}
        ref={ref}
      >
        {children}
      </div>
    </SubframeCore.Collapsible.Content>
  ) : null;
});

interface TriggerProps
  extends React.ComponentProps<typeof SubframeCore.Collapsible.Trigger> {
  children?: React.ReactNode;
  className?: string;
}

const Trigger = React.forwardRef<HTMLDivElement, TriggerProps>(function Trigger(
  { children, className, ...otherProps }: TriggerProps,
  ref
) {
  return children ? (
    <SubframeCore.Collapsible.Trigger asChild {...otherProps}>
      <div
        className={SubframeUtils.twClassNames(
          // было w-full → делаем гибким
          "flex w-auto cursor-pointer flex-col items-start gap-2",
          className
        )}
        ref={ref}
      >
        {children}
      </div>
    </SubframeCore.Collapsible.Trigger>
  ) : null;
});

interface AccordionRootProps
  extends React.ComponentProps<typeof SubframeCore.Collapsible.Root> {
  trigger?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

const AccordionRoot = React.forwardRef<HTMLDivElement, AccordionRootProps>(
  function AccordionRoot(
    { trigger, children, className, ...otherProps }: AccordionRootProps,
    ref
  ) {
    return (
      <SubframeCore.Collapsible.Root asChild {...otherProps}>
        <div
          className={SubframeUtils.twClassNames(
            // было w-full → теперь по содержимому; ширину можно задавать через className снаружи
            "group/d2e81e20 flex w-auto flex-col items-start rounded-md",
            className
          )}
          ref={ref}
        >
          <Trigger>
            {trigger ? (
              <div className="flex w-auto flex-col items-start group-data-[state=open]/d2e81e20:h-auto">
                {trigger}
              </div>
            ) : null}
          </Trigger>
          <Content>
            {children ? (
              <div className="flex w-auto flex-col items-start">
                {children}
              </div>
            ) : null}
          </Content>
        </div>
      </SubframeCore.Collapsible.Root>
    );
  }
);

export const Accordion = Object.assign(AccordionRoot, {
  Chevron,
  Content,
  Trigger,
});
