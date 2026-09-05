// components/ui/insurance-card.tsx
import * as React from "react"
import { motion } from "framer-motion"
import { Clock, ClipboardCopy } from "lucide-react"

import { cn } from "../_utils/cn" // Assuming you have a `cn` utility from shadcn/ui
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { Button } from "./button"
import { Card, CardContent, CardFooter, CardHeader } from "./card"

// Props interface for type safety and reusability
interface InsuranceCardProps {
  clientName: string;
  dateOfBirth: string;
  cityOfResidence: string;
  idNumber: string;
  policyNumber: string;
  insuranceType: string;
  vehicleInfo: string;
  expireDate: string;
  expireDuration: string;
  avatarSrc: string;
  qrCodeSrc: string;
  onUpdatePolicy?: () => void;
}

// A smaller, reusable component for displaying info items
const InfoItem = ({ label, value, children }: { label: string; value: string; children?: React.ReactNode }) => (
  <div className="flex flex-col">
    <span className="text-xs text-muted-foreground">{label}</span>
    <div className="flex items-center gap-2">
      <span className="font-semibold text-sm text-card-foreground">{value}</span>
      {children}
    </div>
  </div>
);

export const InsuranceCard = ({
  clientName,
  dateOfBirth,
  cityOfResidence,
  idNumber,
  policyNumber,
  insuranceType,
  vehicleInfo,
  expireDate,
  expireDuration,
  avatarSrc,
  qrCodeSrc,
  onUpdatePolicy,
}: InsuranceCardProps) => {

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here for better UX
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    >
      <Card className="w-full max-w-md rounded-2xl shadow-lg overflow-hidden border-primary/10">
        <CardHeader className="p-6 bg-muted/30">
          <div className="flex justify-between items-start gap-8">
            <div className="flex items-center gap-2">
              <Avatar className="h-14 w-14 border-2 border-background">
                <AvatarImage src={avatarSrc} alt={clientName} />
                <AvatarFallback>{clientName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <div className="flex items-center gap-2 text-muted-foreground">
                   <Clock className="h-4 w-4" />
                   <span className="text-xs font-medium">Expire Date</span>
                </div>
                <p className="font-bold text-md text-foreground">
                  {expireDate} <span className="text-sm font-normal text-muted-foreground">({expireDuration})</span>
                </p>
              </div>
            </div>
            <img src={qrCodeSrc} alt="QR Code" className="h-16 w-16 rounded-md" />
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-x-4 gap-y-6">
            <InfoItem label="Client Name" value={clientName} />
            <InfoItem label="Date of Birth" value={dateOfBirth} />
            <InfoItem label="City of Residence" value={cityOfResidence} />
            <InfoItem label="ID Number" value={idNumber} />
            <InfoItem label="Policy Number" value={policyNumber}>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopy(policyNumber)}>
                    <ClipboardCopy className="h-4 w-4 text-muted-foreground" />
                </Button>
            </InfoItem>
            <InfoItem label="Type of Insurance" value={insuranceType} />
          </div>
          <div className="border-t border-border pt-4">
             <InfoItem label="Vehicle Information" value={vehicleInfo} />
          </div>
        </CardContent>
        
        <CardFooter className="p-6 bg-muted/30">
          <Button className="w-full" onClick={onUpdatePolicy}>
            Update a Policy
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};