"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "./card"
import { Badge } from "./badge"
import { Cpu, HardDrive, Wifi, Zap, Activity } from "lucide-react"

interface DataPoint {
  value: number
  timestamp: number
  isSpike?: boolean
}

interface ResourceData {
  cpu: DataPoint[]
  gpu: DataPoint[]
  vram: DataPoint[]
  network: DataPoint[]
  memory: DataPoint[]
}

interface Agent {
  id: string
  name: string
  memory: DataPoint[]
  color: string
}

const generateDataPoint = (baseValue: number, variance: number, spikeChance = 0.05): DataPoint => {
  const isSpike = Math.random() < spikeChance
  const multiplier = isSpike ? 1.5 + Math.random() * 0.5 : 1
  const value = Math.max(0, Math.min(100, baseValue + (Math.random() - 0.5) * variance * multiplier))

  return {
    value,
    timestamp: Date.now(),
    isSpike: isSpike && value > 70,
  }
}

const Sparkline = ({
  data,
  color = "#3b82f6",
  spikeColor = "#ef4444",
  width = 60,
  height = 20,
}: {
  data: DataPoint[]
  color?: string
  spikeColor?: string
  width?: number
  height?: number
}) => {
  const pathRef = useRef<SVGPathElement>(null)

  const points = data.map((point, index) => ({
    x: (index / (data.length - 1)) * width,
    y: height - (point.value / 100) * height,
    isSpike: point.isSpike,
  }))

  const path = points.reduce((acc, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`
    return `${acc} L ${point.x} ${point.y}`
  }, "")

  const hasSpikes = points.some((p) => p.isSpike)

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={hasSpikes ? spikeColor : color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={hasSpikes ? spikeColor : color} stopOpacity={0.1} />
        </linearGradient>
      </defs>

      <motion.path
        ref={pathRef}
        d={`${path} L ${width} ${height} L 0 ${height} Z`}
        fill={`url(#gradient-${color})`}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />

      <motion.path
        d={path}
        fill="none"
        stroke={hasSpikes ? spikeColor : color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />

      {/* Spike indicators */}
      {points.map((point, index) =>
        point.isSpike ? (
          <motion.circle
            key={index}
            cx={point.x}
            cy={point.y}
            r={2}
            fill={spikeColor}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: index * 0.05,
              type: "spring",
              stiffness: 400,
              damping: 10,
            }}
          />
        ) : null,
      )}
    </svg>
  )
}

const ResourceCard = ({
  icon: Icon,
  label,
  value,
  data,
  color,
  unit = "%",
}: {
  icon: any
  label: string
  value: number
  data: DataPoint[]
  color: string
  unit?: string
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const hasSpikes = data.some((d) => d.isSpike)

  return (
    <motion.div
      className="flex items-center gap-2 p-1.5 rounded-lg transition-colors hover:bg-muted/50"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <motion.div
        className="flex items-center justify-center w-7 h-7 rounded-md bg-muted"
        animate={{
          backgroundColor: hasSpikes ? "#fef2f2" : undefined,
          scale: isHovered ? 1.1 : 1,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <Icon className={`w-4 h-4 ${hasSpikes ? "text-red-500" : "text-muted-foreground"}`} />
      </motion.div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-muted-foreground">{label}</span>
          <motion.span
            className={`text-xs font-mono ${hasSpikes ? "text-red-500" : "text-foreground"}`}
            animate={{ color: hasSpikes ? "#ef4444" : undefined }}
          >
            {value.toFixed(1)} {unit}
          </motion.span>
        </div>
        <div className="mt-1">
          <Sparkline data={data} color={color} />
        </div>
      </div>
    </motion.div>
  )
}

const AgentMemoryCard = ({ agent }: { agent: Agent }) => {
  const [isHovered, setIsHovered] = useState(false)
  const currentValue = agent.memory[agent.memory.length - 1]?.value || 0
  const hasSpikes = agent.memory.some((d) => d.isSpike)

  return (
    <motion.div
      className="flex items-center gap-2 p-2 rounded-md transition-colors hover:bg-muted/30"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <motion.div
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: hasSpikes ? "#ef4444" : agent.color }}
        animate={{
          scale: isHovered ? 1.2 : 1,
          backgroundColor: hasSpikes ? "#ef4444" : agent.color,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground truncate">{agent.name}</span>
          <motion.span
            className={`text-xs font-mono ml-2 ${hasSpikes ? "text-red-500" : "text-foreground"}`}
            animate={{ color: hasSpikes ? "#ef4444" : undefined }}
          >
            {currentValue.toFixed(0)}MB
          </motion.span>
        </div>
        <div className="mt-1">
          <Sparkline data={agent.memory} color={agent.color} width={40} height={12} />
        </div>
      </div>
    </motion.div>
  )
}

export default function SystemMonitor() {
  const [resourceData, setResourceData] = useState<ResourceData>({
    cpu: [],
    gpu: [],
    vram: [],
    network: [],
    memory: [],
  })

  const [agents] = useState<Agent[]>([
    { id: "1", name: "Web Agent", memory: [], color: "#3b82f6" },
    { id: "2", name: "Unit Test Agent", memory: [], color: "#10b981" },
    { id: "3", name: "PR Agent #1", memory: [], color: "#f59e0b" },
    { id: "4", name: "Video Editing Agent", memory: [], color: "#8b5cf6" },
  ])

  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setResourceData((prev) => {
        const maxPoints = 20

        return {
          cpu: [...prev.cpu, generateDataPoint(45, 30, 0.08)].slice(-maxPoints),
          gpu: [...prev.gpu, generateDataPoint(35, 25, 0.06)].slice(-maxPoints),
          vram: [...prev.vram, generateDataPoint(60, 20, 0.05)].slice(-maxPoints),
          network: [...prev.network, generateDataPoint(25, 40, 0.1)].slice(-maxPoints),
          memory: [...prev.memory, generateDataPoint(70, 15, 0.04)].slice(-maxPoints),
        }
      })

      // Update agent memory
      agents.forEach((agent) => {
        const baseMemory = agent.id === "1" ? 150 : agent.id === "2" ? 200 : agent.id === "3" ? 80 : 120
        const newPoint = generateDataPoint(baseMemory, 50, 0.06)
        agent.memory = [...agent.memory, newPoint].slice(-15)
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [agents])

  const currentCpu = resourceData.cpu[resourceData.cpu.length - 1]?.value || 0
  const currentGpu = resourceData.gpu[resourceData.gpu.length - 1]?.value || 0
  const currentVram = resourceData.vram[resourceData.vram.length - 1]?.value || 0
  const currentNetwork = resourceData.network[resourceData.network.length - 1]?.value || 0
  const currentMemory = resourceData.memory[resourceData.memory.length - 1]?.value || 0

  const hasAnySpikes = [
    ...resourceData.cpu,
    ...resourceData.gpu,
    ...resourceData.vram,
    ...resourceData.network,
    ...resourceData.memory,
    ...agents.flatMap((a) => a.memory),
  ].some((d) => d.isSpike)

  return (
    <motion.div
      className="fixed bottom-4 right-4 z-50"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Card className="w-96 bg-background/95 backdrop-blur-sm border shadow-lg">
        <motion.div
          className="p-3 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
          whileHover={{ backgroundColor: "hsl(var(--muted) / 0.5)" }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: hasAnySpikes ? 360 : 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <Activity className={`w-4 h-4 ${hasAnySpikes ? "text-red-500" : "text-muted-foreground"}`} />
              </motion.div>
              <span className="text-sm font-medium">System Monitor</span>
              {hasAnySpikes && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Badge variant="destructive" className="text-xs text-white px-1.5 py-0.5">
                    Spike
                  </Badge>
                </motion.div>
              )}
            </div>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="text-muted-foreground"
            >
              ▼
            </motion.div>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <ResourceCard icon={Cpu} label="CPU" value={currentCpu} data={resourceData.cpu} color="#3b82f6" />
            <ResourceCard icon={Zap} label="GPU" value={currentGpu} data={resourceData.gpu} color="#10b981" />
            <ResourceCard icon={HardDrive} label="VRAM" value={currentVram} data={resourceData.vram} color="#f59e0b" />
            <ResourceCard
              icon={Wifi}
              label="Network"
              value={currentNetwork}
              data={resourceData.network}
              color="#8b5cf6"
              unit="MB/s"
            />
          </div>
        </motion.div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="overflow-hidden"
            >
              <div className="px-3 pb-3 border-t">
                <div className="mt-3 mb-2">
                  <ResourceCard
                    icon={HardDrive}
                    label="System Memory"
                    value={currentMemory}
                    data={resourceData.memory}
                    color="#ef4444"
                    unit="GB"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-medium text-muted-foreground">Per-Agent Memory</span>
                  {agents.map((agent, index) => (
                    <motion.div
                      key={agent.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{
                        delay: index * 0.1,
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    >
                      <AgentMemoryCard agent={agent} />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  )
}
