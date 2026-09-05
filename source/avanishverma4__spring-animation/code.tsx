"use client"
import { useState } from "react"
import { Moon, Sun } from "lucide-react"

export default function CSSGeneration() {
    const [state, setState] = useState(false)
    const [darkMode, setDarkMode] = useState(false)
    
    return (
        <div className="example-container" data-theme={darkMode ? "dark" : "light"}>
            <button 
                className="theme-toggle"
                onClick={() => setDarkMode(!darkMode)}
                aria-label="Toggle theme"
            >
                {darkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
            
            <div className="box" data-state={state} />
            <button onClick={() => setState(!state)}>Toggle position</button>
            
            <style>
                {`
                    .example-container {
                        width: 100%;
                        min-height: 100vh;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        gap: 20px;
                        background-color: #ffffff;
                        background-image: 
                            linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
                        background-size: 30px 30px;
                        transition: background-color 0.3s ease;
                        position: relative;
                    }
                    
                    .example-container[data-theme="dark"] {
                        background-color: #0f1115;
                        background-image: 
                            linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
                        background-size: 30px 30px;
                    }
                    
                    .theme-toggle {
                        position: absolute;
                        top: 20px;
                        right: 20px;
                        background-color: #8df0cc;
                        color: #0f1115;
                        border: none;
                        border-radius: 50%;
                        width: 48px;
                        height: 48px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    }
                    
                    .theme-toggle:hover {
                        transform: scale(1.1);
                    }
                    
                    .example-container[data-theme="dark"] .theme-toggle {
                        background-color: #fbbf24;
                        color: #0f1115;
                    }
                    
                    .example-container .box {
                        width: 100px;
                        height: 100px;
                        background-color: #8df0cc;
                        border-radius: 10px;
                        transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
                        transform: translateX(-100%);
                    }
                    
                    .example-container[data-theme="dark"] .box {
                        background-color: #fbbf24;
                    }
                    
                    .example-container .box[data-state="true"] {
                        transform: translateX(100%) rotate(180deg);
                    }
                    
                    .example-container button {
                        background-color: #8df0cc;
                        color: #0f1115;
                        border: none;
                        border-radius: 5px;
                        padding: 10px 20px;
                        margin: 10px;
                        cursor: pointer;
                        font-weight: 500;
                        transition: all 0.2s ease;
                    }
                    
                    .example-container button:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 4px 12px rgba(141, 240, 204, 0.4);
                    }
                    
                    .example-container[data-theme="dark"] button {
                        background-color: #fbbf24;
                        color: #0f1115;
                    }
                    
                    .example-container[data-theme="dark"] button:hover {
                        box-shadow: 0 4px 12px rgba(251, 191, 36, 0.4);
                    }
                `}
            </style>
        </div>
    )
}