"use client";

import React, { useState} from "react";
import { Eye, EyeOff, Mail, Lock, Github, ArrowRight, Sparkles } from "lucide-react";

// --- HELPER COMPONENTS (ICONS) ---

const GoogleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 48 48"
  >
    <path
      fill="#FFC107"
      d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
    />
    <path
      fill="#FF3D00"
      d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
    />
    <path
      fill="#1976D2"
      d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
    />
  </svg>
);

// --- TYPE DEFINITIONS ---

export interface BackgroundSlide {
  gradient: string;
  pattern?: string;
  title: string;
  subtitle: string;
}

interface SignInPageProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  onSignIn?: (event: React.FormEvent<HTMLFormElement>) => void;
  onGoogleSignIn?: () => void;
  onGithubSignIn?: () => void;
  onResetPassword?: () => void;
    onCreateAccount?: () => void;
  heroImageSrc?: string;
}

// --- MAIN COMPONENT ---

const SignInPage: React.FC<SignInPageProps> = ({
  title = "Welcome Back",
  description = "Sign in to access your account",
  onSignIn,
  onGoogleSignIn,
  onGithubSignIn,
  onResetPassword,
    onCreateAccount,
  heroImageSrc,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    onSignIn?.(e);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="h-screen flex relative bg-gray-50 dark:bg-gray-900">
      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          33% {
            transform: translateY(-20px) translateX(10px);
          }
          66% {
            transform: translateY(10px) translateX(-10px);
          }
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>

      {/* left side - Hero image */}
      <div className="hidden lg:block w-1/2 relative">
        <div className="h-full w-full overflow-hidden relative shadow-2xl">
          <img
            src={heroImageSrc}
            alt="Abstract colorful background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-12 text-white">
            <h2 className="text-4xl font-bold mb-4">Start Your Journey</h2>
            <p className="text-xl text-white/90 mb-8">
              Join millions of users who trust our platform for secure
              authentication
            </p>
            <div className="flex gap-8">
              <div>
                <p className="text-3xl font-bold">2M+</p>
                <p className="text-sm text-white/80">Active Users</p>
              </div>
              <div>
                <p className="text-3xl font-bold">99.9%</p>
                <p className="text-sm text-white/80">Uptime SLA</p>
              </div>
              <div>
                <p className="text-3xl font-bold">256bit</p>
                <p className="text-sm text-white/80">Encryption</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* right side - Sign in form with animated background */}
      <div className="flex-1 border-2 border-gray-200 shadow-2xl relative">
        {/* <AnimatedBackground /> */}
        <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-6 lg:p-12 z-10">
          <div className="w-full max-w-md">
            <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-gray-700/50">
              {/* Logo */}
              <div className="flex items-center justify-center mb-8">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* Title */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {title}
                </h1>
                <p className="text-muted-foreground mt-2">{description}</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="name@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={onResetPassword}
                    className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white dark:bg-gray-900 text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Social buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={onGoogleSignIn}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <GoogleIcon />
                  <span className="text-sm font-medium">Google</span>
                </button>
                <button
                  onClick={onGithubSignIn}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <Github className="w-5 h-5" />
                  <span className="text-sm font-medium">GitHub</span>
                </button>
              </div>

              {/* Sign up link */}
                          <p className="text-center text-sm mt-6">
                              {`Don't have an account?`}
                {" "}
                <button
                  onClick={onCreateAccount}
                  className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                >
                  Sign up for free
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

   
    </div>
  );
};

export  {SignInPage};