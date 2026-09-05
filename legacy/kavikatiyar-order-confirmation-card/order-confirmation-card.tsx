import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { cn } from "../_utils/cn"; // Your utility for merging class names
import { Button, ButtonProps } from "./button"; // Assuming shadcn Button

/**
 * @interface OrderConfirmationCardProps
 * @description Props for the OrderConfirmationCard component.
 * @property {string} orderId - The unique identifier for the order.
 * @property {string} paymentMethod - The method used for payment.
 * @property {string} dateTime - The date and time of the transaction.
 * @property {string} totalAmount - The total amount charged, formatted as a string (e.g., "$129").
 * @property {() => void} onGoToAccount - Callback function for the primary action button.
 * @property {string} [title] - Optional title text. Defaults to "Your order has been successfully submitted".
 * @property {string} [buttonText] - Optional text for the action button. Defaults to "Go to my account".
 * @property {React.ReactNode} [icon] - Optional custom icon. Defaults to a checkmark icon.
 * @property {string} [className] - Optional additional CSS classes for the card container.
 */
interface OrderConfirmationCardProps {
  orderId: string;
  paymentMethod: string;
  dateTime: string;
  totalAmount: string;
  onGoToAccount: () => void;
  title?: string;
  buttonText?: string;
  icon?: React.ReactNode;
  className?: string;
}

/**
 * A reusable UI component to display an order confirmation.
 * It's theme-adaptive, responsive, and includes subtle animations.
 */
export const OrderConfirmationCard: React.FC<OrderConfirmationCardProps> = ({
  orderId,
  paymentMethod,
  dateTime,
  totalAmount,
  onGoToAccount,
  title = "Your order has been successfully submitted",
  buttonText = "Go to my account",
  icon = <CheckCircle2 className="h-12 w-12 text-green-500" />,
  className,
}) => {
  // Array of details for easy mapping
  const details = [
    { label: "Order ID", value: orderId },
    { label: "Payment Method", value: paymentMethod },
    { label: "Date & Time", value: dateTime },
    { label: "Total", value: totalAmount, isBold: true },
  ];

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeInOut",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <AnimatePresence>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        aria-live="polite"
        className={cn(
          "w-full max-w-sm rounded-xl border bg-card text-card-foreground shadow-lg p-6 sm:p-8",
          className
        )}
      >
        <div className="flex flex-col items-center space-y-6 text-center">
          {/* Success Icon */}
          <motion.div variants={itemVariants}>{icon}</motion.div>

          {/* Title */}
          <motion.h2 variants={itemVariants} className="text-2xl font-semibold">
            {title}
          </motion.h2>

          {/* Order Details Section */}
          <motion.div variants={itemVariants} className="w-full space-y-4 pt-4">
            {details.map((item, index) => (
              <div
                key={item.label}
                className={cn(
                  "flex items-center justify-between border-b pb-4 text-sm text-muted-foreground",
                  {
                    "border-none pb-0": index === details.length - 1, // No border for the last item
                    "font-bold text-card-foreground": item.isBold, // Bold style for Total
                  }
                )}
              >
                <span>{item.label}</span>
                <span className={cn({ "text-lg": item.isBold })}>{item.value}</span>
              </div>
            ))}
          </motion.div>

          {/* Action Button */}
          <motion.div variants={itemVariants} className="w-full pt-4">
            <Button
              onClick={onGoToAccount}
              className="w-full h-12 text-md"
              size="lg"
            >
              {buttonText}
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};