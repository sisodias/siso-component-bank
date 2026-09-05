import React from 'react';

const GooeyButton = () => {
    return (
        <button className="gooey-button">
            SUBMIT
            <div className="bubbles">
                {/* Creates 5 span elements for the bubbles */}
                {[...Array(5)].map((_, i) => <span key={i}></span>)}
            </div>
        </button>
    );
};

export default GooeyButton;