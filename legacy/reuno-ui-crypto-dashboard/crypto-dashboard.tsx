"use client"

import type React from "react"
import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BackgroundPlus } from "../../demos/background-plus"

const formatPrice = (price: number): string => {
  if (price < 0.01) return `$${price.toFixed(6)}`
  if (price < 1) return `$${price.toFixed(4)}`
  if (price < 100) return `$${price.toFixed(2)}`
  return `$${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const formatMarketCap = (marketCap: number): string => {
  if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`
  if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`
  if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`
  return `$${marketCap.toLocaleString()}`
}

const formatPercentage = (percentage: number): string => {
  const sign = percentage >= 0 ? "+" : ""
  return `${sign}${percentage.toFixed(2)}%`
}

const mockCryptoData = [
  {
    id: "bitcoin",
    symbol: "btc",
    name: "Bitcoin",
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    current_price: 43250.5,
    market_cap: 847500000000,
    market_cap_rank: 1,
    price_change_percentage_24h: 2.45,
    total_volume: 18500000000,
    high_24h: 44100.25,
    low_24h: 42800.75,
    sparkline_in_7d: { price: [42000, 42500, 43000, 42800, 43200, 43500, 43250] },
  },
  {
    id: "ethereum",
    symbol: "eth",
    name: "Ethereum",
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    current_price: 2650.75,
    market_cap: 318500000000,
    market_cap_rank: 2,
    price_change_percentage_24h: -1.25,
    total_volume: 12500000000,
    high_24h: 2720.5,
    low_24h: 2620.25,
    sparkline_in_7d: { price: [2700, 2680, 2650, 2670, 2640, 2660, 2650] },
  },
  {
    id: "binancecoin",
    symbol: "bnb",
    name: "BNB",
    image: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
    current_price: 315.25,
    market_cap: 47200000000,
    market_cap_rank: 4,
    price_change_percentage_24h: 0.85,
    total_volume: 1250000000,
    high_24h: 320.5,
    low_24h: 312.75,
    sparkline_in_7d: { price: [310, 312, 315, 318, 314, 316, 315] },
  },
  {
    id: "solana",
    symbol: "sol",
    name: "Solana",
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    current_price: 98.45,
    market_cap: 43500000000,
    market_cap_rank: 5,
    price_change_percentage_24h: 3.75,
    total_volume: 2100000000,
    high_24h: 102.25,
    low_24h: 95.5,
    sparkline_in_7d: { price: [95, 97, 99, 96, 98, 100, 98] },
  },
]

interface CryptoData {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  price_change_percentage_24h: number
  total_volume: number
  high_24h: number
  low_24h: number
  sparkline_in_7d: { price: number[] }
}

const useElementSize = <T extends HTMLElement>(): [React.RefObject<T>, { width: number; height: number }] => {
  const ref = useRef<T>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const update = () => {
      setSize({ width: node.clientWidth, height: node.clientHeight })
    }

    update()

    let ro: ResizeObserver | null = null
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(update)
      ro.observe(node)
    } else {
      window.addEventListener("resize", update)
    }

    return () => {
      if (ro) ro.disconnect()
      else window.removeEventListener("resize", update)
    }
  }, [])

  return [ref, size]
}

const ProfessionalCard: React.FC<{
  isActive?: boolean
  children: React.ReactNode
  className?: string
}> = ({ isActive, children, className }) => {
  return (
    <div className= {`relative w-full max-w-sm mx-auto ${className || ""}`
}>
  <BackgroundPlus
        className="absolute inset-0 rounded-2xl opacity-5"
plusColor = { isActive? "#3b82f6": "#6b7280" }
plusSize = { 40}
fade = { true}
  />

  <div className="relative rounded-2xl bg-white/95 dark:bg-zinc-950/95 backdrop-blur-sm" >
    <div className="relative z-10 p-4" > { children } < /div>
      < /div>
      < /div>
  )
}

