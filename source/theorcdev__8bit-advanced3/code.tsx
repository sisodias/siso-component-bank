var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// staging/src/lib/utils.ts
function cn(...c) {
  return c.flat().filter(Boolean).join(" ");
}

function r(e) {
  var t, f, n = "";
  if ("string" == typeof e || "number" == typeof e) n += e;
  else if ("object" == typeof e) if (Array.isArray(e)) {
    var o = e.length;
    for (t = 0; t < o; t++) e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
  } else for (f in e) e[f] && (n && (n += " "), n += f);
  return n;
}
function clsx() {
  for (var e, t, f = 0, n = "", o = arguments.length; f < o; f++) (e = arguments[f]) && (t = r(e)) && (n && (n += " "), n += t);
  return n;
}

var falsyToString = (value) => typeof value === "boolean" ? `${value}` : value === 0 ? "0" : value;
var cx = clsx;
var cva = (base, config) => (props) => {
  var _config_compoundVariants;
  if ((config === null || config === void 0 ? void 0 : config.variants) == null) return cx(base, props === null || props === void 0 ? void 0 : props.class, props === null || props === void 0 ? void 0 : props.className);
  const { variants, defaultVariants } = config;
  const getVariantClassNames = Object.keys(variants).map((variant) => {
    const variantProp = props === null || props === void 0 ? void 0 : props[variant];
    const defaultVariantProp = defaultVariants === null || defaultVariants === void 0 ? void 0 : defaultVariants[variant];
    if (variantProp === null) return null;
    const variantKey = falsyToString(variantProp) || falsyToString(defaultVariantProp);
    return variants[variant][variantKey];
  });
  const propsWithoutUndefined = props && Object.entries(props).reduce((acc, param) => {
    let [key, value] = param;
    if (value === void 0) {
      return acc;
    }
    acc[key] = value;
    return acc;
  }, {});
  const getCompoundVariantClassNames = config === null || config === void 0 ? void 0 : (_config_compoundVariants = config.compoundVariants) === null || _config_compoundVariants === void 0 ? void 0 : _config_compoundVariants.reduce((acc, param) => {
    let { class: cvClass, className: cvClassName, ...compoundVariantOptions } = param;
    return Object.entries(compoundVariantOptions).every((param2) => {
      let [key, value] = param2;
      return Array.isArray(value) ? value.includes({
        ...defaultVariants,
        ...propsWithoutUndefined
      }[key]) : {
        ...defaultVariants,
        ...propsWithoutUndefined
      }[key] === value;
    }) ? [
      ...acc,
      cvClass,
      cvClassName
    ] : acc;
  }, []);
  return cx(base, getVariantClassNames, getCompoundVariantClassNames, props === null || props === void 0 ? void 0 : props.class, props === null || props === void 0 ? void 0 : props.className);
};

var dist_exports = {};
__export(dist_exports, {
  Root: () => Slot,
  Slot: () => Slot,
  Slottable: () => Slottable,
  createSlot: () => createSlot,
  createSlottable: () => createSlottable
});
import * as React2 from "react";

import * as React from "react";
function setRef(ref, value) {
  if (typeof ref === "function") {
    return ref(value);
  } else if (ref !== null && ref !== void 0) {
    ref.current = value;
  }
}
function composeRefs(...refs) {
  return (node) => {
    let hasCleanup = false;
    const cleanups = refs.map((ref) => {
      const cleanup = setRef(ref, node);
      if (!hasCleanup && typeof cleanup == "function") {
        hasCleanup = true;
      }
      return cleanup;
    });
    if (hasCleanup) {
      return () => {
        for (let i = 0; i < cleanups.length; i++) {
          const cleanup = cleanups[i];
          if (typeof cleanup == "function") {
            cleanup();
          } else {
            setRef(refs[i], null);
          }
        }
      };
    }
  };
}

