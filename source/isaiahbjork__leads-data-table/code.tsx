"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";
import { ChevronDown, MoreHorizontal } from "lucide-react";

export interface Lead {
  id: string;
  name: string;
  email: string;
  source: string;
  sourceType: "organic" | "campaign";
  status: "pre-sale" | "closed" | "lost" | "closing" | "new";
  size: number;
  interest: number[];
  probability: "low" | "mid" | "high";
  lastAction: string;
}

interface LeadsTableProps {
  title?: string;
  leads?: Lead[];
  onLeadAction?: (leadId: string, action: string) => void;
  className?: string;
}

const defaultLeads: Lead[] = [
  {
    id: "1",
    name: "Andy Shepard",
    email: "a.shepard@gmail.com",
    source: "ORGANIC",
    sourceType: "organic",
    status: "pre-sale",
    size: 120000,
    interest: [45, 52, 48, 55, 58, 60, 57, 62, 65, 63],
    probability: "mid",
    lastAction: "Sep 12, 2024"
  },
  {
    id: "2", 
    name: "Emily Thompson",
    email: "a.shepard@gmail.com",
    source: "SB2024",
    sourceType: "campaign",
    status: "closed",
    size: 200000,
    interest: [30, 35, 42, 48, 55, 62, 68, 70, 75, 78],
    probability: "high",
    lastAction: "Sep 13, 2024"
  },
  {
    id: "3",
    name: "Michael Carter",
    email: "a.shepard@gmail.com", 
    source: "SUMMER2",
    sourceType: "campaign",
    status: "pre-sale",
    size: 45000,
    interest: [70, 68, 65, 60, 58, 55, 52, 48, 45, 42],
    probability: "low",
    lastAction: "Sep 12, 2024"
  },
  {
    id: "4",
    name: "David Anderson", 
    email: "a.shepard@gmail.com",
    source: "DTJ25",
    sourceType: "campaign",
    status: "pre-sale",
    size: 80000,
    interest: [25, 28, 32, 38, 45, 52, 58, 62, 68, 70],
    probability: "high",
    lastAction: "Sep 12, 2024"
  },
  {
    id: "5",
    name: "Lily Hernandez",
    email: "a.shepard@gmail.com",
    source: "ORGANIC", 
    sourceType: "organic",
    status: "lost",
    size: 110000,
    interest: [60, 58, 55, 50, 45, 42, 38, 35, 30, 28],
    probability: "low",
    lastAction: "Sep 12, 2024"
  },
  {
    id: "6",
    name: "Christopher Wilson",
    email: "a.shepard@gmail.com",
    source: "SB2024",
    sourceType: "campaign", 
    status: "closed",
    size: 2120000,
    interest: [40, 42, 45, 48, 50, 52, 55, 58, 60, 62],
    probability: "mid",
    lastAction: "Sep 12, 2024"
  },
  {
    id: "7",
    name: "Isabella Lopez",
    email: "a.shepard@gmail.com",
    source: "ORGANIC",
    sourceType: "organic",
    status: "closing", 
    size: 20000,
    interest: [35, 38, 42, 46, 50, 55, 60, 65, 68, 72],
    probability: "high",
    lastAction: "Sep 12, 2024"
  },
  {
    id: "8",
    name: "Sophia Morgan",
    email: "a.shepard@gmail.com",
    source: "AFF20",
    sourceType: "campaign",
    status: "new",
    size: 95000,
    interest: [55, 52, 48, 45, 40, 38, 35, 32, 30, 28],
    probability: "low",
    lastAction: "Sep 11, 2024"
  },
  {
    id: "9", 
    name: "John Davis",
    email: "a.shepard@gmail.com",
    source: "ORGANIC",
    sourceType: "organic",
    status: "pre-sale",
    size: 200000,
    interest: [30, 35, 40, 45, 50, 55, 60, 58, 62, 65],
    probability: "mid", 
    lastAction: "Sep 11, 2024"
  }
];

