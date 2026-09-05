import { Button } from "@/components/ui/button";
import { Gem } from "lucide-react";

const ButtonAnimatedBorderDemo = () => {
  return (
    <div className="w-fit h-fit relative inline-flex rounded-md overflow-hidden">
      {/* Animated gradient border */}
      <span className="absolute inset-0 rounded-md pointer-events-none overflow-hidden">
        <span className="absolute -inset-full animate-spin [animation-duration:4s] bg-[conic-gradient(from_0deg,_#2b7fff_0deg,_#2b7fff_40deg,_transparent_60deg)]" />
      </span>

      {/* Button */}
      <Button
        variant="outline"
        className="relative z-10 m-[1px] rounded-md bg-background dark:bg-background hover:bg-background dark:hover:bg-background shadow-none cursor-pointer">
        <Gem className="size-4" />
        Get Pro
      </Button>
    </div>
  );
};

export default ButtonAnimatedBorderDemo;

