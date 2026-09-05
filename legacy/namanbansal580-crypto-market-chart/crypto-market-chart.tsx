"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"

// Main component
export default function CryptoMarketChart() {
  // State for chart data and settings
  const [chartData, setChartData] = useState<CryptoDataPoint[]>([])
  const [hoveredPoint, setHoveredPoint] = useState<CryptoDataPoint | null>(null)
  const [chartType, setChartType] = useState<"candlestick" | "line" | "area">("candlestick")
  const [timeframe, setTimeframe] = useState<"1h" | "1d" | "1w" | "1m">("1d")
  const [isLoading, setIsLoading] = useState(true)
  const [currentPrice, setCurrentPrice] = useState(0)
  const [priceChange, setPriceChange] = useState(0)
  const [priceChangePercent, setPriceChangePercent] = useState(0)
  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

  // Refs for canvas elements
  const candleChartRef = useRef<HTMLCanvasElement>(null)
  const lineChartRef = useRef<HTMLCanvasElement>(null)
  const areaChartRef = useRef<HTMLCanvasElement>(null)
  const chartContainerRef = useRef<HTMLDivElement>(null)

  // Interface for crypto data points
  interface CryptoDataPoint {
    timestamp: number
    open: number
    high: number
    low: number
    close: number
    volume: number
  }

  // Generate random crypto data
  const generateDummyData = (timeframe: "1h" | "1d" | "1w" | "1m") => {
    setIsLoading(true)

    // Set time intervals based on timeframe
    let intervalMs = 0
    let dataPoints = 0

    switch (timeframe) {
      case "1h":
        intervalMs = 60 * 1000 // 1 minute
        dataPoints = 60
        break
      case "1d":
        intervalMs = 15 * 60 * 1000 // 15 minutes
        dataPoints = 96
        break
      case "1w":
        intervalMs = 6 * 60 * 60 * 1000 // 6 hours
        dataPoints = 28
        break
      case "1m":
        intervalMs = 24 * 60 * 60 * 1000 // 1 day
        dataPoints = 30
        break
    }

    // Generate random starting price between $20,000 and $40,000
    let lastClose = Math.random() * 20000 + 20000
    const now = Date.now()
    const data: CryptoDataPoint[] = []

    // Generate data points
    for (let i = 0; i < dataPoints; i++) {
      // Random price movement with volatility based on timeframe
      const volatility = timeframe === "1h" ? 0.002 : timeframe === "1d" ? 0.01 : 0.03
      const changePercent = (Math.random() - 0.5) * volatility

      // Calculate OHLC values
      const open = lastClose
      const close = open * (1 + changePercent)
      const high = Math.max(open, close) * (1 + Math.random() * 0.005)
      const low = Math.min(open, close) * (1 - Math.random() * 0.005)
      const volume = Math.random() * 1000 + 500

      // Add data point
      data.unshift({
        timestamp: now - i * intervalMs,
        open,
        high,
        low,
        close,
        volume,
      })

      lastClose = close
    }

    // Calculate current price and change
    const latestPoint = data[data.length - 1]
    const firstPoint = data[0]

    setCurrentPrice(latestPoint.close)
    setPriceChange(latestPoint.close - firstPoint.open)
    setPriceChangePercent(((latestPoint.close - firstPoint.open) / firstPoint.open) * 100)

    // Add animation delay
    setTimeout(() => {
      setChartData(data)
      setIsLoading(false)
    }, 500)
  }

  // Initialize data on component mount and when timeframe changes
  useEffect(() => {
    generateDummyData(timeframe)

    // Simulate live price updates
    const interval = setInterval(() => {
      if (chartData.length > 0) {
        const lastPoint = { ...chartData[chartData.length - 1] }
        const changePercent = (Math.random() - 0.5) * 0.002
        const newClose = lastPoint.close * (1 + changePercent)

        setCurrentPrice(newClose)
        setPriceChange(newClose - chartData[0].open)
        setPriceChangePercent(((newClose - chartData[0].open) / chartData[0].open) * 100)

        // Update last candle
        const updatedData = [...chartData]
        updatedData[updatedData.length - 1] = {
          ...lastPoint,
          close: newClose,
          high: Math.max(lastPoint.high, newClose),
          low: Math.min(lastPoint.low, newClose),
        }

        setChartData(updatedData)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [timeframe])

  // Draw candlestick chart
  useEffect(() => {
    if (!chartData.length || !candleChartRef.current) return

    const canvas = candleChartRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set dimensions
    const width = canvas.width
    const height = canvas.height
    const padding = { top: 20, right: 50, bottom: 30, left: 70 }
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom

    // Find min and max values
    const minPrice = Math.min(...chartData.map((d) => d.low)) * 0.995
    const maxPrice = Math.max(...chartData.map((d) => d.high)) * 1.005
    const priceRange = maxPrice - minPrice

    // Draw background grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
    ctx.lineWidth = 0.5

    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (chartHeight / 5) * i
      ctx.beginPath()
      ctx.moveTo(padding.left, y)
      ctx.lineTo(width - padding.right, y)
      ctx.stroke()

      // Price labels
      const price = maxPrice - (i / 5) * priceRange
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
      ctx.font = "10px Inter, system-ui, sans-serif"
      ctx.textAlign = "right"
      ctx.fillText(`$${price.toLocaleString("en-US", { maximumFractionDigits: 2 })}`, padding.left - 10, y + 4)
    }

    // Draw candles
    const candleWidth = (chartWidth / chartData.length) * 0.8
    const spacing = (chartWidth / chartData.length) * 0.2

    chartData.forEach((dataPoint, i) => {
      const x = padding.left + i * (candleWidth + spacing) + spacing / 2

      // Calculate y positions
      const openY = padding.top + chartHeight - ((dataPoint.open - minPrice) / priceRange) * chartHeight
      const closeY = padding.top + chartHeight - ((dataPoint.close - minPrice) / priceRange) * chartHeight
      const highY = padding.top + chartHeight - ((dataPoint.high - minPrice) / priceRange) * chartHeight
      const lowY = padding.top + chartHeight - ((dataPoint.low - minPrice) / priceRange) * chartHeight

      // Determine if bullish or bearish
      const isBullish = dataPoint.close > dataPoint.open

      // Draw wick
      ctx.beginPath()
      ctx.strokeStyle = isBullish ? "rgba(0, 255, 0, 0.8)" : "rgba(255, 0, 0, 0.8)"
      ctx.lineWidth = 1
      ctx.moveTo(x + candleWidth / 2, highY)
      ctx.lineTo(x + candleWidth / 2, lowY)
      ctx.stroke()

      // Draw candle body
      ctx.fillStyle = isBullish ? "rgba(0, 255, 0, 0.3)" : "rgba(255, 0, 0, 0.3)"
      ctx.strokeStyle = isBullish ? "rgba(0, 255, 0, 0.8)" : "rgba(255, 0, 0, 0.8)"

      const candleHeight = Math.abs(closeY - openY)
      const yStart = isBullish ? closeY : openY

      // Draw with glow effect
      ctx.shadowColor = isBullish ? "rgba(0, 255, 0, 0.5)" : "rgba(255, 0, 0, 0.5)"
      ctx.shadowBlur = 5
      ctx.fillRect(x, yStart, candleWidth, candleHeight)
      ctx.strokeRect(x, yStart, candleWidth, candleHeight)
      ctx.shadowBlur = 0

      // Time labels (show only a few)
      if (i % Math.ceil(chartData.length / 6) === 0) {
        const date = new Date(dataPoint.timestamp)
        let timeLabel = ""

        if (timeframe === "1h") {
          timeLabel = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        } else if (timeframe === "1d") {
          timeLabel = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        } else {
          timeLabel = date.toLocaleDateString([], { month: "short", day: "numeric" })
        }

        ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
        ctx.font = "10px Inter, system-ui, sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(timeLabel, x + candleWidth / 2, height - padding.bottom / 2)
      }
    })

    // Draw chart title
    ctx.fillStyle = "white"
    ctx.font = "bold 14px Inter, system-ui, sans-serif"
    ctx.textAlign = "left"
    ctx.fillText("BTC/USD Candlestick Chart", padding.left, padding.top / 2)
  }, [chartData, chartType])

  // Draw line chart
  useEffect(() => {
    if (!chartData.length || !lineChartRef.current) return

    const canvas = lineChartRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set dimensions
    const width = canvas.width
    const height = canvas.height
    const padding = { top: 20, right: 50, bottom: 30, left: 70 }
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom

    // Find min and max values
    const minPrice = Math.min(...chartData.map((d) => d.low)) * 0.995
    const maxPrice = Math.max(...chartData.map((d) => d.high)) * 1.005
    const priceRange = maxPrice - minPrice

    // Draw background grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
    ctx.lineWidth = 0.5

    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (chartHeight / 5) * i
      ctx.beginPath()
      ctx.moveTo(padding.left, y)
      ctx.lineTo(width - padding.right, y)
      ctx.stroke()

      // Price labels
      const price = maxPrice - (i / 5) * priceRange
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
      ctx.font = "10px Inter, system-ui, sans-serif"
      ctx.textAlign = "right"
      ctx.fillText(`$${price.toLocaleString("en-US", { maximumFractionDigits: 2 })}`, padding.left - 10, y + 4)
    }

    // Draw line
    ctx.beginPath()
    ctx.strokeStyle = "rgba(0, 195, 255, 0.8)"
    ctx.lineWidth = 2

    chartData.forEach((dataPoint, i) => {
      const x = padding.left + i * (chartWidth / (chartData.length - 1))
      const y = padding.top + chartHeight - ((dataPoint.close - minPrice) / priceRange) * chartHeight

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }

      // Time labels (show only a few)
      if (i % Math.ceil(chartData.length / 6) === 0) {
        const date = new Date(dataPoint.timestamp)
        let timeLabel = ""

        if (timeframe === "1h") {
          timeLabel = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        } else if (timeframe === "1d") {
          timeLabel = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        } else {
          timeLabel = date.toLocaleDateString([], { month: "short", day: "numeric" })
        }

        ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
        ctx.font = "10px Inter, system-ui, sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(timeLabel, x, height - padding.bottom / 2)
      }
    })

    // Add glow effect
    ctx.shadowColor = "rgba(0, 195, 255, 0.5)"
    ctx.shadowBlur = 10
    ctx.stroke()
    ctx.shadowBlur = 0

    // Draw points
    chartData.forEach((dataPoint, i) => {
      const x = padding.left + i * (chartWidth / (chartData.length - 1))
      const y = padding.top + chartHeight - ((dataPoint.close - minPrice) / priceRange) * chartHeight

      ctx.beginPath()
      ctx.fillStyle = "rgba(0, 195, 255, 0.8)"
      ctx.arc(x, y, 3, 0, Math.PI * 2)
      ctx.fill()
    })

    // Draw chart title
    ctx.fillStyle = "white"
    ctx.font = "bold 14px Inter, system-ui, sans-serif"
    ctx.textAlign = "left"
    ctx.fillText("BTC/USD Line Chart", padding.left, padding.top / 2)
  }, [chartData, chartType])

  // Draw area chart
  useEffect(() => {
    if (!chartData.length || !areaChartRef.current) return

    const canvas = areaChartRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set dimensions
    const width = canvas.width
    const height = canvas.height
    const padding = { top: 20, right: 50, bottom: 30, left: 70 }
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom

    // Find min and max values
    const minPrice = Math.min(...chartData.map((d) => d.low)) * 0.995
    const maxPrice = Math.max(...chartData.map((d) => d.high)) * 1.005
    const priceRange = maxPrice - minPrice

    // Draw background grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
    ctx.lineWidth = 0.5

    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (chartHeight / 5) * i
      ctx.beginPath()
      ctx.moveTo(padding.left, y)
      ctx.lineTo(width - padding.right, y)
      ctx.stroke()

      // Price labels
      const price = maxPrice - (i / 5) * priceRange
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
      ctx.font = "10px Inter, system-ui, sans-serif"
      ctx.textAlign = "right"
      ctx.fillText(`$${price.toLocaleString("en-US", { maximumFractionDigits: 2 })}`, padding.left - 10, y + 4)
    }

    // Create gradient
    const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom)
    gradient.addColorStop(0, "rgba(0, 195, 255, 0.5)")
    gradient.addColorStop(1, "rgba(0, 195, 255, 0)")

    // Draw area
    ctx.beginPath()
    ctx.moveTo(padding.left, height - padding.bottom)

    chartData.forEach((dataPoint, i) => {
      const x = padding.left + i * (chartWidth / (chartData.length - 1))
      const y = padding.top + chartHeight - ((dataPoint.close - minPrice) / priceRange) * chartHeight

      ctx.lineTo(x, y)

      // Time labels (show only a few)
      if (i % Math.ceil(chartData.length / 6) === 0) {
        const date = new Date(dataPoint.timestamp)
        let timeLabel = ""

        if (timeframe === "1h") {
          timeLabel = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        } else if (timeframe === "1d") {
          timeLabel = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        } else {
          timeLabel = date.toLocaleDateString([], { month: "short", day: "numeric" })
        }

        ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
        ctx.font = "10px Inter, system-ui, sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(timeLabel, x, height - padding.bottom / 2)
      }
    })

    // Complete the area
    ctx.lineTo(width - padding.right, height - padding.bottom)
    ctx.closePath()

    // Fill with gradient
    ctx.fillStyle = gradient
    ctx.fill()

    // Draw the line on top
    ctx.beginPath()

    chartData.forEach((dataPoint, i) => {
      const x = padding.left + i * (chartWidth / (chartData.length - 1))
      const y = padding.top + chartHeight - ((dataPoint.close - minPrice) / priceRange) * chartHeight

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.strokeStyle = "rgba(0, 195, 255, 0.8)"
    ctx.lineWidth = 2
    ctx.shadowColor = "rgba(0, 195, 255, 0.5)"
    ctx.shadowBlur = 10
    ctx.stroke()
    ctx.shadowBlur = 0

    // Draw chart title
    ctx.fillStyle = "white"
    ctx.font = "bold 14px Inter, system-ui, sans-serif"
    ctx.textAlign = "left"
    ctx.fillText("BTC/USD Area Chart", padding.left, padding.top / 2)
  }, [chartData, chartType])

  // Handle mouse move for tooltip
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!chartData.length || !chartContainerRef.current) return

    const rect = chartContainerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Get active canvas based on chart type
    let canvas: HTMLCanvasElement | null = null
    switch (chartType) {
      case "candlestick":
        canvas = candleChartRef.current
        break
      case "line":
        canvas = lineChartRef.current
        break
      case "area":
        canvas = areaChartRef.current
        break
    }

    if (!canvas) return

    const padding = { top: 20, right: 50, bottom: 30, left: 70 }
    const chartWidth = canvas.width - padding.left - padding.right

    // Check if mouse is in chart area
    if (
      x >= padding.left &&
      x <= canvas.width - padding.right &&
      y >= padding.top &&
      y <= canvas.height - padding.bottom
    ) {
      // Calculate which data point is closest
      const dataIndex = Math.min(Math.floor(((x - padding.left) / chartWidth) * chartData.length), chartData.length - 1)

      if (dataIndex >= 0) {
        setHoveredPoint(chartData[dataIndex])
        setShowTooltip(true)
        setTooltipPosition({ x: e.clientX, y: e.clientY })
      }
    } else {
      setShowTooltip(false)
    }
  }

  const handleMouseLeave = () => {
    setShowTooltip(false)
  }

  // Format price with appropriate precision
  const formatPrice = (price: number) => {
    return price.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  // Format date based on timeframe
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)

    if (timeframe === "1h") {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (timeframe === "1d") {
      return `${date.toLocaleDateString([], { month: "short", day: "numeric" })} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto bg-gray-900 rounded-xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-gray-800 border-b border-gray-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center mr-3 animate-pulse">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center">
                Bitcoin
                <span className="ml-2 text-sm font-normal text-gray-400">BTC/USD</span>
              </h2>
              <div className="flex items-center mt-1">
                <span className="text-xl font-semibold text-white">{formatPrice(currentPrice)}</span>
                <span
                  className={`ml-2 px-2 py-0.5 rounded text-sm font-medium ${priceChange >= 0 ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"}`}
                >
                  {priceChange >= 0 ? "↑" : "↓"} {Math.abs(priceChangePercent).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setTimeframe("1h")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                timeframe === "1h" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              1H
            </button>
            <button
              onClick={() => setTimeframe("1d")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                timeframe === "1d" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              1D
            </button>
            <button
              onClick={() => setTimeframe("1w")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                timeframe === "1w" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              1W
            </button>
            <button
              onClick={() => setTimeframe("1m")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                timeframe === "1m" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              1M
            </button>
          </div>
        </div>

        {/* Chart type selector */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setChartType("candlestick")}
            className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              chartType === "candlestick"
                ? "bg-gray-700 text-white border-b-2 border-blue-500"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Candlestick
          </button>
          <button
            onClick={() => setChartType("line")}
            className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              chartType === "line"
                ? "bg-gray-700 text-white border-b-2 border-blue-500"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
              />
            </svg>
            Line
          </button>
          <button
            onClick={() => setChartType("area")}
            className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              chartType === "area"
                ? "bg-gray-700 text-white border-b-2 border-blue-500"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Area
          </button>
        </div>
      </div>

      {/* Chart container */}
      <div
        ref={chartContainerRef}
        className="relative p-4 h-[400px] w-full"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <canvas
              ref={candleChartRef}
              width={800}
              height={400}
              className={`w-full h-full ${chartType === "candlestick" ? "block" : "hidden"}`}
            />
            <canvas
              ref={lineChartRef}
              width={800}
              height={400}
              className={`w-full h-full ${chartType === "line" ? "block" : "hidden"}`}
            />
            <canvas
              ref={areaChartRef}
              width={800}
              height={400}
              className={`w-full h-full ${chartType === "area" ? "block" : "hidden"}`}
            />

            {/* Tooltip */}
            {showTooltip && hoveredPoint && (
              <div
                className="absolute z-10 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-3 text-white text-sm"
                style={{
                  left: `${tooltipPosition.x + 10}px`,
                  top: `${tooltipPosition.y - 100}px`,
                  transform: "translate(-50%, -100%)",
                }}
              >
                <div className="font-semibold mb-1">{formatDate(hoveredPoint.timestamp)}</div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  <div className="text-gray-400">Open:</div>
                  <div className="text-right">{formatPrice(hoveredPoint.open)}</div>
                  <div className="text-gray-400">High:</div>
                  <div className="text-right text-green-400">{formatPrice(hoveredPoint.high)}</div>
                  <div className="text-gray-400">Low:</div>
                  <div className="text-right text-red-400">{formatPrice(hoveredPoint.low)}</div>
                  <div className="text-gray-400">Close:</div>
                  <div
                    className={`text-right ${hoveredPoint.close >= hoveredPoint.open ? "text-green-400" : "text-red-400"}`}
                  >
                    {formatPrice(hoveredPoint.close)}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Market stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-800 border-t border-gray-700">
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="text-gray-400 text-sm">24h Volume</div>
          <div className="text-white font-semibold mt-1">$1,245,678,901</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Market Cap</div>
          <div className="text-white font-semibold mt-1">$452,123,456,789</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="text-gray-400 text-sm">24h High</div>
          <div className="text-green-400 font-semibold mt-1">
            {formatPrice(Math.max(...chartData.map((d) => d.high)))}
          </div>
        </div>
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="text-gray-400 text-sm">24h Low</div>
          <div className="text-red-400 font-semibold mt-1">{formatPrice(Math.min(...chartData.map((d) => d.low)))}</div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="p-6 bg-gray-900 border-t border-gray-700 flex flex-wrap gap-4 justify-center">
        <button className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-green-500/20 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Buy BTC
        </button>
        <button className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-red-500/20 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
          Sell BTC
        </button>
        <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-blue-500/20 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
            />
          </svg>
          Trade
        </button>
        <button className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-gray-500/20 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
          Add to Watchlist
        </button>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  )
}
