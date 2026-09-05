'use client';

import React, { useState, useEffect } from 'react';
import '../../index.css';

interface NavItem {
  label: string;
  href: string;
  children?: {
    title: string;
    items: {
      name: string;
      description: string;
      href: string;
    }[];
  }[];
}

const navigation: NavItem[] = [
  {
    label: 'Product',
    href: '/product',
    children: [
      {
        title: 'Platform',
        items: [
          { name: 'Overview', description: 'Complete platform overview', href: '/overview' },
          { name: 'Features', description: 'Explore our features', href: '/features' },
          { name: 'Integrations', description: 'Connect your tools', href: '/integrations' },
        ]
      },
      {
        title: 'Resources',
        items: [
          { name: 'Documentation', description: 'Developer guides', href: '/docs' },
          { name: 'API Reference', description: 'Complete API docs', href: '/api' },
        ]
      }
    ]
  },
  { label: 'Solutions', href: '/solutions' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Company', href: '/company' },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }, [isOpen]);

  return (
    <>
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-inner">
          {/* Logo */}
          <a href="/" className="logo">
            <svg viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="2"/>
              <circle cx="12" cy="12" r="3" fill="currentColor"/>
            </svg>
            <span>Brand</span>
          </a>

          {/* Desktop Nav */}
          <div className="nav-menu">
            {navigation.map((item, index) => (
              <div
                key={index}
                className="nav-item"
                onMouseEnter={() => item.children && setActiveDropdown(index)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <a href={item.href} className="nav-link">
                  {item.label}
                  {item.children && (
                    <svg className="chevron" viewBox="0 0 12 12">
                      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  )}
                </a>

                {item.children && activeDropdown === index && (
                  <div className="dropdown">
                    {item.children.map((section, sIndex) => (
                      <div key={sIndex} className="dropdown-section">
                        <div className="section-title">{section.title}</div>
                        {section.items.map((subItem, iIndex) => (
                          <a key={iIndex} href={subItem.href} className="dropdown-link">
                            <div className="link-name">{subItem.name}</div>
                            <div className="link-desc">{subItem.description}</div>
                          </a>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="nav-actions">
            <a href="/login" className="btn-ghost">Log in</a>
            <a href="/signup" className="btn-primary">Sign up</a>
            <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
              <span className={isOpen ? 'open' : ''}></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && <div className="overlay" onClick={() => setIsOpen(false)} />}
      <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
        <div className="mobile-header">
          <a href="/" className="logo">
            <svg viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="2"/>
              <circle cx="12" cy="12" r="3" fill="currentColor"/>
            </svg>
            <span>Brand</span>
          </a>
          <button className="mobile-close" onClick={() => setIsOpen(false)}>
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div className="mobile-inner">
          {navigation.map((item, index) => (
            <div key={index} className="mobile-item">
              {item.children ? (
                <>
                  <button 
                    className="mobile-label"
                    onClick={() => setActiveDropdown(activeDropdown === index ? null : index)}
                  >
                    {item.label}
                    <svg className={`chevron-mobile ${activeDropdown === index ? 'open' : ''}`} viewBox="0 0 12 12">
                      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                  {activeDropdown === index && (
                    <div className="mobile-submenu">
                      {item.children.map((section, sIndex) => (
                        <div key={sIndex}>
                          <div className="submenu-title">{section.title}</div>
                          {section.items.map((subItem, iIndex) => (
                            <a key={iIndex} href={subItem.href} className="submenu-link">
                              {subItem.name}
                            </a>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <a href={item.href} className="mobile-label">{item.label}</a>
              )}
            </div>
          ))}
          <div className="mobile-actions">
            <a href="/login" className="btn-ghost full">Log in</a>
            <a href="/signup" className="btn-primary full">Sign up</a>
          </div>
        </div>
      </div>

    </>
  );
}