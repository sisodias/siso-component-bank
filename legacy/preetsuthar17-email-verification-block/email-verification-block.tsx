"use client";

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
import { Mail, CheckCircle, ArrowLeft } from "lucide-react";

const EmailVerificationBlock = () => {
const [isResending, setIsResending] = useState(false);
const [resendSuccess, setResendSuccess] = useState(false);
const [isVerified, setIsVerified] = useState(false);

const userEmail = "user@example.com";

const handleResendEmail = async () => {
  setIsResending(true);
  setResendSuccess(false);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  setResendSuccess(true);
  setIsResending(false);
  setTimeout(() => setResendSuccess(false), 3000);
};

const handleCheckVerification = async () => {
  setIsVerified(true);
};

if (isVerified) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center flex flex-col gap-4">
        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <CardTitle className="text-xl font-semibold text-green-600">
          Email Verified!
        </CardTitle>
      </CardHeader>

      <CardFooter className="pt-6">
        <Button className="w-full" >
          Continue
        </Button>
      </CardFooter>
    </Card>
  );
}

return (
  <Card className="w-full max-w-md  mx-auto flex flex-col gap-6">
    <CardHeader className="text-center flex flex-col gap-4">
      <div className="flex justify-center">
        <div className="p-3 bg-blue-50 rounded-full">
          <Mail className="h-8 w-8 text-blue-600" />
        </div>
      </div>
      <CardTitle className="text-xl font-semibold">
        Check Your Email
      </CardTitle>
      <CardDescription className="flex flex-col gap-2 text-sm">
        We have sent a verification email to your address.
        <br />
        <span className="font-medium text-foreground">
          {userEmail}
        </span>
      </CardDescription>
    </CardHeader>

    <CardContent className="flex flex-col gap-4">
      {resendSuccess && (
        <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg text-center">
          Email sent successfully!
        </div>
      )}

      <div className="text-center text-sm text-muted-foreground">
        <button
          onClick={handleResendEmail}
          disabled={isResending}
          className="text-primary hover:underline disabled:opacity-50 font-medium"
        >
          {isResending ? "Sending..." : "Resend email"}
        </button>
      </div>
    </CardContent>

    <CardFooter className="flex flex-col flex flex-col gap-4">
      <Button onClick={handleCheckVerification} className="w-full" >
        I've verified my email
      </Button>

      <Button
        variant={"ghost"}
        
        className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Sign In
      </Button>
    </CardFooter>
  </Card>
);
}

export default EmailVerificationBlock;