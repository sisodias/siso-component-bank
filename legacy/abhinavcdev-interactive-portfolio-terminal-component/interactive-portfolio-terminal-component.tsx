'use client'

import { useState, useRef, useEffect } from 'react'

export default function PortfolioTerminal() {
  const [history, setHistory] = useState<Array<{ command: string; output: string }>>([
    { command: '/welcome', output: `
████████╗███████╗██████╗ ███╗   ███╗██╗███╗   ██╗ █████╗ ██╗     ██╗  ██╗   ██╗
╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██║████╗  ██║██╔══██╗██║     ██║  ╚██╗ ██╔╝
   ██║   █████╗  ██████╔╝██╔████╔██║██║██╔██╗ ██║███████║██║     ██║   ╚████╔╝ 
   ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║██║██║╚██╗██║██╔══██║██║     ██║    ╚██╔╝  
   ██║   ███████╗██║  ██║██║ ╚═╝ ██║██║██║ ╚████║██║  ██║███████╗███████╗██║   
   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝╚══════╝╚═╝   

[SYSTEM INITIALIZED] - Terminal Portfolio v1.0

Welcome to Terminally! Type help to see available commands.` },
  ])
  const [currentCommand, setCurrentCommand] = useState('')
  const [historyIndex, setHistoryIndex] = useState(-1)
  const bottomRef = useRef<HTMLDivElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const commands = {
    'help': () => `
[AVAILABLE_COMMANDS]

about       Display personal information
projects    View project portfolio
skills      Show technical skills
experience  Display work history
education   View educational background
contact     Show contact information
clear       Clear terminal screen
help        Display this help message
    `,
    'about': () => `
Name: John Developer
Role: Full Stack Software Engineer
Location: San Francisco, CA
Status: Open to new opportunities

Bio: Passionate software engineer with 5+ years of experience building 
scalable web applications and modern user interfaces. I love solving 
complex problems and creating elegant solutions.
    `,
    'projects': () => `
[PROJECT PORTFOLIO]

1. E-Commerce Platform
   • Tech Stack: React, Node.js, MongoDB, Stripe API
   • Features: Real-time inventory, payment processing, admin dashboard
   • Impact: Increased client sales by 150%
   • GitHub: https://github.com/johndoe/ecommerce-platform

2. Task Management SaaS
   • Tech Stack: Next.js, PostgreSQL, Prisma, Tailwind CSS
   • Features: Team collaboration, real-time updates, analytics
   • Users: 1,000+ active users
   • Live Demo: https://taskmanager-demo.com

3. AI-Powered Chat Application
   • Tech Stack: Python, FastAPI, React, OpenAI API
   • Features: Natural language processing, context awareness
   • Performance: 98% accuracy in intent recognition
   • GitHub: https://github.com/johndoe/ai-chat

4. Mobile Weather App
   • Tech Stack: React Native, TypeScript, Redux
   • Features: Location-based forecasts, offline mode
   • Downloads: 10,000+ on app stores
    `,
    'skills': () => `
[TECHNICAL SKILLS MATRIX]

Languages:
  JavaScript/TypeScript  ████████████████████ 100%
  Python                ██████████████████   90%
  Java                  ████████████         60%
  Go                    ██████████           50%

Frontend:
  React/Next.js         ████████████████████ 100%
  Vue.js                ██████████████       70%
  HTML/CSS/SASS         ████████████████████ 100%
  Tailwind CSS          ████████████████████ 100%

Backend:
  Node.js/Express       ████████████████████ 100%
  Python/FastAPI        ██████████████████   90%
  PostgreSQL/MongoDB    ██████████████████   90%
  GraphQL/REST APIs     ████████████████████ 100%

DevOps & Tools:
  Docker/Kubernetes     ████████████████     80%
  AWS/GCP               ██████████████       70%
  Git/GitHub            ████████████████████ 100%
  CI/CD Pipelines       ██████████████       70%
    `,
    'experience': () => `
[WORK EXPERIENCE]

2022 - Present | Senior Full Stack Developer
TechCorp Solutions, San Francisco, CA
• Lead development of microservices architecture serving 100k+ users
• Mentored junior developers and conducted code reviews
• Reduced application load time by 40% through optimization
• Technologies: React, Node.js, AWS, Docker

2020 - 2022 | Full Stack Developer  
StartupXYZ, Remote
• Built MVP from scratch using React and Node.js
• Implemented real-time features using WebSockets
• Collaborated with design team to create responsive UIs
• Achieved 99.9% uptime through monitoring and optimization

2018 - 2020 | Frontend Developer
WebAgency Inc, Los Angeles, CA
• Developed responsive websites for 20+ clients
• Integrated third-party APIs and payment systems
• Improved website performance and SEO rankings
• Technologies: Vue.js, PHP, MySQL
    `,
    'education': () => `
[EDUCATION & CERTIFICATIONS]

Bachelor of Science in Computer Science
University of California, Berkeley (2014-2018)
• Graduated Magna Cum Laude (GPA: 3.8/4.0)
• Relevant Coursework: Data Structures, Algorithms, Database Systems

Certifications:
• AWS Certified Solutions Architect (2023)
• Google Cloud Professional Developer (2022)
• MongoDB Certified Developer (2021)

Continuous Learning:
• Currently studying Machine Learning and AI
• Regular contributor to open-source projects
• Active participant in tech meetups and conferences
    `,
    'contact': () => `
[CONTACT INFORMATION]

📧 Email: john.developer@email.com
🐙 GitHub: https://github.com/johndeveloper
💼 LinkedIn: https://linkedin.com/in/johndeveloper
🌐 Portfolio: https://johndeveloper.dev
📱 Phone: +1 (555) 123-4567
📍 Location: San Francisco, CA

Feel free to reach out for opportunities, collaborations, or just to chat about tech!

Response Time: Usually within 24 hours
Best Contact Method: Email or LinkedIn
    `,
    'clear': () => {
      setHistory([])
      return ''
    },
  }

  const handleCommand = () => {
    const cmd = currentCommand.trim().toLowerCase()
    const commandFn = commands[cmd as keyof typeof commands]
    const output = commandFn ? commandFn() : `Command not found: ${cmd}\nType help to see available commands.`

    if (cmd !== 'clear') {
      setHistory(prev => [...prev, { command: currentCommand, output }])
    }
    
    setCurrentCommand('')
    setHistoryIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHistoryIndex(prev => {
        const newIndex = Math.min(prev + 1, history.length - 1)
        if (history.length > 0) {
          setCurrentCommand(history[history.length - 1 - newIndex]?.command || '')
        }
        return newIndex
      })
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHistoryIndex(prev => {
        const newIndex = Math.max(prev - 1, -1)
        setCurrentCommand(newIndex === -1 ? '' : history[history.length - 1 - newIndex]?.command || '')
        return newIndex
      })
    }
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  useEffect(() => {
    // Focus input when component mounts or when terminal is clicked
    const handleClick = () => {
      inputRef.current?.focus()
    }
    
    if (terminalRef.current) {
      terminalRef.current.addEventListener('click', handleClick)
    }
    
    return () => {
      if (terminalRef.current) {
        terminalRef.current.removeEventListener('click', handleClick)
      }
    }
  }, [])

  const renderOutput = (output: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g
    const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g
    
    let parts = output.split(urlRegex)
    parts = parts.flatMap(part => 
      urlRegex.test(part) ? [part] : part.split(emailRegex)
    )
    
    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline hover:text-cyan-300 transition-colors">
            {part}
          </a>
        )
      } else if (emailRegex.test(part)) {
        return (
          <a key={index} href={`mailto:${part}`} className="text-cyan-400 hover:underline hover:text-cyan-300 transition-colors">
            {part}
          </a>
        )
      }
      return <span key={index}>{part}</span>
    })
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-green-400 p-4 font-mono">
      <div className="w-full max-w-5xl bg-black rounded-lg overflow-hidden shadow-2xl border border-green-400">
        {/* Terminal Header */}
        <div className="flex items-center gap-2 p-3 bg-gray-800 text-xs text-gray-400">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors cursor-pointer" />
          </div>
          <div className="flex-1 text-center font-semibold">john@portfolio-terminal:~$ | Interactive Portfolio v1.0</div>
          <div className="text-xs">
            <span className="text-green-400">●</span> ONLINE
          </div>
        </div>

        {/* Terminal Output */}
        <div 
          ref={terminalRef} 
          className="h-[75vh] overflow-y-auto p-4 space-y-3 bg-black cursor-text"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#10b981 #1f2937'
          }}
        >
          {history.map((entry, i) => (
            <div key={i} className="space-y-2">
              <div className="flex gap-2">
                <span className="text-cyan-400 font-semibold">john@portfolio:~$</span>
                <span className="text-white">{entry.command}</span>
              </div>
              <div className="whitespace-pre-wrap text-gray-300 pl-6 leading-relaxed">
                {renderOutput(entry.output)}
              </div>
            </div>
          ))}

          {/* Current Command Input */}
          <div className="flex gap-2 items-center">
            <span className="text-cyan-400 font-semibold">john@portfolio:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={currentCommand}
              onChange={e => setCurrentCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none text-white caret-green-400"
              autoFocus
              spellCheck="false"
            />
            <span className="text-green-400 animate-pulse">█</span>
          </div>

          {/* Auto-scroll anchor */}
          <div ref={bottomRef} />
        </div>
        
        {/* Terminal Footer */}
        <div className="bg-gray-800 px-4 py-2 text-xs text-gray-500 border-t border-gray-700">
          <div className="flex justify-between items-center">
            <span>Type help for available commands • Use ↑/↓ arrows for command history</span>
            <span>Press Ctrl+C to interrupt • clear to reset terminal</span>
          </div>
        </div>
      </div>
    </div>
  )
}