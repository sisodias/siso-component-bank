import { CheckCircle2 } from "lucide-react";

export default function RuixenAlert() {
    return (
        <div className="w-full max-w-xl mx-auto">
            <div className="relative border-l-4 border-green-500 bg-white dark:bg-zinc-800 shadow-md rounded-md px-4 py-3 flex items-start space-x-4 animate-slideIn">
                <div className="mt-1">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex-1">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        Installation Successful
                    </p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-0.5">
                        Your CLI setup was completed. You can now begin using Ruixen UI components.
                    </p>
                </div>
            </div>
        </div>
    );
}
