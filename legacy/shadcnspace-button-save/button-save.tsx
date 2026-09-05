import { Button } from "./button";
import { CheckCheck } from "lucide-react";

const ButtonSaveDemo = () => {
  return (
    <Button className="flex items-center gap-2 hover:-translate-y-1 transition-transform duration-200 bg-green-500 text-white hover:bg-green-500/80 cursor-pointer">
      <CheckCheck className="size-4" />
      Save Changes
    </Button>
  );
};

export default ButtonSaveDemo;