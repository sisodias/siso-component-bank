import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";
import { Button } from "./button";
import {
  Credenza,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "./credenza";
import { ScrollArea } from "./scroll-area";
import { WalletName } from "@solana/wallet-adapter-base";
import { useWallet, Wallet } from "@solana/wallet-adapter-react";
import { AnimationControls, motion } from "framer-motion";
import { BadgeInfo } from "lucide-react";
import { cn } from "@/lib/utils"
import Image from "next/image";
import Link from "next/link";

type ComponentProps = {
  installedWallets: Wallet[];
  uninstalledWallets: Wallet[];
  onConnect: (name: WalletName) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const Component = ({
  controls,
  installedWallets,
  uninstalledWallets,
  onConnect,
  open,
  onOpenChange,
}: ComponentProps) => (
  <Credenza open={open} onOpenChange={onOpenChange}>
    <CredenzaTrigger asChild>
      <Button
        className="h-fit gap-2 rounded-full bg-primary font-semibold text-background hover:bg-foreground cursor-pointer"
        onMouseEnter={() => controls.start("animate")}
        onMouseLeave={() => controls.start("normal")}
      >
        {"Connect Wallet"}
        <ConnectIcon controls={controls} />
      </Button>
    </CredenzaTrigger>
    <CredenzaContent className="h-fit gap-0 border bg-background p-0">
      <CredenzaHeader className="border-b p-5">
        <CredenzaTitle className="font-semibold text-foreground">
          Connect Wallet
        </CredenzaTitle>
        <CredenzaDescription className="font-medium text-muted-foreground">
          You need to connect a Solana wallet.
        </CredenzaDescription>
      </CredenzaHeader>
      <div className="space-y-4 p-5">
        <h1 className="text-sm font-medium text-foreground">
          Installed Wallets
        </h1>
        <WalletList
          wallets={installedWallets}
          onSelect={onConnect}
          type="installed"
        />
        <Accordion type="single" collapsible>
          <AccordionItem value="moreWallets" className="border-0">
            <AccordionTrigger className="normal text-sm font-medium text-foreground">
              More Wallets
            </AccordionTrigger>
            <AccordionContent className="space-y-3 pb-0">
              <ScrollArea className="max-md:h-[250px]">
                <WalletList
                  wallets={uninstalledWallets}
                  onSelect={onConnect}
                  type="uninstalled"
                />
              </ScrollArea>
              <p className="flex items-center justify-center gap-2 py-3 text-xs text-foreground">
                <BadgeInfo className="size-4" />
                <span>
                  If you face errors, install the wallet before connecting.
                </span>
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </CredenzaContent>
  </Credenza>
);

type WalletListProps = {
  wallets: Wallet[];
  onSelect: (name: WalletName) => void;
  type: "installed" | "uninstalled";
};

const WalletList = ({ wallets, onSelect, type }: WalletListProps) => {
  const { wallet: selectedWallet } = useWallet();
  if (type === "installed") {
    return (
      <div className="xss:grid-cols-3 grid grid-cols-2 gap-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-4">
        {wallets.length > 0 ? (
          wallets.map((wallet) => (
            <Button
              variant="ghost"
              key={wallet.adapter.name}
              onClick={() => onSelect(wallet.adapter.name)}
              className={cn(
                "relative flex aspect-square h-auto cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-primary/10 transition hover:border-primary/60 hover:bg-primary/20",
              )}
            >
              {selectedWallet?.adapter.name === wallet.adapter.name && (
                <BorderTrail
                  style={{
                    boxShadow:
                      "0px 0px 60px   30px rgb(255 255 255 / 50%), 0 0 100px 60px rgb(0 0 0 / 50%), 0 0 140px 90px rgb(0 0 0 / 50%)",
                  }}
                  size={100}
                />
              )}

              <WalletIcon wallet={wallet} size="md" />
              <span className="text-sm text-foreground">
                {wallet.adapter.name}
              </span>
            </Button>
          ))
        ) : (
          <p className="col-span-full text-center text-sm text-muted-foreground">
            No wallet found. Please download a supported Solana wallet.
          </p>
        )}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {wallets.map((wallet) => (
        <Link
          key={wallet.adapter.name}
          href={wallet.adapter.url}
          target="_blank"
          className="flex w-full items-center gap-2 rounded-md border border-primary/10 p-3 transition-all hover:border-primary/60 hover:bg-primary/20"
        >
          <WalletIcon size="md" wallet={wallet} />
          <span className="font-medium text-foreground">
            {wallet.adapter.name}
          </span>
        </Link>
      ))}
    </div>
  );
}

type WalletIconProps = {
  wallet: Wallet;
  size?: "sm" | "md";
};

export const WalletIcon = ({ wallet, size = "sm" }: WalletIconProps) => (
  <Image
    src={wallet.adapter.icon}
    alt={wallet.adapter.name}
    className={cn(
      wallet.adapter.name.toLowerCase() === "ledger"
        ? "invert dark:invert-0"
        : null,
    )}
    width={size === "sm" ? 20 : 26}
    height={size === "sm" ? 20 : 26}
  />
);

const plugVariants: Variants = {
  normal: {
    x: 0,
    y: 0,
  },
  animate: {
    x: -3,
    y: 3,
  },
};

const socketVariants: Variants = {
  normal: {
    x: 0,
    y: 0,
  },
  animate: {
    x: 3,
    y: -3,
  },
};

const pathVariants = {
  normal: (custom: { x: number; y: number }) => ({
    d: `M${custom.x} ${custom.y} l2.5 -2.5`,
  }),
  animate: (custom: { x: number; y: number }) => ({
    d: `M${custom.x + 2.93} ${custom.y - 2.93} l0.10 -0.10`,
  }),
};

const ConnectIcon = ({ controls }: { controls: AnimationControls }) => {
  return (
    <div className="flex size-5 cursor-pointer select-none items-center justify-center rounded-md stroke-background transition-colors duration-200">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <motion.path
          d="M19 5l3 -3"
          variants={{
            normal: {
              d: "M19 5l3 -3",
            },
            animate: {
              d: "M17 7l5 -5",
            },
          }}
          animate={controls}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
        <motion.path
          d="m2 22 3-3"
          variants={{
            normal: {
              d: "m2 22 3-3",
            },
            animate: {
              d: "m2 22 6-6",
            },
          }}
          animate={controls}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
        <motion.path
          d="M6.3 20.3a2.4 2.4 0 0 0 3.4 0L12 18l-6-6-2.3 2.3a2.4 2.4 0 0 0 0 3.4Z"
          variants={socketVariants}
          animate={controls}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
        <motion.path
          variants={pathVariants}
          custom={{ x: 7.5, y: 13.5 }}
          initial="normal"
          animate={controls}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
        <motion.path
          variants={pathVariants}
          custom={{ x: 10.5, y: 16.5 }}
          initial="normal"
          animate={controls}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
        <motion.path
          d="m12 6 6 6 2.3-2.3a2.4 2.4 0 0 0 0-3.4l-2.6-2.6a2.4 2.4 0 0 0-3.4 0Z"
          variants={plugVariants}
          animate={controls}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </svg>
    </div>
  );
};

export { ConnectIcon };