const InteractiveChart: React.FC<{
  data: number[]
  positive: boolean
  className?: string
}> = ({ data, positive, className }) => {
  const [containerRef, { width, height }] = useElementSize<HTMLDivElement>()
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)
  const [isPointer, setIsPointer] = useState(false)

  const desiredHeight = 180

  const padding = { top: 20, right: 20, bottom: 30, left: 50 }
  const innerW = Math.max(0, width - padding.left - padding.right)
  const innerH = Math.max(0, desiredHeight - padding.top - padding.bottom)

  const minV = Math.min(...data)
  const maxV = Math.max(...data)
  const range = maxV - minV || 1

  const xFor = (i: number) => (data.length <= 1 ? 0 : (i / (data.length - 1)) * innerW)
  const yFor = (v: number) => innerH - ((v - minV) / range) * innerH

  const points = data.map((v, i) => [xFor(i), yFor(v)] as const)
  const dPath = useMemo(() => {
    if (!points.length) return ""
    return points.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(" ")
  }, [innerW, innerH, data])

  const gridLines = 3
  const gridYVals = Array.from({ length: gridLines + 1 }, (_, i) => minV + (i * range) / gridLines)

  const handlePointer = (clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = clientX - rect.left - padding.left
    if (x < 0 || x > innerW) {
      setHoverIdx(null)
      return
    }
    const ratio = x / innerW
    const idx = Math.max(0, Math.min(data.length - 1, Math.round(ratio * (data.length - 1))))
    setHoverIdx(idx)
  }

  return (
    <div
      ref= { containerRef }
  className = {`relative w-full cursor-crosshair ${className || ""}`
}
style = {{ height: desiredHeight }}
onMouseMove = {(e) => {
  setIsPointer(true)
  handlePointer(e.clientX)
}}
onMouseLeave = {() => {
  setIsPointer(false)
  setHoverIdx(null)
}}
onTouchStart = {(e) => {
  setIsPointer(true)
  if (e.touches[0]) handlePointer(e.touches[0].clientX)
}}
onTouchMove = {(e) => {
  if (e.touches[0]) handlePointer(e.touches[0].clientX)
}}
onTouchEnd = {() => {
  setIsPointer(false)
  setHoverIdx(null)
}}
    >
  <svg width={ width } height = { desiredHeight } className = "overflow-visible" >
    <defs>
    <linearGradient id={ `area-grad-${positive ? "pos" : "neg"}` } x1 = "0" y1 = "0" x2 = "0" y2 = "1" >
      <stop offset="0%" stopColor = { positive? "#10b981": "#ef4444" } stopOpacity = "0.3" />
        <stop offset="50%" stopColor = { positive? "#10b981": "#ef4444" } stopOpacity = "0.1" />
          <stop offset="100%" stopColor = { positive? "#10b981": "#ef4444" } stopOpacity = "0.02" />
            </linearGradient>

            < filter id = "glow" >
              <feGaussianBlur stdDeviation="3" result = "coloredBlur" />
                <feMerge>
                <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                    </feMerge>
                    < /filter>
                    < /defs>

                    < g transform = {`translate(${padding.left},${padding.top})`}>
                    {
                      gridYVals.map((gy, i) => {
                        const y = yFor(gy)
                        return (
                          <g key= { i } >
                          <line
                  x1={ 0 }
                        y1 = { y }
                        x2 = { innerW }
                        y2 = { y }
                        className = "stroke-zinc-200/40 dark:stroke-zinc-700/40"
                        strokeDasharray = "2 4"
                        strokeWidth = "1"
                          />
                          { i % 2 === 0 && (
                            <text
                    x={ -8 }
                        y = { y }
                        textAnchor = "end"
                        alignmentBaseline = "middle"
                        className = "fill-zinc-400/70 dark:fill-zinc-500/70 text-[9px] font-normal select-none"
                          >
                          { gy< 1? gy.toFixed(3) : gy< 100? gy.toFixed(1) : Math.round(gy) }
                          < /text>
                )
                    }
                      < /g>
            )
          })}

{
  points.length > 1 && (
    <path
              d={ `${dPath} L ${innerW} ${innerH} L 0 ${innerH} Z` }
  fill = {`url(#area-grad-${positive ? "pos" : "neg"})`
}
stroke = "none"
  />
          )}

<path
            d={ dPath }
fill = "none"
stroke = { positive? "#10b981": "#ef4444" }
strokeWidth = { 3}
filter = "url(#glow)"
className = "drop-shadow-sm"
  />

  { isPointer && hoverIdx !== null && points[hoverIdx] && (
    <>
    <line
                x1={ points[hoverIdx][0] }
y1 = { 0}
x2 = { points[hoverIdx][0] }
y2 = { innerH }
className = "stroke-blue-500/70"
strokeDasharray = "4 4"
strokeWidth = "2"
  />
  <line
                x1={ 0 }
y1 = { points[hoverIdx][1] }
x2 = { innerW }
y2 = { points[hoverIdx][1] }
className = "stroke-blue-500/70"
strokeDasharray = "4 4"
strokeWidth = "2"
  />

  <circle
                cx={ points[hoverIdx][0] }
cy = { points[hoverIdx][1] }
r = { 6}
className = "fill-white dark:fill-zinc-900 stroke-blue-500"
strokeWidth = { 3}
filter = "url(#glow)"
  >
  <animate attributeName="r" values = "6;8;6" dur = "1.5s" repeatCount = "indefinite" />
    </circle>
    < />
          )}
</g>
  < /svg>

{
  isPointer && hoverIdx !== null && (
    <motion.div
          initial={ { opacity: 0, scale: 0.9 } }
  animate = {{ opacity: 1, scale: 1 }
}
className = "absolute pointer-events-none rounded-lg border border-zinc-200 bg-white/95 backdrop-blur-sm px-3 py-2 text-sm shadow-lg dark:border-zinc-700 dark:bg-zinc-900/95"
style = {{
  top: Math.max(10, padding.top + (points[hoverIdx]?.[1] ?? 0) - 50),
    left: Math.min(Math.max(padding.left + (points[hoverIdx]?.[0] ?? 0) - 75, 10), (width || 0) - 150),
      width: 140,
          }}
        >
  <div className="flex items-center justify-between" >
    <span className="text-zinc-500 dark:text-zinc-400 font-medium" > Price < /span>
      < span className = "font-bold text-zinc-900 dark:text-zinc-100" > { formatPrice(data[hoverIdx]) } < /span>
        < /div>
        < div className = "flex items-center justify-between mt-1" >
          <span className="text-zinc-500 dark:text-zinc-400 font-medium" > Point < /span>
            < span className = "text-zinc-700 dark:text-zinc-300" >
              { hoverIdx + 1}/{data.length}
                < /span>
                < /div>
                < /motion.div>
      )}
</div>
  )
}

