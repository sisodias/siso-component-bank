import React, { useEffect, useLayoutEffect, useRef } from "react";
import { Button, ButtonProps } from "./button-1";
import clsx from "clsx";
import { Drawer } from "./drawer";
import { Material } from "./material-1";
import useBreakpoints from "./use-breakpoints";

interface ModalProps {
  active: boolean;
  onClickOutside: () => void;
  children: React.ReactNode;
  sticky?: boolean;
  initialFocusRef?: React.RefObject<HTMLButtonElement> | React.RefObject<null>;
}

interface ModalBodyProps {
  children: React.ReactNode;
  sticky?: boolean;
  className?: string;
}

interface ModalHeaderProps {
  children: React.ReactNode;
  sticky?: boolean;
}

const ModalModal = ({ active, onClickOutside, children, sticky, initialFocusRef }: ModalProps) => {
  const focusRef = useRef<HTMLButtonElement | null>(null);
  const { isMobile, isDesktop } = useBreakpoints();

  useLayoutEffect(() => {
    if (active) {
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus();
      } else {
        if (focusRef.current) {
          focusRef.current.focus();
        }
      }
    }
  }, [active, initialFocusRef?.current]);

  useEffect(() => {
    if (!active) {
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClickOutside();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [active, onClickOutside]);

  const childrenArray = React.Children.toArray(children);

  const footer = childrenArray.find(
    (child) =>
      React.isValidElement(child) &&
      child.type === ModalActions
  );

  const enhancedFooter = React.isValidElement<{ children: React.ReactNode }>(footer)
    ? React.cloneElement(footer, {
      children: React.Children.map(footer.props.children, (child, index) => {
        if (index === 0 && React.isValidElement<ButtonProps>(child)) {
          return React.cloneElement(child, {
            ref: focusRef
          });
        }
        return child;
      })
    })
    : null;

  return (
    <>
      {isMobile && (
        <Drawer onDismiss={onClickOutside} show={active}>
          {React.Children.map(children, (child) =>
            (child as React.ReactElement)?.type === Modal.Body
              ? React.cloneElement(child as React.ReactElement<ModalBodyProps>, { sticky })
              : child
          )}
        </Drawer>
      )}
      {isDesktop && (
        <div
          className={clsx(
            "fixed inset-0 flex items-center justify-center z-[99999] duration-300",
            active ? "bg-background-200-alpha-800" : "bg-transparent pointer-events-none"
          )}
          onClick={onClickOutside}
        >
          <Material
            type="modal"
            className={clsx(
              "flex flex-col font-sans text-gray-1000 w-[540px] max-h-[min(800px,_80vh)] overflow-y-auto duration-300",
              active ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {React.Children.map(children, (child) =>
              (child as React.ReactElement)?.type === Modal.Body
                ? React.cloneElement(child as React.ReactElement<ModalBodyProps>, { sticky })
                : ((child as React.ReactElement)?.type === ModalActions && !initialFocusRef) ? enhancedFooter : child
            )}
          </Material>
        </div>
      )}
    </>
  );
};

const ModalBody = ({ children, sticky, className }: ModalBodyProps) => (
  <div className={clsx("overflow-y-auto text-sm", sticky ? "px-6 pb-6" : "p-6", className)}>
    {React.Children.map(children, (child) =>
      (child as React.ReactElement)?.type === Modal.Header
        ? React.cloneElement(child as React.ReactElement<ModalHeaderProps>, { sticky })
        : child
    )}
  </div>
);
const ModalHeader = ({ children, sticky }: ModalHeaderProps) => (
  <header className={clsx(
    "mb-6 rounded-t-xl", sticky && "sticky top-0 bg-background-200 border-b border-gray-alpha-400 pt-5 px-6 -mx-6"
  )}>
    {children}
  </header>
);
const ModalInset = ({ children }: { children: React.ReactNode }) => (
  <div className="-mx-6 p-6 border-b border-t border-accents-2 bg-accents-1">{children}</div>
);
const ModalTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mb-6 text-2xl font-semibold tracking-[-0.029375rem]">{children}</h2>
);
const ModalSubtitle = ({ children }: { children: React.ReactNode }) => (
  <p className="text-base">{children}</p>
);
const ModalActions = ({ children }: { children: React.ReactNode }) => (
  <footer className="sticky bottom-0 p-4 flex justify-between shrink-0 bg-background-200 inset-0 border-t border-gray-alpha-400 rounded-b-xl">
    {children}
  </footer>
);
const ModalAction = (props: ButtonProps) => <Button {...props}>{props.children}</Button>;

export const Modal = {
  Modal: ModalModal,
  Header: ModalHeader,
  Inset: ModalInset,
  Body: ModalBody,
  Title: ModalTitle,
  Subtitle: ModalSubtitle,
  Actions: ModalActions,
  Action: ModalAction
};
