import React from 'react';
import {
	Modal,
	ModalBody,
	ModalContent,
	ModalDescription,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTrigger,
} from "./modal";
import { Button } from "./button";
import { Label } from "./label";
import { Input } from "./input";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { Grid2x2Plus } from 'lucide-react';

export function InviteMemberModal() {
	const [open, setOpen] = React.useState<boolean>(false);
	const [role, setRole] = React.useState<string>('owner');

	return (
		<Modal open={open} onOpenChange={setOpen}>
			<ModalTrigger asChild>
				<Button size="sm">Invite Member</Button>
			</ModalTrigger>
			<ModalContent className="md:max-w-md">
				<ModalHeader className="items-center py-10">
					<Grid2x2Plus className="size-9" />
					<div className="flex flex-col items-center space-y-1">
						<ModalTitle className="text-2xl font-semibold">
							Invite a Member
						</ModalTitle>
						<ModalDescription className="text-muted-foreground text-center text-sm">
							Invite a member to your organization by email.
						</ModalDescription>
					</div>
				</ModalHeader>
				<ModalBody className="space-y-6">
					<div className="grid gap-2">
						<Label>Email</Label>
						<Input placeholder="e.g., hi@yourcompony.com" />
					</div>
					<div className="grid gap-2">
						<Label>Select Role</Label>
						<RadioGroup
							className="gap-1"
							onValueChange={setRole}
							defaultValue={role}
						>
							<div className="border-input has-data-[state=checked]:border-primary/50 relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none">
								<RadioGroupItem
									value="owner"
									id="owner"
									aria-describedby="owner-description"
									className="order-1 after:absolute after:inset-0"
								/>
								<div className="grid grow gap-2">
									<Label htmlFor="owner">Owner</Label>
									<p
										id="owner-description"
										className="text-muted-foreground text-xs"
									>
										Invite members, billing and delete the organization.
									</p>
								</div>
							</div>
							{/* Radio card #2 */}
							<div className="border-input has-data-[state=checked]:border-primary/50 relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none">
								<RadioGroupItem
									value="member"
									id="member"
									aria-describedby="member-description"
									className="order-1 after:absolute after:inset-0"
								/>
								<div className="grid grow gap-2">
									<Label htmlFor="member">Member</Label>
									<p
										id="member-description"
										className="text-muted-foreground text-xs"
									>
										Manage products add orders.
									</p>
								</div>
							</div>
						</RadioGroup>
					</div>
				</ModalBody>
				<ModalFooter>
					<Button type="submit" className="w-full">
						Send Invite
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