const SearchModal: React.FC<{
  isOpen: boolean
  onClose: () => void
  onAddCoin: (coin: CryptoData) => void
}> = ({ isOpen, onClose, onAddCoin }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<CryptoData[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const searchCoins = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(query)}`)
      if (response.ok) {
        const data = await response.json()
        const coinIds = data.coins
          .slice(0, 5)
          .map((coin: any) => coin.id)
          .join(",")
        const detailsResponse = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds}&order=market_cap_desc&per_page=5&page=1&sparkline=true&price_change_percentage=24h`,
        )
        if (detailsResponse.ok) {
          const detailsData = await detailsResponse.json()
          setSearchResults(detailsData)
        }
      }
    } catch (error) {
      const filtered = mockCryptoData.filter(
        (coin) =>
          coin.name.toLowerCase().includes(query.toLowerCase()) ||
          coin.symbol.toLowerCase().includes(query.toLowerCase()),
      )
      setSearchResults(filtered)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchCoins(searchQuery)
    }, 300)
    return () => clearTimeout(timeoutId)
  }, [searchQuery, searchCoins])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
      }
      if (e.key === "Escape" && isOpen) onClose()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <motion.div
      initial= {{ opacity: 0 }
}
animate = {{ opacity: 1 }}
exit = {{ opacity: 0 }}
className = "fixed inset-0 z-50 p-4 flex items-center justify-center bg-black/50"
onClick = { onClose }
  >
  <motion.div
        initial={ { scale: 0.95, opacity: 0 } }
