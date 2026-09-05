'use client';

import confetti from 'canvas-confetti';
import { Check, Home } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

export default function Welcome() {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const canvasRef = useCallback((canvas: HTMLCanvasElement | null) => {
    if (!canvas) return;

    const myConfetti = confetti.create(canvas, {
      resize: true,
      useWorker: true,
    });

    myConfetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  const handleContinue = () => {
    window.location.reload();
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
      {showConfetti && (
        <canvas
          className="pointer-events-none absolute inset-0 h-full w-full"
          ref={canvasRef}
          style={{ zIndex: 10 }}
        />
      )}

      <div className="relative z-20 w-full max-w-md space-y-8 text-center">
        <div className="space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Check className="h-8 w-8 text-green-600" />
          </div>

          <div className="space-y-3">
            <h1 className="font-bold text-3xl text-foreground tracking-tight">
              Your account has been created!
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Welcome! Your account has been successfully created and you're ready to get started.
            </p>
          </div>
        </div>

        <div className="pt-4">
          <button
            className="group btn-default h-12 w-full rounded-md bg-primary font-medium text-base text-primary-foreground transition-colors hover:bg-primary/90 flex items-center justify-center"
            onClick={handleContinue}
            type="button"
            aria-label="Welcome"
          >
            <span>Continue to Dashboard</span>
            <Home className="ml-2 h-4 w-4 transition-transform group-hover:scale-110" aria-hidden="true" />
          </button>
        </div>

        <div className="pt-8 text-muted-foreground text-sm">
          <p>You can now access all features of your account</p>
        </div>
      </div>
    </div>
  );
}
