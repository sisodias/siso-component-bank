"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

interface RuixenBtn07Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    onDownload?: () => Promise<boolean>;
    duration?: number;
}

export default function RuixenBtn07({
    onDownload,
    duration = 2000,
    className,
    ...props
}: RuixenBtn07nProps) {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    useEffect(() => {
        if (status !== "idle") {
            const timeout = setTimeout(() => setStatus("idle"), 2000);
            return () => clearTimeout(timeout);
        }
    }, [status]);

    const handleClick = async () => {
        if (status === "loading") return;

        setStatus("loading");
        const success = await (onDownload?.() || new Promise(res => setTimeout(() => res(true), duration)));
        setStatus(success ? "success" : "error");
    };

    const getIcon = () => {
        switch (status) {
            case "loading":
                return <Loader2 className="w-4 h-4 animate-spin" />;
            case "success":
                return <CheckCircle2 className="w-4 h-4 text-white" />;
            case "error":
                return <XCircle className="w-4 h-4 text-white" />;
            default:
                return null;
        }
    };

    return (
        <Button
            onClick={handleClick}
            disabled={status === "loading"}
            className={cn(
                "px-5 py-2 rounded-full flex items-center gap-2 text-sm font-medium",
                "bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300",
                status === "success" && "bg-green-600",
                status === "error" && "bg-red-600",
                className
            )}
            {...props}
        >
            {getIcon()}
            {status === "idle" && "Download File"}
            {status === "loading" && "Downloading..."}
            {status === "success" && "Success!"}
            {status === "error" && "Failed!"}
        </Button>
    );
}
