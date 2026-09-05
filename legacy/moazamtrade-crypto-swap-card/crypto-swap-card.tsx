import * as React from "react"
import useSWR from "swr"
import { motion, AnimatePresence } from "framer-motion"

type Coin = {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  price_change_percentage_24h: number | null
  market_cap_rank: number | null
}

const fetcher = async (url: string) => {
  const res = await fetch(url, { cache: "no-store" })
  if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`)
  return res.json() as Promise<Coin[]>
}

const COINGECKO_URL =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h"

export type SwapCardProps = {
  defaultFromId?: string
  defaultToId?: string
  className?: string
}

export default function SwapCard({
  defaultFromId = "bitcoin",
  defaultToId = "ethereum",
  className = "",
}: SwapCardProps) {
  const { data, error, isLoading, mutate } = useSWR<Coin[]>(COINGECKO_URL, fetcher, {
    refreshInterval: 15000,
    revalidateOnFocus: true,
    dedupingInterval: 5000,
  })

  const coinMap = React.useMemo(() => {
    const map = new Map<string, Coin>()
    data?.forEach((c) => map.set(c.id, c))
    return map
  }, [data])

  const initialFrom = coinMap.get(defaultFromId)?.id || (data?.[0]?.id ?? "")
  const initialTo =
    coinMap.get(defaultToId)?.id || (data?.find((c) => c.id !== initialFrom)?.id ?? "")

  const [fromId, setFromId] = React.useState<string>(initialFrom)
  const [toId, setToId] = React.useState<string>(initialTo)
  const [fromAmount, setFromAmount] = React.useState<string>("1")

  React.useEffect(() => {
    if (!data?.length) return
    if (!coinMap.has(fromId)) setFromId(initialFrom)
    if (!coinMap.has(toId) || initialFrom === initialTo) setToId(initialTo)
  }, [data])

  const fromCoin = fromId ? coinMap.get(fromId) : undefined
  const toCoin = toId ? coinMap.get(toId) : undefined

  const parsedAmount = React.useMemo(() => {
    const n = Number(fromAmount)
    return Number.isFinite(n) && n >= 0 ? n : 0
  }, [fromAmount])

  const toAmount = React.useMemo(() => {
    if (!fromCoin || !toCoin) return 0
    if (toCoin.current_price <= 0) return 0
    return parsedAmount * (fromCoin.current_price / toCoin.current_price)
  }, [fromCoin, toCoin, parsedAmount])

  function swapSides() {
    setFromId(toId)
    setToId(fromId)
  }

  function formatFiat(n: number) {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: n < 1 ? 6 : 2,
    }).format(n)
  }

  function formatToken(n: number) {
    const max = n < 1 ? 8 : 6
    return new Intl.NumberFormat(undefined, {
      maximumFractionDigits: max,
    }).format(n)
  }

  const loading = isLoading && !data
  const stateError = !!error

  const Price = ({ value }: { value: number }) => (
    <div className="min-w-[80px] text-right">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={Number.isFinite(value) ? value.toFixed(6) : "na"}
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -8, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="tabular-nums"
        >
          {formatFiat(value)}
        </motion.span>
      </AnimatePresence>
    </div>
  )

  return (
    <motion.section
      role="region"
      aria-label="Crypto swap"
      className={[
        "w-full max-w-md sm:max-w-lg",
        "rounded-lg border border-border bg-card text-card-foreground",
        "shadow-sm p-4 sm:p-6 md:p-8",
        "flex flex-col gap-4 sm:gap-6",
        className,
      ].join(" ")}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-pretty text-lg sm:text-xl font-semibold">Swap</h2>
          <p className="text-sm text-muted-foreground">
            Real‑time prices and logos from CoinGecko
          </p>
        </div>
        <button
          type="button"
          onClick={() => mutate()}
          className={[
            "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm",
            "border border-border bg-secondary hover:bg-accent transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          ].join(" ")}
          aria-label="Refresh prices"
        >
          <span className="sr-only sm:not-sr-only">Refresh</span>
          ⟳
        </button>
      </header>

      {loading && (
        <div
          className="animate-pulse rounded-md border border-border bg-muted h-28"
          aria-busy="true"
          aria-live="polite"
        />
      )}

      {stateError && (
        <div
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/10 text-destructive-foreground px-3 py-2 text-sm"
        >
          Failed to load market data. Please try again.
        </div>
      )}

      {!loading && !stateError && (
        <>
          {/* From */}
          <div className="grid grid-cols-1 gap-3 sm:gap-4 items-end">
            <div className="flex flex-col gap-2">
              <label htmlFor="from-amount" className="text-sm">
                You pay
              </label>
              <div
                className={[
                  "flex items-center gap-3 rounded-md border border-border bg-background px-3 py-2.5",
                  "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
                ].join(" ")}
              >
                <TokenSelector
                  coins={data ?? []}
                  selectedId={fromId}
                  onSelect={(id) => {
                    if (id === toId) setToId(fromId)
                    setFromId(id)
                  }}
                  side="from"
                />
                <input
                  id="from-amount"
                  inputMode="decimal"
                  pattern="^[0-9]*[.,]?[0-9]*$"
                  placeholder="0.00"
                  className="flex-1 bg-transparent outline-none text-right text-lg sm:text-xl placeholder:text-muted-foreground"
                  value={fromAmount}
                  onChange={(e) => {
                    const v = e.target.value.replace(",", ".")
                    if (v === "" || /^[0-9]*\.?[0-9]*$/.test(v)) setFromAmount(v)
                  }}
                  aria-label="Amount you pay"
                />
              </div>
              {fromCoin && (
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">{fromCoin.name} price</span>
                  <Price value={fromCoin.current_price} />
                </div>
              )}
            </div>
          </div>

          {/* Swap button */}
          <div className="flex items-center justify-center">
            <motion.button
              type="button"
              onClick={swapSides}
              className={[
                "rounded-full border border-border bg-secondary hover:bg-accent px-4 py-2 text-sm",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              ].join(" ")}
              whileTap={{ scale: 0.96, rotate: 180 }}
              aria-label="Swap tokens"
              title="Swap tokens"
            >
              ⇅ Swap
            </motion.button>
          </div>

          {/* To */}
          <div className="grid grid-cols-1 gap-3 sm:gap-4 items-end">
            <div className="flex flex-col gap-2">
              <label htmlFor="to-amount" className="text-sm">
                You receive
              </label>
              <div
                className={[
                  "flex items-center gap-3 rounded-md border border-border bg-background px-3 py-2.5",
                  "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
                ].join(" ")}
              >
                <TokenSelector
                  coins={data ?? []}
                  selectedId={toId}
                  onSelect={(id) => {
                    if (id === fromId) setFromId(toId)
                    setToId(id)
                  }}
                  side="to"
                />
                <output
                  id="to-amount"
                  className="flex-1 text-right text-lg sm:text-xl"
                  aria-live="polite"
                >
                  {toCoin ? formatToken(toAmount) : "0"}
                </output>
              </div>
              {toCoin && (
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">{toCoin.name} price</span>
                  <Price value={toCoin.current_price} />
                </div>
              )}
            </div>
          </div>

          {fromCoin && toCoin && (
            <motion.div
              className="rounded-md border border-border bg-muted px-3 py-2 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              1 {fromCoin.symbol.toUpperCase()} ≈{" "}
              {formatToken(fromCoin.current_price / toCoin.current_price)}{" "}
              {toCoin.symbol.toUpperCase()} • 24h:{" "}
              <span
                className={(fromCoin.price_change_percentage_24h ?? 0) >= 0 ? "text-emerald-500" : "text-red-500"}
              >
                {(fromCoin.price_change_percentage_24h ?? 0).toFixed(2)}%
              </span>
            </motion.div>
          )}

          <motion.button
            type="button"
            disabled={!fromCoin || !toCoin || parsedAmount <= 0}
            className={[
              "w-full rounded-md px-4 py-3 text-sm font-medium transition-colors",
              "bg-primary text-primary-foreground hover:opacity-90",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            ].join(" ")}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              alert(
                `Simulated swap:\n${parsedAmount} ${fromCoin?.symbol.toUpperCase()} -> ${formatToken(
                  toAmount,
                )} ${toCoin?.symbol.toUpperCase()}`,
              )
            }}
          >
            Swap Now
          </motion.button>

          {/* Footer */}
          <footer className="flex items-center justify-between text-xs text-muted-foreground">
            <a
              href="https://www.coingecko.com/en/api"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:no-underline"
            >
              Powered by CoinGecko
            </a>
            <span aria-label="Auto-refresh interval">Updates every 15s</span>
          </footer>
        </>
      )}
    </motion.section>
  )
}

function TokenSelector({
  coins,
  selectedId,
  onSelect,
  side,
}: {
  coins: Coin[]
  selectedId: string
  onSelect: (id: string) => void
  side: "from" | "to"
}) {
  const selected = coins.find((c) => c.id === selectedId) ?? coins[0]

  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [activeIndex, setActiveIndex] = React.useState(0)
  const buttonRef = React.useRef<HTMLButtonElement | null>(null)
  const listRef = React.useRef<HTMLDivElement | null>(null)
  const inputRef = React.useRef<HTMLInputElement | null>(null)

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return coins
    return coins.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.symbol.toLowerCase().includes(q) ||
        (c.market_cap_rank ? String(c.market_cap_rank).includes(q) : false),
    )
  }, [coins, query])

  React.useEffect(() => {
    if (!open) return
    setActiveIndex(0)
    const t = setTimeout(() => inputRef.current?.focus(), 10)
    return () => clearTimeout(t)
  }, [open])

  function formatCompact(n: number) {
    try {
      return new Intl.NumberFormat(undefined, {
        notation: "compact",
        maximumFractionDigits: 2,
      }).format(n)
    } catch {
      if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + "B"
      if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M"
      if (n >= 1_000) return (n / 1_000).toFixed(1) + "K"
      return n.toString()
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) return
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, Math.max(filtered.length - 1, 0)))
      scrollActiveIntoView()
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
      scrollActiveIntoView()
    } else if (e.key === "Enter") {
      e.preventDefault()
      const item = filtered[activeIndex]
      if (item) {
        onSelect(item.id)
        setOpen(false)
        buttonRef.current?.focus()
      }
    } else if (e.key === "Escape") {
      e.preventDefault()
      setOpen(false)
      buttonRef.current?.focus()
    }
  }

  function scrollActiveIntoView() {
    const list = listRef.current
    if (!list) return
    const el = list.querySelector<HTMLButtonElement>('[data-active="true"]')
    if (el) {
      const box = el.getBoundingClientRect()
      const parent = list.getBoundingClientRect()
      if (box.top < parent.top) el.scrollIntoView({ block: "nearest" })
      else if (box.bottom > parent.bottom) el.scrollIntoView({ block: "nearest" })
    }
  }

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`token-popover-${side}`}
        onClick={() => setOpen((o) => !o)}
        className={[
          "inline-flex items-center gap-2 rounded-md",
          "border border-border bg-secondary hover:bg-accent",
          "px-2.5 py-1.5 text-sm transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        ].join(" ")}
        title="Choose token"
      >
        <img
          src={selected?.image || "/placeholder.svg"}
          alt={`${selected?.name} logo`}
          width={20}
          height={20}
          className="size-5 rounded-full border border-border object-cover"
          crossOrigin="anonymous"
        />
        <span className="font-medium">{selected?.symbol?.toUpperCase()}</span>
        <span className="text-muted-foreground hidden sm:inline-block text-xs">
          {selected?.name}
        </span>
        <span aria-hidden="true" className="ml-1 text-xs">▼</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={`token-popover-${side}`}
            role="listbox"
            aria-label="Select token"
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className={[
              "absolute z-50 mt-2 w-[min(82vw,22rem)] sm:w-[22rem]",
              "rounded-md border border-border bg-popover text-popover-foreground",
              "shadow-md overflow-hidden",
            ].join(" ")}
            onKeyDown={handleKeyDown}
          >
            <div className="p-2 border-b border-border">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, symbol, rank…"
                className={[
                  "w-full rounded-md bg-background px-3 py-2 text-sm outline-none",
                  "border border-border focus:ring-2 focus:ring-ring",
                ].join(" ")}
                aria-label="Search tokens"
              />
            </div>

            <div
              ref={listRef}
              className="max-h-72 overflow-auto p-1"
              tabIndex={-1}
            >
              {filtered.length === 0 && (
                <div className="px-3 py-4 text-sm text-muted-foreground">
                  No results
                </div>
              )}
              {filtered.map((c, idx) => {
                const active = idx === activeIndex
                const change = c.price_change_percentage_24h ?? 0
                const changeClass =
                  change > 0 ? "text-emerald-500" : change < 0 ? "text-red-500" : "text-muted-foreground"

                return (
                  <button
                    key={c.id}
                    role="option"
                    aria-selected={c.id === selectedId}
                    data-active={active ? "true" : undefined}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => {
                      onSelect(c.id)
                      setOpen(false)
                      setQuery("")
                      buttonRef.current?.focus()
                    }}
                    className={[
                      "w-full flex items-center gap-3 rounded-md px-2.5 py-2 text-left",
                      c.id === selectedId
                        ? "bg-accent/70"
                        : active
                        ? "bg-accent"
                        : "hover:bg-accent",
                      "transition-colors",
                    ].join(" ")}
                  >
                    <img
                      src={c.image || "/placeholder.svg"}
                      alt=""
                      width={22}
                      height={22}
                      className="size-5.5 rounded-full border border-border object-cover"
                      crossOrigin="anonymous"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">
                          {c.symbol.toUpperCase()}
                        </span>
                        <span className="text-xs text-muted-foreground truncate">
                          {c.name}
                        </span>
                        {c.market_cap_rank != null && (
                          <span className="ml-auto text-[11px] text-muted-foreground">
                            #{c.market_cap_rank}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-muted-foreground">
                          {new Intl.NumberFormat(undefined, {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 6,
                          }).format(c.current_price)}
                        </span>
                        <span className={changeClass}>
                          {change >= 0 ? "+" : ""}
                          {change.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {open && (
        <ClickOutside onClick={() => setOpen(false)} />
      )}
    </div>
  )
}

function ClickOutside({ onClick }: { onClick: () => void }) {
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClick()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [onClick])

  return (
    <div
      onClick={onClick}
      className="fixed inset-0 z-40"
      aria-hidden="true"
    />
  )
}