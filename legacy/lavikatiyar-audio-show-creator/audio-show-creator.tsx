import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "../_utils/cn";
import { Button } from "./button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Tabs, TabsList, TabsTrigger } from "./tabs";
import {
  Headphones,
  X,
  FileText,
  ListFilter,
  Mic,
  Languages,
  Sparkles,
  Award,
} from "lucide-react";

// Types for select options to ensure type safety and reusability
type SelectOption = {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
};

type VoiceOption = {
  value: string;
  label: string;
  color: string; // e.g., 'bg-blue-400'
};

// Props interface for the main component
interface AudioShowCreatorProps {
  className?: string;
  // Data for the dropdowns
  formatStyles: SelectOption[];
  hostVoices: VoiceOption[];
  guestVoices: VoiceOption[];
  voiceEngines: SelectOption[];
  languages: SelectOption[];
  audioQualities: SelectOption[];
  // Handlers for actions
  onGenerate: () => void;
  onClose: () => void;
}

// A reusable component for custom select items with icons or colored dots
const CustomSelectItem = React.forwardRef<
  HTMLDivElement,
  { option: VoiceOption | SelectOption }
>(({ option, ...props }, ref) => (
  <SelectItem value={option.value} {...props}>
    <div className="flex items-center gap-2">
      {"color" in option ? (
        <div
          className={cn("h-4 w-4 rounded-full", option.color)}
        />
      ) : option.icon ? (
        <option.icon className="h-4 w-4 text-muted-foreground" />
      ) : null}
      <span>{option.label}</span>
    </div>
  </SelectItem>
));
CustomSelectItem.displayName = "CustomSelectItem";

export const AudioShowCreator = ({
  className,
  formatStyles,
  hostVoices,
  guestVoices,
  voiceEngines,
  languages,
  audioQualities,
  onGenerate,
  onClose,
}: AudioShowCreatorProps) => {
  // Internal state for the component's controlled inputs
  const [selectedHost, setSelectedHost] = React.useState<string>(
    hostVoices[0]?.value
  );
  const [selectedGuest, setSelectedGuest] = React.useState<string>(
    guestVoices[0]?.value
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Card
        className={cn(
          "w-full max-w-md overflow-hidden rounded-2xl border-2 shadow-xl",
          className
        )}
      >
        <CardHeader className="relative">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
              <Headphones className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <CardTitle>Create Your Audio Show</CardTitle>
              <CardDescription className="mt-1">
                Drop a document or paste a link — GenFM will instantly turn it
                into a fully voiced podcast you can preview, edit, and download.
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 h-7 w-7 rounded-full"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6 pt-2">
          {/* Upload Tabs */}
          <Tabs defaultValue="upload">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upload">Upload File</TabsTrigger>
              <TabsTrigger value="url">Import via URL</TabsTrigger>
              <TabsTrigger value="project">Choose Project</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Uploaded File Info */}
          <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
            <FileText className="h-8 w-8 text-red-500" />
            <div className="flex-1">
              <p className="font-medium text-sm">Future Thinking Talk.pdf</p>
              <p className="text-muted-foreground text-xs">45.4 KB</p>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" aria-label="Remove file">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <Select defaultValue={formatStyles[0]?.value}>
                <SelectTrigger aria-label="Format Style">
                  <div className="flex w-full items-center justify-between">
                    <span className="text-muted-foreground">Format Style</span>
                    <SelectValue placeholder="Select style..." />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {formatStyles.map((style) => (
                    <SelectItem key={style.value} value={style.value}>
                      {style.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Select value={selectedHost} onValueChange={setSelectedHost}>
                <SelectTrigger aria-label="Host Voice">
                  <div className="flex items-center gap-2">
                    <div className={cn("h-4 w-4 rounded-full", hostVoices.find(v => v.value === selectedHost)?.color)} />
                    <SelectValue placeholder="Host..." />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {hostVoices.map((voice) => (
                    <CustomSelectItem key={voice.value} option={voice} />
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedGuest} onValueChange={setSelectedGuest}>
                <SelectTrigger aria-label="Guest Voice">
                  <div className="flex items-center gap-2">
                    <div className={cn("h-4 w-4 rounded-full", guestVoices.find(v => v.value === selectedGuest)?.color)} />
                    <SelectValue placeholder="Guest..." />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {guestVoices.map((voice) => (
                    <CustomSelectItem key={voice.value} option={voice} />
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Select defaultValue={voiceEngines[0]?.value}>
                <SelectTrigger aria-label="Voice Engine">
                  <SelectValue placeholder="Engine..." />
                </SelectTrigger>
                <SelectContent>
                  {voiceEngines.map((engine) => (
                     <CustomSelectItem key={engine.value} option={engine} />
                  ))}
                </SelectContent>
              </Select>

              <Select defaultValue={languages[0]?.value}>
                <SelectTrigger aria-label="Language">
                  <SelectValue placeholder="Language..." />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                     <CustomSelectItem key={lang.value} option={lang} />
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Select defaultValue={audioQualities[0]?.value}>
                <SelectTrigger aria-label="Audio Quality">
                    <SelectValue placeholder="Quality..." />
                </SelectTrigger>
                <SelectContent>
                    {audioQualities.map((quality) => (
                        <CustomSelectItem key={quality.value} option={quality} />
                    ))}
                </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            <Button variant="outline">
              <ListFilter className="mr-2 h-4 w-4" />
              Recent
            </Button>
            <Button onClick={onGenerate}>Generate</Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};