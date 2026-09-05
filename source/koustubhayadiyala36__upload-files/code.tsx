"use client"

export function Component() {
  return (
    <>
      <style jsx>{`
        @keyframes folder-breathe {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-8px) scale(1.02);
          }
        }
        .animate-folder-breathe {
          animation: folder-breathe 3s ease-in-out infinite;
        }
      `}</style>
      <div className="relative flex min-h-[400px] w-full max-w-md flex-col items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-violet-100 via-purple-50 to-indigo-100 p-8">
        {/* Decorative background circles */}
        <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-violet-200/40 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-indigo-200/40 blur-3xl" />

        {/* Animated Folder Icon */}
        <div className="animate-folder-breathe relative mb-6">
          <svg
            width="120"
            height="100"
            viewBox="0 0 120 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-lg"
          >
            {/* Folder back */}
            <path
              d="M10 25C10 20.5817 13.5817 17 18 17H42L52 27H102C106.418 27 110 30.5817 110 35V85C110 89.4183 106.418 93 102 93H18C13.5817 93 10 89.4183 10 85V25Z"
              fill="url(#folder-gradient)"
            />
            {/* Folder front/lid */}
            <path
              d="M10 35C10 30.5817 13.5817 27 18 27H102C106.418 27 110 30.5817 110 35V40H10V35Z"
              fill="url(#folder-lid-gradient)"
            />
            {/* Inner shadow */}
            <path
              d="M15 45H105V85C105 87.2091 103.209 89 101 89H19C16.7909 89 15 87.2091 15 85V45Z"
              fill="url(#folder-inner-gradient)"
              fillOpacity="0.5"
            />
            <defs>
              <linearGradient id="folder-gradient" x1="10" y1="17" x2="110" y2="93" gradientUnits="userSpaceOnUse">
                <stop stopColor="#8B5CF6" />
                <stop offset="1" stopColor="#6366F1" />
              </linearGradient>
              <linearGradient id="folder-lid-gradient" x1="10" y1="27" x2="110" y2="40" gradientUnits="userSpaceOnUse">
                <stop stopColor="#A78BFA" />
                <stop offset="1" stopColor="#818CF8" />
              </linearGradient>
              <linearGradient
                id="folder-inner-gradient"
                x1="15"
                y1="45"
                x2="105"
                y2="89"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#7C3AED" />
                <stop offset="1" stopColor="#4F46E5" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Text Content */}
        <h2 className="mb-2 text-2xl font-semibold text-gray-800">No files yet</h2>
        <p className="mb-6 max-w-xs text-center text-sm text-gray-500">
          Your folder is empty. Upload files to get started organizing your documents.
        </p>

        {/* CTA Button - self-contained */}
        <button className="inline-flex items-center justify-center gap-2 rounded-md bg-violet-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2">
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
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" x2="12" y1="3" y2="15" />
          </svg>
          Upload Files
        </button>
      </div>
    </>
  )
}
