"use client"

import { useState, useEffect } from "react"
import { AnimatePresence, motion, useAnimationControls } from "framer-motion"

const CheckIcon = ({ size = 16, strokeWidth = 3, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
)

const OTPSuccess = () => {
  return (
    <div className="flex items-center justify-center gap-4 w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 500, damping: 30 }}
        className="w-16 h-16 bg-green-500 ring-4 ring-green-100 dark:ring-green-900 text-white flex items-center justify-center rounded-full"
      >
        <CheckIcon size={32} strokeWidth={3} />
      </motion.div>
      <motion.p
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="text-green-600 dark:text-green-400 font-semibold text-lg"
      >
        OTP Verified!
      </motion.p>
    </div>
  )
}

const OTPError = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="text-center text-red-500 dark:text-red-400 font-medium mt-2 absolute -bottom-8 w-full"
    >
      Invalid OTP. Please try again.
    </motion.div>
  )
}

const OTPInputBox = ({ index, verifyOTP, state }) => {
  const animationControls = useAnimationControls()
  const springTransition = {
    type: "spring",
    stiffness: 700,
    damping: 20,
    delay: index * 0.05,
  }
  const noDelaySpringTransition = {
    type: "spring",
    stiffness: 700,
    damping: 20,
  }
  const slowSuccessTransition = {
    type: "spring",
    stiffness: 300,
    damping: 30,
    delay: index * 0.06,
  }

  useEffect(() => {
    animationControls.start({
      opacity: 1,
      y: 0,
      transition: springTransition,
    })
    return () => animationControls.stop()
  }, [])

  useEffect(() => {
    if (state === "success") {
      const transitionX = index * 68 // Adjusted for 4 inputs with gap
      animationControls.start({
        x: -transitionX,
        transition: slowSuccessTransition,
      })
    }
  }, [state, index, animationControls])

  const onFocus = () => {
    animationControls.start({ y: -5, transition: noDelaySpringTransition })
  }

  const onBlur = () => {
    animationControls.start({ y: 0, transition: noDelaySpringTransition })
  }

  const onKeyDown = (e) => {
    const { value } = e.target
    if (e.key === "Backspace" && !value && index > 0) {
      document.getElementById(`input-${index - 1}`)?.focus()
    } else if (e.key === "ArrowLeft" && index > 0) {
      document.getElementById(`input-${index - 1}`)?.focus()
    } else if (e.key === "ArrowRight" && index < 3) {
      // 4 inputs, so max index is 3
      document.getElementById(`input-${index + 1}`)?.focus()
    }
  }

  const onInput = (e) => {
    const { value } = e.target
    if (value.match(/^[0-9]$/)) {
      // Only allow a single digit
      e.target.value = value
      if (index < 3) {
        // 4 inputs, so move focus until the 3rd index
        document.getElementById(`input-${index + 1}`)?.focus()
      }
    } else {
      e.target.value = ""
    }
    verifyOTP()
  }

  const onPaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").trim().slice(0, 4)
    const digits = pastedData.split("").filter((char) => /^[0-9]$/.test(char))

    digits.forEach((digit, i) => {
      const targetIndex = index + i
      if (targetIndex < 4) {
        const input = document.getElementById(`input-${targetIndex}`)
        if (input) {
          input.value = digit
        }
      }
    })

    const nextFocusIndex = Math.min(index + digits.length, 3)
    document.getElementById(`input-${nextFocusIndex}`)?.focus()

    // Use a timeout to ensure all values are set before verifying
    setTimeout(verifyOTP, 0)
  }

  return (
    <motion.div
      className={`w-14 h-16 rounded-lg ring-2 ring-transparent focus-within:shadow-inner overflow-hidden transition-all duration-300 ${
        state === "error"
          ? "ring-red-400 dark:ring-red-500"
          : state === "success"
            ? "ring-green-500"
            : "focus-within:ring-gray-400 dark:focus-within:ring-gray-500 ring-gray-200 dark:ring-gray-700"
      }`}
      initial={{ opacity: 0, y: 10 }}
      animate={animationControls}
    >
      <input
        id={`input-${index}`}
        type="text"
        inputMode="numeric"
        maxLength={1}
        onInput={onInput}
        onKeyDown={onKeyDown}
        onPaste={onPaste}
        onFocus={onFocus}
        onBlur={onBlur}
        className="w-full h-full text-center text-3xl font-semibold outline-none caret-gray-900 dark:caret-gray-200 bg-sidebar-ring dark:bg-black dark:text-white"
        disabled={state === "success"}
      />
    </motion.div>
  )
}

