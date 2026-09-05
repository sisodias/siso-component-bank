import { cn } from "@/lib/utils";
import { useState } from "react";

export const Component = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }, 1600);
  };

  return (
    <div
      className={cn(
        "relative min-h-screen overflow-hidden",
        "bg-gradient-to-br from-fuchsia-100 via-sky-100 to-violet-200"
      )}
    >
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-pink-300/40 blur-3xl" />
        <div className="absolute top-1/4 -right-24 h-80 w-80 rounded-full bg-cyan-300/40 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-violet-300/40 blur-3xl" />
        <div className="absolute bottom-10 right-20 h-64 w-64 rounded-full bg-emerald-200/30 blur-3xl" />
      </div>

      {/* Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          {/* Success Message */}
          <div
            className={cn(
              "mb-4 transform rounded-2xl border border-white/40 bg-white/30 px-4 py-3 text-sm font-medium text-slate-700 shadow-lg backdrop-blur-xl transition-all duration-500",
              success
                ? "translate-y-0 opacity-100"
                : "-translate-y-4 pointer-events-none opacity-0"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md">
                ✓
              </div>
              <div>
                <p className="font-semibold text-slate-800">Login successful</p>
                <p className="text-xs text-slate-600">
                  Welcome back, your account has been accessed successfully.
                </p>
              </div>
            </div>
          </div>

          {/* Login Card */}
          <div
            className={cn(
              "relative overflow-hidden rounded-[28px] border border-white/40",
              "bg-white/20 shadow-[0_20px_60px_rgba(31,38,135,0.18)] backdrop-blur-2xl"
            )}
          >
            {/* top glow */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-pink-400 via-violet-400 to-cyan-400" />

            <div className="p-8 sm:p-10">
              {/* Header */}
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/40 shadow-lg backdrop-blur-md">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-fuchsia-500 via-violet-500 to-cyan-500 shadow-md" />
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-slate-800">
                  Welcome Back
                </h1>
                <p className="mt-2 text-sm text-slate-600">
                  Sign in to continue to your dashboard
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={cn(
                      "w-full rounded-2xl border border-white/50 bg-white/35 px-4 py-3.5 text-sm text-slate-800",
                      "placeholder:text-slate-500 outline-none backdrop-blur-md",
                      "transition-all duration-300",
                      "focus:border-fuchsia-300 focus:bg-white/50 focus:shadow-[0_0_0_4px_rgba(217,70,239,0.10)]"
                    )}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={cn(
                      "w-full rounded-2xl border border-white/50 bg-white/35 px-4 py-3.5 text-sm text-slate-800",
                      "placeholder:text-slate-500 outline-none backdrop-blur-md",
                      "transition-all duration-300",
                      "focus:border-cyan-300 focus:bg-white/50 focus:shadow-[0_0_0_4px_rgba(34,211,238,0.10)]"
                    )}
                  />
                </div>

                <div className="flex items-center justify-between gap-3">
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="h-4 w-4 rounded border-white/50 accent-violet-500"
                    />
                    Remember me
                  </label>

                  <button
                    type="button"
                    className="text-sm font-medium text-violet-700 transition hover:text-fuchsia-600"
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={cn(
                    "group relative w-full overflow-hidden rounded-2xl px-4 py-3.5 text-sm font-semibold text-white",
                    "bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-500",
                    "shadow-[0_12px_30px_rgba(139,92,246,0.35)]",
                    "transition-all duration-300",
                    "hover:scale-[1.02] hover:shadow-[0_16px_36px_rgba(139,92,246,0.42)]",
                    "active:scale-[0.99]",
                    loading ? "cursor-not-allowed opacity-90" : ""
                  )}
                >
                  <span className="absolute inset-0 translate-x-[-120%] bg-white/20 transition-transform duration-700 group-hover:translate-x-[120%]" />
                  <span className="relative flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        Signing In...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </span>
                </button>
              </form>

              {/* Divider */}
              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-white/40" />
                <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                  Or continue with
                </span>
                <div className="h-px flex-1 bg-white/40" />
              </div>

              {/* Social Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="rounded-2xl border border-white/50 bg-white/30 px-4 py-3 text-sm font-medium text-slate-700 backdrop-blur-md transition-all duration-300 hover:bg-white/45 hover:shadow-md"
                >
                  Google
                </button>
                <button
                  type="button"
                  className="rounded-2xl border border-white/50 bg-white/30 px-4 py-3 text-sm font-medium text-slate-700 backdrop-blur-md transition-all duration-300 hover:bg-white/45 hover:shadow-md"
                >
                  GitHub
                </button>
              </div>

              {/* Footer */}
              <p className="mt-7 text-center text-sm text-slate-600">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  className="font-semibold text-fuchsia-700 transition hover:text-violet-700"
                >
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