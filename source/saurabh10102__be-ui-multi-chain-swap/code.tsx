"use client";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowDownUp,
  Check,
  ChevronDown,
  Clock3,
  Loader2,
  Settings,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;
export const EASE_DRAWER = [0.32, 0.72, 0, 1] as const;
export const SWAP_DRAWER_EASE = EASE_DRAWER;

export const EASE_OUT_CSS = "cubic-bezier(0.16, 1, 0.3, 1)";

export const SPRING_PRESS = {
  type: "spring",
  stiffness: 500,
  damping: 30,
  mass: 0.6,
} as const;

export const SPRING_SWAP = {
  type: "spring",
  stiffness: 460,
  damping: 30,
  mass: 0.55,
} as const;

export const SPRING_PANEL = {
  type: "spring",
  stiffness: 420,
  damping: 40,
  mass: 0.5,
} as const;

export const SPRING_LAYOUT = {
  type: "spring",
  stiffness: 360,
  damping: 32,
  mass: 0.6,
} as const;

export const SPRING_MOUSE = {
  stiffness: 200,
  damping: 15,
  mass: 0.3,
} as const;

export type TokenSide = "from" | "to";

export interface Chain {
  id: string;
  name: string;
  shortName: string;
  color: string;
}

export interface Token {
  id: string;
  chainId: string;
  symbol: string;
  name: string;
  balance: number;
  usd: number;
  icon: string;
}

const CHAINS: Chain[] = [
  {
    id: "ethereum",
    name: "Ethereum",
    shortName: "ETH",
    color: "#627eea",
  },
  {
    id: "solana",
    name: "Solana",
    shortName: "SOL",
    color: "#14f195",
  },
  {
    id: "polygon",
    name: "Polygon",
    shortName: "POL",
    color: "#8247e5",
  },
  {
    id: "base",
    name: "Base",
    shortName: "BASE",
    color: "#0052ff",
  },
];

const TOKENS: Token[] = [
  {
    id: "eth-eth",
    chainId: "ethereum",
    symbol: "ETH",
    name: "Ethereum",
    balance: 2.84,
    usd: 3520,
    icon: "Ξ",
  },
  {
    id: "eth-usdc",
    chainId: "ethereum",
    symbol: "USDC",
    name: "USD Coin",
    balance: 1240.8,
    usd: 1,
    icon: "$",
  },
  {
    id: "sol-sol",
    chainId: "solana",
    symbol: "SOL",
    name: "Solana",
    balance: 48.2,
    usd: 148,
    icon: "◎",
  },
  {
    id: "sol-usdc",
    chainId: "solana",
    symbol: "USDC",
    name: "USD Coin",
    balance: 860.15,
    usd: 1,
    icon: "$",
  },
  {
    id: "pol-matic",
    chainId: "polygon",
    symbol: "POL",
    name: "Polygon",
    balance: 1320,
    usd: 0.42,
    icon: "⬡",
  },
  {
    id: "base-eth",
    chainId: "base",
    symbol: "ETH",
    name: "Ethereum",
    balance: 0.74,
    usd: 3520,
    icon: "Ξ",
  },
];

export interface MultiChainSwapProps {
  chains?: Chain[];
  tokens?: Token[];
  defaultFromId?: string;
  defaultToId?: string;
  className?: string;
}

