import React, { useEffect, useRef, useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const cn = (...inputs: Array<string | false | null | undefined>) => {
  return inputs.filter(Boolean).join(" ");
};

/* LOCAL styles only — no external requests, no globals */
const LocalStyles = () => (
  <style>{`
    /* small decorative underline used in hero (keeps things self-contained) */
    .hero-underline { position: absolute; left: 0; width: 100%; top: 100%; margin-top: -5px; pointer-events: none; }

    /* fade-up animation */
    @keyframes fade-in-up {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up { animation: fade-in-up 0.6s ease-out both; }
    .animate-fade-in-up-delay-1 { animation-delay: 0.2s; }
    .animate-fade-in-up-delay-2 { animation-delay: 0.4s; }

    /* Button baseline - NO hover effects */
    .btn-base {
      transition: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    /* Keyboard-style bounce animation */
    @keyframes btn-bounce {
      0% { transform: scale(1); }
      50% { transform: scale(0.95); }
      100% { transform: scale(1); }
    }
    .btn-bounce-anim {
      animation: btn-bounce 0.3s cubic-bezier(0.36, 0, 0.66, -0.56);
    }

    .btn-focus-ring:focus-visible { outline: 2px solid hsl(var(--foreground)); outline-offset: 3px; }

    /* fallback focus outline */
    .focus-outline:focus-visible { outline: 2px solid hsl(var(--foreground)); outline-offset: 2px; }
  `}</style>
);

/* cva for button - pure black and white */
const buttonVariants = cva(
  "btn-base inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-foreground text-background",
        outline: "border-2 border-foreground bg-background text-foreground",
        ghost: "bg-transparent text-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, onClick, ...props }, ref) => {
  const localRef = useRef<HTMLButtonElement | null>(null);
  const mergedRef = (node: HTMLButtonElement | null) => {
    localRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = localRef.current;
    if (!btn) return;

    // Add bounce animation
    btn.classList.add("btn-bounce-anim");
    window.setTimeout(() => btn.classList.remove("btn-bounce-anim"), 300);

    if (onClick) onClick(e);
  };

  const classes = cn(buttonVariants({ variant, size }) as string, className ?? "");
  return <button ref={mergedRef} onClick={handleClick} className={classes} {...props} />;
});
Button.displayName = "Button";

interface ComponentProps {
  brand?: string;
  heroClassName?: string;
  onSignIn?: () => void;
  onTryForFree?: () => void;
}

const Navigation: React.FC<{ brand?: string; onSignIn?: () => void }> = ({ brand = "SaaS", onSignIn }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (menuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [menuOpen]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!menuOpen) return;
      if (menuRef.current && !menuRef.current.contains(e.target as Node) && triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen && triggerRef.current) triggerRef.current.focus();
  }, [menuOpen]);

  const navItems = [
    { id: "features", label: "Features" },
    { id: "pricing", label: "Pricing" },
    { id: "about", label: "About" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <a href="/" className="text-xl font-bold tracking-tight transition-opacity">
              {brand}
            </a>
          </div>

          {/* Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a key={item.id} href={`#${item.id}`} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors focus-outline">
                {item.label}
              </a>
            ))}

            <Button size="sm" variant="default" className="focus-outline" onClick={() => onSignIn?.()}>
              Sign In
            </Button>
          </div>

          {/* Mobile */}
          <div className="md:hidden relative">
            <Button
              size="sm"
              variant="ghost"
              className="font-medium focus-outline"
              onClick={() => setMenuOpen((s) => !s)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-haspopup="menu"
              ref={triggerRef}
            >
              {menuOpen ? "Close" : "Menu"}
            </Button>

            {menuOpen && (
              <div
                id="mobile-menu"
                ref={menuRef}
                className="absolute right-0 mt-2 w-56 rounded-md border border-border bg-background/95 backdrop-blur-md p-3 shadow-lg"
                role="menu"
                aria-label="Mobile menu"
              >
                <div className="flex flex-col space-y-2">
                  {navItems.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded hover:bg-accent focus-outline"
                      onClick={() => setMenuOpen(false)}
                      role="menuitem"
                    >
                      {item.label}
                    </a>
                  ))}

                  <div className="pt-2 space-y-2">
                    <Button size="sm" variant="default" className="w-full justify-center focus-outline" onClick={() => { setMenuOpen(false); onSignIn?.(); }}>
                      Sign In
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const Hero: React.FC<{ heroClassName?: string; onTryForFree?: () => void }> = ({ heroClassName, onTryForFree }) => {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 pt-32 pb-24 md:pt-40 md:pb-32" aria-labelledby="hero-heading">
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
        <h1 id="hero-heading" className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter leading-tight animate-fade-in-up mb-6">
          A Simple Hero For Your
          <br />
          <span className="relative inline-block">
            <span className={cn(heroClassName ?? "", "font-normal text-5xl sm:text-6xl md:text-7xl")}>
              SaaS
            </span>
            <svg className="hero-underline" viewBox="0 0 170 30" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" aria-hidden="true">
              <path d="M2 9C32.8203 5.34032 108.769 -0.881146 166 3.51047" stroke="currentColor" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.9" />
            </svg>
          </span>{" "}
          Success
        </h1>

        <div className="max-w-2xl mx-auto mb-9 animate-fade-in-up animate-fade-in-up-delay-1">
          <p className="text-base sm:text-lg text-muted-foreground leading-snug">
            Level up your SaaS design with a hero built for clarity and trust.
            Scale your product, without the extra design work.
          </p>
        </div>

        <div className="animate-fade-in-up animate-fade-in-up-delay-2">
          <Button size="lg" variant="default" className="px-8 py-6 text-base rounded-lg focus-outline" onClick={() => onTryForFree?.()}>
            Try for Free
          </Button>
        </div>
      </div>
    </section>
  );
};

const Component: React.FC<ComponentProps> = ({ brand = "SaaS", heroClassName, onSignIn, onTryForFree }) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LocalStyles />
      <Navigation brand={brand} onSignIn={onSignIn} />
      <Hero heroClassName={heroClassName} onTryForFree={onTryForFree} />
    </div>
  );
};

export default Component;