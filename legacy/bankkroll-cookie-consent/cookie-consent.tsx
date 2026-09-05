"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { CookieIcon, ChevronRight } from "lucide-react";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { Label } from "./label";
import { Switch } from "./switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import { cn } from "../_utils/cn";

// --------------------------------
// Types and Interfaces
// --------------------------------

interface CookieCategory {
  id: string;
  name: string;
  description: string;
  icon?: React.ReactNode;
  isEssential?: boolean;
}

interface CookiePreferences {
  [key: string]: boolean;
}

// --------------------------------
// Default Configurations
// --------------------------------

const DEFAULT_COOKIE_CATEGORIES: CookieCategory[] = [
  {
    id: "essential",
    name: "Essential Cookies",
    description: "Required for core website functionality, such as navigation and security.",
    isEssential: true,
  },
  {
    id: "analytics",
    name: "Analytics Cookies",
    description: "Track anonymous usage to improve our services.",
  },
  {
    id: "marketing",
    name: "Marketing Cookies",
    description: "Enable personalized ads across websites.",
  },
];

const STORAGE_KEY = "cookie_preferences";
const CONSENT_KEY = "cookie_consent_given";

// --------------------------------
// Main Component
// --------------------------------

interface CookieConsentProps {
  className?: string;
  categories?: CookieCategory[];
  cookiePolicyUrl?: string;
  onAccept?: (preferences: boolean[]) => void;
  onDecline?: () => void;
}

function CookieConsent({
  className,
  categories = DEFAULT_COOKIE_CATEGORIES,
  cookiePolicyUrl = "/cookies",
  onAccept,
  onDecline,
}: CookieConsentProps) {
  const [mounted, setMounted] = React.useState(false);
  const [showBanner, setShowBanner] = React.useState(false);
  const [showCustomizeDialog, setShowCustomizeDialog] = React.useState(false);
  
  // Simple boolean array - index matches category index
  const [preferences, setPreferences] = React.useState<boolean[]>(() => 
    categories.map(cat => !!cat.isEssential)
  );

  // Check if consent was already given
  React.useEffect(() => {
    setMounted(true);
    
    try {
      const consentGiven = localStorage.getItem(CONSENT_KEY) === "true";
      const storedPrefs = localStorage.getItem(STORAGE_KEY);
      
      if (consentGiven && storedPrefs) {
        const parsedPrefs = JSON.parse(storedPrefs) as boolean[];
        if (Array.isArray(parsedPrefs) && parsedPrefs.length === categories.length) {
          setPreferences(parsedPrefs);
          onAccept?.(parsedPrefs);
          return;
        }
      }
      
      // No valid consent found, show banner
      setShowBanner(true);
    } catch (error) {
      console.error("Error reading cookie preferences:", error);
      setShowBanner(true);
    }
  }, [categories.length, onAccept]);

  const savePreferences = React.useCallback((prefs: boolean[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
      localStorage.setItem(CONSENT_KEY, "true");
    } catch (error) {
      console.error("Error saving cookie preferences:", error);
    }
    
    setShowBanner(false);
    setShowCustomizeDialog(false);
    onAccept?.(prefs);
  }, [onAccept]);

  const handleAcceptAll = React.useCallback(() => {
    const allTrue = categories.map(() => true);
    setPreferences(allTrue);
    savePreferences(allTrue);
  }, [categories, savePreferences]);

  const handleRejectAll = React.useCallback(() => {
    const essentialOnly = categories.map(cat => !!cat.isEssential);
    setPreferences(essentialOnly);
    savePreferences(essentialOnly);
    onDecline?.();
  }, [categories, savePreferences, onDecline]);

  const handleSaveCustom = React.useCallback(() => {
    savePreferences(preferences);
  }, [preferences, savePreferences]);

  const handleToggle = React.useCallback((index: number, checked: boolean) => {
    if (categories[index]?.isEssential) return; // Can't toggle essential cookies
    
    setPreferences(prev => {
      const newPrefs = [...prev];
      newPrefs[index] = checked;
      return newPrefs;
    });
  }, [categories]);

  if (!mounted) return null;

  return (
    <>
      <CookieBanner
        isVisible={showBanner}
        onAcceptAll={handleAcceptAll}
        onCustomize={() => setShowCustomizeDialog(true)}
        cookiePolicyUrl={cookiePolicyUrl}
        className={className}
      />
      
      <CookieCustomizeDialog
        open={showCustomizeDialog}
        onOpenChange={setShowCustomizeDialog}
        categories={categories}
        preferences={preferences}
        onToggle={handleToggle}
        onSave={handleSaveCustom}
        onRejectAll={handleRejectAll}
      />
    </>
  );
}

