"use client";

import React, {useEffect, useRef, useState} from "react";

import Image from "next/image";
import {AnimatePresence, motion} from "framer-motion";
import {ImageProps} from "next/image";
import {ArrowLeft, ArrowRight, Quote, X} from "lucide-react";

import {cn} from "@/lib/utils";

// ===== Types and Interfaces =====
export interface iTestimonial {
	name: string;
	designation: string;
	description: string;
	profileImage: string;
}

interface iCarouselProps {
	items: React.ReactElement<{
		testimonial: iTestimonial;
		index: number;
		layout?: boolean;
		onCardClose: () => void;
	}>[];
	initialScroll?: number;
}

// ===== Custom Hooks =====
const useOutsideClick = (
	ref: React.RefObject<HTMLDivElement | null>,
	onOutsideClick: () => void,
) => {
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent | TouchEvent) => {
			if (!ref.current || ref.current.contains(event.target as Node)) {
				return;
			}
			onOutsideClick();
		};

		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("touchstart", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("touchstart", handleClickOutside);
		};
	}, [ref, onOutsideClick]);
};

// ===== Components =====
const Carousel = ({items, initialScroll = 0}: iCarouselProps) => {
	const carouselRef = React.useRef<HTMLDivElement>(null);
	const [canScrollLeft, setCanScrollLeft] = React.useState(false);
	const [canScrollRight, setCanScrollRight] = React.useState(true);

	const checkScrollability = () => {
		if (carouselRef.current) {
			const {scrollLeft, scrollWidth, clientWidth} = carouselRef.current;
			setCanScrollLeft(scrollLeft > 0);
			setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
		}
	};

	const handleScrollLeft = () => {
		if (carouselRef.current) {
			carouselRef.current.scrollBy({left: -300, behavior: "smooth"});
		}
	};

	const handleScrollRight = () => {
		if (carouselRef.current) {
			carouselRef.current.scrollBy({left: 300, behavior: "smooth"});
		}
	};

	const handleCardClose = (index: number) => {
		if (carouselRef.current) {
			const cardWidth = isMobile() ? 230 : 384;
			const gap = isMobile() ? 4 : 8;
			const scrollPosition = (cardWidth + gap) * (index + 1);
			carouselRef.current.scrollTo({
				left: scrollPosition,
				behavior: "smooth",
			});
		}
	};

	const isMobile = () => {
		return window && window.innerWidth < 768;
	};

	useEffect(() => {
		if (carouselRef.current) {
			carouselRef.current.scrollLeft = initialScroll;
			checkScrollability();
		}
	}, [initialScroll]);

	return (
		<div className="relative w-full mt-10">
			<div
				className="flex w-full overflow-x-scroll overscroll-x-auto scroll-smooth [scrollbar-width:none] py-5"
				ref={carouselRef}
				onScroll={checkScrollability}
			>
				<div
					className={cn(
						"absolute right-0 z-[1000] h-auto w-[5%] overflow-hidden bg-gradient-to-l",
					)}
				/>
				<div
					className={cn(
						"flex flex-row justify-start gap-4 pl-3",
						"max-w-5xl mx-auto",
					)}
				>
					{items.map((item, index) => {
						return (
							<motion.div
								initial={{opacity: 0, y: 20}}
								animate={{
									opacity: 1,
									y: 0,
									transition: {
										duration: 0.5,
										delay: 0.2 * index,
										ease: "easeOut",
										once: true,
									},
								}}
								key={`card-${index}`}
								className="last:pr-[5%] md:last:pr-[33%] rounded-3xl"
							>
								{React.cloneElement(item, {
									onCardClose: () => {
										return handleCardClose(index);
									},
								})}
							</motion.div>
						);
					})}
				</div>
			</div>
			<div className="flex justify-end gap-2 mt-4">
				<button
					className="relative z-40 h-10 w-10 rounded-full bg-[#4b3f33] flex items-center justify-center disabled:opacity-50 hover:bg-[#4b3f33]/80 transition-colors duration-200"
					onClick={handleScrollLeft}
					disabled={!canScrollLeft}
				>
					<ArrowLeft className="h-6 w-6 text-[#f2f0eb]" />
				</button>
				<button
					className="relative z-40 h-10 w-10 rounded-full bg-[#4b3f33] flex items-center justify-center disabled:opacity-50 hover:bg-[#4b3f33]/80 transition-colors duration-200"
					onClick={handleScrollRight}
					disabled={!canScrollRight}
				>
					<ArrowRight className="h-6 w-6 text-[#f2f0eb]" />
				</button>
			</div>
		</div>
	);
};

