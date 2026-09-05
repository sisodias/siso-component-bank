import React, { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * AuthComponent - Main authentication component
 * 
 * A complete authentication UI with tabbed interface for Sign In and Sign Up.
 * Features:
 * - Animated tab switching with distinctive colors (blue for Sign In, green for Sign Up)
 * - Dark theme design with proper contrast
 * - Responsive layout with max-width constraint
 * - Social login options (Google and Apple)
 * - Smooth Framer Motion animations
 * 
 * @returns {JSX.Element} The complete authentication component
 */
const AuthComponent = () => {
  // Track current active tab: 0 = Sign In, 1 = Sign Up
  const [currentTab, setCurrentTab] = useState(0);

  return (
    // Full screen container with black background and padding
    <div className="flex min-h-screen w-full items-center justify-center bg-black p-6">
      {/* Main content wrapper with max-width constraint */}
      <div className="flex w-full max-w-[430px] flex-col gap-3">
        {/* Tab switcher component */}
        <TabSwitch currentTab={currentTab} setTab={setCurrentTab} />
        
        {/* Form container with dark theme styling */}
        <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-black px-6 py-8">
          {/* Conditionally render Sign In or Sign Up form based on active tab */}
          {currentTab === 0 ? <SignInTab /> : <SignUpTab />}
        </div>
      </div>
    </div>
  );
};

/**
 * TabSwitch - Animated tab switcher component
 * 
 * Displays two tabs (Sign In and Sign Up) with:
 * - Animated sliding indicator that changes color based on active tab
 * - Blue background for Sign In tab
 * - Green background for Sign Up tab
 * - Smooth spring animation transitions
 * 
 * @param {Object} props - Component props
 * @param {Function} props.setTab - Function to change active tab
 * @param {number} props.currentTab - Currently active tab index (0 or 1)
 * @returns {JSX.Element} Tab switcher UI
 */
const TabSwitch = ({ setTab, currentTab }) => {
  return (
    // Container with dark gray background
    <div className="relative flex w-full items-center rounded-xl bg-neutral-900 p-1.5">
      {/* Animated sliding indicator that moves behind the active tab */}
      <motion.div
        // Spring animation configuration for smooth, bouncy movement
        transition={{ type: 'spring', duration: 0.4, bounce: 0.2 }}
        // Animate position and background color based on active tab
        // Sign In (tab 0) = Blue, Sign Up (tab 1) = Green
        animate={
          currentTab === 0 
            ? { x: 0, backgroundColor: '#CCFFCC' }
            : { x: '100%', backgroundColor: '#CCFFCC' } 
        }
        className="absolute h-[calc(100%-12px)] w-[calc(50%-6px)] rounded-lg shadow-lg"
      />
      
      {/* Sign In button */}
      <button
        onClick={() => setTab(0)}
        className={`relative z-10 h-12 w-full rounded-lg text-center font-medium transition-colors ${
          currentTab === 0 ? 'text-black' : 'text-neutral-500'
        }`}>
        Sign in
      </button>
      
      {/* Sign Up button */}
      <button
        onClick={() => setTab(1)}
        className={`relative z-10 h-12 w-full rounded-lg text-center font-medium transition-colors ${
          currentTab === 1 ? 'text-black' : 'text-neutral-500'
        }`}>
        Sign up
      </button>
    </div>
  );
};

/**
 * SignInTab - Sign In form component
 * 
 * Contains:
 * - Username and password input fields
 * - Submit button
 * - Social login options (Google and Apple)
 * - All buttons have hover and tap animations
 * 
 * @returns {JSX.Element} Sign In form UI
 */
const SignInTab = () => {
  return (
    <div className="flex w-full flex-col items-start justify-start gap-6">
      {/* Form header */}
      <div>
        <h1 className="text-2xl font-semibold text-white">Sign in to your account</h1>
      </div>
      
      {/* Username input field */}
      <div className="w-full space-y-2">
        <label htmlFor="signin-username" className="text-sm font-medium text-white">
          Username
        </label>
        <input
          id="signin-username"
          name="username"
          placeholder="Awanish"
          type="text"
          className="h-12 w-full rounded-lg bg-neutral-800 px-4 text-white placeholder-neutral-500 outline-none focus:ring-2 focus:ring-neutral-700"
        />
      </div>
      
      {/* Password input field */}
      <div className="w-full space-y-2">
        <label htmlFor="signin-password" className="text-sm font-medium text-white">
          Password
        </label>
        <input
          id="signin-password"
          name="password"
          type="password"
          placeholder="Password"
          className="h-12 w-full rounded-lg bg-neutral-800 px-4 text-white placeholder-neutral-500 outline-none focus:ring-2 focus:ring-neutral-700"
        />
      </div>
      
      {/* Submit button with hover/tap animations */}
      <div className="w-full">
        <motion.button 
          whileHover={{ scale: 1.05 }} // Slight scale up on hover
          whileTap={{ scale: 0.90 }} // Slight scale down on click
          className="h-12 w-full rounded-lg bg-white font-semibold text-black">
          Submit
        </motion.button>
      </div>

      {/* Divider with "Or" text */}
      <div className="relative w-full py-4">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-black px-3 text-sm text-neutral-500">
          Or
        </div>
        <div className="border-b border-neutral-800"></div>
      </div>
      
      {/* Social login buttons */}
      <div className="flex w-full flex-col gap-3">
        {/* Google login button */}
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.90 }}
          className="flex h-12 w-full items-center justify-center gap-3 rounded-lg bg-white font-medium text-black">
          {/* Google icon SVG */}
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <div>Continue with Google</div>
        </motion.button>
        
        {/* Apple login button */}
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.90 }}
          className="flex h-12 w-full items-center justify-center gap-3 rounded-lg bg-white font-medium text-black">
          {/* Apple icon SVG */}
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
          </svg>
          <div>Continue with Apple</div>
        </motion.button>
      </div>
    </div>
  );
};

