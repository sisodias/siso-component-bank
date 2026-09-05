import React from "react";

interface EmptyStateIconProps {
  icon?: React.ReactNode;
}

interface EmptyStateRootProps {
  icon?: React.ReactElement<EmptyStateIconProps>;
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

const EmptyStateIcon = ({ icon }: EmptyStateIconProps) => {
  return (
    <div className="flex items-center justify-center bg-background-100 border border-gray-alpha-400 rounded-lg p-3.5 h-[60px]">
      {icon}
    </div>
  );
};

const EmptyStateRoot = ({ icon, title, description, children }: EmptyStateRootProps) => {
  return (
    <div className="border border-gray-200 bg-background-100 rounded-lg py-12 px-[70px] w-full flex flex-col items-center justify-start gap-6 fill-gray-900">
      {icon}
      <div className="flex flex-col items-stretch justify-start gap-2">
        {title && (
          <div className="text-gray-1000 text-base font-sans font-medium text-center max-w-[340px]">
            {title}
          </div>
        )}
        {description && (
          <div className="text-gray-900 text-sm text-center max-w-[340px]">
            {description}
          </div>
        )}
      </div>
      {children}
    </div>
  );
};

export const EmptyState = {
  Root: EmptyStateRoot,
  Icon: EmptyStateIcon
};