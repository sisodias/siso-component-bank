import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, LogIn } from 'lucide-react';

const AnimatedSignIn: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Animation states
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeout(() => setFormVisible(true), 300);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Sign in attempt with:', { email, password });
      setIsLoading(false);
    }, 1500);
  };

  // Only show the component once mounted to avoid hydration issues
  if (!mounted) return null;

  return (
    <div className={`min-h-screen w-full transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900' : 'bg-[#e8f4ef]'}`}>
      <div className="flex min-h-screen items-center justify-center p-4 md:p-0">
        <div className={`w-full max-w-6xl overflow-hidden rounded-2xl transition-all duration-500 ${
          theme === 'dark' ? 'bg-slate-800 shadow-xl shadow-slate-700/20' : 'bg-white shadow-xl shadow-gray-200'
        } ${formVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          
          {/* Theme toggle */}
          <button 
            onClick={toggleTheme}
            className={`absolute right-4 top-4 rounded-full p-2 transition-colors z-10 ${
              theme === 'dark' 
                ? 'bg-slate-700 text-yellow-400 hover:bg-slate-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>
            )}
          </button>

          <div className="flex flex-col md:flex-row">
            {/* Left side - Statistics and Images Collage */}
            <div className="hidden md:block w-full md:w-3/5 bg-gray-100 p-6 animate-fade-in">
              <div className="grid grid-cols-2 grid-rows-3 gap-4 h-full overflow-hidden">
                {/* Top left - Person working */}
                <div className="overflow-hidden rounded-xl">
                  <img 
                    src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d" 
                    alt="Person working" 
                    className="w-full h-full object-cover"
                    style={{ opacity: 0.9 }}
                  />
                </div>
                
                {/* Top right - Orange stat */}
                <div 
                  className={`rounded-xl flex flex-col justify-center items-center p-6 text-white ${
                    theme === 'dark' ? 'bg-orange-600' : 'bg-orange-500'
                  }`}
                  style={{
                    transform: formVisible ? 'translateY(0)' : 'translateY(20px)',
                    opacity: formVisible ? 1 : 0,
                    transition: 'transform 0.6s ease-out, opacity 0.6s ease-out',
                    transitionDelay: '0.2s',
                  }}
                >
                  <h2 className="text-5xl font-bold mb-2">41%</h2>
                  <p className="text-center text-sm">of recruiters say entry-level positions are the hardest to fill.</p>
                </div>
                
                {/* Middle left - Person at computer */}
                <div className="overflow-hidden rounded-xl">
                  <img 
                    src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" 
                    alt="Person at computer" 
                    className="w-full h-full object-cover"
                    style={{ opacity: 0.9 }}
                  />
                </div>
                
                {/* Middle right - Office space */}
                <div className="overflow-hidden rounded-xl">
                  <img 
                    src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81" 
                    alt="Office space" 
                    className="w-full h-full object-cover"
                    style={{ opacity: 0.9 }}
                  />
                </div>
                
                {/* Bottom left - Green stat */}
                <div 
                  className={`rounded-xl flex flex-col justify-center items-center p-6 text-white ${
                    theme === 'dark' ? 'bg-green-600' : 'bg-green-500'
                  }`}
                  style={{
                    transform: formVisible ? 'translateY(0)' : 'translateY(20px)',
                    opacity: formVisible ? 1 : 0,
                    transition: 'transform 0.6s ease-out, opacity 0.6s ease-out',
                    transitionDelay: '0.4s',
                  }}
                >
                  <h2 className="text-5xl font-bold mb-2">76%</h2>
                  <p className="text-center text-sm">of hiring managers admit attracting the right job candidates is their greatest challenge.</p>
                </div>
                
                {/* Bottom right - Library */}
                <div className="overflow-hidden rounded-xl">
                  <img 
                    src="https://images.unsplash.com/photo-1498050108023-c5249f4df085" 
                    alt="Desk setup" 
                    className="w-full h-full object-cover"
                    style={{ opacity: 0.9 }}
                  />
                </div>
              </div>
            </div>
            
            {/* Right side - Sign in form */}
            <div 
              className={`w-full md:w-2/5 p-8 md:p-12 ${
                theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white text-gray-900'
              }`}
              style={{
                transform: formVisible ? 'translateX(0)' : 'translateX(20px)',
                opacity: formVisible ? 1 : 0,
                transition: 'transform 0.6s ease-out, opacity 0.6s ease-out'
              }}
            >
              <div className="flex justify-end mb-6">
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  Don't have an account? 
                  <a 
                    href="#" 
                    className={`ml-1 font-medium ${
                      theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
                    }`}
                  >
                    Sign up
                  </a>
                </p>
              </div>

              <div className="mb-8">
                <h1 className={`text-2xl font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Sign in to <span className="text-blue-500">Jobsly</span>
                </h1>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  Welcome to Jobsly, please enter your login details below to using the app.
                </p>
              </div>
              
              <form onSubmit={handleSignIn} className="space-y-6">
                <div className="space-y-1">
                  <label 
                    htmlFor="email" 
                    className={`block text-sm font-medium ${
                      theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                    }`}
                  >
                    Email Address
                  </label>
                  <div className={`relative rounded-md shadow-sm transition-all duration-300`}>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`block w-full rounded-md border py-3 px-4 focus:outline-none focus:ring-2 sm:text-sm ${
                        theme === 'dark' 
                          ? 'bg-slate-700 border-slate-600 text-white placeholder:text-gray-400 focus:ring-blue-500' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-blue-500'
                      }`}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label 
                    htmlFor="password" 
                    className={`block text-sm font-medium ${
                      theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                    }`}
                  >
                    Password
                  </label>
                  <div className={`relative rounded-md shadow-sm transition-all duration-300`}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`block w-full rounded-md border py-3 px-4 pr-10 focus:outline-none focus:ring-2 sm:text-sm ${
                        theme === 'dark' 
                          ? 'bg-slate-700 border-slate-600 text-white placeholder:text-gray-400 focus:ring-blue-500' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-blue-500'
                      }`}
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      className={`absolute inset-y-0 right-0 flex items-center pr-3 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                      }`}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff size={18} className="hover:text-gray-700 transition-colors" />
                      ) : (
                        <Eye size={18} className="hover:text-gray-700 transition-colors" />
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <a 
                    href="#" 
                    className={`text-sm font-medium ${
                      theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-600'
                    }`}
                  >
                    Forgot the password?
                  </a>
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`flex w-full justify-center rounded-md py-3 px-4 text-sm font-semibold text-white shadow-sm transition-all duration-300 ${
                    theme === 'dark' 
                      ? 'bg-blue-600 hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500' 
                      : 'bg-blue-600 hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                  } ${isLoading ? 'cursor-not-allowed opacity-70' : ''}`}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      Login
                    </span>
                  )}
                </button>
                
                <div className="relative flex items-center py-2">
                  <div className={`flex-grow border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}></div>
                  <span className={`flex-shrink mx-4 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>OR</span>
                  <div className={`flex-grow border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}></div>
                </div>
                
                <button
                  type="button"
                  className={`flex w-full items-center justify-center gap-2 rounded-md py-3 px-4 text-sm font-medium transition-colors ${
                    theme === 'dark' 
                      ? 'border border-gray-700 bg-gray-800 text-white hover:bg-gray-700' 
                      : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    <path d="M1 1h22v22H1z" fill="none" />
                  </svg>
                  Sign in with Google
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { AnimatedSignIn };