export function MultiChainSwap({
  chains = CHAINS,
  tokens = TOKENS,
  defaultFromId = "eth-eth",
  defaultToId = "sol-sol",
  className,
}: MultiChainSwapProps) {
  const reduce = useReducedMotion();
  const [fromId, setFromId] = useState(defaultFromId);
  const [toId, setToId] = useState(defaultToId);
  const [amount, setAmount] = useState("1");
  const [flipRot, setFlipRot] = useState(0);
  const [quoting, setQuoting] = useState(false);
  const [picking, setPicking] = useState<TokenSide | null>(null);
  const [showDest, setShowDest] = useState(false);
  const [destAddress, setDestAddress] = useState("");

  const from = findToken(tokens, fromId);
  const to = findToken(tokens, toId);
  const fromChain = findChain(chains, from.chainId);
  const toChain = findChain(chains, to.chainId);

  const numericAmount = Number(amount) || 0;
  const quoteKey = `${numericAmount}:${fromId}:${toId}`;

  const rate = useMemo(() => {
    if (!from.usd || !to.usd) return 1;
    return from.usd / to.usd;
  }, [from.usd, to.usd]);

  const toAmount = numericAmount * rate;

  useEffect(() => {
    if (!quoteKey) return;
    if (numericAmount === 0) return;

    setQuoting(true);

    const id = setTimeout(() => setQuoting(false), 450);

    return () => clearTimeout(id);
  }, [numericAmount, quoteKey]);

  const flip = () => {
    setFlipRot((r) => r + 180);
    setFromId(toId);
    setToId(fromId);
  };

  const pickToken = (id: string) => {
    if (!picking) return;

    if (picking === "from") {
      if (id === toId) setToId(fromId);
      setFromId(id);
    } else {
      if (id === fromId) setFromId(toId);
      setToId(id);
    }

    setPicking(null);
  };

  return (
    <div
      className={cn(
        "relative isolate w-full max-w-[420px] overflow-hidden rounded-3xl",
        "border border-border/20 bg-card shadow-2xl shadow-black/10",
        className,
      )}
    >
      <div className="flex h-12 items-center justify-between border-b border-border/50 px-3">
        <span className="px-2 text-sm font-semibold tracking-tight text-foreground">
          Swap
        </span>

        <button
          type="button"
          aria-label="Settings"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-transform hover:bg-primary/5 hover:text-foreground active:scale-[0.97]"
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-col gap-1.5 p-4">
        <Field
          side="from"
          token={from}
          chain={fromChain}
          amount={amount}
          onAmount={setAmount}
          editable
          quoting={false}
          onOpenPicker={() => setPicking("from")}
        />

        <FlipButton rotation={flipRot} reduce={!!reduce} onClick={flip} />

        <Field
          side="to"
          token={to}
          chain={toChain}
          amount={toAmount > 0 ? formatAmount(toAmount) : ""}
          editable={false}
          quoting={quoting}
          onOpenPicker={() => setPicking("to")}
        />

        <QuoteRow
          from={from}
          to={to}
          rate={rate}
          fee={0.42}
          slippage={0.5}
          eta="≈ 24s"
          quoting={quoting}
        />

        <DestinationRow
          show={showDest}
          onToggle={() => {
            if (showDest) setDestAddress("");
            setShowDest((v) => !v);
          }}
          address={destAddress}
          onAddress={setDestAddress}
          reduce={!!reduce}
        />

        <ActionButton
          from={from}
          to={to}
          amount={numericAmount}
          destAddress={destAddress}
        />
      </div>

      <TokenPicker
        open={picking !== null}
        side={picking}
        chains={chains}
        tokens={tokens}
        selectedId={picking === "from" ? fromId : toId}
        onPick={pickToken}
        onClose={() => setPicking(null)}
        reduce={!!reduce}
      />
    </div>
  );
}

interface FieldProps {
  side: TokenSide;
  token: Token;
  chain: Chain;
  amount: string;
  onAmount?: (value: string) => void;
  editable: boolean;
  quoting: boolean;
  onOpenPicker: () => void;
}

function Field({
  side,
  token,
  chain,
  amount,
  onAmount,
  editable,
  quoting,
  onOpenPicker,
}: FieldProps) {
  const label = side === "from" ? "You pay" : "You receive";

  return (
    <div className="rounded-2xl border border-border/40 bg-muted/30 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          {label}
        </span>
        <span className="text-xs text-muted-foreground">
          Balance {formatAmount(token.balance)}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          {editable ? (
            <input
              value={amount}
              onChange={(e) => onAmount?.(e.target.value)}
              inputMode="decimal"
              className="w-full bg-transparent text-3xl font-semibold tracking-tight text-foreground outline-none placeholder:text-muted-foreground"
              placeholder="0"
            />
          ) : (
            <div className="h-10 text-3xl font-semibold tracking-tight text-foreground">
              {quoting ? (
                <Loader2 className="mt-1 h-7 w-7 animate-spin text-muted-foreground" />
              ) : (
                amount || "0"
              )}
            </div>
          )}

          <div className="mt-1 text-xs text-muted-foreground">
            ≈ ${formatAmount((Number(amount) || 0) * token.usd)}
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenPicker}
          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-card px-2.5 py-2 text-sm font-semibold text-foreground shadow-sm transition-transform active:scale-[0.97]"
        >
          <TokenIcon token={token} chain={chain} />
          <span>{token.symbol}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-background/70 px-2 py-1 text-xs text-muted-foreground">
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: chain.color }}
        />
        {chain.name}
      </div>
    </div>
  );
}

interface FlipButtonProps {
  rotation: number;
  reduce: boolean;
  onClick: () => void;
}

function FlipButton({ rotation, reduce, onClick }: FlipButtonProps) {
  return (
    <div className="relative z-10 -my-3 flex justify-center">
      <motion.button
        type="button"
        onClick={onClick}
        animate={reduce ? undefined : { rotate: rotation }}
        transition={SPRING_SWAP}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-lg shadow-black/10 transition-transform active:scale-[0.96]"
        aria-label="Flip tokens"
      >
        <ArrowDownUp className="h-4 w-4" />
      </motion.button>
    </div>
  );
}

interface QuoteRowProps {
  from: Token;
  to: Token;
  rate: number;
  fee: number;
  slippage: number;
  eta: string;
  quoting: boolean;
}

