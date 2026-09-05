
(function(){
  if (typeof document === "undefined") return;
  // --- force dark: 4 layers ---
  try { localStorage.setItem("theme","dark"); localStorage.setItem("vite-ui-theme","dark"); } catch(e){}
  var __forceDark = function(){ var de=document.documentElement; de.classList.remove("light"); de.classList.add("dark"); de.style.colorScheme="dark"; };
  __forceDark();
  var __n=0, __iv=setInterval(function(){ __forceDark(); if(++__n>=30) clearInterval(__iv); }, 100);
  try { new MutationObserver(function(){ if(!document.documentElement.classList.contains("dark")) __forceDark(); }).observe(document.documentElement,{attributes:true,attributeFilter:["class"]}); } catch(e){}
  // --- retro css + base64 font ---
  if (!document.getElementById("__8bit_retro_css__")) {
    var s=document.createElement("style"); s.id="__8bit_retro_css__";
    s.textContent = '@font-face{font-family:"Press Start 2P";font-style:normal;font-weight:400;font-display:swap;src:url("data:font/woff2;base64,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") format("woff2");}'
      + '.retro{font-family:"Press Start 2P",system-ui,-apple-system,sans-serif;line-height:1.5;letter-spacing:0.5px;}'
      + '.pixelated{image-rendering:pixelated;image-rendering:crisp-edges;}'
      + 'html.light,html:not(.dark){--background:oklch(0.145 0 0);--foreground:oklch(0.985 0 0);--card:oklch(0.205 0 0);--card-foreground:oklch(0.985 0 0);--muted-foreground:oklch(0.708 0 0);--border:oklch(0.985 0 0);--ring:oklch(0.556 0 0);color-scheme:dark;}';
    document.head.appendChild(s);
  }
})();

var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// staging/src/lib/utils.ts
function cn(...c) {
  return c.flat().filter(Boolean).join(" ");
}

// ../../../Users/dav/.claude/skills/21st-publish-from-registry/.workspace/node_modules/clsx/dist/clsx.mjs
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

// ../../../Users/dav/.claude/skills/21st-publish-from-registry/.workspace/node_modules/class-variance-authority/dist/index.mjs
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

// ../../../Users/dav/.claude/skills/21st-publish-from-registry/.workspace/node_modules/@radix-ui/react-slot/dist/index.mjs
var dist_exports = {};
__export(dist_exports, {
  Root: () => Slot,
  Slot: () => Slot,
  Slottable: () => Slottable,
  createSlot: () => createSlot,
  createSlottable: () => createSlottable
});
import * as React2 from "react";

// ../../../Users/dav/.claude/skills/21st-publish-from-registry/.workspace/node_modules/@radix-ui/react-compose-refs/dist/index.mjs
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

// ../../../Users/dav/.claude/skills/21st-publish-from-registry/.workspace/node_modules/@radix-ui/react-slot/dist/index.mjs
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

// ../../../Users/dav/.claude/skills/21st-publish-from-registry/.workspace/node_modules/@radix-ui/react-label/dist/index.mjs
var dist_exports2 = {};
__export(dist_exports2, {
  Label: () => Label,
  Root: () => Root
});
import * as React4 from "react";

// ../../../Users/dav/.claude/skills/21st-publish-from-registry/.workspace/node_modules/@radix-ui/react-label/node_modules/@radix-ui/react-primitive/dist/index.mjs
import * as React3 from "react";
import * as ReactDOM from "react-dom";
import { jsx as jsx2 } from "react/jsx-runtime";
var NODES = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul"
];
var Primitive = NODES.reduce((primitive, node) => {
  const Slot3 = createSlot(`Primitive.${node}`);
  const Node = React3.forwardRef((props, forwardedRef) => {
    const { asChild, ...primitiveProps } = props;
    const Comp = asChild ? Slot3 : node;
    if (typeof window !== "undefined") {
      window[/* @__PURE__ */ Symbol.for("radix-ui")] = true;
    }
    return /* @__PURE__ */ jsx2(Comp, { ...primitiveProps, ref: forwardedRef });
  });
  Node.displayName = `Primitive.${node}`;
  return { ...primitive, [node]: Node };
}, {});

// ../../../Users/dav/.claude/skills/21st-publish-from-registry/.workspace/node_modules/@radix-ui/react-label/dist/index.mjs
import { jsx as jsx3 } from "react/jsx-runtime";
var NAME = "Label";
var Label = React4.forwardRef((props, forwardedRef) => {
  return /* @__PURE__ */ jsx3(
    Primitive.label,
    {
      ...props,
      ref: forwardedRef,
      onMouseDown: (event) => {
        const target = event.target;
        if (target.closest("button, input, select, textarea")) return;
        props.onMouseDown?.(event);
        if (!event.defaultPrevented && event.detail > 1) event.preventDefault();
      }
    }
  );
});
Label.displayName = NAME;
var Root = Label;

// staging/src/radix-ui-shim.ts
var Slot2 = dist_exports;
var Label2 = dist_exports2;

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
function CardHeader({ className, ...props }) {
  return <div
    data-slot="card-header"
    className={cn(
      "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
      className
    )}
    {...props}
  />;
}
function CardTitle({ className, ...props }) {
  return <div
    data-slot="card-title"
    className={cn("leading-none font-semibold", className)}
    {...props}
  />;
}
function CardDescription({ className, ...props }) {
  return <div
    data-slot="card-description"
    className={cn("text-sm text-muted-foreground", className)}
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
function CardHeader2({ ...props }) {
  const { className, font } = props;
  return <CardHeader
    className={cn(font !== "normal" && "retro", className)}
    {...props}
  />;
}
function CardTitle2({ ...props }) {
  const { className, font } = props;
  return <CardTitle
    className={cn(font !== "normal" && "retro", className)}
    {...props}
  />;
}
function CardDescription2({ ...props }) {
  const { className, font } = props;
  return <CardDescription
    className={cn(font !== "normal" && "retro", className)}
    {...props}
  />;
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

// staging/src/components/ui/label.tsx
function Label3({
  className,
  ...props
}) {
  return <Label2.Root
    data-slot="label"
    className={cn(
      "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
      className
    )}
    {...props}
  />;
}

// staging/src/components/ui/8bit/label.tsx
var inputVariants2 = cva("", {
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
function Label4({ className, font, ...props }) {
  return <Label3
    className={cn(className, font !== "normal" && "retro")}
    {...props}
  />;
}

// staging/src/components/ui/8bit/blocks/login-form.tsx
function LoginForm({
  className,
  ...props
}) {
  return <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card2>
        <CardHeader2>
          <CardTitle2 className="text-2xl">Login</CardTitle2>
          <CardDescription2 className="text-xs">
            Enter your email below to login to your account
          </CardDescription2>
        </CardHeader2>
        <CardContent2>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label4 htmlFor="email">Email</Label4>
                <Input2
    id="email"
    type="email"
    placeholder="m@example.com"
    required
  />
              </div>
              <div className="grid gap-2">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <Label4 htmlFor="password">Password</Label4>
                  <a
    href="#"
    className="inline-block text-xs underline-offset-4 hover:underline"
  >
                    Forgot password?
                  </a>
                </div>
                <Input2 id="password" type="password" required />
              </div>
              <Button2 type="submit" className="w-full">
                Login
              </Button2>
              <Button2 variant="outline" className="w-full">
                Login with Google
              </Button2>
            </div>
            <div className="mt-4 text-center text-xs">
              Don&apos;t have an account?{" "}
              <a href="#" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent2>
      </Card2>
    </div>;
}

export default LoginForm;
