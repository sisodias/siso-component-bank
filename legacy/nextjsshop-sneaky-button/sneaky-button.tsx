import React from 'react';

export const Button06 = () => {
  return (
    <a href="#" className="button06 w-inline-block">
      <span className="button06_bg"></span>
      <span 
        data-text="Sneacky" 
        className="button06_inner"
      >
        <span className="button06_text">Sneacky </span>
      </span>
      <span className="button06_icon">
        <span className="button06_icon-start">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 8 16" 
            className="button06_icon-svg"
          >
            <path 
              fill="currentColor" 
              d="M1.113 9.327a2.065 2.065 0 0 1 0-2.654L6.4.37C6.596.135 6.886 0 7.191 0h.55v16h-.55c-.305 0-.595-.135-.79-.369L1.112 9.327Z"
            />
          </svg>
        </span>
        <span className="button06_icon-mid"></span>
        <span className="button06_icon-end">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 6 16" 
            className="button06_icon-svg"
          >
            <path 
              fill="currentColor" 
              fillRule="evenodd" 
              d="M5.288 1.696A1.032 1.032 0 0 0 4.497 0H1.032C.462 0 0 .462 0 1.032v13.936C0 15.538.462 16 1.032 16h3.465c.876 0 1.354-1.024.79-1.696L1.114 9.327a2.065 2.065 0 0 1 0-2.654l4.175-4.977Z" 
              clipRule="evenodd"
            />
            <path 
              fill="currentColor" 
              d="M0 0h1.548v1.548H0zM0 14.452h1.548V16H0z"
            />
          </svg>
        </span>
      </span>
    </a>
  );
};
