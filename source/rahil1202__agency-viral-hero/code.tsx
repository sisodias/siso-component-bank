import { useState, forwardRef } from "react";
import { NavLink as RouterNavLink, NavLinkProps } from "react-router-dom";
import { Play, ArrowUpRight, Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/* ---------------- NavLink Wrapper ---------------- */
interface NavLinkCompatProps extends Omit<NavLinkProps, "className"> {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName, to, ...props }, ref) => {
    return (
      <RouterNavLink
        ref={ref}
        to={to}
        className={({ isActive, isPending }) =>
          cn(className, isActive && activeClassName, isPending && pendingClassName)
        }
        {...props}
      />
    );
  }
);

NavLink.displayName = "NavLink";

/* ---------------- Main Component ---------------- */
const navLinks = ["About", "Works", "Services", "Testimonial"];

const ViralHeroSection = () => {
  const [open, setOpen] = useState(false);

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      
      {/* ---------------- NAVBAR ---------------- */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-[1200px]">
        <div
          className="flex items-center justify-between px-6 py-3 rounded-[16px] backdrop-blur-md bg-white/10 border border-white/10"
          style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}
        >
          {/* Logo */}
          <a href="/" className="font-barlow font-bold text-[20px] tracking-tight text-white">
            Logoisum
          </a>

          {/* Desktop Links */}
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link}>
                <a
                  href={`#${link.toLowerCase()}`}
                  className="font-barlow font-medium text-[14px] text-white/70 hover:text-white transition-colors"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <button className="hidden md:flex items-center gap-2.5 bg-white text-black px-5 py-2.5 rounded-full font-barlow font-medium text-[14px] hover:opacity-90 transition">
            Book A Free Meeting
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-black/10">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-full text-white"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden mt-2 backdrop-blur-md bg-white/10 border border-white/10 rounded-[16px] px-6 py-5 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                onClick={() => setOpen(false)}
                className="font-barlow font-medium text-[15px] text-white/70 hover:text-white"
              >
                {link}
              </a>
            ))}

            <button className="flex items-center justify-center gap-2.5 bg-white text-black px-5 py-3 rounded-full font-barlow font-medium text-[14px] mt-1">
              Book A Free Meeting
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-black/10">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </button>
          </div>
        )}
      </nav>

      {/* ---------------- VIDEO BACKGROUND ---------------- */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260228_065522_522e2295-ba22-457e-8fdb-fbcd68109c73.mp4"
          type="video/mp4"
        />
      </video>


      {/* ---------------- HERO CONTENT ---------------- */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 pt-24">
        
        {/* Headline */}
        <motion.h1
          className="text-white"
          style={{ textShadow: "0 10px 30px rgba(0,0,0,0.5)" }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="block font-barlow font-semibold text-[clamp(28px,5vw,56px)] tracking-[-4px] leading-[1.1]">
            Agency that makes your
          </span>
          <span className="block font-serif italic text-[clamp(48px,8vw,84px)] leading-[1.05] mt-1">
            videos &amp; reels viral
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          className="mt-6 font-barlow font-medium text-[clamp(14px,1.5vw,18px)] text-white/75 max-w-[520px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          Short-form video editing for Influencers, Creators and Brands
        </motion.p>

        {/* CTA */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="mt-10 flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-barlow font-medium text-[16px] transition"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="flex items-center justify-center w-5 h-5">
            <Play className="w-4 h-4 fill-current" />
          </span>
          See Our Works
        </motion.button>
      </div>
    </section>
  );
};

export { ViralHeroSection };