"use client"
import { useState, useEffect, useRef } from "react"
import { gsap } from "gsap"
import { cn } from "@/lib/utils"

interface menuLink {
	label: string
	href: string
	img: string
}

interface socialLink {
	label: string
	href: string
}

export default function FullScreenNav({
	menuLinks,
	socialLinks,
	mainRef,
	className = "",
}: {
	menuLinks: menuLink[]
	socialLinks: socialLink[]
	mainRef: any
	className?: string
}) {
	const containerRef = mainRef
	const menuToggleRef = useRef<HTMLDivElement>(null)
	const menuOverlayRef = useRef<HTMLDivElement>(null)
	const menuContentRef = useRef<HTMLDivElement>(null)
	const menuPreviewImgRef = useRef<HTMLDivElement>(null)
	const menuLinksRef = useRef<any>(null)

	const [isOpen, setIsOpen] = useState(false)
	const [isAnimating, setIsAnimating] = useState(false)

	useEffect(() => {
		menuLinksRef.current = document.querySelectorAll(".link a")

		menuLinksRef.current?.forEach((link: any) => {
			link.addEventListener("mouseover", () => {
				if (!isOpen || isAnimating) return

				const imgSrc = link.getAttribute("data-img")
				if (!imgSrc) return

				const previewImages =
					menuPreviewImgRef.current?.querySelectorAll("img") ?? []
				console.log(previewImages)
				if (
					previewImages.length > 0 &&
					previewImages[previewImages.length - 1].src.endsWith(imgSrc)
				)
					return

				const newImg = document.createElement("img")
				newImg.src = imgSrc
				newImg.style.opacity = "0"
				newImg.style.transform = "scale(1.25) rotate(10deg)"
				newImg.className =
					"w-full h-full object-cover absolute will-change-[transform,opacity]"
				menuPreviewImgRef.current?.appendChild(newImg)

				cleanupPreviewImages()

				gsap.to(newImg, {
					opacity: 1,
					scale: 1,
					rotation: 0,
					duration: 0.75,
					ease: "power2.out",
				})
			})
		})
	}, [isOpen, isAnimating])

	const cleanupPreviewImages = () => {
		const previewImages =
			menuPreviewImgRef.current?.querySelectorAll("img") ?? []
		if (previewImages.length > 3) {
			for (let i = 0; i < previewImages.length - 3; i++) {
				menuPreviewImgRef.current?.removeChild(previewImages[i])
			}
		}
	}

	const resetPreviewImage = () => {
		if (!menuPreviewImgRef.current) return
		menuPreviewImgRef.current.innerHTML = ""
		const img = document.createElement("img")
		img.src = menuLinks[0].img
		img.className =
			"w-full h-full object-cover absolute will-change-[transform,opacity]"
		menuPreviewImgRef.current.appendChild(img)
	}

	const animateMenuToggle = (opening: boolean) => {
		const open = document.getElementById("xabecctht-menu-open")
		const close = document.getElementById("xabecctht-menu-close")

		gsap.to(opening ? open : close, {
			x: -5,
			y: opening ? -10 : 10,
			rotation: opening ? -5 : 5,
			opacity: 0,
			delay: 0.25,
			duration: 0.5,
			ease: "power2.out",
		})

		gsap.to(opening ? close : open, {
			x: 0,
			y: 0,
			rotation: 0,
			opacity: 1,
			delay: 0.5,
			duration: 0.5,
			ease: "power2.out",
		})
	}

	const openMenu = () => {
		if (isAnimating || isOpen) return
		setIsAnimating(true)

		gsap.to(containerRef.current, {
			rotation: 10,
			x: 300,
			y: 450,
			scale: 1.5,
			duration: 1.25,
			ease: "power4.inOut",
		})

		animateMenuToggle(true)

		gsap.to(menuContentRef.current, {
			rotation: 0,
			x: 0,
			y: 0,
			scale: 1,
			opacity: 1,
			duration: 1.25,
			ease: "power4.inOut",
		})

		gsap.to([".link a", ".social a"], {
			y: "0%",
			delay: 0.75,
			opacity: 1,
			duration: 1,
			stagger: 0.1,
			ease: "power3.out",
		})

		gsap.to(menuOverlayRef.current, {
			clipPath: "polygon(0% 0%, 100% 0%, 100% 175%, 0% 100%)",
			duration: 1.25,
			ease: "power4.inOut",
			onComplete: () => {
				setIsOpen(true)
				setIsAnimating(false)
			},
		})
	}

	const closeMenu = () => {
		if (isAnimating || !isOpen) return
		setIsAnimating(true)

		gsap.to(containerRef.current, {
			rotation: 0,
			x: 0,
			y: 0,
			scale: 1,
			duration: 1.25,
			ease: "power4.inOut",
		})

		animateMenuToggle(false)

		gsap.to(menuContentRef.current, {
			rotation: -15,
			x: -100,
			y: -100,
			scale: 1.5,
			opacity: 0.25,
			duration: 1.25,
			ease: "power4.inOut",
		})

		gsap.to(menuOverlayRef.current, {
			clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
			duration: 1.25,
			ease: "power4.inOut",
			onComplete: () => {
				setIsOpen(false)
				setIsAnimating(false)
				gsap.set([".link a", ".social a"], { y: "120%" })
				resetPreviewImage()
			},
		})
	}

	return (
		<div className={cn("w-full overflow-hidden", className)}>
			<nav className="fixed w-screen flex justify-between items-center z-[2] p-2 md:px-[2.5em] md:py-4">
				<div className="logo">
					<a
						className="font-semibold relative no-underline text-white text-base select-none"
						href="/"
					>
						Unstruct.
					</a>
				</div>

				<div
					className="menu-toggle relative w-6 h-6 cursor-pointer"
					ref={menuToggleRef}
					onClick={() => (isOpen ? closeMenu() : openMenu())}
				>
					<p
						className="absolute origin-top-left will-change-[transform,opacity] no-underline text-white text-base font-light select-none"
						id="xabecctht-menu-open"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 256 256"
							width={24}
							height={24}
						>
							<rect width="256" height="256" fill="none" />
							<line
								x1="40"
								y1="128"
								x2="216"
								y2="128"
								fill="none"
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="16"
							/>
							<line
								x1="40"
								y1="64"
								x2="216"
								y2="64"
								fill="none"
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="16"
							/>
							<line
								x1="40"
								y1="192"
								x2="216"
								y2="192"
								fill="none"
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="16"
							/>
						</svg>
					</p>
					<p
						className="opacity-0 translate-x-[-5px] translate-y-2.5 rotate-[5deg] absolute origin-top-left will-change-[transform,opacity] no-underline text-white text-base font-light select-none"
						id="xabecctht-menu-close"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 256 256"
							width={24}
							height={24}
						>
							<rect width="256" height="256" fill="none" />
							<line
								x1="200"
								y1="56"
								x2="56"
								y2="200"
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="16"
							/>
							<line
								x1="200"
								y1="200"
								x2="56"
								y2="56"
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="16"
							/>
						</svg>
					</p>
				</div>
			</nav>

			<div
				className="menu-overlay fixed w-screen h-[100svh] bg-black z-[1]"
				style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)" }}
				ref={menuOverlayRef}
			>
				<div
					ref={menuContentRef}
					className="menu-content relative w-full h-full flex justify-center items-center origin-[left_bottom] will-change-[opacity,transform] translate-x-[-100px] translate-y-[-100px] rotate-[-15deg] opacity-25 scale-150"
				>
					<div className="menu-items w-full flex gap-[2.5em] p-[2.5em]">
						<div className="col-lg flex justify-center items-center max-md:hidden flex-3/5">
							<div
								className="menu-preview-img relative w-[45%] self-stretch overflow-hidden"
								ref={menuPreviewImgRef}
							>
								<img
									src={menuLinks[0].img}
									alt="image"
									className="w-full h-full object-cover absolute will-change-[transform,opacity]"
								/>
							</div>
						</div>
						<div className="col-sm flex flex-col justify-end  gap-[2.5em] flex-2/5">
							<div className="menu-links flex flex-col gap-[0.5em]">
								{menuLinks.map((link, index) => (
									<div
										key={index}
										className="link pb-1.5"
										style={{
											clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
										}}
									>
										<a
											className="text-[3.5rem] leading-[1.1] tracking-[-0.02rem] inline-block will-change-transform transition-[color] duration-[0.5s] translate-y-[120%] opacity-25 relative no-underline text-white text-base font-light select-none after:absolute after:content-[''] after:w-full after:h-0.5 after:origin-right after:transition-transform after:duration-[0.3s] after:ease-[cubic-bezier(0.6,0,0.4,1)] after:scale-x-0 after:left-0 after:top-[102.5%] after:bg-white hover:after:origin-left hover:after:scale-x-100"
											href={link.href}
											data-img={link.img}
										>
											{link.label}
										</a>
									</div>
								))}
							</div>

							<div className="menu-socials flex flex-col gap-[0.5em]">
								{socialLinks.map((link, index) => (
									<div
										key={index}
										className="social pb-1.5"
										style={{
											clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
										}}
									>
										<a
											className="text-white/70 hover:text-white inline-block will-change-transform transition-[color] duration-[0.5s] translate-y-[120%] opacity-25 relative no-underline  text-base font-light select-none after:absolute after:content-[''] after:w-full after:h-0.5 after:origin-right after:transition-transform after:duration-[0.3s] after:ease-[cubic-bezier(0.6,0,0.4,1)] after:scale-x-0 after:left-0 after:top-[102.5%] after:bg-white hover:after:origin-left hover:after:scale-x-100"
											href={link.href}
										>
											{link.label}
										</a>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
