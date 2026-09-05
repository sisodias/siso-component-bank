'use client';
import React, { useState, useRef, useEffect } from 'react';
import { EyeOpenIcon, EyeClosedIcon, EnvelopeClosedIcon, LockClosedIcon, GitHubLogoIcon, TwitterLogoIcon, BackpackIcon, DiscordLogoIcon } from '@radix-ui/react-icons';

interface LoginFormProps {
    onSubmit: (email: string, password: string, remember: boolean) => void;
}

interface VideoBackgroundProps {
    videoUrl: string;
}

interface FormInputProps {
    icon: React.ReactNode;
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
}

interface SocialButtonProps {
    icon: React.ReactNode;
    name: string;
}

interface ToggleSwitchProps {
    checked: boolean;
    onChange: () => void;
    id: string;
}

const FormInput: React.FC<FormInputProps> = ({ icon, type, placeholder, value, onChange, required }) => {
    return (
        <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-black/60 dark:text-white/60">
                {icon}
            </div>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full pl-10 pr-3 py-2 bg-transparent border border-black/10 dark:border-white/20 rounded-lg text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 focus:outline-none focus:border-blue-500 transition-colors"
            />
        </div>
    );
};

const SocialButton: React.FC<SocialButtonProps> = ({ icon }) => {
    return (
        <button className="flex items-center justify-center p-2 bg-transparent border border-black/10 dark:border-white/20 rounded-lg text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
            {icon}
        </button>
    );
};




const VideoBackground: React.FC<VideoBackgroundProps> = ({ videoUrl }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(error => {
                console.error("Video autoplay failed:", error);
            });
        }
    }, []);

    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
            <div className="absolute inset-0 bg-black/30 z-10" />
            <video
                ref={videoRef}
                className="absolute inset-0 min-w-full min-h-full object-cover w-auto h-auto"
                autoPlay
                loop
                muted
                playsInline
            >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSuccess(true);
        await new Promise(resolve => setTimeout(resolve, 500));

        onSubmit(email, password, remember);
        setIsSubmitting(false);
        setIsSuccess(false);
    };

    return (
        <div className="p-8 rounded-2xl bg-white/30 backdrop-blur-lg border border-white/40 shadow-2xl max-w-md w-full animate-floating-card"
            style={{
                boxShadow: '0 8px 32px 0 rgba(255,255,255,0.18), 0 16px 48px 0 rgba(0,0,0,0.25)',
                transform: 'translateY(-24px) rotateY(8deg) scale(1.03)',
                perspective: '1200px',
                transition: 'transform 0.4s cubic-bezier(.25,.8,.25,1), box-shadow 0.4s cubic-bezier(.25,.8,.25,1)',
            }}
        >
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-extrabold mb-2 text-white tracking-tight">Welcome Back</h2>
                <p className="text-white/80 text-base mb-2">Sign in to continue your journey</p>
              
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <FormInput
                    icon={<EnvelopeClosedIcon width={18} height={18} />}
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <div className="relative">
                    <FormInput
                        icon={<LockClosedIcon width={18} height={18} />}
                        type={showPassword ? "text" : "password"}
                        placeholder="Your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white focus:outline-none transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? <EyeClosedIcon width={18} height={18} /> : <EyeOpenIcon width={18} height={18} />}
                    </button>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">

                    </div>
                    <a href="#" className="text-sm text-white/80 hover:text-white transition-colors">
                        Forgot password?
                    </a>
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-lg bg-white/80 text-black font-semibold transition-all duration-200 ease-in-out hover:bg-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed shadow-none"
                >
                    {isSubmitting ? 'Signing in...' : 'Access Portal'}
                </button>
            </form>
            <div className="mt-8">
                <div className="relative flex items-center justify-center">
                   
                    <div className="bg-transparent px-4 relative text-white/60 text-sm">
                        Continue with your favorite app
                    </div>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-3">
                    <SocialButton icon={<GitHubLogoIcon width={18} height={18} />} name="GitHub" />
                    <SocialButton icon={<DiscordLogoIcon width={18} height={18} />} name="Discord" />
                    <SocialButton icon={<GoogleIcon width={18} height={18} />} name="Google" />
                </div>
            </div>
            <p className="mt-8 text-center text-sm text-white/60">
                New here?{' '}
                <a href="#" className="font-medium text-white underline underline-offset-2 hover:text-white transition-colors">
                    Create your account
                </a>
            </p>
        </div>
    );
};

// Add GoogleIcon as a minimal SVG inline for the SocialButton
const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <g>
            <circle cx="12" cy="12" r="12" fill="white"/>
            <path d="M21.805 12.082c0-.638-.057-1.252-.163-1.84H12v3.481h5.509a4.71 4.71 0 0 1-2.044 3.09v2.56h3.305c1.934-1.782 3.035-4.406 3.035-7.291z" fill="#4285F4"/>
            <path d="M12 22c2.7 0 4.963-.89 6.617-2.41l-3.305-2.56c-.917.617-2.09.983-3.312.983-2.547 0-4.705-1.72-5.477-4.03H3.09v2.53A9.997 9.997 0 0 0 12 22z" fill="#34A853"/>
            <path d="M6.523 13.983A5.996 5.996 0 0 1 6.09 12c0-.69.12-1.36.333-1.983V7.487H3.09A9.997 9.997 0 0 0 2 12c0 1.57.377 3.05 1.09 4.513l3.433-2.53z" fill="#FBBC05"/>
            <path d="M12 6.875c1.47 0 2.78.507 3.813 1.5l2.86-2.86C16.963 3.89 14.7 3 12 3A9.997 9.997 0 0 0 3.09 7.487l3.433 2.53C7.295 8.595 9.453 6.875 12 6.875z" fill="#EA4335"/>
        </g>
    </svg>
);


const LoginPage = {
    LoginForm,
    VideoBackground
};

export default LoginPage;