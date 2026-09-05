"use client"
import { useGSAP } from "@gsap/react"
import { useRef } from "react"
import gsap from "gsap"

export function Component() {
	const containerRef = useRef<any>(null)
	gsap.registerPlugin(useGSAP)

	useGSAP(
		() => {
			let herotl = gsap.timeline()
			herotl
				.from(".hero-background", {
					duration: 1,
					opacity: 0.8,
					scale: 1.2,
					ease: "power4.out",
				})
				.from(
					".nav div",
					{
						duration: 0.6,
						opacity: 0,
						y: -10,
						ease: "back(1.5)",
						autoAlpha: 0,
						stagger: 0.08,
					},
					"-=0.8"
				)
				.from(
					".hero-heading",
					{
						duration: 0.8,
						opacity: 0,
						y: 20,
						ease: "back(1.4)",
						autoAlpha: 0,
					},
					"<"
				)
				.to(
					".hero",
					{
						duration: 0.1,
						borderColor: "rgba(255, 255, 255, 0.1)",
						ease: "power4.out",
					},
					"<"
				)
				.from(
					".hero-subheading",
					{
						duration: 0.6,
						opacity: 0,
						y: 20,
						ease: "power4.out",
						autoAlpha: 0,
					},
					"-=0.6"
				)
				.from(
					".hero-footer",
					{
						duration: 0.6,
						opacity: 0,
						y: 20,
						ease: "power4.out",
						autoAlpha: 0,
					},
					"<"
				)
				.from(
					".hero-supheading",
					{
						duration: 0.6,
						opacity: 0,
						x: 20,
						ease: "back(1.7)",
						autoAlpha: 0,
					},
					"<"
				)
		},
		{ scope: containerRef }
	)
	return (
		<section className="w-screen overflow-x-hidden">
			<section
				className="w-full h-svh px-2 md:px-10 relative text-white/90 overflow-hidden"
				ref={containerRef}
			>
				<img
					className="absolute top-0 left-0 object-cover size-full z-10 hero-background"
					src={"https://images2.imgbox.com/c8/68/SzQxCNVA_o.png"}
					alt="bg"
				/>
				<div className="relative z-20 size-full flex flex-col items-start justify-center md:border-x border-transparent hero overflow-hidden">
					<nav className="absolute top-0 left-0 right-0 flex items-center justify-between pt-4 px-2 md:px-6 z-[888] nav [&>div]:invisible">
						<div className="flex items-center gap-8">
							<a
								href="#"
								className="font-hanken-grotesk font-semibold text-xl hover:opacity-80 duration-300"
							>
								lurn.
							</a>
							<div className="w-px h-[30px] bg-white/[0.1] hidden md:block" />
							<div className="md:flex items-center gap-8 text-sm hidden">
								<a href="#">About</a>
								<a href="#">Stories</a>
								<a href="#">Collective</a>
							</div>
						</div>

						<div className="flex items-center justify-end">
							<button className="px-5 py-1.5 rounded-lg bg-white text-black hover:opacity-80 cursor-pointer duration-300 text-sm">
								Get Started
							</button>
						</div>
					</nav>

					<div className="px-2 md:px-6 w-full overflow-hidden">
						<h1 className="leading-[1] font-urbanist tracking-tight text-4xl md:text-[64px] hero-heading invisible">
							Rise Above the Noise
						</h1>
						<p className="max-w-[500px] mt-3 text-sm md:text-base hero-subheading invisible">
							Discover clarity where the chaos fades. Lurn helps you reclaim
							focus and work with intention, not interruption.
						</p>
					</div>

					<div className="absolute bottom-0 top-0 right-0 md:flex items-center pr-3 hidden">
						<p className="[writing-mode:vertical-lr] rotate-180 hero-supheading invisible">
							[Clarity fuels better decisions.]
						</p>
					</div>

					<div className="absolute bottom-0 left-0 right-0 px-2 md:px-6 flex items-center gap-4 justify-between pb-4 text-xs md:text-sm hero-footer invisible">
						<span>© Lurn • All rights reserved.</span>
						<span>[Better isn't louder.]</span>
						<span className="hidden md:block">.CC</span>
					</div>
				</div>
			</section>
		</section>
	)
}
