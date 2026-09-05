import { Button } from "./button";
import { Input } from "./input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover";
import { ScrollArea } from "./scroll-area";
import { cn } from "../_utils/cn";
import emojiData from "emoji-datasource/emoji.json";
import { Search, Smile } from "lucide-react";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

interface EmojiItem {
  unified: string;
  short_name: string;
  short_names: string[];
  category: string;
  subcategory: string;
  name: string;
  sort_order: number;
  added_in: string;
  has_img_apple: boolean;
  has_img_google: boolean;
  has_img_twitter: boolean;
  has_img_facebook: boolean;
  skin_variations?: Record<string, any>;
  obsoletes?: string;
  obsoleted_by?: string;
  non_qualified?: string;
}

const CATEGORIES = [
  {
    key: "Smileys & Emotion",
    icon: "😀",
    label: "Smileys",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    key: "People & Body",
    icon: "👋",
    label: "People",
    color: "bg-pink-100 text-pink-800",
  },
  {
    key: "Animals & Nature",
    icon: "🐶",
    label: "Nature",
    color: "bg-green-100 text-green-800",
  },
  {
    key: "Food & Drink",
    icon: "🍎",
    label: "Food",
    color: "bg-red-100 text-red-800",
  },
  {
    key: "Travel & Places",
    icon: "🚗",
    label: "Travel",
    color: "bg-blue-100 text-blue-800",
  },
  {
    key: "Activities",
    icon: "⚽",
    label: "Sports",
    color: "bg-orange-100 text-orange-800",
  },
  {
    key: "Objects",
    icon: "💡",
    label: "Objects",
    color: "bg-purple-100 text-purple-800",
  },
  {
    key: "Symbols",
    icon: "❤️",
    label: "Symbols",
    color: "bg-red-100 text-red-800",
  },
  {
    key: "Flags",
    icon: "🏁",
    label: "Flags",
    color: "bg-indigo-100 text-indigo-800",
  },
];

const SKIN_TONES = [
  { key: null, emoji: "🏻", label: "Default", color: "bg-gray-100" },
  { key: "1F3FB", emoji: "🏻", label: "Light", color: "bg-yellow-100" },
  { key: "1F3FC", emoji: "🏼", label: "Medium-Light", color: "bg-orange-100" },
  { key: "1F3FD", emoji: "🏽", label: "Medium", color: "bg-amber-100" },
  { key: "1F3FE", emoji: "🏾", label: "Medium-Dark", color: "bg-brown-100" },
  { key: "1F3FF", emoji: "🏿", label: "Dark", color: "bg-gray-800" },
];

const unicodeToEmoji = (unified: string) => {
  return unified
    .split("-")
    .map((hex) => String.fromCodePoint(parseInt(hex, 16)))
    .join("");
};

const isEmojiSupported = (emoji: EmojiItem) => {
  if (emoji.category === "Component") return false;
  if (emoji.obsoleted_by) return false;
  if (emoji.obsoletes) return false;

  const hasImage =
    emoji.has_img_apple || emoji.has_img_google || emoji.has_img_twitter;
  if (!hasImage) return false;

  const unified = emoji.unified;
  const codepoints = unified.split("-");

  if (codepoints.length > 4) return false;

  const hasVariationSelector = unified.includes("FE0F");
  if (hasVariationSelector && emoji.non_qualified) return false;

  const isFlag = emoji.category === "Flags";
  if (isFlag && codepoints.length !== 2) return false;

  const isComplexSequence = codepoints.length > 2;
  if (isComplexSequence && !isFlag) return false;

  return true;
};

const detectDeviceSupport = () => {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    // Default values for SSR
    return {
      isApple: false,
      isAndroid: false,
      isWindows: false,
      isMobile: false,
    };
  }

  const userAgent = navigator.userAgent.toLowerCase();
  const isApple = /iphone|ipad|ipod|mac/.test(userAgent);
  const isAndroid = /android/.test(userAgent);
  const isWindows = /windows/.test(userAgent);

  return {
    isApple,
    isAndroid,
    isWindows,
    isMobile: /mobile|android|iphone|ipad|ipod/.test(userAgent),
  };
};

export interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  className?: string;
  disabled?: boolean;
}