/**
 * SignUpTab - Sign Up form component
 * 
 * Contains:
 * - Username and password input fields
 * - Submit button
 * - Social login options (Google and Apple)
 * - All buttons have hover and tap animations
 * - Same structure as SignInTab but with "Create an account" heading
 * 
 * @returns {JSX.Element} Sign Up form UI
 */
const SignUpTab = () => {
  return (
    <div className="flex w-full flex-col items-start justify-start gap-6">
      {/* Form header */}
      <div>
        <h1 className="text-2xl font-semibold text-white">Create an account</h1>
      </div>
      
      {/* Username input field */}
      <div className="w-full space-y-2">
        <label htmlFor="signup-username" className="text-sm font-medium text-white">
          Username
        </label>
        <input
          id="signup-username"
          name="username"
          placeholder="Badri"
          type="text"
          className="h-12 w-full rounded-lg bg-neutral-800 px-4 text-white placeholder-neutral-500 outline-none focus:ring-2 focus:ring-neutral-700"
        />
      </div>
      
      {/* Password input field */}
      <div className="w-full space-y-2">
        <label htmlFor="signup-password" className="text-sm font-medium text-white">
          Password
        </label>
        <input
          id="signup-password"
          name="password"
          type="password"
          placeholder="Password"
          className="h-12 w-full rounded-lg bg-neutral-800 px-4 text-white placeholder-neutral-500 outline-none focus:ring-2 focus:ring-neutral-700"
        />
      </div>
      
      {/* Submit button with hover/tap animations */}
      <div className="w-full">
        <motion.button 
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="h-12 w-full rounded-lg bg-white font-semibold text-black">
          Submit
        </motion.button>
      </div>

      {/* Divider with "Or" text */}
      <div className="relative w-full py-4">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-black px-3 text-sm text-neutral-500">
          Or
        </div>
        <div className="border-b border-neutral-800"></div>
      </div>
      
      {/* Social login buttons */}
      <div className="flex w-full flex-col gap-3">
        {/* Google login button */}
        <motion.button 
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="flex h-12 w-full items-center justify-center gap-3 rounded-lg bg-white font-medium text-black">
          {/* Google icon SVG */}
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <div>Continue with Google</div>
        </motion.button>
        
        {/* Apple login button */}
        <motion.button 
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="flex h-12 w-full items-center justify-center gap-3 rounded-lg bg-white font-medium text-black">
          {/* Apple icon SVG */}
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
          </svg>
          <div>Continue with Apple</div>
        </motion.button>
      </div>
    </div>
  );
};

export default AuthComponent;