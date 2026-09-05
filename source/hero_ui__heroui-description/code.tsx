"use client";

import * as React from "react";

type DescriptionProps = React.HTMLAttributes<HTMLSpanElement>;
type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;
type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  isInvalid?: boolean;
};
type TextFieldProps = React.HTMLAttributes<HTMLDivElement> & {
  type?: React.HTMLInputTypeAttribute;
  isDisabled?: boolean;
  isInvalid?: boolean;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const styles = `
  .heroui-description-scope,
  .heroui-description-scope * {
    box-sizing: border-box;
  }

  .heroui-description-field {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    width: fit-content;
  }

  .heroui-description-label {
    margin: 0;
    color: lab(98.9676 -0.0000298023 -0.0000119209);
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 500;
  }

  .light .heroui-description-label,
  [data-theme="light"] .heroui-description-label {
    color: lab(20.4636 0.430741 -1.47586);
  }

  .heroui-description-input {
    width: 13rem;
    height: 2.25rem;
    border: 0 solid transparent;
    border-radius: 0.75rem;
    background: lab(8.34178 0.607349 -2.12998);
    color: lab(98.9676 -0.0000298023 -0.0000119209);
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 400;
    outline: none;
    transition: box-shadow 150ms ease, background-color 150ms ease, color 150ms ease;
  }

  .heroui-description-input.heroui-description-input-wide {
    width: 16rem;
  }

  .light .heroui-description-input,
  [data-theme="light"] .heroui-description-input {
    background: lab(96.7868 -0.0000209808 -0.00000783577);
    color: lab(20.4636 0.430741 -1.47586);
  }

  .heroui-description-input::placeholder {
    color: lab(65.6464 1.53497 -5.42429);
    opacity: 1;
  }

  .light .heroui-description-input::placeholder,
  [data-theme="light"] .heroui-description-input::placeholder {
    color: lab(49.4507 1.03619 -3.64233);
  }

  .heroui-description-input:focus-visible {
    box-shadow: 0 0 0 2px oklab(0.62039 -0.0543154 -0.187265 / 0.58);
  }

  .heroui-description-input[aria-invalid="true"] {
    box-shadow: 0 0 0 1px lab(57.1026 68.7444 45.3406);
  }

  .heroui-description-input:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }

  .heroui-description-description {
    display: block;
    color: lab(65.6464 1.53497 -5.42429);
    font-size: 0.75rem;
    line-height: 1rem;
    font-weight: 400;
    text-wrap: wrap;
    overflow-wrap: break-word;
  }

  .light .heroui-description-description,
  [data-theme="light"] .heroui-description-description {
    color: lab(49.4507 1.03619 -3.64233);
  }

  .heroui-description-field[data-disabled="true"] .heroui-description-description,
  .heroui-description-field[data-disabled="true"] .heroui-description-label {
    opacity: 0.55;
  }
`;

function HeroUIStyles() {
  return <style dangerouslySetInnerHTML={{ __html: styles }} />;
}

function Description({ className, children, ...props }: DescriptionProps) {
  return (
    <span
      className={cx("description heroui-description-description", className)}
      data-slot="description"
      slot="description"
      {...props}
    >
      {children}
    </span>
  );
}

function Label({ className, children, ...props }: LabelProps) {
  return (
    <label className={cx("label heroui-description-label", className)} {...props}>
      {children}
    </label>
  );
}

function Input({ className, isInvalid, ...props }: InputProps) {
  return (
    <input
      aria-invalid={isInvalid || undefined}
      className={cx("input input--primary heroui-description-input", className)}
      {...props}
    />
  );
}

const TextFieldContext = React.createContext<{
  id: string;
  descriptionId: string;
  type?: React.HTMLInputTypeAttribute;
  isDisabled?: boolean;
  isInvalid?: boolean;
} | null>(null);

function TextField({
  className,
  children,
  type,
  isDisabled,
  isInvalid,
  ...props
}: TextFieldProps) {
  const generatedId = React.useId();
  const id = props.id ?? `heroui-text-field-${generatedId.replace(/:/g, "")}`;
  const value = React.useMemo(
    () => ({
      id,
      descriptionId: `${id}-description`,
      type,
      isDisabled,
      isInvalid,
    }),
    [id, isDisabled, isInvalid, type],
  );

  return (
    <TextFieldContext.Provider value={value}>
      <div
        className={cx("heroui-description-field", className)}
        data-disabled={isDisabled ? "true" : undefined}
        data-invalid={isInvalid ? "true" : undefined}
        {...props}
      >
        {children}
      </div>
    </TextFieldContext.Provider>
  );
}

function TextFieldLabel(props: LabelProps) {
  const context = React.useContext(TextFieldContext);
  return <Label htmlFor={context?.id} {...props} />;
}

function TextFieldInput(props: InputProps) {
  const context = React.useContext(TextFieldContext);
  return (
    <Input
      aria-describedby={context?.descriptionId}
      disabled={context?.isDisabled}
      id={context?.id}
      isInvalid={context?.isInvalid}
      type={context?.type}
      {...props}
    />
  );
}

function TextFieldDescription(props: DescriptionProps) {
  const context = React.useContext(TextFieldContext);
  return <Description id={context?.descriptionId} {...props} />;
}

export {
  Description,
  HeroUIStyles,
  Input,
  Label,
  TextField,
  TextFieldDescription,
  TextFieldInput,
  TextFieldLabel,
};

