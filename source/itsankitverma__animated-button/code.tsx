import { cn } from "@/lib/utils";

export const AnimatedButton = () => {
  return (
     <div className={cn("flex flex-col items-center gap-4 p-4 rounded-lg min-h-screen justify-center bg-gradient-to-br from-slate-50 to-slate-200 w-full")}>
     <button
  className="relative inline-flex items-center justify-center px-10 py-3 text-lg font-semibold tracking-wide text-black bg-white rounded-xl shadow-md overflow-hidden group transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 border border-gray-300 hover:border-indigo-400"
  style={{ boxShadow: '0 4px 24px 0 rgba(80, 72, 229, 0.08)' }}
>
  <span className="absolute inset-0 rounded-xl border-2 border-gray-300 group-hover:border-indigo-400 transition-colors duration-300 pointer-events-none"></span>
  <span className="absolute left-0 bottom-0 w-full h-full opacity-0 bg-gradient-to-t from-indigo-500 via-purple-500 to-pink-400 rounded-xl group-hover:opacity-100 transition-opacity duration-500 ease-in-out z-0"></span>
  <span className="relative z-10 transition-colors duration-300 group-hover:text-white">Animated Button</span>
</button>
    </div>
  );
};
