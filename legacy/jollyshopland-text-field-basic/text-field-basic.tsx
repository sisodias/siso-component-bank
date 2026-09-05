"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import {
  FieldError as AriaFieldError,
  FieldErrorProps as AriaFieldErrorProps,
  Group as AriaGroup,
  GroupProps as AriaGroupProps,
  Input as AriaInput,
  InputProps as AriaInputProps,
  Label as AriaLabel,
  LabelProps as AriaLabelProps,
  Text as AriaText,
  TextProps as AriaTextProps,
  TextArea as AriaTextArea,
  TextAreaProps as AriaTextAreaProps,
  TextField as AriaTextField,
  TextFieldProps as AriaTextFieldProps,
  ValidationResult as AriaValidationResult,
  composeRenderProps,
} from "react-aria-components"

import { cn } from "../_utils/cn"

//-////////////////////////////////////////////////////////////////////////////
// Label
//-////////////////////////////////////////////////////////////////////////////

const labelVariants = cva([
  "text-sm font-medium leading-none",
  /* Disabled */
  "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-70",
  /* Invalid */
  "group-data-[invalid]:text-destructive",
])

const Label = ({ className, ...props }: AriaLabelProps) => (
  <AriaLabel className={cn(labelVariants(), className)} {...props} />
)

//-////////////////////////////////////////////////////////////////////////////
// Form Helpers (Description, Error)
//-////////////////////////////////////////////////////////////////////////////

function FormDescription({ className, ...props }: AriaTextProps) {
  return (
    <AriaText
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
      slot="description"
    />
  )
}

function FieldError({ className, ...props }: AriaFieldErrorProps) {
  return (
    <AriaFieldError
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    />
  )
}

//-////////////////////////////////////////////////////////////////////////////
// Field Group
//-////////////////////////////////////////////////////////////////////////////

const fieldGroupVariants = cva("", {
  variants: {
    variant: {
      default: [
        "relative flex h-10 w-full items-center overflow-hidden rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
        /* Focus Within */
        "data-[focus-within]:outline-none data-[focus-within]:ring-2 data-[focus-within]:ring-ring data-[focus-within]:ring-offset-2",
        /* Disabled */
        "data-[disabled]:opacity-50",
      ],
      ghost: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

interface GroupProps
  extends AriaGroupProps,
    VariantProps<typeof fieldGroupVariants> {}

function FieldGroup({ className, variant, ...props }: GroupProps) {
  return (
    <AriaGroup
      className={composeRenderProps(className, (className) =>
        cn(fieldGroupVariants({ variant }), className)
      )}
      {...props}
    />
  )
}

//-////////////////////////////////////////////////////////////////////////////
// Text Field (Base, Input, TextArea)
//-////////////////////////////////////////////////////////////////////////////

const TextField = AriaTextField

const Input = ({ className, ...props }: AriaInputProps) => {
  return (
    <AriaInput
      className={composeRenderProps(className, (className) =>
        cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground",
          /* Disabled */
          "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
          /* Focused */
          "data-[focused]:outline-none data-[focused]:ring-2 data-[focused]:ring-ring data-[focused]:ring-offset-2",
          /* Resets */
          "focus-visible:outline-none",
          className
        )
      )}
      {...props}
    />
  )
}

const TextArea = ({ className, ...props }: AriaTextAreaProps) => {
  return (
    <AriaTextArea
      className={composeRenderProps(className, (className) =>
        cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground",
          /* Focused */
          "data-[focused]:outline-none data-[focused]:ring-2 data-[focused]:ring-ring data-[focused]:ring-offset-2",
          /* Disabled */
          "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
          /* Resets */
          "focus-visible:outline-none",
          className
        )
      )}
      {...props}
    />
  )
}

//-////////////////////////////////////////////////////////////////////////////
// Jolly Text Field (Composed)
//-////////////////////////////////////////////////////////////////////////////

interface JollyTextFieldProps extends AriaTextFieldProps {
  label?: string
  description?: string
  errorMessage?: string | ((validation: AriaValidationResult) => string)
  textArea?: boolean
}

function JollyTextField({
  label,
  description,
  errorMessage,
  textArea,
  className,
  ...props
}: JollyTextFieldProps) {
  return (
    <TextField
      className={composeRenderProps(className, (className) =>
        cn("group flex flex-col gap-2", className)
      )}
      {...props}
    >
      <Label>{label}</Label>
      {textArea ? <TextArea /> : <Input />}
      {description && <FormDescription>{description}</FormDescription>}
      <FieldError>{errorMessage}</FieldError>
    </TextField>
  )
}

export {
  FieldError,
  FieldGroup,
  fieldGroupVariants,
  FormDescription,
  Input,
  JollyTextField,
  Label,
  labelVariants,
  TextArea,
  TextField,
}
export type { JollyTextFieldProps }