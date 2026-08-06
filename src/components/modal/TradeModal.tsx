import { useEffect, type ReactNode } from "react";

interface TradeModalProps {
    open: boolean;
    title?: string;
    children: ReactNode;
    onClose: () => void;
}

export default function TradeModal({
    open,
    title = "Add Trade",
    children,
    onClose,
}: TradeModalProps) {

    // Allow users to close the modal using the Escape key
    useEffect(() => {
        if (!open) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        // Remove the event listener when the modal closes
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [open, onClose]);

    // Do not render the modal when it is closed
    if (!open) return null;

    return (
        // Full-screen overlay that closes the modal on outside click
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        >

            {/* Prevent closing when interacting with the modal content */}
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg border transition-all"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--panel)" }}
            >

                {/* Modal header */}
                <div
                    className="flex items-center justify-between border-b px-6 py-4"
                    style={{ borderColor: "var(--border)" }}
                >

                    <h2 className="font-mono text-base font-bold uppercase tracking-[0.06em]" style={{ color: "var(--text)" }}>
                        {title}
                    </h2>

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="border p-1.5 font-mono text-xs transition-colors duration-150 hover:bg-[var(--panel-hover)]"
                        style={{ borderColor: "var(--border)", color: "var(--text-dim)" }}
                    >
                        ✕
                    </button>

                </div>

                {/* Render the modal content */}
                <div className="p-6">
                    {children}
                </div>

            </div>

        </div>
    );
}