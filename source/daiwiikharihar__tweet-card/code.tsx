"use client";

import { cn } from "@/lib/utils";
import * as React from "react";
import Image from "next/image";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

// --- Icons ---
const Icons = {
  Reply: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...p}>
      <g>
        <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"></path>
      </g>
    </svg>
  ),
  Retweet: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...p}>
      <g>
        <path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"></path>
      </g>
    </svg>
  ),
  Like: ({
    filled,
    ...p
  }: React.SVGProps<SVGSVGElement> & { filled?: boolean }) => (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? "0" : "2"}
      {...p}
    >
      <g>
        {filled ? (
          <path d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.5 4.798 2.01 1.429-1.51 3.147-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path>
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.928 1.88-.872 4.01.46 6.47 1.256 2.3 3.746 4.7 7.946 7.11 4.199-2.41 6.69-4.81 7.946-7.11 1.332-2.46 1.388-4.59.46-6.47-.56-1.13-1.667-1.84-2.908-1.91zM2.529 6.55c.986-1.98 2.89-3.3 5.088-3.41 2.046-.11 3.992.83 5.432 2.45 1.44-1.62 3.385-2.56 5.431-2.45 2.199.11 4.103 1.43 5.089 3.41 1.526 3.07 1.289 6.29-.462 9.5-1.66 3.04-4.66 5.92-9.456 8.58l-1.002.56-1.002-.56c-4.796-2.66-7.796-5.54-9.457-8.58-1.75-3.21-1.987-6.43-.46-9.5z"
          ></path>
        )}
      </g>
    </svg>
  ),
  Share: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...p}>
      <g>
        <path d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z"></path>
      </g>
    </svg>
  ),
  Verified: (p: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      aria-label="Verified account"
      fill="currentColor"
      {...p}
    >
      <g>
        <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .495.083.965.238 1.4-1.272.65-2.147 2.02-2.147 3.6 0 1.435.716 2.69 1.77 3.46-.146.445-.224.915-.224 1.39 0 2.21 1.71 4 3.818 4 .47 0 .92-.086 1.336-.252.62 1.335 1.926 2.25 3.437 2.25 1.512 0 2.818-.915 3.437-2.25.415.166.865.252 1.336.252 2.108 0 3.818-1.79 3.818-4 0-.475-.078-.944-.224-1.39 1.054-.77 1.77-2.025 1.77-3.46zM11.248 16.7l-3.5-3.5 1.414-1.416 2.066 2.067 4.908-5.397 1.465 1.33-6.353 6.917z"></path>
      </g>
    </svg>
  ),
  Dots: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...p}>
      <g>
        <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path>
      </g>
    </svg>
  ),
  Chart: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...p}>
      <g>
        <path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z"></path>
      </g>
    </svg>
  ),
};

// --- Types ---

export interface TweetAuthor {
  name: string;
  handle: string;
  avatarSrc: string;
  isVerified?: boolean;
}

export interface TweetStats {
  replies: number;
  retweets: number;
  likes: number;
  views: string;
}

export interface TweetProps {
  author: TweetAuthor;
  content: string;
  timestamp: string;
  stats: TweetStats;
  mediaUrl?: string;
  tags?: string[];
  /** Optional class override for the root element */
  className?: string;
}

