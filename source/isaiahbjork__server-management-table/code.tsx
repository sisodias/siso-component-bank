"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";
import { X, Power, Pause, Play, RotateCcw } from "lucide-react";

export interface Server {
  id: string;
  number: string;
  serviceName: string;
  osType: "windows" | "linux" | "ubuntu";
  serviceLocation: string;
  countryCode: "de" | "us" | "fr" | "jp";
  ip: string;
  dueDate: string;
  cpuPercentage: number;
  status: "active" | "paused" | "inactive";
}

interface ServerManagementTableProps {
  title?: string;
  servers?: Server[];
  onStatusChange?: (serverId: string, newStatus: Server["status"]) => void;
  className?: string;
}

const defaultServers: Server[] = [
  {
    id: "1",
    number: "01",
    serviceName: "VPS-2 (Windows)",
    osType: "windows",
    serviceLocation: "Frankfurt, Germany",
    countryCode: "de",
    ip: "198.51.100.211",
    dueDate: "14 Oct 2027",
    cpuPercentage: 80,
    status: "active"
  },
  {
    id: "2", 
    number: "02",
    serviceName: "VPS-1 (Windows)",
    osType: "windows",
    serviceLocation: "Frankfurt, Germany", 
    countryCode: "de",
    ip: "203.0.113.158",
    dueDate: "14 Oct 2027",
    cpuPercentage: 90,
    status: "active"
  },
  {
    id: "3",
    number: "03", 
    serviceName: "VPS-1 (Ubuntu)",
    osType: "ubuntu",
    serviceLocation: "Paris, France",
    countryCode: "fr",
    ip: "192.0.2.37",
    dueDate: "27 Jun 2027",
    cpuPercentage: 50,
    status: "paused"
  },
  {
    id: "4",
    number: "04",
    serviceName: "Cloud Server (Ubuntu)",
    osType: "ubuntu",
    serviceLocation: "California, US West",
    countryCode: "us",
    ip: "198.51.100.23",
    dueDate: "30 May 2030",
    cpuPercentage: 95,
    status: "active"
  },
  {
    id: "5",
    number: "05",
    serviceName: "Dedicated Server (Windows)",
    osType: "windows",
    serviceLocation: "Virginia, US East",
    countryCode: "us",
    ip: "203.0.113.45",
    dueDate: "15 Dec 2026",
    cpuPercentage: 25,
    status: "inactive"
  }
];

