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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        >

            {/* Prevent closing when interacting with the modal content */}
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg rounded-xl border border-slate-200 bg-white shadow-2xl transition-all dark:border-slate-700 dark:bg-slate-900"
            >

                {/* Modal header */}
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-700">

                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                        {title}
                    </h2>

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
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