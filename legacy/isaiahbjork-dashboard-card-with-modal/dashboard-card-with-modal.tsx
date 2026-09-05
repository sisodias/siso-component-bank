"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Badge } from "./badge";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";
import { Button } from "./button";
import { Separator } from "./separator";
import { Copy, Shield, Car, Calendar, MapPin, User, CreditCard, X, Check } from 'lucide-react';
import { cn } from "../_utils/cn";

interface DashboardCardModalProps {
  // Client information
  clientName?: string;
  clientAvatar?: string;
  dateOfBirth?: string;
  cityOfResidence?: string;
  idNumber?: string;
  policyNumber?: string;
  
  // Policy details
  policyType?: string;
  expiryDate?: string;
  vehicleInfo?: string;
  qrCodeImage?: string;
  
  // Event handlers
  onUpdatePolicy?: (data: any) => void;
  onCopyId?: () => void;
  onCopyPolicy?: () => void;
  
  // Configuration
  enableAnimations?: boolean;
  className?: string;
}

export function DashboardCardModal({
  clientName = "Sarah Johnson",
  clientAvatar = "https://images.unsplash.com/photo-1494790108755-2616b96e6ede?q=80&w=200",
  dateOfBirth = "March 15, 1985",
  cityOfResidence = "San Francisco, CA",
  idNumber = "ID-2589637410",
  policyNumber = "POL-8849271653",
  policyType = "Comprehensive Auto Insurance",
  expiryDate = "Dec 31, 2025",
  vehicleInfo = "2022 Tesla Model 3 • Blue",
  qrCodeImage = "https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=POL-8849271653",
  onUpdatePolicy,
  onCopyId,
  onCopyPolicy,
  enableAnimations = true,
  className,
}: DashboardCardModalProps) {
  const [showUpdateModule, setShowUpdateModule] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedPolicy, setCopiedPolicy] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  const shouldAnimate = enableAnimations && !shouldReduceMotion;

  // Calculate days until expiry
  const getDaysUntilExpiry = () => {
    // Parse date string manually for better compatibility
    const [month, day, year] = expiryDate.split(' ');
    const months = {
      'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
      'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
    };
    const cleanDay = parseInt(day.replace(',', ''));
    const cleanYear = parseInt(year);

    const expiry = new Date(cleanYear, months[month as keyof typeof months], cleanDay);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilExpiry = getDaysUntilExpiry();
  const isExpiringSoon = daysUntilExpiry <= 30;

  const handleCopyId = async () => {
    await navigator.clipboard.writeText(idNumber);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
    onCopyId?.();
  };

  const handleCopyPolicy = async () => {
    await navigator.clipboard.writeText(policyNumber);
    setCopiedPolicy(true);
    setTimeout(() => setCopiedPolicy(false), 2000);
    onCopyPolicy?.();
  };

  const handleUpdatePolicy = () => {
    setShowUpdateModule(true);
  };

  const handleConfirmUpdate = () => {
    const updateData = {
      policyNumber,
      clientName,
      timestamp: new Date().toISOString(),
    };
    onUpdatePolicy?.(updateData);
    setShowUpdateModule(false);
  };

  const handleCloseModule = () => {
    setShowUpdateModule(false);
  };

  // Animation variants
  const containerVariants = {
    hidden: { 
      opacity: 0, 
      y: 20, 
      scale: 0.95,
      filter: "blur(4px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 0.8,
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      x: -15, 
      scale: 0.95,
      filter: "blur(2px)",
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 28,
        mass: 0.6,
      },
    },
  };

  if (!mounted) {
    return (
      <div className={cn("w-full max-w-md mx-auto bg-card border border-border rounded-xl p-6", className)}>
        <div className="h-96 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className={cn("w-full max-w-md mx-auto bg-card border border-border rounded-xl overflow-hidden", className)}
      initial={shouldAnimate ? "hidden" : "visible"}
      animate="visible"
      variants={shouldAnimate ? containerVariants : {}}
    >
      <div className="relative">
        {/* Main Content */}
        <motion.div
          initial={false}
          animate={{ 
            opacity: showUpdateModule ? 0.3 : 1,
            scale: showUpdateModule ? 0.95 : 1,
            filter: showUpdateModule ? "blur(1px)" : "blur(0px)"
          }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            mass: 0.8
          }}
          className="p-6 space-y-4"
        >
          {/* Header with Avatar and Expiry */}
          <motion.div 
            className="flex items-start justify-between"
            variants={shouldAnimate ? itemVariants : {}}
          >
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12 ring-2 ring-primary/20">
                <AvatarImage src={clientAvatar} alt={clientName} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {clientName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <Badge 
                  variant={isExpiringSoon ? "destructive" : "secondary"}
                  className="mb-1 text-xs font-medium"
                >
                  {isExpiringSoon ? `Expires in ${daysUntilExpiry} days` : "Active Policy"}
                </Badge>
                <p className="text-sm text-muted-foreground">{expiryDate}</p>
              </div>
            </div>
            <div className="w-12 h-12 bg-muted/50 border border-border/50 rounded-lg overflow-hidden p-1">
              <img
                src={qrCodeImage}
                alt="Policy QR Code"
                className="w-full h-full object-cover rounded"
              />
            </div>
          </motion.div>

          {/* Client Information */}
          <motion.div 
            className="space-y-3"
            variants={shouldAnimate ? itemVariants : {}}
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <User className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">Client Name</span>
                </div>
                <p className="text-sm font-medium text-foreground">{clientName}</p>
              </div>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Calendar className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">Date of Birth</span>
                </div>
                <p className="text-sm font-medium text-foreground">{dateOfBirth}</p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1 mb-1">
                <MapPin className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground uppercase tracking-wide">City of Residence</span>
              </div>
              <p className="text-sm font-medium text-foreground">{cityOfResidence}</p>
            </div>

            {/* ID Number with Copy */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-1 mb-1">
                  <CreditCard className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">ID Number</span>
                </div>
                <p className="text-sm font-medium text-foreground">{idNumber}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopyId}
                className="ml-2 w-6 h-6 rounded-md bg-muted/50 hover:bg-muted/80 flex items-center justify-center transition-colors"
              >
                {copiedId ? (
                  <Check className="w-3 h-3 text-green-500" />
                ) : (
                  <Copy className="w-3 h-3 text-muted-foreground" />
                )}
              </motion.button>
            </div>

            {/* Policy Number with Copy */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-1 mb-1">
                  <Shield className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">Policy Number</span>
                </div>
                <p className="text-sm font-medium text-foreground">{policyNumber}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopyPolicy}
                className="ml-2 w-6 h-6 rounded-md bg-muted/50 hover:bg-muted/80 flex items-center justify-center transition-colors"
              >
                {copiedPolicy ? (
                  <Check className="w-3 h-3 text-green-500" />
                ) : (
                  <Copy className="w-3 h-3 text-muted-foreground" />
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Separator */}
          <motion.div variants={shouldAnimate ? itemVariants : {}}>
            <Separator className="my-4" />
          </motion.div>

          {/* Policy Details */}
          <motion.div 
            className="space-y-3"
            variants={shouldAnimate ? itemVariants : {}}
          >
            <div>
              <div className="flex items-center gap-1 mb-1">
                <Shield className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground uppercase tracking-wide">Type of Insurance</span>
              </div>
              <p className="text-sm font-medium text-foreground">{policyType}</p>
            </div>

            <div>
              <div className="flex items-center gap-1 mb-1">
                <Car className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground uppercase tracking-wide">Vehicle Information</span>
              </div>
              <p className="text-sm font-medium text-foreground">{vehicleInfo}</p>
            </div>
          </motion.div>

          {/* Update Policy Button */}
          <motion.div
            className="pt-4"
            variants={shouldAnimate ? itemVariants : {}}
          >
            <motion.div
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
            <Button
              onClick={handleUpdatePolicy}
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4" />
              Update Policy
            </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Update Policy Module Overlay */}
        <AnimatePresence>
          {showUpdateModule && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center rounded-xl z-10"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.8 }}
                className="bg-card border border-border rounded-xl p-6 mx-6 shadow-lg relative"
              >
                {/* Close button */}
                <button
                  onClick={handleCloseModule}
                  className="absolute top-3 right-3 w-6 h-6 rounded-full bg-muted/50 hover:bg-muted/70 flex items-center justify-center transition-colors"
                >
                  <X className="w-3 h-3 text-muted-foreground" />
                </button>

                <div className="text-center space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full mx-auto flex items-center justify-center">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      Update Policy
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Confirm policy update for {clientName}
                    </p>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-3 text-left">
                    <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      Policy Number
                    </div>
                    <div className="text-sm font-medium text-foreground">
                      {policyNumber}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleCloseModule}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <motion.div className="flex-1">
                      <Button
                        onClick={handleConfirmUpdate}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Confirm Update
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