export function ServerManagementTable({
  title = "Active Services",
  servers: initialServers = defaultServers,
  onStatusChange,
  className = ""
}: ServerManagementTableProps = {}) {
  const [servers, setServers] = useState<Server[]>(initialServers);
  const [hoveredServer, setHoveredServer] = useState<string | null>(null);
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handleStatusChange = (serverId: string, newStatus: Server["status"]) => {
    if (onStatusChange) {
      onStatusChange(serverId, newStatus);
    }

    setServers(prev => prev.map(server => 
      server.id === serverId ? { ...server, status: newStatus } : server
    ));
  };

  const openServerModal = (server: Server) => {
    setSelectedServer(server);
  };

  const closeServerModal = () => {
    setSelectedServer(null);
  };

  // Update selected server when servers change (for real-time updates)
  useEffect(() => {
    if (selectedServer) {
      const updatedServer = servers.find(s => s.id === selectedServer.id);
      if (updatedServer) {
        setSelectedServer(updatedServer);
      }
    }
  }, [servers, selectedServer]);

  const getOSIcon = (osType: Server["osType"]) => {
    switch (osType) {
      case "windows":
        return (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center p-1.5 border border-border/30">
            <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
              <path className="fill-white" d="M30,15H17c-0.6,0-1-0.4-1-1V3.3c0-0.5,0.4-0.9,0.8-1l13-2.3c0.3,0,0.6,0,0.8,0.2C30.9,0.4,31,0.7,31,1v13 C31,14.6,30.6,15,30,15z"/>
              <path className="fill-white" d="M13,15H1c-0.6,0-1-0.4-1-1V6c0-0.5,0.4-0.9,0.8-1l12-2c0.3,0,0.6,0,0.8,0.2C13.9,3.4,14,3.7,14,4v10 C14,14.6,13.6,15,13,15z"/>
              <path className="fill-white" d="M30,32c-0.1,0-0.1,0-0.2,0l-13-2.3c-0.5-0.1-0.8-0.5-0.8-1V18c0-0.6,0.4-1,1-1h13c0.6,0,1,0.4,1,1v13 c0,0.3-0.1,0.6-0.4,0.8C30.5,31.9,30.2,32,30,32z"/>
              <path className="fill-white" d="M13,29c-0.1,0-0.1,0-0.2,0l-12-2C0.4,26.9,0,26.5,0,26v-8c0-0.6,0.4-1,1-1h12c0.6,0,1,0.4,1,1v10 c0,0.3-0.1,0.6-0.4,0.8C13.5,28.9,13.2,29,13,29z"/>
            </svg>
          </div>
        );
      case "ubuntu":
        return (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center p-1.5 border border-border/30">
            <svg width="16" height="16" viewBox="-5 0 32 32" fill="white">
              <path d="M16.469 9.375c-1.063-0.594-1.406-1.938-0.813-3 0.406-0.719 1.156-1.094 1.906-1.094 0.375 0 0.75 0.094 1.094 0.281 1.063 0.625 1.406 1.969 0.813 3-0.406 0.719-1.156 1.094-1.906 1.094-0.375 0-0.75-0.094-1.094-0.281zM21.938 15.594h-3.625c-0.125-1.688-0.969-3.188-2.25-4.156-0.219-0.156-0.438-0.313-0.688-0.469-0.813-0.438-1.75-0.688-2.75-0.688-1.031 0-1.969 0.25-2.813 0.719l-2-3.031c1.406-0.844 3.031-1.313 4.813-1.313 0.688 0 1.375 0.063 2.063 0.219-0.25 1.219 0.281 2.5 1.406 3.156 0.438 0.25 0.938 0.375 1.469 0.375 0.719 0 1.406-0.25 1.938-0.719 1.438 1.563 2.344 3.625 2.438 5.906zM7.125 8.438l2 3.031c-1.25 0.969-2.094 2.438-2.188 4.125-0.031 0.125-0.031 0.25-0.031 0.406 0 0.125 0 0.281 0.031 0.406 0.125 1.781 1.063 3.313 2.438 4.281l-1.906 3.094c-1.813-1.188-3.188-3-3.813-5.125 0.875-0.5 1.5-1.469 1.5-2.563s-0.625-2.094-1.563-2.594c0.594-2.063 1.844-3.844 3.531-5.063zM2.188 13.906c1.219 0 2.219 0.969 2.219 2.188s-1 2.219-2.219 2.219-2.188-1-2.188-2.219 0.969-2.188 2.188-2.188zM8.188 24.219l1.906-3.125c0.75 0.375 1.625 0.594 2.531 0.594 1 0 1.938-0.25 2.781-0.719 0.25-0.125 0.469-0.281 0.688-0.469 1.25-0.938 2.094-2.406 2.219-4.094h3.625c-0.094 2.375-1.094 4.531-2.656 6.125-0.469-0.344-1.063-0.531-1.656-0.531-0.531 0-1.031 0.125-1.469 0.375-1 0.594-1.531 1.656-1.469 2.719-0.688 0.156-1.375 0.25-2.063 0.25-1.625 0-3.125-0.406-4.438-1.125zM17.625 22.75c0.75 0 1.5 0.375 1.906 1.094 0.594 1.063 0.219 2.438-0.813 3.031-0.344 0.188-0.719 0.281-1.094 0.281-0.781 0-1.5-0.375-1.906-1.094-0.625-1.063-0.25-2.406 0.813-3.031 0.344-0.188 0.719-0.281 1.094-0.281z"/>
            </svg>
          </div>
        );
      case "linux":
        return (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center border border-border/30">
            <div className="text-white text-xs font-mono font-bold">L</div>
          </div>
        );
    }
  };

  const getCountryFlag = (countryCode: Server["countryCode"]) => {
    switch (countryCode) {
      case "de":
        return (
          <svg width="32" height="32" viewBox="0 0 130 120" fill="none" className="scale-125">
            <rect fill="#1E1D1D" width="130" height="39"/>
            <rect y="39" fill="#DC4437" width="130" height="42"/>
            <rect y="81" fill="#FCBE1F" width="130" height="39"/>
          </svg>
        );
      case "us":
        return (
          <svg width="32" height="32" viewBox="0 0 130 120" fill="none" className="scale-125">
            <rect y="0" fill="#DC4437" width="130" height="13.3"/>
            <rect y="26.7" fill="#DC4437" width="130" height="13.3"/>
            <rect y="80" fill="#DC4437" width="130" height="13.3"/>
            <rect y="106.7" fill="#DC4437" width="130" height="13.3"/>
            <rect y="53.3" fill="#DC4437" width="130" height="13.3"/>
            <rect y="13.3" fill="#FFFFFF" width="130" height="13.3"/>
            <rect y="40" fill="#FFFFFF" width="130" height="13.3"/>
            <rect y="93.3" fill="#FFFFFF" width="130" height="13.3"/>
            <rect y="66.7" fill="#FFFFFF" width="130" height="13.3"/>
            <rect y="0" fill="#2A66B7" width="70" height="66.7"/>
            <polygon fill="#FFFFFF" points="13.5,4 15.8,8.9 21,9.7 17.2,13.6 18.1,19 13.5,16.4 8.9,19 9.8,13.6 6,9.7 11.2,8.9"/>
            <polygon fill="#FFFFFF" points="34,4 36.3,8.9 41.5,9.7 37.8,13.6 38.6,19 34,16.4 29.4,19 30.2,13.6 26.5,9.7 31.7,8.9"/>
            <polygon fill="#FFFFFF" points="54.5,4 56.8,8.9 62,9.7 58.2,13.6 59.1,19 54.5,16.4 49.9,19 50.8,13.6 47,9.7 52.2,8.9"/>
            <polygon fill="#FFFFFF" points="24,24 26.3,28.9 31.5,29.7 27.8,33.6 28.6,39 24,36.4 19.4,39 20.2,33.6 16.5,29.7 21.7,28.9"/>
            <polygon fill="#FFFFFF" points="44.5,24 46.8,28.9 52,29.7 48.2,33.6 49.1,39 44.5,36.4 39.9,39 40.8,33.6 37,29.7 42.2,28.9"/>
            <polygon fill="#FFFFFF" points="13.5,45.2 15.8,50.1 21,50.9 17.2,54.7 18.1,60.2 13.5,57.6 8.9,60.2 9.8,54.7 6,50.9 11.2,50.1"/>
            <polygon fill="#FFFFFF" points="34,45.2 36.3,50.1 41.5,50.9 37.8,54.7 38.6,60.2 34,57.6 29.4,60.2 30.2,54.7 26.5,50.9 31.7,50.1"/>
            <polygon fill="#FFFFFF" points="54.5,45.2 56.8,50.1 62,50.9 58.2,54.7 59.1,60.2 54.5,57.6 49.9,60.2 50.8,54.7 47,50.9 52.2,50.1"/>
          </svg>
        );
      case "fr":
        return (
          <svg width="32" height="32" viewBox="0 0 90 60" fill="none" className="scale-150">
            <rect width="30" height="60" fill="#0055A4"/>
            <rect x="30" width="30" height="60" fill="#FFFFFF"/>
            <rect x="60" width="30" height="60" fill="#EF4135"/>
          </svg>
        );
      case "jp":
        return (
          <svg width="32" height="32" viewBox="0 0 90 60" fill="none" className="scale-150">
            <rect width="90" height="60" fill="#FFFFFF"/>
            <circle cx="45" cy="30" r="18" fill="#BC002D"/>
          </svg>
        );
    }
  };

  const getCPUBars = (percentage: number, status: Server["status"]) => {
    const filledBars = Math.round((percentage / 100) * 10);
    
    const getBarColor = (index: number) => {
      if (index >= filledBars) {
        return "bg-muted/40 border border-border/30";
      }
      
      switch (status) {
        case "active":
          return "bg-foreground/60";
        case "paused":
          return "bg-muted-foreground/50";
        case "inactive":
          return "bg-muted-foreground/30";
        default:
          return "bg-foreground/60";
      }
    };
    
    return (
      <div className="flex items-center gap-3">
        <div className="flex gap-1">
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-5 rounded-full transition-all duration-500 ${getBarColor(index)}`}
            />
          ))}
        </div>
        <span className="text-sm font-mono text-foreground font-medium min-w-[3rem]">
          {percentage}%
        </span>
      </div>
    );
  };

  const getStatusBadge = (status: Server["status"]) => {
    switch (status) {
      case "active":
        return (
          <div className="px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center justify-center">
            <span className="text-green-400 text-sm font-medium">Active</span>
          </div>
        );
      case "paused":
        return (
          <div className="px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
            <span className="text-yellow-400 text-sm font-medium">Paused</span>
          </div>
        );
      case "inactive":
        return (
          <div className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center">
            <span className="text-red-400 text-sm font-medium">Inactive</span>
          </div>
        );
    }
  };

  const getStatusGradient = (status: Server["status"]) => {
    switch (status) {
      case "active":
        return "from-green-500/10 to-transparent";
      case "paused": 
        return "from-yellow-500/10 to-transparent";
      case "inactive":
        return "from-red-500/10 to-transparent";
    }
  };

  return (
    <div className={`w-full max-w-7xl mx-auto p-6 ${className}`}>
      <div className="relative border border-border/30 rounded-2xl p-6 bg-card">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <h1 className="text-xl font-medium text-foreground">{title}</h1>
            </div>
            <div className="text-sm text-muted-foreground">
              {servers.filter(s => s.status === "active").length} Servers • {servers.filter(s => s.status === "inactive").length} Servers
            </div>
          </div>
        </div>

        {/* Table */}
        <motion.div
          className="space-y-2"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.08,
                delayChildren: 0.1,
              }
            }
          }}
          initial="hidden"
          animate="visible"
        >
          {/* Headers */}
          <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <div className="col-span-1">No</div>
            <div className="col-span-2">Service Name</div>
            <div className="col-span-2">Service Location</div>
            <div className="col-span-2">IP</div>
            <div className="col-span-2">Due Date</div>
            <div className="col-span-2">CPU</div>
            <div className="col-span-1">Status</div>
          </div>

          {/* Server Rows */}
          {servers.map((server) => (
            <motion.div
              key={server.id}
              variants={{
                hidden: { 
                  opacity: 0, 
                  x: -25,
                  scale: 0.95,
                  filter: "blur(4px)" 
                },
                visible: {
                  opacity: 1,
                  x: 0,
                  scale: 1,
                  filter: "blur(0px)",
                  transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 28,
                    mass: 0.6,
                  },
                },
              }}
              className="relative cursor-pointer"
              onMouseEnter={() => setHoveredServer(server.id)}
              onMouseLeave={() => setHoveredServer(null)}
              onClick={() => openServerModal(server)}
            >
              <motion.div
                className="relative bg-muted/50 border border-border/50 rounded-xl p-4 overflow-hidden"
                whileHover={{
                  y: -1,
                  transition: { type: "spring", stiffness: 400, damping: 25 }
                }}
              >
                {/* Status gradient overlay */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-l ${getStatusGradient(server.status)} pointer-events-none`}
                  style={{ 
                    backgroundSize: "30% 100%", 
                    backgroundPosition: "right",
                    backgroundRepeat: "no-repeat"
                  }} 
                />
                
                {/* Grid Content */}
                <div className="relative grid grid-cols-12 gap-4 items-center">
                  {/* Number */}
                  <div className="col-span-1">
                    <span className="text-2xl font-bold text-muted-foreground">
                      {server.number}
                    </span>
                  </div>

                  {/* Service Name */}
                  <div className="col-span-2 flex items-center gap-3">
                    {getOSIcon(server.osType)}
                    <span className="text-foreground font-medium">
                      {server.serviceName}
                    </span>
                  </div>

                  {/* Service Location */}
                  <div className="col-span-2 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-border/30 flex items-center justify-center">
                      <div className="w-full h-full">
                        {getCountryFlag(server.countryCode)}
                      </div>
                    </div>
                    <span className="text-foreground">
                      {server.serviceLocation}
                    </span>
                  </div>

                  {/* IP */}
                  <div className="col-span-2">
                    <span className="text-foreground font-mono text-sm">
                      {server.ip}
                    </span>
                  </div>

                  {/* Due Date */}
                  <div className="col-span-2">
                    <span className="text-foreground">
                      {server.dueDate}
                    </span>
                  </div>

                  {/* CPU */}
                  <div className="col-span-2">
                    {getCPUBars(server.cpuPercentage, server.status)}
                  </div>

                  {/* Status */}
                  <div className="col-span-1">
                    {getStatusBadge(server.status)}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Server Management Overlay - Inside Card */}
        <AnimatePresence>
          {selectedServer && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-background/60 backdrop-blur-sm flex flex-col rounded-2xl z-10 overflow-hidden"
            >
              {/* Header with Actions */}
              <div className="relative bg-gradient-to-r from-muted/50 to-transparent p-4 border-b border-border/30 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold text-muted-foreground">
                    {selectedServer.number}
                  </div>
                  {getOSIcon(selectedServer.osType)}
                  <div>
                    <h3 className="text-lg font-bold text-foreground">
                      {selectedServer.serviceName}
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full overflow-hidden border border-border/30 flex items-center justify-center">
                        <div className="w-full h-full scale-75">
                          {getCountryFlag(selectedServer.countryCode)}
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {selectedServer.serviceLocation}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons in Header */}
                <div className="flex items-center gap-2">
                  {/* Start/Stop */}
                  {selectedServer.status === "active" ? (
                    <motion.button
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-sm transition-colors"
                      onClick={() => handleStatusChange(selectedServer.id, "inactive")}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Power className="w-3 h-3" />
                      Stop
                    </motion.button>
                  ) : (
                    <motion.button
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg text-sm transition-colors"
                      onClick={() => handleStatusChange(selectedServer.id, "active")}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Play className="w-3 h-3" />
                      Start
                    </motion.button>
                  )}

                  {/* Pause/Resume */}
                  {selectedServer.status === "paused" ? (
                    <motion.button
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg text-sm transition-colors"
                      onClick={() => handleStatusChange(selectedServer.id, "active")}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Play className="w-3 h-3" />
                      Resume
                    </motion.button>
                  ) : (
                    <motion.button
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-lg text-sm transition-colors"
                      onClick={() => handleStatusChange(selectedServer.id, "paused")}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Pause className="w-3 h-3" />
                      Pause
                    </motion.button>
                  )}

                  {/* Restart */}
                  <motion.button
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-lg text-sm transition-colors"
                    onClick={() => {
                      handleStatusChange(selectedServer.id, "inactive");
                      setTimeout(() => handleStatusChange(selectedServer.id, "active"), 1000);
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <RotateCcw className="w-3 h-3" />
                    Restart
                  </motion.button>

                  {/* Close Button */}
                  <motion.button
                    className="w-8 h-8 bg-background/80 hover:bg-background rounded-full flex items-center justify-center border border-border/50 ml-2"
                    onClick={closeServerModal}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {/* Server Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* IP Address */}
                  <div className="bg-muted/40 rounded-lg p-3 border border-border/30">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      IP Address
                    </label>
                    <div className="text-sm font-mono font-medium mt-1">
                      {selectedServer.ip}
                    </div>
                  </div>

                  {/* Due Date */}
                  <div className="bg-muted/40 rounded-lg p-3 border border-border/30">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Due Date
                    </label>
                    <div className="text-sm font-medium mt-1">
                      {selectedServer.dueDate}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="bg-muted/40 rounded-lg p-3 border border-border/30">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </label>
                    <div className="mt-1">
                      {getStatusBadge(selectedServer.status)}
                    </div>
                  </div>
                </div>

                {/* CPU Usage */}
                <div className="bg-muted/40 rounded-lg p-3 border border-border/30">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                    CPU Usage
                  </label>
                  {getCPUBars(selectedServer.cpuPercentage, selectedServer.status)}
                </div>

                {/* Server Logs Preview */}
                <div className="bg-muted/40 rounded-lg p-3 border border-border/30">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                    Recent Activity
                  </label>
                  <div className="font-mono text-xs space-y-1 max-h-24 overflow-y-auto">
                    <div className="text-green-400">[15:42:31] Server started successfully</div>
                    <div className="text-blue-400">[15:42:25] System health check passed</div>
                    <div className="text-yellow-400">[15:41:18] CPU usage: {selectedServer.cpuPercentage}%</div>
                    <div className="text-muted-foreground">[15:40:05] Connection from {selectedServer.ip}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