// --- Main Verification Component ---

export function OTPVerification() {
  const [state, setState] = useState("idle")
  const [countdown, setCountdown] = useState(60)
  const [isResendDisabled, setIsResendDisabled] = useState(true)
  const animationControls = useAnimationControls()

  useEffect(() => {
    let timer
    if (isResendDisabled) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            clearInterval(timer)
            setIsResendDisabled(false)
            return 0
          }
          return prevCountdown - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isResendDisabled])

  const getCode = () => {
    let code = ""
    for (let i = 0; i < 4; i++) {
      const input = document.getElementById(`input-${i}`)
      if (input) code += input.value
    }
    return code
  }

  const verifyOTP = () => {
    const code = getCode()
    if (code.length < 4) {
      setState("idle")
      return null
    }

    console.log("Verifying code:", code)
    // This is where you would add your verification logic
    if (code === "1234") {
      // Mock success
      setState("success")
      return true
    } else {
      // Mock error
      errorAnimation()
      return false
    }
  }

  const errorAnimation = async () => {
    setState("error")
    await animationControls.start({
      x: [0, 5, -5, 5, -5, 0],
      transition: { duration: 0.3 },
    })
    // Reset state after animation to allow re-entry
    setTimeout(() => {
      if (getCode().length < 4) setState("idle")
    }, 500)
  }

  const handleResend = () => {
    console.log("Resending code...")
    setCountdown(60)
    setIsResendDisabled(true)
    // Add your actual resend logic here
  }

  return (
    <div
      className="rounded-3xl p-8 w-full max-w-sm shadow-lg dark:shadow-gray-900/50 relative overflow-hidden"
      style={{
        backgroundImage: "url(https://media.giphy.com/media/3owypkjxtrXUvhJiCY/giphy.gif)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-white/80 dark:bg-card/97 rounded-3xl"></div>

      <div className="relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-black dark:bg-white rounded-full flex items-center justify-center">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-center text-gray-900 dark:text-white mb-2">
          {state === "success" ? "Verification Successful!" : "Enter Verification Code"}
        </h1>

        <AnimatePresence mode="wait">
          {state === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              // This container will hold the success message and provide space.
              className="flex items-center justify-center"
              style={{ height: "232px" }} // Matches the approximate height of the form part
            >
              <OTPSuccess />
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Description */}
              <p className="text-center text-gray-600 dark:text-gray-300 mt-2 mb-8">
                We've sent a 4-digit code to
                <br /> <span className="font-medium text-gray-800 dark:text-gray-100">yourname@example.com</span>
              </p>

              {/* OTP Input Area */}
              <div className="flex flex-col items-center justify-center gap-2 mb-10 relative h-20">
                <motion.div animate={animationControls} className="flex items-center justify-center gap-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <OTPInputBox key={`input-${index}`} index={index} verifyOTP={verifyOTP} state={state} />
                  ))}
                </motion.div>
                <AnimatePresence>{state === "error" && <OTPError />}</AnimatePresence>
              </div>

              {/* Resend Link */}
              <div className="text-center">
                <span className="text-gray-600 dark:text-gray-300">Didn't get a code? </span>
                {isResendDisabled ? (
                  <span className="text-gray-500 dark:text-gray-400">Resend in {countdown}s</span>
                ) : (
                  <button
                    onClick={handleResend}
                    className="font-medium text-gray-900 dark:text-white hover:underline focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 rounded"
                  >
                    Click to resend
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}