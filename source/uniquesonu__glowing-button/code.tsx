import { FiArrowRight } from "react-icons/fi"; // Using a different icon that fits the animation

const ButtonWrapper = () => {
  // A dark background makes the button's glowing effect more prominent
  return (
    <div className="bg-slate-900 min-h-screen w-full flex items-center justify-center">
      <GlowingButton />
    </div>
  );
};

const GlowingButton = () => {
  return (
    <button
      className={`
        relative group p-0.5 rounded-full
        bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500
        font-semibold text-white
        transition-transform duration-300 ease-in-out
        hover:scale-105
        active:scale-95 cursor-pointer
      `}
    >
      <span className="block w-full h-full px-6 py-3 rounded-full bg-slate-900">
        <span className="relative flex items-center justify-center gap-2">
          <span>Get Started</span>
          <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </span>
    </button>
  );
};


export default ButtonWrapper;