"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  ResponsiveContainer,
} from "recharts"

type DataPoint = {
  time: string
  price: number
  isNew: boolean
}

type Product = {
  coin: string // BTC, ETH, SOL, etc.
  fiat: string // USD, EUR, GBP
}

// Utility: format time
const formatTime = (time: string) => {
  const date = new Date(time)
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
}

// Initial seeded data to avoid empty chart
const makeInitialData = (base = 100, n = 20): DataPoint[] =>
  Array.from({ length: n }, (_, i) => ({
    time: new Date(Date.now() - (n - 1 - i) * 1000).toISOString(),
    price: base + Math.random() * 5 * (Math.random() > 0.5 ? 1 : -1),
    isNew: false,
  }))

// Coinbase WS product id maps: e.g., BTC + USD => BTC-USD
const toCoinbaseProductId = ({ coin, fiat }: Product) => `${coin.toUpperCase()}-${fiat.toUpperCase()}`

// CoinGecko mapping: ids and vs_currency
// This is a small set; add more as needed
const COINGECKO_IDS: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana",
  XRP: "ripple",
  ADA: "cardano",
  DOGE: "dogecoin",
  LTC: "litecoin",
}
const SUPPORTED_COINS = Object.keys(COINGECKO_IDS)
const SUPPORTED_FIATS = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD"]

// Colors for price direction
const upColor = "#10b981" // emerald-500
const downColor = "#ef4444" // red-500
const gridColor = "hsl(0 0% 60% / 0.2)" // subtle grid

