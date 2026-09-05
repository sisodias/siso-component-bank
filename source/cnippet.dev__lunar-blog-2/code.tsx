"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/demos/ui/badge";
import { Button } from "@/demos/ui/button";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/demos/ui/tabs";


const categories = [
  { id: "all", label: "All" },
  { id: "robotics", label: "Robotics" },
  { id: "arduino", label: "Arduino" },
  { id: "microcontrollers", label: "Microcontrollers" },
  { id: "ai-ml", label: "AI & Machine Learning" },
];

const featuredPost = {
  category: "Robotics",
  categoryId: "robotics",
  excerpt:
    "Explore how artificial intelligence and advanced sensors are enabling robots to work alongside humans, from collaborative manufacturing to autonomous delivery.",
  image: "https://images.cnippet.dev/image/upload/v1770400411/h1.jpg",
  publishedDate: "March 12, 2025",
  readTime: "8 min read",
  title: "The Rise of Collaborative Robots: A New Era in Automation",
};

const posts = [
  {
    category: "Arduino",
    categoryId: "arduino",
    image: "https://images.cnippet.dev/image/upload/v1770400411/h2.jpg",
    publishedDate: "March 11, 2025",
    readTime: "6 min read",
    title: "Getting Started with Arduino: 5 Beginner Projects",
  },
  {
    category: "Microcontrollers",
    categoryId: "microcontrollers",
    image: "https://images.cnippet.dev/image/upload/v1770400411/h3.jpg",
    publishedDate: "March 13, 2025",
    readTime: "7 min read",
    title: "ESP32 vs Raspberry Pi Pico: Choosing the Right MCU",
  },
  {
    category: "AI & Machine Learning",
    categoryId: "ai-ml",
    image: "https://images.cnippet.dev/image/upload/v1770400411/h4.jpg",
    publishedDate: "March 07, 2025",
    readTime: "5 min read",
    title: "TinyML: Running Neural Networks on Microcontrollers",
  },
];


function CurvedCorner({ position }: { position: "left" | "bottom" }) {
  if (position === "left") {
    return (
      <div className="absolute top-0 right-auto bottom-auto -left-2 flex h-2 w-2 items-center justify-center">
        <svg
          fill="none"
          height="8"
          viewBox="0 0 8 8"
          width="8"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            d="M8 0H0C4.41828 0 8 3.58172 8 8V0Z"
            fill="white"
            fillRule="evenodd"
          />
        </svg>
      </div>
    );
  }
  return (
    <div className="absolute top-auto right-0 -bottom-2 left-auto flex h-2 w-2 items-center justify-center">
      <svg
        fill="none"
        height="8"
        viewBox="0 0 8 8"
        width="8"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          clipRule="evenodd"
          d="M8 0H0C4.41828 0 8 3.58172 8 8V0Z"
          fill="white"
          fillRule="evenodd"
        />
      </svg>
    </div>
  );
}

export default function BlogVariant2() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredPosts =
    activeCategory === "all"
      ? posts
      : posts.filter((post) => post.categoryId === activeCategory);

  const showFeatured =
    activeCategory === "all" || featuredPost.categoryId === activeCategory;

  return (
    <section className="w-full bg-white overflow-hidden py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Badge className="mb-4 rounded-full px-2 py-0.5">Latest Articles</Badge>

        <h2 className="font-medium font-onest text-3xl text-gray-900 max-w-lg tracking-tight sm:text-4xl md:text-6xl">
           Explore the future of
          robotics
        </h2>

        <Tabs
          className="mt-8"
          onValueChange={setActiveCategory}
          value={activeCategory}
        >
          <TabsList className="flex flex-wrap gap-2 border-none bg-transparent p-0 shadow-none">
            {categories.map((category) => (
              <TabsTab
                className={`rounded-md border-none px-4 py-2 font-medium font-onest text-sm transition-colors focus-visible:ring-0 ${
                  activeCategory === category.id
                    ? "border-none bg-blue-600 outline-0 data-active:text-white"
                    : "text-black"
                }`}
                key={category.id}
                value={category.id}
              >
                {category.label}
              </TabsTab>
            ))}
          </TabsList>

          <TabsPanel className="mt-10" value={activeCategory}>
            {showFeatured && (
              <article className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
                <div className="relative col-span-4">
                  <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl lg:aspect-square">
                    <Image
                      alt={featuredPost.title}
                      className="object-cover h-full"
                      width={1920}
                      height={1080}
                      src={featuredPost.image}
                    />
                  </div>

                  <span className="absolute top-0 right-0 rounded-bl-lg bg-white px-3 py-1 font-medium text-gray-600 text-xs">
                    {featuredPost.readTime}
                    <CurvedCorner position="left" />
                    <CurvedCorner position="bottom" />
                  </span>
                </div>

                <div className="col-span-8 flex flex-col justify-center">
                  <Link
                    className="font-medium font-onest text-blue-600 text-sm hover:text-blue-700"
                    href="#"
                  >
                    {featuredPost.category}
                  </Link>

                  <h3 className="mt-2 font-medium font-onest text-3xl! text-gray-900 sm:text-5xl!">
                    {featuredPost.title}
                  </h3>

                  <p className="mt-4 font-onest text-base text-gray-600 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>

                  <p className="mt-4 text-gray-500 text-sm">
                    Published on {featuredPost.publishedDate}
                  </p>

                  <div className="mt-6">
                    <Button
                      className="rounded-full border-none px-6 bg-gray-200 py-2 font-medium font-onest text-gray-900 text-sm"
                      render={<Link href="#" />}
                      variant="secondary"
                    >
                      Read more
                    </Button>
                  </div>
                </div>
              </article>
            )}

            <div
              className={`grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 ${
                showFeatured ? "mt-12" : ""
              }`}
            >
              {filteredPosts.map((post) => (
                <article
                  className="group relative cursor-pointer"
                  key={post.title}
                >
                  <div className="relative">
                    <div className="relative h-52 w-full overflow-hidden rounded-2xl">
                      <Image
                        alt={post.title}
                        className="object-cover transition-transform duration-300 group-hover:scale-105 h-full"
                      width={1920}
                      height={1080}
                        src={post.image}
                      />
                    </div>

                    <span className="absolute top-0 right-0 rounded-bl-lg bg-white px-3 py-1 font-medium text-gray-600 text-xs">
                      {post.readTime}
                      <CurvedCorner position="left" />
                      <CurvedCorner position="bottom" />
                    </span>
                  </div>

                  <div className="mt-4">
                    <Link
                      className="font-medium font-onest text-blue-600 text-sm hover:text-blue-700"
                      href="#"
                    >
                      <span className="absolute inset-0" />
                      {post.category}
                    </Link>

                    <h3 className="mt-2 font-medium font-onest text-gray-900 text-xl! leading-snug sm:text-2xl!">
                      {post.title}
                    </h3>

                    <p className="mt-2 text-gray-500 text-sm">
                      Published on {post.publishedDate}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            {filteredPosts.length === 0 && !showFeatured && (
              <div className="py-12 text-center">
                <p className="font-onest text-gray-500">
                  No articles found in this category.
                </p>
              </div>
            )}
          </TabsPanel>
        </Tabs>
      </div>
    </section>
  );
}
