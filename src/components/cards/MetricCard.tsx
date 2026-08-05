import { Info } from "lucide-react";
import type { ReactNode } from "react";

interface MetricCardProps {
    title: string;
    value: string | number;
    icon?: ReactNode;
    valueColor?: string;
    description?: string;
    definition?: string;
}

export default function MetricCard({
    title,
    value,
    icon,
    valueColor = "text-slate-900 dark:text-white",
    description,
    definition,
}: MetricCardProps) {
    return (
        // Reusable card for displaying trading metrics
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow transition-all duration-200 hover:border-indigo-500 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 sm:p-5">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    {/* Metric title with optional help tooltip */}
                    <div className="flex items-center gap-2">
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm">
                            {title}
                        </p>

                        {/* Display explanation only when provided */}
                        {definition && (
                            <div className="group relative">
                                {/* Help icon */}
                                <Info
                                    size={14}
                                    className="cursor-help text-slate-400 transition hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                                />

                                {/* Tooltip — narrower on mobile, left-anchored so it
                                    doesn't get clipped off the edge of small screens */}
                                <div className="pointer-events-none absolute left-0 top-6 z-50 hidden w-52 -translate-x-1/4 rounded-lg border border-slate-200 bg-white p-3 text-xs leading-5 text-slate-700 shadow-xl group-hover:block dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 sm:left-1/2 sm:w-64 sm:-translate-x-1/2">
                                    {definition}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Primary metric value — scales down on mobile and wraps safely */}
                    <h3
                        className={`mt-2 wrap-break-words text-xl font-bold sm:mt-3 sm:text-3xl ${valueColor}`}
                    >
                        {value}
                    </h3>

                    {/* Optional supporting information */}
                    {description && (
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            {description}
                        </p>
                    )}
                </div>

                {/* Optional icon — hidden on very small screens where space is
                    tight, shown from sm up */}
                {icon && (
                    <div className="hidden rounded-lg bg-slate-100 p-3 text-slate-600 dark:bg-slate-800 dark:text-slate-300 sm:block">
                        {icon}
                    </div>
                )}
            </div>
        </div>
    );
}