import { Fragment as Fragment2, jsx } from "react/jsx-runtime";
var REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy");
var use = React2[" use ".trim().toString()];
function isPromiseLike(value) {
  return typeof value === "object" && value !== null && "then" in value;
}
function isLazyComponent(element) {
  return element != null && typeof element === "object" && "$$typeof" in element && element.$$typeof === REACT_LAZY_TYPE && "_payload" in element && isPromiseLike(element._payload);
}
// @__NO_SIDE_EFFECTS__
function createSlot(ownerName) {
  const SlotClone = /* @__PURE__ */ createSlotClone(ownerName);
  const Slot22 = React2.forwardRef((props, forwardedRef) => {
    let { children, ...slotProps } = props;
    if (isLazyComponent(children) && typeof use === "function") {
      children = use(children._payload);
    }
    const childrenArray = React2.Children.toArray(children);
    const slottable = childrenArray.find(isSlottable);
    if (slottable) {
      const newElement = slottable.props.children;
      const newChildren = childrenArray.map((child) => {
        if (child === slottable) {
          if (React2.Children.count(newElement) > 1) return React2.Children.only(null);
          return React2.isValidElement(newElement) ? newElement.props.children : null;
        } else {
          return child;
        }
      });
      return /* @__PURE__ */ jsx(SlotClone, { ...slotProps, ref: forwardedRef, children: React2.isValidElement(newElement) ? React2.cloneElement(newElement, void 0, newChildren) : null });
    }
    return /* @__PURE__ */ jsx(SlotClone, { ...slotProps, ref: forwardedRef, children });
  });
  Slot22.displayName = `${ownerName}.Slot`;
  return Slot22;
}
var Slot = /* @__PURE__ */ createSlot("Slot");
// @__NO_SIDE_EFFECTS__
function createSlotClone(ownerName) {
  const SlotClone = React2.forwardRef((props, forwardedRef) => {
    let { children, ...slotProps } = props;
    if (isLazyComponent(children) && typeof use === "function") {
      children = use(children._payload);
    }
    if (React2.isValidElement(children)) {
      const childrenRef = getElementRef(children);
      const props2 = mergeProps(slotProps, children.props);
      if (children.type !== React2.Fragment) {
        props2.ref = forwardedRef ? composeRefs(forwardedRef, childrenRef) : childrenRef;
      }
      return React2.cloneElement(children, props2);
    }
    return React2.Children.count(children) > 1 ? React2.Children.only(null) : null;
  });
  SlotClone.displayName = `${ownerName}.SlotClone`;
  return SlotClone;
}
var SLOTTABLE_IDENTIFIER = /* @__PURE__ */ Symbol("radix.slottable");
// @__NO_SIDE_EFFECTS__
function createSlottable(ownerName) {
  const Slottable2 = ({ children }) => {
    return /* @__PURE__ */ jsx(Fragment2, { children });
  };
  Slottable2.displayName = `${ownerName}.Slottable`;
  Slottable2.__radixId = SLOTTABLE_IDENTIFIER;
  return Slottable2;
}
var Slottable = /* @__PURE__ */ createSlottable("Slottable");
function isSlottable(child) {
  return React2.isValidElement(child) && typeof child.type === "function" && "__radixId" in child.type && child.type.__radixId === SLOTTABLE_IDENTIFIER;
}
function mergeProps(slotProps, childProps) {
  const overrideProps = { ...childProps };
  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];
    const isHandler = /^on[A-Z]/.test(propName);
    if (isHandler) {
      if (slotPropValue && childPropValue) {
        overrideProps[propName] = (...args) => {
          const result = childPropValue(...args);
          slotPropValue(...args);
          return result;
        };
      } else if (slotPropValue) {
        overrideProps[propName] = slotPropValue;
      }
    } else if (propName === "style") {
      overrideProps[propName] = { ...slotPropValue, ...childPropValue };
    } else if (propName === "className") {
      overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(" ");
    }
  }
  return { ...slotProps, ...overrideProps };
}
function getElementRef(element) {
  let getter = Object.getOwnPropertyDescriptor(element.props, "ref")?.get;
  let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.ref;
  }
  getter = Object.getOwnPropertyDescriptor(element, "ref")?.get;
  mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.props.ref;
  }
  return element.props.ref || element.ref;
}

// staging/src/radix-ui-shim.ts
var Slot2 = dist_exports;

