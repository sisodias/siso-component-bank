import React from "react";
import clsx from "clsx";

export type TNoteType = "default" | "success" | "warning" | "error" | "alert" | "secondary" |
  "violet" | "cyan" | "lite" | "ghost" | "tertiary" | "rotate-ccw";

const sizes = {
  small: "py-1.5 px-2 min-h-[34px] text-[13px]",
  medium: "py-2 px-3 min-h-10 text-[14px]",
  large: "py-[11px] px-3 min-h-12 text-base"
};

interface NoteProps {
  size?: keyof typeof sizes;
  action?: React.ReactNode;
  type?: TNoteType;
  fill?: boolean;
  disabled?: boolean;
  label?: string | boolean;
  children: React.ReactNode;
}

const linkColor = {
  default: "var(--ds-gray-1000)",
  success: "var(--ds-blue-1000)",
  warning: "var(--ds-amber-1000)",
  error: "var(--ds-red-1000)",
  alert: "var(--ds-red-1000)",
  secondary: "var(--ds-gray-1000)",
  violet: "var(--ds-purple-1000)",
  cyan: "var(--ds-teal-1000)",
  lite: "var(--ds-gray-1000)",
  ghost: "var(--ds-gray-1000)",
  tertiary: "var(--ds-gray-1000)",
  "rotate-ccw": "var(--ds-gray-1000)"
};

const DefaultIcon = () => (
  <svg
    height="16"
    strokeLinejoin="round"
    viewBox="0 0 16 16"
    width="16"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 14.5C11.5899 14.5 14.5 11.5899 14.5 8C14.5 4.41015 11.5899 1.5 8 1.5C4.41015 1.5 1.5 4.41015 1.5 8C1.5 11.5899 4.41015 14.5 8 14.5ZM8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM6.25 7H7H7.74999C8.30227 7 8.74999 7.44772 8.74999 8V11.5V12.25H7.24999V11.5V8.5H7H6.25V7ZM8 6C8.55229 6 9 5.55228 9 5C9 4.44772 8.55229 4 8 4C7.44772 4 7 4.44772 7 5C7 5.55228 7.44772 6 8 6Z"
    />
  </svg>
);

const SuccessIcon = () => (
  <svg
    height="16"
    strokeLinejoin="round"
    viewBox="0 0 16 16"
    width="16"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.5 8C14.5 11.5899 11.5899 14.5 8 14.5C4.41015 14.5 1.5 11.5899 1.5 8C1.5 4.41015 4.41015 1.5 8 1.5C11.5899 1.5 14.5 4.41015 14.5 8ZM16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8ZM11.5303 6.53033L12.0607 6L11 4.93934L10.4697 5.46967L6.5 9.43934L5.53033 8.46967L5 7.93934L3.93934 9L4.46967 9.53033L5.96967 11.0303C6.26256 11.3232 6.73744 11.3232 7.03033 11.0303L11.5303 6.53033Z"
    />
  </svg>
);

const WarningIcon = () => (
  <svg
    height="16"
    stroke-linejoin="round"
    viewBox="0 0 16 16"
    width="16"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M8.55846 2H7.44148L1.88975 13.5H14.1102L8.55846 2ZM9.90929 1.34788C9.65902 0.829456 9.13413 0.5 8.55846 0.5H7.44148C6.86581 0.5 6.34092 0.829454 6.09065 1.34787L0.192608 13.5653C-0.127943 14.2293 0.355835 15 1.09316 15H14.9068C15.6441 15 16.1279 14.2293 15.8073 13.5653L9.90929 1.34788ZM8.74997 4.75V5.5V8V8.75H7.24997V8V5.5V4.75H8.74997ZM7.99997 12C8.55226 12 8.99997 11.5523 8.99997 11C8.99997 10.4477 8.55226 10 7.99997 10C7.44769 10 6.99997 10.4477 6.99997 11C6.99997 11.5523 7.44769 12 7.99997 12Z"
    />
  </svg>
);

