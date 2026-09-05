'use client';
import React from 'react';
import {
	Modal,
	ModalTrigger,
	ModalBody,
	ModalContent,
	ModalHeader,
	ModalTitle,
} from "./modal";
import Link from 'next/link';
import { Button } from './button';
import { Input } from './input';
import { Grid2x2Plus, PlusIcon } from 'lucide-react';
import { Label } from './label';

export function CreateWorkspaceModal() {
	const [open, setOpen] = React.useState(false);

	return (
		<Modal open={open} onOpenChange={setOpen}>
			<ModalTrigger asChild>
				<Button>
					<PlusIcon className="mr-1 size-4" />
					Create Workspace
				</Button>
			</ModalTrigger>

			<ModalContent className="md:max-w-md">
				<ModalHeader className="items-center py-10">
					<Grid2x2Plus className="size-9" />
					<div className="flex flex-col items-center space-y-1">
						<ModalTitle className="text-2xl font-medium">
							Create a workspace
						</ModalTitle>
						<Link
							href="#"
							target="_blank"
							className="text-muted-foreground underline transition-colors"
						>
							What is a workspace?
						</Link>
					</div>
				</ModalHeader>
				<ModalBody className="space-y-4 p-4 md:p-4">
					<div className="grid gap-2">
						<Label>Workspace Name</Label>
						<Input placeholder="e.g., Acme, Inc." />
					</div>
					<div className="grid gap-2">
						<Label>Workspace Slug</Label>

						<div className="flex rounded-md shadow-xs">
							<span className="border-input bg-input/30 text-muted-foreground inline-flex items-center rounded-s-md border px-3 text-sm">
								example.com
							</span>
							<Input
								placeholder="e.g., acme"
								className="-ms-px rounded-s-none shadow-none"
							/>
						</div>
					</div>

					<Button size="lg" className="w-full">
						Create
					</Button>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
}