// --------------------------------
// Sub-Components
// --------------------------------

interface CookieBannerProps {
  isVisible: boolean;
  onAcceptAll: () => void;
  onCustomize: () => void;
  cookiePolicyUrl: string;
  className?: string;
}

function CookieBanner({
  isVisible,
  onAcceptAll,
  onCustomize,
  cookiePolicyUrl,
  className,
}: CookieBannerProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={cn(
            "fixed bottom-0 left-0 right-0 sm:left-4 sm:bottom-4 z-50 w-full sm:max-w-md",
            className
          )}
        >
          <div className="m-3 bg-card/95 backdrop-blur-lg border border-border/50 rounded-xl shadow-2xl">
            <div className="flex items-center gap-3 p-6 pb-4">
              <div className="bg-primary/10 p-2 rounded-lg">
                <CookieIcon className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-lg font-semibold">Cookie Preferences</h2>
            </div>
            <div className="px-6 pb-4">
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                We use cookies to enhance your experience, personalize content, and analyze traffic.
              </p>
              <Link
                href={cookiePolicyUrl}
                className="text-xs inline-flex items-center text-primary hover:underline group font-medium transition-colors"
              >
                Cookie Policy
                <ChevronRight className="h-3 w-3 ml-1 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
            <div className="p-4 flex flex-col sm:flex-row gap-3 border-t border-border/50 bg-muted/30">
              <Button
                onClick={onAcceptAll}
                size="sm"
                className="w-full sm:flex-1 h-9 rounded-lg text-sm transition-all hover:shadow-md"
              >
                Accept All
              </Button>
              <Button
                onClick={onCustomize}
                size="sm"
                variant="outline"
                className="w-full sm:flex-1 h-9 rounded-lg text-sm transition-all hover:shadow-md"
              >
                Customize
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface CookieCustomizeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: CookieCategory[];
  preferences: boolean[];
  onToggle: (index: number, checked: boolean) => void;
  onSave: () => void;
  onRejectAll: () => void;
}

function CookieCustomizeDialog({
  open,
  onOpenChange,
  categories,
  preferences,
  onToggle,
  onSave,
  onRejectAll,
}: CookieCustomizeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card/95 backdrop-blur-lg z-[200] sm:max-w-[500px] p-0 gap-0 border-border/50 shadow-2xl">
        <DialogHeader className="p-6 pb-4 border-b border-border/50">
          <DialogTitle className="text-xl font-semibold">Manage Cookies</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Customize your cookie preferences below.
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 py-6 space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className={cn(
                "p-4 border rounded-xl transition-all duration-200",
                preferences[index] 
                  ? "border-primary/30 bg-primary/5 shadow-sm" 
                  : "border-border/50 hover:border-border/70"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-lg transition-colors",
                    preferences[index] ? "bg-primary/10" : "bg-muted"
                  )}>
                    {category.icon || <CookieIcon className="h-4 w-4" />}
                  </div>
                  <Label
                    htmlFor={`cookie-${index}`}
                    className="font-semibold text-base cursor-pointer"
                  >
                    {category.name}
                    {category.isEssential && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                              Required
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">These cookies cannot be disabled.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </Label>
                </div>
                <Switch
                  id={`cookie-${index}`}
                  checked={preferences[index] || false}
                  onCheckedChange={(checked) => onToggle(index, checked)}
                  disabled={category.isEssential}
                />
              </div>
              <p className="text-sm mt-3 text-muted-foreground leading-relaxed">
                {category.description}
              </p>
            </motion.div>
          ))}
        </div>
        <DialogFooter className="p-6 border-t border-border/50 bg-muted/30">
          <div className="flex w-full flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={onRejectAll} 
              className="min-w-[120px] transition-all hover:shadow-md"
            >
              Reject All
            </Button>
            <Button 
              onClick={onSave} 
              className="min-w-[140px] transition-all hover:shadow-md"
            >
              Save Preferences
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// --------------------------------
// Exports
// --------------------------------

export { CookieConsent };
export type { CookieCategory, CookieConsentProps, CookiePreferences };