// Simple responsive Tabs without external lib
function Tabs({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div className="inline-flex items-center rounded-full bg-white/10 dark:bg-black/20 p-1 backdrop-blur">
      {options.map((opt) => {
        const active = value === opt.value
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={[
              "px-3 py-1.5 text-sm rounded-full transition",
              active
                ? "bg-white/80 dark:bg-white/10 text-gray-900 dark:text-white shadow"
                : "text-gray-700 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-white/5",
            ].join(" ")}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

// Switch replacement
function Switch({
  checked,
  onChange,
  label,
  disabled = false,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label?: string
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={[
        "relative inline-flex h-6 w-11 items-center rounded-full transition",
        checked ? "bg-emerald-500" : "bg-gray-400/60 dark:bg-gray-600",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
      ].join(" ")}
      aria-pressed={checked}
      aria-label={label || "Toggle"}
    >
      <span
        className={[
          "inline-block h-5 w-5 transform rounded-full bg-white transition",
          checked ? "translate-x-5" : "translate-x-1",
        ].join(" ")}
      />
    </button>
  )
}

// Tooltip content for Recharts
function ChartTooltipContent({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: any
  label?: string
}) {
  if (!active || !payload?.length) return null
  const p = payload[0]?.value as number
  return (
    <div className="rounded-lg border border-white/20 bg-white/80 dark:bg-black/60 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 shadow-md backdrop-blur">
      <div className="font-medium">{formatTime(label || "")}</div>
      <div className="opacity-80">${p?.toFixed(2)}</div>
    </div>
  )
}

// Main component
export default function RealTimeGlassChart() {
  const [darkMode, setDarkMode] = useState(true)
  const [isRunning, setIsRunning] = useState(true)
  const [chartType, setChartType] = useState<"line" | "area">("line")
  const [product, setProduct] = useState<Product>({ coin: "BTC", fiat: "USD" })
  const [data, setData] = useState<DataPoint[]>(makeInitialData(100))
  const [wsStatus, setWsStatus] = useState<"connected" | "disconnected" | "connecting">("connecting")
  const wsRef = useRef<WebSocket | null>(null)
  const pollingRef = useRef<number | null>(null)

  // price stats
  const latestPrice = data[data.length - 1]?.price || 0
  const previousPrice = data[data.length - 2]?.price || latestPrice
  const priceChange = latestPrice - previousPrice
  const percentChange = previousPrice ? (priceChange / previousPrice) * 100 : 0
  const isPriceUp = priceChange >= 0

  // Dark mode toggler on the root html element
  useEffect(() => {
    const root = document.documentElement
    if (darkMode) root.classList.add("dark")
    else root.classList.remove("dark")
  }, [darkMode])

  // Helper to push a new datapoint
  const pushPoint = (price: number) => {
    setData((curr) => {
      const updated = curr.map((p) => ({ ...p, isNew: false }))
      return [...updated.slice(Math.max(0, updated.length - 19)), { time: new Date().toISOString(), price, isNew: true }]
    })
  }

  // Coinbase WebSocket setup
  useEffect(() => {
    if (!isRunning) {
      // stop WS and polling
      if (wsRef.current) {
        try {
          wsRef.current.close()
        } catch {}
        wsRef.current = null
      }
      if (pollingRef.current) {
        clearInterval(pollingRef.current)
        pollingRef.current = null
      }
      return
    }

    // Close any previous connections
    if (wsRef.current) {
      try {
        wsRef.current.close()
      } catch {}
      wsRef.current = null
    }
    if (pollingRef.current) {
      clearInterval(pollingRef.current)
      pollingRef.current = null
    }

    const productId = toCoinbaseProductId(product)
    const ws = new WebSocket("wss://ws-feed.exchange.coinbase.com")
    wsRef.current = ws
    setWsStatus("connecting")

    ws.onopen = () => {
      setWsStatus("connected")
      const msg = {
        type: "subscribe",
        product_ids: [productId],
        channels: ["ticker"],
      }
      ws.send(JSON.stringify(msg))
    }

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data)
        if (payload?.type === "ticker" && payload?.price) {
          const p = parseFloat(payload.price)
          if (!Number.isNaN(p)) pushPoint(p)
        }
      } catch {
        // ignore
      }
    }

    ws.onerror = () => {
      setWsStatus("disconnected")
    }

    ws.onclose = () => {
      setWsStatus("disconnected")
      // start fallback polling to CoinGecko
      startCoinGeckoPolling(product, pushPoint)
    }

    return () => {
      try {
        ws.close()
      } catch {}
      wsRef.current = null
      if (pollingRef.current) {
        clearInterval(pollingRef.current)
        pollingRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.coin, product.fiat, isRunning])

  // Fallback polling to CoinGecko
  const startCoinGeckoPolling = (prod: Product, onPrice: (p: number) => void) => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current)
      pollingRef.current = null
    }
    const coinId = COINGECKO_IDS[prod.coin.toUpperCase()]
    const vs = prod.fiat.toLowerCase()
    if (!coinId) return

    const fetchPrice = async () => {
      try {
        const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=${vs}`
        const res = await fetch(url)
        if (!res.ok) return
        const json = await res.json()
        const price = json?.[coinId]?.[vs]
        if (typeof price === "number") onPrice(price)
      } catch {
        // ignore
      }
    }

    fetchPrice()
    const id = window.setInterval(fetchPrice, 2000)
    pollingRef.current = id as unknown as number
  }

  // When switching product, reset the chart with a seeded baseline using last known price
  useEffect(() => {
    const base = latestPrice || 100
    setData(makeInitialData(base))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.coin, product.fiat])

  // Custom dot components
  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props
    if (!payload || !payload.isNew) return null
    return (
      <circle
        cx={cx}
        cy={cy}
        r={6}
        fill={isPriceUp ? upColor : downColor}
        stroke="none"
        className="animate-pulse"
      />
    )
  }
  const CustomActiveDot = (props: any) => {
    const { cx, cy } = props
    return <circle cx={cx} cy={cy} r={6} fill={isPriceUp ? upColor : downColor} stroke="currentColor" strokeWidth={2} />
  }

  // Title text like BTC/USD
  const title = `${product.coin}/${product.fiat}`

  // Background gradient for glass card
  // Glassmorphism via: bg-white/10 dark:bg-white/5 + backdrop-blur + border with alpha
  // Shadows tailored for depth
  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen h-full w-full dark:from-[#0b0f17] dark:to-[#0b0f17] transition-colors">
        <div className="mx-auto w-full max-w-5xl">
          <div className="relative rounded-2xl border border-white/20 dark:border-white/10 bg-white/10 dark:bg-white/5 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] p-4 sm:p-6 md:p-8">
            {/* Decorative glows */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl">
              <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-emerald-400/20 blur-3xl" />
              <div className="absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-cyan-400/20 blur-3xl" />
            </div>

            {/* Header */}
            <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">{title} Real-Time Chart</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Live price updates every second via Coinbase. Fallback to CoinGecko if needed.
                </p>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Dark Mode</span>
                  <Switch checked={darkMode} onChange={setDarkMode} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Live</span>
                  <Switch checked={isRunning} onChange={setIsRunning} />
                </div>
                <Tabs
                  value={chartType}
                  onChange={(v) => setChartType(v as "line" | "area")}
                  options={[
                    { value: "line", label: "Line" },
                    { value: "area", label: "Area" },
                  ]}
                />
              </div>
            </div>

            {/* Ticker row */}
            <div className="relative z-10 mt-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <div className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
                  ${latestPrice.toFixed(2)}
                </div>
                <div className={`mt-1 flex items-center ${isPriceUp ? "text-emerald-500" : "text-red-500"}`}>
                  <span className="mr-1">{isPriceUp ? "▲" : "▼"}</span>
                  <span className="font-medium">
                    ${priceChange.toFixed(2)} ({percentChange.toFixed(2)}%)
                  </span>
                </div>
                <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                  WS: {wsStatus === "connected" ? "Connected" : wsStatus === "connecting" ? "Connecting..." : "Disconnected (polling)"}
                </div>
              </div>

              {/* Pair selectors */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex flex-col">
                  <label className="text-xs text-gray-600 dark:text-gray-400 mb-1">Coin</label>
                  <select
                    value={product.coin}
                    onChange={(e) => setProduct((p) => ({ ...p, coin: e.target.value }))}
                    className="rounded-lg border border-white/30 bg-white/60 dark:bg-white/10 dark:text-gray-100 dark:placeholder-gray-400 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-400/50 backdrop-blur"
                  >
                    {SUPPORTED_COINS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-xs text-gray-600 dark:text-gray-400 mb-1">Fiat</label>
                  <select
                    value={product.fiat}
                    onChange={(e) => setProduct((p) => ({ ...p, fiat: e.target.value }))}
                    className="rounded-lg border border-white/30 bg-white/60 dark:bg-white/10 dark:text-gray-100 dark:placeholder-gray-400 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-400/50 backdrop-blur"
                  >
                    {SUPPORTED_FIATS.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="relative z-10 mt-6 h-[340px] sm:h-[400px]">
              <div className="h-full w-full rounded-xl border border-white/20 dark:border-white/10 bg-white/5 dark:bg-white/5 backdrop-blur-lg p-2 sm:p-3">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === "line" ? (
                    <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                      <XAxis
                        dataKey="time"
                        tickFormatter={formatTime}
                        tick={{ fontSize: 12, fill: "currentColor" }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        domain={["auto", "auto"]}
                        tick={{ fontSize: 12, fill: "currentColor" }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value: number) => `$${value.toFixed(2)}`}
                      />
                      <ReTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="price"
                        stroke={isPriceUp ? upColor : downColor}
                        strokeWidth={2}
                        dot={(props) => <CustomDot {...props} />}
                        activeDot={(props) => <CustomActiveDot {...props} />}
                        isAnimationActive={false}
                      />
                    </LineChart>
                  ) : (
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                      <XAxis
                        dataKey="time"
                        tickFormatter={formatTime}
                        tick={{ fontSize: 12, fill: "currentColor" }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        domain={["auto", "auto"]}
                        tick={{ fontSize: 12, fill: "currentColor" }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value: number) => `$${value.toFixed(2)}`}
                      />
                      <ReTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke={isPriceUp ? upColor : downColor}
                        fill={isPriceUp ? upColor : downColor}
                        fillOpacity={0.18}
                        strokeWidth={2}
                        dot={(props) => <CustomDot {...props} />}
                        activeDot={(props) => <CustomActiveDot {...props} />}
                        isAnimationActive={false}
                      />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>

            {/* Footer */}
            <div className="relative z-10 mt-6 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
              <span>Data: Coinbase WS, CoinGecko fallback</span>
              <span>Glass UI • Tailwind CSS • Recharts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}