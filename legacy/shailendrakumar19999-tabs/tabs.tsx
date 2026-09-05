import { Tabs } from "@ark-ui/react/tabs"

const tabs = [
  { value: "react", label: "React", content: "🚀 React makes UI interactive and fast." },
  { value: "vue", label: "Vue", content: "🟢 Vue is approachable and versatile." },
  { value: "solid", label: "Solid", content: "⚡ Solid is reactive and lightweight." },
  { value: "svelte", label: "Svelte", content: "🔥 Svelte compiles away the framework." },
]

export const BasicTab = () => (
  <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-md">
    <Tabs.Root defaultValue="react" className="flex flex-col">
      
      {/* Tab List */}
      <Tabs.List className="flex border-b border-gray-200 dark:border-gray-700">
        {tabs.map(({ value, label }) => (
          <Tabs.Trigger
            key={value}
            value={value}
            className="px-4 py-2 text-sm font-medium transition-colors
                       text-gray-600 dark:text-gray-400
                       data-[selected]:text-blue-600 dark:data-[selected]:text-blue-400
                       data-[selected]:border-b-2 data-[selected]:border-blue-500
                       hover:text-gray-800 dark:hover:text-gray-200"
          >
            {label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      {/* Tab Content */}
      <div className="p-4 mt-4 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
        {tabs.map(({ value, content }) => (
          <Tabs.Content key={value} value={value}>
            {content}
          </Tabs.Content>
        ))}
      </div>
    </Tabs.Root>
  </div>
)
