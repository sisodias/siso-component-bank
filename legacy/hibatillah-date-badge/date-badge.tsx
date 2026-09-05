import { format, getDate } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

export function DateBadge({
  date: rawDate,
  time = false,
  tooltip = true,
}: {
  date: string | Date;
  time?: boolean;
  tooltip?: boolean;
}) {
  const date = getDate(rawDate);
  const month = format(rawDate, "LLL");
  const fullDate = format(rawDate, time ? "PPPP - kk:mm" : "PPPP");

  return (
    <TooltipProvider>
      <Tooltip>
      <TooltipTrigger asChild>
        <div className="bg-background/40 flex size-10 shrink-0 cursor-default flex-col items-center justify-center rounded-md border text-center">
          <span className="text-sm font-semibold leading-snug">{date}</span>
          <span className="text-muted-foreground text-xs leading-none">
            {month}
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent className="shadow-md">
        {fullDate}
      </TooltipContent>
    </Tooltip>
    </TooltipProvider>
  );
}
