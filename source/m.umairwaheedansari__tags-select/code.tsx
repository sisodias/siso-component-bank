"use client"

import { useState } from "react"
import { CircleX, Plus } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

interface AnimatedTagsProps {
  initialTags?: string[]
  selectedTags?: string[]
  onChange?: (selected: string[]) => void
  className?: string
}

export default function AnimatedTagsDemo() {
  const initialTags = ["react", "tailwindcss", "javascript", "typescript", "nextjs"]
  const [selected, setSelected] = useState<string[]>([])

  const AnimatedTags = ({
    initialTags = ["react", "tailwindcss", "javascript"],
    selectedTags: controlledSelectedTags,
    onChange,
    className = "",
  }: AnimatedTagsProps) => {
    const [internalSelected, setInternalSelected] = useState<string[]>([])
    const selectedTag = controlledSelectedTags ?? internalSelected
    const tags = initialTags.filter((tag) => !selectedTag.includes(tag))

    const handleTagClick = (tag: string) => {
      const newSelected = [...selectedTag, tag]
      if (onChange) onChange(newSelected)
      else setInternalSelected(newSelected)
    }

    const handleDeleteTag = (tag: string) => {
      const newSelectedTag = selectedTag.filter((selected) => selected !== tag)
      if (onChange) onChange(newSelectedTag)
      else setInternalSelected(newSelectedTag)
    }

    return (
      <div
        className={`flex w-[300px] flex-col gap-4 p-4 bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 ${className}`}
      >
        <div className="flex flex-col items-start justify-center gap-1">
          <p className="font-medium">Selected Tags</p>
          <AnimatePresence>
            <div className="bg-gray-100 dark:bg-gray-800 flex min-h-12 w-full flex-wrap items-center gap-1 rounded-xl border border-gray-300 dark:border-gray-700 p-2">
              {selectedTag?.map((tag) => (
                <motion.div
                  key={tag}
                  layout
                  className="group bg-blue-600 text-white dark:bg-blue-500 dark:text-gray-50 flex cursor-pointer items-center gap-2 rounded-md px-2 py-1"
                  onClick={() => handleDeleteTag(tag)}
                  initial={{ y: 20, opacity: 0, filter: "blur(4px)" }}
                  animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                  exit={{ y: 20, opacity: 0, filter: "blur(4px)" }}
                  transition={{ duration: 0.3, bounce: 0, type: "spring" }}
                >
                  {tag}
                  <CircleX size={16} className="transition-all duration-300" />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </div>

        <AnimatePresence>
          <div className="flex flex-wrap items-center gap-1">
            {tags.map((tag, index) => (
              <motion.div
                layout
                key={index}
                className="group bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 flex cursor-pointer items-center gap-2 rounded-md px-2 py-1"
                onClick={() => handleTagClick(tag)}
                initial={{ y: -20, opacity: 0, filter: "blur(4px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                exit={{ y: -20, opacity: 0, filter: "blur(4px)" }}
                transition={{ duration: 0.3, bounce: 0, type: "spring" }}
              >
                {tag}
                <Plus size={16} className="transition-all duration-300" />
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </div>
    )
  }

  return <AnimatedTags initialTags={initialTags} selectedTags={selected} onChange={setSelected} />
}
