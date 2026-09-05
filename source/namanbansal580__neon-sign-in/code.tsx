"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { FaGoogle, FaTwitter } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"

export default function NeonSignIn() {
  const [isLogin, setIsLogin] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // Particle background effect
  useEffect(() => {
    // const canvas = canvasRef.current
    const canvas = canvasRef.current as HTMLCanvasElement
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Particle[] = []
    const particleCount = 100

    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 3 + 1
        this.speedX = Math.random() * 2 - 1
        this.speedY = Math.random() * 2 - 1
        this.color = `hsl(${Math.random() * 60 + 180}, 100%, 50%)`
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x > canvas.width) this.x = 0
        else if (this.x < 0) this.x = canvas.width
        if (this.y > canvas.height) this.y = 0
        else if (this.y < 0) this.y = canvas.height
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const init = () => {
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle())
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < particles.length; i++) {
        particles[i].update()
        particles[i].draw()
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.beginPath()
            ctx.strokeStyle = particles[i].color
            ctx.lineWidth = 0.2
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      requestAnimationFrame(animate)
    }

    init()
    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted")
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
      {/* Particles background */}
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />

      {/* Main container */}
      <div className="relative z-10 w-full max-w-md">
        <div
          className="relative bg-black/40 backdrop-blur-sm p-8 rounded-lg overflow-hidden"
          style={{
            boxShadow: `0 0 10px #0ff, 0 0 20px #0ff, 0 0 30px #0ff`,
          }}
        >
          {/* Animated border */}
          <div className="neon-border"></div>

          {/* Neon headline */}
          <h1
            className="text-center text-2xl font-bold uppercase tracking-wider mb-6 text-white relative"
            style={{
              textShadow: `0 0 5px #0ff, 0 0 10px #0ff, 0 0 15px #0ff`,
              letterSpacing: "0.15em",
            }}
          >
            SIGN IN
          </h1>

          {/* Form header */}
          <div className="text-center mb-8 relative">
            <h1
              className="text-4xl font-bold text-white mb-2"
              style={{
                textShadow: `0 0 5px #0ff, 0 0 10px #0ff, 0 0 15px #0ff`,
              }}
            >
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <div
              className="h-1 w-24 mx-auto mb-4 rounded-full"
              style={{
                background: "linear-gradient(90deg, #0ff, #06f)",
                boxShadow: "0 0 10px #0ff, 0 0 20px #0ff",
              }}
            ></div>
            <p className="text-cyan-300 relative">
              {isLogin ? "Sign in to continue your journey" : "Sign up to start your journey"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name (Sign Up only) */}
            {!isLogin && (
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-cyan-300">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-cyan-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </span>
                  <input
                    type="text"
                    id="name"
                    className="neon-input w-full pl-10 pr-4 py-2 bg-black/60 border border-cyan-500 rounded-md text-white focus:outline-none"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-cyan-300">
                Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-cyan-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </span>
                <input
                  type="email"
                  id="email"
                  className="neon-input w-full pl-10 pr-4 py-2 bg-black/60 border border-cyan-500 rounded-md text-white focus:outline-none"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-cyan-300">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-cyan-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </span>
                <input
                  type="password"
                  id="password"
                  className="neon-input w-full pl-10 pr-4 py-2 bg-black/60 border border-cyan-500 rounded-md text-white focus:outline-none"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {/* Confirm Password (Sign Up only) */}
            {!isLogin && (
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-cyan-300">
                  Confirm Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-cyan-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </span>
                  <input
                    type="password"
                    id="confirmPassword"
                    className="neon-input w-full pl-10 pr-4 py-2 bg-black/60 border border-cyan-500 rounded-md text-white focus:outline-none"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </div>
            )}

            {/* Remember me / Forgot password */}
            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 bg-black border-cyan-500 rounded focus:ring-cyan-500"
                  />
                  <label htmlFor="remember" className="ml-2 block text-sm text-cyan-300">
                    Remember me
                  </label>
                </div>
                <a
                  href="#"
                  className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                  style={{ textShadow: "0 0 5px #0ff" }}
                >
                  Forgot password?
                </a>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              className="neon-button w-full py-2 px-4 bg-transparent border border-cyan-500 rounded-md text-white font-medium transition-all duration-300"
            >
              {isLogin ? "Sign In" : "Sign Up"}
            </button>

            {/* Social login */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-cyan-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-black text-cyan-300">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <button
                  type="button"
                  className="social-button flex justify-center items-center py-2 px-4 bg-transparent border border-cyan-700 rounded-md hover:border-cyan-500 transition-all duration-300"
                >
                  <FaGoogle className="text-white text-xl" />
                </button>
                <button
                  type="button"
                  className="social-button flex justify-center items-center py-2 px-4 bg-transparent border border-cyan-700 rounded-md hover:border-cyan-500 transition-all duration-300"
                >
                  <FaTwitter className="text-white text-xl" />
                </button>
                <button
                  type="button"
                  className="social-button flex justify-center items-center py-2 px-4 bg-transparent border border-cyan-700 rounded-md hover:border-cyan-500 transition-all duration-300"
                >
                  <FaXTwitter className="text-white text-xl" />
                </button>
              </div>
            </div>
          </form>

          {/* Toggle between login and signup */}
          <div className="mt-8 text-center relative">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-cyan-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-black text-cyan-300">{isLogin ? "New here?" : "Already registered?"}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="mt-4 inline-flex items-center justify-center px-6 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-black bg-cyan-400 hover:bg-cyan-300 transition-all duration-300"
              style={{
                boxShadow: "0 0 10px rgba(0, 255, 255, 0.5)",
              }}
            >
              {isLogin ? "Create an Account" : "Sign In Instead"}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="ml-2 h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        .neon-border {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .neon-border::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: conic-gradient(
            transparent, 
            rgba(0, 255, 255, 0.8), 
            transparent 30%
          );
          animation: rotate 4s linear infinite;
        }
        
        .neon-border::after {
          content: '';
          position: absolute;
          inset: 3px;
          background: black;
          border-radius: 5px;
        }
        
        @keyframes rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        
        .neon-input {
          transition: all 0.3s ease;
        }
        
        .neon-input:focus {
          box-shadow: 0 0 5px #0ff, 0 0 10px #0ff;
          border-color: #0ff;
        }
        
        .neon-button {
          position: relative;
          overflow: hidden;
          z-index: 1;
        }
        
        .neon-button:hover {
          box-shadow: 0 0 5px #0ff, 0 0 10px #0ff;
          border-color: #0ff;
          text-shadow: 0 0 5px #0ff;
        }
        
        .neon-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg, 
            transparent, 
            rgba(0, 255, 255, 0.2), 
            transparent
          );
          transition: 0.5s;
          z-index: -1;
        }
        
        .neon-button:hover::before {
          left: 100%;
        }
        
        .social-button {
          position: relative;
          overflow: hidden;
        }
        
        .social-button:hover {
          box-shadow: 0 0 5px #0ff, 0 0 10px #0ff;
        }
        
        .social-button svg {
          transition: all 0.3s ease;
        }
        
        .social-button:hover svg {
          transform: scale(1.2);
          filter: drop-shadow(0 0 3px #0ff);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        form > div {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
