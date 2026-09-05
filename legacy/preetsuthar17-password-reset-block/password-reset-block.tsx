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
import { useState } from "react";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";

interface PasswordResetFormData {
email: string;
}

interface FormErrors {
email?: string;
general?: string;
}

const PasswordResetBlock = ()  =>{      
const [formData, setFormData] = useState<PasswordResetFormData>({
  email: "",
});
const [errors, setErrors] = useState<FormErrors>({});
const [isLoading, setIsLoading] = useState(false);
const [isSuccess, setIsSuccess] = useState(false);

// Validate form data
const validateForm = (): boolean => {
  const newErrors: FormErrors = {};

  if (!formData.email.trim()) {
    newErrors.email = "Email is required";
  } else if (!/^[^s@]+@[^s@]+.[^s@]+$/.test(formData.email)) {
    newErrors.email = "Please enter a valid email address";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

// Handle input changes
const handleInputChange = (
  field: keyof PasswordResetFormData,
  value: string
) => {
  setFormData((prev) => ({
    ...prev,
    [field]: value,
  }));

  // Clear specific field error when user starts typing
  if (errors[field]) {
    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));
  }
};

// Handle form submission
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  setIsLoading(true);
  setErrors({});

  // Simulate API call
  setTimeout(() => {
    setIsSuccess(true);
    setIsLoading(false);
  }, 2000);
};

if (isSuccess) {
  return (
    <Card className="w-full max-w-mmx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <CardTitle className="text-2xl font-bold text-green-600">
          Check Your Email
        </CardTitle>
        <CardDescription>
          We've sent a password reset link to{" "}
          <strong>{formData.email}</strong>
        </CardDescription>
      </CardHeader>

      <CardContent className="text-center">
        <p className="text-sm text-muted-foreground mb-4">
          Click the link in the email to reset your password. If you don't see
          it, check your spam folder.
        </p>
        <Button
          onClick={() => {
            setIsSuccess(false);
            setFormData({ email: "" });
          }}
          variant="outline"
          className="w-full"
        >
          Send Another Reset Link
        </Button>
      </CardContent>

      <CardFooter className="justify-center">
        <Link
          href="#"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Sign In
        </Link>
      </CardFooter>
    </Card>
  );
}

return (
  <Card className="w-full max-w-md mx-auto flex flex-col gap-6">
    <CardHeader className="text-center">
      <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
      <CardDescription>
        Enter your email address and we'll send you a link to reset your
        password
      </CardDescription>
    </CardHeader>

    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <CardContent className="flex flex-col gap-4">
        {errors.general && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            {errors.general}
          </div>
        )}

        <div className="flex flex-col flex flex-col gap-2">
          <Label htmlFor="email">Email Address</Label>
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
      </CardContent>

      <CardFooter className="flex flex-col flex flex-col gap-4">
        <Button
          
          type="submit"
          className="w-full"
          loading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? "Sending Reset Link..." : "Send Reset Link"}
        </Button>

        <Button
          
          variant="ghost"
          className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground w-full"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Sign In
        </Button>
      </CardFooter>
    </form>
  </Card>
);
}

export default PasswordResetBlock;