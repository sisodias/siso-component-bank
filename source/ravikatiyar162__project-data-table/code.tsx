import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

// --- TYPE DEFINITIONS ---
interface Contributor {
  src: string;
  alt: string;
  fallback: string;
}

type StatusVariant = "active" | "inProgress" | "onHold";

export interface Project {
  id: string;
  name: string;
  repository: string;
  team: string;
  tech: string;
  createdAt: string;
  contributors: Contributor[];
  status: {
    text: string;
    variant: StatusVariant;
  };
}

// --- PROPS INTERFACE ---
interface ProjectDataTableProps {
  projects: Project[];
  visibleColumns: Set<keyof Project>;
}

// --- STATUS BADGE VARIANTS ---
const badgeVariants = cva("capitalize text-white", {
  variants: {
    variant: {
      active: "bg-green-500 hover:bg-green-600",
      inProgress: "bg-yellow-500 hover:bg-yellow-600",
      onHold: "bg-red-500 hover:bg-red-600",
    },
  },
  defaultVariants: {
    variant: "active",
  },
});

// --- MAIN COMPONENT ---
export const ProjectDataTable = ({ projects, visibleColumns }: ProjectDataTableProps) => {
  // Animation variants for table rows
  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: "easeInOut",
      },
    }),
  };
  
  const tableHeaders: { key: keyof Project; label: string }[] = [
    { key: "name", label: "Project" },
    { key: "repository", label: "Repository" },
    { key: "team", label: "Team" },
    { key: "tech", label: "Tech" },
    { key: "createdAt", label: "Created At" },
    { key: "contributors", label: "Contributors" },
    { key: "status", label: "Status" },
  ];

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="relative w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {tableHeaders
                .filter((header) => visibleColumns.has(header.key))
                .map((header) => (
                  <TableHead key={header.key}>{header.label}</TableHead>
                ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length > 0 ? (
              projects.map((project, index) => (
                <motion.tr
                  key={project.id}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={rowVariants}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  {visibleColumns.has("name") && <TableCell className="font-medium">{project.name}</TableCell>}
                  
                  {visibleColumns.has("repository") && (
                    <TableCell>
                      <a
                        href={project.repository}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <span className="truncate max-w-xs">{project.repository.replace('https://', '')}</span>
                        <ExternalLink className="h-3 w-3 flex-shrink-0" />
                      </a>
                    </TableCell>
                  )}
                  
                  {visibleColumns.has("team") && <TableCell>{project.team}</TableCell>}
                  {visibleColumns.has("tech") && <TableCell>{project.tech}</TableCell>}
                  {visibleColumns.has("createdAt") && <TableCell>{project.createdAt}</TableCell>}
                  
                  {visibleColumns.has("contributors") && (
                    <TableCell>
                      <div className="flex -space-x-2">
                        {project.contributors.map((contributor, idx) => (
                          <Avatar key={idx} className="h-8 w-8 border-2 border-background">
                            <AvatarImage src={contributor.src} alt={contributor.alt} />
                            <AvatarFallback>{contributor.fallback}</AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                    </TableCell>
                  )}

                  {visibleColumns.has("status") && (
                    <TableCell>
                      <Badge className={cn(badgeVariants({ variant: project.status.variant }))}>
                        {project.status.text}
                      </Badge>
                    </TableCell>
                  )}
                </motion.tr>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={visibleColumns.size} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};