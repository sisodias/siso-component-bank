"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type Variant, type Variants } from 'framer-motion';

interface Link {
    text: string;
    href: string;
}

interface DropdownColumn {
    heading: string;
    links: Link[];
}

type DropdownData = DropdownColumn[];

interface MenuItem {
    label: string;
    href: string;
    dropdownData?: DropdownData;
}

type AnimationDirection = 'right-to-left' | 'left-to-right';

const personalDropdownData: DropdownData = [
    { heading: 'Account Settings', links: [{ text: 'Profile', href: '#' }, { text: 'Security', href: '#' }, { text: 'Notifications', href: '#' }, { text: 'Connected Accounts', href: '#' }, { text: 'Billing', href: '#' }] },
    { heading: 'Features', links: [{ text: 'Dashboard', href: '#' }, { text: 'Project Management', href: '#' }, { text: 'Task Tracking', href: '#' }, { text: 'File Storage', href: '#' }, { text: 'Collaboration Tools', href: '#' }] },
    { heading: 'Security & Privacy', links: [{ text: 'Data Security', href: '#' }, { text: 'Privacy Policy', href: '#' }, { text: 'Terms of Service', href: '#' }, { text: 'Report Abuse', href: '#' }] },
    { heading: 'Productivity', links: [{ text: 'Templates', href: '#' }, { text: 'Integrations', href: '#' }] },
    { heading: 'Communication', links: [{ text: 'Team Chat', href: '#' }, { text: 'Comments', href: '#' }, { text: 'Activity Feed', href: '#' }] },
    { heading: 'Sharing', links: [{ text: 'Share Projects', href: '#' }, { text: 'Guest Access', href: '#' }, { text: 'Public Links', href: '#' }] },
    { heading: 'Support', links: [{ text: 'Help Center', href: '#' }, { text: 'Contact Support', href: '#' }, { text: 'System Status', href: '#' }] },
    { heading: 'Plans', links: [{ text: 'Basic', href: '#' }, { text: 'Standard', href: '#' }, { text: 'Premium', href: '#' }] },
];

const businessDropdownData: DropdownData = [
    { heading: 'Team Management', links: [{ text: 'Add Members', href: '#' }, { text: 'Roles & Permissions', href: '#' }] },
    { heading: 'Workflow', links: [{ text: 'Automation', href: '#' }, { text: 'Custom Fields', href: '#' }] },
    { heading: 'Admin Tools', links: [{ text: 'Usage Analytics', href: '#' }] },
    { heading: 'Enterprise', links: [{ text: 'Contact Sales', href: '#' }] },
];

const communityDropdownData: DropdownData = [
    { heading: 'Your Profile', links: [{ text: 'Dashboard', href: '#' }, { text: 'Achievements', href: '#' }] },
    { heading: 'Contribution', links: [{ text: 'Submit Content', href: '#' }, { text: 'Join Projects', href: '#' }] },
    { heading: 'Community', links: [{ text: 'Guidelines', href: '#' }] },
];

const companyDropdownData: DropdownData = [
    { heading: 'About Us', links: [{ text: 'Our Story', href: '#' }, { text: 'Careers', href: '#' }] },
    { heading: 'Partners', links: [{ text: 'Affiliate Program', href: '#' }, { text: 'API & Integrations', href: '#' }] },
    { heading: 'Legal', links: [{ text: 'Terms of Service', href: '#' }, { text: 'Privacy Policy', href: '#' }] },
];


const menuItems: MenuItem[] = [
    { label: 'Personal', href: '#', dropdownData: personalDropdownData },
    { label: 'Business', href: '#', dropdownData: businessDropdownData },
    { label: 'Community', href: '#', dropdownData: communityDropdownData },
    { label: 'Company', href: '#', dropdownData: companyDropdownData },
];

