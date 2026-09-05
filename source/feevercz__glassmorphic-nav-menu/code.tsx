import { useState, useRef, useEffect, ComponentProps } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { LucideIcon, Home, User, Mail, Menu, X, GripVertical } from "lucide-react"
// --- Types ---
interface NavItem {
    label: string
    href: string
    icon?: LucideIcon
}
interface ReactiveDockProps extends ComponentProps<"div"> {
    items?: NavItem[]
}
// --- Component ---
export const Component = ({
    items = [
        { label: "Home", href: "#", icon: Home },
        { label: "About", href: "#", icon: User },
        { label: "Contact", href: "#", icon: Mail },
    ],
    className,
    ...props
}: ReactiveDockProps) => {
    // State
    const [isCollapsed, setIsCollapsed] = useState(false)
    // Toggle Collapse
    const toggleCollapse = () => setIsCollapsed(!isCollapsed)
    return (
        <div className={cn("fixed top-6 left-1/2 z-50 -translate-x-1/2", className)}>
            <motion.div
                className={cn(
                    "flex items-center p-1.5 gap-2",
                    "bg-white/30 backdrop-blur-md",
                    "border-4 border-black rounded-full",
                    "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
                    "overflow-hidden"
                )}
                {...props}
            >
                {/* Handle / Collapse Toggle */}
                <motion.button
                    layout
                    onClick={toggleCollapse}
                    className={cn(
                        "relative flex items-center justify-center size-10 rounded-full",
                        "bg-black text-white shrink-0",
                        "hover:scale-105 transition-transform active:scale-95"
                    )}
                    aria-label={isCollapsed ? "Expand Menu" : "Collapse Menu"}
                >
                    <AnimatePresence mode="wait" initial={false}>
                        {isCollapsed ? (
                            <motion.span
                                key="collapsed-icon"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                className="font-black text-lg font-mono leading-none"
                            >
                                M
                            </motion.span>
                        ) : (
                            <motion.div
                                key="open-icon"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                className="size-3 bg-white rounded-full"
                            />
                        )}
                    </AnimatePresence>
                </motion.button>
                {/* Navigation Items Container */}
                <AnimatePresence>
                    {!isCollapsed && (
                        <motion.nav
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="flex items-center gap-2 pr-2 overflow-hidden whitespace-nowrap"
                        >
                            {items.map((item, index) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    className={cn(
                                        "px-4 py-2 rounded-lg font-bold text-sm tracking-tight transition-all duration-200",
                                        "text-black hover:text-white",
                                        index % 2 === 0
                                            ? "hover:bg-[#FF0080]" // Hot Pink
                                            : "hover:bg-[#0070F3]" // Bright Blue
                                    )}
                                >
                                    {item.label}
                                </a>
                            ))}
                            {/* Divider */}
                            <div className="w-[2px] h-6 bg-black mx-1 opacity-20" />
                            {/* Action Button */}
                            <button className={cn(
                                "ml-1 mr-1 px-4 py-2 font-bold text-sm bg-black text-white rounded-lg",
                                "border-2 border-transparent hover:bg-white hover:text-black hover:border-black",
                                "transition-all active:translate-y-[1px]"
                            )}>
                                Contact
                            </button>
                        </motion.nav>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    )
}
