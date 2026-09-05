import React, { useState } from 'react';

export function Component() {
  const [isLogin, setIsLogin] = useState(true);

  const switchToRegister = () => setIsLogin(false);
  const switchToLogin = () => setIsLogin(true);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="relative w-[350px] overflow-hidden bg-white rounded-lg border border-gray-200 shadow-lg">
        {/* Animated border effect using CSS animation */}
        <div 
          className="absolute inset-0 rounded-lg opacity-75"
          style={{
            background: 'linear-gradient(90deg, transparent, #3b82f6, transparent)',
            backgroundSize: '200% 100%',
            animation: 'borderMove 3s linear infinite'
          }}
        />
        
        {/* Inner content with slight inset to show border animation */}
        <div className="relative m-[1px] bg-white rounded-lg">
          {/* Header */}
          <div className="p-6 pb-4">
            <h2 className="text-2xl font-semibold leading-none tracking-tight text-gray-900">
              {isLogin ? 'Login' : 'Register'}
            </h2>
            <p className="text-sm text-gray-600 mt-1.5">
              {isLogin 
                ? 'Enter your credentials to access your account.'
                : 'Create a new account to get started.'
              }
            </p>
          </div>

          {/* Content */}
          <div className="px-6 pb-4">
            <div className="grid w-full items-center gap-4">
              {!isLogin && (
                <div className="flex flex-col space-y-1.5">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium leading-none text-gray-700"
                  >
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                  />
                </div>
              )}
              <div className="flex flex-col space-y-1.5">
                <label
                  htmlFor="email"
                  className="text-sm font-medium leading-none text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <label
                  htmlFor="password"
                  className="text-sm font-medium leading-none text-gray-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                />
              </div>
              {!isLogin && (
                <div className="flex flex-col space-y-1.5">
                  <label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium leading-none text-gray-700"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between p-6 pt-0">
            <button 
              onClick={isLogin ? switchToRegister : switchToLogin}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none border border-gray-300 bg-white hover:bg-gray-50 hover:scale-105 active:scale-95 h-10 px-4 py-2 text-gray-700"
            >
              {isLogin ? 'Register' : 'Login'}
            </button>
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 active:scale-95 h-10 px-4 py-2">
              {isLogin ? 'Login' : 'Create Account'}
            </button>
          </div>
        </div>

        {/* CSS Animation */}
        <style jsx>{`
          @keyframes borderMove {
            0% {
              background-position: 200% 0%;
            }
            100% {
              background-position: -200% 0%;
            }
          }
        `}</style>
      </div>
    </div>
  );
}