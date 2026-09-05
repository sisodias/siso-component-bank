import { Home } from 'lucide-react';

export const Component = () => {
  return (
     <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-white overflow-hidden w-full">
    {/* Blurred gradient blobs background */}
    <div className="pointer-events-none select-none absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-blue-300 via-purple-200 to-pink-200 opacity-40 rounded-full blur-3xl z-0" />
    <div className="pointer-events-none select-none absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-tr from-pink-200 via-purple-200 to-blue-200 opacity-30 rounded-full blur-3xl z-0" />
    <div className="relative z-10 flex flex-col items-center w-full">
      <h1 className="text-7xl font-extrabold mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">404</h1>
      <div className="w-16 h-px bg-gray-200 mb-8" />
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">Page not found</h2>
      <p className="text-base text-gray-600 mb-10 text-center max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <div className="flex flex-col gap-4 w-full max-w-md items-center">
        <button
          type="button"
          onClick={() => { window.location.href = '/'; }}
          className="w-fit bg-gradient-to-r from-blue-700 to-purple-700 hover:from-blue-800 hover:to-purple-800 text-white font-semibold text-base py-3 px-6 rounded-xl flex items-center justify-center gap-2 border-0 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <Home className="w-5 h-5 mr-1" />
          Back to Home
        </button>
      </div>
    </div>
  </div>
  );
};
