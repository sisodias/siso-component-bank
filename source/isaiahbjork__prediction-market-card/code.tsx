"use client";

import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Flame, MessageCircle } from 'lucide-react';

interface PredictionMarketCardProps {
  question?: string;
  teamLogo?: string;
  teamName?: string;
  initialTimeInSeconds?: number;
  totalBank?: number;
  yesBank?: number;
  noBank?: number;
  initialYesVotes?: number;
  initialNoVotes?: number;
  yesPlayers?: number;
  noPlayers?: number;
  onBetYes?: () => void;
  onBetNo?: () => void;
  enableAnimations?: boolean;
}

export function PredictionMarketCard({
  question = "Will Bayern win a corner in the next 3 minutes?",
  teamLogo = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/FC_Bayern_M%C3%BCnchen_logo_%282024%29.svg/1200px-FC_Bayern_M%C3%BCnchen_logo_%282024%29.svg.png",
  teamName = "Bayern",
  initialTimeInSeconds = 60,
  totalBank = 145450,
  yesBank = 64280,
  noBank = 81170,
  initialYesVotes = 42,
  initialNoVotes = 58,
  yesPlayers = 1457,
  noPlayers = 1899,
  onBetYes,
  onBetNo,
  enableAnimations = true,
}: PredictionMarketCardProps) {
  const [timeLeft, setTimeLeft] = useState(initialTimeInSeconds);
  const [yesVotes, setYesVotes] = useState(initialYesVotes);
  const [noVotes, setNoVotes] = useState(initialNoVotes);
  const [showBettingView, setShowBettingView] = useState(false);
  const [betType, setBetType] = useState<'yes' | 'no'>('yes');
  const [betAmount, setBetAmount] = useState('');
  const shouldReduceMotion = useReducedMotion();

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(2)}K`;
    }
    return `$${amount}`;
  };

  const handleBetYes = () => {
    setBetType('yes');
    setShowBettingView(true);
  };

  const handleBetNo = () => {
    setBetType('no');
    setShowBettingView(true);
  };

  const handleConfirmBet = () => {
    const adjustment = Math.floor(Math.random() * 3) + 1; // Random 1-3% change
    if (betType === 'yes') {
      setYesVotes(prev => Math.min(95, prev + adjustment));
      setNoVotes(prev => Math.max(5, prev - adjustment));
      onBetYes?.();
    } else {
      setNoVotes(prev => Math.min(95, prev + adjustment));
      setYesVotes(prev => Math.max(5, prev - adjustment));
      onBetNo?.();
    }
    setShowBettingView(false);
    setBetAmount('');
  };

  const handleBackToMain = () => {
    setShowBettingView(false);
    setBetAmount('');
  };

  const handleQuickAmount = (amount: number) => {
    setBetAmount(amount.toString());
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setBetAmount(value);
  };

  const totalVotes = yesVotes + noVotes;
  const progressValue = (yesVotes / totalVotes) * 100;
  const timerProgress = (timeLeft / initialTimeInSeconds) * 100; // Reversed: starts at 100%, goes to 0%

  const shouldAnimate = enableAnimations && !shouldReduceMotion;

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

  const badgeVariants = {
    hidden: { scale: 0, opacity: 0, filter: "blur(2px)" },
    visible: {
      scale: 1,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 25,
        mass: 0.5,
      },
    },
  };

  const progressBarVariants = {
    hidden: { scaleX: 0, opacity: 0 },
    visible: {
      scaleX: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        delay: 0.4,
      },
    },
  };

  const buttonContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.5,
      },
    },
  };

  return (
    <motion.div 
      className="w-full max-w-md mx-auto bg-card border-border border rounded-lg overflow-hidden"
      initial={shouldAnimate ? "hidden" : "visible"}
      animate="visible"
      variants={shouldAnimate ? containerVariants : {}}
    >
      <div className="relative h-auto">
        {/* Main Content */}
        <motion.div
          initial={false}
          animate={{ 
            y: showBettingView ? "-20px" : "0px",
            opacity: showBettingView ? 0.3 : 1,
            scale: showBettingView ? 0.95 : 1
          }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            mass: 0.8
          }}
          className="w-full"
        >
          <div className="p-3 space-y-3">
        {/* Header with badges and timer */}
        <motion.div 
          className="flex items-center justify-between"
          variants={shouldAnimate ? itemVariants : {}}
        >
          <div className="flex items-center gap-2">
            <motion.div variants={shouldAnimate ? badgeVariants : {}}>
              <Badge className="bg-orange-500 hover:bg-orange-600 text-white rounded-md border-0">
                <Flame className="w-3 h-3 mr-1" />
                HOT BET
              </Badge>
            </motion.div>
            <motion.div variants={shouldAnimate ? badgeVariants : {}}>
              <Badge className="bg-gray-400 hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-100 rounded-md border-0">
                <MessageCircle className="w-3 h-3 mr-1" /> 
                SOCCER
              </Badge>
            </motion.div>
          </div>
          <motion.div variants={shouldAnimate ? badgeVariants : {}}>
            <Badge className="bg-red-500 hover:bg-red-600 text-white rounded-md font-mono border-0">
              {formatTime(timeLeft)}
            </Badge>
          </motion.div>
        </motion.div>

        {/* Team info and question */}
        <motion.div 
          className="flex items-start justify-center gap-3 pt-2"
          variants={shouldAnimate ? itemVariants : {}}
        >
          <motion.div variants={shouldAnimate ? badgeVariants : {}}>
            <Avatar className="w-10 h-10">
              <AvatarImage src={teamLogo} alt={teamName} />
              <AvatarFallback className="bg-red-600 text-foreground">
                {teamName.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </motion.div>
          <motion.div variants={shouldAnimate ? itemVariants : {}}>
            <h3 className="text-lg font-semibold leading-tight text-foreground">
              {question}
            </h3>
          </motion.div>
        </motion.div>

        {/* Gradient separator */}
        <motion.div 
          className="relative py-2"
          variants={shouldAnimate ? itemVariants : {}}
        >
          <Separator className="bg-gradient-to-r from-transparent dark:via-gray-500 via-gray-300 to-transparent" />
        </motion.div>

        {/* Bank information */}
        <motion.div 
          className="flex justify-between items-center"
          variants={shouldAnimate ? itemVariants : {}}
        >
          <div className="text-left">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Bank</p>
            <p className="text-xl font-bold text-yellow-400">
              {formatCurrency(totalBank)}
            </p>
          </div>
          <div className="text-left">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Bank <span className="font-bold">YES</span></p>
            <p className="text-xl font-bold text-emerald-400">
              {formatCurrency(yesBank)}
            </p>
          </div>
          <div className="text-left">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Bank <span className="font-bold">NO</span></p>
            <p className="text-xl font-bold text-rose-400">
              {formatCurrency(noBank)}
            </p>
          </div>
        </motion.div>
        <motion.div 
          className="relative py-2"
          variants={shouldAnimate ? itemVariants : {}}
        >
          <Separator className="bg-gradient-to-r from-transparent dark:via-gray-500 via-gray-300 to-transparent" />
          </motion.div>

        {/* Voting statistics */}
        <motion.div 
          className="space-y-2"
          variants={shouldAnimate ? itemVariants : {}}
        >
          <div className="flex items-center justify-between">
            <div className="text-left">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Voted <span className="font-bold">YES</span></p>
              <p className="text-2xl font-bold text-emerald-400">{yesVotes}%</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Voted <span className="font-bold">NO</span></p>
              <p className="text-2xl font-bold text-rose-400">{noVotes}%</p>
            </div>
          </div>

          {/* Progress bar */}
          <motion.div 
            className="relative h-3 bg-rose-500 rounded-sm overflow-hidden"
            variants={shouldAnimate ? progressBarVariants : {}}
          >
            <div 
              className="absolute top-0 left-0 h-full bg-emerald-500 transition-all duration-500 ease-out"
              style={{ width: `${progressValue}%` }}
            />
            {/* Diagonal separator */}
            <div 
              className="absolute top-0 h-full w-2 bg-card transform rotate-12 origin-bottom"
              style={{ 
                left: `${progressValue}%`,
                transform: `translateX(-100%) skewX(-15deg)`,
                height: '150%',
                top: '-25%'
              }}
            />
          </motion.div>

          {/* Player counts */}
          <motion.div 
            className="flex items-center justify-between text-sm text-muted-foreground"
            variants={shouldAnimate ? itemVariants : {}}
          >
            <span>{yesPlayers.toLocaleString()} PLAYERS</span>
            <span>{noPlayers.toLocaleString()} PLAYERS</span>
          </motion.div>
        </motion.div>

        {/* Betting buttons */}
        <motion.div 
          className="grid grid-cols-2 gap-3 pt-1"
          variants={shouldAnimate ? buttonContainerVariants : {}}
        >
          <motion.div
            variants={shouldAnimate ? itemVariants : {}}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <Button
              onClick={handleBetYes}
              className="w-full relative overflow-hidden cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-full border border-emerald-400/30 hover:border-emerald-300/50 transition-all duration-300 group"
            >
              <span className="relative z-10">BET YES ↗</span>
              {/* Gradient shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-300/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
              {/* Subtle inner glow */}
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-700/30 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
          </motion.div>
          <motion.div
            variants={shouldAnimate ? itemVariants : {}}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <Button
              onClick={handleBetNo}
              className="w-full relative overflow-hidden cursor-pointer bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3 rounded-full border border-rose-400/30 hover:border-rose-300/50 transition-all duration-300 group"
            >
              <span className="relative z-10">BET NO ↘</span>
              {/* Gradient shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-rose-300/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
              {/* Subtle inner glow */}
              <div className="absolute inset-0 bg-gradient-to-t from-rose-700/30 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
          </motion.div>
        </motion.div>       
      </div>
    </motion.div>

        {/* Betting View */}
        <motion.div
          initial={false}
          animate={{ 
            y: showBettingView ? "0%" : "100%",
            opacity: showBettingView ? 1 : 0 
          }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            mass: 0.8
          }}
          className="absolute top-0 left-0 w-full h-full bg-card"
        >
          <div className="p-3 space-y-4">
            {/* Header with back button */}
            <div className="flex items-center justify-between">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBackToMain}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-sm font-medium">Back</span>
              </motion.button>
              <Badge className="bg-red-500 hover:bg-red-600 text-white rounded-md font-mono border-0">
                {formatTime(timeLeft)}
              </Badge>
            </div>

            {/* Question header */}
            <div className="flex items-center justify-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={teamLogo} alt={teamName} />
                <AvatarFallback className="bg-red-600 text-white text-xs">
                  {teamName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-sm font-semibold leading-tight text-foreground">
                  {question}
                </h3>
              </div>
            </div>

            {/* Bet type indicator */}
            <div className="text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">YOUR BET</p>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                betType === 'yes' 
                  ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30' 
                  : 'bg-rose-600/20 text-rose-400 border border-rose-500/30'
              }`}>
                {betType === 'yes' ? 'YES ↗' : 'NO ↘'}
              </div>
            </div>

            {/* Amount input */}
            <div className="space-y-3">
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl font-bold text-muted-foreground">
                  $
                </div>
                <input
                  type="text"
                  value={betAmount}
                  onChange={handleAmountChange}
                  placeholder=""
                  className="w-full bg-transparent border border-border/50 rounded-xl pl-12 pr-4 py-4 text-xl font-semibold text-foreground placeholder-muted-foreground focus:outline-none focus:border-border transition-colors"
                />
              </div>

              {/* Quick amount buttons */}
              <div className="grid grid-cols-4 gap-2">
                {[10, 20, 50, 100].map((amount) => (
                  <motion.button
                    key={amount}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleQuickAmount(amount)}
                    className="bg-muted/50 hover:bg-muted/80 border border-border/30 rounded-lg py-2 text-sm font-medium text-muted-foreground transition-all duration-200"
                  >
                    +${amount}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Confirm button */}
            <motion.button
              whileHover={betAmount ? { scale: 1.02, y: -1 } : {}}
              whileTap={betAmount ? { scale: 0.98 } : {}}
              onClick={handleConfirmBet}
              disabled={!betAmount}
              className={`w-full relative overflow-hidden py-3 rounded-full font-semibold transition-all duration-300 ${
                betAmount 
                  ? `${betType === 'yes' ? 'bg-emerald-600 hover:bg-emerald-700 border-emerald-400/30' : 'bg-rose-600 hover:bg-rose-700 border-rose-400/30'} text-white border cursor-pointer group` 
                  : 'bg-muted text-muted-foreground border border-border cursor-not-allowed'
              }`}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                CONFIRM BET
                {betAmount && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                )}
              </span>
              {betAmount && (
                <>
                  {/* Gradient shine effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r from-transparent ${betType === 'yes' ? 'via-emerald-300/20' : 'via-rose-300/20'} to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out`} />
                  {/* Subtle inner glow */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${betType === 'yes' ? 'from-emerald-700/30 to-emerald-500/10' : 'from-rose-700/30 to-rose-500/10'} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
      
      {/* Timer progress bar - stays at bottom */}
      <motion.div 
        className="px-0 pt-2"
        variants={shouldAnimate ? progressBarVariants : {}}
      >
        <div className="h-1 dark:bg-gray-700 bg-gray-300 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-red-400 to-red-600 transition-all duration-1000 ease-linear"
            style={{ width: `${timerProgress}%` }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
