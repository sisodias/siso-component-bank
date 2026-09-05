"use client"

import { useEffect, useRef, useState } from "react"

interface AsciiHeroProps {
  text: string
}

export default function AsciiHero({ text }: AsciiHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)
  const [customText, setCustomText] = useState(text)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [inputValue, setInputValue] = useState(text)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current

    // ASCII art for letters and numbers
    const asciiLetters = {
      A: ["  ████  ", " ██  ██ ", "████████", "██    ██", "██    ██", "██    ██"],
      B: ["███████ ", "██    ██", "███████ ", "██    ██", "██    ██", "███████ "],
      C: [" ███████", "██      ", "██      ", "██      ", "██      ", " ███████"],
      D: ["███████ ", "██    ██", "██    ██", "██    ██", "██    ██", "███████ "],
      E: ["████████", "██      ", "██████  ", "██      ", "██      ", "████████"],
      F: ["████████", "██      ", "██████  ", "██      ", "██      ", "██      "],
      G: [" ███████", "██      ", "██  ████", "██    ██", "██    ██", " ███████"],
      H: ["██    ██", "██    ██", "████████", "██    ██", "██    ██", "██    ██"],
      I: ["████████", "   ██   ", "   ██   ", "   ██   ", "   ██   ", "████████"],
      J: ["████████", "      ██", "      ██", "      ██", "██    ██", " ███████"],
      K: ["██    ██", "██  ██  ", "████    ", "██  ██  ", "██    ██", "██    ██"],
      L: ["██      ", "██      ", "██      ", "██      ", "██      ", "████████"],
      M: ["██    ██", "████████", "██ ██ ██", "██    ██", "██    ██", "██    ██"],
      N: ["██    ██", "███   ██", "██ ██ ██", "██   ███", "██    ██", "██    ██"],
      O: [" ███████", "██    ██", "██    ██", "██    ██", "██    ██", " ███████"],
      P: ["███████ ", "██    ██", "███████ ", "██      ", "██      ", "██      "],
      Q: [" ███████", "██    ██", "██    ██", "██ ██ ██", "██   ███", " ████████"],
      R: ["███████ ", "██    ██", "███████ ", "██   ██ ", "██    ██", "██    ██"],
      S: [" ███████", "██      ", " ██████ ", "      ██", "      ██", "███████ "],
      T: ["████████", "   ██   ", "   ██   ", "   ██   ", "   ██   ", "   ██   "],
      U: ["██    ██", "██    ██", "██    ██", "██    ██", "██    ██", " ███████"],
      V: ["██    ██", "██    ██", "██    ██", " ██  ██ ", "  ████  ", "   ██   "],
      W: ["██    ██", "██    ██", "██    ██", "██ ██ ██", "████████", "██    ██"],
      X: ["██    ██", " ██  ██ ", "  ████  ", "  ████  ", " ██  ██ ", "██    ██"],
      Y: ["██    ██", " ██  ██ ", "  ████  ", "   ██   ", "   ██   ", "   ██   "],
      Z: ["████████", "      ██", "    ██  ", "  ██    ", "██      ", "████████"],
      "0": [" ███████", "██    ██", "██   ███", "██ ██ ██", "███   ██", " ███████"],
      "1": ["   ██   ", "  ███   ", "   ██   ", "   ██   ", "   ██   ", "████████"],
      "2": [" ███████", "██    ██", "      ██", "  █████ ", "██      ", "████████"],
      "3": [" ███████", "██    ██", "   ████ ", "      ██", "██    ██", " ███████"],
      "4": ["██    ██", "██    ██", "████████", "      ██", "      ██", "      ██"],
      "5": ["████████", "██      ", "███████ ", "      ██", "██    ██", " ███████"],
      "6": [" ███████", "██      ", "███████ ", "██    ██", "██    ██", " ███████"],
      "7": ["████████", "      ██", "    ██  ", "   ██   ", "  ██    ", "  ██    "],
      "8": [" ███████", "██    ██", " ███████", "██    ██", "██    ██", " ███████"],
      "9": [" ███████", "██    ██", "██    ██", " ███████", "      ██", " ███████"],
      ".": ["        ", "        ", "        ", "        ", "   ██   ", "   ██   "],
      " ": ["        ", "        ", "        ", "        ", "        ", "        "],
    }

    // Create 3D-like ASCII effect
    const create3DText = (text: string, depth = 3) => {
      const letters = text
        .toUpperCase()
        .split("")
        .map((char) => asciiLetters[char as keyof typeof asciiLetters] || asciiLetters.E)
      const lines: string[] = []

      // Create each line of the combined text
      for (let row = 0; row < 6; row++) {
        let line = ""
        letters.forEach((letter, letterIndex) => {
          line += letter[row] + "  " // Add spacing between letters
        })
        lines.push(line)
      }

      // Add 3D depth effect
      const result: string[] = []
      lines.forEach((line, lineIndex) => {
        // Main line
        result.push(line)
        // Add depth lines (shifted and with different characters)
        for (let d = 1; d <= depth; d++) {
          const depthLine = " ".repeat(d) + line.replace(/█/g, "▓").replace(/ /g, " ")
          result.push(depthLine)
        }
      })

      return result
    }

    // Create the ASCII art
    let rotation = 0
    const textLines = create3DText(customText, 2)

    // Create pre element for ASCII display
    const preElement = document.createElement("pre")
    preElement.style.cssText = `
      font-family: 'Courier New', monospace;
      font-size: 12px;
      line-height: 1;
      color: white;
      background: black;
      margin: 0;
      padding: 20px;
      white-space: pre;
      overflow: hidden;
      text-align: center;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      user-select: none;
    `

    container.appendChild(preElement)

    // Animation function
    const animate = () => {
      rotation += 0.02

      // Create rotation effect by shifting characters
      const rotatedLines = textLines.map((line, index) => {
        const shift = Math.floor(Math.sin(rotation + index * 0.1) * 3)
        const spaces = " ".repeat(Math.max(0, shift))
        return spaces + line
      })

      // Add some perspective distortion
      const perspectiveLines = rotatedLines.map((line, index) => {
        const centerIndex = Math.floor(rotatedLines.length / 2)
        const distance = Math.abs(index - centerIndex)
        const scale = 1 - distance * 0.05

        if (scale < 0.5) return " ".repeat(line.length)

        // Simple scaling by removing characters
        if (scale < 1) {
          const keepEvery = Math.floor(1 / scale)
          return line
            .split("")
            .filter((_, i) => i % keepEvery === 0)
            .join("")
        }

        return line
      })

      preElement.textContent = perspectiveLines.join("\n")

      animationRef.current = requestAnimationFrame(animate)
    }

    // Start animation
    animate()

    // Handle resize
    const handleResize = () => {
      if (!container) return

      const fontSize = Math.max(8, Math.min(16, container.clientWidth / 80))
      preElement.style.fontSize = `${fontSize}px`
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener("resize", handleResize)
      if (container.contains(preElement)) {
        container.removeChild(preElement)
      }
    }
  }, [customText]) // Added customText as dependency to re-run animation when text changes

  const handleUpdateText = () => {
    if (inputValue.trim()) {
      setCustomText(inputValue.trim())
      setIsModalOpen(false)
    }
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-screen bg-black relative overflow-hidden"
      style={{
        fontFamily: "monospace",
      }}
    >
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-white text-black rounded-full shadow-lg hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center text-xl font-bold z-10"
        title="Change ASCII Text"
      >
        ✎
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white rounded-lg p-6 w-96 max-w-[90vw]">
            <h2 className="text-xl font-bold mb-4 text-black">Enter Text to Animate</h2>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter text to animate..."
              className="w-full p-3 border border-gray-300 rounded-md mb-4 text-black"
              maxLength={20}
              onKeyDown={(e) => e.key === "Enter" && handleUpdateText()}
              autoFocus
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateText}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
