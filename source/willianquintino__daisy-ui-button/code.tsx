// Este é o arquivo do seu componente
// Você pode usar qualquer dependência do npm; nós as importamos automaticamente para o package.json

import "daisyui"
import { useState } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = {
  color: {
    primary: "btn-primary",
    secondary: "btn-secondary",
    accent: "btn-accent",
    info: "btn-info",
    success: "btn-success",
    warning: "btn-warning",
    error: "btn-error",
    neutral: "btn-neutral",
  },
  variant: {
    outline: "btn-outline",
    soft: "btn-soft",
    dash: "btn-dash",
    ghost: "btn-ghost",
    link: "btn-link",
  },
  size: {
    xs: "btn-xs",
    sm: "btn-sm",
    md: "btn-md",
    lg: "btn-lg",
    xl: "btn-xl",
  },
  shape: {
    wide: "btn-wide",
    block: "btn-block",
    square: "btn-square",
    circle: "btn-circle",
  },
  behavior:{
    active: "btn-active",
    disabled: "btn-disabled",
  }
}

type BaseProps = {
  color?: keyof typeof buttonVariants.color;
  variant?: keyof typeof buttonVariants.variant;
  size?: keyof typeof buttonVariants.size;
  shape?: keyof typeof buttonVariants.shape;
  behavior?: keyof typeof buttonVariants.behavior;
  className?: string;
};

type ButtonAs = "button" | "a" | "input";

type InputTypes = "button" | "submit" | "reset" | "radio" | "checkbox";

type ButtonAsButton = BaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { as?: "button" };

type ButtonAsAnchor = BaseProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { as: "a" };

type ButtonAsInput = BaseProps &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & {
    as: "input";
    type: InputTypes;
  };

type ButtonProps = ButtonAsButton | ButtonAsAnchor | ButtonAsInput;

export function ButtonDaisyUI({
  as = "button",
  color,
  variant,
  size,
  shape,
  behavior,
  className,
  children,
  ...rest
}: ButtonProps) {
  const Component: any = as;

  const classes = cn(
    "btn",
    color && buttonVariants.color[color],
    variant && buttonVariants.variant[variant],
    size && buttonVariants.size[size],
    shape && buttonVariants.shape[shape],
    behavior && buttonVariants.behavior[behavior],
    className
  );

  // Se for <input>, não pode ter children
  if (as === "input") {
    return <Component className={classes} {...rest} />;
  }

  return (
    <Component className={classes} {...rest}>
      {children}
    </Component>
  );
}
