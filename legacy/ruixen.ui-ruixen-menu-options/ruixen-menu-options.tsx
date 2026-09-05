import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { ChevronDown } from "lucide-react";

export default function RuixenMenuOptions() {
  return (
    <div className="flex justify-center items-center h-screen">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" className="flex items-center gap-2">
            ⚙️ Actions Panel
            <ChevronDown className="opacity-60" size={16} strokeWidth={2} />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56 rounded-xl shadow-lg">
          {/* Quick Edits */}
          <DropdownMenuGroup>
            <DropdownMenuItem title="Make changes to the current item">
              ✏️ Rename
              <DropdownMenuShortcut>⌘ R</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem title="Create a copy">
              🧬 Clone
              <DropdownMenuShortcut>⌘ C</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {/* Organize */}
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>🗂 Move</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>📁 To Folder</DropdownMenuItem>
                <DropdownMenuItem>📌 To Project</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuItem title="Add to your favorites list">
              ⭐ Pin Item
            </DropdownMenuItem>
            <DropdownMenuItem title="Collaborate with others">
              🤝 Share
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {/* Settings */}
          <DropdownMenuGroup>
            <DropdownMenuItem>🔧 Settings</DropdownMenuItem>
            <DropdownMenuItem>📜 View Logs</DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {/* Destructive */}
          <DropdownMenuItem
            className="text-red-600 focus:text-red-700"
            title="Permanently remove this item"
          >
            🗑 Delete Forever
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
