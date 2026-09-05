import { cn } from "../_utils/cn";

export const Hero = () => {
  return (
    <div className={cn("w-full relative h-screen")}>
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div>
      </div>

    </div>
  );
};
