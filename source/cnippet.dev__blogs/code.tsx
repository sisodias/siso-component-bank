import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const articlesData = [
  {
    category: "BRANDING",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam et lacinia mi.",
    image:
      "https://images.unsplash.com/photo-1558174685-430919a96c8d",
    publishDate: "Dec 22, 2025",
    readMoreLink: "#",
    title: "A Beginner's Guide to Webflow to Development",
  },
  {
    category: "ARTDIRECTION",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam et lacinia mi.",
    image:
      "https://images.unsplash.com/photo-1466228432269-af42b400b934",
    publishDate: "Nov 11, 2025",
    readMoreLink: "#",
    title: "The Ultimate Checklist for SEO Performance",
  },
  {
    category: "DESIGNSYSTEM",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam et lacinia mi.",
    image:
      "https://images.unsplash.com/photo-1605907126120-f68611516ecc",
    publishDate: "Oct 9, 2025",
    readMoreLink: "#",
    title: "The Evolution of Design: From Past to Present",
  },
];
export default function Component() {
  return (
    <section className="bg-white px-4 py-12 sm:py-16 md:py-20 dark:bg-black">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center sm:mb-12">
          <p className="mb-3 font-medium text-gray-600 text-xs uppercase tracking-wider sm:mb-4 dark:text-gray-400">
            CAPTION
          </p>
          <h2 className="font-normal text-2xl text-gray-900 tracking-tight sm:text-3xl md:text-5xl dark:text-gray-100">
            Blog Articles
          </h2>
        </div>
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articlesData.map((article, index) => (
            <div
              className="cursor-pointer border border-gray-300/50 bg-white/50 shadow-none backdrop-blur-sm transition-shadow hover:shadow-md dark:border-gray-800/50 dark:bg-gray-950/50"
              key={index}
            >
              <div className="p-0">
                <div className="relative mb-4 sm:mb-6">
                  <Image
                    alt={article.title}
                    className="aspect-square h-64 w-full object-cover sm:h-72 md:h-80"
                    height={1080}
                    src={article.image || "/placeholder.svg"}
                    width={1920}
                  />
                  <p
                    className="absolute top-0 left-0 rounded-none border-0 bg-white px-2 py-0.5 font-medium text-[10px] text-black uppercase backdrop-blur-sm sm:-top-0.5 sm:-left-0.5 sm:px-3 sm:py-1 sm:text-xs dark:bg-gray-950/90 dark:text-gray-200"
                    variant="secondary"
                  >
                    #{article.category}
                  </p>
                </div>
                <div className="px-3 pb-3 sm:px-4 sm:pb-4">
                  <h3 className="mb-2 font-normal text-base text-gray-900 tracking-tight sm:mb-2 sm:text-lg md:text-2xl dark:text-gray-100">
                    {article.title}
                  </h3>
                  <p className="mb-4 text-gray-600 text-xs leading-relaxed sm:mb-6 sm:text-sm dark:text-gray-400">
                    {article.description}
                  </p>
                  {/* Read More Link and Date */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Link
                      className="group relative flex items-center overflow-hidden font-medium text-gray-900 text-xs transition-colors hover:text-gray-700 sm:text-sm dark:text-gray-100 dark:hover:text-gray-300"
                      href={article.readMoreLink}
                    >
                      <span className="mr-2 overflow-hidden rounded-none border border-gray-200 p-2 transition-colors duration-300 ease-in group-hover:bg-black group-hover:text-white sm:p-3 dark:border-gray-800 dark:group-hover:bg-white dark:group-hover:text-black">
                        <ArrowRight className="h-3 w-3 translate-x-0 opacity-100 transition-all duration-500 ease-in group-hover:translate-x-8 group-hover:opacity-0 sm:h-4 sm:w-4" />
                        <ArrowRight className="absolute top-1/2 -left-4 h-4 w-4 -translate-y-1/2 transition-all duration-500 ease-in-out group-hover:left-2 sm:-left-5 sm:h-4 sm:w-4 sm:group-hover:left-3" />
                      </span>
                      Read more
                    </Link>
                    <span className="flex items-center gap-2 text-[10px] text-gray-500 sm:gap-3 sm:text-xs dark:text-gray-500">
                      {article.publishDate}
                      <span className="w-6 border-gray-300 border-t sm:w-16 dark:border-gray-700" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
