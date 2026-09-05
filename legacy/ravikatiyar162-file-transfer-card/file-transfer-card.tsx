import * as React from "react";
import { cn } from "../_utils/cn";
import { Button } from "./button";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Progress } from "./progress";
import { Info, Laptop, Lock, Phone, Wifi } from "lucide-react";

// Define the props interface for type-safety and reusability
export interface FileTransferCardProps {
  /** The current status of the transfer */
  status: "in-progress" | "paused" | "completed" | "connecting";
  /** The current progress percentage (0-100) */
  progress: number;
  /** Details of the source device */
  sourceDevice: {
    name: string;
    type: "phone" | "laptop";
  };
  /** Details of the destination device */
  destinationDevice: {
    name: string;
    type: "phone" | "laptop";
  };
  /** Estimated time remaining for the transfer */
  estimatedTime: string;
  /** Current transfer speed */
  transferRate: string;
  /** A summary of the file types being transferred */
  fileTypes: string;
  /** The total size of the files */
  totalFileSize: string;
  /** Callback function for the cancel action */
  onCancel: () => void;
  /** Callback function for the pause/resume action */
  onTogglePause: () => void;
}

// Helper to render the correct device icon
const DeviceIcon = ({ type, className }: { type: "phone" | "laptop"; className?: string }) => {
  const iconClasses = cn("h-10 w-10 text-muted-foreground", className);
  if (type === "laptop") {
    return <Laptop className={iconClasses} />;
  }
  return <Phone className={iconClasses} />;
};

// The main component
export const FileTransferCard = ({
  status,
  progress,
  sourceDevice,
  destinationDevice,
  estimatedTime,
  transferRate,
  fileTypes,
  totalFileSize,
  onCancel,
  onTogglePause,
}: FileTransferCardProps) => {
  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden">
      <CardHeader>
        <CardTitle className="text-center text-lg font-semibold">
          Smart WiFi Transfer
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        {/* Device Info Section */}
        <div className="flex items-center justify-between gap-2 text-center text-sm mb-8">
          <div className="flex flex-col items-center gap-2">
            <DeviceIcon type={sourceDevice.type} />
            <span className="text-muted-foreground text-xs">Sending from</span>
            <p className="font-medium">{sourceDevice.name}</p>
          </div>
          <div className="flex items-center gap-1 text-primary pt-2">
            <Wifi className="h-5 w-5" />
            {/* Animated connecting dots */}
            <span className="h-1 w-1 bg-primary rounded-full animate-pulse [animation-delay:-0.3s]"></span>
            <span className="h-1 w-1 bg-primary rounded-full animate-pulse [animation-delay:-0.15s]"></span>
            <span className="h-1 w-1 bg-primary rounded-full animate-pulse"></span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <DeviceIcon type={destinationDevice.type} />
            <span className="text-muted-foreground text-xs">Sending to</span>
            <p className="font-medium">{destinationDevice.name}</p>
          </div>
        </div>

        {/* Progress Bar Section */}
        <div className="mb-6">
          <h3 className="text-center font-medium mb-2">Transfer progress</h3>
          <Progress value={progress} className="h-2 w-full" />
          <p className="text-center text-muted-foreground text-sm mt-2">
            Your file transfer is {progress}% completed
          </p>
        </div>

        {/* Transfer Details Section */}
        <Card className="bg-muted/50">
          <CardHeader className="flex-row items-center space-x-2 py-3">
            <Info className="h-4 w-4" />
            <CardTitle className="text-base font-semibold">
              Transfer Details
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-3 pb-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estimated Time Remaining</span>
              <span className="font-medium">{estimatedTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Transfer Rate (Speed)</span>
              <span className="font-medium">{transferRate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">File types</span>
              <span className="font-medium">{fileTypes}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total File Size</span>
              <span className="font-medium">{totalFileSize}</span>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons Section */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <Button variant="outline" onClick={onCancel} disabled={status === 'completed'}>
            Cancel
          </Button>
          <Button onClick={onTogglePause} disabled={status === 'completed'}>
            {status === "paused" ? "Resume" : "Pause"}
          </Button>
        </div>

        {/* Security Footer */}
        <div className="flex items-center justify-center gap-2 text-muted-foreground text-xs mt-6">
          <Lock className="h-3 w-3" />
          <span>Your transfer is encrypted and secure</span>
        </div>
      </CardContent>
    </Card>
  );
};