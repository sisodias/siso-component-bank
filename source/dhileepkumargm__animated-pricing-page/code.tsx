import React, { useState, useEffect } from 'react';

// --- Pricing Data ---
const pricingData = {
    dev: {
        landing: { price: "$2500", features: ["Wireframes", "Full copywriting", "Figma Design", "Unlimited 3D models", "Framer development", "Three rounds of revisions", "1 month of free support"] },
        multipage: { price: "$5000", features: ["Wireframes", "Full copywriting", "Figma Design", "Unlimited 3D models", "Framer development", "Three rounds of revisions", "1 month of free support"] }
    },
    design: {
        landing: { price: "$1500", features: ["Wireframes", "Full copywriting", "Figma Design", "Unlimited 3D models", "Three rounds of revisions"] },
        multipage: { price: "$3000", features: ["Wireframes", "Full copywriting", "Figma Design", "Unlimited 3D models", "Three rounds of revisions"] }
    }
};

// Reusable PricingCard component
const PricingCard = ({ type, mode }) => {
    const isLanding = type === 'landing';
    const [displayData, setDisplayData] = useState(pricingData[mode][type]);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        setIsAnimating(true);
        const timer = setTimeout(() => {
            setDisplayData(pricingData[mode][type]);
            setIsAnimating(false);
        }, 200);
        return () => clearTimeout(timer);
    }, [mode, type]);

    const cardClass = isLanding ? 'pricing-card-blue' : 'pricing-card-green';
    const title = isLanding ? 'LANDING PAGE' : 'MULTIPAGE WEBSITE';
    const priceType = isLanding ? 'FIXED PRICE' : 'PRICE MAY CHANGE';

    const LandingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>;
    const MultipageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"></circle></svg>;
    const BookCallIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;

    return (
        <div className={`pricing-card ${cardClass}`}>
            <div className="bg"></div>
            <div className="wrap">
                <div className="outline"></div>
                <div className="content p-8 flex flex-col text-white">
                    <div className="text-sm font-bold bg-white/20 rounded-full px-4 py-2 inline-flex items-center gap-2 self-center">
                        {isLanding ? <LandingIcon /> : <MultipageIcon />}
                        {title}
                    </div>
                    <p className="text-7xl lg:text-8xl font-black my-4">{displayData.price}</p>
                    <p className="text-sm font-medium text-white/80 tracking-widest">{priceType}</p>
                    
                    <div className={`card-details ${isAnimating ? 'details-hidden' : ''}`}>
                        <p className="text-white/70 my-8 text-center text-sm">
                            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                        </p>
                        <div className="flex flex-wrap justify-center gap-2 mb-8">
                            {/* Corrected this line to render JSX elements instead of a string */}
                            {displayData.features.map(f => (
                                <span key={f} className="feature-tag">{f}</span>
                            ))}
                        </div>
                        <button className="mt-auto w-full bg-gray-900/50 text-white font-semibold py-3 rounded-xl hover:bg-gray-900 transition-colors flex items-center justify-center gap-2">
                            <BookCallIcon />
                            Book a 20-min call
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// The main PricingPage component
export const PricingPage = () => {
    const [mode, setMode] = useState('dev');

    const handleToggle = (e) => {
        setMode(e.target.checked ? 'design' : 'dev');
    };

    return (
        <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4">
            <div className="shape-1"></div>
            <div className="shape-2"></div>
            <div className="relative z-10 flex flex-col items-center w-full max-w-5xl">
                <header className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 tracking-tight">
                        Simple Transparent Pricing for Startups
                    </h1>
                    <div className="mt-6 flex justify-center items-center gap-4 text-gray-600">
                        <span>Design & Dev</span>
                        <div className="relative">
                            <input type="checkbox" id="toggle" className="sr-only" onChange={handleToggle} />
                            <label htmlFor="toggle" className="flex items-center cursor-pointer w-12 h-6 rounded-full bg-gray-300 p-1 transition-colors">
                                <div className="w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300"></div>
                            </label>
                        </div>
                        <span>Design Only</span>
                    </div>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 w-full max-w-4xl">
                    <PricingCard type="landing" mode={mode} />
                    <PricingCard type="multipage" mode={mode} />
                </div>
            </div>
        </div>
    );
};
