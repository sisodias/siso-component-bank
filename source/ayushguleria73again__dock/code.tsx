import React, { useRef } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  MotionValue,
} from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faUser,
  faBriefcase,
  faCode,
  faEnvelope,
  faLayerGroup,
} from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

// ----------------------
// Types
// ----------------------
type DockIconProps = {
  mouseX: MotionValue<number>;
  icon: IconDefinition;
  label: string;
  href: string;
};

// ----------------------
// Main Component
// ----------------------
const Dock: React.FC = () => {
  const mouseX = useMotionValue<number>(Infinity);

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 mx-auto flex h-16 items-end gap-4 rounded-2xl bg-[#0a0a0a]/50 border border-white/10 px-4 pb-3 backdrop-blur-md z-50 shadow-2xl"
    >
      <DockIcon mouseX={mouseX} icon={faHome} label="Home" href="#home" />
      <DockIcon mouseX={mouseX} icon={faUser} label="About" href="#about" />
      <DockIcon mouseX={mouseX} icon={faBriefcase} label="Experience" href="#experience" />
      <DockIcon mouseX={mouseX} icon={faLayerGroup} label="Work" href="#projects" />
      <DockIcon mouseX={mouseX} icon={faCode} label="Skills" href="#skills" />
      <DockIcon mouseX={mouseX} icon={faEnvelope} label="Contact" href="#contact" />
    </motion.div>
  );
};

export default Dock;

// ----------------------
// Dock Icon Component
// ----------------------
const DockIcon: React.FC<DockIconProps> = ({ mouseX, icon, label, href }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [40, 60, 40]);

  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isContact = label === 'Contact';

  return (
    <a href={href} onClick={handleClick}>
      <motion.div
        ref={ref}
        style={{ width }}
        className="aspect-square w-10 rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center relative group cursor-pointer hover:bg-white/20 transition-colors"
      >
        <div className="w-full h-full flex items-center justify-center">
          <FontAwesomeIcon
            icon={icon}
            className={`transition-colors text-lg md:text-xl ${
              isContact
                ? 'opacity-80 group-hover:opacity-100'
                : 'text-white/60 group-hover:text-white'
            }`}
            style={isContact ? { color: 'var(--primary-accent)' } : undefined}
          />
        </div>

        {/* Tooltip */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-1 rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          {label}
        </div>
      </motion.div>
    </a>
  );
};