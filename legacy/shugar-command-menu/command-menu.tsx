import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Modal } from "./modal";

const CommandMenuContext = createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
  inputValue: string;
  onChangeInputValue: (value: string) => void;
} | null>(null);

interface CommandMenuRootProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  children: React.ReactNode;
}

const CommandMenuRoot = ({ open, setOpen, children }: CommandMenuRootProps) => {
  const [inputValue, setInputValue] = useState<string>("");

  return (
    <Modal.Modal active={open} onClickOutside={() => setOpen(false)}>
      <Modal.Body className="!p-0">
        <CommandMenuContext value={{
          open,
          setOpen,
          inputValue,
          onChangeInputValue: (value: string) => setInputValue(value)
        }}>
          {children}
        </CommandMenuContext>
      </Modal.Body>
    </Modal.Modal>
  );
};

interface CommandMenuInputProps {
  placeholder?: string;
}

const CommandMenuInput = ({ placeholder }: CommandMenuInputProps) => {
  const context = useContext(CommandMenuContext);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (context?.open) {
      ref.current?.focus();
    }
  }, [context?.open]);

  return (
    <div
      className="py-3 px-4 border-b border-gray-alpha-400 bg-background-100 flex items-center justify-between gap-3"
      onClick={() => ref?.current?.focus()}
    >
      <input
        ref={ref}
        placeholder={placeholder}
        value={context?.inputValue}
        onChange={(e) => context?.onChangeInputValue(e.target.value)}
        className="h-7 text-lg text-sans bg-transparent text-gray-1000 placeholder:text-gray-900 placeholder:opacity-70 border-none outline-0"
      />
      <button
        className="h-5 shadow-border rounded bg-background-100 text-xs border-none px-1 ml-auto hover:bg-gray-100 duration-200"
        onClick={() => context?.setOpen(false)}
      >
        Esc
      </button>
    </div>
  );
};

interface CommandMenuListProps {
  children: React.ReactNode;
}

const CommandMenuList = ({ children }: CommandMenuListProps) => {
  const context = useContext(CommandMenuContext);

  const filteredChildren = React.Children.toArray(children)
    .map((child) => {
      if (React.isValidElement<CommandMenuItemProps>(child) && child.type === CommandMenu.Item) {
        const text = child.props.children?.toString().toLowerCase() || "";
        return text.includes(context?.inputValue?.toLowerCase() || "") ? child : null;
      }

      if (React.isValidElement<CommandMenuGroupProps>(child) && child.type === CommandMenu.Group) {
        const groupChildren = React.Children.toArray(child.props.children);
        const filteredGroupChildren = groupChildren.filter((item) => {
          if (React.isValidElement<CommandMenuItemProps>(item) && item.type === CommandMenu.Item) {
            const text = item.props.children?.toString().toLowerCase() || "";
            return text.includes(context?.inputValue?.toLowerCase() || "");
          }
          return false;
        });

        if (filteredGroupChildren.length > 0) {
          return React.cloneElement(child, {
            children: filteredGroupChildren
          });
        }
      }

      return null;
    })
    .filter(Boolean);

  return (
    <div className="p-2 bg-background-100 overflow-y-auto duration-100">
      {filteredChildren.length > 0 ? filteredChildren : (
        <div className="py-[30px]">
          <p className="text-gray-900 text-sm text-center">
            No results found for <span className="text-gray-1000">"{context?.inputValue}"</span>.
          </p>
        </div>
      )}
    </div>
  );
};

interface CommandMenuItemProps {
  callback?: () => void;
  children: React.ReactNode;
}

const CommandMenuItem = ({ callback, children }: CommandMenuItemProps) => {
  const context = useContext(CommandMenuContext);

  const onClick = () => {
    context?.setOpen(false);
    if (callback) {
      callback();
    }
  };

  return (
    <div
      className="min-h-10 rounded-md flex items-center gap-3 px-2 text-sm font-sans cursor-pointer hover:bg-gray-alpha-100"
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface CommandMenuGroupProps {
  heading: string;
  children: React.ReactNode;
}

const CommandMenuGroup = ({ heading, children }: CommandMenuGroupProps) => {
  return (
    <div>
      <div className="text-[13px] font-sans text-gray-900 h-10 flex items-center px-2">{heading}</div>
      {children}
    </div>
  );
};

export const CommandMenu = {
  Root: CommandMenuRoot,
  Input: CommandMenuInput,
  List: CommandMenuList,
  Item: CommandMenuItem,
  Group: CommandMenuGroup
};