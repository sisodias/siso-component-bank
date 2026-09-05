import { CheckCircle2, ArrowUpRight } from "lucide-react";

export default function RuixenAlert03() {
    return (
        <div className="w-full max-w-sm mx-auto">
            <div className="flex items-center justify-between bg-gradient-to-r from-green-200/80 to-green-100 dark:from-green-900/50 dark:to-green-800/30 border border-green-300 dark:border-green-700 rounded-lg px-4 py-3 shadow-md group transition-all">
                <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-700 dark:text-green-300 transition-transform group-hover:scale-110 group-hover:text-green-900 dark:group-hover:text-green-100" />
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">Saved to database</p>
                </div>
                <ArrowUpRight
                    className="h-4 w-4 text-green-600 dark:text-green-400 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-green-800 dark:group-hover:text-green-100 cursor-pointer"
                />
            </div>
        </div>
    );
}
