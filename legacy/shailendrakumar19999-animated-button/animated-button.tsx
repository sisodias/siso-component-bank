import { cn } from "../_utils/cn";

export const Component = () => {
  return (
    <div className={cn("flex flex-col items-center gap-4 p-4 rounded-lg")}>
     <a href="#" class="relative inline-flex items-center justify-start px-6 py-2 overflow-hidden font-medium transition-all bg-white rounded hover:bg-white group outline outline-1">
    <span class="w-48 h-48 rounded rotate-[-40deg] bg-purple-600 absolute bottom-0 left-0 -translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>
    <span class="relative w-full text-left text-black transition-colors duration-300 ease-in-out group-hover:text-white">Animation Button</span>
</a>
    </div>
  );
};