export function EmojiPicker({
  onSelect,
  className,
  disabled,
}: EmojiPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedSkinTone, setSelectedSkinTone] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [deviceSupport, setDeviceSupport] = useState(() =>
    detectDeviceSupport(),
  );
  const scrollRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Update device support on client side
    setDeviceSupport(detectDeviceSupport());
  }, []);

  const emojis = useMemo(() => {
    return (emojiData as EmojiItem[]).filter((emoji) => {
      if (!isEmojiSupported(emoji)) return false;

      const { isApple, isAndroid, isWindows } = deviceSupport;

      if (isApple && !emoji.has_img_apple) return false;
      if (isAndroid && !emoji.has_img_google) return false;
      if (isWindows && !emoji.has_img_twitter) return false;

      return true;
    });
  }, [deviceSupport]);

  const categorizedEmojis = useMemo(() => {
    const categorized: Record<string, EmojiItem[]> = {};
    CATEGORIES.forEach((cat) => {
      categorized[cat.key] = [];
    });

    emojis.forEach((emoji) => {
      if (categorized[emoji.category]) {
        categorized[emoji.category].push(emoji);
      }
    });

    return categorized;
  }, [emojis]);

  const filteredEmojis = useMemo(() => {
    if (!search) {
      return categorizedEmojis;
    }

    const searchLower = search.toLowerCase();
    const filtered: Record<string, EmojiItem[]> = {};

    Object.entries(categorizedEmojis).forEach(([category, emojiList]) => {
      const matching = emojiList.filter((emoji) => {
        const matchesName = emoji.name.toLowerCase().includes(searchLower);
        const matchesShortName = emoji.short_names.some((name) =>
          name.toLowerCase().includes(searchLower),
        );
        return matchesName || matchesShortName;
      });

      if (matching.length > 0) {
        filtered[category] = matching;
      }
    });

    return filtered;
  }, [search, categorizedEmojis]);

  const handleSelect = useCallback(
    (emoji: EmojiItem) => {
      let emojiChar = unicodeToEmoji(emoji.unified);

      if (selectedSkinTone && emoji.skin_variations?.[selectedSkinTone]) {
        const skinVariation = emoji.skin_variations[selectedSkinTone];
        emojiChar = unicodeToEmoji(skinVariation.unified);
      }

      onSelect(emojiChar);
      setOpen(false);
    },
    [onSelect, selectedSkinTone],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Open emoji picker"
          disabled={disabled}
        >
          <Smile className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        className={cn("w-80 p-0 z-50 overflow-hidden", className)}
        align="start"
        onKeyDown={handleKeyDown}
      >
        <div className="sticky top-0 bg-background border-b z-10">
          <div className="p-2 sm:p-3">
            <div className="relative">
              <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              <Input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search emoji..."
                className="pl-7 sm:pl-10 pr-6 sm:pr-8 text-xs sm:text-sm"
                aria-label="Search emoji"
              />
              {search && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearch("")}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-5 w-5 sm:h-6 sm:w-6 p-0"
                >
                  ×
                </Button>
              )}
            </div>
          </div>

          <div className="px-2 sm:px-3 pb-2">
            <div className="flex gap-1">
              {SKIN_TONES.map((tone) => (
                <Button
                  key={tone.key || "default"}
                  variant={selectedSkinTone === tone.key ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedSkinTone(tone.key)}
                  className={cn(
                    "h-6 w-6 sm:h-7 sm:w-7 p-0 text-xs sm:text-sm rounded-full transition-all",
                    selectedSkinTone === tone.key && "ring-2 ring-primary",
                  )}
                  title={tone.label}
                >
                  {tone.emoji}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <ScrollArea ref={scrollRef} className="h-64 sm:h-80">
          <div className="p-1 sm:p-2">
            {Object.entries(filteredEmojis).map(([category, emojiList]) => {
              const categoryInfo = CATEGORIES.find(
                (cat) => cat.key === category,
              );
              if (!categoryInfo || emojiList.length === 0) return null;

              return (
                <div key={category} className="mb-4 sm:mb-6">
                  <div
                    id={`category-${category}`}
                    className={cn(
                      "flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3 px-1 sm:px-2 py-1 rounded-lg transition-colors",
                      hoveredCategory === category && "bg-muted/50",
                    )}
                    onMouseEnter={() => setHoveredCategory(category)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    <span className="text-sm sm:text-lg">
                      {categoryInfo.icon}
                    </span>
                    <span className="font-medium text-xs sm:text-sm text-muted-foreground">
                      {categoryInfo.label}
                    </span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {emojiList.length}
                    </span>
                  </div>

                  <div className="grid grid-cols-8 sm:grid-cols-9 gap-0.5 sm:gap-1">
                    {emojiList.map((emoji) => (
                      <Button
                        key={emoji.unified}
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="flex items-center justify-center rounded-lg hover:bg-accent focus:bg-accent focus:outline-none text-sm sm:text-lg h-7 w-7 sm:h-8 sm:w-8 transition-colors"
                        onClick={() => handleSelect(emoji)}
                        title={emoji.name}
                        aria-label={emoji.name}
                      >
                        {unicodeToEmoji(emoji.unified)}
                      </Button>
                    ))}
                  </div>
                </div>
              );
            })}

            {Object.keys(filteredEmojis).length === 0 && (
              <div className="text-center text-muted-foreground py-8 sm:py-12">
                <Smile className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-3 opacity-50" />
                <p className="text-xs sm:text-sm">No emoji found</p>
                <p className="text-xs mt-1">Try a different search term</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
