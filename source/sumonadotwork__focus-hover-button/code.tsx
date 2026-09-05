import { cn } from "@/lib/utils";
import { useState } from "react";

export const Component = () => {

  return (
   <div className={`bg-white h-screen w-screen flex items-center justify-center`}>
      <div className='relative group'>
        <div className='relative flex items-center justify-center'>
          <img 
            src='https://pouch.jumpshare.com/preview/0OUN_SFDGvj08Owdar20p6WlBdiqcUqWu2b8vA8MqhN4HWYz9zZ83XmLZYU6cmN2kWvFObxsf5o5PGcq7n3hwEESWOvN1SzecdONZ0pk730' 
            className='group-hover:w-56 w-80 transition-all ease-in-out duration-600' 
          />
          <div className='absolute translate-z-80'>
            <img 
              src='https://pouch.jumpshare.com/preview/8_YHQkzHxbNTVoK-3ZRRnDrkJUVy-2bKfXtRiB7AGqRkTp0toVK7AtRKoB_SUD64kWvFObxsf5o5PGcq7n3hwET_M46A376PGvRPCO4mrZk' 
              className='w-32 group-hover:w-20 group-hover:-rotate-45 transition-all ease-in-out duration-500' 
            />
          </div>
        </div>
      </div>
    </div>
  );
};
