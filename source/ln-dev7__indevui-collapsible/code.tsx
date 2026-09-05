'use client';

import * as React from 'react';
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';

const Collapsible = React.forwardRef<
   React.ElementRef<typeof CollapsiblePrimitive.Root>,
   React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Root>
>((props, ref) => <CollapsiblePrimitive.Root ref={ref} {...props} />);
Collapsible.displayName = 'Collapsible';

const CollapsibleTrigger = React.forwardRef<
   React.ElementRef<typeof CollapsiblePrimitive.Trigger>,
   React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Trigger>
>((props, ref) => <CollapsiblePrimitive.Trigger ref={ref} {...props} />);
CollapsibleTrigger.displayName = 'CollapsibleTrigger';

const CollapsibleContent = React.forwardRef<
   React.ElementRef<typeof CollapsiblePrimitive.Content>,
   React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Content>
>((props, ref) => <CollapsiblePrimitive.Content ref={ref} {...props} />);
CollapsibleContent.displayName = 'CollapsibleContent';

export { Collapsible, CollapsibleTrigger, CollapsibleContent };