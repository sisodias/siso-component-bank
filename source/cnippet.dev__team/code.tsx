"use client";

import Image from "next/image";

import { Marquee } from "@/demos/ui/marquee";

const teamMembers = [
  {
    image:
      "https://images.cnippet.dev/image/upload/v1770400411/a1.jpg",
    name: "Patrick Stewart",
    role: "CEO - Founder",
  },
  {
    image:
      "https://images.cnippet.dev/image/upload/v1770400411/a2.jpg",
    name: "Alena Rosser",
    role: "Director of Content",
  },
  {
    image:
      "https://images.cnippet.dev/image/upload/v1770400411/a3.jpg",
    name: "Fletch Skinner",
    role: "Tech Manager",
  },
  {
    image:
      "https://images.cnippet.dev/image/upload/v1770400411/a4.jpg",
    name: "Marc Spector",
    role: "Director of Content",
  },
  {
    image:
      "https://images.cnippet.dev/image/upload/v1770400411/a5.jpg",
    name: "Natalia Skinner",
    role: "Cnippet Researcher",
  },
  {
    image:
      "https://images.cnippet.dev/image/upload/v1770400411/a6.jpg",
    name: "David Kim",
    role: "Engineering Lead",
  },
];

export default function Component() {
  return (
    <section className="relative w-full overflow-hidden bg-white py-12 md:py-24 dark:bg-background">
      <div>
        <svg
          className="absolute right-0 bottom-0 text-neutral-200 dark:text-neutral-800"
          fill="none"
          height="154"
          viewBox="0 0 460 154"
          width="460"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_494_1104)">
            <path
              d="M-87.463 458.432C-102.118 348.092 -77.3418 238.841 -15.0744 188.274C57.4129 129.408 180.708 150.071 351.748 341.128C278.246 -374.233 633.954 380.602 548.123 42.7707"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="40"
            />
          </g>
          <defs>
            <clipPath id="clip0_494_1104">
              <rect fill="white" height="154" width="460" />
            </clipPath>
          </defs>
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto mb-16 flex max-w-5xl flex-col items-center px-6 text-center lg:px-0">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-star-icon lucide-user-star"><path d="M16.051 12.616a1 1 0 0 1 1.909.024l.737 1.452a1 1 0 0 0 .737.535l1.634.256a1 1 0 0 1 .588 1.806l-1.172 1.168a1 1 0 0 0-.282.866l.259 1.613a1 1 0 0 1-1.541 1.134l-1.465-.75a1 1 0 0 0-.912 0l-1.465.75a1 1 0 0 1-1.539-1.133l.258-1.613a1 1 0 0 0-.282-.866l-1.156-1.153a1 1 0 0 1 .572-1.822l1.633-.256a1 1 0 0 0 .737-.535z"/><path d="M8 15H7a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/></svg>
          </div>

          <h1 className="relative mb-4 font-medium text-4xl text-neutral-900 tracking-tight sm:text-5xl dark:text-neutral-100">
            Creative Cnippet Members
            <svg
              className="absolute -top-2 -right-8 -z-10 w-24 text-neutral-200 dark:text-neutral-700"
              fill="currentColor"
              height="86"
              viewBox="0 0 108 86"
              width="108"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M38.8484 16.236L15 43.5793L78.2688 15L18.1218 71L93 34.1172L70.2047 65.2739"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="28"
              />
            </svg>
          </h1>
          <p className="max-w-2xl text-neutral-600 dark:text-neutral-400">
            Cnippet connects you with the most advanced tech solutions,
            empowering seamless communication.
          </p>
        </div>

        <div className="relative w-full">
          <div className="pointer-events-none absolute top-0 left-0 z-10 h-full w-32 bg-linear-to-r from-white to-transparent dark:from-background" />
          <div className="pointer-events-none absolute top-0 right-0 z-10 h-full w-32 bg-linear-to-l from-white to-transparent dark:from-background" />

          <Marquee className="[--gap:1.5rem]" pauseOnHover>
            {teamMembers.map((member) => (
              <div
                className="group flex w-64 shrink-0 flex-col"
                key={member.name}
              >
                <div className="relative h-92 w-full overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800">
                  <Image
                    alt={member.name}
                    className="h-full w-full object-cover grayscale transition-all duration-300 hover:grayscale-0"
                    fill
                    src={member.image}
                  />
                  <div className="absolute bottom-0 w-full rounded-lg bg-neutral-100/85 p-2 dark:bg-neutral-800/80">
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                      {member.name}
                    </h3>
                    <p className="text-neutral-600 text-sm dark:text-neutral-400">
                      {member.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </Marquee>
        </div>

        <div className="mx-auto mt-20 max-w-3xl px-6 text-center lg:px-0">
          <p className="mb-8 font-medium text-lg text-neutral-900 leading-relaxed md:text-xl dark:text-neutral-100">
            The exceptional support from Cnippet truly impressed us. We
            suggested an improvement, and their team implemented it with
            remarkable speed!
          </p>
          <div className="flex flex-col items-center gap-3">
            <div className="relative h-14 w-14 overflow-hidden rounded-full">
              <Image
                alt="Natalia Kara"
                className="h-full w-full object-cover"
                fill
                src="https://res.cloudinary.com/dvwtcsh5v/image/upload/v1770279333/a1.jpg"
              />
            </div>
            <div className="text-center">
              <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                Natalia Kara
              </p>
              <p className="text-neutral-600 text-sm dark:text-neutral-400">
                CTO · Cnippet Collection
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