export function LeadsTable({
  title = "Leads",
  leads: initialLeads = defaultLeads,
  onLeadAction,
  className = ""
}: LeadsTableProps = {}) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const shouldReduceMotion = useReducedMotion();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handleLeadSelection = (leadId: string, selected: boolean) => {
    const newSelected = new Set(selectedLeads);
    if (selected) {
      newSelected.add(leadId);
    } else {
      newSelected.delete(leadId);
    }
    setSelectedLeads(newSelected);
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedLeads(new Set(leads.map(lead => lead.id)));
    } else {
      setSelectedLeads(new Set());
    }
  };

  const isSelected = (leadId: string) => selectedLeads.has(leadId);
  const isAllSelected = selectedLeads.size === leads.length && leads.length > 0;
  const isIndeterminate = selectedLeads.size > 0 && selectedLeads.size < leads.length;

  const handleLeadAction = (leadId: string, action: string) => {
    if (onLeadAction) {
      onLeadAction(leadId, action);
    }
  };

  const handleSort = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);
    
    const sortedLeads = [...leads].sort((a, b) => {
      const aDate = new Date(a.lastAction === "Engage" ? "2024-09-15" : a.lastAction);
      const bDate = new Date(b.lastAction === "Engage" ? "2024-09-15" : b.lastAction);
      return newOrder === "asc" ? aDate.getTime() - bDate.getTime() : bDate.getTime() - aDate.getTime();
    });
    
    setLeads(sortedLeads);
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const getSourcePill = (source: string, sourceType: "organic" | "campaign") => {
    const isOrganic = sourceType === "organic";
    
    return (
      <div className={`px-2 py-1 rounded-lg text-xs font-medium ${
        isOrganic 
          ? "bg-green-50 text-green-600 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30"
          : "bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30"
      }`}>
        {source}
        {!isOrganic && (
          <span className="ml-1 text-xs opacity-60">↗</span>
        )}
      </div>
    );
  };

  const getStatusPill = (status: Lead["status"]) => {
    const statusConfig = {
      "pre-sale": {
        bg: "bg-orange-50 dark:bg-orange-900/20",
        text: "text-orange-600 dark:text-orange-400", 
        border: "border-orange-200 dark:border-orange-800/30",
        label: "PRE-SALE"
      },
      "closed": {
        bg: "bg-green-50 dark:bg-green-900/20",
        text: "text-green-600 dark:text-green-400",
        border: "border-green-200 dark:border-green-800/30", 
        label: "CLOSED"
      },
      "lost": {
        bg: "bg-red-50 dark:bg-red-900/20",
        text: "text-red-600 dark:text-red-400",
        border: "border-red-200 dark:border-red-800/30",
        label: "LOST"
      },
      "closing": {
        bg: "bg-blue-50 dark:bg-blue-900/20", 
        text: "text-blue-600 dark:text-blue-400",
        border: "border-blue-200 dark:border-blue-800/30",
        label: "CLOSING"
      },
      "new": {
        bg: "bg-purple-50 dark:bg-purple-900/20",
        text: "text-purple-600 dark:text-purple-400",
        border: "border-purple-200 dark:border-purple-800/30",
        label: "NEW"
      }
    };

    const config = statusConfig[status];
    return (
      <div className={`px-2 py-1 rounded-lg text-xs font-medium ${config.bg} ${config.text} border ${config.border}`}>
        {config.label}
      </div>
    );
  };

  const renderSparkline = (data: number[]) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const isUpTrend = data[data.length - 1] > data[0];
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 60;
      const y = 20 - ((value - min) / range) * 15;
      return `${x},${y}`;
    }).join(' ');

    // Better colors for dark mode
    const upColor = isDark ? "#22c55e" : "#16a34a";   // Softer green for dark mode
    const downColor = isDark ? "#f87171" : "#dc2626"; // Softer red for dark mode

    return (
      <div className="w-16 h-6">
        <svg width="60" height="20" viewBox="0 0 60 20" className="overflow-visible">
          <polyline
            points={points}
            fill="none"
            stroke={isUpTrend ? upColor : downColor}
            strokeWidth="2"
            className="drop-shadow-sm"
          />
          <circle
            cx={data.length === 1 ? 30 : ((data.length - 1) / (data.length - 1)) * 60}
            cy={20 - ((data[data.length - 1] - min) / range) * 15}
            r="2"
            fill={isUpTrend ? upColor : downColor}
          />
        </svg>
      </div>
    );
  };

  const getProbabilityIcon = (probability: Lead["probability"]) => {
    const barCount = probability === "low" ? 1 : probability === "mid" ? 2 : 3;
    const probabilityColors = {
      low: "bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800/30",
      mid: "bg-yellow-50 text-yellow-600 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800/30",
      high: "bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30"
    };
    
    return (
      <div className={`px-2 py-1 rounded-lg text-xs font-medium border flex items-center gap-2 ${probabilityColors[probability]}`}>
        <div className="flex items-end gap-0.5">
          {[1, 2, 3].map((bar) => (
            <div
              key={bar}
              className={`w-1 rounded-full ${
                bar <= barCount 
                  ? "bg-current" 
                  : "bg-current/30"
              }`}
              style={{ 
                height: bar === 1 ? '4px' : bar === 2 ? '8px' : '12px' 
              }}
            />
          ))}
        </div>
        <span className="uppercase tracking-wide">
          {probability}
        </span>
      </div>
    );
  };

  const containerVariants = {
    visible: {
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.1,
      }
    }
  };

  const rowVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.98,
      filter: "blur(4px)" 
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        mass: 0.7,
      },
    },
  };

  return (
    <div className={`w-full max-w-7xl mx-auto ${className}`}>
      {/* Table Container */}
      <div className="bg-background border border-border/50 rounded-2xl overflow-hidden">
        {/* Table Headers */}
        <div className="grid grid-cols-7 gap-4 px-6 py-3 text-xs font-medium text-muted-foreground/70 uppercase tracking-wide bg-muted/15 border-b border-border/20">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isIndeterminate;
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 rounded border-muted-foreground/40 text-muted-foreground focus:ring-muted-foreground/20 focus:ring-2 accent-muted-foreground bg-background"
                  />
                </div>
                <span>Lead</span>
              </div>
              <div>Source</div>
              <div>Status</div>
              <div>Size</div>
              <div>Interest</div>
              <div>Probability</div>
              <div className="flex items-center gap-2 cursor-pointer" onClick={handleSort}>
                Last Action
                <ChevronDown className={`w-4 h-4 transition-transform ${sortOrder === "asc" ? "rotate-180" : ""}`} />
              </div>
            </div>

        {/* Table Rows */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {leads.map((lead, index) => (
            <motion.div key={lead.id} variants={rowVariants}>
              <div
                className={`grid grid-cols-7 gap-4 px-6 py-2 hover:bg-muted/30 transition-colors cursor-pointer group relative ${
                  isSelected(lead.id) ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
                } ${index < leads.length - 1 ? "border-b border-border/20" : ""}`}
                onMouseEnter={() => {
                  setHoveredRow(lead.id);
                  setHoveredAction(lead.id);
                }}
                onMouseLeave={() => {
                  setHoveredRow(null);
                  setHoveredAction(null);
                }}
              >
                  {/* Lead Info */}
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected(lead.id)}
                      onChange={(e) => handleLeadSelection(lead.id, e.target.checked)}
                      className="w-4 h-4 rounded border-muted-foreground/40 text-muted-foreground focus:ring-muted-foreground/20 focus:ring-2 accent-muted-foreground bg-background"
                    />
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 bg-muted/30 rounded-full flex items-center justify-center flex-shrink-0 border border-border/20">
                        <span className="text-sm font-medium text-muted-foreground/80">
                          {lead.name.charAt(0)}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-foreground/90 truncate">{lead.name}</div>
                        <div className="text-xs text-muted-foreground/70 truncate">{lead.email}</div>
                      </div>
                    </div>
                  </div>

                  {/* Source */}
                  <div className="flex items-center">
                    {getSourcePill(lead.source, lead.sourceType)}
                  </div>

                  {/* Status */}
                  <div className="flex items-center">
                    {getStatusPill(lead.status)}
                  </div>

                  {/* Size */}
                  <div className="flex items-center">
                    <span className="font-semibold text-foreground/90">
                      {formatCurrency(lead.size)}
                    </span>
                  </div>

                  {/* Interest */}
                  <div className="flex items-center">
                    {renderSparkline(lead.interest)}
                  </div>

                  {/* Probability */}
                  <div className="flex items-center">
                    {getProbabilityIcon(lead.probability)}
                  </div>

                  {/* Last Action */}
                  <div className="flex items-center">
                    <AnimatePresence mode="wait">
                      {hoveredAction === lead.id ? (
                        <motion.button
                          initial={{ opacity: 0, x: -10, filter: "blur(4px)" }}
                          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                          exit={{ opacity: 0, x: -10, filter: "blur(4px)" }}
                          transition={{ 
                            type: "spring", 
                            stiffness: 500, 
                            damping: 25,
                            duration: 0.1
                          }}
                          onClick={() => handleLeadAction(lead.id, "engage")}
                          className="flex items-center gap-2 px-2 py-1 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-lg text-xs font-medium shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                        >
                          Engage
                          <div className="w-px h-3 bg-primary/30 mx-1" />
                          <MoreHorizontal className="w-3 h-3" />
                        </motion.button>
                      ) : (
                        <motion.span
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{ duration: 0.05 }}
                          className="text-xs text-muted-foreground/70"
                        >
                          {lead.lastAction}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            ))}
        </motion.div>
      </div>

      {/* Bottom Action Bar */}
      <AnimatePresence>
        {selectedLeads.size > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0, filter: "blur(8px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ y: 100, opacity: 0, filter: "blur(8px)" }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 30,
              mass: 0.8 
            }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-background/95 backdrop-blur-lg border border-border/50 rounded-xl px-4 py-2 shadow-2xl">
              <div className="flex items-center gap-4">
                <span className="text-xs font-medium text-foreground/80">
                  {selectedLeads.size} selected leads
                </span>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => console.log("Engage leads")}
                    className="px-3 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-xs font-medium transition-colors"
                  >
                    Engage
                  </button>
                  
                  <button
                    onClick={() => console.log("Create group")}
                    className="px-3 py-1.5 bg-muted hover:bg-muted/80 text-foreground/80 rounded-lg text-xs font-medium transition-colors"
                  >
                    Create group
                  </button>
                  
                  <button
                    onClick={() => console.log("Download CSV")}
                    className="px-3 py-1.5 bg-muted hover:bg-muted/80 text-foreground/80 rounded-lg text-xs font-medium transition-colors"
                  >
                    Download as .CSV
                  </button>
                  
                  <button
                    onClick={() => console.log("Delete leads")}
                    className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400/80 border border-red-500/20 dark:border-red-400/30 rounded-lg text-xs font-medium transition-colors"
                  >
                    Delete leads
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
