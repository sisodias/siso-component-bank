import { useState } from "react";

export const Component = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="overflow-x-hidden bg-gray-50">
      <header className="py-4 md:py-6">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex-shrink-0">
              <a href="#" className="flex rounded outline-none focus:ring-1 focus:ring-gray-900 focus:ring-offset-2">
                <img className="w-auto h-8" src="https://cdn.rareblocks.xyz/collection/clarity/images/logo.svg" alt="Brand logo" />
              </a>
            </div>

            <div className="flex lg:hidden">
              <button
                type="button"
                className="text-gray-900"
                onClick={() => setExpanded((prev) => !prev)}
                aria-expanded={expanded}
              >
                {expanded ? (
                  <svg className="w-7 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-7 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>

            <div className="hidden lg:flex lg:ml-16 lg:items-center lg:justify-center lg:space-x-10 xl:space-x-16">
              <a href="#" className="text-base font-medium text-gray-900 hover:text-opacity-50 focus:ring-1 focus:ring-gray-900 focus:ring-offset-2">Overview</a>
              <a href="#" className="text-base font-medium text-gray-900 hover:text-opacity-50 focus:ring-1 focus:ring-gray-900 focus:ring-offset-2">Plans</a>
              <a href="#" className="text-base font-medium text-gray-900 hover:text-opacity-50 focus:ring-1 focus:ring-gray-900 focus:ring-offset-2">Integrations</a>
            </div>

            <div className="hidden lg:ml-auto lg:flex lg:items-center lg:space-x-10">
              <a href="#" className="text-base font-medium text-gray-900 hover:text-opacity-50 focus:ring-1 focus:ring-gray-900 focus:ring-offset-2">Sign In</a>
              <a
                href="#"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-bold text-white bg-gray-900 rounded-xl hover:bg-gray-600 focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
              >
                Create Account
              </a>
            </div>
          </div>

          {expanded && (
            <nav>
              <div className="px-1 py-8">
                <div className="grid gap-y-7">
                  <a href="#" className="flex items-center p-3 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-xl">Overview</a>
                  <a href="#" className="flex items-center p-3 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-xl">Plans</a>
                  <a href="#" className="flex items-center p-3 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-xl">Integrations</a>
                  <a href="#" className="flex items-center p-3 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-xl">Sign In</a>
                  <a
                    href="#"
                    className="inline-flex items-center justify-center px-6 py-3 text-base font-bold text-white bg-gray-900 rounded-xl hover:bg-gray-600 focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                  >
                    Create Account
                  </a>
                </div>
              </div>
            </nav>
          )}
        </div>
      </header>

      <section className="pt-12 bg-gray-50 sm:pt-16">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="px-6 text-lg text-gray-600">A developer-first platform for modern marketing</h1>
            <p className="mt-5 text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl">
              Grow your audience with powerful{" "}
              <span className="relative inline-flex">
                <span className="bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] blur-lg filter opacity-30 absolute inset-0"></span>
                <span className="relative">automation</span>
              </span>
            </p>

            <div className="px-8 mt-9 sm:flex sm:justify-center sm:space-x-5 sm:px-0">
              <a
                href="#"
                className="inline-flex items-center justify-center w-full px-8 py-3 text-lg font-bold text-white bg-gray-900 rounded-xl sm:w-auto hover:bg-gray-600"
              >
                Start Free Trial
              </a>

              <a
                href="#"
                className="inline-flex items-center justify-center w-full px-6 py-3 mt-4 text-lg font-bold text-gray-900 border-2 border-gray-400 rounded-xl sm:w-auto sm:mt-0 hover:bg-gray-900 hover:text-white"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 18 18">
                  <path
                    d="M8.18 13.4261C6.86 14.39 5 13.45 5 11.81V5.44C5 3.8 6.86 2.86 8.18 3.82L12.54 7.01C13.63 7.81 13.63 9.44 12.54 10.24L8.18 13.43Z"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Watch Preview
              </a>
            </div>

            <p className="mt-8 text-base text-gray-500">Try all features free for 60 days. No card required.</p>
          </div>
        </div>

        <div className="pb-12 bg-white">
          <div className="relative">
            <div className="absolute inset-0 h-2/3 bg-gray-50"></div>
            <div className="relative mx-auto">
              <div className="lg:max-w-6xl lg:mx-auto">
                <img className="transform scale-110" src="https://cdn.rareblocks.xyz/collection/clarity/images/hero/2/illustration.png" alt="Marketing Illustration" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
