"use client";

import { useState, useEffect } from "react";
import React from "react";

export function TwoSignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");

  // Show password field as soon as user starts typing
  useEffect(() => {
    if (email.length > 0) {
      setShowPassword(true);
    } else {
      setShowPassword(false);
    }
  }, [email]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted with:", { email });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-black to-zinc-900">
      <div className="w-[420px] bg-zinc-900/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-zinc-800/50">
        <div className="flex flex-col items-center space-y-8 pt-12 pb-8">
          <div className="apple-logo-container">
            <div className="bg-transparent flex items-center justify-center">
              <div className="w-30 h-30 flex items-center justify-center">
                <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 512 512" 
              width="150px" 
              height="150px"
              className="drop-shadow-lg"
            >
              <circle cx="256" cy="256" r="240" fill="#000000" />
              <path d="
                M 226 216
                A 40 40, 0, 0, 0, 226 296
                H 296
                V 216
                H 226
                Z
              " fill="white" />
              </svg>
              </div>
            </div>
          </div>
          <h2 className="text-3xl font-semibold text-white text-center tracking-tight">
            Sign in with Account
          </h2>
        </div>
        <div className="px-10 pb-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div className="relative group">
                <input
                  type="email"
                  id="email"
                  placeholder="Email or Phone Number"
                  className="w-full bg-zinc-800/80 border border-zinc-700/50 text-white h-14 px-5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                  </svg>
                </div>
              </div>

              <div className={`relative transition-all duration-500 ease-in-out transform ${showPassword ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none absolute'}`}>
                <input
                  type="password"
                  id="password"
                  placeholder="Password"
                  className="w-full bg-zinc-800/80 border border-zinc-700/50 text-white h-14 px-5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300"
                  required={showPassword}
                  disabled={!showPassword}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 py-2">
              <input 
                type="checkbox" 
                id="remember" 
                className="rounded-md border-zinc-600 text-blue-500 focus:ring-blue-500 h-5 w-5 transition duration-200"
              />
              <label htmlFor="remember" className="text-sm text-zinc-300">
                Keep me signed in
              </label>
            </div>

            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium h-14 rounded-xl transition-all duration-300 shadow-lg shadow-blue-700/20 flex items-center justify-center space-x-2"
            >
              <span>Sign In</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </button>
          </form>
        </div>
        <div className="flex flex-col items-center gap-2 pb-8">
          <a href="#" className="text-blue-400 text-sm hover:text-blue-300 transition-colors">
            Forgot password?
          </a>
          <a href="#" className="text-blue-400 text-sm hover:text-blue-300 transition-colors">
            Create Account
          </a>
        </div>
      </div>
    </div>
  );
}

export default TwoSignIn;
