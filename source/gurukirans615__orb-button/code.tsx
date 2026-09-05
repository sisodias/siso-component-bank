import React from 'react';


/**
 * A "Shimmering Orb" UI component that glows and shimmers on hover.
 * Can be used as an interactive element or a captivating display.
 */
const MagicOrb = ({ onClick, children }) => {
  return (
    <button
      className="magic-orb-button"
      onClick={onClick}
      aria-label={children ? undefined : "Magic Orb"}
    >
      <div className="shimmer-effect"></div>
      <span className="orb-text">
        {children || "✨ Orb ✨"}
      </span>
    </button>
  );
};

export default MagicOrb;