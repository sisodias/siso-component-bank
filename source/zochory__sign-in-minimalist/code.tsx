import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Github,
  Linkedin,
  Twitter,
  Youtube,
  Sun,
  Moon,
  Loader2,
} from "lucide-react";

// --- Hero Component ---

interface HeroProps {
  isDarkMode: boolean;
}

function Hero({ isDarkMode }: HeroProps) {
  return (
    <div className="flex flex-col items-center relative shrink-0 w-full">
      {/* Logo Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="content-stretch flex flex-col items-center justify-center max-w-[160.73px] overflow-clip pb-[16px] relative shrink-0 w-[32px]"
      >
        <div className="content-stretch flex flex-col items-center justify-center overflow-clip px-0 py-[0.64px] relative shrink-0 size-[32px]">
          <div className="h-[31px] overflow-clip relative shrink-0 w-[32px]">
            <div className="absolute inset-0">
              <img
                src="https://imagedelivery.net/X8-iu39scv5xvBSFZpKX-A/b145b15f-d0d2-4900-bb6b-ddb624a19000/public"
                alt="Logo"
                className={`size-full object-contain transition-all duration-300 ${!isDarkMode ? "invert" : ""}`}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Text Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          delay: 0.2,
          ease: "easeOut",
        }}
        className="content-stretch flex items-center relative shrink-0 w-full"
      >
        <div className="basis-0 grow min-h-px min-w-px relative shrink-0">
          <div className="flex flex-col items-center size-full">
            <div className="content-stretch flex flex-col items-center px-[19.45px] py-0 relative w-full">
              <div className="flex flex-col h-[90px] w-[434px] items-center justify-center text-center font-['Inter_Variable',sans-serif] text-[36px] font-semibold leading-[45px] tracking-[-0.003px] text-[#808080] relative shrink-0">
                <p className="mb-0 transition-colors duration-300">
                  Reason under uncertainty.
                </p>
                <p className={`transition-colors duration-300 ${isDarkMode ? "text-white" : "text-black"}`}>
                  Act with confidence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// --- AuthButtons Component ---

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  variant: "google" | "guest";
  icon?: React.ReactNode;
  isDarkMode: boolean;
}

function AuthButton({
  onClick,
  children,
  className,
  variant,
  icon,
  isDarkMode,
}: ButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isLoading) return;
    setIsLoading(true);
    if (onClick) onClick();
    // Simulate network request
    setTimeout(() => setIsLoading(false), 2000);
  };

  const baseStyles =
    "group relative rounded-[20.639px] flex items-center justify-center transition-colors duration-200 ease-out cursor-pointer overflow-hidden";
  
  const getVariantStyles = () => {
    if (variant === "google") {
      return isDarkMode 
        ? "bg-[#f6f6f6]/85 hover:bg-[#f6f6f6] text-black/85" 
        : "bg-[#242424] hover:bg-black/90 text-white";
    }
    // guest
    return isDarkMode
      ? "bg-white/10 hover:bg-white/20 text-white"
      : "bg-black/10 hover:bg-black/20 text-black";
  };

  return (
    <motion.button
      onClick={handleClick}
      whileHover={!isLoading ? { scale: 1.02 } : undefined}
      whileTap={!isLoading ? { scale: 0.98 } : undefined}
      initial={false}
      animate={{ 
        width: isLoading ? "46px" : "100%", // Match height
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`${baseStyles} ${getVariantStyles()} ${className} h-[46px]`}
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <Loader2 className="size-5 animate-spin" />
          </motion.div>
        ) : (
          <motion.div
             key="content"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             transition={{ duration: 0.2 }}
             className="flex items-center justify-center gap-3 px-[34px] w-full"
          >
            {icon}
            <span className="text-[14px] font-medium tracking-[-0.003px] whitespace-nowrap font-sans">
              {children}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

interface AuthButtonsProps {
  isDarkMode: boolean;
}

function AuthButtons({ isDarkMode }: AuthButtonsProps) {
  const handleGoogleLogin = () => {
    console.log("Google login clicked");
  };

  const handleGuestLogin = () => {
    console.log("Guest login clicked");
  };

  return (
    <div className="w-[364px] flex flex-col items-center gap-8">
      {/* Buttons Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="w-full flex flex-col items-center gap-[16px]"
      >
        <AuthButton
          variant="google"
          onClick={handleGoogleLogin}
          isDarkMode={isDarkMode}
          icon={
            <div className="relative shrink-0 size-[18px]">
              <svg
                className="block size-full"
                viewBox="0 0 24 24"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            </div>
          }
        >
          Continue with Google
        </AuthButton>

        <AuthButton variant="guest" onClick={handleGuestLogin} isDarkMode={isDarkMode}>
          Continue as Guest
        </AuthButton>
      </motion.div>

      {/* Legal Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className={`flex flex-col items-center gap-4 w-[357px] font-normal tracking-[-0.003px] transition-colors duration-300 ${isDarkMode ? "text-[#e6e6e6]" : "text-gray-500"}`}
      >
        <div className="text-[12px] text-center leading-[18px]">
          <p>
            By clicking “Continue with Google”, you acknowledge
            that you have read and understood, and agree to
            Qredence's terms
          </p>
        </div>

        <div className="flex gap-3 text-[11px] underline decoration-solid underline-offset-2 cursor-pointer opacity-80 hover:opacity-100 transition-opacity">
          <p>Terms & Conditions</p>
          <p>Privacy Policy</p>
        </div>
      </motion.div>
    </div>
  );
}

// --- SocialFooter Component ---

type SocialLinkProps = {
  href?: string;
  label: string;
  children: React.ReactNode;
  delay?: number;
  isDarkMode: boolean;
};

function SocialLink({
  href = "#",
  children,
  delay = 0,
  isDarkMode
}: SocialLinkProps) {
  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      whileHover={{ scale: 1.2, opacity: 0.8 }}
      className={`flex flex-col items-center justify-center relative shrink-0 size-[28px] cursor-pointer transition-colors duration-300 ${isDarkMode ? "text-white" : "text-black/70 hover:text-black"}`}
    >
      {children}
    </motion.a>
  );
}

interface SocialFooterProps {
  isDarkMode: boolean;
}

function SocialFooter({ isDarkMode }: SocialFooterProps) {
  return (
    <div className="flex gap-[8px] h-[28px] items-center justify-center relative">
      {/* LinkedIn */}
      <SocialLink label="LinkedIn" delay={0.4} isDarkMode={isDarkMode}>
        <Linkedin
          className="size-5"
          fill="currentColor"
          strokeWidth={0}
        />
      </SocialLink>

      {/* X / Twitter */}
      <SocialLink label="X" delay={0.45} isDarkMode={isDarkMode}>
        <Twitter
          className="size-5"
          fill="currentColor"
          strokeWidth={0}
        />
      </SocialLink>

      {/* GitHub */}
      <SocialLink label="GitHub" delay={0.5} isDarkMode={isDarkMode}>
        <Github
          className="size-5"
          fill="currentColor"
          strokeWidth={0}
        />
      </SocialLink>

      {/* YouTube */}
      <SocialLink label="YouTube" delay={0.55} isDarkMode={isDarkMode}>
        <Youtube
          className="size-5"
          fill="currentColor"
          strokeWidth={0}
        />
      </SocialLink>

      {/* TikTok - Fallback to SVG as it's not in standard Lucide set */}
      <SocialLink label="TikTok" delay={0.6} isDarkMode={isDarkMode}>
        <div className="size-[20px] p-[2px]">
          <svg
            className="block size-full"
            fill="none"
            viewBox="0 0 28 28"
          >
            <path
              d="M19.1546 8.97245C18.2464 8.38137 17.5915 7.43521 17.3868 6.33284C17.3429 6.09472 17.3184 5.84942 17.3184 5.59863H14.4204L14.4157 17.1957C14.3671 18.4944 13.2966 19.5368 11.9846 19.5368C11.5766 19.5368 11.1927 19.435 10.8544 19.2573C10.079 18.8499 9.54834 18.0384 9.54834 17.1045C9.54834 15.7632 10.6413 14.6718 11.9842 14.6718C12.2349 14.6718 12.4755 14.7131 12.7029 14.7841V11.8299C12.4674 11.7978 12.2281 11.778 11.9842 11.778C9.04308 11.778 6.65039 14.1672 6.65039 17.1045C6.65039 18.9064 7.55183 20.5011 8.92765 21.4654C9.794 22.073 10.8481 22.4306 11.9846 22.4306C14.9257 22.4306 17.3184 20.0413 17.3184 17.1045V11.2236C18.4549 12.0381 19.8476 12.5181 21.3503 12.5181V9.62433C20.541 9.62433 19.7871 9.3841 19.1546 8.97245Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </SocialLink>
    </div>
  );
}

// --- Main Component ---

export function SignInSingleFile() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <div 
      className={`relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden font-sans transition-colors duration-500 ${
        isDarkMode ? "bg-[#242424]" : "bg-white"
      }`}
    >
      {/* Theme Toggle */}
      <button 
        onClick={() => setIsDarkMode(!isDarkMode)}
        className={`absolute top-6 right-6 p-2 rounded-full transition-colors z-20 ${
          isDarkMode 
            ? "bg-white/10 text-white hover:bg-white/20" 
            : "bg-black/5 text-black hover:bg-black/10"
        }`}
        aria-label="Toggle theme"
      >
        {isDarkMode ? <Sun className="size-5" /> : <Moon className="size-5" />}
      </button>

      <div className="flex flex-col items-center p-[48px] z-10">
        <Hero isDarkMode={isDarkMode} />
        <div className="pt-[24px] flex flex-col items-center">
          <AuthButtons isDarkMode={isDarkMode} />
        </div>
      </div>

      <div className="absolute bottom-[37px] left-1/2 -translate-x-1/2 z-10">
        <SocialFooter isDarkMode={isDarkMode} />
      </div>
    </div>
  );
}