animate = {{ scale: 1, opacity: 1 }}
exit = {{ scale: 0.95, opacity: 0 }}
className = "w-full max-w-lg rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
onClick = {(e) => e.stopPropagation()}
      >
  <div className="p-4 border-b border-zinc-200 dark:border-zinc-800" >
    <input
            type="text"
placeholder = "Search cryptocurrencies..."
value = { searchQuery }
onChange = {(e) => setSearchQuery(e.target.value)}
className = "w-full px-3 py-2 rounded-md bg-white border border-zinc-300 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100"
autoFocus
  />
  </div>

  < div className = "max-h-72 overflow-y-auto" >
    {
      isLoading?(
            <div className = "p-6 text-center text-zinc-500 dark:text-zinc-400" > Searching...</ div >
          ) : searchResults.length > 0 ? (
  searchResults.map((coin) => (
    <button
                key= { coin.id }
                onClick = {() => {
    onAddCoin(coin)
                  onClose()
                  setSearchQuery("")
  }}
    className = "w-full p-3 text-left flex items-center gap-3 border-b border-zinc-200 hover:bg-zinc-50 transition-colors dark:border-zinc-800 dark:hover:bg-zinc-800/50"
    >
    <img src={ coin.image || "/placeholder.svg" } alt = { coin.name } className = "w-7 h-7" />
    <div className="flex-1" >
  <div className="font-medium text-zinc-900 dark:text-zinc-100" > { coin.name } < /div>
  < div className = "text-sm text-zinc-500 dark:text-zinc-400" > { coin.symbol.toUpperCase() } < /div>
  < /div>
  < /button>
  ))
          ) : searchQuery ? (
  <div className= "p-6 text-center text-zinc-500 dark:text-zinc-400" > No results found < /div>
          ) : (
  <div className= "p-6 text-center text-zinc-500 dark:text-zinc-400" > Start typing to search...</div>
          )}
</div>
  < /motion.div>
  < /motion.div>
  )
}

