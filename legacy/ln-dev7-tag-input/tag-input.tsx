// component.tsx
import * as React from "react";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

export type Tag = {
  id: string;
  label: string;
};

export interface TagInputProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  options: Tag[];
  value: Tag[];
  onChange: (tags: Tag[]) => void;
}

const TagInput = React.forwardRef<HTMLDivElement, TagInputProps>(
  ({ options, value, onChange, className, ...props }, ref) => {
    const selectedsContainerRef = useRef<HTMLDivElement>(null);

    const removeTag = (tagToRemove: Tag) => {
      onChange(value.filter((tag) => tag.id !== tagToRemove.id));
    };

    const addTag = (tagToAdd: Tag) => {
      onChange([...value, tagToAdd]);
    };

    useEffect(() => {
      if (selectedsContainerRef.current) {
        selectedsContainerRef.current.scrollTo({
          left: selectedsContainerRef.current.scrollWidth,
          behavior: "smooth",
        });
      }
    }, [value]);

    const unselectedTags = options.filter(
      (tag) => !value.some((selected) => selected.id === tag.id)
    );

    return (
      <div ref={ref} className={className} {...props}>
        <motion.h2 layout className="text-xl font-semibold">
          TAGS
        </motion.h2>
        <motion.div
          className="w-full flex items-center justify-start gap-1.5 bg-white border h-14 mt-2 mb-3 overflow-x-auto p-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{
            borderRadius: 16,
          }}
          ref={selectedsContainerRef}
          layout
        >
          {value.map((tag) => (
            <motion.div
              key={tag.id}
              className="flex items-center gap-1 pl-3 pr-1 py-1 bg-white shadow-md border h-full shrink-0"
              style={{
                borderRadius: 14,
              }}
              layoutId={`tag-${tag.id}`}
            >
              <motion.span
                layoutId={`tag-${tag.id}-label`}
                className="text-gray-700 font-medium"
              >
                {tag.label}
              </motion.span>
              <button
                onClick={() => removeTag(tag)}
                className="p-1 rounded-full"
              >
                <X className="size-5 text-gray-500" />
              </button>
            </motion.div>
          ))}
        </motion.div>
        {unselectedTags.length > 0 && (
          <motion.div
            className="bg-white shadow-sm p-2 border w-full"
            style={{
              borderRadius: 16,
            }}
            layout
          >
            <motion.div className="flex flex-wrap gap-2">
              {unselectedTags.map((tag) => (
                <motion.button
                  key={tag.id}
                  layoutId={`tag-${tag.id}`}
                  className="flex items-center gap-1 px-4 py-2.5 bg-gray-100/60 shrink-0"
                  onClick={() => addTag(tag)}
                  style={{
                    borderRadius: 14,
                  }}
                >
                  <motion.span
                    layoutId={`tag-${tag.id}-label`}
                    className="text-gray-700 font-medium"
                  >
                    {tag.label}
                  </motion.span>
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        )}
      </div>
    );
  }
);

TagInput.displayName = "TagInput";

export default TagInput;