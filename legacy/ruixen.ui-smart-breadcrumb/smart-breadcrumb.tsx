"use client";

import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "./breadcrumb";
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItemType {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  isCurrent?: boolean;
}

interface SmartBreadcrumbProps {
  items: BreadcrumbItemType[];
  showIcons?: boolean;
  showEllipsis?: boolean;
  separator?: React.ReactNode;
  maxVisible?: number; // show ellipsis after these many
  className?: string;
}

export function SmartBreadcrumb({
  items,
  showIcons = true,
  showEllipsis = true,
  separator = <ChevronRight className="size-4 stroke-2" />,
  maxVisible = 4,
  className = "",
}: SmartBreadcrumbProps) {
  const visibleItems =
    showEllipsis && items.length > maxVisible
      ? [
          ...items.slice(0, 1),
          { label: "...", isEllipsis: true },
          ...items.slice(items.length - (maxVisible - 1)),
        ]
      : items;

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {visibleItems.map((item, index) => {
          const isLast = index === visibleItems.length - 1;
          const isEllipsis = (item as any).isEllipsis;

          return (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {isEllipsis ? (
                  <BreadcrumbEllipsis />
                ) : isLast ? (
                  <BreadcrumbPage className="flex items-center gap-1">
                    {showIcons && item.icon}
                    <span>{item.label}</span>
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    href={item.href}
                    className="flex items-center gap-1 hover:text-primary transition-colors"
                  >
                    {showIcons && item.icon}
                    <span>{item.label}</span>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>

              {!isLast && (
                <BreadcrumbSeparator>
                  {separator}
                </BreadcrumbSeparator>
              )}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
