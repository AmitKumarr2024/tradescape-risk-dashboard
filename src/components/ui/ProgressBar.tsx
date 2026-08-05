import clsx from "clsx";

export type ProgressVariant =
    | "success"
    | "warning"
    | "danger"
    | "info";

interface ProgressBarProps {
    value: number;
    variant?: ProgressVariant;
    showLabel?: boolean;
}

const colors = {
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-rose-500",
    info: "bg-sky-500",
};

export default function ProgressBar({
    value,
    variant = "info",
    showLabel = true,
}: ProgressBarProps) {

    // Keep progress between 0% and 100%
    const progress = Math.min(Math.max(value, 0), 100);

    return (
        <div className="w-full">

            {/* Progress label */}
            {showLabel && (
                <div className="mb-2 flex items-center justify-between">

                    <span className="text-sm text-slate-500 dark:text-slate-400">
                        Progress
                    </span>

                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {progress.toFixed(0)}%
                    </span>

                </div>
            )}

            {/* Progress track */}
            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">

                {/* Filled progress */}
                <div
                    className={clsx(
                        "h-full rounded-full transition-all duration-500",
                        colors[variant]
                    )}
                    style={{
                        width: `${progress}%`,
                    }}
                />

            </div>

        </div>
    );
}