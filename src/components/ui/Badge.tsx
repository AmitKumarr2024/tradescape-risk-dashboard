import {
    CheckCircle2,
    AlertTriangle,
    ShieldAlert,
} from "lucide-react";

export type BadgeVariant =
    | "success"
    | "warning"
    | "danger"
    | "info";

interface BadgeProps {
    label: string;
    variant?: BadgeVariant;
}

// Define styles and icons for each badge type
const styles = {
    success: {
        container: "bg-emerald-500/15 text-emerald-400",
        icon: <CheckCircle2 size={16} />,
    },
    warning: {
        container: "bg-amber-500/15 text-amber-400",
        icon: <AlertTriangle size={16} />,
    },
    danger: {
        container: "bg-rose-500/15 text-rose-400",
        icon: <ShieldAlert size={16} />,
    },
    info: {
        container: "bg-sky-500/15 text-sky-400",
        icon: null,
    },
};

export default function Badge({
    label,
    variant = "info",
}: BadgeProps) {

    // Select the appropriate badge style based on the variant
    const badge = styles[variant];

    return (
        // Reusable badge for displaying status or alerts
        <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${badge.container}`}
        >

            {/* Display icon when available */}
            {badge.icon}

            {/* Badge label */}
            {label}

        </span>
    );
}