import { Sun, Moon, Settings } from 'lucide-react';

export const Component = () => {

  return (
    <div
      className="
        inline-flex rounded-lg overflow-hidden relative
        bg-white/20 dark:bg-black/40
        backdrop-blur-md
        shadow-lg shadow-black/20
        border border-gray-300 dark:border-black/60
        transition-colors duration-500
      "
    >
      <button
        className="
          px-4 py-2 rounded-l-lg
          flex items-center gap-2
          text-black dark:text-white
          bg-transparent
          hover:bg-black/10 dark:hover:bg-white/10
          transition-colors duration-300
          focus:outline-none focus:ring-0
          border-r border-gray-300 dark:border-black/60
          group
        "
        aria-label="Toggle Light Mode"
      >
        <Sun
          className="
            w-5 h-5
            text-current
            transition-transform duration-300
            group-hover:scale-110
          "
          aria-hidden="true"
        />
        <span className="select-none">Light</span>
      </button>

      <button
        className="
          px-4 py-2
          flex items-center gap-2
          text-black dark:text-white
          bg-transparent
          hover:bg-black/10 dark:hover:bg-white/10
          transition-colors duration-300
          focus:outline-none focus:ring-0
          border-r border-gray-300 dark:border-black/60
          group
        "
        aria-label="Toggle Dark Mode"
      >
        <Moon
          className="
            w-5 h-5
            text-current
            transition-transform duration-300
            group-hover:scale-110
          "
          aria-hidden="true"
        />
        <span className="select-none">Dark</span>
      </button>

      <button
        className="
          px-4 py-2 rounded-r-lg
          flex items-center gap-2
          text-black dark:text-white
          bg-transparent
          hover:bg-black/10 dark:hover:bg-white/10
          transition-colors duration-300
          focus:outline-none focus:ring-0
          group
        "
        aria-label="Open Settings"
      >
        <Settings
          className="
            w-5 h-5
            text-current
            transition-transform duration-300
            group-hover:scale-110
          "
          aria-hidden="true"
        />
        <span className="select-none">Settings</span>
      </button>
    </div>
  );
};
