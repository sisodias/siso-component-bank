"use client"

import { useState } from "react"
import { Delete, RotateCcw } from "lucide-react"

export default function Calculator() {
  const [display, setDisplay] = useState("0")
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  const [history, setHistory] = useState<string[]>([])

  const MAX_DISPLAY_LENGTH = 10

  const formatForDisplay = (value: number): string => {
    // Handle special cases
    if (!isFinite(value)) {
      return value > 0 ? "Infinity" : "-Infinity"
    }
    if (isNaN(value)) {
      return "Error"
    }

    const stringValue = String(value)
    
    // If it fits as-is, return it
    if (stringValue.length <= MAX_DISPLAY_LENGTH) {
      return stringValue
    }

    // Try to fit with fewer decimal places
    if (stringValue.includes('.')) {
      const [integerPart, decimalPart] = stringValue.split('.')
      const availableDecimals = MAX_DISPLAY_LENGTH - integerPart.length - 1 // -1 for the decimal point
      
      if (availableDecimals > 0) {
        return value.toFixed(Math.min(availableDecimals, decimalPart.length))
      }
    }

    // If the integer part is too long or we can't fit it with decimals, use exponential notation
    const exponential = value.toExponential()
    if (exponential.length <= MAX_DISPLAY_LENGTH) {
      return exponential
    }

    // If even exponential is too long, reduce precision
    let precision = 5
    while (precision >= 0) {
      const exp = value.toExponential(precision)
      if (exp.length <= MAX_DISPLAY_LENGTH) {
        return exp
      }
      precision--
    }

    return value.toExponential(0)
  }

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num)
      setWaitingForOperand(false)
    } else {
      const newDisplay = display === "0" ? num : display + num
      // Check if the new display would be too long
      // Account for decimal points and negative signs
      const effectiveLength = newDisplay.replace('.', '').replace('-', '').length
      if (effectiveLength <= MAX_DISPLAY_LENGTH) {
        setDisplay(newDisplay)
      }
    }
  }

  const inputOperation = (nextOperation: string) => {
    const inputValue = Number.parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operation) {
      const currentValue = previousValue || 0
      const newValue = calculate(currentValue, inputValue, operation)

      setDisplay(formatForDisplay(newValue))
      setPreviousValue(newValue)

      // Add to history
      setHistory((prev) => [...prev.slice(-4), `${currentValue} ${operation} ${inputValue} = ${newValue}`])
    }

    setWaitingForOperand(true)
    setOperation(nextOperation)
  }

  const calculate = (firstValue: number, secondValue: number, operation: string) => {
    switch (operation) {
      case "+":
        return firstValue + secondValue
      case "-":
        return firstValue - secondValue
      case "×":
        return firstValue * secondValue
      case "÷":
        return firstValue / secondValue
      case "=":
        return secondValue
      default:
        return secondValue
    }
  }

  const performCalculation = () => {
    const inputValue = Number.parseFloat(display)

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation)
      setDisplay(formatForDisplay(newValue))
      setHistory((prev) => [...prev.slice(-4), `${previousValue} ${operation} ${inputValue} = ${newValue}`])
      setPreviousValue(null)
      setOperation(null)
      setWaitingForOperand(true)
    }
  }

  const clear = () => {
    setDisplay("0")
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(false)
  }

  const clearHistory = () => {
    setHistory([])
  }

  const backspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1))
    } else {
      setDisplay("0")
    }
  }

  const handleButtonClick = (btn: string) => {
    if (btn === "C") {
      clear()
    } else if (btn === "=") {
      performCalculation()
    } else if (["÷", "×", "-", "+"].includes(btn)) {
      inputOperation(btn)
    } else if (btn === "±") {
      const newValue = Number.parseFloat(display) * -1
      setDisplay(formatForDisplay(newValue))
    } else if (btn === "%") {
      const newValue = Number.parseFloat(display) / 100
      setDisplay(formatForDisplay(newValue))
    } else if (btn === ".") {
      // Only add decimal if there isn't one already
      if (!display.includes(".")) {
        inputNumber(btn)
      }
    } else {
      inputNumber(btn)
    }
  }

  const getButtonClass = (btn: string) => {
    if (["÷", "×", "-", "+", "="].includes(btn)) {
      return "bg-orange-500 hover:bg-orange-600 text-white"
    }
    if (["C", "±", "%"].includes(btn)) {
      return "bg-gray-500 hover:bg-gray-600 text-white"
    }
    return "bg-gray-700 hover:bg-gray-600 text-white"
  }

  return (
    <div className="bg-gray-900 rounded-lg p-3 h-full w-64 flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white font-semibold text-sm">Calculator</h3>
        <div className="flex space-x-1">
          <button onClick={backspace} className="text-gray-400 hover:text-white">
            <Delete size={14} />
          </button>
          <button onClick={clearHistory} className="text-gray-400 hover:text-white">
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* History */}
      <div className="bg-gray-800 rounded p-2 mb-2 h-12 overflow-y-auto">
        {history.length > 0 ? (
          <div className="space-y-1">
            {history.slice(-2).map((entry, index) => (
              <div key={index} className="text-xs text-gray-400">
                {entry}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-gray-500">History will appear here</div>
        )}
      </div>

      {/* Display */}
      <div className="bg-black rounded p-3 mb-2 text-right">
        <div className="text-white text-2xl font-mono overflow-hidden">{display}</div>
        {operation && (
          <div className="text-orange-400 text-sm">
            {previousValue} {operation}
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-4 gap-2 flex-1">
        {/* Row 1 */}
        <button onClick={() => handleButtonClick("C")} className={`${getButtonClass("C")} h-10 rounded text-lg font-semibold transition-colors active:scale-95`}>C</button>
        <button onClick={() => handleButtonClick("±")} className={`${getButtonClass("±")} h-10 rounded text-lg font-semibold transition-colors active:scale-95`}>±</button>
        <button onClick={() => handleButtonClick("%")} className={`${getButtonClass("%")} h-10 rounded text-lg font-semibold transition-colors active:scale-95`}>%</button>
        <button onClick={() => handleButtonClick("÷")} className={`${getButtonClass("÷")} h-10 rounded text-lg font-semibold transition-colors active:scale-95`}>÷</button>
        
        {/* Row 2 */}
        <button onClick={() => handleButtonClick("7")} className={`${getButtonClass("7")} h-10 rounded text-lg font-semibold transition-colors active:scale-95`}>7</button>
        <button onClick={() => handleButtonClick("8")} className={`${getButtonClass("8")} h-10 rounded text-lg font-semibold transition-colors active:scale-95`}>8</button>
        <button onClick={() => handleButtonClick("9")} className={`${getButtonClass("9")} h-10 rounded text-lg font-semibold transition-colors active:scale-95`}>9</button>
        <button onClick={() => handleButtonClick("×")} className={`${getButtonClass("×")} h-10 rounded text-lg font-semibold transition-colors active:scale-95`}>×</button>
        
        {/* Row 3 */}
        <button onClick={() => handleButtonClick("4")} className={`${getButtonClass("4")} h-10 rounded text-lg font-semibold transition-colors active:scale-95`}>4</button>
        <button onClick={() => handleButtonClick("5")} className={`${getButtonClass("5")} h-10 rounded text-lg font-semibold transition-colors active:scale-95`}>5</button>
        <button onClick={() => handleButtonClick("6")} className={`${getButtonClass("6")} h-10 rounded text-lg font-semibold transition-colors active:scale-95`}>6</button>
        <button onClick={() => handleButtonClick("-")} className={`${getButtonClass("-")} h-10 rounded text-lg font-semibold transition-colors active:scale-95`}>-</button>
        
        {/* Row 4 */}
        <button onClick={() => handleButtonClick("1")} className={`${getButtonClass("1")} h-10 rounded text-lg font-semibold transition-colors active:scale-95`}>1</button>
        <button onClick={() => handleButtonClick("2")} className={`${getButtonClass("2")} h-10 rounded text-lg font-semibold transition-colors active:scale-95`}>2</button>
        <button onClick={() => handleButtonClick("3")} className={`${getButtonClass("3")} h-10 rounded text-lg font-semibold transition-colors active:scale-95`}>3</button>
        <button onClick={() => handleButtonClick("+")} className={`${getButtonClass("+")} h-10 rounded text-lg font-semibold transition-colors active:scale-95`}>+</button>
        
        {/* Row 5 */}
        <button onClick={() => handleButtonClick("0")} className={`${getButtonClass("0")} h-10 rounded text-lg font-semibold transition-colors active:scale-95 col-span-2`}>0</button>
        <button onClick={() => handleButtonClick(".")} className={`${getButtonClass(".")} h-10 rounded text-lg font-semibold transition-colors active:scale-95`}>.</button>
        <button onClick={() => handleButtonClick("=")} className={`${getButtonClass("=")} h-10 rounded text-lg font-semibold transition-colors active:scale-95`}>=</button>
      </div>
    </div>
  )
}

export const Component = () => {
  return (
    <Calculator />
  )
}