"use client"

export function Component() {
  return (
    <>
      <style jsx>{`
        @keyframes cart-float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes wheel-spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .animate-cart-float {
          animation: cart-float 3s ease-in-out infinite;
        }
        .animate-wheel {
          animation: wheel-spin 2s linear infinite;
        }
      `}</style>
      <div className="relative flex min-h-[400px] w-full max-w-md flex-col items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-slate-100 p-8">
        {/* 3D Isometric Cart */}
        <div className="animate-cart-float relative mb-8" style={{ perspective: "1000px" }}>
          <div
            className="relative h-32 w-40"
            style={{
              transformStyle: "preserve-3d",
              transform: "rotateX(55deg) rotateZ(-45deg)",
            }}
          >
            {/* Cart base */}
            <div
              className="absolute h-20 w-28 rounded-lg bg-gradient-to-br from-orange-400 to-amber-500 shadow-xl"
              style={{
                transform: "translateZ(0px)",
                left: "20px",
                top: "20px",
              }}
            >
              {/* Cart interior shadow */}
              <div className="absolute inset-2 rounded-md bg-orange-600/30" />
              {/* Cart grid lines */}
              <div className="absolute inset-3 grid grid-cols-3 gap-1 opacity-30">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-sm bg-white/40" />
                ))}
              </div>
            </div>

            {/* Cart front */}
            <div
              className="absolute h-6 w-28 rounded-b-lg bg-gradient-to-b from-orange-500 to-orange-600"
              style={{
                transform: "rotateX(-90deg) translateZ(10px)",
                left: "20px",
                top: "40px",
                transformOrigin: "top center",
              }}
            />

            {/* Cart side */}
            <div
              className="absolute h-20 w-6 rounded-r-lg bg-gradient-to-r from-amber-500 to-amber-600"
              style={{
                transform: "rotateY(90deg) translateZ(14px)",
                left: "34px",
                top: "20px",
                transformOrigin: "left center",
              }}
            />

            {/* Handle */}
            <div
              className="absolute h-2 w-16 rounded-full bg-gray-600"
              style={{
                transform: "translateZ(24px) rotateZ(0deg)",
                left: "-10px",
                top: "50px",
              }}
            />

            {/* Wheels */}
            <div
              className="animate-wheel absolute h-5 w-5 rounded-full border-4 border-gray-600 bg-gray-300"
              style={{
                left: "10px",
                top: "70px",
              }}
            />
            <div
              className="animate-wheel absolute h-5 w-5 rounded-full border-4 border-gray-600 bg-gray-300"
              style={{
                left: "55px",
                top: "70px",
                animationDelay: "0.5s",
              }}
            />
          </div>
        </div>

        {/* Text Content */}
        <h2 className="mb-2 text-2xl font-semibold text-gray-800">Your cart is empty</h2>
        <p className="mb-6 max-w-xs text-center text-sm text-gray-500">
          Looks like you haven&apos;t added anything yet. Discover our amazing products and start shopping!
        </p>

        {/* CTA Button - self-contained */}
        <button className="inline-flex items-center justify-center gap-2 rounded-md bg-orange-500 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
            <path d="M3 6h18" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          Start Shopping
        </button>

        {/* Decorative elements */}
        <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-orange-200/30 blur-3xl" />
        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-amber-200/30 blur-3xl" />
      </div>
    </>
  )
}
