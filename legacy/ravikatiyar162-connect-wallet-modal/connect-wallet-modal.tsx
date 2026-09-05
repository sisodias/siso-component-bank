import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "../_utils/cn"; // Your utility for merging class names

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./dialog"; // Assuming Dialog is in your ui folder

// --- TYPES ---
interface Wallet {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  onConnect: () => void;
}

interface ConnectWalletModalProps
  extends React.ComponentProps<typeof Dialog> {
  wallets: Wallet[];
  termsUrl?: string;
  policyUrl?: string;
}

// --- ICONS (Placeholders) ---
const MetamaskIcon = (props: { className?: string }) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21.414 12.707l-2.121-2.121a1 1 0 00-1.414 0l-1.414 1.414a1 1 0 01-1.414 0l-1.061-1.061a1 1 0 00-1.414 0l-2.121 2.121a1 1 0 01-1.414 0l-1.061-1.061a1 1 0 00-1.414 0l-1.414 1.414a1 1 0 01-1.414 0L3 11.293a1 1 0 00-1.414 1.414l7.071 7.071a1 1 0 001.414 0l2.121-2.121a1 1 0 011.414 0l1.061 1.061a1 1 0 001.414 0l2.121-2.121a1 1 0 011.414 0l1.061 1.061a1 1 0 001.414 0l1.414-1.414a1 1 0 000-1.414zM12 2a10 10 0 100 20 10 10 0 000-20z" fill="#F6851B"/></svg>
);
const PhantomIcon = (props: { className?: string }) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-9.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zm4 0c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zm-2 4.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" fill="#5E53F8"/></svg>
);
const CoinbaseWalletIcon = (props: { className?: string }) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm-2-5h4v-2h-4v2zm0-4h4v-2h-4v2z" fill="#0052FF"/></svg>
);
const MoreHorizontalIcon = (props: { className?: string }) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
);
const ArrowRightIcon = (props: { className?: string }) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
);

// --- MAIN COMPONENT ---
export function ConnectWalletModal({
  wallets,
  termsUrl = "#",
  policyUrl = "#",
  ...props
}: ConnectWalletModalProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-sm p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-center text-lg font-semibold">
            Connect your Wallet
          </DialogTitle>
        </DialogHeader>

        <motion.div
          className="flex flex-col border-t px-2 pb-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {wallets.map((wallet) => (
            <motion.button
              key={wallet.id}
              variants={itemVariants}
              onClick={wallet.onConnect}
              className="group flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-lg text-left hover:bg-muted/80 transition-colors duration-200"
              aria-label={`Connect with ${wallet.name}`}
            >
              <div className="flex items-center gap-4">
                <wallet.icon className="h-8 w-8" />
                <span>{wallet.name}</span>
              </div>
              <ArrowRightIcon className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </motion.button>
          ))}
        </motion.div>

        <div className="bg-muted/50 p-4 text-center rounded-b-xl border-t">
          <p className="text-xs text-muted-foreground">
            By connecting your wallet, you agree to our{" "}
            <a href={termsUrl} className="underline hover:text-foreground">
              Terms and Conditions
            </a>{" "}
            and our{" "}
            <a href={policyUrl} className="underline hover:text-foreground">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}