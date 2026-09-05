"use client";

import { motion } from "motion/react";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-12 md:py-24">
                <div className="grid md:grid-cols-2 gap-8 relative overflow-x-hidden">
                    <div className="md:order-2 relative">
                        <div className="absolute -z-10 w-72 h-72 rounded-full bg-[#f8b3c4] blur-3xl opacity-20 -top-10 -left-10"></div>
                        <img
                            src="https://ferf1mheo22r9ira.public.blob.vercel-storage.com/portrait2-x5MjJSaQ9ed0HZrewEhH7TkZwjZ66K.jpeg"
                            alt="Fashion model"
                            className="rounded-2xl shadow-2xl w-full object-cover filter brightness-105"
                        />
                    </div>
                    <div className="md:order-1 flex flex-col justify-between">
                        <div className="flex flex-col h-full justify-between">
                            <h1 className="text-7xl font-bold text-black leading-tight tracking-tighter">
                                Kokonut.
                            </h1>
                            <ul className="space-y-2 tracking-tighter text-lg text-black/90">
                                {[
                                    "Ready-to-wear",
                                    "Accessories",
                                    "Footwear",
                                    "Leather goods",
                                    "Jewelry",
                                ].map((item, index) => (
                                    <motion.li
                                        key={item}
                                        initial={{ opacity: 0.8 }}
                                        whileHover={{
                                            opacity: 1,
                                            y: -3,
                                            transition: {
                                                duration: 0.4,
                                                ease: "easeOut",
                                            },
                                        }}
                                        transition={{
                                            delay: index * 0.1,
                                        }}
                                    >
                                        <a href="#" className="cursor-pointer">
                                            {item}
                                        </a>
                                    </motion.li>
                                ))}
                            </ul>
                            <div>
                                <h2 className="text-2xl font-medium text-black mt-auto pt-8">
                                    SUMMER 2025
                                </h2>
                                <p className="text-lg text-black/95 max-w-md pt-4 tracking-tight">
                                    <a
                                        href="https://kokonutui.com/"
                                        className="underline"
                                    >
                                        "The Bright Young"
                                    </a>{" "}
                                    draws inspiration from Anglomania,
                                    redefining sartorial elegance and school
                                    uniforms with a nod to British heritage.
                                    Suits of the collection are tailored out of
                                    English cloth, crafted from 1920's inspired
                                    cashmeres and wools, rewoven...
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
