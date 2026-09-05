import React, { useState } from 'react';

export default function HextaStudioSignup() {
  const [email, setEmail] = useState('hello@creativestudio.com');
  const [password, setPassword] = useState('');

  const handleCreateAccount = () => {
    console.log('Creating account with:', { email, password });
    // Handle account creation logic here
  };

  const handleLogin = () => {
    console.log('Redirecting to login');
    // Handle login redirect logic here
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Dark Section */}
      <div className="flex-1 bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 flex items-center justify-center p-12">
        <div className="max-w-md">
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Build amazing products with our creative team.
          </h1>
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div className="flex-1 bg-gray-50 flex items-center justify-center p-12">
        <div className="w-full max-w-md">
          {/* Rocket Icon */}
          <div className="mb-8">
            <div className="w-12 h-12 relative">
              {/* Rocket body */}
              <div className="w-4 h-8 bg-blue-500 rounded-t-full absolute top-1 left-4"></div>
              <div className="w-2 h-6 bg-blue-600 rounded-t-full absolute top-1 left-5"></div>
              {/* Rocket fins */}
              <div className="w-2 h-3 bg-blue-400 absolute top-6 left-2 transform rotate-45"></div>
              <div className="w-2 h-3 bg-blue-400 absolute top-6 right-2 transform -rotate-45"></div>
              {/* Rocket flames */}
              <div className="w-1 h-2 bg-orange-500 absolute bottom-1 left-4"></div>
              <div className="w-1 h-3 bg-red-500 absolute bottom-0 left-5"></div>
              <div className="w-1 h-2 bg-yellow-500 absolute bottom-1 right-4"></div>
            </div>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Join Us Today</h2>
            <p className="text-gray-600">Welcome to CreativeStudio — Start your journey</p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Your email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                placeholder="hello@creativestudio.com"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Create new password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                placeholder="Enter your password"
              />
            </div>

            {/* Create Account Button */}
            <button
              onClick={handleCreateAccount}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Create a new account
            </button>

            {/* Login Link */}
            <div className="text-center">
              <span className="text-gray-600">Already have account? </span>
              <button
                onClick={handleLogin}
                className="text-gray-900 font-semibold hover:text-orange-500 transition-colors duration-200"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
