import React from 'react';

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v4.59L7.3 9.3a.75.75 0 00-1.05 1.05l3.5 3.5a.75.75 0 001.05 0l3.5-3.5a.75.75 0 10-1.05-1.05l-1.95 1.95V6.75z" clipRule="evenodd" />
    <path fillRule="evenodd" d="M12.97 9.28a.75.75 0 000-1.06l-4-4a.75.75 0 00-1.06 1.06L11.38 9l-3.47 3.47a.75.75 0 101.06 1.06l4-4z" clipRule="evenodd" transform="translate(1, -0.5)" />
    <path fillRule="evenodd" d="M16.72 9.28a.75.75 0 000-1.06l-4-4a.75.75 0 00-1.06 1.06L15.13 9l-3.47 3.47a.75.75 0 101.06 1.06l4-4z" clipRule="evenodd" transform="translate(-3, -0.5)" />
    <path fillRule="evenodd" d="M10.21 4.47a.75.75 0 01.04 1.06L6.53 9.25h10.72a.75.75 0 010 1.5H6.53l3.72 3.72a.75.75 0 11-1.06 1.06l-5-5a.75.75 0 010-1.06l5-5a.75.75 0 011.02.04z" clipRule="evenodd" transform="scale(-1, 1) translate(-20, 0)" />
  </svg>
);

const CallToAction = ({
  title,
  subtitle,
  primaryButtonText,
  primaryButtonLink,
  secondaryButtonText,
  secondaryButtonLink
}) => {
  return (
    <div className="cta-container">
      <img src="https://placehold.co/360x360/BDCCFF/BDCCFF?text=." alt="Blob 1" className="blob blob-top" />
      <img src="https://placehold.co/360x360/BDCCFF/BDCCFF?text=." alt="Blob 2" className="blob blob-bottom" />

      <div className="cta-content">
        <h2 className="cta-title">{title}</h2>
        <p className="cta-subtitle">{subtitle}</p>
      </div>

      <div className="cta-buttons">
        <a href={primaryButtonLink} className="btn btn-primary">{primaryButtonText}</a>
        <a href={secondaryButtonLink} className="btn btn-secondary">
          <span>{secondaryButtonText}</span>
          <ArrowRightIcon />
        </a>
      </div>
    </div>
  );
};

export default CallToAction;
