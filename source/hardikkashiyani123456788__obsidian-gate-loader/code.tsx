import React, { useLayoutEffect, useRef } from "react";

// Since we cannot install packages, we will dynamically import GSAP from CDN inside the effect.
// This matches the user's "no download" and "same output" requirement by using the same logic.

export function Component() {
  const containerRef = useRef<HTMLDivElement>(null);
  const themeToggleRef = useRef<HTMLDivElement>(null);
  const themeTextRef = useRef<HTMLParagraphElement>(null);
  const counterRef = useRef<{ value: number }>({ value: 0 });
  const counterProgressRef = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    let ctx: any;
    const container = containerRef.current;

    const loadScript = (src: string) => {
        return new Promise<void>((resolve, reject) => {
            const checkGlobal = () => {
                if ((window as any).gsap) return true;
                return false;
            };

            if (checkGlobal()) {
                resolve();
                return;
            }

            let script = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement;
            if (script) {
                // Script exists but global not ready? Poll.
                const interval = setInterval(() => {
                    if (checkGlobal()) {
                        clearInterval(interval);
                        resolve();
                    }
                }, 50);
                return;
            }

            script = document.createElement("script");
            script.src = src;
            script.async = true;
            script.onload = () => {
                const interval = setInterval(() => {
                    if (checkGlobal()) {
                        clearInterval(interval);
                        resolve();
                    }
                }, 50);
            };
            script.onerror = reject;
            document.body.appendChild(script);
        });
    };

    const initAnimations = async () => {
      try {
        await document.fonts.ready;
        
        // Load GSAP Core from cdnjs
        await loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js");
        
        const gsap = (window as any).gsap;

        if (!gsap) {
            console.error("GSAP failed to load.");
            return;
        }

        // Register custom ease alias
        if (!gsap.parseEase("hop")) { 
            gsap.registerEase("hop", gsap.parseEase("expo.inOut"));
        }
      } catch (e) {
        console.error("Failed to load GSAP:", e);
      }
    };

    const startGsapContext = (gsap: any) => {
        // Manual SplitText Implementation
        const splitTextManual = (selector: string) => {
            const elements = container?.querySelectorAll(selector);
            elements?.forEach((el: Element) => {
                const text = el.textContent || "";
                const words = text.split(/\s+/).filter((w: string) => w.length > 0);
                // Wrap in a mask div to ensure "reveal" effect works (clipping the translate)
                el.innerHTML = words.map((word: string) => `
                    <div style="display:inline-block; overflow:hidden; vertical-align:bottom">
                        <div class="word" style="display:inline-block; transform:translateY(100%)">${word}</div>
                    </div>
                `).join(" ");
            });
        };

        ctx = gsap.context(() => {
          const counterProgress = counterProgressRef.current;
          
          const themeToggle = themeToggleRef.current;
          const themeToggleText = themeTextRef.current;
          
          if (themeToggle && themeToggleText) {
             themeToggle.onclick = () => {
                document.body.classList.toggle("dark-mode");
                if (document.body.classList.contains("dark-mode")) {
                  themeToggleText.textContent = "Dark";
                } else {
                  themeToggleText.textContent = "Light";
                }
             };
          }
          
          splitTextManual(".hero-header h1");

          const counterTl = gsap.timeline({ delay: 0.5 });
          const overlayTextTl = gsap.timeline({ delay: 0.75 });
          const revealTl = gsap.timeline({ delay: 0.5 });

          // "hop" ease (0.85, 0, 0.15, 1) is very sharp. "expo.inOut" is a good built-in substitute.
          const easeType = "expo.inOut"; 

          counterTl.to(counterRef.current, {
            value: 100,
            duration: 5,
            ease: "power2.out",
            onUpdate: () => {
              if (counterProgress) {
                  counterProgress.textContent = Math.floor(counterRef.current.value).toString();
              }
            },
          });

          overlayTextTl
            .to(".overlay-text", {
              y: "0",
              duration: 0.75,
              ease: easeType,
            })
            .to(".overlay-text", {
              y: "-2rem",
              duration: 0.75,
              ease: easeType,
              delay: 0.75,
            })
            .to(".overlay-text", {
              y: "-4rem",
              duration: 0.75,
              ease: easeType,
              delay: 0.75,
            })
            .to(".overlay-text", {
              y: "-6rem",
              duration: 0.75,
              ease: easeType,
              delay: 1,
            });

          revealTl
            .to(".img", {
              y: 0,
              opacity: 1,
              stagger: 0.05,
              duration: 1,
              ease: easeType,
            })
            .to(".hero-images", {
              gap: "0.75vw",
              duration: 1,
              delay: 0.5,
              ease: easeType,
            })
            .to(".img", {
                scale: 1,
                duration: 1,
                ease: easeType,
              }, "<")
            .to(".img:not(.hero-img)", {
              clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
              duration: 1,
              stagger: 0.1,
              ease: easeType,
            })
            .to(".hero-img", {
              scale: 2,
              duration: 1,
              ease: easeType,
            })
            .to(".hero-overlay", {
              clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
              duration: 1,
              ease: easeType,
            })
            .to(".hero-header h1 .word", {
              y: "0",
              duration: 0.75,
              stagger: 0.1,
              ease: "power3.out",
            }, "-=0.5")
            .to("nav", {
              opacity: 1,
              duration: 1,
              ease: "power3.out",
            });

        }, container);
    };
    
    // Trigger
    initAnimations().then(() => {
        const gsap = (window as any).gsap;
        if (gsap) {
            startGsapContext(gsap);
        }
    });

    return () => {
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef}>
      <nav>
        <div className="nav-logo">
          <a href="#" className="link-hover" data-text="Elara Vandenberg">
            <span>Elara Vandenberg</span>
          </a>
        </div>
        <div className="nav-items">
          <div className="theme-toggle" ref={themeToggleRef}>
            <p ref={themeTextRef}>Light</p>
          </div>
          <a href="#" className="link-hover" data-text="Runway">
            <span>Runway</span>
          </a>
          <a href="#" className="link-hover" data-text="Lookbook">
            <span>Lookbook</span>
          </a>
          <a href="#" className="link-hover" data-text="Campaigns">
            <span>Campaigns</span>
          </a>
          <a href="#" className="link-hover" data-text="Biography">
            <span>Biography</span>
          </a>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-overlay">
          <div className="counter">
            <h1 ref={counterProgressRef}>0</h1>
          </div>
          <div className="overlay-text-container">
            <div className="overlay-text">
              <p>Structure</p>
              <p>Designed Identity</p>
              <p>Welcome</p>
            </div>
          </div>
        </div>

        <div className="hero-images">
          <div className="img">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2864&auto=format&fit=crop"
              alt="Fashion Editorial 1"
            />
          </div>
          <div className="img">
            <img
              src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2787&auto=format&fit=crop"
              alt="Fashion Editorial 2"
            />
          </div>
          <div className="img hero-img">
            <img
              src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=2550&auto=format&fit=crop"
              alt="Fashion Editorial 3"
            />
          </div>
          <div className="img">
            <img
              src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=2787&auto=format&fit=crop"
              alt="Fashion Editorial 4"
            />
          </div>
          <div className="img">
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2940&auto=format&fit=crop"
              alt="Fashion Editorial 5"
            />
          </div>
        </div>
        <div className="hero-header">
          <h1>Elara Vandenberg</h1>
        </div>
      </section>
    </div>
  );
}
