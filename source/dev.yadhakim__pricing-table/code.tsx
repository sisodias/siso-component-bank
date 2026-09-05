'use client';
import React, { useState, useEffect, useRef } from 'react';
import '../../index.css';

/* ─── Types ─── */
interface PriceTier {
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  badge?: string;
  popular?: boolean;
  features: string[];
  cta: string;
  ctaStyle: 'outline' | 'solid';
}

/* ─── Data ─── */
const tiers: PriceTier[] = [
  {
    name: 'Starter',
    description: 'For individuals and side projects.',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      '3 active projects',
      '1 GB storage',
      'Community support',
      'Basic analytics',
      'Standard components',
    ],
    cta: 'Get Started Free',
    ctaStyle: 'outline',
  },
  {
    name: 'Professional',
    description: 'For growing teams shipping fast.',
    monthlyPrice: 29,
    yearlyPrice: 24,
    badge: 'Most Popular',
    popular: true,
    features: [
      'Unlimited projects',
      '50 GB storage',
      'Priority support',
      'Advanced analytics',
      'Premium components',
      'Custom themes',
      'Team collaboration',
    ],
    cta: 'Start Free Trial',
    ctaStyle: 'solid',
  },
  {
    name: 'Enterprise',
    description: 'For organizations at scale.',
    monthlyPrice: 79,
    yearlyPrice: 66,
    features: [
      'Unlimited everything',
      '1 TB storage',
      'Dedicated support',
      'Custom analytics',
      'All components',
      'White-label option',
      'SSO & SAML',
      'SLA guarantee',
    ],
    cta: 'Contact Sales',
    ctaStyle: 'outline',
  },
];

/* ─── Check Icon ─── */
function CheckIcon() {
  return (
    <svg
      className="pt-check"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/* ─── Price Animator ─── */
function AnimatedPrice({
  price,
  isYearly,
}: {
  price: number;
  isYearly: boolean;
}) {
  const [displayPrice, setDisplayPrice] = useState(price);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setAnimating(true);
    const timer = setTimeout(() => {
      setDisplayPrice(price);
      setAnimating(false);
    }, 150);
    return () => clearTimeout(timer);
  }, [price]);

  if (price === 0) {
    return (
      <div className="pt-price-display">
        <span className="pt-price-amount">Free</span>
      </div>
    );
  }

  return (
    <div className="pt-price-display">
      <span className="pt-price-currency">$</span>
      <span className={`pt-price-amount ${animating ? 'pt-price-amount--exit' : 'pt-price-amount--enter'}`}>
        {displayPrice}
      </span>
      <span className="pt-price-period">/ {isYearly ? 'mo' : 'mo'}</span>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   MAIN COMPONENT
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function PricingTable() {
  const [isYearly, setIsYearly] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="pt-section">
      <div className="pt-grain" />

      {/* Header */}
      <header className="pt-header">
        <span className="pt-header__eyebrow">Pricing</span>
        <h2 className="pt-header__title">
          Simple, transparent <em>pricing</em>
        </h2>
        <p className="pt-header__subtitle">
          No hidden fees. No surprises. Cancel anytime.
        </p>

        {/* Billing Toggle */}
        <div className="pt-toggle-wrapper">
          <span className={`pt-toggle-label ${!isYearly ? 'active' : ''}`}>Monthly</span>
          <button
            className="pt-toggle"
            onClick={() => setIsYearly(!isYearly)}
            aria-label="Toggle billing period"
          >
            <div className={`pt-toggle__thumb ${isYearly ? 'pt-toggle__thumb--right' : ''}`} />
          </button>
          <span className={`pt-toggle-label ${isYearly ? 'active' : ''}`}>
            Yearly
            <span className="pt-toggle-save">Save 20%</span>
          </span>
        </div>
      </header>

      {/* Cards */}
      <div className="pt-cards">
        {tiers.map((tier, i) => (
          <div
            key={tier.name}
            className={`pt-card ${tier.popular ? 'pt-card--popular' : ''} ${loaded ? 'pt-card--visible' : ''}`}
            style={{ transitionDelay: `${0.15 + i * 0.1}s` }}
          >
            {tier.badge && (
              <div className="pt-card__badge">{tier.badge}</div>
            )}

            <div className="pt-card__header">
              <h3 className="pt-card__name">{tier.name}</h3>
              <p className="pt-card__description">{tier.description}</p>
            </div>

            <AnimatedPrice
              price={isYearly ? tier.yearlyPrice : tier.monthlyPrice}
              isYearly={isYearly}
            />

            {isYearly && tier.monthlyPrice > 0 && (
              <div className="pt-card__savings">
                <span className="pt-card__original">${tier.monthlyPrice}/mo</span>
                <span className="pt-card__saved">
                  Save ${(tier.monthlyPrice - tier.yearlyPrice) * 12}/yr
                </span>
              </div>
            )}

            <button className={`pt-card__cta pt-card__cta--${tier.ctaStyle}`}>
              {tier.cta}
            </button>

            <div className="pt-card__divider" />

            <ul className="pt-card__features">
              {tier.features.map((feature) => (
                <li key={feature} className="pt-card__feature">
                  <CheckIcon />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}