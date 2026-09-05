import React from 'react';

// Reusable BentoItem for the Scrapbook theme.
const BentoItem = ({ className, children, rotation }) => {
    const style = {
        '--rotation': rotation || '0deg',
    };
    return (
        <div className={`bento-item ${className}`} style={style}>
            <div className="content-wrapper">
                {children}
            </div>
        </div>
    );
};

export default BentoItem;