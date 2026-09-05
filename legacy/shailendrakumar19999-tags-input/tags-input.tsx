"use client"

import { TagsInput } from "@ark-ui/react/tags-input"

export const Basic = () => {
  return (
    <div className="w-full max-w-md mx-auto p-4">
      <TagsInput.Root className="flex flex-col gap-3">
        <TagsInput.Context>
          {(tagsInput) => (
            <>
              <TagsInput.Label className="text-sm font-medium text-gray-800 dark:text-gray-200">
                Enter Tags
              </TagsInput.Label>

              <TagsInput.Control
                className="flex flex-wrap gap-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-2 focus-within:ring-2 focus-within:ring-blue-500 transition"
              >
                {tagsInput.value.map((value, index) => (
                  <TagsInput.Item
                    key={index}
                    index={index}
                    value={value}
                    className="flex items-center gap-1 rounded-xl bg-gray-100 dark:bg-gray-800 px-2 py-1 text-sm text-gray-900 dark:text-gray-100 shadow-sm"
                  >
                    <TagsInput.ItemPreview className="flex items-center gap-1">
                      <TagsInput.ItemText>{value}</TagsInput.ItemText>
                      <TagsInput.ItemDeleteTrigger className="ml-1 text-xs px-1 rounded hover:bg-red-500 hover:text-white transition">
                        ✕
                      </TagsInput.ItemDeleteTrigger>
                    </TagsInput.ItemPreview>
                    <TagsInput.ItemInput className="outline-none bg-transparent text-sm" />
                  </TagsInput.Item>
                ))}

                <TagsInput.Input
                  placeholder="Add Tags and press enter"
                  className="flex-1 min-w-[100px] bg-transparent outline-none text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                />
              </TagsInput.Control>

              <TagsInput.ClearTrigger
                className="self-start mt-2 text-sm text-red-600 dark:text-red-400 hover:underline cursor-pointer"
              >
                Clear all
              </TagsInput.ClearTrigger>
            </>
          )}
        </TagsInput.Context>

        <TagsInput.HiddenInput />
      </TagsInput.Root>
    </div>
  )
}
