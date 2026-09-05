
import React from 'react';

// Reusable BentoItem for the Brutalist theme.
const BentoItem = ({ className, children }) => {
    return (
        <div className={`bento-item ${className}`}>
            <div className="content-wrapper">
                {children}
            </div>
        </div>
    );
};

export default BentoItem;
