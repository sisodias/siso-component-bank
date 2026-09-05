import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, X } from 'lucide-react';
import { cn } from "../_utils/cn";
import { Button } from "./button";

/**
 * @typedef InteractiveListItemProps
 * @property {string | number} id - A unique identifier for the item.
 * @property {React.ReactNode} icon - The icon to display for the item.
 * @property {string} title - The main title text.
 * @property {string} description - The secondary description text.
 */
export interface InteractiveListItemProps {
  id: string | number;
  icon: React.ReactNode;
  title: string;
  description: string;
}

/**
 * @typedef InteractiveListTagProps
 * @property {string | number} id - A unique identifier for the tag.
 * @property {string} label - The text content of the tag.
 * @property {string} color - The background color for the tag (CSS hsl variable).
 */
export interface InteractiveListTagProps {
  id: string | number;
  label: string;
  color: string;
}

/**
 * @typedef InteractiveListProps
 * @property {string} title - The title for the list section (e.g., "Recent").
 * @property {string} actionText - Text for the clear/action button.
 * @property {() => void} onActionClick - Callback for the clear/action button.
 * @property {InteractiveListItemProps[]} items - Array of list items to display.
 * @property {(id: string | number) => void} onRemoveItem - Callback fired when an item's remove button is clicked.
 * @property {InteractiveListTagProps[]} [tags] - Optional array of tags to display below the list.
 * @property {(id: string | number) => void} [onRemoveTag] - Callback fired when a tag's remove button is clicked.
 * @property {string} [className] - Optional additional class names for the container.
 */
export interface InteractiveListProps {
  title: string;
  actionText: string;
  onActionClick: () => void;
  items: InteractiveListItemProps[];
  onRemoveItem: (id: string | number) => void;
  tags?: InteractiveListTagProps[];
  onRemoveTag?: (id: string | number) => void;
  className?: string;
}

const animationVariants = {
  initial: { opacity: 0, y: -20, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, x: 20, scale: 0.95 },
  transition: { duration: 0.2, ease: 'easeOut' },
};

export function InteractiveList({
  title,
  actionText,
  onActionClick,
  items,
  onRemoveItem,
  tags = [],
  onRemoveTag,
  className,
}: InteractiveListProps) {
  return (
    <div className={cn('w-full', className)}>
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <Button
          variant="link"
          className="h-auto p-0 text-sm text-primary"
          onClick={onActionClick}
          aria-label={actionText}
        >
          {actionText}
        </Button>
      </div>

      {/* List Items */}
      <div className="relative flex flex-col gap-1">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={animationVariants.initial}
              animate={animationVariants.animate}
              exit={animationVariants.exit}
              transition={animationVariants.transition}
              className="group relative flex items-center gap-4 p-2 rounded-lg hover:bg-accent"
              role="listitem"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                {item.icon}
              </div>
              <div className="flex-grow">
                <p className="text-sm font-medium text-card-foreground">{item.title}</p>
                <p className="text-sm text-muted-foreground line-clamp-1">{item.description}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity"
                onClick={() => onRemoveItem(item.id)}
                aria-label={`Remove ${item.title}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Tags Section */}
      {tags.length > 0 && onRemoveTag && (
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
          <AnimatePresence>
            {tags.map((tag) => (
              <motion.div
                key={tag.id}
                layout
                initial={animationVariants.initial}
                animate={animationVariants.animate}
                exit={animationVariants.exit}
                transition={animationVariants.transition}
                className="flex items-center gap-1.5 pl-3 pr-1.5 py-1 text-xs font-medium rounded-full"
                style={{
                  backgroundColor: `hsl(${tag.color})`,
                  color: 'hsl(var(--primary-foreground))',
                }}
              >
                {tag.label}
                <button
                  onClick={() => onRemoveTag(tag.id)}
                  className="flex items-center justify-center h-4 w-4 rounded-full bg-black/20 hover:bg-black/40 transition-colors"
                  aria-label={`Remove tag ${tag.label}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}