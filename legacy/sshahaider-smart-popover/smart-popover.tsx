'use client';

import * as React from 'react';
import { cn } from "../_utils/cn";
import { useIsMobile } from '@/hooks/use-media-query';
import {
	Popover,
	PopoverHeader,
	PopoverBody,
	PopoverContent,
	PopoverTrigger,
	PopoverFooter,
	PopoverTitle,
	PopoverDescription,
	PopoverClose
} from "./popover";
import {
	Drawer,
	DrawerTrigger,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerDescription,
	DrawerFooter,
	DrawerBody,
	DrawerClose
} from "./drawer";

const SmartPopoverContext = React.createContext<{ isMobile: boolean } | null>(
	null,
);

function useSmartPopoverContext() {
	const context = React.useContext(SmartPopoverContext);
	if (!context) {
		throw new Error(
			'SmartPopoverTrigger or SmartPopoverContent must be used within <SmartPopover>',
		);
	}
	return context;
}

type SmartPopoverProps = {
	children: React.ReactNode;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	defaultOpen?: boolean;
	popoverProps?: React.ComponentProps<typeof Popover>;
	drawerProps?: React.ComponentProps<typeof Drawer>;
};

function SmartPopover({
	children,
	open,
	onOpenChange,
	defaultOpen,
	popoverProps,
	drawerProps,
}: SmartPopoverProps) {
	const isMobile = useIsMobile();
	const Component = isMobile ? Drawer : Popover;
	const props = isMobile ? drawerProps : popoverProps;

	return (
		<SmartPopoverContext.Provider value={{ isMobile }}>
			<Component
				open={open ?? defaultOpen}
				onOpenChange={onOpenChange}
				{...props}
			>
				{children}
			</Component>
		</SmartPopoverContext.Provider>
	);
}

function SmartPopoverTrigger({
	children,
	drawerProps,
	popoverProps,
}: {
	children: React.ReactNode;
	asChild?: boolean;
	drawerProps?: React.ComponentProps<typeof DrawerTrigger>;
	popoverProps?: React.ComponentProps<typeof PopoverTrigger>;
}) {
	const { isMobile } = useSmartPopoverContext();
	const Trigger = isMobile ? DrawerTrigger : PopoverTrigger;
	const props = isMobile ? drawerProps : popoverProps;

	return (
		<Trigger asChild {...props}>
			{children}
		</Trigger>
	);
}

function SmartPopoverContent({
	children,
	drawerProps,
	className,
	popoverProps,
}: {
	children: React.ReactNode;
	className?: React.ComponentProps<'div'>['className'];
	popoverProps?: React.ComponentProps<typeof PopoverContent>;
	drawerProps?: React.ComponentProps<typeof DrawerContent>;
}) {
	const { isMobile } = useSmartPopoverContext();
	const Content = isMobile ? DrawerContent : PopoverContent;
	const props = isMobile ? drawerProps : popoverProps;

	return (
		<Content className={cn(!isMobile && 'p-0', className)} {...props}>
			{children}
		</Content>
	);
}

function SmartPopoverHeader(props: React.ComponentProps<'div'>) {
	const { isMobile } = useSmartPopoverContext();
	const Header = isMobile ? DrawerHeader : PopoverHeader;

	return <Header {...props} />;
}

function SmartPopoverTitle(props: React.ComponentProps<'p'>) {
	const { isMobile } = useSmartPopoverContext();
	const Title = isMobile ? DrawerTitle : PopoverTitle;
	return <Title {...props} />;
}

function SmartPopoverDescription(props: React.ComponentProps<'p'>) {
	const { isMobile } = useSmartPopoverContext();
	const Description = isMobile ? DrawerDescription : PopoverDescription;
	return <Description {...props} />;
}

function SmartPopoverFooter(props: React.ComponentProps<'div'>) {
	const { isMobile } = useSmartPopoverContext();
	const Footer = isMobile ? DrawerFooter : PopoverFooter;
	return <Footer {...props} />;
}

function SmartPopoverBody(props: React.ComponentProps<'div'>) {
	const { isMobile } = useSmartPopoverContext();
	const Body = isMobile ? DrawerBody : PopoverBody;
	return <Body {...props} />;
}

function SmartPopoverClose(props: React.ComponentProps<typeof DrawerClose>) {
	const { isMobile } = useSmartPopoverContext();
	const Close = isMobile ? DrawerClose : PopoverClose;
	return <Close {...props} />;
}

export {
	SmartPopover,
	SmartPopoverTrigger,
	SmartPopoverContent,
	SmartPopoverHeader,
	SmartPopoverBody,
	SmartPopoverTitle,
	SmartPopoverDescription,
	SmartPopoverFooter,
	SmartPopoverClose,
};
