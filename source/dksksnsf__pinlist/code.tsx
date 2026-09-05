import { useState } from "react";
import { Pin, PinOff, GripVertical, Trash2 } from "lucide-react";

export interface PinItem {
  id: string;
  label: string;
  pinned: boolean;
}

interface PinListProps {
  items: PinItem[];
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onReorder?: (items: PinItem[]) => void;
}

export default function PinList({ items, onToggle, onRemove, onReorder }: PinListProps) {
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const pinned = items.filter((i) => i.pinned);
  const unpinned = items.filter((i) => !i.pinned);

  const handleDragStart = (idx: number) => {
    setDragIdx(idx);
  };

  const handleDrop = (targetIdx: number) => {
    if (dragIdx === null || !onReorder) return;
    const reordered = [...items];
    const [moved] = reordered.splice(dragIdx, 1);
    reordered.splice(targetIdx, 0, moved);
    onReorder(reordered);
    setDragIdx(null);
  };

  const renderItem = (item: PinItem, idx: number) => (
    <li
      key={item.id}
      draggable={!!onReorder}
      onDragStart={() => handleDragStart(idx)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => handleDrop(idx)}
      className="group flex items-center gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3 shadow-sm transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
    >
      {onReorder && (
        <GripVertical className="h-4 w-4 cursor-grab text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100" />
      )}
      <span className="flex-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">
        {item.label}
      </span>
      <button
        onClick={() => onToggle(item.id)}
        className="rounded p-1 text-zinc-400 transition-colors hover:text-amber-500"
        title={item.pinned ? "Unpin" : "Pin"}
      >
        {item.pinned ? (
          <PinOff className="h-4 w-4 fill-amber-400 text-amber-500" />
        ) : (
          <Pin className="h-4 w-4" />
        )}
      </button>
      <button
        onClick={() => onRemove(item.id)}
        className="rounded p-1 text-zinc-400 transition-colors hover:text-red-500"
        title="Remove"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </li>
  );

  return (
    <div className="w-full max-w-lg space-y-4">
      {pinned.length > 0 && (
        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Pinned
          </h3>
          <ul className="space-y-2">
            {pinned.map((item, i) => renderItem(item, items.indexOf(item)))}
          </ul>
        </section>
      )}
      {unpinned.length > 0 && (
        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            All Items
          </h3>
          <ul className="space-y-2">
            {unpinned.map((item, i) => renderItem(item, items.indexOf(item)))}
          </ul>
        </section>
      )}
    </div>
  );
}
