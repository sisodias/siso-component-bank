"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "./card";
import { Button } from "./button";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Badge } from "./badge";
import { Separator } from "./separator";
import {
  Calendar,
  ChevronRight,
  CreditCard,
  Gift,
  History,
  Settings,
  Shield,
  Star,
  Zap,
} from "lucide-react";

interface MembershipCardProps {
  name?: string;
  email?: string;
  avatar?: string;
  memberSince?: string;
  tier?: "bronze" | "silver" | "gold" | "platinum" | "diamond";
  points?: number;
  nextTier?: string;
  pointsToNextTier?: number;
  benefits?: string[];
  cardNumber?: string;
  expiryDate?: string;
}


export const Component = ({
  name = "Berat Berkay",
  email = "bbg@catui.com",
  avatar = "/logo.svg",
  memberSince = "March 2021",
  tier = "gold",
  points = 4250,
  nextTier = "platinum",
  pointsToNextTier = 750,
  benefits = [
    "Priority customer support",
    "Free shipping on all orders",
    "Early access to new products",
    "Exclusive member discounts",
    "Birthday rewards",
  ],
  cardNumber = "•••• •••• •••• 5678",
  expiryDate = "09/25",
}: MembershipCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [tierState, setTierState] = useState<MembershipCardProps["tier"]>(tier);

  const getTierStyle = (tier: MembershipCardProps["tier"]) => {
    switch (tier) {
      case "bronze":
        return {
          color: "text-amber-700",
          bg: "bg-amber-100",
          border: "border-amber-200",
          gradient: "from-amber-700/20 to-amber-700/5",
        };
      case "silver":
        return {
          color: "text-slate-500",
          bg: "bg-slate-100",
          border: "border-slate-200",
          gradient: "from-slate-400/20 to-slate-400/5",
        };
      case "gold":
        return {
          color: "text-amber-500",
          bg: "bg-amber-50",
          border: "border-amber-100",
          gradient: "from-amber-500/20 to-amber-500/5",
        };
      case "platinum":
        return {
          color: "text-slate-700",
          bg: "bg-slate-50",
          border: "border-slate-100",
          gradient: "from-slate-700/20 to-slate-700/5",
        };
      case "diamond":
        return {
          color: "text-sky-500",
          bg: "bg-sky-50",
          border: "border-sky-100",
          gradient: "from-sky-500/20 to-sky-500/5",
        };
      default:
        return {
          color: "text-amber-500",
          bg: "bg-amber-50",
          border: "border-amber-100",
          gradient: "from-amber-500/20 to-amber-500/5",
        };
    }
  };

  const tierStyle = getTierStyle(tierState);
  const progressToNextTier = (points / (points + pointsToNextTier)) * 100;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Tier selector as colored dots */}
      <div className="flex gap-3 mb-6 flex-wrap justify-center">
        {["bronze", "silver", "gold", "platinum", "diamond"].map((t) => {
          const selected = t === tierState;
          const style = getTierStyle(t as MembershipCardProps["tier"]);

          return (
            <button
              key={t}
              onClick={() => setTierState(t as MembershipCardProps["tier"])}
              className={`w-6 h-6 rounded-full cursor-pointer border-2 transition-all duration-300
                ${style.bg} ${style.border}
                ${selected ? "ring-2 ring-offset-2 ring-primary" : "hover:scale-110"}
              `}
              title={t}
            />
          );
        })}
      </div>

      <Card
        className="w-full max-w-md overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`h-3 w-full bg-gradient-to-r ${tierStyle.gradient}`} />

        <CardHeader className="p-6 pb-0">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 border">
                <AvatarImage src={avatar || "/placeholder.svg"} alt={name} />
                <AvatarFallback>{name.charAt(0)}</AvatarFallback>
              </Avatar>

              <div>
                <h3 className="font-semibold text-lg">{name}</h3>
                <p className="text-sm text-muted-foreground">{email}</p>
                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Member since {memberSince}</span>
                </div>
              </div>
            </div>

            <Badge
              className={`uppercase px-3 py-1 ${tierStyle.color} ${tierStyle.bg} ${tierStyle.border} border`}
            >
              {tierState}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Star className={`h-5 w-5 ${tierStyle.color}`} />
                <span className="font-medium">
                  {points.toLocaleString()} Points
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                {pointsToNextTier.toLocaleString()} points to {nextTier}
              </span>
            </div>

            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${tierStyle.color.replace("text", "bg")}`}
                initial={{ width: 0 }}
                animate={{ width: `${progressToNextTier}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>

          <motion.div
            className={`relative h-48 rounded-xl overflow-hidden ${tierStyle.border} border-2 p-5 flex flex-col justify-between`}
            style={{
              background: `linear-gradient(135deg, var(--background), transparent)`,
            }}
            animate={{
              rotateY: isHovered ? [0, 5, 0] : 0,
              scale: isHovered ? 1.02 : 1,
            }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,_rgba(255,255,255,0.8),_rgba(255,255,255,0)_70%)]" />
            </div>

            <div className="flex justify-between items-start relative z-10">
              <div className="uppercase text-sm font-semibold">
                Membership Card
              </div>
              <Shield className={`h-5 w-5 ${tierStyle.color}`} />
            </div>

            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <span className="font-mono">{cardNumber}</span>
              </div>

              <div className="flex justify-between">
                <div>
                  <div className="text-xs text-muted-foreground">
                    MEMBER NAME
                  </div>
                  <div className="font-medium">{name}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">EXPIRES</div>
                  <div className="font-medium">{expiryDate}</div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Gift className={`h-5 w-5 ${tierStyle.color}`} />
              <h4 className="font-medium">Membership Benefits</h4>
            </div>

            <ul className="space-y-2">
              {benefits.map((benefit, index) => (
                <motion.li
                  key={index}
                  className="flex items-center gap-2 text-sm"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Zap className={`h-4 w-4 ${tierStyle.color}`} />
                  <span>{benefit}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </CardContent>

        <Separator />

        <CardFooter className="p-4 flex justify-between">
          <Button variant="ghost" size="sm" className="text-xs gap-1">
            <History className="h-3.5 w-3.5" />
            Transaction History
          </Button>
          <Button variant="ghost" size="sm" className="text-xs gap-1">
            <Settings className="h-3.5 w-3.5" />
            Manage Membership
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
