import React from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils"; // Assumes shadcn's utility for class merging
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Info, Tag, Clock, User } from 'lucide-react';

// Note: This component requires 'framer-motion'.

// --- Internal Data Structure ---
export interface DetailItem {
  /** The label for the data point (the Key). */
  label: string;
  /** The value of the data point (the Value). Can be any React node. */
  value: React.ReactNode;
}

export interface DetailSection {
  /** The title of the section (e.g., "General Info", "Permissions"). */
  title: string;
  /** Array of key-value detail items. */
  details: DetailItem[];
  /** Optional icon for the section header. */
  icon?: React.ElementType;
}

// --- 📦 API (Props) Definition ---
export interface DetailListPanelProps {
  /** The main title of the panel (e.g., "User Profile: John Doe"). */
  panelTitle: string;
  /** Array of categorized detail sections. */
  sections: DetailSection[];
  /** Optional class name for the card container. */
  className?: string;
  /** Optional description/subtitle for the panel. */
  panelDescription?: string;
}

/**
 * An animated panel for displaying structured, categorized detail lists (key-value pairs).
 * Ideal for viewing profile, configuration, or record data on a dashboard.
 */
const DetailListPanel: React.FC<DetailListPanelProps> = ({
  panelTitle,
  sections,
  panelDescription,
  className,
}) => {
  // Framer Motion variants for staggered entry of sections
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Framer Motion variants for individual list items
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Card className={cn("w-full shadow-lg", className)}>
      <CardHeader className="p-6 border-b">
        <CardTitle className="text-2xl font-bold text-foreground">{panelTitle}</CardTitle>
        {panelDescription && <CardDescription className="text-base text-muted-foreground mt-1">{panelDescription}</CardDescription>}
      </CardHeader>

      <CardContent className="p-0">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {sections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              variants={itemVariants}
              className="p-6 pt-4"
            >
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                {section.icon && <section.icon className="h-5 w-5 mr-2 text-primary" aria-hidden="true" />}
                {section.title}
              </h3>

              <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
                {section.details.map((item, detailIndex) => (
                  <motion.div
                    key={detailIndex}
                    variants={itemVariants}
                    className="flex flex-col"
                  >
                    <span className="font-medium text-muted-foreground">{item.label}</span>
                    <span className="font-semibold text-foreground break-words mt-0.5">{item.value}</span>
                  </motion.div>
                ))}
              </div>
              
              {sectionIndex < sections.length - 1 && (
                <Separator className="mt-6" />
              )}
            </motion.div>
          ))}
        </motion.div>
      </CardContent>
    </Card>
  );
};


const mockSections: DetailSection[] = [
  {
    title: "General Information",
    icon: User,
    details: [
      { label: "Full Name", value: "Alice Johnson" },
      { label: "User ID", value: "USR-00123" },
      { label: "Email Address", value: "alice.j@example.com" },
      { label: "Primary Role", value: <span className="text-primary font-bold">Administrator</span> },
    ],
  },
  {
    title: "Activity & Status",
    icon: Clock,
    details: [
      { label: "Account Status", value: <span className="text-green-500 font-bold">Active</span> },
      { label: "Last Login", value: "2025-10-09 10:45 AM UTC" },
      { label: "Total Sessions", value: "458" },
      { label: "Created At", value: "2023-01-15" },
    ],
  },
  {
    title: "Billing Details",
    icon: Tag,
    details: [
      { label: "Subscription Plan", value: "Enterprise Pro" },
      { label: "Billing Cycle", value: "Annual" },
      { label: "Next Renewal", value: "2026-01-15" },
      { label: "Payment Method", value: "Visa **** 1234" },
    ],
  },
];

const ExampleUsage = () => {
  return (
    <div className="p-8 bg-background border rounded-lg max-w-3xl mx-auto shadow-md">
      <h3 className="text-xl font-semibold text-foreground mb-6">Record Detail Viewer Demo</h3>
      
      <DetailListPanel
        panelTitle="User Account Details"
        panelDescription="Comprehensive profile information and activity logs for the selected user."
        sections={mockSections}
      />
    </div>
  );
};

export default ExampleUsage; 