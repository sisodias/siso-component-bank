import React from 'react';

const BentoItem = ({ className, children }) => {
    return (
        <div className={`bento-item ${className}`}>
            {children}
        </div>
    );
};

export default BentoItem;