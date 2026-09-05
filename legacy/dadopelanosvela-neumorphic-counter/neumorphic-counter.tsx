import { cn } from "../_utils/cn";
import { useState } from "react";

export const Component = () => {
  const [count, setCount] = useState(0);
  const [isPressed, setIsPressed] = useState({ minus: false, plus: false });

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-8">
      <div className={cn(
        "flex flex-col items-center gap-8 p-8 rounded-3xl",

        "bg-gray-200 shadow-[20px_20px_40px_#bebebe,-20px_-20px_40px_#ffffff]"
      )}>
       
        <div className={cn(
          "px-6 py-3 rounded-2xl",
          "bg-gray-200 shadow-[inset_8px_8px_16px_#bebebe,inset_-8px_-8px_16px_#ffffff]"
        )}>
          <h1 className="text-2xl font-bold text-gray-700 mb-1">neumorphic counter</h1>
          <p className="text-sm text-gray-500 text-center">Neumorphic design example</p>
        </div>

        
        <div className={cn(
          "w-32 h-32 rounded-full flex items-center justify-center",
          "bg-gray-200 shadow-[inset_15px_15px_30px_#bebebe,inset_-15px_-15px_30px_#ffffff]"
        )}>
          <h2 className="text-4xl font-bold text-gray-600">{count}</h2>
        </div>

        
        <div className="flex gap-6">
          
          <button
            onMouseDown={() => setIsPressed(prev => ({ ...prev, minus: true }))}
            onMouseUp={() => setIsPressed(prev => ({ ...prev, minus: false }))}
            onMouseLeave={() => setIsPressed(prev => ({ ...prev, minus: false }))}
            onClick={() => setCount((prev) => prev - 1)}
            className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-gray-600",
              "bg-gray-200 transition-all duration-150 ease-in-out",
              "hover:text-red-500",
              isPressed.minus 
                ? "shadow-[inset_8px_8px_16px_#bebebe,inset_-8px_-8px_16px_#ffffff]" 
                : "shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff] hover:shadow-[12px_12px_20px_#bebebe,-12px_-12px_20px_#ffffff]"
            )}
          >
            −
          </button>

          
          <button
            onMouseDown={() => setIsPressed(prev => ({ ...prev, plus: true }))}
            onMouseUp={() => setIsPressed(prev => ({ ...prev, plus: false }))}
            onMouseLeave={() => setIsPressed(prev => ({ ...prev, plus: false }))}
            onClick={() => setCount((prev) => prev + 1)}
            className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-gray-600",
              "bg-gray-200 transition-all duration-150 ease-in-out",
              "hover:text-green-500",
              isPressed.plus 
                ? "shadow-[inset_8px_8px_16px_#bebebe,inset_-8px_-8px_16px_#ffffff]" 
                : "shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff] hover:shadow-[12px_12px_20px_#bebebe,-12px_-12px_20px_#ffffff]"
            )}
          >
            +
          </button>
        </div>

        
        <button
          onClick={() => setCount(0)}
          className={cn(
            "px-8 py-3 rounded-2xl text-gray-600 font-medium",
            "bg-gray-200 shadow-[6px_6px_12px_#bebebe,-6px_-6px_12px_#ffffff]",
            "hover:shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff]",
            "active:shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff]",
            "transition-all duration-150 ease-in-out",
            "hover:text-blue-500"
          )}
        >
          Restart
        </button>

        
        <div className="flex gap-4 mt-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-4 h-4 rounded-full",
                "bg-gray-200 shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff]"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};