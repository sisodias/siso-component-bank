import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Menu, X, Command, Github } from "lucide-react";

export const Component = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll effect for top border and glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Products", href: "#" },
    { name: "Documentation", href: "#" },
    { name: "Enterprise", href: "#" },
    { name: "Pricing", href: "#" },
  ];

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 w-full border-b transition-all duration-300 font-sans selection:bg-white selection:text-black",
          isScrolled
            ? "border-white/[0.08] bg-black/60 backdrop-blur-md"
            : "border-transparent bg-transparent"
        )}
      >
        <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-6 md:px-8">
          
          {/* Left: Logo & Desktop Links */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <a href="#" className="group flex items-center gap-2.5 transition-opacity hover:opacity-80">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-white text-black transition-transform group-hover:scale-95">
                <Command className="h-3.5 w-3.5" />
              </div>
              <span className="text-sm font-semibold tracking-tight text-white">Leadmeta</span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="rounded-md px-3 py-1.5 text-sm font-medium text-neutral-400 transition-colors hover:bg-white/[0.06] hover:text-white"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>

          {/* Right: Actions */}
          <div className="hidden items-center gap-5 md:flex">
            <a
              href="#"
              className="text-neutral-400 transition-colors hover:text-white"
              aria-label="GitHub Repository"
            >
              <Github className="h-4 w-4" />
            </a>
            
            <div className="h-4 w-px bg-white/[0.12]" />
            
            <a
              href="#"
              className="text-sm font-medium text-neutral-400 transition-colors hover:text-white"
            >
              Log in
            </a>
            <a
              href="#"
              className="flex h-8 items-center justify-center rounded-md bg-white px-4 text-xs font-medium text-black transition-transform hover:bg-neutral-200 active:scale-[0.98]"
            >
              Sign up
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-white/[0.05] hover:text-white md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="absolute top-14 w-full border-b border-white/[0.08] bg-black px-6 py-4 md:hidden">
            <nav className="flex flex-col gap-4 pb-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-neutral-400 transition-colors hover:text-white"
                >
                  {link.name}
                </a>
              ))}
            </nav>
            <div className="flex flex-col gap-3 pt-6 border-t border-white/[0.08]">
              <a
                href="#"
                className="flex h-10 w-full items-center justify-center rounded-md border border-white/[0.12] bg-transparent text-sm font-medium text-white transition-colors hover:bg-white/[0.05]"
              >
                Log in
              </a>
              <a
                href="#"
                className="flex h-10 w-full items-center justify-center rounded-md bg-white text-sm font-medium text-black transition-colors hover:bg-neutral-200"
              >
                Sign up
              </a>
            </div>
          </div>
        )}
      </header>
      
      {/* Spacer for fixed header 
        Remove this div if you want your hero section to go under the transparent nav
      */}
      <div className="h-14 w-full bg-black" />
    </>
  );
};