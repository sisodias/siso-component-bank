"use client"

import { useState, useRef, useEffect } from "react"
import { Download, Sun, Moon, Play } from "lucide-react"
import * as htmlToImage from "html-to-image"

export interface ContributionDay {
  date: string
  count: number
}

interface Props {
  data: ContributionDay[]
  cellSize?: number
  gap?: number
}

export default function ContributionHeatmap({
  data,
  cellSize = 12,
  gap = 4
}: Props) {

  const mapRef = useRef<HTMLDivElement>(null)

  const [theme, setTheme] = useState<"dark" | "light">("dark")

  const [palette, setPalette] = useState("github")

  const [tooltip, setTooltip] = useState<{
    text: string
    date: string
    x: number
    y: number
  } | null>(null)

  const [replayIndex, setReplayIndex] = useState<number | null>(null)

  const days = generateCalendar(data)

  const maxCount = Math.max(...days.map(d => d.count), 1)

  const palettes = {
    github: ["#161b22","#0e4429","#006d32","#26a641","#39d353"],
    ocean: ["#0b1f2a","#0e4c92","#2a9df4","#5ab1ff","#b4d9ff"],
    sunset: ["#2a0b0b","#6e1c1c","#c23b22","#ff6b3d","#ff9a6c"]
  }

  const colors = palettes[palette as keyof typeof palettes]

  const weeks = Math.ceil(days.length / 7)

  const dates = days.map(d => d.date)

  const exportPNG = async () => {

    if (!mapRef.current) return

    const dataUrl = await htmlToImage.toPng(mapRef.current)

    const link = document.createElement("a")

    link.download = "contribution-heatmap.png"
    link.href = dataUrl
    link.click()

  }

  const replay = () => {

    setReplayIndex(0)

  }

  useEffect(() => {

    if (replayIndex === null) return

    if (replayIndex >= days.length) {

      setReplayIndex(null)
      return

    }

    const t = setTimeout(() => {

      setReplayIndex((v) => (v ?? 0) + 1)

    }, 8)

    return () => clearTimeout(t)

  }, [replayIndex, days.length])

  return (

    <div
      className={`p-6 rounded-xl border shadow-sm w-fit transition-colors
      ${theme === "dark"
        ? "bg-neutral-950 border-neutral-800 text-neutral-200"
        : "bg-white border-neutral-200 text-neutral-800"
      }`}
    >

      {/* HEADER */}

      <div className="flex justify-between items-start mb-6">

        <div>

          <h3 className="text-sm font-semibold">
            Contribution Heatmap
          </h3>

          <p className="text-xs opacity-60">
            Activity over the past year
          </p>

        </div>

        <div className="flex gap-2">

          <button
            onClick={exportPNG}
            className="p-2 rounded-md border hover:bg-neutral-800/40 transition"
          >
            <Download size={16}/>
          </button>

          <button
            onClick={replay}
            className="p-2 rounded-md border hover:bg-neutral-800/40 transition"
          >
            <Play size={16}/>
          </button>

          <button
            onClick={() =>
              setTheme(theme === "dark" ? "light" : "dark")
            }
            className="p-2 rounded-md border hover:bg-neutral-800/40 transition"
          >
            {theme === "dark" ? <Sun size={16}/> : <Moon size={16}/>}
          </button>

        </div>

      </div>

      {/* Palette selector */}

      <div className="flex gap-2 mb-4 text-xs">

        {Object.keys(palettes).map(p => (

          <button
            key={p}
            onClick={() => setPalette(p)}
            className={`px-2 py-1 border rounded
            ${palette === p ? "bg-neutral-700 text-white" : ""}`}
          >
            {p}
          </button>

        ))}

      </div>

      <div
        ref={mapRef}
        className="flex flex-col items-start relative"
      >

        <MonthLabels dates={dates} />

        <div className="flex gap-2">

          <WeekdayLabels cellSize={cellSize} gap={gap} />

          <div
            style={{
              display: "grid",
              gridTemplateRows: `repeat(7, ${cellSize}px)`,
              gridTemplateColumns: `repeat(${weeks}, ${cellSize}px)`,
              gap
            }}
          >

            {days.map((day, i) => {

              const visible =
                replayIndex === null || i <= replayIndex

              const count = visible ? day.count : 0

              const intensity =
                count === 0
                  ? 0
                  : Math.min(
                      Math.floor((count / maxCount) * 4) + 1,
                      4
                    )

              const color = colors[intensity]

              return (

                <div
                  key={day.date}
                  tabIndex={0}
                  className="rounded-sm transition-transform hover:scale-110"
                  style={{
                    width: cellSize,
                    height: cellSize,
                    background: color
                  }}
                  onMouseEnter={(e) => {

                    const rect = e.currentTarget.getBoundingClientRect()

                    setTooltip({
                      x: rect.left + rect.width / 2,
                      y: rect.top,
                      text: `${day.count} contributions`,
                      date: new Date(day.date).toLocaleDateString()
                    })

                  }}
                  onMouseLeave={() => setTooltip(null)}

                />

              )

            })}

          </div>

        </div>

        <Legend colors={colors} />

        {tooltip && (

          <div
            style={{
              position: "fixed",
              left: tooltip.x,
              top: tooltip.y - 8,
              transform: "translate(-50%, -100%)"
            }}
            className="bg-black text-white text-xs px-2 py-1 rounded shadow-lg pointer-events-none"
          >

            <div>{tooltip.text}</div>
            <div className="opacity-70">{tooltip.date}</div>

          </div>

        )}

      </div>

    </div>

  )

}

