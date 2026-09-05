import React from 'react';
import { cn } from "../_utils/cn";
import { Separator } from "./separator";
import { AvatarUploader } from './avatar-uploader';
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Label } from "./label";
import { Input } from "./input";
import { Button } from "./button";

export function AccountSettings() {
	const [photo, setPhoto] = React.useState<string>(
		'https://avatar.vercel.sh/john',
	);

	const handleUpload = async (file: File) => {
		setPhoto(URL.createObjectURL(file));
		return { success: true };
	};

	return (
		<section className="relative min-h-screen w-full px-4 py-10">
			<div
				aria-hidden
				className="absolute inset-0 isolate -z-10 opacity-80 contain-strict"
			>
				<div className="bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,--theme(--color-foreground/.06)_0,hsla(0,0%,55%,.02)_50%,--theme(--color-foreground/.01)_80%)] absolute top-0 left-0 h-320 w-140 -translate-y-87.5 -rotate-45 rounded-full" />
				<div className="bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)] absolute top-0 left-0 h-320 w-60 [translate:5%_-50%] -rotate-45 rounded-full" />
				<div className="bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)] absolute top-0 left-0 h-320 w-60 -translate-y-87.5 -rotate-45 rounded-full" />
			</div>
			<div className="mx-auto w-full max-w-4xl space-y-8">
				<div className="flex flex-col">
					<h2 className="text-2xl font-bold">Account Settings</h2>
					<p className="text-muted-foreground text-base">
						Manage account and your personal information.
					</p>
				</div>
				<Separator />

				<div className="py-2">
					<SectionColumns
						title="Your Avatar"
						description="An avatar is optional but strongly recommended."
					>
						<AvatarUploader onUpload={handleUpload}>
							<Avatar className="relative mx-auto h-20 w-20 cursor-pointer hover:opacity-50">
								<AvatarImage src={photo} />
								<AvatarFallback className="border text-2xl font-bold">
									JD
								</AvatarFallback>
							</Avatar>
						</AvatarUploader>
					</SectionColumns>
					<Separator />
					<SectionColumns
						title="Your Name"
						description="Please enter a display name you are comfortable with."
					>
						<div className="w-full space-y-1">
							<Label className="sr-only">Name</Label>
							<div className="flex w-full items-center justify-center gap-2">
								<Input placeholder="Enter Your Name" />
								<Button
									type="submit"
									variant="outline"
									className="text-xs md:text-sm"
								>
									Save Changes
								</Button>
							</div>
							<p className="text-muted-foreground text-xs">Max 32 characters</p>
						</div>
					</SectionColumns>
					<Separator />
					<SectionColumns
						title="Your Email"
						description="Please enter a Primary Email Address."
					>
						<Label className="sr-only">Email</Label>
						<div className="flex w-full items-center justify-center gap-2">
							<Input type="email" placeholder="Enter Your Email" />
							<Button
								type="submit"
								variant="outline"
								className="text-xs md:text-sm"
							>
								Save Changes
							</Button>
						</div>
					</SectionColumns>
				</div>
			</div>
		</section>
	);
}

interface SectionColumnsType {
	title: string;
	description?: string;
	className?: string;
	children: React.ReactNode;
}

function SectionColumns({
	title,
	description,
	children,
	className,
}: SectionColumnsType) {
	return (
		<div className="animate-in fade-in grid grid-cols-1 gap-x-10 gap-y-4 py-8 duration-500 md:grid-cols-10">
			<div className="w-full space-y-1.5 md:col-span-4">
				<h2 className="font-heading text-lg leading-none font-semibold">
					{title}
				</h2>
				<p className="text-muted-foreground text-sm text-balance">
					{description}
				</p>
			</div>
			<div className={cn('md:col-span-6', className)}>{children}</div>
		</div>
	);
}