const ErrorIcon = () => (
  <svg
    height="16"
    stroke-linejoin="round"
    viewBox="0 0 16 16"
    width="16"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M5.30761 1.5L1.5 5.30761L1.5 10.6924L5.30761 14.5H10.6924L14.5 10.6924V5.30761L10.6924 1.5H5.30761ZM5.10051 0C4.83529 0 4.58094 0.105357 4.3934 0.292893L0.292893 4.3934C0.105357 4.58094 0 4.83529 0 5.10051V10.8995C0 11.1647 0.105357 11.4191 0.292894 11.6066L4.3934 15.7071C4.58094 15.8946 4.83529 16 5.10051 16H10.8995C11.1647 16 11.4191 15.8946 11.6066 15.7071L15.7071 11.6066C15.8946 11.4191 16 11.1647 16 10.8995V5.10051C16 4.83529 15.8946 4.58093 15.7071 4.3934L11.6066 0.292893C11.4191 0.105357 11.1647 0 10.8995 0H5.10051ZM8.75 3.75V4.5V8L8.75 8.75H7.25V8V4.5V3.75H8.75ZM8 12C8.55229 12 9 11.5523 9 11C9 10.4477 8.55229 10 8 10C7.44772 10 7 10.4477 7 11C7 11.5523 7.44772 12 8 12Z"
    />
  </svg>
);

export const Note = ({
  size = "medium",
  action,
  type = "default",
  fill = false,
  disabled = false,
  label = true,
  children
}: NoteProps) => {
  return (
    <>
      <div
        // @ts-ignore
        style={{ "--geist-link-color": disabled ? "var(--ds-gray-700)" : linkColor[type] }}
        className={clsx(
          "flex grow items-center justify-between gap-3 rounded-md font-sans leading-6 selection:text-selection-text-color box-border border",
          sizes[size],
          (type === "default" || type === "tertiary" || type === "lite" || type === "ghost" || type === "rotate-ccw") && "text-gray-900 fill-gray-900 bg-transparent selection:bg-gray-900 border-gray-400",
          type === "success" && `text-blue-900 fill-blue-900 selection:bg-blue-700 ${fill ? "border-blue-100 bg-blue-200" : "border-blue-400 bg-transparent"}`,
          type === "warning" && `text-amber-900 fill-amber-900 selection:bg-amber-900 ${fill ? "border-amber-100 bg-amber-200" : "border-amber-400 bg-transparent"}`,
          (type === "error" || type === "alert") && `text-red-900 fill-red-900 selection:bg-red-800 ${fill ? "border-red-100 bg-red-200" : "border-red-400 bg-transparent"}`,
          type === "secondary" && `text-gray-900 fill-gray-900 selection:bg-gray-900 ${fill ? "border-transparent bg-gray-alpha-200" : "border-gray-alpha-400 bg-transparent"}`,
          type === "violet" && `text-purple-900 fill-purple-900 selection:bg-purple-900 ${fill ? "border-purple-100 bg-purple-200" : "border-purple-400 bg-transparent"}`,
          type === "cyan" && `text-teal-900 fill-teal-900 selection:bg-teal-900 ${fill ? "border-teal-100 bg-teal-200" : "border-teal-400 bg-transparent"}`,
          disabled ? "note-disabled text-gray-700 fill-gray-700 border-gray-alpha-200 bg-transparent selection:bg-gray-900" : "note-link"
        )}
      >
        <div className={clsx(
          "flex items-center m-0",
          typeof label === "string" ? "gap-1" : size === "small" ? "gap-2" : "gap-3"
        )}>
          {((typeof label !== "string" && label !== false) || label === undefined) && (
            <div className="w-4 h-4">
              {{
                default: <DefaultIcon />,
                success: <SuccessIcon />,
                warning: <WarningIcon />,
                error: <ErrorIcon />,
                alert: <DefaultIcon />,
                secondary: <DefaultIcon />,
                violet: <DefaultIcon />,
                cyan: <DefaultIcon />,
                lite: <DefaultIcon />,
                ghost: <DefaultIcon />,
                tertiary: <DefaultIcon />,
                "rotate-ccw": <DefaultIcon />
              }[type]}
            </div>
          )}
          {typeof label === "string" && (
            <span className="font-semibold whitespace-nowrap">{label}:</span>
          )}
          <span>
            {children}
          </span>
        </div>
        {action}
      </div>
    </>
  );
};