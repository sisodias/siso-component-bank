"use client";

import { ArrowRight, Plus, Square } from "lucide-react";
import { Button } from "@/components/ui/button";

const posts = [
  {
    category: "News",
    date: "Aug 21",
    excerpt:
      "This year marks a big milestone for us — 15 years of helping entrepreneurs turn ideas into thriving businesses. From small startups in local communities to growing brands expanding...",
    title:
      "Our consultancy celebrates 15 years of guiding businesses to success",
  },
  {
    category: "Resources",
    date: "Aug 21",
    excerpt:
      "Starting a business feels exciting, but it can also feel overwhelming with so many things to handle — paperwork, strategy, planning, and money. This guide breaks the process...",
    title:
      "A simple step-by-step guide to starting your business the right way",
  },
  {
    category: "Blog",
    date: "Aug 21",
    excerpt:
      "Most entrepreneurs are excited to launch their business right away — but rushing in without validation can lead to wasted time, money, and energy. The smartest founders take a step back and...",
    title:
      "The simple guide to validating your business idea before you launch",
  },
];

export default function Blog() {
  return (
    <section className="relative bg-yellow-50 py-20">
      <div className="mx-auto max-w-full">
        <div className="px-16">
          <div className="border-neutral-300 border-b">
            <p
              className="flex w-fit items-center rounded-none border-none bg-secondary px-4 py-0.5 font-medium text-neutral-800"
              size="lg"
              variant="outline"
            >
              <Square className="size-3 text-neutral-800" /> BLOGS AND
              INSIGHTS
            </p>
          </div>

          <div className="mt-8 flex items-end justify-between">
            <h2 className="max-w-xl text-5xl leading-[1.15] tracking-tight">
              Your pocket-sized library of tips, tricks, and{" "}
              <span className="bg-black px-2 py-0.5 text-primary">
                &ldquo;why didn&apos;t I think of that?&rdquo;
              </span>
            </h2>

            <Button className="rounded-none py-2 pr-0 bg-black font-mono font-normal text-primary text-sm uppercase tracking-wider hover:text-black">
              Read all blogs
              <span className="border-neutral-400 border-l p-3">
                <ArrowRight className="size-4" />
              </span>
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
            {posts.map((post) => (
              <article
                className="group group relative flex cursor-pointer flex-col justify-between bg-neutral-900 text-white"
                key={post.title}
              >
                <div className="relative flex h-92 flex-col p-6">
                  <div className="flex items-center gap-2 font-semibold">
                    <span className="font-mono text-primary text-xs uppercase tracking-[0.15em]">
                      {post.date}
                    </span>
                    <span className="text-primary">•</span>
                    <span className="font-mono text-primary text-xs uppercase tracking-[0.15em]">
                      {post.category}
                    </span>
                  </div>

                  <h3 className="mt-3 font-medium text-3xl leading-snug">
                    {post.title}
                  </h3>
                  <div className="absolute inset-x-0 -bottom-5 z-50 h-10 bg-linear-to-t from-neutral-950 to-transparent" />
                  <p className="absolute -bottom-12 text-base text-neutral-400 leading-relaxed transition-all duration-500 ease-in group-hover:bottom-0">
                    {post.excerpt}
                  </p>
                </div>

                <div className="relative mt-4 flex items-center justify-between border-neutral-800 border-t bg-neutral-800 px-6 py-7">
                  <span className="font-mono text-primary text-sm uppercase tracking-[0.15em]">
                    Keep Reading
                  </span>
                  <Plus className="size-5 text-primary" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
