import React, { useState, useRef, useEffect } from 'react';

const OTPInput = ({ 
  length = 6, 
  onComplete = () => {}, 
  onValueChange = () => {},
  disabled = false,
  error = false,
  errorMessage = "",
  className = ""
}) => {
  const [values, setValues] = useState(new Array(length).fill(''));
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  const focusInput = (index) => {
    if (inputRefs.current[index]) {
      inputRefs.current[index].focus();
    }
  };

  const handleChange = (index, value) => {
    if (disabled) return;
    
    const newValue = value.replace(/[^0-9]/g, '').slice(-1);
    
    const newValues = [...values];
    newValues[index] = newValue;
    setValues(newValues);
    onValueChange(newValues.join(''));
    
    if (newValue && index < length - 1) {
      focusInput(index + 1);
    }
    
    if (newValues.every(val => val !== '') && newValues.length === length) {
      onComplete(newValues.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (disabled) return;
    
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newValues = [...values];
      
      if (values[index]) {
        newValues[index] = '';
        setValues(newValues);
        onValueChange(newValues.join(''));
      } else if (index > 0) {
        newValues[index - 1] = '';
        setValues(newValues);
        onValueChange(newValues.join(''));
        focusInput(index - 1);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      focusInput(index - 1);
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      focusInput(index + 1);
    }
  };

  const handlePaste = (e) => {
    if (disabled) return;
    
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').replace(/[^0-9]/g, '');
    const pastedValues = pastedData.slice(0, length).split('');
    
    const newValues = new Array(length).fill('');
    pastedValues.forEach((value, index) => {
      if (index < length) {
        newValues[index] = value;
      }
    });
    
    setValues(newValues);
    onValueChange(newValues.join(''));
    
    const nextEmptyIndex = newValues.findIndex(val => val === '');
    const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : length - 1;
    focusInput(focusIndex);
    
    if (newValues.every(val => val !== '') && newValues.length === length) {
      onComplete(newValues.join(''));
    }
  };

  const handleFocus = (index) => {
    if (inputRefs.current[index]) {
      inputRefs.current[index].select();
    }
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      {values.map((value, index) => (
        <input
          key={index}
          ref={el => inputRefs.current[index] = el}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={value}
          onChange={e => handleChange(index, e.target.value)}
          onKeyDown={e => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={() => handleFocus(index)}
          disabled={disabled}
          className={`
            w-10 h-12 text-center text-lg font-medium rounded-md border
            bg-background text-foreground placeholder-muted-foreground
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background
            disabled:cursor-not-allowed disabled:opacity-50
            ${error 
              ? 'border-destructive focus:border-destructive focus:ring-destructive' 
              : 'border-input hover:border-border focus:border-ring'
            }
          `}
        />
      ))}
    </div>
  );
};

// Professional demo component
const OTPDemo = () => {
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleOTPComplete = (value) => {
    setIsVerifying(true);
    setHasError(false);
    
    setTimeout(() => {
      if (value === '123456') {
        setIsSuccess(true);
        setHasError(false);
      } else {
        setHasError(true);
        setIsSuccess(false);
      }
      setIsVerifying(false);
    }, 1500);
  };

  const handleOTPChange = (value) => {
    setOtp(value);
    setHasError(false);
    setIsSuccess(false);
  };

  const resetDemo = () => {
    setOtp('');
    setIsVerifying(false);
    setHasError(false);
    setIsSuccess(false);
  };

  return (
    <div className={`min-h-screen bg-background text-foreground transition-colors duration-300`}>
      <style jsx global>{`
        :root {
          --background: 0 0% 100%;
          --foreground: 222.2 84% 4.9%;
          --card: 0 0% 100%;
          --card-foreground: 222.2 84% 4.9%;
          --popover: 0 0% 100%;
          --popover-foreground: 222.2 84% 4.9%;
          --primary: 222.2 47.4% 11.2%;
          --primary-foreground: 210 40% 98%;
          --secondary: 210 40% 96%;
          --secondary-foreground: 222.2 47.4% 11.2%;
          --muted: 210 40% 96%;
          --muted-foreground: 215.4 16.3% 46.9%;
          --accent: 210 40% 96%;
          --accent-foreground: 222.2 47.4% 11.2%;
          --destructive: 0 84.2% 60.2%;
          --destructive-foreground: 210 40% 98%;
          --border: 214.3 31.8% 91.4%;
          --input: 214.3 31.8% 91.4%;
          --ring: 222.2 47.4% 11.2%;
          --radius: 0.5rem;
        }
        
        .dark {
          --background: 222.2 84% 4.9%;
          --foreground: 210 40% 98%;
          --card: 222.2 84% 4.9%;
          --card-foreground: 210 40% 98%;
          --popover: 222.2 84% 4.9%;
          --popover-foreground: 210 40% 98%;
          --primary: 210 40% 98%;
          --primary-foreground: 222.2 47.4% 11.2%;
          --secondary: 217.2 32.6% 17.5%;
          --secondary-foreground: 210 40% 98%;
          --muted: 217.2 32.6% 17.5%;
          --muted-foreground: 215 20.2% 65.1%;
          --accent: 217.2 32.6% 17.5%;
          --accent-foreground: 210 40% 98%;
          --destructive: 0 62.8% 30.6%;
          --destructive-foreground: 210 40% 98%;
          --border: 217.2 32.6% 17.5%;
          --input: 217.2 32.6% 17.5%;
          --ring: 212.7 26.8% 83.9%;
        }
        
        * {
          border-color: hsl(var(--border));
        }
        
        body {
          background-color: hsl(var(--background));
          color: hsl(var(--foreground));
        }
        
        .bg-background { background-color: hsl(var(--background)); }
        .text-foreground { color: hsl(var(--foreground)); }
        .bg-card { background-color: hsl(var(--card)); }
        .text-card-foreground { color: hsl(var(--card-foreground)); }
        .bg-muted { background-color: hsl(var(--muted)); }
        .text-muted-foreground { color: hsl(var(--muted-foreground)); }
        .bg-secondary { background-color: hsl(var(--secondary)); }
        .text-secondary-foreground { color: hsl(var(--secondary-foreground)); }
        .border-input { border-color: hsl(var(--input)); }
        .border-border { border-color: hsl(var(--border)); }
        .border-ring { border-color: hsl(var(--ring)); }
        .border-destructive { border-color: hsl(var(--destructive)); }
        .text-destructive { color: hsl(var(--destructive)); }
        .placeholder-muted-foreground::placeholder { color: hsl(var(--muted-foreground)); }
        .focus\\:ring-ring:focus { --tw-ring-color: hsl(var(--ring)); }
        .focus\\:ring-destructive:focus { --tw-ring-color: hsl(var(--destructive)); }
        .focus\\:border-ring:focus { border-color: hsl(var(--ring)); }
        .focus\\:border-destructive:focus { border-color: hsl(var(--destructive)); }
        .focus\\:ring-offset-background:focus { --tw-ring-offset-color: hsl(var(--background)); }
      `}</style>

      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-sm">
          <div className="bg-card rounded-lg border p-6 shadow-sm">
            {/* Header */}
            <div className="space-y-2 text-center mb-6">
              <h1 className="text-xl font-semibold tracking-tight">Verify your account</h1>
              <p className="text-sm text-muted-foreground">
                Enter the 6-digit code sent to your device
              </p>
            </div>

            {/* OTP Input */}
            <div className="space-y-4">
              <div className="flex justify-center">
                <OTPInput
                  length={6}
                  onComplete={handleOTPComplete}
                  onValueChange={handleOTPChange}
                  disabled={isVerifying}
                  error={hasError}
                />
              </div>

              {/* Error Message */}
              {hasError && (
                <div className="text-center">
                  <p className="text-sm text-destructive">
                    Invalid code. Please try again.
                  </p>
                </div>
              )}

              {/* Success Message */}
              {isSuccess && (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    ✓ Verification successful
                  </p>
                </div>
              )}

              {/* Verifying State */}
              {isVerifying && (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Verifying...
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-6 space-y-3">
              <button
                onClick={resetDemo}
                className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2"
              >
                Reset
              </button>
            </div>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-xs text-muted-foreground">
                Didn't receive a code?{' '}
                <button className="underline underline-offset-4 hover:text-foreground transition-colors">
                  Resend
                </button>
              </p>
            </div>
          </div>

          {/* Demo Hint */}
          <div className="mt-4 p-3 rounded-md bg-muted">
            <p className="text-xs text-muted-foreground text-center">
              Demo: Enter "123456" for success, anything else for error
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPDemo;