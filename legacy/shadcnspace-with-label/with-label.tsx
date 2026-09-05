import { Label } from "./label";
import { Switch } from "./switch";

const SwitchWithNormalLabelDemo = () => {
  return (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode" className="cursor-pointer">
        Airplane Mode
      </Label>
    </div>
  );
};

export default SwitchWithNormalLabelDemo;
