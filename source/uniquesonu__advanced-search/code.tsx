import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils"; // Assumes shadcn's utility for class merging
import { Input } from "@/components/ui/input";
import { Search, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

// --- 📦 API (Props) Definition ---
export interface SearchScope {
  /** The unique key for the search scope (e.g., 'user_id'). */
  key: string;
  /** The label displayed in the dropdown (e.g., 'User ID'). */
  label: string;
}

export interface AdvancedSearchInputProps {
  /** Array of available search scopes. */
  scopes: SearchScope[];
  /** The currently active search scope key. */
  activeScopeKey: string;
  /** The current value of the search input. */
  value: string;
  /** Callback when the input value changes. */
  onValueChange: (value: string) => void;
  /** Callback when the active search scope changes. */
  onScopeChange: (key: string) => void;
  /** Callback for when the user submits the search (e.g., presses Enter). */
  onSearchSubmit: (scope: string, query: string) => void;
  /** Placeholder text for the input field. */
  placeholder?: string;
  /** Optional class name for the container. */
  className?: string;
}

/**
 * An advanced search input component with an integrated scope selector dropdown.
 * Uses Framer Motion for interactive polish.
 */
const AdvancedSearchInput: React.FC<AdvancedSearchInputProps> = ({
  scopes,
  activeScopeKey,
  value,
  onValueChange,
  onScopeChange,
  onSearchSubmit,
  placeholder = "Search dashboard content...",
  className,
}) => {
  const activeScope = scopes.find(s => s.key === activeScopeKey) || scopes[0];

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearchSubmit(activeScopeKey, value);
      e.currentTarget.blur(); // Hide keyboard on mobile/focus ring on desktop
    }
  }, [activeScopeKey, value, onSearchSubmit]);

  // Framer Motion variants for the input container hover
  const containerVariants = {
    initial: { boxShadow: "0 0 #0000" },
    hover: { boxShadow: "0 0 0 1px hsl(var(--ring)/.5)", transition: { duration: 0.15 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      whileHover="hover"
      className={cn(
        "flex w-full sm:max-w-xl rounded-lg border border-input bg-background overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 transition-all duration-150",
        className
      )}
      role="search"
    >
      {/* Scope Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.div
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center p-2 border-r bg-muted/50 text-muted-foreground hover:bg-muted/80 cursor-pointer transition-colors duration-150 shrink-0"
            aria-label={`Current search scope: ${activeScope.label}. Click to change.`}
          >
            <span className="text-sm font-medium whitespace-nowrap hidden sm:inline">{activeScope.label}</span>
            <span className="text-sm font-medium whitespace-nowrap sm:hidden">{activeScope.key.split('_')[0]}</span>
            <ChevronDown className="ml-1 sm:ml-2 h-4 w-4" />
          </motion.div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuLabel>Search Scope</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {scopes.map(scope => (
            <DropdownMenuItem
              key={scope.key}
              onClick={() => onScopeChange(scope.key)}
              className={cn(
                "cursor-pointer transition-colors duration-100",
                scope.key === activeScopeKey && "bg-accent text-accent-foreground"
              )}
            >
              {scope.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Input Field */}
      <div className="relative flex-grow flex items-center">
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <Input
          type="search"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full h-10 border-none pl-10 pr-4 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
          aria-label={`Search for ${activeScope.label}`}
        />
      </div>
    </motion.div>
  );
};


const mockScopes: SearchScope[] = [
  { key: 'user_id', label: 'User ID' },
  { key: 'email', label: 'Email Address' },
  { key: 'ip_address', label: 'IP Address' },
  { key: 'transaction_id', label: 'Transaction ID' },
];

const ExampleUsage = () => {
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState(mockScopes[0].key);
  const [lastSearch, setLastSearch] = useState<{ scope: string; query: string } | null>(null);

  const handleSubmit = (searchScope: string, searchQuery: string) => {
    setLastSearch({ scope: searchScope, query: searchQuery });
    console.log(`Searching scope: ${searchScope}, query: ${searchQuery}`);
    // Here you would typically trigger a data fetch or table filter update
  };

  return (
    <div className="p-8 bg-background border rounded-lg max-w-4xl mx-auto shadow-md">
      <h3 className="text-xl font-semibold text-foreground mb-4">Advanced Search Demo</h3>
      
      <AdvancedSearchInput
        scopes={mockScopes}
        activeScopeKey={scope}
        value={query}
        onValueChange={setQuery}
        onScopeChange={setScope}
        onSearchSubmit={handleSubmit}
        placeholder="Find users, transactions, or devices..."
      />

      <div className="mt-6 p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground">
        <p className="font-medium text-foreground mb-2">Current State:</p>
        <p>Scope: <strong className="text-foreground">{scope}</strong></p>
        <p>Query: <strong className="text-foreground">{query || "..."}</strong></p>
        {lastSearch && (
          <p className="mt-4 border-t border-border pt-2">Last Search Performed (Enter Key): 
            <strong className="text-primary font-bold ml-2">{lastSearch.scope}: {lastSearch.query}</strong>
          </p>
        )}
      </div>
    </div>
  );
};

export default ExampleUsage;