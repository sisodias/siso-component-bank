import { ArrowUpRight } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/demos/ui/avatar";
import { Button } from "./button";

export default function Hero() {
  return (
    <section className="relative flex h-screen w-full items-end justify-center">
      <div
        className="absolute inset-0 h-full bg-cover"
        style={{
          backgroundImage:
            "url(https://images.cnippet.dev/image/upload/v1770400411/img_14002.jpg)",
          backgroundPosition: "bottom",
        }}
      >
        <div className="absolute inset-0 bg-linear-to-t from-black/70" />
      </div>

      <div className="relative z-10 w-full max-w-7xl px-6 pb-20 text-center text-white md:px-0">
        <div className="flex items-center justify-between text-left">
          <div className="max-w-3xl space-y-6">
            <h1 className="font-kanturmuy font-normal text-5xl text-white tracking-tighter md:text-7xl">
              Sustainable Solutions for a Better Future
            </h1>

            <p className="max-w-2xl font-light text-lg text-white/90 md:text-xl">
              Empowering businesses and communities to thrive in a low-carbon
              world through tailored clean energy solutions.
            </p>
          </div>
          <div className="mt-auto space-y-7">
            <div className="mt-8 flex flex-wrap items-center gap-3 lg:mt-auto">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <Avatar
                    className="size-12 border-2 border-[#e1fcad] transition-all duration-300 hover:grayscale-0 dark:border-[#e1fcad]"
                    key={i}
                  >
                    <AvatarImage
                      src={`https://images.cnippet.dev/image/upload/v1770400411/a${i+1}.jpg`}
                    />
                    <AvatarFallback>U{i}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <div className="flex flex-col font-normal text-sm">
                <span className="text-base sm:text-lg">15,000+</span>
                {/* <Icons.starPolygon className="size-4 text-blue-600" /> */}
                <span className="">Teams Connected</span>
              </div>
            </div>
            <div className="flex w-fit gap-6">
              <Button className="group not-disabled:inset-shadow-none mx-auto flex cursor-pointer items-center justify-center gap-0 rounded-full border-none bg-transparent px-0 py-5 font-normal shadow-none hover:bg-transparent [:hover,[data-pressed]]:bg-transparent">
                <span className="rounded-full bg-[#e1fcad] px-6 py-3 text-black duration-500 ease-in-out group-hover:bg-[#122023] group-hover:text-[#e1fcad] group-hover:transition-colors">
                  Start a Project
                </span>
                <div className="relative flex h-fit cursor-pointer items-center overflow-hidden rounded-full bg-[#e1fcad] p-5 text-black duration-500 ease-in-out group-hover:bg-[#122023] group-hover:text-[#e1fcad] group-hover:transition-colors">
                  <ArrowUpRight className="absolute h-5 w-5 -translate-x-1/2 transition-all duration-500 ease-in-out group-hover:translate-x-10" />
                  <ArrowUpRight className="absolute h-5 w-5 -translate-x-10 transition-all duration-500 ease-in-out group-hover:-translate-x-1/2" />
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