function WeekdayLabels({
  cellSize,
  gap
}: {
  cellSize:number
  gap:number
}) {

  return (

    <div
      style={{
        display: "grid",
        gridTemplateRows: `repeat(7, ${cellSize}px)`,
        gap,
        width: 28,
        fontSize: 11,
        opacity: .6
      }}
    >

      <span></span>
      <span>Mon</span>
      <span></span>
      <span>Wed</span>
      <span></span>
      <span>Fri</span>
      <span></span>

    </div>

  )

}

function MonthLabels({ dates }: { dates:string[] }) {

  const months:{label:string,col:number}[]=[]
  let lastMonth=-1

  dates.forEach((date,i)=>{

    const d=new Date(date)
    const month=d.getMonth()

    if(month!==lastMonth && d.getDate()<=7){

      months.push({
        label:d.toLocaleString("default",{month:"short"}),
        col:Math.floor(i/7)
      })

      lastMonth=month

    }

  })

  return(

    <div
      className="grid grid-flow-col gap-1 text-xs mb-2 opacity-60"
      style={{marginLeft:30}}
    >

      {months.map((m,i)=>(
        <div key={i} style={{gridColumnStart:m.col+1}}>
          {m.label}
        </div>
      ))}

    </div>

  )

}

function Legend({ colors }:{colors:string[]}){

  return(

    <div className="flex items-center gap-2 mt-4 text-xs opacity-60">

      <span>Less</span>

      {colors.map((c,i)=>(
        <div
          key={i}
          className="w-3 h-3 rounded-sm border border-black/10"
          style={{background:c}}
        />
      ))}

      <span>More</span>

    </div>

  )

}

function generateCalendar(data:ContributionDay[]){

  const map=new Map(data.map(d=>[d.date,d.count]))

  const start=new Date(data[0].date)
  const end=new Date(data[data.length-1].date)

  start.setDate(start.getDate()-start.getDay())
  end.setDate(end.getDate()+(6-end.getDay()))

  const days:ContributionDay[]=[]
  const cursor=new Date(start)

  while(cursor<=end){

    const date=cursor.toISOString().split("T")[0]

    days.push({
      date,
      count:map.get(date) ?? 0
    })

    cursor.setDate(cursor.getDate()+1)

  }

  return days

}