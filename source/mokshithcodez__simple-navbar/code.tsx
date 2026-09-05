import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Menu, X, ArrowUpRight, ChevronDown, Compass, Layers, Shield, Zap } from "lucide-react";

export const Component = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Platform", href: "#" },
    { 
      name: "Solutions", 
      href: "#",
      features: [
        { title: "Analytics", desc: "Real-time data tracking", icon: Zap },
        { title: "Security", desc: "Enterprise-grade protection", icon: Shield },
        { title: "Ecosystem", desc: "Integrate with top tools", icon: Layers },
      ]
    },
    { name: "Enterprise", href: "#" },
    { name: "Pricing", href: "#" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out border-b backdrop-blur-md",
        scrolled
          ? "py-3 bg-black/60 border-white/10 m-4 rounded-2xl max-w-7xl mx-auto px-6 shadow-[0_0_50px_rgba(0,0,0,0.3)]"
          : "py-6 bg-transparent border-transparent px-8"
      )}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 overflow-hidden shadow-lg shadow-indigo-500/20">
            <Compass className="w-5 h-5 text-white transition-transform duration-700 group-hover:rotate-180" />
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white bg-clip-text">
            NEXUS
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <div
              key={link.name}
              className="relative"
              onMouseEnter={() => setActiveDropdown(link.features ? link.name : null)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <a
                href={link.href}
                className={cn(
                  "flex items-center gap-1 px-4 py-2 text-sm font-medium text-zinc-400 rounded-full transition-all duration-300 hover:text-white hover:bg-white/5",
                  activeDropdown === link.name && "text-white bg-white/5"
                )}
              >
                {link.name}
                {link.features && (
                  <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", activeDropdown === link.name && "rotate-180")} />
                )}
              </a>

              {/* Flyout Dropdown Grid */}
              {link.features && activeDropdown === link.name && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[400px] animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="p-4 bg-zinc-900/95 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl grid gap-2">
                    {link.features.map((feat) => {
                      const Icon = feat.icon;
                      return (
                        <a
                          key={feat.title}
                          href="#"
                          className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group/item"
                        >
                          <div className="p-2 bg-white/5 rounded-lg text-indigo-400 group-hover/item:text-white group-hover/item:bg-indigo-500/20 transition-colors">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-white flex items-center gap-1">
                              {feat.title}
                              <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 translate-x-0 group-hover/item:opacity-100 group-hover/item:translate-x-0.5 group-hover/item:translate-y-0 transition-all" />
                            </h4>
                            <p className="text-xs text-zinc-400 mt-0.5">{feat.desc}</p>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <a href="#" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
            Sign In
          </a>
          <a
            href="#"
            className="relative group overflow-hidden px-5 py-2.5 rounded-full bg-white text-black text-sm font-medium transition-all duration-300 hover:scale-105"
          >
            <span className="relative z-10 flex items-center gap-1">
              Start Free <ArrowUpRight className="w-4 h-4" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-4 right-4 mt-2 p-4 bg-zinc-950/95 border border-white/10 rounded-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200 shadow-2xl">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <div key={link.name} className="flex flex-col">
                <a
                  href={link.href}
                  className="px-4 py-3 text-base font-medium text-zinc-300 rounded-xl hover:text-white hover:bg-white/5 transition-colors"
                >
                  {link.name}
                </a>
                {link.features && (
                  <div className="pl-6 pr-4 py-1 flex flex-col gap-1 border-l border-white/5 ml-4">
                    {link.features.map((feat) => (
                      <a
                        key={feat.title}
                        href="#"
                        className="py-2 text-sm text-zinc-400 hover:text-white transition-colors"
                      >
                        {feat.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="h-px bg-white/10 my-2" />
            <a
              href="#"
              className="w-full text-center px-4 py-3 text-base font-medium text-zinc-300 rounded-xl hover:text-white hover:bg-white/5 transition-colors"
            >
              Sign In
            </a>
            <a
              href="#"
              className="w-full text-center px-4 py-3 bg-white text-black text-base font-medium rounded-xl transition-all active:scale-98"
            >
              Start Free
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};
