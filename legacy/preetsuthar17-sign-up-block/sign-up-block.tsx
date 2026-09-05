"use client";

import { Label } from "./label";
import { Input } from "./input";
import { Button } from "./button";
import {
Card,
CardContent,
CardDescription,
CardHeader,
CardFooter,
CardTitle,
} from "./card";
import { Checkbox } from "./checkbox";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import Link from "next/link";

interface SignUpFormData {
firstName: string;
lastName: string;
email: string;
password: string;
confirmPassword: string;
acceptTerms: boolean;
}

interface FormErrors {
firstName?: string;
lastName?: string;
email?: string;
password?: string;
confirmPassword?: string;
acceptTerms?: string;
general?: string;
}

const SignUpBlock = () => {
const [formData, setFormData] = useState<SignUpFormData>({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  acceptTerms: false,
});
const [errors, setErrors] = useState<FormErrors>({});
const [isLoading, setIsLoading] = useState(false);
const [isSuccess, setIsSuccess] = useState(false);
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

const validateForm = (): boolean => {
  const newErrors: FormErrors = {};

  if (!formData.firstName.trim()) {
    newErrors.firstName = "First name is required";
  }

  if (!formData.lastName.trim()) {
    newErrors.lastName = "Last name is required";
  }

  if (!formData.email.trim()) {
    newErrors.email = "Email is required";
  } else if (!/^[^s@]+@[^s@]+.[^s@]+$/.test(formData.email)) {
    newErrors.email = "Please enter a valid email address";
  }

  if (!formData.password) {
    newErrors.password = "Password is required";
  } else if (formData.password.length < 8) {
    newErrors.password = "Password must be at least 8 characters";
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*d)/.test(formData.password)) {
    newErrors.password =
      "Password must contain uppercase, lowercase, and number";
  }

  if (!formData.confirmPassword) {
    newErrors.confirmPassword = "Please confirm your password";
  } else if (formData.password !== formData.confirmPassword) {
    newErrors.confirmPassword = "Passwords don't match";
  }

  if (!formData.acceptTerms) {
    newErrors.acceptTerms = "You must accept the terms and conditions";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleInputChange = (
  field: keyof SignUpFormData,
  value: string | boolean
) => {
  setFormData((prev) => ({
    ...prev,
    [field]: value,
  }));

  if (errors[field]) {
    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));
  }
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  setIsLoading(true);
  setErrors({});

  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSuccess(true);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    });
  } catch (error) {
    setErrors({
      general: "An unexpected error occurred. Please try again.",
    });
  } finally {
    setIsLoading(false);
  }
};

if (isSuccess) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-green-600">
          Account Created Successfully!
        </CardTitle>
        <CardDescription>
          Please check your email to verify your account before signing in.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Button
          
          onClick={() => setIsSuccess(false)}
          variant="outline"
          className="w-full"
        >
          Sign Up Another Account
        </Button>
      </CardContent>
    </Card>
  );
}

return (
  <Card className="w-full max-w-sm mx-auto flex flex-col gap-6">
    <CardHeader className="text-center">
      <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
      <CardDescription>
        Enter your information to create a new account
      </CardDescription>
    </CardHeader>

    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <CardContent className="flex flex-col gap-4">
        {errors.general && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            {errors.general}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              
              id="firstName"
              type="text"
              placeholder="John"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              error={!!errors.firstName}
              leftIcon={<User className="h-4 w-4" />}
              disabled={isLoading}
            />
            {errors.firstName && (
              <p className="text-sm text-red-600">{errors.firstName}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              
              id="lastName"
              type="text"
              placeholder="Doe"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              error={!!errors.lastName}
              leftIcon={<User className="h-4 w-4" />}
              disabled={isLoading}
            />
            {errors.lastName && (
              <p className="text-sm text-red-600">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            
            id="email"
            type="email"
            placeholder="john.doe@example.com"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            error={!!errors.email}
            leftIcon={<Mail className="h-4 w-4" />}
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a strong password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            error={!!errors.password}
            leftIcon={<Lock className="h-4 w-4" />}
            disabled={isLoading}
          />
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) =>
              handleInputChange("confirmPassword", e.target.value)
            }
            error={!!errors.confirmPassword}
            leftIcon={<Lock className="h-4 w-4" />}
            disabled={isLoading}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-600">{errors.confirmPassword}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Checkbox
            id="acceptTerms"
            label="I agree to the Terms and Conditions and Privacy Policy"
            checked={formData.acceptTerms}
            onCheckedChange={(checked) =>
              handleInputChange("acceptTerms", checked === true)
            }
            error={errors.acceptTerms}
          />
        </div>
      </CardContent>

      <CardFooter className="flex flex-col flex flex-col gap-4">
        <Button
          
          type="submit"
          className="w-full"
          loading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="#"
              className="text-foreground decoration-0 no-underline font-normal"
            >
              Sign In
            </Link>
          </p>
        </div>
      </CardFooter>
    </form>
  </Card>
);
}

export default SignUpBlock;