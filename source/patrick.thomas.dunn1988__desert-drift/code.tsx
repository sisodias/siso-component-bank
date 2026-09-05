import { cn } from "@/lib/utils";

export const Component = () => {
  return (
    <div className={cn("w-full h-screen flex items-center justify-center bg-black")}>
      <div className="w-full h-full max-w-5xl rounded-xl overflow-hidden border border-gray-700 shadow-2xl">
        <iframe
          src="https://my.spline.design/untitled-k1KQe1bIq5W7lZvLark2ZzGe/"
          className="w-full h-full"
          frameBorder="0"
          allowFullScreen
        />
      </div>
    </div>
  );
};