const TestimonialCard = ({
	testimonial,
	index,
	layout = false,
	onCardClose = () => {},
	backgroundImage = "https://images.unsplash.com/photo-1686806372726-388d03ff49c8?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
}: {
	testimonial: iTestimonial;
	index: number;
	layout?: boolean;
	onCardClose?: () => void;
	backgroundImage?: string;
}) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	const handleExpand = () => {
		return setIsExpanded(true);
	};
	const handleCollapse = () => {
		setIsExpanded(false);
		onCardClose();
	};

	useEffect(() => {
		const handleEscapeKey = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				handleCollapse();
			}
		};

		if (isExpanded) {
			const scrollY = window.scrollY;
			document.body.style.position = "fixed";
			document.body.style.top = `-${scrollY}px`;
			document.body.style.width = "100%";
			document.body.style.overflow = "hidden";
			document.body.dataset.scrollY = scrollY.toString();
		} else {
			const scrollY = parseInt(document.body.dataset.scrollY || "0", 10);
			document.body.style.position = "";
			document.body.style.top = "";
			document.body.style.width = "";
			document.body.style.overflow = "";
			window.scrollTo({top: scrollY, behavior: "instant"});
		}

		window.addEventListener("keydown", handleEscapeKey);
		return () => {
			return window.removeEventListener("keydown", handleEscapeKey);
		};
	}, [isExpanded]);

	useOutsideClick(containerRef, handleCollapse);

	return (
		<>
			<AnimatePresence>
				{isExpanded && (
					<div className="fixed inset-0 h-screen overflow-hidden z-50">
						<motion.div
							initial={{opacity: 0}}
							animate={{opacity: 1}}
							exit={{opacity: 0}}
							className="bg-red backdrop-blur-lg h-full w-full fixed inset-0"
						/>
						<motion.div
							initial={{opacity: 0}}
							animate={{opacity: 1}}
							exit={{opacity: 0}}
							ref={containerRef}
							layoutId={layout ? `card-${testimonial.name}` : undefined}
							className="max-w-5xl mx-auto bg-gradient-to-b from-[#f2f0eb] to-[#fff9eb] h-full z-[60] p-4 md:p-10 rounded-3xl relative md:mt-10"
						>
							<button
								className="sticky top-4 h-8 w-8 right-0 ml-auto rounded-full flex items-center justify-center bg-[#4b3f33]"
								onClick={handleCollapse}
							>
								<X className="h-6 w-6 text-white dark:text-neutral-900 absolute" />
							</button>
							<motion.p
								layoutId={layout ? `category-${testimonial.name}` : undefined}
								className="px-0 md:px-20 text-[rgba(31, 27, 29, 0.7)] text-lg dark:text-white font-thin font-tiemposHeadline underline underline-offset-8"
							>
								{testimonial.designation}
							</motion.p>
							<motion.p
								layoutId={layout ? `title-${testimonial.name}` : undefined}
								className="px-0 md:px-20 text-2xl md:text-4xl font-normal italic text-[rgba(31, 27, 29, 0.7)] mt-4 dark:text-white font-tiemposHeadline lowercase"
							>
								{testimonial.name}
							</motion.p>
							<div className="py-8 text-[rgba(31, 27, 29, 0.7)] px-0 md:px-20 text-3xl lowercase font-thin font-tiemposHeadline leading-snug tracking-wide">
								<Quote className="h-6 w-6 text-[rgba(31, 27, 29, 0.7)] dark:text-neutral-900" />
								{testimonial.description}
							</div>
						</motion.div>
					</div>
				)}
			</AnimatePresence>
			<motion.button
				layoutId={layout ? `card-${testimonial.name}` : undefined}
				onClick={handleExpand}
				className=""
				whileHover={{
					rotateX: 2,
					rotateY: 2,
					rotate: 3,
					scale: 1.02,
					transition: {duration: 0.3, ease: "easeOut"},
				}}
			>
				<div
					className={`${index % 2 === 0 ? "rotate-0" : "-rotate-0"} rounded-3xl bg-gradient-to-b from-[#f2f0eb] to-[#fff9eb] h-[500px] md:h-[550px] w-80 md:w-96 overflow-hidden flex flex-col items-center justify-center relative z-10 shadow-md`}
				>
					<div className="absolute opacity-30" style={{inset: "-1px 0 0"}}>
						<div className="absolute inset-0">
							<Image
								className="block w-full h-full object-center object-cover"
								src={backgroundImage}
								alt="Background layer"
								layout="fill"
								objectFit="cover"
							/>
						</div>
					</div>
					<ProfileImage src={testimonial.profileImage} alt={testimonial.name} />
					<motion.p
						layoutId={layout ? `title-${testimonial.name}` : undefined}
						className="text-[rgba(31, 27, 29, 0.7)] text-2xl md:text-2xl font-normal text-center [text-wrap:balance] font-tiemposHeadline mt-4 lowercase px-3"
					>
						{testimonial.description.length > 100
							? `${testimonial.description.slice(0, 100)}...`
							: testimonial.description}
					</motion.p>
					<motion.p
						layoutId={layout ? `category-${testimonial.name}` : undefined}
						className="text-[rgba(31, 27, 29, 0.7)] text-xl md:text-2xl font-thin font-tiemposHeadline italic text-center mt-5 lowercase"
					>
						{testimonial.name}.
					</motion.p>
					<motion.p
						layoutId={layout ? `category-${testimonial.name}` : undefined}
						className="text-[rgba(31, 27, 29, 0.7)] text-base md:text-base font-thin font-tiemposHeadline italic text-center mt-1 lowercase underline underline-offset-8 decoration-1"
					>
						{testimonial.designation.length > 25
							? `${testimonial.designation.slice(0, 25)}...`
							: testimonial.designation}
					</motion.p>
				</div>
			</motion.button>
		</>
	);
};

const ProfileImage = ({src, alt, ...rest}: ImageProps) => {
	const [isLoading, setLoading] = useState(true);

	return (
		<div className="w-[90px] h-[90px] md:w-[150px] md:h-[150px] opacity-80 overflow-hidden rounded-[1000px] border-[3px] border-solid border-[rgba(59,59,59,0.6)] aspect-[1/1] flex-none saturate-[0.2] sepia-[0.46] relative">
			<Image
				className={cn(
					"transition duration-300 absolute top-0 inset-0 rounded-inherit object-cover z-50",
					isLoading ? "blur-sm" : "blur-0",
				)}
				onLoad={() => {
					return setLoading(false);
				}}
				src={src}
				width={150}
				height={150}
				loading="lazy"
				decoding="async"
				blurDataURL={typeof src === "string" ? src : undefined}
				alt={alt || "Profile image"}
				{...rest}
			/>
		</div>
	);
};

// Export the components
export {Carousel, TestimonialCard, ProfileImage};
