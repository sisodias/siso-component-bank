import React, { useState, useRef, useEffect } from "react";
import {
    Paperclip,
    Lightbulb,
    Mic,
    ChevronDown,
    ChevronUp,
    Search,
    Image as ImageIcon,
    UserCircle,
    Rocket,
    Zap,
    Moon,
    Users,
    CircleDot,
    Theater,
    Check,
    BookOpen,
    Briefcase,
    FileText,
    Apple,
    DollarSign,
    Plus,
    Folder
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface DropdownItemProps {
    icon: React.ReactNode;
    label: string;
    description?: string;
    selected?: boolean;
    disabled?: boolean;
    rightElement?: React.ReactNode;
    onClick?: () => void;
}

const DropdownItem = ({ icon, label, description, selected, disabled, rightElement, onClick }: DropdownItemProps) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={cn(
            "flex items-center w-full px-3 py-2 text-left rounded-lg transition-colors",
            disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-accent hover:text-accent-foreground",
            selected && "text-foreground font-medium"
        )}
    >
        <div className="flex-shrink-0 mr-3 text-muted-foreground">
            {icon}
        </div>
        <div className="flex-grow min-w-0">
            <div className="text-sm truncate">{label}</div>
            {description && (
                <div className="text-xs text-muted-foreground truncate">{description}</div>
            )}
        </div>
        {selected && (
            <div className="ml-2 flex-shrink-0 text-foreground">
                <Check className="h-4 w-4" />
            </div>
        )}
        {rightElement && (
            <div className="ml-2 flex-shrink-0">
                {rightElement}
            </div>
        )}
    </button>
);

