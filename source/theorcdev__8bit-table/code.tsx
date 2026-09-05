// ../../../private/tmp/esbuild-batch7/node_modules/clsx/dist/clsx.mjs
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

// ../../../private/tmp/esbuild-batch7/node_modules/class-variance-authority/dist/index.mjs
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

// ../../../private/tmp/esbuild-batch7/table-stage/src/lib/utils.ts
function cn(...c) {
  return c.flat().filter(Boolean).join(" ");
}

// ../../../private/tmp/esbuild-batch7/table-stage/src/components/ui/badge.tsx
var badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

// ../../../private/tmp/esbuild-batch7/table-stage/src/components/ui/8bit/badge.tsx
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

// ../../../private/tmp/esbuild-batch7/table-stage/src/components/ui/table.tsx
import * as React from "react";
var Table = React.forwardRef(({ className, ...props }, ref) => <div className="relative w-full overflow-auto">
    <table
  ref={ref}
  className={cn("w-full caption-bottom text-sm", className)}
  {...props}
/>
  </div>);
Table.displayName = "Table";
var TableHeader = React.forwardRef(({ className, ...props }, ref) => <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />);
TableHeader.displayName = "TableHeader";
var TableBody = React.forwardRef(({ className, ...props }, ref) => <tbody
  ref={ref}
  className={cn("[&_tr:last-child]:border-0", className)}
  {...props}
/>);
TableBody.displayName = "TableBody";
var TableFooter = React.forwardRef(({ className, ...props }, ref) => <tfoot
  ref={ref}
  className={cn(
    "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
    className
  )}
  {...props}
/>);
TableFooter.displayName = "TableFooter";
var TableRow = React.forwardRef(({ className, ...props }, ref) => <tr
  ref={ref}
  className={cn(
    "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
    className
  )}
  {...props}
/>);
TableRow.displayName = "TableRow";
var TableHead = React.forwardRef(({ className, ...props }, ref) => <th
  ref={ref}
  className={cn(
    "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
    className
  )}
  {...props}
/>);
TableHead.displayName = "TableHead";
var TableCell = React.forwardRef(({ className, ...props }, ref) => <td
  ref={ref}
  className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
  {...props}
/>);
TableCell.displayName = "TableCell";
var TableCaption = React.forwardRef(({ className, ...props }, ref) => <caption
  ref={ref}
  className={cn("mt-4 text-sm text-muted-foreground", className)}
  {...props}
/>);
TableCaption.displayName = "TableCaption";

// ../../../private/tmp/esbuild-batch7/table-stage/src/components/ui/8bit/table.tsx
var tableVariants = cva("", {
  variants: {
    variant: {
      default: "p-4 py-2.5 border-y-6 border-foreground dark:border-ring",
      borderless: ""
    },
    font: {
      normal: "",
      retro: "retro"
    }
  },
  defaultVariants: {
    font: "retro",
    variant: "default"
  }
});
function Table2({
  className,
  font,
  variant,
  ...props
}) {
  return <div
    className={cn(
      "relative flex justify-center w-fit",
      tableVariants({ font, variant })
    )}
  >
      <Table className={className} {...props} />

      {variant !== "borderless" && <div
    className="absolute inset-0 border-x-6 -mx-1.5 border-foreground dark:border-ring pointer-events-none"
    aria-hidden="true"
  />}
    </div>;
}
function TableHeader2({ className, ...props }) {
  return <TableHeader
    className={cn(className, "border-b-4 border-foreground dark:border-ring")}
    {...props}
  />;
}
function TableBody2({ className, ...props }) {
  return <TableBody className={cn(className)} {...props} />;
}
function TableFooter2({ className, ...props }) {
  return <TableFooter className={cn(className)} {...props} />;
}
function TableRow2({ className, ...props }) {
  return <TableRow
    className={cn(
      className,
      "border-dashed border-b-4 border-foreground dark:border-ring"
    )}
    {...props}
  />;
}
function TableHead2({ className, ...props }) {
  return <TableHead className={cn(className)} {...props} />;
}
function TableCell2({ className, ...props }) {
  return <TableCell className={cn(className)} {...props} />;
}
function TableCaption2({
  className,
  ...props
}) {
  return <TableCaption className={cn(className)} {...props} />;
}
export {
  Badge2 as Badge,
  Table2 as Table,
  TableBody2 as TableBody,
  TableCaption2 as TableCaption,
  TableCell2 as TableCell,
  TableFooter2 as TableFooter,
  TableHead2 as TableHead,
  TableHeader2 as TableHeader,
  TableRow2 as TableRow,
  badgeVariants2 as badgeVariants,
  tableVariants
};
export default Table;
