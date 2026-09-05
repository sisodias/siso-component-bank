// components/ui/insurance-policy-card.tsx

import * as React from 'react';
import { motion } from 'framer-motion';
import { Clock, Copy } from 'lucide-react';

import { cn } from "../_utils/cn"; // Make sure to have this utility from shadcn
import { Button } from "./button";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

// Prop definition for type safety and reusability
interface InsurancePolicyCardProps {
  client: {
    name: string;
    avatarUrl: string;
    dateOfBirth: string;
    cityOfResidence: string;
  };
  policy: {
    idNumber: string;
    policyNumber: string;
    insuranceType: string;
    vehicleInfo: string;
    expiryDate: string;
    expiryDuration: string;
  };
  qrCodeUrl: string;
  onUpdatePolicy: () => void;
  className?: string;
}

// A reusable sub-component for displaying data fields
const InfoField: React.FC<{ label: string; value: string; children?: React.ReactNode }> = ({
  label,
  value,
  children,
}) => (
  <div className="flex flex-col">
    <span className="text-xs text-muted-foreground">{label}</span>
    <span className="mt-1 flex items-center gap-2 text-sm font-medium text-card-foreground">
      {value}
      {children}
    </span>
  </div>
);

export const InsurancePolicyCard: React.FC<InsurancePolicyCardProps> = ({
  client,
  policy,
  qrCodeUrl,
  onUpdatePolicy,
  className,
}) => {
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    // Here you could add a toast notification for feedback
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(
        'w-full max-w-md rounded-2xl border bg-card p-6 text-card-foreground shadow-lg',
        className
      )}
    >
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 border-2 border-border">
            <AvatarImage src={client.avatarUrl} alt={client.name} />
            <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Expire Date</span>
            </div>
            <p className="mt-1 font-semibold text-card-foreground">{policy.expiryDate}</p>
            <p className="text-xs text-muted-foreground">({policy.expiryDuration})</p>
          </div>
        </div>
        <img src={qrCodeUrl} alt="Policy QR Code" className="h-16 w-16 rounded-md" />
      </div>

      {/* Details Grid Section */}
      <div className="my-6 grid grid-cols-2 gap-x-4 gap-y-5 border-y border-border py-6">
        <InfoField label="Client Name" value={client.name} />
        <InfoField label="Date of Birth" value={client.dateOfBirth} />
        <InfoField label="City of Residence" value={client.cityOfResidence} />
        <InfoField label="ID Number" value={policy.idNumber} />
        <InfoField label="Policy Number" value={policy.policyNumber}>
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => handleCopy(policy.policyNumber)}
                  aria-label="Copy policy number"
                  className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </InfoField>
        <InfoField label="Type of Insurance" value={policy.insuranceType} />
        <InfoField label="Vehicle Information" value={policy.vehicleInfo} />
      </div>

      {/* Action Button */}
      <Button onClick={onUpdatePolicy} className="w-full" size="lg">
        Update a Policy
      </Button>
    </motion.div>
  );
};