function QuoteRow({ from, to, rate, fee, slippage, eta, quoting }: QuoteRowProps) {
  return (
    <div className="mt-2 rounded-2xl border border-border/40 bg-background/60 p-3">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Rate</span>
        <span className="font-medium text-foreground">
          1 {from.symbol} = {formatAmount(rate)} {to.symbol}
        </span>
      </div>

      <div className="mt-2 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Network fee</span>
        <span className="font-medium text-foreground">${fee.toFixed(2)}</span>
      </div>

      <div className="mt-2 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Slippage</span>
        <span className="font-medium text-foreground">{slippage}%</span>
      </div>

      <div className="mt-2 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">ETA</span>
        <span className="inline-flex items-center gap-1 font-medium text-foreground">
          {quoting ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Clock3 className="h-3 w-3" />
          )}
          {eta}
        </span>
      </div>
    </div>
  );
}

interface DestinationRowProps {
  show: boolean;
  onToggle: () => void;
  address: string;
  onAddress: (value: string) => void;
  reduce: boolean;
}

function DestinationRow({
  show,
  onToggle,
  address,
  onAddress,
  reduce,
}: DestinationRowProps) {
  return (
    <div className="mt-1">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between rounded-2xl border border-border/40 bg-background/60 px-3 py-3 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted/50"
      >
        <span>Send to another wallet</span>
        <span className="text-xs text-muted-foreground">
          {show ? "Hide" : "Optional"}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {show && (
          <motion.div
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={SPRING_PANEL}
            className="overflow-hidden"
          >
            <input
              value={address}
              onChange={(e) => onAddress(e.target.value)}
              placeholder="Destination address"
              className="mt-2 h-11 w-full rounded-2xl border border-border/40 bg-muted/30 px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-border"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface ActionButtonProps {
  from: Token;
  to: Token;
  amount: number;
  destAddress: string;
}

function ActionButton({ from, to, amount, destAddress }: ActionButtonProps) {
  const disabled = amount <= 0 || amount > from.balance;
  const label =
    amount <= 0
      ? "Enter amount"
      : amount > from.balance
        ? `Insufficient ${from.symbol}`
        : destAddress
          ? `Swap and send ${to.symbol}`
          : `Swap to ${to.symbol}`;

  return (
    <button
      type="button"
      disabled={disabled}
      className="mt-2 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-foreground px-5 text-sm font-semibold text-background transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {label}
    </button>
  );
}

interface TokenPickerProps {
  open: boolean;
  side: TokenSide | null;
  chains: Chain[];
  tokens: Token[];
  selectedId: string;
  onPick: (id: string) => void;
  onClose: () => void;
  reduce: boolean;
}

function TokenPicker({
  open,
  side,
  chains,
  tokens,
  selectedId,
  onPick,
  onClose,
  reduce,
}: TokenPickerProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close token picker"
            onClick={onClose}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 bg-background/60 backdrop-blur-sm"
          />

          <motion.div
            initial={reduce ? false : { y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: reduce ? 0.15 : 0.45, ease: EASE_DRAWER }}
            className="absolute inset-x-0 bottom-0 z-50 rounded-t-3xl border border-border bg-card p-4 shadow-2xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Select token
                </p>
                <p className="text-xs text-muted-foreground">
                  {side === "from" ? "Token to pay with" : "Token to receive"}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[360px] space-y-2 overflow-auto pr-1">
              {tokens.map((token) => {
                const chain = findChain(chains, token.chainId);
                const selected = token.id === selectedId;

                return (
                  <button
                    key={token.id}
                    type="button"
                    onClick={() => onPick(token.id)}
                    className="flex w-full items-center gap-3 rounded-2xl border border-transparent p-3 text-left transition-colors hover:border-border hover:bg-muted/50"
                  >
                    <TokenIcon token={token} chain={chain} />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">
                          {token.symbol}
                        </span>
                        <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                          {chain.shortName}
                        </span>
                      </div>
                      <p className="truncate text-xs text-muted-foreground">
                        {token.name}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">
                        {formatAmount(token.balance)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ${formatAmount(token.balance * token.usd)}
                      </p>
                    </div>

                    {selected && <Check className="h-4 w-4 text-foreground" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function TokenIcon({ token, chain }: { token: Token; chain: Chain }) {
  return (
    <span
      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
      style={{ backgroundColor: chain.color }}
    >
      {token.icon}
    </span>
  );
}

function formatAmount(value: number) {
  if (!Number.isFinite(value)) return "0";
  if (value === 0) return "0";
  if (value < 0.0001) return "<0.0001";
  if (value < 1) return value.toFixed(4);
  if (value < 1000) return value.toLocaleString(undefined, { maximumFractionDigits: 4 });
  return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function findToken(tokens: Token[], id: string) {
  const token = tokens.find((t) => t.id === id);

  if (!token) {
    throw new Error(`Unknown token id: ${id}`);
  }

  return token;
}

function findChain(chains: Chain[], id: string) {
  const chain = chains.find((c) => c.id === id);

  if (!chain) {
    throw new Error(`Unknown chain id: ${id}`);
  }

  return chain;
}