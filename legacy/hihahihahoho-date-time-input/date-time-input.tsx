import { format, getDaysInMonth, isValid, parse } from "date-fns"
import React, { useEffect, useRef, useState } from "react"

function isStringNumber(value: string) {
  return /^-?\d+(\.\d+)?$/.test(value)
}

function handleZeroValue(val: string): string {
  return parseInt(val) === 0 ? val.slice(1) + "1" : val
}

interface DateGroupContextValue {
  registerSegment: (seg: HTMLDivElement) => void
  unregisterSegment: (seg: HTMLDivElement) => void
  moveFocus: (current: HTMLDivElement, direction: -1 | 1) => void
}

const DateGroupContext = React.createContext<DateGroupContextValue | null>(null)
function useDateGroupContext() {
  return React.useContext(DateGroupContext)
}

export interface DateGroupProps extends React.PropsWithChildren {
  onFocusWithin?: (event: React.FocusEvent<HTMLDivElement>) => void
  onBlurWithin?: (event: React.FocusEvent<HTMLDivElement>) => void
}

const DateGroup = React.forwardRef<HTMLDivElement, DateGroupProps>(
  function DateGroup(props, forwardedRef: React.ForwardedRef<HTMLDivElement>) {
    const { children, onFocusWithin, onBlurWithin } = props

    const segmentRefs = useRef<HTMLDivElement[]>([])

    const [isFocusWithin, setIsFocusWithin] = useState(false)

    const registerSegment = React.useCallback((seg: HTMLDivElement) => {
      segmentRefs.current.push(seg)
    }, [])

    const unregisterSegment = React.useCallback((seg: HTMLDivElement) => {
      segmentRefs.current = segmentRefs.current.filter((el) => el !== seg)
    }, [])

    const moveFocus = React.useCallback(
      (current: HTMLDivElement, direction: -1 | 1) => {
        const validRefs = segmentRefs.current.filter((el) =>
          document.contains(el),
        )

        validRefs.sort((a, b) => {
          const pos = a.compareDocumentPosition(b)
          if (pos & Node.DOCUMENT_POSITION_FOLLOWING) return -1
          if (pos & Node.DOCUMENT_POSITION_PRECEDING) return 1
          return 0
        })

        const currentIndex = validRefs.indexOf(current)
        if (currentIndex === -1) return

        const targetIndex = currentIndex + direction
        if (targetIndex >= 0 && targetIndex < validRefs.length) {
          validRefs[targetIndex].focus()
        }
      },
      [],
    )

    const handleFocus = (e: React.FocusEvent<HTMLDivElement>) => {
      if (!isFocusWithin) {
        setIsFocusWithin(true)
        onFocusWithin?.(e)
      }
    }

    const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
      if (!e.currentTarget.contains(e.relatedTarget)) {
        setIsFocusWithin(false)
        onBlurWithin?.(e)
      }
    }

    const contextValue: DateGroupContextValue = {
      registerSegment,
      unregisterSegment,
      moveFocus,
    }

    return (
      <DateGroupContext.Provider value={contextValue}>
        <div
          ref={forwardedRef}
          onFocus={handleFocus}
          onBlur={handleBlur}
          tabIndex={-1}
        >
          {children}
        </div>
      </DateGroupContext.Provider>
    )
  },
)

export type Granularity = "date" | "time" | "datetime"
type SegmentId = "month" | "day" | "year" | "hour" | "minute"

interface LocaleConfig {
  format: string
  segments: Array<{
    id: SegmentId
    placeholder: string
    label: string
  }>
  separator?: string
}

type LocaleConfigs = {
  [key in "en-US" | "en-GB" | "de-DE"]: LocaleConfig
}

