import React, { useEffect, useState } from "react";

const SystemMaintenance = () => {
  const [date, setDate] = useState("");
  const [terminalText, setTerminalText] = useState("");
  const [stats, setStats] = useState({ cpu: 45, disk: 78, proc: 12 });

  useEffect(() => {
    setDate(new Date().toLocaleDateString());

    // Terminal typing animation
    const lines = [
      "> Initializing system diagnostics...",
      "> Checking core modules... OK",
      "> Updating database schemas... OK",
      "> Optimizing performance... OK",
      "> Running security protocols... OK",
      "> System maintenance in progress...",
      "> Estimated completion: 15 minutes",
      "> Thank you for your patience."
    ];

    let line = 0;
    let char = 0;

    const typeWriter = () => {
      if (line < lines.length) {
        if (char < lines[line].length) {
          setTerminalText((prev) => prev + lines[line].charAt(char));
          char++;
          setTimeout(typeWriter, 50);
        } else {
          // Start each line on a new line
          setTerminalText((prev) => prev + "\n");
          line++;
          char = 0;
          setTimeout(typeWriter, 1000);
        }
      }
    };

    const startTyping = setTimeout(typeWriter, 1000);

    // Animated system stats
    const interval = setInterval(() => {
      setStats({
        cpu: Math.floor(Math.random() * 11) + 40,
        disk: Math.floor(Math.random() * 11) + 75,
        proc: Math.floor(Math.random() * 6) + 10
      });
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(startTyping);
    };
  }, []);

  return (
    <div className="body-wrapper">
      <div className="computer-frame">
        <div className="computer-header">
          <div className="header-left">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <polyline points="9,9 9,15 15,12" />
            </svg>
            <span>SYSTEM TERMINAL v2.1</span>
          </div>
          <div className="header-right">
            <div className="window-button btn-red" />
            <div className="window-button btn-yellow" />
            <div className="window-button btn-green" />
          </div>
        </div>

        <div className="logo-section">
          <div className="logo-container">
           <div className="w-[150px] h-8 bg-white rounded text-black text-xs font-bold flex items-center justify-center">
              Logo Here
            </div>
          </div>
        </div>

        <div className="ascii-art">
{`███╗   ███╗ █████╗ ██╗███╗   ██╗████████╗
████╗ ████║██╔══██╗██║████╗  ██║╚══██╔══╝
██╔████╔██║███████║██║██╔██╗ ██║   ██║   
██║╚██╔╝██║██╔══██║██║██║╚██╗██║   ██║   
██║ ╚═╝ ██║██║  ██║██║██║ ╚████║   ██║   
╚═╝     ╚═╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝   ╚═╝`}
        </div>

        <div className="terminal">
          <div className="terminal-header">
            MAINTENANCE SYSTEM v1.0 - {date}
          </div>
          <div className="terminal-divider">
            ==================================================
          </div>
          <div className="terminal-output" style={{ whiteSpace: "pre-wrap" }}>{terminalText}</div>
          <span className="cursor">█</span>
        </div>

        <div className="loading-bar">
          <div className="loading-progress"></div>
        </div>

        <div className="system-stats">
          <div className="stat-card">
            <div className="stat-label">CPU</div>
            <div className="stat-value">{stats.cpu}%</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">DISK</div>
            <div className="stat-value">{stats.disk}%</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">PROC</div>
            <div className="stat-value">{stats.proc}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemMaintenance;
