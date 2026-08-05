import {
    createContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

// Context used to share the current theme across the application
export const ThemeContext = createContext<ThemeContextType | null>(null);

interface ThemeProviderProps {
    children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {

    // Initialize theme from localStorage, defaulting to dark mode
    const [theme, setTheme] = useState<Theme>(() => {
        return (localStorage.getItem("theme") as Theme) || "dark";
    });

    // Apply the selected theme and persist it in localStorage
    useEffect(() => {
        document.documentElement.classList.toggle(
            "dark",
            theme === "dark"
        );

        localStorage.setItem("theme", theme);
    }, [theme]);

    // Memoize context value to avoid unnecessary re-renders
    const value = useMemo(
        () => ({
            theme,

            // Toggle between light and dark mode
            toggleTheme: () =>
                setTheme((prev) =>
                    prev === "dark" ? "light" : "dark"
                ),
        }),
        [theme]
    );

    return (
        // Provide theme state and actions to all child components
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}