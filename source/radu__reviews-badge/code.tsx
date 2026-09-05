"use client";

import React from "react";
import Image, { StaticImageData } from "next/image";
import { Star } from "lucide-react";

type Review = {
  id: number;
  name: string;
  position: string;
  companyName: string;
  image: StaticImageData | string;
  text: string;
};

type ReviewsBadgeProps = {
  reviews: Review[];
  badgeEndText?: string;
  style?: "stars" | "faces";
};

const ReviewsBadge: React.FC<ReviewsBadgeProps> = ({
  reviews,
  badgeEndText = "Growth Leaders",
  style = "stars",
}) => {
  const reviewCount = reviews.length;
  const averageRating = 5;
  const lastFive = reviews.slice(0, 5);

  return (
    <div className="bg-white/25 border-2 border-white/25 px-4 py-1.5 text-sm rounded-lg font-sans font-semibold flex flex-row items-center justify-center gap-1 transition-all duration-200 ease-in-out">
      <p className="text-base text-neutral/50 font-medium font-sans inline-flex gap-1.5 items-center justify-center">
        Trusted by {reviewCount}+
        {style === "stars" ? (
          <span className="inline-flex gap-0.5">
            {Array.from({ length: averageRating }).map((_, i) => (
              <Star key={i} size={16} className="fill-accent text-accent" />
            ))}
          </span>
        ) : (
          <span className="inline-flex -space-x-2.5">
            {lastFive.map((review) => (
              <Image
                key={review.id}
                src={review.image}
                alt={review.name}
                width={24}
                height={24}
                className="rounded-full border border-base-200"
              />
            ))}
          </span>
        )}
        {badgeEndText}
      </p>
    </div>
  );
};

export default ReviewsBadge;
