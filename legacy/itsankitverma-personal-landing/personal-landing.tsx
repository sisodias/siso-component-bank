import React, { useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import {
  Github,
  Video,
  Youtube,
} from "lucide-react";


const HeroSection: React.FC = () => {
  return (
    <section className="w-full flex flex-col items-center text-center gap-6">
      <div className="relative mb-2">
        <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-pink-500 via-red-500 to-orange-400 opacity-60 blur-lg animate-glow" />
        <img
          src="https://api.dicebear.com/8.x/lorelei-neutral/svg?seed=John"
          alt="avatar"
          className="relative size-32 rounded-full border-4 border-zinc-800 shadow-xl z-10"
        />
      </div>
      <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight font-geist drop-shadow-lg">
        Hi, I'm Ankit
      </h1>
      <p className="text-xl md:text-2xl text-zinc-300 max-w-lg mx-auto font-inter font-normal">
        I craft beautiful, performant web experiences with React, TypeScript, and modern UI frameworks.
      </p>
    </section>
  );
};

interface SocialLink {
  href: string;
  label: string;
  icon: React.ReactNode;
  bg: string;
  text: string;
}

const socialLinks: SocialLink[] = [
  {
    href: '#',
    label: 'YouTube',
    icon: <Youtube size={28} />,
    bg: 'bg-red-500',
    text: 'text-white',
  },
  {
    href: '#',
    label: 'GitHub',
    icon: <Github size={28} />,
    bg: 'bg-zinc-800',
    text: 'text-white',
  },
  {
    href: '#',
    label: 'Self Intro',
    icon: <Video size={28} />,
    bg: 'bg-zinc-50',
    text: 'text-zinc-900',
  },
];

const SocialsBlock: React.FC = () => (
  <div className="flex flex-wrap justify-center gap-4 w-full font-inter">
    {socialLinks.map((link) => (
      <a
        key={link.label}
        href={link.href}
        aria-label={link.label}
        className={twMerge(
          'flex items-center gap-2 rounded-full border border-zinc-800 px-7 py-3 text-base font-semibold shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl hover:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-opacity-80',
          link.bg,
          link.text,
        )}
        style={{ minWidth: 140, minHeight: 56 }}
        tabIndex={0}
      >
        {link.icon}
        <span>{link.label}</span>
      </a>
    ))}
  </div>
);

const AboutBlock = () => (
  <div className="w-full rounded-2xl border border-zinc-800 bg-zinc-950/80 p-7 shadow-lg text-center font-inter">
    <p className="text-lg md:text-xl text-zinc-200 font-normal">
      Passionate about building elegant, accessible, and high-performance web apps.<br />Always learning, always sharing.
    </p>
  </div>
);

const ConnectSection: React.FC = () => {
  const [message, setMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const validateMessage = (msg: string) => {
    if (!msg.trim()) return "Message cannot be empty.";
    if (msg.trim().length < 3) return "Message must be at least 3 characters.";
    if (msg.length > 200) return "Message cannot exceed 200 characters.";
    return "";
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateMessage(message);
    if (validationError) {
      setError(validationError);
      return;
    }
    setShowToast(true);
    setMessage("");
    setError("");
    if (inputRef.current) inputRef.current.blur();
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    if (error) setError("");
  };

  return (
    <section className="w-full flex flex-col items-center text-center gap-4 mt-8 font-inter relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-6 right-6 z-50 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg font-semibold text-base animate-fade-in">
          Message sent!
        </div>
      )}
      <p className="text-lg text-zinc-400 mb-4 max-w-md mx-auto font-normal">
        Interested in collaborating, chatting about tech, or just saying hi? Send me a message below!
      </p>
      <form onSubmit={handleSend} className="flex w-full max-w-md gap-2 items-center justify-center">
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={handleInputChange}
          placeholder="Type your message..."
          className={twMerge(
            "flex-1 rounded-full border px-5 py-3 text-base text-zinc-100 placeholder-zinc-500 transition-colors focus:outline-none shadow font-inter",
            error ? "border-red-500 focus:border-red-500" : "border-zinc-700 bg-zinc-900 focus:border-pink-400"
          )}
          maxLength={201}
        />
        <button
          type="submit"
          className={twMerge(
            "inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-500 via-pink-500 to-orange-400 px-7 py-3 text-base font-semibold text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all",
            message.trim() ? "hover:scale-105 hover:shadow-xl cursor-pointer opacity-100" : "opacity-50 cursor-not-allowed"
          )}
          disabled={!message.trim()}
          aria-disabled={!message.trim()}
        >
          Send
        </button>
      </form>
      {error && (
        <div className="text-red-500 text-sm mt-1 font-medium">{error}</div>
      )}
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};

export const PersonalLanding = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 px-4 py-16 text-zinc-50 font-inter relative overflow-hidden">
    {/* Animated background blob */}
    <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-gradient-to-tr from-pink-500 via-red-500 to-orange-400 opacity-20 rounded-full blur-3xl animate-pulse-slow z-0" />
    <div className="w-full max-w-2xl flex flex-col items-center gap-12 z-10">
      <HeroSection />
      <AboutBlock />
      <SocialsBlock />
      <ConnectSection />
    </div>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap');
      .font-inter { font-family: 'Inter', 'Geist', system-ui, sans-serif; }
      .font-geist { font-family: 'Geist', 'Inter', system-ui, sans-serif; }
    `}</style>
  </div>
  );
};
