"use client"

import { ArrowRight } from "lucide-react"

export default function HeroSection() {
  return (
    <main className="main min-h-screen pt-[300px] pb-20 relative">
      {/* Hero Video Background */}
      <video
        className="hero-video absolute -top-[20%] left-0 w-full h-[120%] object-cover z-0 bg-[#111]"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="https://mybycketvercelprojecttest.s3.sa-east-1.amazonaws.com/animation-bg.mp4" type="video/mp4" />
      </video>

      <div className="content-wrapper max-w-[1400px] mx-auto px-[60px] flex justify-between items-end relative z-[2]">
        {/* Left Content */}
        <div className="max-w-[800px]">
          <h1 className="text-[80px] font-light leading-[1.1] mb-8 tracking-[-2px]">
            Intelligent AI Agents
            <br />
            for your business
          </h1>
          <p className="text-lg leading-relaxed text-[#b8b8b8] mb-12 font-normal">
            Deploy autonomous AI agents that understand, learn, and execute
            complex tasks to transform your operations and drive growth.
          </p>
          {/* </CHANGE> */}
          <div className="flex gap-5 items-center">
            <button className="flex items-center gap-2.5 bg-[#0084ff] text-white py-3.5 px-7 rounded-md text-base font-medium hover:bg-[#0066cc] hover:translate-x-0.5 transition-all duration-200">
              Deploy Agents
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="bg-transparent text-[#b8b8b8] py-3.5 px-7 text-base font-medium hover:text-white transition-colors duration-200">
              View Demo
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="flex gap-20 items-end">
          <div className="text-center">
            <div className="text-[64px] font-light leading-none mb-3">500+</div>
            <div className="text-base text-[#b8b8b8] font-normal">AI Agents deployed</div>
          </div>
          <div className="text-center">
            <div className="text-[64px] font-light leading-none mb-3">99.9%</div>
            <div className="text-base text-[#b8b8b8] font-normal">Uptime reliability</div>
            {/* </CHANGE> */}
          </div>
        </div>
      </div>
    </main>
  )
}
