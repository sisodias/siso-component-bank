"use client";

import * as React from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Plus, Search, Check } from "lucide-react";
import { cn } from "../_utils/cn";

export interface Member {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
}

export interface MemberSelectorProps {
  members: Member[];
  selected: string[];
  onChange: (selected: string[]) => void;
  max?: number;
  maxVisible?: number;
  label?: string;
  className?: string;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

interface AvatarProps {
  member: Member;
  isSelected: boolean;
  onClick: () => void;
}

function Avatar({ member, isSelected, onClick }: AvatarProps) {
  return (
    <motion.button
      layoutId={`member-${member.id}`}
      onClick={onClick}
      className="group relative flex flex-col items-center gap-1.5 outline-none cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <div
        className={cn(
          "relative w-12 h-12 rounded-full overflow-hidden transition-all duration-200",
          "group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2",
          !isSelected && "opacity-50 hover:opacity-75"
        )}
      >
        {member.avatar ? (
          <img
            src={member.avatar}
            alt={member.name}
            className={cn(
              "w-full h-full object-cover transition-all duration-200",
              !isSelected && "grayscale"
            )}
          />
        ) : (
          <div
            className={cn(
              "w-full h-full flex items-center justify-center text-sm font-medium transition-colors duration-200",
              isSelected
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground"
            )}
          >
            {getInitials(member.name)}
          </div>
        )}
      </div>

      <AnimatePresence>
        {!isSelected && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="absolute bottom-5 right-0 w-4 h-4 rounded-full bg-foreground dark:bg-white flex items-center justify-center shadow-sm"
          >
            <Plus className="w-2.5 h-2.5 text-background dark:text-black" strokeWidth={2.5} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.span
        layoutId={`member-name-${member.id}`}
        className={cn(
          "text-xs font-medium truncate max-w-[60px] transition-colors duration-200",
          isSelected ? "text-foreground" : "text-muted-foreground"
        )}
      >
        {member.name.split(" ")[0]}
      </motion.span>
    </motion.button>
  );
}

interface AddButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

function AddButton({ onClick, isOpen }: AddButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className="group flex flex-col items-center gap-1.5 outline-none cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div
        className={cn(
          "w-12 h-12 rounded-full border-2 border-dashed flex items-center justify-center transition-all duration-200",
          "group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2",
          isOpen
            ? "border-primary bg-primary/10"
            : "border-muted-foreground/40 hover:border-muted-foreground/60 hover:bg-muted/50"
        )}
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Plus
            className={cn(
              "w-5 h-5 transition-colors duration-200",
              isOpen ? "text-primary" : "text-muted-foreground"
            )}
          />
        </motion.div>
      </div>
      <span className={cn(
        "text-xs font-medium transition-colors duration-200",
        isOpen ? "text-primary" : "text-muted-foreground"
      )}>
        Add
      </span>
    </motion.button>
  );
}

interface DropdownProps {
  members: Member[];
  selected: string[];
  onSelect: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

function Dropdown({
  members,
  selected,
  onSelect,
  searchQuery,
  onSearchChange,
}: DropdownProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filteredMembers = React.useMemo(() => {
    const query = searchQuery.toLowerCase();
    return members
      .filter(
        (m) =>
          m.name.toLowerCase().includes(query) ||
          m.email?.toLowerCase().includes(query)
      )
      .sort((a, b) => {
        const aSelected = selected.includes(a.id);
        const bSelected = selected.includes(b.id);
        if (aSelected && !bSelected) return -1;
        if (!aSelected && bSelected) return 1;
        return 0;
      });
  }, [members, selected, searchQuery]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute top-full right-0 mt-2 w-72 bg-popover border border-border rounded-xl shadow-lg overflow-hidden z-50"
    >
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search members..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-muted/50 border border-transparent rounded-lg outline-none focus:border-primary/50 focus:bg-background placeholder:text-muted-foreground transition-colors"
          />
        </div>
      </div>

      <div className="max-h-64 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/30">
        <AnimatePresence mode="popLayout">
          {filteredMembers.map((member, index) => {
            const isSelected = selected.includes(member.id);
            return (
              <motion.button
                key={member.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ delay: index * 0.02, duration: 0.15 }}
                onClick={() => onSelect(member.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors",
                  isSelected
                    ? "bg-primary/5 hover:bg-primary/10"
                    : "hover:bg-muted/50"
                )}
              >
                <div
                  className={cn(
                    "w-9 h-9 rounded-full overflow-hidden flex-shrink-0 transition-all duration-200",
                    !isSelected && "grayscale opacity-60"
                  )}
                >
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className={cn(
                        "w-full h-full flex items-center justify-center text-xs font-medium",
                        isSelected
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {getInitials(member.name)}
                    </div>
                  )}
                </div>

                <div className="flex-1 text-left min-w-0">
                  <div
                    className={cn(
                      "text-sm font-medium truncate transition-colors",
                      isSelected ? "text-foreground" : "text-foreground/80"
                    )}
                  >
                    {member.name}
                  </div>
                  {member.email && (
                    <div className="text-xs text-muted-foreground truncate">
                      {member.email}
                    </div>
                  )}
                </div>

                <div
                  className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200",
                    isSelected
                      ? "bg-primary"
                      : "border-2 border-muted-foreground/30"
                  )}
                >
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <Check className="w-3 h-3 text-primary-foreground" strokeWidth={3} />
                    </motion.div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>

        {filteredMembers.length === 0 && (
          <div className="px-3 py-8 text-center text-sm text-muted-foreground">
            No members found
          </div>
        )}
      </div>
    </motion.div>
  );
}

const MemberSelector = React.forwardRef<HTMLDivElement, MemberSelectorProps>(
  (
    {
      members,
      selected,
      onChange,
      max,
      maxVisible = 5,
      label,
      className,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
          setSearchQuery("");
        }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const sortedMembers = React.useMemo(() => {
      return [...members].sort((a, b) => {
        const aSelected = selected.includes(a.id);
        const bSelected = selected.includes(b.id);
        if (aSelected && !bSelected) return -1;
        if (!aSelected && bSelected) return 1;
        return 0;
      });
    }, [members, selected]);

    const visibleMembers = sortedMembers.slice(0, maxVisible);

    const toggleMember = (id: string) => {
      const isCurrentlySelected = selected.includes(id);

      if (isCurrentlySelected) {
        onChange(selected.filter((s) => s !== id));
      } else {
        if (max && selected.length >= max) return;
        onChange([...selected, id]);
      }
    };

    return (
      <div ref={ref} className={cn("relative", className)}>
        {label && (
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            {label}
          </div>
        )}
        <div
          ref={containerRef}
          className="flex items-start gap-4 flex-wrap"
        >
          <LayoutGroup>
            {visibleMembers.map((member) => (
              <Avatar
                key={member.id}
                member={member}
                isSelected={selected.includes(member.id)}
                onClick={() => toggleMember(member.id)}
              />
            ))}

            <div className="relative">
              <AddButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />

              <AnimatePresence>
                {isOpen && (
                  <Dropdown
                    members={members}
                    selected={selected}
                    onSelect={toggleMember}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                  />
                )}
              </AnimatePresence>
            </div>
          </LayoutGroup>
        </div>
      </div>
    );
  }
);

MemberSelector.displayName = "MemberSelector";

export { MemberSelector };
