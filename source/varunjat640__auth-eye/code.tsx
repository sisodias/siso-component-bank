// Combined Auth Component with Login & Sign Up

import { cn } from "@/lib/utils";
import { useState, useEffect, useRef, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Component = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [eyeballCx, setEyeballCx] = useState(12);
  const [eyeballCy, setEyeballCy] = useState(12);
  const [eyelidOpacity, setEyelidOpacity] = useState(0);
  const [telescopeLensOpacity, setTelescopeLensOpacity] = useState(1);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const blinkTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Toggle between login and signup
  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    // Reset states
    setPasswordVisible(false);
    setConfirmPasswordVisible(false);
    setEyeballCx(12);
    setEyeballCy(12);
  };

  // Make the eye look toward the username field when active
  const handleUsernameFocus = () => {
    setEyeballCy(9);
    setEyeballCx(12);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const len = e.target.value.length;
    const minCx = 10;
    const maxCx = 14;
    const maxLen = 16;
    const offset = (Math.min(len, maxLen) / maxLen) * (maxCx - minCx);
    setEyeballCx(minCx + offset);
    setEyeballCy(9);
  };

  const handleUsernameBlur = () => {
    setEyeballCy(12);
    if (!passwordInputRef.current || !passwordInputRef.current.value.length) {
      setEyeballCx(12);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  // Handle password input - move eyeball as user types
  const handlePasswordInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const len = e.target.value.length;
    const startCx = 12;
    const targetCx = 6;
    const maxLen = 12;
    const progress = Math.min(len, maxLen) / maxLen;
    const easedProgress = 1 - Math.pow(1 - progress, 1.5);
    const offset = easedProgress * (startCx - targetCx);
    setEyeballCx(startCx - offset);
    setEyeballCy(12);
  };

  // Reset eyeball position when input loses focus and is empty
  const handlePasswordBlur = () => {
    if (passwordInputRef.current && !passwordInputRef.current.value.length) {
      setEyeballCx(12);
    }
    setEyeballCy(12);
  };

  const handlePasswordFocus = () => {
    setEyeballCy(12);
  };

  // Blinking animation for eye
  const blink = () => {
    setEyelidOpacity(1);
    setTimeout(() => {
      setEyelidOpacity(0);
      scheduleNextBlink();
    }, 160 + Math.random() * 60);
  };

  // Blinking animation for telescope lenses
  const blinkTelescope = () => {
    setTelescopeLensOpacity(0.2);
    setTimeout(() => {
      setTelescopeLensOpacity(1);
      scheduleNextBlink();
    }, 160 + Math.random() * 60);
  };

  const scheduleNextBlink = () => {
    const interval = 2000;
    blinkTimeoutRef.current = setTimeout(() => {
      if (!passwordVisible) {
        blink();
      } else {
        blinkTelescope();
      }
    }, interval);
  };

  // Start blinking animation on mount
  useEffect(() => {
    scheduleNextBlink();
    return () => {
      if (blinkTimeoutRef.current) {
        clearTimeout(blinkTimeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passwordVisible]);

  // Handle form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(isSignUp ? "Sign up submitted" : "Login submitted");
  };

  const EyeIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 block"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        strokeWidth="1.7"
        fill="currentColor"
        opacity="0.1"
      />
      <circle cx="12" cy="12" r="10" strokeWidth="1.7" fill="none" />
      <circle cx={eyeballCx} cy={eyeballCy} r="3.5" fill="currentColor" />
      <circle cx={eyeballCx - 1} cy={eyeballCy - 1} r="1.5" fill="white" />
      <ellipse
        cx="12"
        cy="12"
        rx="10.5"
        ry="2.8"
        fill="white"
        style={{
          opacity: eyelidOpacity,
          pointerEvents: "none",
          transition: eyelidOpacity === 1 ? "opacity 60ms" : "opacity 120ms",
        }}
      />
    </svg>
  );

  const BinocularsIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 sm:h-8 sm:w-8"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <circle
        cx="8"
        cy="12"
        r="4"
        strokeWidth="1.7"
        fill="currentColor"
        opacity="0.1"
      />
      <circle cx="8" cy="12" r="4" strokeWidth="1.7" fill="none" />
      <circle
        cx="16"
        cy="12"
        r="4"
        strokeWidth="1.7"
        fill="currentColor"
        opacity="0.1"
      />
      <circle cx="16" cy="12" r="4" strokeWidth="1.7" fill="none" />
      <line
        x1="10"
        y1="10"
        x2="14"
        y2="10"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <circle
        cx="8"
        cy="12"
        r="2.5"
        fill="currentColor"
        opacity={telescopeLensOpacity * 0.35}
        style={{
          transition:
            telescopeLensOpacity < 1 ? "opacity 60ms" : "opacity 120ms",
        }}
      />
      <circle
        cx="16"
        cy="12"
        r="2.5"
        fill="currentColor"
        opacity={telescopeLensOpacity * 0.35}
        style={{
          transition:
            telescopeLensOpacity < 1 ? "opacity 60ms" : "opacity 120ms",
        }}
      />
      <circle
        cx="7.2"
        cy="11"
        r="1"
        fill="white"
        opacity={telescopeLensOpacity * 0.9}
        style={{
          transition:
            telescopeLensOpacity < 1 ? "opacity 60ms" : "opacity 120ms",
        }}
      />
      <circle
        cx="15.2"
        cy="11"
        r="1"
        fill="white"
        opacity={telescopeLensOpacity * 0.9}
        style={{
          transition:
            telescopeLensOpacity < 1 ? "opacity 60ms" : "opacity 120ms",
        }}
      />
    </svg>
  );

  return (
    <div className="min-h-screen animated-gradient flex items-center justify-center px-4 py-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={isSignUp ? "signup" : "login"}
          initial={{ x: isSignUp ? "100vw" : "-100vw", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: isSignUp ? "-100vw" : "100vw", opacity: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 20, duration: 0.6 }}
          className="w-full max-w-md bg-card/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-soft-card"
        >
          <div className="text-center mb-4 sm:mb-6">
            <svg
              className="mx-auto mb-2 sm:mb-3 h-10 w-10 sm:h-12 sm:w-12 text-primary"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              {!isSignUp ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 7.5v-1A4.5 4.5 0 008 6.5v1m8.5 10.5h-9A2.5 2.5 0 015 15.5v-7A2.5 2.5 0 017.5 6h9A2.5 2.5 0 0119 8.5v7a2.5 2.5 0 01-2.5 2.5z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM3 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 019.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                />
              )}
            </svg>
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              {isSignUp ? "Sign up to get started" : "Please login to your account"}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Full Name - Sign Up Only */}
            {isSignUp && (
              <div className="mb-3 sm:mb-4">
                <label
                  className="block mb-1.5 sm:mb-2 text-xs sm:text-sm text-foreground font-semibold"
                  htmlFor="fullname"
                >
                  Full Name
                </label>
                <input
                  id="fullname"
                  name="fullname"
                  type="text"
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-ring transition"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            {/* Email - Sign Up Only */}
            {isSignUp && (
              <div className="mb-3 sm:mb-4">
                <label
                  className="block mb-1.5 sm:mb-2 text-xs sm:text-sm text-foreground font-semibold"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-ring transition"
                  placeholder="Enter your email"
                />
              </div>
            )}

            {/* Username */}
            <div className="mb-3 sm:mb-4">
              <label
                className="block mb-1.5 sm:mb-2 text-xs sm:text-sm text-foreground font-semibold"
                htmlFor="username"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                onFocus={handleUsernameFocus}
                onBlur={handleUsernameBlur}
                onChange={handleUsernameChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-ring transition"
                placeholder={isSignUp ? "Choose a username" : "Enter your username"}
              />
            </div>

            {/* Password */}
            <div className="mb-2">
              <label
                className="block mb-1.5 sm:mb-2 text-xs sm:text-sm text-foreground font-semibold"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <input
                  ref={passwordInputRef}
                  id="password"
                  name="password"
                  type={passwordVisible ? "text" : "password"}
                  required
                  onFocus={handlePasswordFocus}
                  onChange={handlePasswordInput}
                  onBlur={handlePasswordBlur}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-ring transition pr-10 sm:pr-12"
                  placeholder={isSignUp ? "Create a password" : "Enter your password"}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  tabIndex={-1}
                  className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-1 text-primary hover:text-primary/80 transition cursor-pointer"
                >
                  {!passwordVisible ? <EyeIcon /> : <BinocularsIcon />}
                </button>
              </div>
            </div>

            {/* Confirm Password - Sign Up Only */}
            {isSignUp && (
              <div className="mb-3 sm:mb-4 mt-3 sm:mt-4">
                <label
                  className="block mb-1.5 sm:mb-2 text-xs sm:text-sm text-foreground font-semibold"
                  htmlFor="confirmPassword"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={confirmPasswordVisible ? "text" : "password"}
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-ring transition pr-10 sm:pr-12"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    tabIndex={-1}
                    className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-1 text-primary hover:text-primary/80 transition cursor-pointer"
                  >
                    {!confirmPasswordVisible ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 sm:h-6 sm:w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.7"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.7"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 sm:h-6 sm:w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.7"
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.949 9.949 0 014.362-5.095m0 0A9.962 9.962 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.362 5.095m0 0l-3-3m3 3l3 3"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Remember Me / Forgot Password - Login Only */}
            {!isSignUp && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4 gap-2 sm:gap-0">
                <div>
                  <input
                    id="remember"
                    type="checkbox"
                    className="accent-primary"
                  />
                  <label
                    htmlFor="remember"
                    className="ml-2 text-xs sm:text-sm text-muted-foreground"
                  >
                    Remember me
                  </label>
                </div>
                <a
                  href="#"
                  className="text-xs sm:text-sm text-primary hover:underline"
                >
                  Forgot password?
                </a>
              </div>
            )}

            {/* Terms Checkbox - Sign Up Only */}
            {isSignUp && (
              <div className="flex items-center mb-3 sm:mb-4">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  className="accent-primary"
                />
                <label
                  htmlFor="terms"
                  className="ml-2 text-xs sm:text-sm text-muted-foreground"
                >
                  I agree to the{" "}
                  <a href="#" className="text-primary hover:underline">
                    Terms & Conditions
                  </a>
                </label>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2 sm:py-2.5 text-sm sm:text-base rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-soft-btn transition"
            >
              {isSignUp ? "Sign Up" : "Sign In"}
            </button>
          </form>

          <p className="mt-4 sm:mt-5 text-center text-muted-foreground text-xs sm:text-sm">
            {isSignUp ? "Already have an account? " : "Don't have an account? "}
            <button
              onClick={toggleMode}
              className="text-primary font-semibold hover:underline cursor-pointer"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
