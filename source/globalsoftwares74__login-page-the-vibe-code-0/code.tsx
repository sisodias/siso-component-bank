import { cn } from "@/lib/utils";
import { useState } from "react";

export const Component = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
      }, 2600);
    }, 1500);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(109,40,217,0.12),transparent_45%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#02030a_0%,#070b1d_35%,#050816_100%)]" />

        {/* Big planet glow */}
        <div className="absolute right-[-140px] top-[-120px] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_35%_35%,rgba(255,255,255,0.95)_0%,rgba(230,210,255,0.75)_12%,rgba(179,136,255,0.65)_24%,rgba(114,57,255,0.45)_38%,rgba(58,22,150,0.22)_58%,rgba(0,0,0,0)_72%)] blur-[1px]" />
        <div className="absolute right-[80px] top-[90px] h-[260px] w-[260px] rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute right-[160px] top-[180px] h-[160px] w-[160px] rounded-full bg-fuchsia-400/20 blur-3xl" />

        {/* Small blur star */}
        <div className="absolute left-[11%] top-[16%] h-12 w-12 rounded-full bg-violet-300/20 blur-xl" />

        {/* Bottom ambient light */}
        <div className="absolute bottom-[-120px] left-1/2 h-[260px] w-[520px] -translate-x-1/2 rounded-full bg-violet-700/10 blur-3xl" />

        {/* Tiny stars */}
        <div className="absolute left-[15%] top-[22%] h-[2px] w-[2px] rounded-full bg-white/60" />
        <div className="absolute left-[22%] top-[35%] h-[2px] w-[2px] rounded-full bg-white/40" />
        <div className="absolute left-[30%] top-[18%] h-[1px] w-[1px] rounded-full bg-white/60" />
        <div className="absolute left-[70%] top-[28%] h-[2px] w-[2px] rounded-full bg-white/40" />
        <div className="absolute left-[82%] top-[18%] h-[2px] w-[2px] rounded-full bg-white/50" />
        <div className="absolute left-[78%] top-[42%] h-[1px] w-[1px] rounded-full bg-white/60" />
        <div className="absolute left-[58%] top-[20%] h-[2px] w-[2px] rounded-full bg-white/30" />
        <div className="absolute left-[8%] top-[62%] h-[1px] w-[1px] rounded-full bg-white/40" />
        <div className="absolute left-[18%] top-[74%] h-[2px] w-[2px] rounded-full bg-white/30" />
        <div className="absolute left-[88%] top-[78%] h-[2px] w-[2px] rounded-full bg-white/40" />
      </div>

      {/* Center content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-[340px]">
          {/* Success message */}
          <div
            className={cn(
              "mb-4 overflow-hidden rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 shadow-[0_10px_30px_rgba(16,185,129,0.18)] backdrop-blur-xl transition-all duration-500",
              success
                ? "translate-y-0 opacity-100"
                : "-translate-y-4 opacity-0 pointer-events-none"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400 text-black text-sm font-bold">
                ✓
              </div>
              <div>
                <p className="text-sm font-semibold text-emerald-200">
                  Login Successful
                </p>
                <p className="text-xs text-emerald-100/70">
                  Welcome back to your account
                </p>
              </div>
            </div>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl">
            <div className="mb-5">
              <h1 className="text-[34px] font-light tracking-[-0.03em] text-white">
                Sign In
              </h1>
              <p className="mt-1 text-[12px] text-white/55">
                Keep it all together and you&apos;ll be fine
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <input
                  type="text"
                  placeholder="Email or Phone"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 w-full rounded-none border border-white/20 bg-[#0b1022]/70 px-3 text-[13px] text-white outline-none transition-all duration-300 placeholder:text-white/45 focus:border-violet-400/70 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.10)]"
                />
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 w-full rounded-none border border-white/20 bg-[#0b1022]/70 px-3 pr-16 text-[13px] text-white outline-none transition-all duration-300 placeholder:text-white/45 focus:border-violet-400/70 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.10)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-white/75 transition hover:text-violet-300"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <button
                type="button"
                className="text-left text-[12px] text-white/75 transition hover:text-violet-300"
              >
                Forgot Password
              </button>

              <button
                type="submit"
                disabled={loading}
                className={cn(
                  "relative mt-1 h-11 w-full overflow-hidden rounded-none bg-gradient-to-r from-violet-700 via-fuchsia-600 to-violet-500 text-[13px] font-medium text-white",
                  "shadow-[0_10px_25px_rgba(139,92,246,0.30)] transition-all duration-300",
                  "hover:scale-[1.01] hover:shadow-[0_14px_35px_rgba(168,85,247,0.38)] active:scale-[0.995]",
                  loading && "opacity-90"
                )}
              >
                <span className="absolute inset-0 -translate-x-full bg-white/15 transition-transform duration-700 hover:translate-x-full" />
                <span className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </span>
              </button>
            </form>

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-[12px] text-white/45">or</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <button
              type="button"
              className="flex h-11 w-full items-center justify-center gap-2 border border-white/10 bg-white/[0.05] text-[13px] text-white/90 transition-all duration-300 hover:bg-white/[0.08] hover:border-white/20"
            >
              <span className="text-sm"></span>
              <span>Sign in with Apple</span>
            </button>

            <p className="mt-6 text-center text-[12px] text-white/55">
              New to Atomz{" "}
              <button
                type="button"
                className="font-medium text-violet-400 transition hover:text-fuchsia-400"
              >
                Join Now
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};