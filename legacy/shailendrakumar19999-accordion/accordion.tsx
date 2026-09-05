"use client"

import { Accordion } from "@ark-ui/react/accordion"
import { ChevronDownIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export const Basic = () => {
  return (
    <Accordion.Root
      defaultValue={["React"]}
      className="w-full max-w-md mx-auto bg-white shadow-lg rounded-2xl p-4"
    >
      {["React", "Solid", "Vue", "Svelte"].map((item) => (
        <Accordion.Item
          key={item}
          value={item}
          className="border-b last:border-none border-gray-200"
        >
          <Accordion.ItemTrigger className="flex items-center justify-between w-full py-3 px-4 text-lg font-medium text-gray-800 hover:bg-gray-100 rounded-xl transition-all">
            <span>What is {item}?</span>
            <Accordion.ItemIndicator>
              <ChevronDownIcon className="h-5 w-5 transition-transform data-[state=open]:rotate-180" />
            </Accordion.ItemIndicator>
          </Accordion.ItemTrigger>

          <Accordion.ItemContent>
            <AnimatePresence>
              <motion.div
                key={item}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden px-4 pb-3 text-gray-600"
              >
                {item} is a JavaScript library for building user interfaces.
              </motion.div>
            </AnimatePresence>
          </Accordion.ItemContent>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  )
}
