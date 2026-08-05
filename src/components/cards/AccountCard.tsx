import { Info } from "lucide-react";

interface AccountCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    valueColor?: string;
    definition?: string;
}

export default function AccountCard({
    title,
    value,
    subtitle,
    valueColor = "text-slate-900 dark:text-white",
    definition,
}: AccountCardProps) {
    return (
        // Reusable dashboard metric card
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow transition-all duration-200 hover:border-indigo-500 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 sm:p-5">
            <div className="flex items-start justify-between">
                <div className="w-full">
                    {/* Metric title with optional help tooltip */}
                    <div className="flex items-center gap-2">
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm">
                            {title}
                        </p>

                        {/* Show definition only when provided */}
                        {definition && (
                            <div className="group relative">
                                {/* Help icon */}
                                <Info
                                    size={14}
                                    className="cursor-help text-slate-400 transition hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                                />

                                {/* Tooltip — narrower on mobile so it doesn't overflow the
                                    viewport, and left-anchored instead of centering off-screen */}
                                <div className="pointer-events-none absolute left-0 top-6 z-50 hidden w-52 -translate-x-1/4 rounded-lg border border-slate-200 bg-white p-3 text-xs leading-5 text-slate-700 shadow-xl group-hover:block dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 sm:left-1/2 sm:w-64 sm:-translate-x-1/2">
                                    {definition}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Main metric value — scales down on small screens so long
                        currency strings (e.g. $103,250) never wrap oddly */}
                    <h3
                        className={`mt-2 wrap-break-words text-xl font-bold sm:mt-3 sm:text-3xl ${valueColor}`}
                    >
                        {value}
                    </h3>

                    {/* Additional information (optional) */}
                    {subtitle && (
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}