const Card: React.FC<{
  crypto: CryptoData
  isPositive: boolean
  onRemove?: () => void
  delay?: number
}> = ({ crypto, isPositive, delay = 0 }) => {
  const [isActive, setIsActive] = useState(false)

  return (
    <motion.div
      initial= {{ opacity: 0, y: 20, scale: 0.95 }
}
animate = {{ opacity: 1, y: 0, scale: 1 }}
exit = {{ opacity: 0, y: -20, scale: 0.95 }}
transition = {{
  delay,
    type: "spring",
      stiffness: 300,
        damping: 30,
      }}
whileHover = {{
  scale: 1.02,
    transition: { duration: 0.2 },
}}
onMouseEnter = {() => setIsActive(true)}
onMouseLeave = {() => setIsActive(false)}
className = "relative group"
  >
  <ProfessionalCard isActive={ isActive }>
    <div className="flex items-center justify-between mb-3" >
      <div className="flex items-center gap-3" >
        <motion.div
              className="relative w-10 h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 flex items-center justify-center overflow-hidden bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-800"
whileHover = {{ rotate: 5, scale: 1.1 }}
transition = {{ type: "spring", stiffness: 400, damping: 10 }}
            >
  <img
                src={ crypto.image || "/placeholder.svg" }
alt = { crypto.name }
className = "w-6 h-6 object-contain"
onError = {(e) => {
  const target = e.target as HTMLImageElement
  target.src = `/placeholder.svg?height=24&width=24&query=${crypto.symbol}`
}}
/>
  < div className = "absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent to-blue-500/10" />
    </motion.div>

    < div className = "min-w-0" >
      <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 truncate" > { crypto.name } < /h3>
        < p className = "text-xs text-zinc-500 dark:text-zinc-400 uppercase font-medium tracking-wider" >
          { crypto.symbol }
          < /p>
          < /div>
          < /div>

          < div className = "text-right" >
            <motion.div
              className="text-lg font-bold text-zinc-900 dark:text-zinc-100"
animate = {{ scale: isActive ? 1.05 : 1 }}
transition = {{ duration: 0.2 }}
            >
  { formatPrice(crypto.current_price) }
  < /motion.div>
  < div
className = {`text-xs font-semibold flex items-center gap-1 ${isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
  }`}
            >
  <span className={ isPositive ? "text-emerald-500" : "text-rose-500" }> { isPositive? "↗": "↘" } < /span>
{ formatPercentage(crypto.price_change_percentage_24h) }
</div>
  < /div>
  < /div>

  < div className = "mb-3" >
    <div className="rounded-lg border border-zinc-200/50 dark:border-zinc-700/50 bg-gradient-to-br from-zinc-50/50 to-white dark:from-zinc-900/50 dark:to-zinc-800/50 overflow-hidden" >
      <InteractiveChart data={ crypto.sparkline_in_7d?.price || [] } positive = { isPositive } />
        </div>
        < /div>

        < div className = "space-y-2" >
          <div className="grid grid-cols-2 gap-3" >
            <div className="space-y-1" >
              <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide" >
                Market Cap
                  < /div>
                  < div className = "font-bold text-xs text-zinc-900 dark:text-zinc-100" >
                    { formatMarketCap(crypto.market_cap) }
                    < /div>
                    < /div>
                    < div className = "space-y-1" >
                      <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide" >
                        Volume 24h
                          < /div>
                          < div className = "font-bold text-xs text-zinc-900 dark:text-zinc-100" >
                            { formatMarketCap(crypto.total_volume) }
                            < /div>
                            < /div>
                            < /div>

                            < div className = "grid grid-cols-2 gap-3" >
                              <div className="space-y-1" >
                                <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide" >
                                  24h High
                                    < /div>
                                    < div className = "font-bold text-xs text-emerald-600 dark:text-emerald-400" >
                                      { formatPrice(crypto.high_24h) }
                                      < /div>
                                      < /div>
                                      < div className = "space-y-1" >
                                        <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide" >
                                          24h Low
                                            < /div>
                                            < div className = "font-bold text-xs text-rose-600 dark:text-rose-400" > { formatPrice(crypto.low_24h) } < /div>
                                              < /div>
                                              < /div>
                                              < /div>
                                              < /ProfessionalCard>
                                              < /motion.div>
  )
}

const CryptoDashboard: React.FC = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCoins, setSelectedCoins] = useState<string[]>([
    "bitcoin",
    "ethereum",
    "binancecoin",
    "solana",
    "cardano",
    "chainlink",
    "avalanche-2",
    "polkadot",
  ])
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const fetchCryptoData = useCallback(async () => {
    try {
      setError(null)
      const coinIds = selectedCoins.join(",")
      const urls = [
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds}&order=market_cap_desc&per_page=10&page=1&sparkline=true&price_change_percentage=24h`,
        `https://cors-anywhere.herokuapp.com/https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds}&order=market_cap_desc&per_page=10&page=1&sparkline=true&price_change_percentage=24h`,
      ]
      let data = null
      for (const url of urls) {
        try {
          const response = await fetch(url)
          if (response.ok) {
            data = await response.json()
            break
          }
        } catch {
          continue
        }
      }
      if (data) setCryptoData(data)
      else throw new Error("All API endpoints failed")
    } catch {
      setCryptoData(mockCryptoData)
      setError("Using demo data - API unavailable")
    } finally {
      setLoading(false)
    }
  }, [selectedCoins])

  useEffect(() => {
    fetchCryptoData()
    const interval = setInterval(fetchCryptoData, 60000)
    return () => clearInterval(interval)
  }, [fetchCryptoData])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsSearchOpen(true)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleAddCoin = (coin: CryptoData) => {
    if (!selectedCoins.includes(coin.id)) {
      setSelectedCoins((prev) => [...prev, coin.id])
    }
  }

  const handleRemoveCoin = (coinId: string) => {
    setSelectedCoins((prev) => prev.filter((id) => id !== coinId))
  }

  if (loading) {
    return (
      <div className= "min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center" >
      <div className="text-center" >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" > </div>
          < p className = "text-zinc-600 dark:text-zinc-300" > Loading crypto data...</p>
            < /div>
            < /div>
    )
  }

