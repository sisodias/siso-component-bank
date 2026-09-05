import { cn } from "../_utils/cn";

export const RadialBackground = () => {
  return (
    <div className={cn("absolute inset-0 -z-10 size-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]")} />
  );
};
