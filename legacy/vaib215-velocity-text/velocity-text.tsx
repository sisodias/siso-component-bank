import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';
import { cn } from "../_utils/cn";

export const Component = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const scrollVelocity = useVelocity(scrollYProgress);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });

  const skewVelocity = useTransform(smoothVelocity, [-1, 1], ["45deg", "-45deg"]);

  const translateX = useTransform(scrollYProgress, [0, 1], [0, -3000]);
  const smoothTranslateX = useSpring(translateX, {
    mass: 3,
    stiffness: 400,
    damping: 50
  });

  return (
    <section 
      ref={containerRef} 
      className={cn(
        "h-[500vh] bg-background text-foreground",
        "transition-colors duration-300"
      )}
    >
      <div className="sticky top-0 left-0 right-0 w-screen flex h-screen flex-col justify-between overflow-hidden">
        <Header />
        <Title />
        <motion.p
          style={{
            skewX: skewVelocity,
            x: smoothTranslateX
          }}
          className={cn(
            "origin-bottom-left whitespace-nowrap text-7xl font-black uppercase leading-[0.85] md:text-9xl md:leading-[0.85]",
            "text-foreground"
          )}
        >
          Nothing in this world can take the place of persistence. Talent will not; nothing is more common than unsuccessful men with talent. Genius will not; unrewarded genius is almost a proverb. Education will not; the world is full of educated derelicts. Persistence and determination alone are omnipotent. The slogan 'Press On!' has solved and always will solve the problems of the human race.
        </motion.p>
        <ScrollIndicators />
      </div>
    </section>
  );
};

const Header = () => (
  <div className="relative mb-1 flex w-full justify-between p-6">
    <p className={cn(
      "hidden text-xs md:block",
      "text-muted-foreground"
    )}>
      40° 42' 46" N, 74° 0' 21" W
      <br />
    </p>
    <Logo />
    <Nav />
  </div>
);

const Logo = () => (
  <svg
    width="36"
    height="auto"
    viewBox="0 0 50 39"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn(
      "absolute right-4 top-1/2 h-fit -translate-y-1/2 translate-x-0 md:right-1/2 md:translate-x-1/2",
      "fill-foreground transition-colors duration-300"
    )}
  >
    <path d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z" />
    <path d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z" />
  </svg>
);

const Nav = () => (
  <nav className="flex gap-3 text-sm">
    <a 
      href="#" 
      className={cn(
        "transition-colors duration-200",
        "text-muted-foreground hover:text-foreground"
      )}
    >
      Supply
    </a>
    <a 
      href="#" 
      className={cn(
        "transition-colors duration-200",
        "text-muted-foreground hover:text-foreground"
      )}
    >
      Merch
    </a>
    <a 
      href="#" 
      className={cn(
        "transition-colors duration-200",
        "text-muted-foreground hover:text-foreground"
      )}
    >
      Locations
    </a>
  </nav>
);

const Title = () => (
  <div className="flex items-center justify-center px-4">
    <div className={cn(
      "mr-2 h-20 w-20 bg-muted rounded-sm overflow-hidden",
      "transition-colors duration-300"
    )}>
      <img
        src="https://images.unsplash.com/photo-1622599511051-16f55a1234d0?q=80&w=2536&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Placeholder image"
        className="h-full w-full object-cover"
      />
    </div>
    <h1 className="text-3xl font-bold sm:text-5xl md:text-7xl">
      <span className="text-muted-foreground">
        Life is short. <br />
        Don't waste it. <br />
        It's time to{" "}
      </span>
      <span className={cn(
        "inline-block -skew-x-[18deg] font-black",
        "text-foreground"
      )}>
        SHIFT.
      </span>
    </h1>
  </div>
);

const ScrollIndicators = () => (
  <>
    <div className={cn(
      "absolute left-4 top-1/2 hidden -translate-y-1/2 text-xs lg:block",
      "text-muted-foreground"
    )}>
      <span style={{ writingMode: "vertical-lr" }}>SCROLL</span>
      <ScrollIcon />
    </div>
    <div className={cn(
      "absolute right-4 top-1/2 hidden -translate-y-1/2 text-xs lg:block",
      "text-muted-foreground"
    )}>
      <span style={{ writingMode: "vertical-lr" }}>SCROLL</span>
      <ScrollIcon />
    </div>
  </>
);

const ScrollIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="mx-auto"
  >
    <path d="M12 5v14" />
    <path d="m19 12-7 7-7-7" />
  </svg>
);

const ThemeToggle = () => {
  const [theme, setTheme] = React.useState('light');
  
  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className={cn(
        "rounded-md p-2 transition-colors",
        "hover:bg-accent hover:text-accent-foreground"
      )}
    >
      {theme === 'light' ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      )}
    </button>
  );
};