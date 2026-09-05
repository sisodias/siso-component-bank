import { cn } from "@/lib/utils";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/components/ui/avatar";

export function TestimonialsSection() {
	return (
		<figure className="mx-auto flex w-full max-w-lg flex-col items-center justify-center md:grid md:grid-cols-[auto_1fr]">
			<div className="relative">
				{/* Vertical lines */}
				<MaskLine className="left-0" orientation="vertical" />
				<MaskLine className="right-0" orientation="vertical" />
				{/*  Horizontal lines */}
				<MaskLine className="top-0 md:w-xl" orientation="horizontal" />
				<MaskLine className="bottom-0 md:w-xl" orientation="horizontal" />

				<Avatar className="mask-[radial-gradient(circle,black_60%,transparent)] size-24 rounded-none *:rounded-none md:size-32">
					<AvatarImage
						alt="Shadcn's profile picture"
						src="https://github.com/shadcn.png"
					/>
					<AvatarFallback>SH</AvatarFallback>
				</Avatar>
			</div>
			<figcaption className="space-y-4 p-8 text-center md:p-6 md:text-left">
				<blockquote className="text-lg text-muted-foreground leading-tight tracking-tight">
					&quot;<span className="font-medium text-foreground">Efferd</span> is
					so polished I might just retire. The ecosystem is in safe hands.&quot;
				</blockquote>

				<div>
					<cite className="font-medium text-foreground text-xs not-italic">
						Shadcn
					</cite>
					<div className="text-[10px] text-muted-foreground">
						Founder, shadcn/ui
					</div>
				</div>
			</figcaption>
		</figure>
	);
}

export function MaskLine({
	className,
	orientation,
	...props
}: React.ComponentProps<"div"> & { orientation?: "horizontal" | "vertical" }) {
	return (
		<div
			aria-hidden="true"
			className={cn(
				"absolute bg-foreground/20",
				orientation === "vertical" &&
					"mask-t-from-80% mask-b-from-80% -inset-y-1/2 w-px",
				orientation === "horizontal" &&
					"mask-l-from-80% mask-r-from-80% -inset-x-1/2 h-px",
				className
			)}
			{...props}
		/>
	);
}

export default TestimonialsSection;
