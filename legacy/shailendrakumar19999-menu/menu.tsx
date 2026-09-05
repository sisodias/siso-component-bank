import { Menu } from "@ark-ui/react/menu"
import { ChevronDown } from "lucide-react"

const menuGroups = [
  {
    label: "JS Frameworks",
    items: ["React", "Solid", "Vue", "Svelte"],
  },
  {
    label: "CSS Frameworks",
    items: ["Panda", "Tailwind"],
  },
]

export const Basic = () => (
  <div className="flex justify-center mt-10">
    <Menu.Root>
      <Menu.Trigger className="flex items-center gap-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-800 dark:text-gray-200">
        Open menu <ChevronDown size={16} />
      </Menu.Trigger>

      <Menu.Positioner>
        <Menu.Content className="mt-2 w-52 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg p-2 text-sm text-gray-800 dark:text-gray-200">
          {menuGroups.map((group, gIndex) => (
            <div key={group.label}>
              <Menu.ItemGroup>
                <Menu.ItemGroupLabel className="px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  {group.label}
                </Menu.ItemGroupLabel>
                {group.items.map((item) => (
                  <Menu.Item
                    key={item}
                    value={item.toLowerCase()}
                    className="rounded-lg px-3 py-2 hover:bg-indigo-100 dark:hover:bg-indigo-600/40 hover:text-indigo-600 dark:hover:text-indigo-300 cursor-pointer"
                  >
                    {item}
                  </Menu.Item>
                ))}
              </Menu.ItemGroup>

              {gIndex < menuGroups.length - 1 && (
                <div className="my-1 h-px bg-gray-200 dark:bg-gray-700" />
              )}
            </div>
          ))}
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  </div>
)
