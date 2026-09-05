"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { Download, ChevronDown, X, Mail, Twitter, User } from "lucide-react";

export interface Contact {
  id: string;
  name: string;
  email: string;
  connectionStrength: "Very weak" | "Weak" | "Good" | "Very strong";
  twitterFollowers: number;
  description?: string;
}

interface ContactsTableProps {
  title?: string;
  contacts?: Contact[];
  onContactSelect?: (contactId: string) => void;
  className?: string;
  enableAnimations?: boolean;
}

const defaultContacts: Contact[] = [
  {
    id: "1",
    name: "Pierre from Claap",
    email: "pierre@claap.io",
    connectionStrength: "Weak",
    twitterFollowers: 2400,
    description: "Tech entrepreneur and investor"
  },
  {
    id: "2",
    name: "HardwareSavvy",
    email: "hardwaresavvy+andr...",
    connectionStrength: "Very strong",
    twitterFollowers: 8900,
    description: "Hardware specialist"
  },
  {
    id: "3",
    name: "Voiceform",
    email: "harrison@voiceform.c...",
    connectionStrength: "Good",
    twitterFollowers: 5200,
    description: "Voice technology expert"
  },
  {
    id: "4",
    name: "Marketer Milk",
    email: "hi@marketmilk.com",
    connectionStrength: "Good",
    twitterFollowers: 6100,
    description: "Marketing strategist"
  },
  {
    id: "5",
    name: "Allen from CAST AI",
    email: "allen@mail.cast.ai",
    connectionStrength: "Weak",
    twitterFollowers: 3300,
    description: "AI infrastructure lead"
  },
  {
    id: "6",
    name: "Marija Krasnovskytė",
    email: "marija@cast.ai",
    connectionStrength: "Very weak",
    twitterFollowers: 1800,
    description: "Technical advisor"
  },
  {
    id: "7",
    name: "eryn@basistheory.com",
    email: "eryn@basistheory.com",
    connectionStrength: "Very weak",
    twitterFollowers: 2100,
    description: "Security specialist"
  },
  {
    id: "8",
    name: "Brad Patterson",
    email: "brad@basistheory.com",
    connectionStrength: "Good",
    twitterFollowers: 4500,
    description: "Product manager"
  },
  {
    id: "9",
    name: "Sarah Chen",
    email: "sarah.chen@techvault.com",
    connectionStrength: "Very strong",
    twitterFollowers: 12400,
    description: "CEO and founder"
  },
  {
    id: "10",
    name: "David Rodriguez",
    email: "david.rodriguez@innovate.io",
    connectionStrength: "Good",
    twitterFollowers: 7800,
    description: "Lead developer"
  },
  {
    id: "11",
    name: "Emily Watson",
    email: "emily.watson@future.co",
    connectionStrength: "Weak",
    twitterFollowers: 3900,
    description: "Marketing director"
  },
  {
    id: "12",
    name: "James Mitchell",
    email: "james@buildit.dev",
    connectionStrength: "Very strong",
    twitterFollowers: 9200,
    description: "Architect and advisor"
  },
  {
    id: "13",
    name: "Lisa Anderson",
    email: "lisa.anderson@ventures.com",
    connectionStrength: "Good",
    twitterFollowers: 5600,
    description: "Venture investor"
  },
  {
    id: "14",
    name: "Michael Zhang",
    email: "michael@cloudtech.ai",
    connectionStrength: "Weak",
    twitterFollowers: 4100,
    description: "Infrastructure engineer"
  },
  {
    id: "15",
    name: "Jennifer Lee",
    email: "jen@designsystem.io",
    connectionStrength: "Very strong",
    twitterFollowers: 11200,
    description: "Design system lead"
  },
  {
    id: "16",
    name: "Robert Chang",
    email: "robert.chang@quantify.co",
    connectionStrength: "Good",
    twitterFollowers: 6800,
    description: "Analytics expert"
  },
  {
    id: "17",
    name: "Amanda Pierce",
    email: "amanda@growthlab.com",
    connectionStrength: "Weak",
    twitterFollowers: 2900,
    description: "Growth consultant"
  },
  {
    id: "18",
    name: "Christopher Hayes",
    email: "chris.hayes@webscale.io",
    connectionStrength: "Very strong",
    twitterFollowers: 13500,
    description: "Platform engineer"
  },
  {
    id: "19",
    name: "Victoria Moore",
    email: "victoria@datasync.com",
    connectionStrength: "Good",
    twitterFollowers: 7100,
    description: "Data scientist"
  },
  {
    id: "20",
    name: "Nicholas Brown",
    email: "nick@apibase.dev",
    connectionStrength: "Very weak",
    twitterFollowers: 1500,
    description: "API developer"
  },
  {
    id: "21",
    name: "Rebecca Sullivan",
    email: "rebecca.s@innovationlab.io",
    connectionStrength: "Good",
    twitterFollowers: 8300,
    description: "Innovation strategist"
  },
  {
    id: "22",
    name: "Thomas Wright",
    email: "thomas@blockchain.tech",
    connectionStrength: "Weak",
    twitterFollowers: 3700,
    description: "Blockchain developer"
  },
  {
    id: "23",
    name: "Maria Garcia",
    email: "maria.garcia@futuretech.com",
    connectionStrength: "Very strong",
    twitterFollowers: 10800,
    description: "Tech evangelist"
  },
  {
    id: "24",
    name: "Daniel Park",
    email: "daniel@smartsolutions.ai",
    connectionStrength: "Good",
    twitterFollowers: 6400,
    description: "Solutions architect"
  },
  {
    id: "25",
    name: "Sophie Laurent",
    email: "sophie.laurent@design.co",
    connectionStrength: "Weak",
    twitterFollowers: 4200,
    description: "UX lead"
  }
];