const LOCALES: LocaleConfigs = {
  "en-US": {
    format: "MM/DD/YYYY",
    segments: [
      { id: "month", placeholder: "mm", label: "Month" },
      { id: "day", placeholder: "dd", label: "Day" },
      { id: "year", placeholder: "yyyy", label: "Year" },
    ],
  },
  "en-GB": {
    format: "DD/MM/YYYY",
    segments: [
      { id: "day", placeholder: "dd", label: "Day" },
      { id: "month", placeholder: "mm", label: "Month" },
      { id: "year", placeholder: "yyyy", label: "Year" },
    ],
  },
  "de-DE": {
    format: "DD.MM.YYYY",
    segments: [
      { id: "day", placeholder: "TT", label: "Tag" },
      { id: "month", placeholder: "MM", label: "Monat" },
      { id: "year", placeholder: "JJJJ", label: "Jahr" },
    ],
    separator: ".",
  },
}

interface DateSegmentProps {
  value: string
  onChange: (value: string) => void
  placeholder: string
  maxLength: number
  maxValue: number
  id: string // For accessibility
  label: string // For accessibility
  resetKey: number
  segmentRefCallback?: (node: HTMLDivElement | null) => void
  disabled?: boolean
  readonly?: boolean
}

function DateSegment({
  value,
  onChange,
  placeholder,
  maxLength,
  maxValue,
  id,
  label,
  segmentRefCallback,
  resetKey,
  disabled,
  readonly,
}: DateSegmentProps) {
  const ref = useRef<HTMLDivElement>(null)
  const dateGroup = useDateGroupContext()

  const [isFocused, setIsFocused] = useState(false)
  const [inputValue, setInputValue] = useState(value)
  const [isOverwriteMode, setIsOverwriteMode] = useState(true)

  useEffect(() => {
    const node = ref.current
    if (dateGroup && node) {
      dateGroup.registerSegment(node)

      return () => {
        dateGroup.unregisterSegment(node)
      }
    }
  }, [dateGroup])

  useEffect(() => {
    if (segmentRefCallback) {
      segmentRefCallback(ref.current)
      return () => {
        segmentRefCallback(null)
      }
    }
  }, [segmentRefCallback])

  useEffect(() => {
    if (!isFocused) {
      setInputValue(value)
    }
  }, [value, isFocused])

  useEffect(() => {
    if (resetKey > 0) {
      setInputValue("")
    }
  }, [resetKey])

  const focusNextSegment = () => {
    if (dateGroup && ref.current) {
      dateGroup.moveFocus(ref.current, 1)
    }
  }
  const focusPrevSegment = () => {
    if (dateGroup && ref.current) {
      dateGroup.moveFocus(ref.current, -1)
    }
  }

  const handleBeforeInput = (e: React.FormEvent<HTMLDivElement>) => {
    const event = e as unknown as InputEvent
    if (!/^\d+$/.test(event.data || "")) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  const handleNumberInput = (e: React.KeyboardEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const newDigit = e.key

    if (isOverwriteMode) {
      setInputValue(newDigit)
      setIsOverwriteMode(false)

      if (parseInt(newDigit) * 10 > maxValue) {
        onChange(newDigit)
        focusNextSegment()
      } else {
        onChange(newDigit)
      }
      return
    }

    const newValue = inputValue + newDigit

    if (newValue.length > maxLength) {
      setInputValue(newDigit)
      onChange(newDigit)
      focusNextSegment()
      return
    }

    const combinedNum = parseInt(newValue)

    if (maxLength === 2) {
      if (combinedNum > maxValue) {
        setInputValue(newDigit)
        onChange(newDigit)
        focusNextSegment()
        return
      }
      // If single digit *10 is out of range => auto-advance
      if (combinedNum.toString().length === 1 && combinedNum * 10 > maxValue) {
        setInputValue(newDigit)
        onChange(newDigit)
        focusNextSegment()
        return
      }

      setInputValue(newValue)
      onChange(newValue)

      if (newValue.length === maxLength) {
        focusNextSegment()
      }
    } else {
      // For "year" or other lengths
      if (newValue.length <= maxLength && combinedNum <= maxValue) {
        setInputValue(newValue)
        onChange(newValue)
        if (newValue.length === maxLength) {
          focusNextSegment()
        }
      } else {
        setInputValue(newDigit)
        onChange(newDigit)
        focusNextSegment()
      }
    }
  }

  // Key handling
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled || readonly) return
    e.stopPropagation()
    if (e.key === "Tab") {
      setIsOverwriteMode(true)
      return
    }
    if (/^\d$/.test(e.key)) {
      handleNumberInput(e)
      return
    }

    switch (e.key) {
      case "ArrowUp": {
        e.preventDefault()
        const nextVal = Math.min((parseInt(inputValue) || 0) + 1, maxValue)
        const valStr =
          maxLength === 2
            ? nextVal.toString().padStart(2, "0")
            : nextVal.toString()
        setInputValue(valStr)
        onChange(valStr)
        break
      }
      case "ArrowDown": {
        e.preventDefault()
        const nextVal = Math.max((parseInt(inputValue) || 0) - 1, 0)
        const valStr =
          maxLength === 2
            ? nextVal.toString().padStart(2, "0")
            : nextVal.toString()
        setInputValue(valStr)
        onChange(valStr)
        break
      }
      case "Backspace":
        e.preventDefault()
        if (inputValue.length > 0) {
          const newVal = inputValue.slice(0, -1)
          setInputValue(newVal)
          onChange(newVal)
        } else {
          // Already empty => jump to previous
          focusPrevSegment()
        }
        setIsOverwriteMode(false)
        break
      case "Delete":
        e.preventDefault()
        setInputValue("")
        onChange("")
        setIsOverwriteMode(true)
        break
      case "ArrowLeft":
        e.preventDefault()
        focusPrevSegment()
        break
      case "ArrowRight":
        e.preventDefault()
        focusNextSegment()
        break
      default:
        e.preventDefault()
        break
    }
  }

  const handleFocus = () => {
    setIsFocused(true)
    setIsOverwriteMode(true)
  }
  const handleBlur = () => {
    setIsFocused(false)
    setIsOverwriteMode(true)
  }

  const displayValue = isFocused ? inputValue : value
  const paddedValue =
    (id.includes("year") && displayValue
      ? displayValue.padStart(4, "0")
      : displayValue
        ? displayValue.padStart(maxLength, "0")
        : placeholder) || placeholder

  return (
    <div>
      <div
        ref={ref}
        role="spinbutton"
        className={`relative caret-transparent select-none tabular-nums px-[1px] outline-none rounded-md cursor-text text-center ${
          !displayValue ? "text-muted-foreground" : "text-foreground"
        } ${isFocused ? "bg-primary/20" : "hover:bg-accent"}`}
        id={id}
        aria-label={label}
        contentEditable={!disabled && !readonly}
        suppressContentEditableWarning
        inputMode="numeric"
        spellCheck="false"
        autoCorrect="off"
        tabIndex={0}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onBeforeInput={handleBeforeInput}
        onClick={(e) => e.stopPropagation()}
      >
        {paddedValue}
      </div>
    </div>
  )
}

