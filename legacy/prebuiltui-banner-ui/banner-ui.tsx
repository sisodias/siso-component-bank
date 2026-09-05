"use client";

import React from "react";


export default function Example() {
    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
            
                * {
                    font-family: 'Poppins', sans-serif;
                }
            `}</style>
            <section className="flex flex-col items-center justify-center mx-auto max-md:mx-2 max-md:px-2 max-w-5xl w-full text-center rounded-2xl py-20 md:py-24 bg-[url('https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/banners/image-2.png')] bg-cover bg-center bg-no-repeat">
                <h1 className="text-2xl md:text-3xl font-medium text-white max-w-2xl">Empower Your Sales & Marketing with a Next-Gen AI Workforce</h1>
                <div className="h-[3px] w-32 my-1 bg-gradient-to-l from-transparent to-white"></div>
                <p className="text-sm md:text-base text-white max-w-xl">
                    Leverage AI Agents for real-time calling and unified multi-channel engagement, optimizing customer interactions at scale.
                </p>
                <button className="px-10 py-3 mt-4 text-sm bg-white hover:scale-105 transition duration-300 rounded-full">
                    Get Started
                </button>
            </section>
        </>
    );
};