// staging/src/components/ui/badge.tsx
var badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive: "bg-destructive text-white focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40 [a&]:hover:bg-destructive/90",
        outline: "border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        ghost: "[a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        link: "text-primary underline-offset-4 [a&]:hover:underline"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot2.Root : "span";
  return <Comp
    data-slot="badge"
    data-variant={variant}
    className={cn(badgeVariants({ variant }), className)}
    {...props}
  />;
}

// staging/src/components/ui/8bit/badge.tsx
var badgeVariants2 = cva("", {
  variants: {
    font: {
      normal: "",
      retro: "retro"
    },
    variant: {
      default: "border-primary bg-primary",
      destructive: "border-destructive bg-destructive",
      outline: "border-background bg-background",
      secondary: "border-secondary bg-secondary"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});
function Badge2({
  children,
  className = "",
  font,
  variant,
  ...props
}) {
  const color = badgeVariants2({ variant, font });
  const classes = className.split(" ");
  const visualClasses = classes.filter(
    (c) => c.startsWith("bg-") || c.startsWith("border-") || c.startsWith("text-") || c.startsWith("rounded-")
  );
  const containerClasses = classes.filter(
    (c) => !(c.startsWith("bg-") || c.startsWith("border-") || c.startsWith("text-") || c.startsWith("rounded-"))
  );
  return <div className={cn("relative inline-flex items-stretch", containerClasses)}>
      <Badge
    {...props}
    className={cn(
      "h-full",
      "rounded-none",
      "w-full",
      font !== "normal" && "retro",
      visualClasses
    )}
    variant={variant}
  >
        {children}
      </Badge>

      {
    /* Left pixel bar */
  }
      <div
    className={cn(
      "-left-1.5 absolute inset-y-[4px] w-1.5",
      color,
      visualClasses
    )}
  />
      {
    /* Right pixel bar */
  }
      <div
    className={cn(
      "-right-1.5 absolute inset-y-[4px] w-1.5",
      color,
      visualClasses
    )}
  />
    </div>;
}

// staging/src/components/ui/button.tsx
var buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot2.Root : "button";
  return <Comp
    data-slot="button"
    data-variant={variant}
    data-size={size}
    className={cn(buttonVariants({ variant, size, className }))}
    {...props}
  />;
}

// staging/src/components/ui/8bit/button.tsx
var buttonVariants2 = cva("", {
  variants: {
    font: {
      normal: "",
      retro: "retro"
    },
    variant: {
      default: "bg-foreground",
      destructive: "bg-foreground",
      outline: "bg-foreground",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline"
    },
    size: {
      default: "",
      sm: "",
      lg: "",
      icon: ""
    }
  },
  defaultVariants: {
    variant: "default",
    size: "default"
  }
});
function Button2({ children, asChild, ...props }) {
  const { variant, size, className, font } = props;
  return <Button
    {...props}
    className={cn(
      "rounded-none active:translate-y-1 transition-transform relative inline-flex items-center justify-center gap-1.5 border-none",
      size === "icon" && "mx-1 my-0",
      font !== "normal" && "retro",
      className
    )}
    size={size}
    variant={variant}
    asChild={asChild}
  >
      {asChild ? <span className="relative inline-flex items-center justify-center gap-1.5">
          {children}

          {variant !== "ghost" && variant !== "link" && size !== "icon" && <>
              {
    /* Pixelated border */
  }
              <div className="absolute -top-1.5 w-1/2 left-1.5 h-1.5 bg-foreground dark:bg-ring" />
              <div className="absolute -top-1.5 w-1/2 right-1.5 h-1.5 bg-foreground dark:bg-ring" />
              <div className="absolute -bottom-1.5 w-1/2 left-1.5 h-1.5 bg-foreground dark:bg-ring" />
              <div className="absolute -bottom-1.5 w-1/2 right-1.5 h-1.5 bg-foreground dark:bg-ring" />
              <div className="absolute top-0 left-0 size-1.5 bg-foreground dark:bg-ring" />
              <div className="absolute top-0 right-0 size-1.5 bg-foreground dark:bg-ring" />
              <div className="absolute bottom-0 left-0 size-1.5 bg-foreground dark:bg-ring" />
              <div className="absolute bottom-0 right-0 size-1.5 bg-foreground dark:bg-ring" />
              <div className="absolute top-1.5 -left-1.5 h-[calc(100%-12px)] w-1.5 bg-foreground dark:bg-ring" />
              <div className="absolute top-1.5 -right-1.5 h-[calc(100%-12px)] w-1.5 bg-foreground dark:bg-ring" />
              {variant !== "outline" && <>
                  {
    /* Top shadow */
  }
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-foreground/20" />
                  <div className="absolute top-1.5 left-0 w-3 h-1.5 bg-foreground/20" />

                  {
    /* Bottom shadow */
  }
                  <div className="absolute bottom-0 left-0 w-full h-1.5 bg-foreground/20" />
                  <div className="absolute bottom-1.5 right-0 w-3 h-1.5 bg-foreground/20" />
                </>}
            </>}

          {size === "icon" && <>
              <div className="absolute top-0 left-0 w-full h-[5px] md:h-1.5 bg-foreground dark:bg-ring pointer-events-none" />
              <div className="absolute bottom-0 w-full h-[5px] md:h-1.5 bg-foreground dark:bg-ring pointer-events-none" />
              <div className="absolute top-1 -left-1 w-[5px] md:w-1.5 h-1/2 bg-foreground dark:bg-ring pointer-events-none" />
              <div className="absolute bottom-1 -left-1 w-[5px] md:w-1.5 h-1/2 bg-foreground dark:bg-ring pointer-events-none" />
              <div className="absolute top-1 -right-1 w-[5px] md:w-1.5 h-1/2 bg-foreground dark:bg-ring pointer-events-none" />
              <div className="absolute bottom-1 -right-1 w-[5px] md:w-1.5 h-1/2 bg-foreground dark:bg-ring pointer-events-none" />
            </>}
        </span> : <>
          {children}

          {variant !== "ghost" && variant !== "link" && size !== "icon" && <>
              {
    /* Pixelated border */
  }
              <div className="absolute -top-1.5 w-1/2 left-1.5 h-1.5 bg-foreground dark:bg-ring" />
              <div className="absolute -top-1.5 w-1/2 right-1.5 h-1.5 bg-foreground dark:bg-ring" />
              <div className="absolute -bottom-1.5 w-1/2 left-1.5 h-1.5 bg-foreground dark:bg-ring" />
              <div className="absolute -bottom-1.5 w-1/2 right-1.5 h-1.5 bg-foreground dark:bg-ring" />
              <div className="absolute top-0 left-0 size-1.5 bg-foreground dark:bg-ring" />
              <div className="absolute top-0 right-0 size-1.5 bg-foreground dark:bg-ring" />
              <div className="absolute bottom-0 left-0 size-1.5 bg-foreground dark:bg-ring" />
              <div className="absolute bottom-0 right-0 size-1.5 bg-foreground dark:bg-ring" />
              <div className="absolute top-1.5 -left-1.5 h-[calc(100%-12px)] w-1.5 bg-foreground dark:bg-ring" />
              <div className="absolute top-1.5 -right-1.5 h-[calc(100%-12px)] w-1.5 bg-foreground dark:bg-ring" />
              {variant !== "outline" && <>
                  {
    /* Top shadow */
  }
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-foreground/20" />
                  <div className="absolute top-1.5 left-0 w-3 h-1.5 bg-foreground/20" />

                  {
    /* Bottom shadow */
  }
                  <div className="absolute bottom-0 left-0 w-full h-1.5 bg-foreground/20" />
                  <div className="absolute bottom-1.5 right-0 w-3 h-1.5 bg-foreground/20" />
                </>}
            </>}

          {size === "icon" && <>
              <div className="absolute top-0 left-0 w-full h-[5px] md:h-1.5 bg-foreground dark:bg-ring pointer-events-none" />
              <div className="absolute bottom-0 w-full h-[5px] md:h-1.5 bg-foreground dark:bg-ring pointer-events-none" />
              <div className="absolute top-1 -left-1 w-[5px] md:w-1.5 h-1/2 bg-foreground dark:bg-ring pointer-events-none" />
              <div className="absolute bottom-1 -left-1 w-[5px] md:w-1.5 h-1/2 bg-foreground dark:bg-ring pointer-events-none" />
              <div className="absolute top-1 -right-1 w-[5px] md:w-1.5 h-1/2 bg-foreground dark:bg-ring pointer-events-none" />
              <div className="absolute bottom-1 -right-1 w-[5px] md:w-1.5 h-1/2 bg-foreground dark:bg-ring pointer-events-none" />
            </>}
        </>}
    </Button>;
}

// staging/src/components/ui/card.tsx
function Card({ className, ...props }) {
  return <div
    data-slot="card"
    className={cn(
      "flex flex-col gap-6 rounded-xl border bg-card py-6 text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />;
}
function CardContent({ className, ...props }) {
  return <div
    data-slot="card-content"
    className={cn("px-6", className)}
    {...props}
  />;
}

// staging/src/components/ui/8bit/card.tsx
var cardVariants = cva("", {
  variants: {
    font: {
      normal: "",
      retro: "retro"
    }
  },
  defaultVariants: {
    font: "retro"
  }
});
function Card2({ className, font, ...props }) {
  return <div
    className={cn(
      "relative bg-card text-card-foreground border-y-6 border-foreground dark:border-ring p-0!",
      className
    )}
  >
      <Card
    {...props}
    className={cn(
      "rounded-none border-0 w-full! h-full flex flex-col bg-card text-card-foreground shadow-none",
      font !== "normal" && "retro",
      className
    )}
  />

      <div
    className={cn("absolute inset-0 border-x-6 -mx-1.5 border-inherit pointer-events-none")}
    aria-hidden="true"
  />
    </div>;
}
function CardContent2({ ...props }) {
  const { className, font } = props;
  return <CardContent
    className={cn("flex-1", font !== "normal" && "retro", className)}
    {...props}
  />;
}

// staging/src/components/ui/input.tsx
function Input({ className, type, ...props }) {
  return <input
    type={type}
    data-slot="input"
    className={cn(
      "h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30",
      "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
      "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
      className
    )}
    {...props}
  />;
}

// staging/src/components/ui/8bit/input.tsx
var inputVariants = cva("", {
  variants: {
    font: {
      normal: "",
      retro: "retro"
    }
  },
  defaultVariants: {
    font: "retro"
  }
});
function Input2({ ...props }) {
  const { className, font } = props;
  return <div
    className={cn(
      "relative border-y-6 border-foreground dark:border-ring !p-0 flex items-center",
      className
    )}
  >
      <Input
    {...props}
    className={cn(
      "rounded-none ring-0 !w-full",
      font !== "normal" && "retro",
      className
    )}
  />

      <div
    className="absolute inset-0 border-x-6 -mx-1.5 border-foreground dark:border-ring pointer-events-none"
    aria-hidden="true"
  />
    </div>;
}

// staging/src/components/ui/8bit/blocks/advanced3.tsx
function Advanced3({
  title = "Join the Guild",
  description = "Get notified when new components and blocks drop. No spam, just pixels.",
  placeholder = "warrior@email.com",
  cta = "SUBSCRIBE",
  badge = "FREE",
  className
}) {
  return <section className={cn("w-full px-4 py-16", className)}>
      <div className="mx-auto max-w-xl">
        <Card2>
          <CardContent2 className="pt-8 pb-8">
            <div className="text-center">
              {badge && <div className="mb-4">
                  <Badge2>{badge}</Badge2>
                </div>}

              <h2 className="retro mb-3 font-bold text-2xl tracking-tight">
                {title}
              </h2>

              <p className="mx-auto mb-6 max-w-sm text-muted-foreground retro text-[9px] leading-relaxed">
                {description}
              </p>

              <div className="flex flex-col md:flex-row items-center gap-4">
                <Input2
    className="retro flex-1 text-xs"
    placeholder={placeholder}
    type="email"
  />
                <Button2 className="text-xs">{cta}</Button2>
              </div>

              <p className="retro mt-3 text-muted-foreground text-[10px]">
                No spam. Unsubscribe anytime.
              </p>
            </div>
          </CardContent2>
        </Card2>
      </div>
    </section>;
}

export default Advanced3;