export const Navbar: React.FC = () => {
    const [activeMenuItemIndex, setActiveMenuItemIndex] = useState<number | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [animationDirection, setAnimationDirection] = useState<AnimationDirection>('right-to-left');
    const closeTimeoutRef = useRef<number | null>(null);
    const prevActiveMenuItemIndex = useRef<number | null>(null);

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
    const [mobileActiveDropdownIndex, setMobileActiveDropdownIndex] = useState<number | null>(null);

    useEffect(() => {
        if (activeMenuItemIndex !== null && prevActiveMenuItemIndex.current !== null) {
            if (activeMenuItemIndex > prevActiveMenuItemIndex.current) {
                setAnimationDirection('right-to-left');
            } else {
                setAnimationDirection('left-to-right');
            }
        } else {
            setAnimationDirection('right-to-left');
        }
        prevActiveMenuItemIndex.current = activeMenuItemIndex;
    }, [activeMenuItemIndex]);


    const openDropdown = (index: number) => {
        if (closeTimeoutRef.current !== null) {
            clearTimeout(closeTimeoutRef.current);
        }
        setActiveMenuItemIndex(index);
        setIsDropdownOpen(true);
    };

    const closeDropdown = () => {
        closeTimeoutRef.current = setTimeout(() => {
            setIsDropdownOpen(false);
        }, 100) as unknown as number;
    };

     const handleDropdownTransitionEnd = () => {
        if (!isDropdownOpen) {
            setActiveMenuItemIndex(null);
             prevActiveMenuItemIndex.current = null;
        }
     };

    const toggleMobileMenu = () => {
        const newState = !isMobileMenuOpen;
        setIsMobileMenuOpen(newState);
        if (!newState) {
             setMobileActiveDropdownIndex(null);
        }
    };

    const toggleMobileDropdown = (index: number) => {
        setMobileActiveDropdownIndex(mobileActiveDropdownIndex === index ? null : index);
    };

     const handleMobileLinkClick = () => {
         setIsMobileMenuOpen(false);
         setMobileActiveDropdownIndex(null);
     };

     useEffect(() => {
         if (isMobileMenuOpen) {
             document.body.style.overflow = 'hidden';
         } else {
             document.body.style.overflow = 'unset';
         }
         return () => {
              document.body.style.overflow = 'unset';
         };
     }, [isMobileMenuOpen]);


    const contentVariants: { [key in AnimationDirection]: Variants } = {
        'right-to-left': {
            initial: { opacity: 0, x: 100 },
            animate: { opacity: 1, x: 0, transition: { opacity: { duration: 0.2 }, x: { duration: 0.3, ease: 'easeOut' } } },
            exit: { opacity: 0, x: -100, transition: { opacity: { duration: 0.2 }, x: { duration: 0.3, ease: 'easeIn' } } },
        },
        'left-to-right': {
            initial: { opacity: 0, x: -100 },
            animate: { opacity: 1, x: 0, transition: { opacity: { duration: 0.2 }, x: { duration: 0.3, ease: 'easeOut' } } },
            exit: { opacity: 0, x: 100, transition: { opacity: { duration: 0.2 }, x: { duration: 0.3, ease: 'easeIn' } } },
        }
    };


    const containerVariants: Variants = {
        closed: { opacity: 0, pointerEvents: 'none' },
        open: { opacity: 1, pointerEvents: 'auto' },
    };

     const mobileMenuVariants: Variants = {
         closed: { x: '100%' },
         open: { x: '0%' },
     };

     const mobileDropdownVariants: Variants = {
         closed: { height: 0, opacity: 0, overflowY: 'hidden' },
         open: { height: 'auto', opacity: 1, overflowY: 'visible' },
     };


    return (
        <motion.nav className="relative bg-black text-white z-50">
            <div className="flex items-center justify-between h-16 max-w-screen-xl mx-auto px-4">
                <div className="text-xl font-bold">App Name</div>

                <ul
                    className="hidden md:flex gap-6 mx-10 list-none p-0 m-0 h-full"
                    onMouseLeave={closeDropdown}
                >
                    {menuItems.map((item, index) => (
                         <li
                            key={`desktop-menu-${index}`}
                            className={`flex items-center h-full relative ${activeMenuItemIndex === index && isDropdownOpen ? 'text-gray-400' : ''}`}
                            onMouseEnter={() => openDropdown(index)}
                         >
                             <a href={item.href} className="py-2 hover:text-gray-400 no-underline">
                                 {item.label}
                             </a>
                             {activeMenuItemIndex === index && isDropdownOpen && (
                                <motion.div
                                    layoutId="underline"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                />
                             )}
                         </li>
                    ))}
                </ul>

                <div className="hidden md:flex gap-3">
                    <button className="bg-transparent border-none text-white px-4 py-2 hover:opacity-80 cursor-pointer">Log in</button>
                    <button className="bg-white text-black px-5 py-2 rounded-full font-bold hover:opacity-90 cursor-pointer">Sign up</button>
                </div>

                 <button className="md:hidden text-white focus:outline-none" onClick={toggleMobileMenu} aria-label="Toggle mobile menu">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                 </button>

            </div>

             <AnimatePresence>
             {isDropdownOpen && activeMenuItemIndex !== null && (
                 <motion.div
                     key="desktop-dropdown-container"
                     className="hidden md:block absolute top-16 left-0 right-0 bg-black shadow-lg"
                     initial="closed"
                     animate="open"
                     exit="closed"
                     variants={containerVariants}
                     transition={{ duration: 0.3 }}
                     onMouseEnter={() => { if (closeTimeoutRef.current !== null) clearTimeout(closeTimeoutRef.current); }}
                     onMouseLeave={closeDropdown}
                     onAnimationComplete={handleDropdownTransitionEnd}
                 >
                      <AnimatePresence mode="wait">
                         {menuItems[activeMenuItemIndex]?.dropdownData && (
                             <motion.div
                                 key={`desktop-dropdown-content-${activeMenuItemIndex}`}
                                 variants={contentVariants[animationDirection]}
                                 initial="initial"
                                 animate="animate"
                                 exit="exit"
                                 className="max-w-screen-xl mx-auto p-6"
                             >
                                 <a href="#" className="inline-block mb-4 text-lg font-bold text-white hover:text-gray-400 no-underline">
                                     Explore {menuItems[activeMenuItemIndex]?.label ?? 'Item'} →
                                 </a>
                                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                     {menuItems[activeMenuItemIndex]?.dropdownData?.map((column, colIndex) => (
                                         <div key={`desktop-col-${colIndex}`}>
                                             <h3 className="mb-2 text-sm font-semibold text-gray-400">
                                                 {column.heading}
                                             </h3>
                                             <ul className="list-none p-0 m-0">
                                                 {column.links.map((link, linkIndex) => (
                                                     <li key={`desktop-link-${colIndex}-${linkIndex}`} className="mb-1">
                                                         <a href={link.href} className="block py-1 text-sm text-white hover:text-gray-400 no-underline">
                                                             {link.text}
                                                         </a>
                                                     </li>
                                                 ))}
                                             </ul>
                                         </div>
                                     ))}
                                 </div>
                             </motion.div>
                         )}
                     </AnimatePresence>
                 </motion.div>
             )}
             </AnimatePresence>


             <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        key="mobile-menu-overlay"
                        className="fixed inset-0 bg-black bg-opacity-95 z-50 md:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                         onClick={(e) => {
                             if (e.target === e.currentTarget) {
                                 toggleMobileMenu();
                             }
                         }}
                    >
                        <motion.div
                            key="mobile-menu-content"
                            className="fixed top-0 right-0 h-full w-full bg-black shadow-lg flex flex-col p-6 text-white overflow-y-auto"
                            variants={mobileMenuVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                            transition={{ type: "spring", stiffness: 100, damping: 20 }}
                             onClick={(e) => e.stopPropagation()}
                        >
                            <button className="absolute top-4 right-4 text-white focus:outline-none" onClick={toggleMobileMenu} aria-label="Close mobile menu">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>

                            <ul className="list-none p-0 m-0 mt-8 flex flex-col gap-4">
                                {menuItems.map((item, index) => (
                                    <li key={`mobile-menu-${index}`}>
                                        {item.dropdownData ? (
                                            <>
                                                <button
                                                    className="flex justify-between items-center w-full text-left text-white font-bold py-2 focus:outline-none"
                                                    onClick={() => toggleMobileDropdown(index)}
                                                    aria-expanded={mobileActiveDropdownIndex === index}
                                                >
                                                    {item.label}
                                                    <svg className={`w-4 h-4 transform transition-transform duration-200 ${mobileActiveDropdownIndex === index ? 'rotate-90' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                                </button>
                                                 <AnimatePresence>
                                                    {mobileActiveDropdownIndex === index && item.dropdownData && (
                                                         <motion.div
                                                             key={`mobile-dropdown-content-${index}`}
                                                             initial="closed"
                                                             animate="open"
                                                             exit="closed"
                                                             variants={mobileDropdownVariants}
                                                             transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                             className="mt-2 pl-4 border-l border-gray-600"
                                                         >
                                                             {item.dropdownData.map((column, colIndex) => (
                                                                 <div key={`mobile-col-${colIndex}`} className="mb-4">
                                                                     <h4 className="text-xs font-semibold text-gray-400 mb-1">{column.heading}</h4>
                                                                     <ul className="list-none p-0 m-0 flex flex-col gap-1">
                                                                         {column.links.map((link, linkIndex) => (
                                                                             <li key={`mobile-link-${colIndex}-${linkIndex}`}>
                                                                                 <a href={link.href} className="block py-1 text-sm text-gray-300 hover:text-white no-underline" onClick={handleMobileLinkClick}>
                                                                                     {link.text}
                                                                                 </a>
                                                                             </li>
                                                                         ))}
                                                                     </ul>
                                                                 </div>
                                                             ))}
                                                         </motion.div>
                                                    )}
                                                 </AnimatePresence>
                                            </>
                                        ) : (
                                            <a href={item.href ?? '#'} className="block text-white font-bold py-2 hover:text-gray-300 no-underline" onClick={handleMobileLinkClick}>
                                                 {item.label}
                                             </a>
                                        )}
                                    </li>
                                ))}
                                <li className="mt-4 pt-4 border-t border-gray-700 flex flex-col gap-3">
                                     <button className="bg-transparent border border-white text-white px-4 py-2 rounded-full hover:opacity-80 cursor-pointer" onClick={handleMobileLinkClick}>Log in</button>
                                     <button className="bg-white text-black px-5 py-2 rounded-full font-bold hover:opacity-90 cursor-pointer" onClick={handleMobileLinkClick}>Sign up</button>
                                 </li>

                            </ul>
                        </motion.div>
                    </motion.div>
                )}
             </AnimatePresence>

        </motion.nav>
    );
};
