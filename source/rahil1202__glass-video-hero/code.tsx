import { useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";

const HeroSection = () => {
  const [fullBleed, setFullBleed] = useState(true);

  const VIDEO_URL =
    "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260210_031346_d87182fb-b0af-4273-84d1-c6fd17d6bf0f.mp4";

  return (
    <section
      className={`relative w-full overflow-hidden transition-all duration-500 ease-in-out ${
        fullBleed ? "min-h-screen" : "py-32 lg:py-40"
      }`}
    >
      {/* Height Toggle */}
      <button
        onClick={() => setFullBleed(!fullBleed)}
        aria-label={fullBleed ? "Switch to fit-to-content" : "Switch to full-bleed"}
        className="absolute top-4 right-4 z-20 p-2.5 rounded-[10px] backdrop-blur-xl border border-[rgba(164,132,215,0.5)] bg-[rgba(85,80,110,0.4)] text-foreground hover:bg-[rgba(85,80,110,0.6)] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {fullBleed ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
      </button>

      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src={VIDEO_URL} type="video/mp4" />
      </video>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center text-center mt-32 px-6">
        {/* Tagline Pill */}
        <div className="inline-flex items-center gap-2.5 h-[38px] px-3.5 rounded-[10px] backdrop-blur-xl border border-[rgba(164,132,215,0.5)] bg-[rgba(85,80,110,0.4)] shadow-[0_0_20px_rgba(123,57,252,0.15),inset_0_1px_0_rgba(255,255,255,0.08)]">
          <span className="bg-primary text-primary-foreground font-cabin font-medium text-xs px-2.5 py-1 rounded-[6px] shadow-[0_0_8px_rgba(123,57,252,0.4)]">
            New
          </span>
          <span className="font-cabin font-medium text-sm text-foreground tracking-wide">
            Say Hello to Datacore v3.2
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-instrument text-foreground text-5xl lg:text-[96px] leading-[1.05] tracking-[-0.02em] mt-8 max-w-5xl">
          Book your perfect stay
          <br className="hidden lg:block" />
          instantly{" "}
          <em
            className="italic mx-[0.08em] relative inline-block"
            style={{ fontStyle: "italic" }}
          >
            and
          </em>{" "}
          hassle-free
        </h1>

        {/* Subtext */}
        <p className="font-inter font-normal text-lg text-muted-foreground mt-6 max-w-[662px]">
          Discover handpicked hotels, resorts, and stays across your favorite
          destinations. Enjoy exclusive deals, fast booking, and 24/7 support.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
          <button className="px-8 py-3.5 rounded-[10px] bg-primary text-primary-foreground font-cabin font-medium text-base hover:brightness-110 transition-all shadow-lg shadow-primary/25">
            Book a Free Demo
          </button>
          <button className="px-8 py-3.5 rounded-[10px] bg-secondary text-secondary-foreground font-cabin font-medium text-base hover:brightness-125 transition-all">
            Get Started Now
          </button>
        </div>
      </div>
    </section>
  );
};

export { HeroSection }