export const Component = () => {
    const [isExpertOpen, setIsExpertOpen] = useState(false);
    const [isPersonasOpen, setIsPersonasOpen] = useState(false);
    const [selectedExpert, setSelectedExpert] = useState("Expert");

    const expertRef = useRef<HTMLDivElement>(null);
    const personasRef = useRef<HTMLDivElement>(null);

    // Close dropdowns on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (expertRef.current && !expertRef.current.contains(event.target as Node)) {
                setIsExpertOpen(false);
            }
            if (personasRef.current && !personasRef.current.contains(event.target as Node)) {
                setIsPersonasOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const expertOptions = [
        { id: "auto", label: "Auto", description: "Chooses Fast or Expert", icon: <Rocket className="h-4 w-4" /> },
        { id: "fast", label: "Fast", description: "Quick responses", icon: <Zap className="h-4 w-4" /> },
        { id: "expert", label: "Expert", description: "Thinks hard", icon: <Lightbulb className="h-4 w-4" />, selected: true },
        { id: "grok", label: "Grok 4.1", description: "Beta", icon: <Moon className="h-4 w-4" /> },
        { id: "heavy", label: "Heavy", description: "Team of experts", icon: <Users className="h-4 w-4" />, disabled: true },
    ];

    const personas = [
        { label: "Legal Document Reviewer", icon: <BookOpen className="h-4 w-4 text-muted-foreground" /> },
        { label: "Cover Letter Writer", icon: <Briefcase className="h-4 w-4 text-amber-700" /> },
        { label: "Writing Assistant", icon: <FileText className="h-4 w-4 text-blue-500" /> },
        { label: "Fitness Advice", icon: <Apple className="h-4 w-4 text-red-500" /> },
        { label: "Personal Finance Assistant", icon: <DollarSign className="h-4 w-4 text-green-600" /> },
    ];

    return (
        <div className="flex flex-col items-center w-full max-w-4xl gap-6 px-4">
            {/* Main Search Bar */}
            <div className="relative w-full">
                <div className="flex items-center w-full px-4 py-3 bg-card border border-border rounded-full shadow-sm hover:border-border/80 transition-all focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                    <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors">
                        <Paperclip className="h-5 w-5" />
                    </button>

                    <input
                        type="text"
                        placeholder="What do you want to know?"
                        className="flex-grow px-3 bg-transparent border-none focus:outline-none text-foreground placeholder:text-muted-foreground text-lg"
                    />

                    <div className="flex items-center gap-1">
                        {/* Expert Dropdown Trigger */}
                        <div className="relative" ref={expertRef}>
                            <button
                                onClick={() => setIsExpertOpen(!isExpertOpen)}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                                    isExpertOpen ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                )}
                            >
                                <Lightbulb className="h-4 w-4" />
                                <span>Expert</span>
                                {isExpertOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                            </button>

                            <AnimatePresence>
                                {isExpertOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.15, ease: "easeOut" }}
                                        className="absolute right-0 mt-2 w-72 bg-popover text-popover-foreground border border-border rounded-xl shadow-xl z-50 overflow-hidden"
                                    >
                                        <div className="p-1.5 space-y-0.5">
                                            {expertOptions.map((opt) => (
                                                <DropdownItem
                                                    key={opt.id}
                                                    icon={opt.icon}
                                                    label={opt.label}
                                                    description={opt.description}
                                                    selected={opt.id === "expert"}
                                                    disabled={opt.disabled}
                                                    onClick={() => {
                                                        if (!opt.disabled) {
                                                            setSelectedExpert(opt.label);
                                                            setIsExpertOpen(false);
                                                        }
                                                    }}
                                                />
                                            ))}

                                            <div className="h-px bg-border my-1" />

                                            <DropdownItem
                                                icon={<CircleDot className="h-4 w-4" />}
                                                label="SuperGrok"
                                                description="Unlock extended capabilities"
                                                rightElement={
                                                    <button className="px-3 py-1 bg-foreground text-background text-xs font-bold rounded-full hover:opacity-90">
                                                        Upgrade
                                                    </button>
                                                }
                                            />

                                            <DropdownItem
                                                icon={<Theater className="h-4 w-4" />}
                                                label="Custom Instructions"
                                                description="Not set"
                                                rightElement={
                                                    <button className="px-3 py-1 border border-border text-xs rounded-full hover:bg-muted">
                                                        Customize
                                                    </button>
                                                }
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors bg-foreground text-background">
                            <Mic className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Action Chips */}
            <div className="flex flex-wrap justify-center items-center gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full text-sm font-medium hover:bg-muted transition-colors">
                    <Search className="h-4 w-4" />
                    <span>DeepSearch</span>
                </button>

                <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full text-sm font-medium hover:bg-muted transition-colors">
                    <ImageIcon className="h-4 w-4" />
                    <span>Create Image</span>
                </button>

                {/* Personas Dropdown Trigger */}
                <div className="relative" ref={personasRef}>
                    <button
                        onClick={() => setIsPersonasOpen(!isPersonasOpen)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full text-sm font-medium transition-colors",
                            isPersonasOpen ? "bg-muted shadow-inner" : "hover:bg-muted"
                        )}
                    >
                        <UserCircle className="h-4 w-4" />
                        <span>Pick Personas</span>
                        {isPersonasOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </button>

                    <AnimatePresence>
                        {isPersonasOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.15, ease: "easeOut" }}
                                className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-72 bg-popover text-popover-foreground border border-border rounded-xl shadow-xl z-50 overflow-hidden"
                            >
                                <div className="p-1.5 space-y-0.5">
                                    {personas.map((persona, i) => (
                                        <DropdownItem
                                            key={i}
                                            icon={persona.icon}
                                            label={persona.label}
                                            onClick={() => setIsPersonasOpen(false)}
                                        />
                                    ))}

                                    <div className="h-px bg-border my-1" />

                                    <DropdownItem
                                        icon={<Plus className="h-4 w-4 text-muted-foreground" />}
                                        label="Create Project"
                                        onClick={() => setIsPersonasOpen(false)}
                                    />

                                    <DropdownItem
                                        icon={<Folder className="h-4 w-4 text-muted-foreground" />}
                                        label="View All Projects"
                                        onClick={() => setIsPersonasOpen(false)}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full text-sm font-medium hover:bg-muted transition-colors">
                    <Mic className="h-4 w-4" />
                    <span>Voice</span>
                </button>
            </div>
        </div>
    );
};
