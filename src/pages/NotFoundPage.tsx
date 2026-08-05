import { Home, TrendingDown } from "lucide-react";

// Shown for any route that doesn't match a known page.
// If you're not using react-router, this can also be used as a
// fallback "empty state" component anywhere content is missing.
export default function NotFoundPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-slate-100 px-6 text-center dark:bg-slate-950">
            <div className="mb-6 rounded-2xl bg-rose-500/10 p-4">
                <TrendingDown className="h-10 w-10 text-rose-500" />
            </div>

            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white sm:text-5xl">
                404
            </h1>

            <p className="mt-3 max-w-sm text-slate-600 dark:text-slate-400">
                This page doesn't exist — looks like this trade went the
                wrong direction.
            </p>

            <a
                href="/"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"
            >
                <Home size={16} />
                Back to Dashboard
            </a>
        </main>
    );
}