// --- Main Component ---
export default function TweetCard({
  author,
  content,
  timestamp,
  stats,
  mediaUrl,
  tags,
  className,
}: TweetProps) {
  const [isLiked, setIsLiked] = React.useState(false);
  const [isRetweeted, setIsRetweeted] = React.useState(false);
  const [likeCount, setLikeCount] = React.useState(stats.likes);
  const [retweetCount, setRetweetCount] = React.useState(stats.retweets);

  // Spotlight Effect: Track mouse position relative to the card
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handleRetweet = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRetweeted(!isRetweeted);
    setRetweetCount((prev) => (isRetweeted ? prev - 1 : prev + 1));
  };

  return (
    <motion.article
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, type: "spring" }}
      onMouseMove={handleMouseMove}
      className={cn(
        "group relative w-full max-w-lg overflow-hidden rounded-2xl p-5 backdrop-blur-xl transition-all duration-300",
        "bg-white/90 border border-gray-200 shadow-sm", // Light mode
        "dark:bg-black/60 dark:border-white/10 dark:shadow-none", // Dark mode
        className
      )}
    >
      {/* Spotlight Gradient Layer */}
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(650px circle at ${mouseX}px ${mouseY}px, rgba(56, 189, 248, 0.15), transparent 80%)
          `,
        }}
      />

      <div className="relative flex gap-4">
        {/* Avatar Section */}
        <div className="flex-shrink-0">
          <div className="relative h-12 w-12 overflow-hidden rounded-full aspect-square ring-2 ring-transparent transition-all group-hover:ring-sky-500/50">
            <Image
              src={author.avatarSrc}
              alt={author.name}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 min-w-0">
          <Header author={author} timestamp={timestamp} />

          <div className="mt-2 whitespace-pre-wrap text-[15px] leading-relaxed text-gray-700 dark:text-gray-200">
            {content}
            {tags?.length ? (
              <div className="mt-2 flex flex-wrap gap-2 text-sky-600 dark:text-sky-400">
                {tags.map((tag) => (
                  <span key={tag} className="hover:underline cursor-pointer">
                    #{tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          {mediaUrl && (
            <motion.div
              className="mt-4 overflow-hidden rounded-xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-gray-900/50 relative"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 dark:from-black/20 to-transparent z-10" />
              <img
                src={mediaUrl}
                alt="Media"
                className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />
            </motion.div>
          )}

          {/* Action Bar */}
          <div className="mt-4 flex justify-between gap-2 text-gray-500 dark:text-gray-400 pr-4">
            <ActionButton
              icon={<Icons.Reply className="w-[18px]" />}
              count={stats.replies}
              colorClass="hover:text-sky-500 group-hover/bg-sky-500/10"
            />
            <ActionButton
              icon={<Icons.Retweet className="w-[18px]" />}
              count={retweetCount}
              active={isRetweeted}
              colorClass="hover:text-green-500 group-hover/bg-green-500/10"
              activeClass="text-green-500"
              onClick={handleRetweet}
            />
            <ActionButton
              icon={
                <motion.div
                  animate={{ scale: isLiked ? 1.2 : 1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Icons.Like filled={isLiked} className="w-[18px]" />
                </motion.div>
              }
              count={likeCount}
              active={isLiked}
              colorClass="hover:text-pink-500 group-hover/bg-pink-500/10"
              activeClass="text-pink-500"
              onClick={handleLike}
            />
            <ActionButton
              icon={<Icons.Chart className="w-[18px]" />}
              label={stats.views}
              colorClass="hover:text-sky-500 group-hover/bg-sky-500/10"
            />
            <div className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:text-sky-500 hover:bg-sky-500/10 cursor-pointer">
              <Icons.Share className="w-[18px]" />
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

// --- Sub-components ---

const Header = ({
  author,
  timestamp,
}: {
  author: TweetAuthor;
  timestamp: string;
}) => (
  <div className="flex items-center justify-between">
    <div className="flex flex-wrap items-center gap-1.5 text-[15px] leading-5">
      <span className="font-bold text-gray-900 dark:text-white transition-colors group-hover:text-sky-500">
        {author.name}
      </span>
      {author.isVerified && (
        <span className="text-sky-500">
          <Icons.Verified className="w-[18px]" />
        </span>
      )}
      <span className="text-gray-500 dark:text-gray-400">@{author.handle}</span>
      <span className="text-gray-400">·</span>
      <span className="text-gray-500 hover:underline cursor-pointer">
        {timestamp}
      </span>
    </div>
    <button className="text-gray-400 hover:text-gray-700 dark:hover:text-white">
      <Icons.Dots className="h-5 w-5" />
    </button>
  </div>
);

interface ActionButtonProps {
  icon: React.ReactNode;
  count?: number;
  label?: string;
  active?: boolean;
  colorClass: string;
  activeClass?: string;
  onClick?: (e: React.MouseEvent) => void;
}

function ActionButton({
  icon,
  count,
  label,
  active,
  colorClass,
  activeClass,
  onClick,
}: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex items-center gap-1.5 text-[13px] transition-all hover:scale-105 active:scale-95",
        colorClass,
        active && activeClass
      )}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full transition-colors group-hover:bg-current/10">
        {icon}
      </div>
      <span className={cn("tabular-nums font-medium", active && activeClass)}>
        {label || (count && count > 0 ? formatCount(count) : "")}
      </span>
    </button>
  );
}

function formatCount(count: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(count);
}
