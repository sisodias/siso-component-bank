import { AnimatePresence, useAnimate, usePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import { FiClock, FiPlus, FiTrash2 } from "react-icons/fi";
import { motion } from "framer-motion";

export const VanishList = () => {
  const [todos, setTodos] = useState([
    {
      id: 1,
      text: "Take out trash",
      checked: false,
      time: "5 mins",
    },
    {
      id: 2,
      text: "Do laundry",
      checked: false,
      time: "10 mins",
    },
    {
      id: 3,
      text: "Have existential crisis",
      checked: true,
      time: "12 hrs",
    },
    {
      id: 4,
      text: "Get dog food",
      checked: false,
      time: "1 hrs",
    },
  ]);

  const handleCheck = (id) => {
    setTodos((pv) =>
      pv.map((t) => (t.id === id ? { ...t, checked: !t.checked } : t))
    );
  };

  const removeElement = (id) => {
    setTodos((pv) => pv.filter((t) => t.id !== id));
  };

  return (
    <section
      className="min-h-screen w-full bg-background py-24"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke-width='2' stroke='hsl(var(--border))'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
      }}
    >
      <div className="mx-auto w-full max-w-xl px-4">
        <Header />
        <Todos
          removeElement={removeElement}
          todos={todos}
          handleCheck={handleCheck}
        />
      </div>
      <Form setTodos={setTodos} />
    </section>
  );
};

const Header = () => {
  return (
    <div className="mb-6">
      <h1 className="text-xl font-medium text-foreground">Good morning! ☀️</h1>
      <p className="text-muted-foreground">Let's see what we've got to do today.</p>
    </div>
  );
};

const Form = ({ setTodos }) => {
  const [visible, setVisible] = useState(false);

  const [time, setTime] = useState(15);
  const [text, setText] = useState("");
  const [unit, setUnit] = useState("mins");

  const handleSubmit = () => {
    if (!text.length) {
      return;
    }

    setTodos((pv) => [
      {
        id: Math.random(),
        text,
        checked: false,
        time: `${time} ${unit}`,
      },
      ...pv,
    ]);

    setTime(15);
    setText("");
    setUnit("mins");
  };

  return (
    <div className="fixed bottom-6 left-1/2 w-full max-w-xl -translate-x-1/2 px-4">
      <AnimatePresence>
        {visible && (
          <motion.form
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 25 }}
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="mb-6 w-full rounded border border-border bg-card p-3"
          >
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What do you need to do?"
              className="h-24 w-full resize-none rounded bg-card p-3 text-sm text-card-foreground placeholder-muted-foreground caret-foreground focus:outline-0"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  className="w-24 rounded bg-muted px-1.5 py-1 text-sm text-foreground focus:outline-0"
                  value={time}
                  onChange={(e) => setTime(parseInt(e.target.value))}
                />
                <button
                  type="button"
                  onClick={() => setUnit("mins")}
                  className={`rounded px-1.5 py-1 text-xs ${unit === "mins" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground transition-colors hover:bg-secondary/80"}`}
                >
                  mins
                </button>
                <button
                  type="button"
                  onClick={() => setUnit("hrs")}
                  className={`rounded px-1.5 py-1 text-xs ${unit === "hrs" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground transition-colors hover:bg-secondary/80"}`}
                >
                  hrs
                </button>
              </div>
              <button
                type="submit"
                className="rounded bg-primary px-1.5 py-1 text-xs text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Submit
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
      <button
        onClick={() => setVisible((pv) => !pv)}
        className="grid w-full place-content-center rounded-full border border-border bg-card py-3 text-lg text-card-foreground transition-colors hover:bg-accent hover:text-accent-foreground active:bg-card"
      >
        <FiPlus
          className={`transition-transform ${visible ? "rotate-45" : "rotate-0"}`}
        />
      </button>
    </div>
  );
};

const Todos = ({ todos, handleCheck, removeElement }) => {
  return (
    <div className="w-full space-y-3">
      <AnimatePresence>
        {todos.map((t) => (
          <Todo
            handleCheck={handleCheck}
            removeElement={removeElement}
            id={t.id}
            key={t.id}
            checked={t.checked}
            time={t.time}
          >
            {t.text}
          </Todo>
        ))}
      </AnimatePresence>
    </div>
  );
};

const Todo = ({ removeElement, handleCheck, id, children, checked, time }) => {
  const [isPresent, safeToRemove] = usePresence();
  const [scope, animate] = useAnimate();

  useEffect(() => {
    if (!isPresent) {
      const exitAnimation = async () => {
        animate(
          "p",
          {
            color: checked ? "hsl(var(--success))" : "hsl(var(--destructive))",
          },
          {
            ease: "easeIn",
            duration: 0.125,
          }
        );
        await animate(
          scope.current,
          {
            scale: 1.025,
          },
          {
            ease: "easeIn",
            duration: 0.125,
          }
        );

        await animate(
          scope.current,
          {
            opacity: 0,
            x: checked ? 24 : -24,
          },
          {
            delay: 0.75,
          }
        );
        safeToRemove();
      };

      exitAnimation();
    }
  }, [isPresent]);

  return (
    <motion.div
      ref={scope}
      layout
      className="relative flex w-full items-center gap-3 rounded border border-border bg-card p-3"
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={() => handleCheck(id)}
        className="size-4 accent-primary"
      />

      <p
        className={`text-card-foreground transition-colors ${checked && "text-muted-foreground"}`}
      >
        {children}
      </p>
      <div className="ml-auto flex gap-1.5">
        <div className="flex items-center gap-1.5 whitespace-nowrap rounded bg-secondary px-1.5 py-1 text-xs text-secondary-foreground">
          <FiClock />
          <span>{time}</span>
        </div>
        <button
          onClick={() => removeElement(id)}
          className="rounded bg-destructive/20 px-1.5 py-1 text-xs text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground"
        >
          <FiTrash2 />
        </button>
      </div>
    </motion.div>
  );
};