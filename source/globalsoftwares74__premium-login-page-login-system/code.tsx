import { useState } from "react";
import { cn } from "@/lib/utils";

export const Component = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left Side */}
        <div className="hidden lg:flex flex-col justify-between border-r border-slate-200 bg-gradient-to-br from-white via-slate-50 to-slate-100 p-12">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
              <div className="h-2.5 w-2.5 rounded-full bg-slate-900" />
              <span className="text-sm font-medium text-slate-700">
                Premium Access
              </span>
            </div>
          </div>

          <div className="max-w-xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
              Welcome Back
            </p>
            <h1 className="text-5xl font-semibold leading-tight text-slate-900">
              Clean, elegant login experience for modern dashboards.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600">
              Sign in to manage your workspace, monitor activity, and continue
              with a smooth premium interface designed for clarity and comfort.
            </p>

            <div className="mt-10 grid grid-cols-3 gap-4">
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
                <p className="text-2xl font-semibold text-slate-900">99.9%</p>
                <p className="mt-1 text-sm text-slate-500">Reliable Access</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
                <p className="text-2xl font-semibold text-slate-900">24/7</p>
                <p className="mt-1 text-sm text-slate-500">Secure Monitoring</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
                <p className="text-2xl font-semibold text-slate-900">128-bit</p>
                <p className="mt-1 text-sm text-slate-500">Protected Sessions</p>
              </div>
            </div>
          </div>

          <div className="text-sm text-slate-500">
            Designed for a clean white premium user experience.
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-16">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <div className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
                <div className="h-2.5 w-2.5 rounded-full bg-slate-900" />
                <span className="text-sm font-medium text-slate-700">
                  Premium Access
                </span>
              </div>
            </div>

            <div
              className={cn(
                "rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
              )}
            >
              <div className="mb-8">
                <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
                  Sign in
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Enter your credentials to access your account.
                </p>
              </div>

              <form className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Email address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-sm font-medium text-slate-700">
                      Password
                    </label>
                    <button
                      type="button"
                      className="text-xs font-medium text-slate-500 hover:text-slate-800"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 pr-14 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-3 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-300"
                    />
                    Remember me
                  </label>

                  <span className="text-sm text-slate-400">Secure login</span>
                </div>

                <button
                  type="submit"
                  className="h-12 w-full rounded-xl border border-slate-900 bg-slate-900 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Sign in
                </button>
              </form>

              <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  or continue
                </span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button className="h-11 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                  Google
                </button>
                <button className="h-11 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                  Microsoft
                </button>
              </div>

              <p className="mt-8 text-center text-sm text-slate-500">
                Don&apos;t have an account?{" "}
                <button className="font-semibold text-slate-900 hover:underline">
                  Create account
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};