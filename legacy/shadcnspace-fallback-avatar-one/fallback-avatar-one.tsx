
import { Avatar, AvatarFallback } from "./avatar";
const FallbackDemo = () => {
  return (
    <div className="flex items-center justify-center px-4">
      <Avatar>
        <AvatarFallback className="bg-amber-200 text-amber-600 font-medium">WP</AvatarFallback>
      </Avatar>
    </div>
  );
};

export default FallbackDemo;
