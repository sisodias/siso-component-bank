import { Button } from "./button";
import { cn } from "@/lib/utils.ts"

interface Avatar {
    id: number;
    src: string;
    alt: string;
};

const AVATARS: Avatar[] = [
    { id: 1, src: "https://i.pravatar.cc/40?img=12", alt: "Customer avatar 1" },
    { id: 2, src: "https://i.pravatar.cc/40?img=32", alt: "Customer avatar 2" },
    { id: 3, src: "https://i.pravatar.cc/40?img=45", alt: "Customer avatar 3" },
    { id: 4, src: "https://i.pravatar.cc/40?img=56", alt: "Customer avatar 4" },
];

export function HeroGridSection() {
  return (
    <HeroGrid
      avatars= { AVATARS }
      title="Build, launch, and scale your product faster"
      subtitle="A modern platform that helps teams ship better software with less effort."
      primaryCtaText="Request Demo"
      secondaryCtaText="Get Started For Free"
    />
   );
}

interface HeroGridSectionProps {
    avatars: Avatar[];
    title?: ReactNode | string;
    subtitle?: ReactNode | string;
    primaryCtaText?: string;
    secondaryCtaText?: string;
    onPrimaryCtaClick?: () => void;
    onSecondaryCtaClick?: () => void;
    className?: string;
}

export function HeroGrid({
    avatars = AVATARS,
    title = "Build, launch, and scale your product faster",
    subtitle = "A modern platform that helps teams ship better software with less effort.",
    primaryCtaText = "Request Demo",
    secondaryCtaText = "Get Started For Free",
    onPrimaryCtaClick,
    onSecondaryCtaClick,
    className,
}: HeroGridSectionProps) {
    return (
        <section className= {cn("relative min-h-[calc(630px-var(--header-height))] overflow-hidden pb-10", className)} >
        <div className="absolute left-0 top-0 z-0 grid h-full w-full grid-cols-[clamp(28px,10vw,120px)_auto_clamp(28px,10vw,120px)] border-b border-[--border] dark:border-[--dark-border]" >
            {/* Decorations */ }
            < div className = "col-span-1 flex h-full items-center justify-center" />
                <div className="col-span-1 flex h-full items-center justify-center border-x border-[--border] dark:border-[--dark-border]" />
                    <div className="col-span-1 flex h-full items-center justify-center" />
                        </div>
    {/* --- */ }
    <figure className="pointer-events-none absolute -bottom-[70%] left-1/2 z-0 block aspect-square w-[520px] -translate-x-1/2 rounded-full bg-[--accent-500-40] blur-[200px]" />
        <figure className="pointer-events-none absolute left-[4vw] top-[64px] z-20 hidden aspect-square w-[32vw] rounded-full bg-[--surface-primary] opacity-50 blur-[100px] dark:bg-[--dark-surface-primary] md:block" />
            <figure className="pointer-events-none absolute bottom-[-50px] right-[7vw] z-20 hidden aspect-square w-[30vw] rounded-full bg-[--surface-primary] opacity-50 blur-[100px] dark:bg-[--dark-surface-primary] md:block" />
                {/* --- */ }
                < div className = "relative z-10 flex flex-col divide-y divide-[--border] pt-[35px] dark:divide-[--dark-border]" >
                    <div className="flex flex-col items-center justify-end" >
                        <div className="flex items-center gap-3 !border !border-b-0 border-[--border] px-4 py-2 dark:border-[--dark-border]" >
                            {/* Avatars */ }
                            < div className = "flex -space-x-3" >
                            {
                                avatars.map((avatar) => (
                                    <img
                                    key= { avatar.id }
                                    src = { avatar.src }
                                    alt = { avatar.alt }
                                    className = "h-8 w-8 rounded-full border border-[--border] dark:border-[--dark-border]"
                                    />
                                ))
                            }
                                < /div>
                                < /div>
                                < /div>
                                < div >
                                <div className="mx-auto flex min-h-[288px] max-w-[80vw] shrink-0 flex-col items-center justify-center gap-2 px-2 py-4 sm:px-16 lg:px-24" >
                                    <h1 className="!max-w-screen-lg text-pretty text-center text-[clamp(32px,7vw,64px)] font-medium leading-none tracking-[-1.44px] text-[--text-primary] dark:text-[--dark-text-primary] md:tracking-[-2.16px]" >
                                        {title}
                                            < /h1>
                                            < h2 className = "text-md max-w-2xl text-pretty text-center text-[--text-tertiary] dark:text-[--dark-text-tertiary] md:text-lg" >
                                                {subtitle}
                        < /h2>
                                                    < /div>
                                                    < /div>
                                                    < div className = "flex items-start justify-center px-8.25 sm:px-24" >
                                                        <div className="flex w-full max-w-[80vw] flex-col items-center justify-start md:!max-w-[392px]" >
                                                            <Button className="!h-14 flex-col items-center justify-center rounded-none !text-base flex w-full max-w-sm:!border-x-0 !border-x !border-y-0 border-[--border] !bg-transparent backdrop-blur-xl transition-colors duration-150 hover:!bg-black/5 dark:border-[--dark-border] dark:hover:!bg-white/5 cursor-pointer" variant = "outline"
                                                            onClick={onPrimaryCtaClick}
                                                            >
                                                                {primaryCtaText}
                                                                    < /Button>
                                                                    <Button className = "max-w-sm:!border-x-0 flex w-full !border-x !border-y-0 border-[--border] bg-web-gradient backdrop-blur-xl transition-colors duration-150 hover:!bg-black/5 dark:border-[--dark-border] dark:hover:!bg-white/5 !h-14 flex-col items-center justify-center rounded-none !text-base cursor-pointer text-white"
                                                                    onClick={onSecondaryCtaClick}
                                                                    >
                                                                        {secondaryCtaText}
                                                                            < /Button>
                                                                            < /div>
                                                                            < /div>
                                                                            < /div>
                                                                            < /section>
    );
}