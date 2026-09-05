"use client";

import * as React from "react";
import { Mail, Loader2, CheckCircle, LucideIcon } from "lucide-react";
import { cn } from "../_utils/cn";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Checkbox } from "./checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./dialog";

export interface NewsletterSignupProps {
  // Required props for controlled form
  email: string;
  onEmailChange: (value: string) => void;
  firstName: string;
  onFirstNameChange: (value: string) => void;
  lastName: string;
  onLastNameChange: (value: string) => void;
  acceptTerms: boolean;
  onAcceptTermsChange: (value: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  
  // State props
  isLoading?: boolean;
  error?: {
    field?: string;
    message: string;
  } | null;
  showSuccessDialog?: boolean;
  onSuccessClose?: () => void;
  
  // Customizable text content
  title?: string;
  emailLabel?: string;
  emailPlaceholder?: string;
  firstNameLabel?: string;
  firstNamePlaceholder?: string;
  lastNameLabel?: string;
  lastNamePlaceholder?: string;
  termsLabel?: string;
  termsDescription?: string;
  submitButtonText?: string;
  loadingButtonText?: string;
  
  // Success dialog customization
  successTitle?: string;
  successDescription?: string;
  successButtonText?: string;
  successIcon?: LucideIcon;
  
  // Styling customization
  className?: string;
  cardClassName?: string;
  formClassName?: string;
  showEmailIcon?: boolean;
  buttonSize?: "default" | "sm" | "lg" | "icon";
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  
  // Layout options
  nameFieldsLayout?: "stacked" | "inline";
  hideTermsDescription?: boolean;
}

export const NewsletterSignup: React.FC<NewsletterSignupProps> = ({
  // Required props
  email,
  onEmailChange,
  firstName,
  onFirstNameChange,
  lastName,
  onLastNameChange,
  acceptTerms,
  onAcceptTermsChange,
  onSubmit,
  
  // State props
  isLoading = false,
  error,
  showSuccessDialog = false,
  onSuccessClose,
  
  // Text content with defaults
  title = "Newsletter Signup",
  emailLabel = "Email",
  emailPlaceholder = "name@example.com",
  firstNameLabel = "First Name",
  firstNamePlaceholder = "John",
  lastNameLabel = "Last Name",
  lastNamePlaceholder = "Doe",
  termsLabel = "Accept terms and conditions",
  termsDescription = "You agree to our Terms of Service and Privacy Policy.",
  submitButtonText = "Subscribe",
  loadingButtonText = "Subscribing...",
  
  // Success dialog customization
  successTitle = "Welcome Aboard!",
  successDescription = "You've been successfully subscribed to our newsletter. Check your email for a confirmation message.",
  successButtonText = "Got it",
  successIcon: SuccessIcon = CheckCircle,
  
  // Styling customization
  className,
  cardClassName,
  formClassName,
  showEmailIcon = true,
  buttonSize = "lg",
  buttonVariant = "default",
  
  // Layout options
  nameFieldsLayout = "inline",
  hideTermsDescription = false,
}) => {
  const nameFieldsClass = nameFieldsLayout === "inline" 
    ? "grid grid-cols-2 gap-4" 
    : "space-y-4";

  return (
    <>
      <Card className={cn("w-full max-w-lg", className, cardClassName)}>
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        </CardHeader>
        <CardContent className="pb-6">
          <form onSubmit={onSubmit} className={cn("space-y-4", formClassName)}>
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">{emailLabel}</Label>
              <div className="relative">
                {showEmailIcon && (
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                )}
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => onEmailChange(e.target.value)}
                  placeholder={emailPlaceholder}
                  disabled={isLoading}
                  required
                  className={cn(
                    showEmailIcon && "pl-10",
                    error?.field === "email" && "border-destructive"
                  )}
                />
              </div>
              {error?.field === "email" && (
                <p className="text-sm text-destructive">{error.message}</p>
              )}
            </div>

            {/* Name Fields */}
            <div className={nameFieldsClass}>
              <div className="space-y-2">
                <Label htmlFor="firstName">{firstNameLabel}</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => onFirstNameChange(e.target.value)}
                  placeholder={firstNamePlaceholder}
                  disabled={isLoading}
                  required
                  className={cn(
                    error?.field === "firstName" && "border-destructive"
                  )}
                />
                {error?.field === "firstName" && (
                  <p className="text-sm text-destructive">{error.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">{lastNameLabel}</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => onLastNameChange(e.target.value)}
                  placeholder={lastNamePlaceholder}
                  disabled={isLoading}
                  required
                  className={cn(
                    error?.field === "lastName" && "border-destructive"
                  )}
                />
                {error?.field === "lastName" && (
                  <p className="text-sm text-destructive">{error.message}</p>
                )}
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={onAcceptTermsChange}
                  disabled={isLoading}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="terms"
                    className="text-sm font-normal cursor-pointer"
                  >
                    {termsLabel}
                  </Label>
                  {!hideTermsDescription && (
                    <p className="text-sm text-muted-foreground">
                      {termsDescription}
                    </p>
                  )}
                </div>
              </div>
              {error?.field === "acceptTerms" && (
                <p className="text-sm text-destructive">{error.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || !acceptTerms}
              className="w-full"
              size={buttonSize}
              variant={buttonVariant}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? loadingButtonText : submitButtonText}
            </Button>

            {/* General Error */}
            {error && !error.field && (
              <p className="text-sm text-destructive text-center">
                {error.message}
              </p>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Success Dialog */}
      {onSuccessClose && (
        <Dialog open={showSuccessDialog} onOpenChange={onSuccessClose}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="flex items-center space-x-2">
                <SuccessIcon className="h-6 w-6 text-green-500" />
                <DialogTitle className="text-xl">{successTitle}</DialogTitle>
              </div>
              <DialogDescription className="pt-2">
                {successDescription}
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end pt-4">
              <Button onClick={onSuccessClose}>{successButtonText}</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default NewsletterSignup;