export interface DateTimeInputProps {
  locale?: keyof LocaleConfigs
  value?: Date
  defaultValue?: Date
  onValueChange?: (value: Date | undefined | "invalid") => void
  granularity?: Granularity
  disabled?: boolean
  readonly?: boolean
}

export interface DateTimeInputHandle {
  focus: () => void
  clear: () => void
}

const DateTimeInput = React.forwardRef<DateTimeInputHandle, DateTimeInputProps>(
  function DateTimeInput(
    {
      locale = "en-US",
      value,
      defaultValue,
      onValueChange,
      granularity = "date",
      disabled,
      readonly,
    }: DateTimeInputProps,
    ref,
  ) {
    const uid = React.useId()

    const [resetKey, setResetKey] = useState(0)

    const [day, setDay] = useState(
      isValid(value) ? format(value || "", "d") : "",
    )
    const [month, setMonth] = useState(
      isValid(value) ? format(value || "", "M") : "",
    )
    const [year, setYear] = useState(
      isValid(value) ? format(value || "", "yyyy") : "",
    )
    const [hour, setHour] = useState(
      isValid(value) ? format(value || "", "H") : "",
    )
    const [minute, setMinute] = useState(
      isValid(value) ? format(value || "", "m") : "",
    )

    const segmentRefs = useRef<HTMLDivElement[]>([])

    const segmentRefCallback = (node: HTMLDivElement | null) => {
      if (node) {
        if (!segmentRefs.current.includes(node)) {
          segmentRefs.current.push(node)
        }
      } else {
        segmentRefs.current = segmentRefs.current.filter((el) => el !== node)
      }
    }

    useEffect(() => {
      if (!value && defaultValue) {
        if (granularity !== "time") {
          setDay(format(defaultValue, "d"))
          setMonth(format(defaultValue, "M"))
          setYear(format(defaultValue, "yyyy"))
        }
        if (granularity !== "date") {
          setHour(format(defaultValue, "H"))
          setMinute(format(defaultValue, "m"))
        }
      }
    }, [value, defaultValue, granularity])

    useEffect(() => {
      if (value) {
        if (granularity !== "time") {
          setDay(format(value, "d"))
          setMonth(format(value, "M"))
          setYear(format(value, "yyyy"))
        }
        if (granularity !== "date") {
          setHour(format(value, "H"))
          setMinute(format(value, "m"))
        }
      }
    }, [value, granularity])

    function updateFinalValue(
      d: string,
      m: string,
      y: string,
      h: string,
      min: string,
    ) {
      let parsed: Date | null = null
      if (granularity === "date") {
        const str = `${y.padStart(4, "0")}-${m.padStart(2, "0")}-${d.padStart(
          2,
          "0",
        )}`
        parsed = parse(str, "yyyy-MM-dd", new Date())
      } else if (granularity === "time") {
        const str = `${h.padStart(2, "0")}:${min.padStart(2, "0")}`
        parsed = parse(str, "HH:mm", new Date())
      } else {
        // datetime
        const dateStr = `${y.padStart(4, "0")}-${m.padStart(
          2,
          "0",
        )}-${d.padStart(2, "0")}`
        const timeStr = `${h.padStart(2, "0")}:${min.padStart(2, "0")}`
        parsed = parse(`${dateStr} ${timeStr}`, "yyyy-MM-dd HH:mm", new Date())
      }
      if (parsed && isValid(parsed)) {
        onValueChange?.(parsed)
      } else {
        if (d || m || y || h || min) {
          onValueChange?.("invalid")
        } else {
          onValueChange?.(undefined)
        }
      }
    }

    function getSegmentIds(): SegmentId[] {
      const ids: SegmentId[] = []
      if (granularity !== "time") {
        ids.push(...LOCALES[locale].segments.map((s) => s.id))
      }
      if (granularity !== "date") {
        ids.push("hour", "minute")
      }
      return ids
    }

    function getSegmentConfig(id: SegmentId) {
      switch (id) {
        case "day": {
          const yInt = parseInt(year)
          const mInt = parseInt(month)
          if (isNaN(yInt) || isNaN(mInt)) {
            return { maxLength: 2, maxValue: 31 }
          }
          const days = getDaysInMonth(
            parse(`${yInt}-${mInt}-01`, "yyyy-MM-dd", new Date()),
          )
          return { maxLength: 2, maxValue: days }
        }
        case "month":
          return { maxLength: 2, maxValue: 12 }
        case "year":
          return { maxLength: 4, maxValue: 9999 }
        case "hour":
          return { maxLength: 2, maxValue: 23 }
        case "minute":
          return { maxLength: 2, maxValue: 59 }
        default:
          return { maxLength: 2, maxValue: 99 }
      }
    }

    function getSegmentMeta(id: SegmentId) {
      const dateSeg = LOCALES[locale].segments.find((s) => s.id === id)
      if (dateSeg)
        return { placeholder: dateSeg.placeholder, label: dateSeg.label }

      if (id === "hour") {
        return { placeholder: "hh", label: "Hour" }
      }
      if (id === "minute") {
        return { placeholder: "mm", label: "Minute" }
      }
      return { placeholder: "", label: "" }
    }

    function getSegmentValue(id: SegmentId) {
      switch (id) {
        case "day":
          return day
        case "month":
          return month
        case "year":
          return year
        case "hour":
          return hour
        case "minute":
          return minute
        default:
          return ""
      }
    }

    function setSegmentValue(id: SegmentId, newVal: string) {
      let d = day,
        m = month,
        y = year,
        h = hour,
        min = minute

      switch (id) {
        case "day":
          d = handleZeroValue(newVal)
          setDay(d)
          break
        case "month":
          m = handleZeroValue(newVal)
          setMonth(m)
          {
            const yInt = parseInt(y)
            const mInt = parseInt(m)
            if (!isNaN(yInt) && !isNaN(mInt)) {
              const dim = getDaysInMonth(
                parse(`${yInt}-${mInt}-01`, "yyyy-MM-dd", new Date()),
              )
              if (parseInt(d) > dim) {
                d = String(dim)
                setDay(d)
              }
            }
          }
          break
        case "year":
          y = handleZeroValue(newVal)
          setYear(y)
          {
            const yInt = parseInt(y)
            const mInt = parseInt(m)
            if (!isNaN(yInt) && !isNaN(mInt)) {
              const dim2 = getDaysInMonth(
                parse(`${yInt}-${mInt}-01`, "yyyy-MM-dd", new Date()),
              )
              if (parseInt(d) > dim2) {
                d = String(dim2)
                setDay(d)
              }
            }
          }
          break
        case "hour":
          h = newVal
          setHour(h)
          break
        case "minute":
          min = newVal
          setMinute(min)
          break
      }

      updateFinalValue(d, m, y, h, min)
    }

    const segmentIds = getSegmentIds()

    React.useImperativeHandle(ref, () => ({
      focus: () => {
        if (segmentRefs.current.length > 0) {
          let firstUneditedSegment: HTMLDivElement | null = null
          for (let i = 0; i < segmentRefs.current.length; i++) {
            const segment = segmentRefs.current[i]
            if (!isStringNumber(segment.textContent || "")) {
              firstUneditedSegment = segment
              break
            }
          }
          if (firstUneditedSegment) {
            firstUneditedSegment.focus()
          } else {
            const lastSegment =
              segmentRefs.current[segmentRefs.current.length - 1]
            lastSegment.focus()
          }
        }
      },
      clear: () => {
        setDay("")
        setMonth("")
        setYear("")
        setHour("")
        setMinute("")
        onValueChange?.(undefined)

        setResetKey((k) => k + 1)
      },
    }))

    return (
      <div
        className="flex gap-[1px] mx-[-1px] select-none"
        aria-label="Date/Time Input"
      >
        {segmentIds.map((segId, index) => {
          const segmentValue = getSegmentValue(segId)
          const { maxLength, maxValue } = getSegmentConfig(segId)
          const { placeholder, label } = getSegmentMeta(segId)

          let sep: string | undefined
          const dateConfig = LOCALES[locale]

          if (segId === "hour" && index < segmentIds.length - 1) {
            sep = ":"
          } else if (
            (segId === "day" || segId === "month" || segId === "year") &&
            index < segmentIds.length - 1
          ) {
            const nextSegId = segmentIds[index + 1]
            if (["day", "month", "year"].includes(nextSegId)) {
              sep = dateConfig.separator ?? "/"
            } else {
              sep = ","
            }
          }

          return (
            <React.Fragment key={segId}>
              <DateSegment
                id={`${uid}-${segId}`}
                value={segmentValue}
                onChange={(v) => setSegmentValue(segId, v)}
                placeholder={placeholder}
                label={label}
                maxLength={maxLength}
                maxValue={maxValue}
                segmentRefCallback={segmentRefCallback}
                resetKey={resetKey}
                disabled={disabled}
                readonly={readonly}
              />
              {sep && (
                <span aria-hidden="true" className="text-muted-foreground">
                  {sep}
                </span>
              )}
            </React.Fragment>
          )
        })}
      </div>
    )
  },
)

export { DateGroup, DateTimeInput, useDateGroupContext }