return (
  <div className= "min-h-screen p-4 sm:p-6 lg:p-8" >
  <BackgroundPlus
        className="fixed inset-0 opacity-[0.5]"
plusColor = "#3b82f6"
plusSize = { 60}
fade = { true}
  />

  <div className="relative max-w-7xl mx-auto" >
    <div className="mb-8 sm:mb-12 text-center" >
      <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-900 dark:from-zinc-100 dark:via-zinc-300 dark:to-zinc-100 bg-clip-text text-transparent tracking-tight mb-4"
initial = {{ opacity: 0, y: -20 }}
animate = {{ opacity: 1, y: 0 }}
transition = {{ duration: 0.6 }}
          >
  Crypto Dashboard
    < /motion.h1>
    < motion.p
className = "text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto"
initial = {{ opacity: 0, y: 20 }}
animate = {{ opacity: 1, y: 0 }}
transition = {{ duration: 0.6, delay: 0.2 }}
          >
  Professional real - time cryptocurrency market analytics with interactive charts
    < /motion.p>

{
  error && (
    <motion.div
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-amber-400/50 bg-amber-50/80 text-amber-800 dark:border-amber-600/50 dark:bg-amber-900/20 dark:text-amber-300 backdrop-blur-sm"
  initial = {{ opacity: 0, scale: 0.9 }
}
animate = {{ opacity: 1, scale: 1 }}
            >
  { error }
  < /motion.div>
          )}

<motion.button
            onClick={ () => setIsSearchOpen(true) }
className = "mt-6 inline-flex items-center gap-3 px-6 py-3 rounded-xl border border-zinc-300/50 bg-white/80 text-zinc-900 hover:bg-white hover:border-zinc-400 shadow-lg hover:shadow-xl transition-all duration-200 dark:border-zinc-700/50 dark:bg-zinc-900/80 dark:text-zinc-100 dark:hover:bg-zinc-900 backdrop-blur-sm"
whileHover = {{ scale: 1.02 }}
whileTap = {{ scale: 0.98 }}
initial = {{ opacity: 0, y: 20 }}
animate = {{ opacity: 1, y: 0 }}
transition = {{ duration: 0.6, delay: 0.4 }}
          >
  <span className="font-medium" > Search Cryptocurrencies < /span>
    < div className = "hidden sm:flex items-center gap-2 text-zinc-500" >
      <kbd className="bg-zinc-100 px-2 py-1 rounded-md text-xs border border-zinc-300 dark:bg-zinc-800 dark:border-zinc-700 font-mono" >
                ⌘K
  < /kbd>
  < /div>
  < /motion.button>
  < /div>

  < div className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8" >
    <AnimatePresence mode="popLayout" >
    {
      cryptoData.map((crypto, index) => (
        <Card
                key= { crypto.id }
                crypto = { crypto }
                isPositive = { crypto.price_change_percentage_24h >= 0 }
                delay = { index * 0.1}
        />
            ))
    }
      < /AnimatePresence>
      < /div>

      <AnimatePresence>
{
  isSearchOpen && (
    <SearchModal isOpen={ isSearchOpen } onClose = {() => setIsSearchOpen(false)
} onAddCoin = { handleAddCoin } />
          )}
</AnimatePresence>
  < /div>
  < /div>
  )
}

export default CryptoDashboard
