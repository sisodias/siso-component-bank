import React, { useState, useRef, useEffect, useMemo } from 'react';

const CommandPalette = ({
  items = [],
  isOpen = false,
  onClose = () => {},
  onSelect = () => {},
  placeholder = "Search for commands...",
  className = "",
  maxHeight = "400px"
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const filteredItems = useMemo(() => {
    if (!query) return items;
    
    return items.filter(item => {
      const searchText = `${item.title} ${item.description || ''} ${item.keywords || ''}`.toLowerCase();
      return searchText.includes(query.toLowerCase());
    }).sort((a, b) => {
      // Prioritize title matches
      const aTitle = a.title.toLowerCase().includes(query.toLowerCase()) ? 0 : 1;
      const bTitle = b.title.toLowerCase().includes(query.toLowerCase()) ? 0 : 1;
      return aTitle - bTitle;
    });
  }, [items, query]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredItems.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          onSelect(filteredItems[selectedIndex]);
          onClose();
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  };

  const handleItemClick = (item) => {
    onSelect(item);
    onClose();
  };

  const getItemIcon = (item) => {
    if (item.icon) return item.icon;
    
    switch (item.category) {
      case 'navigation': return '🧭';
      case 'action': return '⚡';
      case 'file': return '📄';
      case 'settings': return '⚙️';
      case 'user': return '👤';
      case 'search': return '🔍';
      default: return '📌';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Command Palette */}
      <div className={`relative w-full max-w-lg bg-card border rounded-lg shadow-lg ${className}`}>
        {/* Search Input */}
        <div className="flex items-center px-4 py-3 border-b">
          <svg className="w-4 h-4 text-muted-foreground mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-foreground placeholder-muted-foreground focus:outline-none text-sm"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-muted-foreground hover:text-foreground ml-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Results */}
        <div 
          ref={listRef}
          className="overflow-y-auto"
          style={{ maxHeight }}
        >
          {filteredItems.length === 0 ? (
            <div className="px-4 py-8 text-center text-muted-foreground">
              <div className="text-2xl mb-2">🔍</div>
              <p className="text-sm">
                {query ? `No results for "${query}"` : 'No commands available'}
              </p>
            </div>
          ) : (
            <div className="py-2">
              {filteredItems.map((item, index) => (
                <button
                  key={item.id || index}
                  onClick={() => handleItemClick(item)}
                  className={`
                    w-full px-4 py-2 text-left flex items-center gap-3 transition-colors duration-150
                    ${index === selectedIndex 
                      ? 'bg-muted text-foreground' 
                      : 'hover:bg-muted/50 text-foreground'
                    }
                  `}
                >
                  <div className="text-base">
                    {getItemIcon(item)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {item.title}
                    </div>
                    {item.description && (
                      <div className="text-xs text-muted-foreground truncate">
                        {item.description}
                      </div>
                    )}
                  </div>
                  {item.shortcut && (
                    <div className="flex gap-1">
                      {item.shortcut.split('+').map((key, i) => (
                        <kbd 
                          key={i}
                          className="px-1.5 py-0.5 text-xs bg-muted border rounded text-muted-foreground"
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {filteredItems.length > 0 && (
          <div className="px-4 py-2 border-t bg-muted/20">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 bg-background border rounded">↑↓</kbd>
                  Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 bg-background border rounded">↵</kbd>
                  Select
                </span>
              </div>
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 bg-background border rounded">ESC</kbd>
                Close
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Professional demo component
const CommandPaletteDemo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCommand, setSelectedCommand] = useState(null);
  const [theme, setTheme] = useState('light');

  const commands = [
    {
      id: 1,
      title: 'Create New File',
      description: 'Create a new file in the current workspace',
      category: 'file',
      shortcut: 'Ctrl+N',
      keywords: 'new document create'
    },
    {
      id: 2,
      title: 'Open File',
      description: 'Open an existing file from your computer',
      category: 'file',
      shortcut: 'Ctrl+O',
      keywords: 'open browse'
    },
    {
      id: 3,
      title: 'Save File',
      description: 'Save the current file',
      category: 'file',
      shortcut: 'Ctrl+S',
      keywords: 'save'
    },
    {
      id: 4,
      title: 'Go to Dashboard',
      description: 'Navigate to the main dashboard',
      category: 'navigation',
      shortcut: 'Ctrl+D',
      keywords: 'home dashboard main'
    },
    {
      id: 5,
      title: 'Search Projects',
      description: 'Search through all your projects',
      category: 'search',
      shortcut: 'Ctrl+P',
      keywords: 'find search projects'
    },
    {
      id: 6,
      title: 'User Profile',
      description: 'View and edit your profile settings',
      category: 'user',
      shortcut: 'Ctrl+U',
      keywords: 'profile user account settings'
    },
    {
      id: 7,
      title: 'Toggle Sidebar',
      description: 'Show or hide the sidebar',
      category: 'action',
      shortcut: 'Ctrl+B',
      keywords: 'sidebar toggle show hide'
    },
    {
      id: 8,
      title: 'Settings',
      description: 'Open application settings',
      category: 'settings',
      shortcut: 'Ctrl+,',
      keywords: 'settings preferences config'
    },
    {
      id: 9,
      title: 'Export Data',
      description: 'Export your data to various formats',
      category: 'action',
      shortcut: 'Ctrl+E',
      keywords: 'export download data'
    },
    {
      id: 10,
      title: 'Import Files',
      description: 'Import files from external sources',
      category: 'action',
      shortcut: 'Ctrl+I',
      keywords: 'import upload files'
    }
  ];

  const handleCommandSelect = (command) => {
    setSelectedCommand(command);
    console.log('Selected command:', command);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <style jsx global>{`
        :root {
          --background: 0 0% 100%;
          --foreground: 222.2 84% 4.9%;
          --card: 0 0% 100%;
          --card-foreground: 222.2 84% 4.9%;
          --popover: 0 0% 100%;
          --popover-foreground: 222.2 84% 4.9%;
          --primary: 222.2 47.4% 11.2%;
          --primary-foreground: 210 40% 98%;
          --secondary: 210 40% 96%;
          --secondary-foreground: 222.2 47.4% 11.2%;
          --muted: 210 40% 96%;
          --muted-foreground: 215.4 16.3% 46.9%;
          --accent: 210 40% 96%;
          --accent-foreground: 222.2 47.4% 11.2%;
          --destructive: 0 84.2% 60.2%;
          --destructive-foreground: 210 40% 98%;
          --border: 214.3 31.8% 91.4%;
          --input: 214.3 31.8% 91.4%;
          --ring: 222.2 47.4% 11.2%;
          --radius: 0.5rem;
        }
        
        .dark {
          --background: 222.2 84% 4.9%;
          --foreground: 210 40% 98%;
          --card: 222.2 84% 4.9%;
          --card-foreground: 210 40% 98%;
          --popover: 222.2 84% 4.9%;
          --popover-foreground: 210 40% 98%;
          --primary: 210 40% 98%;
          --primary-foreground: 222.2 47.4% 11.2%;
          --secondary: 217.2 32.6% 17.5%;
          --secondary-foreground: 210 40% 98%;
          --muted: 217.2 32.6% 17.5%;
          --muted-foreground: 215 20.2% 65.1%;
          --accent: 217.2 32.6% 17.5%;
          --accent-foreground: 210 40% 98%;
          --destructive: 0 62.8% 30.6%;
          --destructive-foreground: 210 40% 98%;
          --border: 217.2 32.6% 17.5%;
          --input: 217.2 32.6% 17.5%;
          --ring: 212.7 26.8% 83.9%;
        }
        
        * {
          border-color: hsl(var(--border));
        }
        
        body {
          background-color: hsl(var(--background));
          color: hsl(var(--foreground));
        }
        
        .bg-background { background-color: hsl(var(--background)); }
        .text-foreground { color: hsl(var(--foreground)); }
        .bg-card { background-color: hsl(var(--card)); }
        .text-card-foreground { color: hsl(var(--card-foreground)); }
        .bg-muted { background-color: hsl(var(--muted)); }
        .text-muted-foreground { color: hsl(var(--muted-foreground)); }
        .bg-secondary { background-color: hsl(var(--secondary)); }
        .text-secondary-foreground { color: hsl(var(--secondary-foreground)); }
        .bg-primary { background-color: hsl(var(--primary)); }
        .text-primary-foreground { color: hsl(var(--primary-foreground)); }
        .border-input { border-color: hsl(var(--input)); }
        .border-border { border-color: hsl(var(--border)); }
        .bg-background\\/80 { background-color: hsl(var(--background) / 0.8); }
        .bg-muted\\/20 { background-color: hsl(var(--muted) / 0.2); }
        .bg-muted\\/50 { background-color: hsl(var(--muted) / 0.5); }
        .hover\\:bg-muted\\/50:hover { background-color: hsl(var(--muted) / 0.5); }
        .hover\\:text-foreground:hover { color: hsl(var(--foreground)); }
        .hover\\:bg-accent:hover { background-color: hsl(var(--accent)); }
        .hover\\:text-accent-foreground:hover { color: hsl(var(--accent-foreground)); }
        .hover\\:bg-primary\\/90:hover { background-color: hsl(var(--primary) / 0.9); }
        .hover\\:bg-secondary\\/80:hover { background-color: hsl(var(--secondary) / 0.8); }
      `}</style>

      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-2xl">
          <div className="bg-card rounded-lg border p-8 shadow-sm text-center">
            {/* Header */}
            <div className="space-y-4 mb-8">
              <div className="text-4xl">⌘</div>
              <h1 className="text-2xl font-semibold tracking-tight">Command Palette</h1>
              <p className="text-muted-foreground max-w-md mx-auto">
                A powerful search interface for quick navigation and actions. 
                Try searching for commands, files, or actions.
              </p>
            </div>

            {/* Trigger Button */}
            <div className="space-y-4">
              <button
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Open Command Palette
              </button>
              
              <div className="text-xs text-muted-foreground">
                Or press{' '}
                <kbd className="px-1.5 py-0.5 bg-muted border rounded text-muted-foreground">
                  {navigator.platform.toLowerCase().includes('mac') ? 'Cmd' : 'Ctrl'}
                </kbd>
                {' '}+{' '}
                <kbd className="px-1.5 py-0.5 bg-muted border rounded text-muted-foreground">
                  K
                </kbd>
              </div>
            </div>

            {/* Last Selected Command */}
            {selectedCommand && (
              <div className="mt-8 p-4 rounded-md bg-muted/20 border">
                <h3 className="text-sm font-medium mb-2">Last Selected Command</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{selectedCommand.title}</span>
                  {selectedCommand.shortcut && (
                    <div className="flex gap-1 ml-auto">
                      {selectedCommand.shortcut.split('+').map((key, i) => (
                        <kbd 
                          key={i}
                          className="px-1.5 py-0.5 text-xs bg-background border rounded"
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Feature List */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Features</h3>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Fuzzy search with keyword matching</li>
                  <li>• Keyboard navigation (↑↓ arrows)</li>
                  <li>• Keyboard shortcuts display</li>
                  <li>• Category-based icons</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Try Searching</h3>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• "file" - File operations</li>
                  <li>• "dashboard" - Navigation</li>
                  <li>• "settings" - Configuration</li>
                  <li>• "export" - Actions</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Theme Toggle */}
          <div className="mt-4 flex justify-center">
            <button
              onClick={toggleTheme}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
            >
              {theme === 'light' ? '🌙' : '☀️'}
              <span className="ml-2 text-xs">
                {theme === 'light' ? 'Dark' : 'Light'} Mode
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Command Palette */}
      <CommandPalette
        items={commands}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSelect={handleCommandSelect}
        placeholder="Search for commands and actions..."
      />
    </div>
  );
};

export default CommandPaletteDemo;