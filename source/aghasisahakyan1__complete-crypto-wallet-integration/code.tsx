"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { clusterApiUrl } from "@solana/web3.js";
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { WalletName, WalletReadyState } from "@solana/wallet-adapter-base";
import { BackpackWalletAdapter } from "@solana/wallet-adapter-backpack";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Loader2, ChevronDown } from "lucide-react";

// Labels
const LABELS = {
  "change-wallet": "Change Wallet",
  connecting: "Connecting...",
  "copy-address": "Copy Address",
  copied: "Copied",
  disconnect: "Disconnect",
  "has-wallet": "Connect Wallet",
  "no-wallet": "Select Wallet",
} as const;

type WalletButtonProps = React.ComponentProps<"button"> & {
  labels?: Partial<Record<keyof typeof LABELS, string>>;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  icon?: React.ReactNode;
};

// Wallet modal for choosing wallets
export const WalletChooser = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
  const { wallets, select, connecting, connected } = useWallet();
  const [expanded, setExpanded] = useState(false);

  const { listedWallets, collapsedWallets } = useMemo(() => {
    const installed = wallets.filter((w) => w.readyState === WalletReadyState.Installed);
    const notInstalled = wallets.filter((w) => w.readyState !== WalletReadyState.Installed);
    return {
      listedWallets: installed.length ? installed : notInstalled,
      collapsedWallets: installed.length ? notInstalled : [],
    };
  }, [wallets]);

  const handleWalletClick = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>, walletName: string) => {
      event.preventDefault();
      try {
        select(walletName as WalletName);
      } catch (error) {
        console.error("Failed to select wallet:", error);
      }
    },
    [select]
  );

  useEffect(() => {
    if (connected) {
      onOpenChange(false);
    }
  }, [connected, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Connect wallet to continue</DialogTitle>
          <DialogDescription>Choose your preferred wallet to connect to this dApp.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {listedWallets.map((wallet) => (
            <button
              key={wallet.adapter.name}
              onClick={(e) => handleWalletClick(e, wallet.adapter.name)}
              disabled={connecting}
              className="flex w-full items-center justify-between rounded-lg p-3 text-left transition-colors hover:bg-secondary disabled:opacity-50"
            >
              <div className="flex items-center gap-2">
                {wallet.adapter.icon && (
                  <Image src={wallet.adapter.icon} alt={`${wallet.adapter.name} icon`} width={20} height={20} />
                )}
                <span className="font-medium">{wallet.adapter.name}</span>
                {connecting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              </div>
              <Badge variant="outline">
                {wallet.readyState === WalletReadyState.Installed ? "Installed" : "Not Installed"}
              </Badge>
            </button>
          ))}

          {collapsedWallets.length > 0 && (
            <Collapsible open={expanded} onOpenChange={setExpanded}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between">
                  <span>More wallet options</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2">
                {collapsedWallets.map((wallet) => (
                  <button
                    key={wallet.adapter.name}
                    onClick={(e) => handleWalletClick(e, wallet.adapter.name)}
                    disabled={connecting}
                    className="flex w-full items-center justify-between rounded-lg p-3 text-left transition-colors hover:bg-secondary disabled:opacity-50"
                  >
                    <div className="flex items-center gap-2">
                      {wallet.adapter.icon && (
                        <Image src={wallet.adapter.icon} alt={`${wallet.adapter.name} icon`} width={20} height={20} />
                      )}
                      <span className="font-medium">{wallet.adapter.name}</span>
                    </div>
                    <Badge variant="outline">
                      {wallet.readyState === WalletReadyState.Installed ? "Installed" : "Not Installed"}
                    </Badge>
                  </button>
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>

        <DialogClose asChild>
          <Button variant="outline" className="w-full mt-4">
            Close
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

// Wallet connect button with provider wrapper
export const WalletButton = ({ children, labels = LABELS, icon, ...props }: WalletButtonProps) => {
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { publicKey, wallet, disconnect, connecting, connected } = useWallet();

  const content = useMemo(() => {
    if (!mounted) return <span>{labels["no-wallet"]}</span>;

    if (children) return <>{children}</>;
    if (connecting) return <Loader2 className="h-4 w-4 animate-spin" />;
    if (connected && publicKey) {
      return (
        <div className="flex items-center gap-2">
          {wallet?.adapter.icon && <Image src={wallet.adapter.icon} alt="icon" width={20} height={20} />}
          <span>{`${publicKey.toBase58().slice(0, 6)}...${publicKey.toBase58().slice(-4)}`}</span>
        </div>
      );
    }
    return <span>{labels["has-wallet"]}</span>;
  }, [mounted, children, connecting, connected, publicKey, wallet, labels]);

  const handleCopyAddress = useCallback(async () => {
    if (publicKey) {
      await navigator.clipboard.writeText(publicKey.toBase58());
      setCopied(true);
      setTimeout(() => setCopied(false), 400);
    }
  }, [publicKey]);

  const handleDisconnect = useCallback(() => {
    disconnect();
    setMenuOpen(false);
  }, [disconnect]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!connected) {
    return (
      <>
        <WalletChooser open={walletModalOpen} onOpenChange={setWalletModalOpen} />
        <Button {...props} onClick={() => setWalletModalOpen(true)}>
          {content}
        </Button>
      </>
    );
  }

  return (
    <>
      <WalletChooser open={walletModalOpen} onOpenChange={setWalletModalOpen} />
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button {...props}>{content}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {publicKey && <DropdownMenuItem onClick={handleCopyAddress}>{copied ? labels["copied"] : labels["copy-address"]}</DropdownMenuItem>}
          <DropdownMenuItem onClick={() => { setWalletModalOpen(true); setMenuOpen(false); }}>{labels["change-wallet"]}</DropdownMenuItem>
          <DropdownMenuItem onClick={handleDisconnect}>{labels["disconnect"]}</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

// Wrap everything in providers so it "just works"
export const WalletConnect = ({ children }: { children: React.ReactNode }) => {
  const network = "devnet";
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter({ network }), new BackpackWalletAdapter()],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};