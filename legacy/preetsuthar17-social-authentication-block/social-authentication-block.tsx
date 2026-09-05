"use client";

import { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Separator } from "./separator";
import {
Card,
CardContent,
CardDescription,
CardHeader,
CardTitle,
} from "./card";
import {
Github,
Mail as Google,
Facebook,
Twitter,
Eye,
EyeOff,
} from "lucide-react";
import Link from "next/link";

type Provider = "google" | "github" | "facebook" | "twitter";

interface AuthWithSocialProps {
mode?: "signin" | "signup";
redirectTo?: string;
}

interface FormData {
email: string;
password: string;
confirmPassword?: string;
fullName?: string;
}

interface FormErrors {
email?: string;
password?: string;
confirmPassword?: string;
fullName?: string;
general?: string;
}

const AuthWithSocialBlock = ({
mode = "signin",
redirectTo = "/dashboard",
}: AuthWithSocialProps)  => {
const [formData, setFormData] = useState<FormData>({
  email: "",
  password: "",
  confirmPassword: "",
  fullName: "",
});
const [errors, setErrors] = useState<FormErrors>({});
const [isLoading, setIsLoading] = useState(false);
const [loadingProvider, setLoadingProvider] = useState<Provider | null>(null);
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

const providers = [
  {
    id: "google" as Provider,
    name: "Google",
    icon: <Google className="h-4 w-4" />,
  },
  {
    id: "github" as Provider,
    name: "GitHub",
    icon: <Github className="h-4 w-4" />,
  },
  {
    id: "facebook" as Provider,
    name: "Facebook",
    icon: <Facebook className="h-4 w-4" />,
  },
  {
    id: "twitter" as Provider,
    name: "Twitter",
    icon: <Twitter className="h-4 w-4" />,
  },
];

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));

  if (errors[name as keyof FormErrors]) {
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }
};

const validateForm = (): boolean => {
  const newErrors: FormErrors = {};

  if (!formData.email) {
    newErrors.email = "Email is required";
  } else if (!/^[^s@]+@[^s@]+.[^s@]+$/.test(formData.email)) {
    newErrors.email = "Please enter a valid email address";
  }

  if (!formData.password) {
    newErrors.password = "Password is required";
  } else if (formData.password.length < 6) {
    newErrors.password = "Password must be at least 6 characters";
  }

  if (mode === "signup") {
    if (!formData.fullName) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  setIsLoading(true);
  setErrors({});

  try {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    alert(
      `Demo: ${mode === "signup" ? "Account created" : "Signed in"} successfully!`
    );
  } catch (error) {
    setErrors({ general: "An unexpected error occurred. Please try again." });
  } finally {
    setIsLoading(false);
  }
};

const handleSocialAuth = async (provider: Provider) => {
  setLoadingProvider(provider);
  setErrors({});

  try {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    alert(
      `Demo: Would ${
        mode === "signup" ? "sign up" : "sign in"
      } with ${provider}`
    );
  } catch (error) {
    setErrors({ general: "An unexpected error occurred. Please try again." });
  } finally {
    setLoadingProvider(null);
  }
};

return (
  <Card className="w-full max-w-md mx-auto flex flex-col gap-6">
    <CardHeader className="text-center">
      <CardTitle className="text-2xl font-bold">
        {mode === "signup" ? "Create your account" : "Welcome back!"}
      </CardTitle>
      <CardDescription>
        {mode === "signup"
          ? "Sign up to get started with your account."
          : "Sign in to your account to continue."}
      </CardDescription>
    </CardHeader>

    <CardContent className="flex flex-col gap-6">
      {errors.general && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {errors.general}
        </div>
      )}

      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          {providers.map((provider) => (
            <Button
              key={provider.id}
              variant="outline"
              
              loading={loadingProvider === provider.id}
              disabled={loadingProvider !== null || isLoading}
              onClick={() => handleSocialAuth(provider.id)}
            >
              {loadingProvider === provider.id ? "..." : provider.icon}
            </Button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          {mode === "signup" && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleInputChange}
                disabled={isLoading}
                className={errors.fullName ? "border-red-500" : ""}
              />
              {errors.fullName && (
                <p className="text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isLoading}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
                className={errors.password ? "border-red-500 pr-10" : "pr-10"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password}</p>
            )}
            {mode === "signin" && (
              <div className="flex justify-end">
                <Link
                  href="#"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            )}
          </div>

          {mode === "signup" && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={
                    errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <Button
            type="submit"
            
            className="w-full"
            loading={isLoading}
            disabled={isLoading || loadingProvider !== null}
          >
            {isLoading
              ? mode === "signup"
                ? "Creating account..."
                : "Signing in..."
              : mode === "signup"
              ? "Create Account"
              : "Sign In"}
          </Button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {mode === "signup" ? (
                <>
                  Already have an account?{" "}
                  <Link
                    href="/auth/signin"
                    className="text-primary hover:underline font-medium"
                  >
                    Sign in
                  </Link>
                </>
              ) : (
                <>
                  Don't have an account?{" "}
                  <Link
                    href="/auth/signup"
                    className="text-primary hover:underline font-medium"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </p>
          </div>
        </div>
      </form>
    </CardContent>
  </Card>
);
}

export default AuthWithSocialBlock;