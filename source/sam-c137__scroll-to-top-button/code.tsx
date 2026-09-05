import { cn } from "@/lib/utils";
import { useState } from "react";
import { useEventListener } from 'usehooks-ts'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowUp } from "lucide-react";

export const ScrollToTopButton = () => {
	const [hidden, setHidden] = useState(true);

	useEventListener("scroll", () => setHidden(window.scrollY < 300));

	return (
		<button
				className={cn(
							"cursor-pointer fixed z-50 bottom-10 right-10 size-[60px] rounded-full grid place-items-center border-2 border-muted bg-foreground text-background hover:opacity-80",
				{
					hidden,
				},
			)}
			type="button"
			onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
		>
        <span className="sr-only">Back to top</span>
				<ArrowUp />
		</button>
	);
};
