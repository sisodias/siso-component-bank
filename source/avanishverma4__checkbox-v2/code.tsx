
import React, { useState, useEffect } from 'react';
import { motion, MotionConfig, Transition } from "framer-motion";

// --- Types & Constants ---

export interface Todo {
  id: number;
  title: string;
  checked: boolean;
}

const baseT: Transition = {
  type: "spring",
  damping: 25,
  stiffness: 300,
  mass: 0.8,
};

const checkT: Transition = {
  type: "spring",
  damping: 20,
  stiffness: 400,
};

const baseDelay = 0.15;

const INITIAL_TODOS: Todo[] = [
  { id: 0, title: "Fix bugs caused by Vibe Coding", checked: true },
  { id: 1, title: "Fix more bugs", checked: false },
  { id: 2, title: "Vibe code more bugs", checked: false },
  { id: 3, title: "Again fix bugs", checked: false },
];

// --- Sub-components ---

function CheckboxSVG({ todo }: { todo: Todo }) {
  return (
    <svg
      aria-hidden="true"
      width="28"
      height="28"
      viewBox="0 0 26 26"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6 shrink-0"
    >
      {/* Background Fill Layer */}
      <motion.path
        animate={{
          opacity: todo.checked ? 1 : 0,
          scale: todo.checked ? 1 : 0.8,
        }}
        transition={checkT}
        d="M1 13C1 7.34315 1 4.51472 2.75736 2.75736C4.51472 1 7.34315 1 13 1C18.6569 1 21.4853 1 23.2426 2.75736C25 4.51472 25 7.34315 25 13C25 18.6569 25 21.4853 23.2426 23.2426C21.4853 25 18.6569 25 13 25C7.34315 25 4.51472 25 2.75736 23.2426C1 21.4853 1 18.6569 1 13Z"
        fill="#027BFF"
      />
      
      {/* Checkmark Path */}
      <motion.path
        initial={false}
        animate={{
          pathLength: todo.checked ? 1 : 0,
          opacity: todo.checked ? 1 : 0,
        }}
        transition={{
          ...checkT,
          delay: todo.checked ? baseDelay : 0,
        }}
        d="M6.5 13.5L10.5 17.5L19.5 8.5"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Outline Border */}
      <motion.path
        strokeWidth={2}
        animate={{
          pathLength: todo.checked ? 0.9 : 1,
          stroke: todo.checked ? "#027BFF00" : "currentColor",
          opacity: todo.checked ? 0 : 0.4,
          rotate: todo.checked ? 90 : 0
        }}
        className="text-muted-foreground"
        style={{ originX: "13px", originY: "13px" }}
        d="M22.8891 22.889C22.1189 23.6593 21.0955 24.0726 19.517 24.2848C17.9242 24.4989 15.8426 24.5 13 24.5C10.1574 24.5 8.07582 24.4989 6.483 24.2848C4.90456 24.0726 3.88121 23.6594 3.11092 22.889C2.34063 22.1188 1.92743 21.0955 1.71521 19.517C1.50106 17.9242 1.5 15.8426 1.5 13C1.5 10.1574 1.50106 8.07582 1.71521 6.483C1.92743 4.90456 2.34062 3.88121 3.11091 3.11091C3.88121 2.34062 4.90456 1.92743 6.483 1.71521C8.07582 1.50106 10.1574 1.5 13 1.5C15.8426 1.5 17.9242 1.50106 19.517 1.71521C21.0955 1.92743 22.1188 2.34062 22.889 3.11091C23.6594 3.8812 24.0726 4.90456 24.2848 6.483C24.4989 8.07582 24.5 10.1574 24.5 13C24.5 15.8426 24.4989 17.9242 24.2848 19.517C24.0726 21.0955 23.6594 22.1188 22.8891 22.889Z"
      />
    </svg>
  );
}

interface CoolCheckboxProps {
  todos: Todo[];
  onToggle: (id: number) => void;
}

function CoolCheckbox({ todos, onToggle }: CoolCheckboxProps) {
  return (
    <MotionConfig transition={baseT}>
      <div className="flex items-center justify-center p-4">
        <ul className="flex flex-col gap-1 font-medium w-full">
          {todos.map((todo) => (
            <li key={todo.id}>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => onToggle(todo.id)}
                className="flex w-full cursor-pointer items-center gap-4 rounded-xl p-3 hover:bg-accent transition-colors text-left group"
                role="checkbox"
                aria-checked={todo.checked}
                aria-label={`${todo.title}, ${todo.checked ? "checked" : "not checked"}`}
              >
                <CheckboxSVG todo={todo} />

                <motion.p
                  animate={{
                    x: todo.checked ? 4 : 0,
                    opacity: todo.checked ? 0.5 : 1,
                  }}
                  className="relative line-clamp-1 flex-1 overflow-hidden select-none py-1"
                >
                  {todo.title}
                  <motion.span
                    initial={false}
                    animate={{ 
                      scaleX: todo.checked ? 1 : 0,
                      opacity: todo.checked ? 1 : 0 
                    }}
                    transition={{
                      ...baseT,
                      delay: todo.checked ? baseDelay * 1.5 : 0,
                    }}
                    style={{ originX: 0 }}
                    className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2.5px] bg-muted-foreground rounded-full"
                  />
                </motion.p>
              </motion.button>
            </li>
          ))}
        </ul>
      </div>
    </MotionConfig>
  );
}

// --- Main App ---

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(INITIAL_TODOS);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleToggle = (id: number) => {
    setTodos(prev => 
      prev.map(todo => todo.id === id ? { ...todo, checked: !todo.checked } : todo)
    );
  };

  return (
    <div className="w-full min-h-screen bg-background text-foreground flex flex-col items-center py-12 px-4 transition-colors duration-300">
      <div className="max-w-3xl w-full space-y-8">
        <header className="flex flex-col items-center space-y-4 relative">
          <button
            onClick={() => setIsDark(!isDark)}
            className="absolute right-0 top-0 p-2 rounded-full hover:bg-muted transition-colors border border-border"
            aria-label="Toggle Dark Mode"
          >
            {isDark ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-700">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
            )}
          </button>
          
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-center">
            Animated To-Do List
          </h1>
          <p className="text-lg text-muted-foreground text-center max-w-lg">
            A premium integration of the CoolCheckbox component into a single-file, shadcn/ui inspired architecture.
          </p>
        </header>

        <section className="bg-card text-card-foreground rounded-2xl shadow-xl border border-border overflow-hidden transition-all duration-300">
          <div className="p-6 border-b border-border bg-muted/20">
            <h2 className="text-xl font-semibold">Demo Task List</h2>
            <p className="text-sm text-muted-foreground">Click the items to experience the fluid micro-interactions.</p>
          </div>
          
          <div className="bg-background/50 flex min-h-[400px] items-center justify-center py-8 px-4 w-full">
            <div className="w-full max-w-md bg-card rounded-xl shadow-sm border border-border p-4">
              <CoolCheckbox todos={todos} onToggle={handleToggle} />
            </div>
          </div>
        </section>

        <footer className="text-center text-sm text-muted-foreground pt-8">
          Crafted with Framer Motion and Tailwind CSS.
        </footer>
      </div>
    </div>
  );
};

export default App;