type SortField = "name" | "connectionStrength" | "twitterFollowers";
type SortOrder = "asc" | "desc";

export function ContactsTable({
  title = "Person",
  contacts: initialContacts = defaultContacts,
  onContactSelect,
  className = "",
  enableAnimations = true
}: ContactsTableProps = {}) {
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [filterStrength, setFilterStrength] = useState<string | null>(null);
  const [selectedContactDetail, setSelectedContactDetail] = useState<Contact | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleContactSelect = (contactId: string) => {
    setSelectedContacts(prev => {
      if (prev.includes(contactId)) {
        return prev.filter(id => id !== contactId);
      } else {
        return [...prev, contactId];
      }
    });
    if (onContactSelect) {
      onContactSelect(contactId);
    }
  };

  const handleSelectAll = () => {
    if (selectedContacts.length === paginatedContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(paginatedContacts.map(c => c.id));
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setShowSortMenu(false);
    setCurrentPage(1);
  };

  const handleFilter = (strength: string | null) => {
    setFilterStrength(strength);
    setShowFilterMenu(false);
    setCurrentPage(1);
  };

  const sortedAndFilteredContacts = useMemo(() => {
    let filtered = [...initialContacts];

    if (filterStrength) {
      filtered = filtered.filter(c => c.connectionStrength === filterStrength);
    }

    if (!sortField) {
      return filtered;
    }

    const sorted = filtered.sort((a, b) => {
      let aVal: string | number = a[sortField];
      let bVal: string | number = b[sortField];

      if (sortField === "connectionStrength") {
        const strengthMap = {
          "Very weak": 0,
          "Weak": 1,
          "Good": 2,
          "Very strong": 3
        };
        aVal = strengthMap[aVal as keyof typeof strengthMap];
        bVal = strengthMap[bVal as keyof typeof strengthMap];
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [initialContacts, sortField, sortOrder, filterStrength]);

  const paginatedContacts = useMemo(() => {
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedAndFilteredContacts.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  }, [sortedAndFilteredContacts, currentPage]);

  const totalPages = Math.ceil(sortedAndFilteredContacts.length / ITEMS_PER_PAGE);

  const getStrengthColor = (strength: string) => {
    if (!mounted) {
      const strengthMap: Record<string, { bgColor: string; borderColor: string; textColor: string; dotColor: string }> = {
        "Very weak": {
          bgColor: "bg-red-500/10",
          borderColor: "border-red-500/30",
          textColor: "text-red-400",
          dotColor: "bg-red-400"
        },
        "Weak": {
          bgColor: "bg-orange-500/10",
          borderColor: "border-orange-500/30",
          textColor: "text-orange-400",
          dotColor: "bg-orange-400"
        },
        "Good": {
          bgColor: "bg-blue-500/10",
          borderColor: "border-blue-500/30",
          textColor: "text-blue-400",
          dotColor: "bg-blue-400"
        },
        "Very strong": {
          bgColor: "bg-green-500/10",
          borderColor: "border-green-500/30",
          textColor: "text-green-400",
          dotColor: "bg-green-400"
        }
      };
      return strengthMap[strength];
    }

    const strengthMap: Record<string, { bgColor: string; borderColor: string; textColor: string; dotColor: string }> = {
      "Very weak": {
        bgColor: isDark ? "bg-red-500/10" : "bg-red-50",
        borderColor: isDark ? "border-red-500/30" : "border-red-200",
        textColor: isDark ? "text-red-400" : "text-red-600",
        dotColor: isDark ? "bg-red-400" : "bg-red-600"
      },
      "Weak": {
        bgColor: isDark ? "bg-orange-500/10" : "bg-orange-50",
        borderColor: isDark ? "border-orange-500/30" : "border-orange-200",
        textColor: isDark ? "text-orange-400" : "text-orange-600",
        dotColor: isDark ? "bg-orange-400" : "bg-orange-600"
      },
      "Good": {
        bgColor: isDark ? "bg-blue-500/10" : "bg-blue-50",
        borderColor: isDark ? "border-blue-500/30" : "border-blue-200",
        textColor: isDark ? "text-blue-400" : "text-blue-600",
        dotColor: isDark ? "bg-blue-400" : "bg-blue-600"
      },
      "Very strong": {
        bgColor: isDark ? "bg-green-500/10" : "bg-green-50",
        borderColor: isDark ? "border-green-500/30" : "border-green-200",
        textColor: isDark ? "text-green-400" : "text-green-600",
        dotColor: isDark ? "bg-green-400" : "bg-green-600"
      }
    };

    return strengthMap[strength];
  };

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Connection Strength", "Twitter Followers", "Description"];
    const rows = sortedAndFilteredContacts.map(contact => [
      contact.name,
      contact.email,
      contact.connectionStrength,
      contact.twitterFollowers,
      contact.description || ""
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `contacts-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const exportToJSON = () => {
    const jsonContent = JSON.stringify(sortedAndFilteredContacts, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `contacts-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const shouldAnimate = enableAnimations && !shouldReduceMotion;

  const containerVariants = {
    visible: {
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.1,
      },
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
    exit: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className={`w-full max-w-7xl mx-auto ${className}`}>
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <button 
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className={`px-3 py-1.5 bg-background border border-border/50 text-foreground text-sm hover:bg-muted/30 transition-colors flex items-center gap-2 rounded-md ${filterStrength ? 'ring-2 ring-primary/30' : ''}`}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M2 3H14M4 8H12M6 13H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Filter
              {filterStrength && <span className="ml-1 text-xs bg-primary text-primary-foreground rounded-sm px-1.5 py-0.5">1</span>}
            </button>
            
            {showFilterMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10"
                  onClick={() => setShowFilterMenu(false)}
                />
                <div className="absolute right-0 mt-1 w-44 bg-background border border-border/50 shadow-lg rounded-md z-20 py-1">
                  <button
                    onClick={() => handleFilter(null)}
                    className={`w-full px-3 py-2 text-left text-sm hover:bg-muted/50 transition-colors ${!filterStrength ? 'bg-muted/30' : ''}`}
                  >
                    All Connections
                  </button>
                  <div className="h-px bg-border/30 my-1" />
                  {["Very strong", "Good", "Weak", "Very weak"].map((strength) => (
                    <button
                      key={strength}
                      onClick={() => handleFilter(strength)}
                      className={`w-full px-3 py-2 text-left text-sm hover:bg-muted/50 transition-colors flex items-center gap-2 ${filterStrength === strength ? 'bg-muted/30' : ''}`}
                    >
                      {strength}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="px-3 py-1.5 bg-background border border-border/50 text-foreground text-sm hover:bg-muted/30 transition-colors flex items-center gap-2 rounded-md"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 6L6 3L9 6M6 3V13M13 10L10 13L7 10M10 13V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Sort {sortField && <span className="ml-1 text-xs bg-primary text-primary-foreground rounded-sm px-1.5 py-0.5">1</span>}
              <ChevronDown size={14} className="opacity-50" />
            </button>
            
            {showSortMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10"
                  onClick={() => setShowSortMenu(false)}
                />
                <div className="absolute right-0 mt-1 w-48 bg-background border border-border/50 shadow-lg rounded-md z-20 py-1">
                  <button
                    onClick={() => handleSort("name")}
                    className={`w-full px-3 py-2 text-left text-sm hover:bg-muted/50 transition-colors ${sortField === "name" ? 'bg-muted/30' : ''}`}
                  >
                    Name {sortField === "name" && `(${sortOrder === "asc" ? "A-Z" : "Z-A"})`}
                  </button>
                  <button
                    onClick={() => handleSort("connectionStrength")}
                    className={`w-full px-3 py-2 text-left text-sm hover:bg-muted/50 transition-colors ${sortField === "connectionStrength" ? 'bg-muted/30' : ''}`}
                  >
                    Connection {sortField === "connectionStrength" && `(${sortOrder === "asc" ? "↑" : "↓"})`}
                  </button>
                  <button
                    onClick={() => handleSort("twitterFollowers")}
                    className={`w-full px-3 py-2 text-left text-sm hover:bg-muted/50 transition-colors ${sortField === "twitterFollowers" ? 'bg-muted/30' : ''}`}
                  >
                    Followers {sortField === "twitterFollowers" && `(${sortOrder === "asc" ? "↑" : "↓"})`}
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="relative">
            <button 
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="px-3 py-1.5 bg-background border border-border/50 text-foreground text-sm hover:bg-muted/30 transition-colors flex items-center gap-2 rounded-md"
            >
              <Download size={14} />
              Export
              <ChevronDown size={14} className="opacity-50" />
            </button>
            
            {showExportMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10"
                  onClick={() => setShowExportMenu(false)}
                />
                <div className="absolute right-0 mt-1 w-32 bg-background border border-border/50 shadow-lg rounded-md z-20">
                  <button
                    onClick={() => {
                      exportToCSV();
                      setShowExportMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-muted/50 transition-colors flex items-center gap-2"
                  >
                    CSV
                  </button>
                  <button
                    onClick={() => {
                      exportToJSON();
                      setShowExportMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-muted/50 transition-colors flex items-center gap-2 border-t border-border/30"
                  >
                    JSON
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="bg-background border border-border/50 overflow-hidden rounded-lg relative">
        <div className="overflow-x-auto">
          <div className="min-w-[1100px]">
            <div 
              className="px-3 py-3 text-xs font-medium text-muted-foreground/60 bg-muted/5 border-b border-border/30 text-left"
              style={{
                display: 'grid',
                gridTemplateColumns: '40px 220px 160px 140px 200px 1fr 40px',
                columnGap: '0px'
              }}
            >
              <div className="flex items-center justify-center border-r border-border/20 pr-3">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-border/40 cursor-pointer"
                  style={mounted ? {
                    accentColor: isDark ? "rgb(113, 113, 122)" : "rgb(161, 161, 170)"
                  } : {}}
                  checked={paginatedContacts.length > 0 && selectedContacts.length === paginatedContacts.length}
                  onChange={handleSelectAll}
                />
              </div>
              <div className="flex items-center gap-1.5 border-r border-border/20 px-3">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="opacity-40">
                  <circle cx="8" cy="6" r="3" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <path d="M3 14C3 11.5 5 10 8 10C11 10 13 11.5 13 14" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
                <span>{title}</span>
              </div>
              <div className="flex items-center gap-1.5 border-r border-border/20 px-3">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="opacity-40">
                  <path d="M3 8L6 5L10 9L13 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span>Connection Streng...</span>
              </div>
              <div className="flex items-center gap-1.5 border-r border-border/20 px-3">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="opacity-40">
                  <path d="M2 2H4M2 8H6M2 14H8M10 2V14M14 4V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span>Twitter Follo...</span>
              </div>
              <div className="flex items-center gap-1.5 border-r border-border/20 px-3">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="opacity-40">
                  <rect x="2" y="4" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <path d="M2 6L8 9L14 6" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
                <span>Email Addresses</span>
              </div>
              <div className="flex items-center gap-1.5 border-r border-border/20 px-3">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="opacity-40">
                  <path d="M3 3H13M3 8H13M3 13H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span>Description</span>
              </div>
              <div className="flex items-center justify-center px-3">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="opacity-30">
                  <circle cx="8" cy="8" r="1" fill="currentColor"/>
                  <circle cx="13" cy="8" r="1" fill="currentColor"/>
                  <circle cx="3" cy="8" r="1" fill="currentColor"/>
                </svg>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`page-${currentPage}`}
                variants={shouldAnimate ? containerVariants : {}}
                initial={shouldAnimate ? "hidden" : "visible"}
                animate="visible"
              >
                {paginatedContacts.map((contact) => (
                  <motion.div key={contact.id} variants={shouldAnimate ? rowVariants : {}}>
                    <div
                      className={`px-3 py-3.5 group relative transition-all duration-150 border-b border-border/20 ${
                        selectedContacts.includes(contact.id)
                          ? "bg-muted/30" 
                          : "bg-muted/5 hover:bg-muted/20"
                      }`}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '40px 220px 160px 140px 200px 1fr 40px',
                        columnGap: '0px',
                        alignItems: 'center'
                      }}
                    >
                      <div className="flex items-center justify-center border-r border-border/20 pr-3">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded border-border/40 cursor-pointer"
                          style={mounted ? {
                            accentColor: isDark ? "rgb(113, 113, 122)" : "rgb(161, 161, 170)"
                          } : {}}
                          checked={selectedContacts.includes(contact.id)}
                          onChange={() => handleContactSelect(contact.id)}
                        />
                      </div>

                      <div className="flex items-center gap-2 min-w-0 border-r border-border/20 px-3">
                        <div className="inline-flex items-center gap-2 px-2 py-1 bg-muted/30 rounded-full">
                          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="opacity-50 flex-shrink-0">
                            <circle cx="8" cy="6" r="3" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                            <path d="M3 14C3 11.5 5 10 8 10C11 10 13 11.5 13 14" stroke="currentColor" strokeWidth="1.5"/>
                          </svg>
                          <div className="min-w-0">
                            <div className="text-sm text-foreground truncate">{contact.name}</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center border-r border-border/20 px-3">
                        {(() => {
                          const { bgColor, textColor, dotColor } = getStrengthColor(contact.connectionStrength);
                          return (
                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium ${bgColor} ${textColor} rounded-md`}>
                              {contact.connectionStrength === "Very strong" ? (
                                <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                                  <path d="M8 1L3 9H7L8 15L13 7H9L8 1Z"/>
                                </svg>
                              ) : (
                                <div className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></div>
                              )}
                              {contact.connectionStrength}
                            </div>
                          );
                        })()}
                      </div>

                      <div className="flex items-center border-r border-border/20 px-3">
                        <span className="text-sm text-foreground/80">
                          {contact.twitterFollowers.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center min-w-0 border-r border-border/20 px-3">
                        <a 
                          href={`mailto:${contact.email}`}
                          className="text-sm text-blue-500 hover:text-blue-600 truncate"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {contact.email}
                        </a>
                      </div>

                      <div className="flex items-center min-w-0 border-r border-border/20 px-3">
                        <span className="text-sm text-muted-foreground/80 truncate">
                          {contact.description || "—"}
                        </span>
                      </div>

                      <div className="flex items-center justify-center px-3">
                        <button
                          onClick={() => setSelectedContactDetail(contact)}
                          className="opacity-0 group-hover:opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                            <circle cx="8" cy="3" r="1.5" fill="currentColor"/>
                            <circle cx="8" cy="8" r="1.5" fill="currentColor"/>
                            <circle cx="8" cy="13" r="1.5" fill="currentColor"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <AnimatePresence>
          {selectedContactDetail && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-10"
              onClick={() => setSelectedContactDetail(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.8 }}
                className="bg-card border border-border rounded-xl p-6 mx-6 shadow-lg relative max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedContactDetail(null)}
                  className="absolute top-3 right-3 w-6 h-6 rounded-full bg-muted/50 hover:bg-muted/70 flex items-center justify-center transition-colors"
                >
                  <X className="w-3 h-3 text-muted-foreground" />
                </button>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {selectedContactDetail.name}
                      </h3>
                      {(() => {
                        const { bgColor, textColor, dotColor } = getStrengthColor(selectedContactDetail.connectionStrength);
                        return (
                          <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium ${bgColor} ${textColor} rounded-md mt-1`}>
                            {selectedContactDetail.connectionStrength === "Very strong" ? (
                              <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M8 1L3 9H7L8 15L13 7H9L8 1Z"/>
                              </svg>
                            ) : (
                              <div className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></div>
                            )}
                            {selectedContactDetail.connectionStrength}
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">Email</span>
                      </div>
                      <a 
                        href={`mailto:${selectedContactDetail.email}`}
                        className="text-sm text-blue-500 hover:text-blue-600"
                      >
                        {selectedContactDetail.email}
                      </a>
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <Twitter className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">Twitter Followers</span>
                      </div>
                      <p className="text-sm font-medium text-foreground">
                        {selectedContactDetail.twitterFollowers.toLocaleString()}
                      </p>
                    </div>

                    {selectedContactDetail.description && (
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-xs text-muted-foreground uppercase tracking-wide">Description</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {selectedContactDetail.description}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-border/50">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md text-sm font-medium transition-colors"
                      onClick={() => {
                        window.location.href = `mailto:${selectedContactDetail.email}`;
                      }}
                    >
                      Send Email
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between px-2">
          <div className="text-xs text-muted-foreground/70">
            Page {currentPage} of {totalPages} • {sortedAndFilteredContacts.length} contacts
          </div>
          
          <div className="flex gap-1.5">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 bg-background border border-border/50 text-foreground text-xs hover:bg-muted/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded-md"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 bg-background border border-border/50 text-foreground text-xs hover:bg-muted/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded-md"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
