import { TrendingUp } from "lucide-react";

// Shown briefly while the dashboard's initial data is being prepared.
// Pure UI — no data fetching happens here, it's just a friendly wait state.
export default function LoadingPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-slate-100 px-6 text-center dark:bg-slate-950">
            {/* Pulsing brand mark */}
            <div className="flex h-18 w-18 items-center justify-center  ">
                <img
                    src="/android-chrome-512x512.png"
                    alt="Tradescape Logo"
                    className="h-18 w-18 rounded-lg object-cover"
                />
            </div>

            <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
                Tradescape
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Loading your risk dashboard…
            </p>

            {/* Simple spinner */}
            <div className="mt-6 h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600 dark:border-slate-700 dark:border-t-indigo-500" />
        </main>
    );
}
