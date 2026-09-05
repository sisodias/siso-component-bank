import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/demos/ui/badge";
import { fadeIn, fadeUpBlur, scaleDown, slideUp } from "cnippet-aos";
import { motion } from "motion/react";

const posts = [
  {
    category: "Industry",
    date: "Nov 28, 2025",
    image:
      "https://images.cnippet.dev/image/upload/v1770400411/img_14001.jpg",
    summary:
      "How modern data centers are reducing their carbon footprint through innovative cooling systems and renewable energy integration.",
    title: "Sustainable Data Centers: A New Standard",
  },
  {
    category: "Innovation",
    date: "Nov 15, 2025",
    image:
      "https://images.cnippet.dev/image/upload/v1770400411/img_14002.jpg",
    summary:
      "Exploring how AI and machine learning are optimizing energy grid management and reducing waste across distribution networks.",
    title: "AI-Powered Energy Management Systems",
  },
  {
    category: "Sustainability",
    date: "Oct 30, 2025",
    image:
      "https://images.cnippet.dev/image/upload/v1770400411/img_14003.jpg",
    summary:
      "A comprehensive look at how businesses can transition to net-zero operations while maintaining profitability and growth.",
    title: "The Road to Net-Zero: A Business Guide",
  },
];

export default function Component() {
  return (
     <section className="relative overflow-hidden py-16 font-kanturmuy text-black dark:bg-white">
      <div className="mx-auto max-w-full px-5 md:px-10">
        <motion.div
          {...fadeUpBlur({ delay: 0.1, duration: 0.5, once: true, y: 30 })}
        >
          <Badge className="mb-4 rounded-none bg-[#e1fcad] px-3 py-0.5 font-medium text-[#122023] text-sm dark:bg-[#e1fcad]">
            Latest Posts
          </Badge>
        </motion.div>
        <motion.h2
          {...fadeUpBlur({
            delay: 0.2,
            duration: 0.6,
            once: true,
            y: 60,
          })}
          className="mb-14 font-kanturmuy font-medium text-4xl tracking-tight md:text-5xl"
        >
          Latest Articles
        </motion.h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {posts.map((post, index) => (
            <motion.article
              {...fadeUpBlur({
                delay: 0.5 * index,
                duration: 0.5,
                once: true,
                scroll: true,
                y: 40,
              })}
              className="group cursor-pointer overflow-hidden"
              key={post.title}
            >
              <motion.div
                {...fadeIn({ delay: 0.1 * index, duration: 0.6 })}
                className="h-56 overflow-hidden md:h-72"
              >
                <Image
                  alt={post.title}
                  className="h-full w-full object-cover transition-all duration-700 ease-in-out group-hover:scale-105"
                  height={600}
                  src={post.image}
                  width={800}
                />
              </motion.div>
              <div className="py-5">
                <div className="mb-3 flex items-center gap-3">
                  <span className="font-mono text-secondary/40 text-xs uppercase tracking-wider">
                    {post.date}
                  </span>
                  <span className="text-secondary/20">|</span>
                  <span className="font-mono text-secondary/40 text-xs uppercase tracking-wider">
                    {post.category}
                  </span>
                </div>
                <h3 className="mb-2 font-medium text-2xl tracking-tight">
                  {post.title}
                </h3>
                <p className="text-secondary/60 text-sm leading-relaxed">
                  {post.summary}
                </p>
                <a
                  className="group/link mt-4 inline-flex items-center gap-1.5 font-mono text-secondary text-xs uppercase tracking-wider transition-colors"
                  href="#"
                >
                  Read More
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
