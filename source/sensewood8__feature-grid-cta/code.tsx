import React from 'react';
import { cn } from '../../lib/utils';

interface Feature {
    icon: React.ReactNode;
    description: string;
}

interface CompanyLogo {
    svg: React.ReactNode;
    name: string;
}

interface FeatureGridCTAProps {
    features?: Feature[];
    ctaTitle?: string;
    ctaButtonText?: string;
    ctaButtonHref?: string;
    trustedByTitle?: string;
    companyLogos?: CompanyLogo[];
    backgroundImage?: string;
}

const FeatureGridCTA: React.FC<FeatureGridCTAProps> = ({
    features = [
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2" opacity=".5" />
                    <path fill="currentColor" d="M12 6a1 1 0 0 1 1 1v4.586l2.707 2.707a1 1 0 0 1-1.414 1.414l-3-3A1 1 0 0 1 11 12V7a1 1 0 0 1 1-1" />
                </svg>
            ),
            description: "Your learning path adapts based on progress and skill assessments."
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M2 12c0-4.714 0-7.071 1.464-8.536C4.93 2 7.286 2 12 2s7.071 0 8.535 1.464C22 4.93 22 7.286 22 12s0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12" opacity=".5" />
                    <path fill="currentColor" d="M12 7.75a.75.75 0 0 1 .75.75v3.69l2.28 2.28a.75.75 0 1 1-1.06 1.06l-2.5-2.5a.75.75 0 0 1-.22-.53V8.5a.75.75 0 0 1 .75-.75" />
                </svg>
            ),
            description: "The system knows when to push or hold back — based on mastery zones."
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 22c-4.714 0-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12s0-7.071 1.464-8.536C4.93 2 7.286 2 12 2s7.071 0 8.535 1.464C22 4.93 22 7.286 22 12s0 7.071-1.465 8.535C19.072 22 16.714 22 12 22" opacity=".5" />
                    <path fill="currentColor" d="M16.03 8.97a.75.75 0 0 1 0 1.06l-5 5a.75.75 0 0 1-1.06 0l-2-2a.75.75 0 1 1 1.06-1.06l1.47 1.47l4.47-4.47a.75.75 0 0 1 1.06 0" />
                </svg>
            ),
            description: "No more switching platforms. Theory, practice, and labs unified."
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M19.83 8.7L12 2.1a.08.08 0 0 0-.07 0L4.17 8.7A1 1 0 0 0 4 9.6V20a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9.6a1 1 0 0 0-.17-.9" opacity=".5" />
                    <path fill="currentColor" d="M12.75 18a.75.75 0 0 1-1.5 0v-4a.75.75 0 0 1 1.5 0z" />
                </svg>
            ),
            description: "Portfolio, skills, and credentials tracked. Always know your value."
        }
    ],
    ctaTitle = "We unify your missions, telemetry, and crew insights into one adaptive command console that evolves as you explore deeper into space — no clutter, no guesswork.",
    ctaButtonText = "Try For Free",
    ctaButtonHref = "#",
    trustedByTitle = "Trusted by teams at",
    companyLogos = [],
    backgroundImage = "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/a5387a0b-52c6-40c2-b3be-ef86329b19cc_1600w.webp"
}) => {
    return (
        <div className="flex flex-col z-10 w-full relative gap-x-16 gap-y-16 m-8 max-w-5xl my-20 mx-auto">
            {/* Top Feature Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                {features.map((feature, index) => (
                    <div key={index} className="flex flex-col gap-4">
                        <div className="text-zinc-900">
                            {feature.icon}
                        </div>
                        <p className="leading-relaxed text-base font-medium font-normal text-zinc-900">
                            {feature.description}
                        </p>
                    </div>
                ))}
            </div>

            {/* Main CTA Card */}
            <div className="overflow-hidden min-h-[500px] lg:min-h-[600px] rounded-[2rem] relative shadow-2xl shadow-zinc-900/30 bg-zinc-900">
                {/* Grid Pattern Overlay */}
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }}
                />

                {/* Content Container */}
                <div className="grid grid-cols-1 lg:grid-cols-1 min-h-[500px] lg:min-h-[600px] relative h-full">
                    {/* Left: Text Content */}
                    <div
                        className="flex flex-col md:p-12 lg:p-16 bg-center bg-cover pt-8 pr-8 pb-8 pl-8 saturate-50 justify-center"
                        style={{ backgroundImage: `url(${backgroundImage})` }}
                    >
                        <h2 className="md:text-4xl lg:text-5xl leading-tight text-3xl font-normal tracking-tight mb-8 text-white">
                            {ctaTitle}
                        </h2>

                        <a
                            href={ctaButtonHref}
                            className="group flex items-center gap-3 transition-all text-sm font-medium rounded-full px-6 py-3 w-fit shadow-lg hover:shadow-xl hover:-translate-y-0.5 bg-white hover:bg-zinc-100 text-zinc-900"
                        >
                            <span>{ctaButtonText}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                                <path d="M5 12h14" />
                                <path d="m12 5 7 7-7 7" />
                            </svg>
                        </a>

                        {/* Trusted By */}
                        <div className="mt-12 pt-8 border-t border-white/10">
                            <p className="text-xs uppercase tracking-widest mb-4 font-medium text-white/50">
                                {trustedByTitle}
                            </p>
                            <div className="flex flex-wrap items-center gap-6 opacity-60">
                                {companyLogos.map((company, index) => (
                                    <div key={index} title={company.name}>
                                        {company.svg}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: App Preview */}
                    <div className="lg:justify-end lg:p-0 lg:pr-12 -bottom-40 lg:scale-100 hidden sm:block pt-8 pr-12 pb-8 pl-8 absolute right-0 scale-50 items-end justify-center">
                        {/* Phone Mockup */}
                        <div className="relative w-[280px] md:w-[320px] transform translate-y-8 lg:translate-y-16">
                            {/* Phone Frame */}
                            <div
                                className="rounded-[2.5rem] pt-3 pr-3 pb-3 pl-3 relative shadow-2xl bg-zinc-800"
                                style={{ boxShadow: '0 50px 100px -20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)' }}
                            >
                                {/* Screen */}
                                <div className="relative rounded-[2rem] overflow-hidden bg-white">
                                    {/* Status Bar */}
                                    <div className="flex items-center justify-between px-6 py-3 bg-zinc-50">
                                        <span className="text-xs font-semibold text-zinc-900">9:41</span>
                                        <div className="flex items-center gap-1">
                                            <div className="w-4 h-2 rounded-sm bg-zinc-400"></div>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" className="text-zinc-400">
                                                <path fill="currentColor" d="M12 3C7.5 3 3.75 4.95 1 8l11 13l11-13c-2.75-3.05-6.5-5-11-5" />
                                            </svg>
                                            <div className="w-6 h-3 border rounded-sm relative border-zinc-400">
                                                <div className="absolute inset-0.5 bg-emerald-500 rounded-sm" style={{ width: '70%' }}></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* App Content */}
                                    <div className="p-5 space-y-5">
                                        {/* Greeting */}
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-lg font-normal tracking-tight text-zinc-900">Hi, Marcus</p>
                                            </div>
                                            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-zinc-100">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" className="text-zinc-600">
                                                    <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4m0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4" />
                                                </svg>
                                            </div>
                                        </div>

                                        {/* Daily Suggestion Card */}
                                        <div className="rounded-2xl px-4 py-4 bg-zinc-700">
                                            <p className="text-[10px] uppercase tracking-wider mb-1 text-zinc-400">Today's suggestion</p>
                                            <p className="text-base font-normal tracking-tight mb-3 text-white">Complete Module 3</p>
                                            <div className="space-y-2">
                                                <div className="h-2 rounded-full overflow-hidden bg-zinc-700">
                                                    <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full" style={{ width: '65%' }}></div>
                                                </div>
                                                <div className="flex justify-between text-[10px]">
                                                    <span className="text-zinc-400">2h 15m · Zone 2</span>
                                                    <span className="text-indigo-400">65%</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Weekly Progress Card */}
                                        <div className="border rounded-2xl p-4 bg-zinc-50 border-zinc-100">
                                            <p className="text-[10px] uppercase tracking-wider mb-1 text-zinc-400">Weekly Progress</p>
                                            <p className="text-xl font-normal tracking-tight mb-2 text-zinc-900">87% Learning Load</p>
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-2 rounded-full overflow-hidden bg-zinc-200">
                                                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '87%' }}></div>
                                                </div>
                                                <span className="text-[10px] font-medium text-emerald-600">Optimal</span>
                                            </div>
                                        </div>

                                        {/* XP Balance Card */}
                                        <div className="border rounded-2xl p-4 bg-zinc-50 border-zinc-100">
                                            <p className="text-[10px] uppercase tracking-wider mb-1 text-zinc-400">XP Balance</p>
                                            <div className="flex items-baseline gap-1">
                                                <p className="text-xl font-semibold tracking-tight text-zinc-900">4,850</p>
                                                <span className="text-sm text-zinc-400">XP</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeatureGridCTA;
