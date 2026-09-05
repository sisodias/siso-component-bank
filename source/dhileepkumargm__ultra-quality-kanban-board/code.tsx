"use client";

import React, { useState, useEffect, DragEvent, FC } from "react";
import { PlusSquare, Trash2, Edit2 } from "lucide-react";

interface Task {
  id: string;
  content: string;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

const STORAGE_KEY = "ultra-quality-kanban";

export const UltraQualityKanbanBoard: FC = () => {
  const [columns, setColumns] = useState<Column[]>([]);

  // load/save from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setColumns(JSON.parse(saved));
    else {
      setColumns([
        { id: "col-1", title: "Backlog", tasks: [] },
        { id: "col-2", title: "In Progress", tasks: [] },
        { id: "col-3", title: "Done", tasks: [] },
      ]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(columns));
  }, [columns]);

  // add a new column
  const addColumn = () => {
    const id = Date.now().toString();
    setColumns(cols => [...cols, { id, title: "New Column", tasks: [] }]);
  };

  // remove column
  const removeColumn = (colId: string) => {
    setColumns(cols => cols.filter(c => c.id !== colId));
  };

  // rename column
  const renameColumn = (colId: string) => {
    const name = window.prompt("New column title");
    if (!name) return;
    setColumns(cols =>
      cols.map(c => (c.id === colId ? { ...c, title: name } : c))
    );
  };

  // add task to column
  const addTask = (colId: string) => {
    const content = window.prompt("Task description");
    if (!content) return;
    const id = Date.now().toString();
    setColumns(cols =>
      cols.map(c =>
        c.id === colId
          ? { ...c, tasks: [...c.tasks, { id, content }] }
          : c
      )
    );
  };

  // remove task
  const removeTask = (colId: string, taskId: string) => {
    setColumns(cols =>
      cols.map(c =>
        c.id === colId
          ? { ...c, tasks: c.tasks.filter(t => t.id !== taskId) }
          : c
      )
    );
  };

  // drag state
  const [draggingTask, setDraggingTask] = useState<{
    colId: string;
    taskId: string;
  } | null>(null);

  const onDragStart = (
    e: DragEvent<HTMLDivElement>,
    colId: string,
    taskId: string
  ) => {
    setDraggingTask({ colId, taskId });
    e.dataTransfer.effectAllowed = "move";
  };

  const onDrop = (e: DragEvent<HTMLDivElement>, destColId: string) => {
    e.preventDefault();
    if (!draggingTask) return;
    const { colId: srcColId, taskId } = draggingTask;
    if (srcColId === destColId) return;
    let movedTask: Task | null = null;
    const next = columns.map(c => {
      if (c.id === srcColId) {
        const filtered = c.tasks.filter(t => {
          if (t.id === taskId) {
            movedTask = t;
            return false;
          }
          return true;
        });
        return { ...c, tasks: filtered };
      }
      return c;
    }).map(c => {
      if (c.id === destColId && movedTask) {
        return { ...c, tasks: [...c.tasks, movedTask!] };
      }
      return c;
    });
    setColumns(next);
    setDraggingTask(null);
  };

  const onDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex space-x-4 overflow-x-auto p-4 h-full">
      {columns.map(col => (
        <div
          key={col.id}
          className="flex-shrink-0 w-72 bg-gray-100 dark:bg-gray-800 rounded-lg shadow p-3 flex flex-col"
          onDrop={e => onDrop(e, col.id)}
          onDragOver={onDragOver}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-700 dark:text-gray-200">
              {col.title}
            </h3>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => renameColumn(col.id)}
                className="p-1 hover:text-indigo-600"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => removeColumn(col.id)}
                className="p-1 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="space-y-2 flex-1 overflow-y-auto">
            {col.tasks.map(task => (
              <div
                key={task.id}
                draggable
                onDragStart={e => onDragStart(e, col.id, task.id)}
                className="p-2 bg-white dark:bg-gray-700 rounded shadow cursor-grab flex justify-between items-center"
              >
                <span className="text-sm text-gray-800 dark:text-gray-100">
                  {task.content}
                </span>
                <button
                  onClick={() => removeTask(col.id, task.id)}
                  className="p-1 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={() => addTask(col.id)}
            className="mt-2 inline-flex items-center gap-1 text-indigo-600 hover:underline"
          >
            <PlusSquare className="h-5 w-5" />
            Add Task
          </button>
        </div>
      ))}

      <div className="flex-shrink-0 w-72 flex items-center justify-center">
        <button
          onClick={addColumn}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <PlusSquare className="h-5 w-5" />
          New Column
        </button>
      </div>
    </div>
  );
};
