const themeFiles = import.meta.glob("../assets/themes/*.css", { eager: true });

import { useState, useEffect, createContext, useContext } from "react";

export const ThemeContext = createContext();

export default function ThemeManager({ children }) {
    const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "NightLight");

    const pickerTheme = {
        backgroundColor: getComputedStyle(document.body).getPropertyValue('--bg-light'),
        categoryLabelColor: getComputedStyle(document.body).getPropertyValue('--text-primary'),
        searchBackgroundColor: getComputedStyle(document.body).getPropertyValue('--bg-lighter'),
        searchColor: getComputedStyle(document.body).getPropertyValue('--text-primary'),
        emojiHoverBackgroundColor: getComputedStyle(document.body).getPropertyValue('--bg-lighter'),
        emojiSize: 24,
        borderRadius: 8,
        previewBackgroundColor: getComputedStyle(document.body).getPropertyValue('--card-bg'),
        previewBorderColor: getComputedStyle(document.body).getPropertyValue('--border-light'),
    };

    useEffect(() => {
        document.documentElement.className = theme;
        localStorage.setItem("theme", theme);
    }, [theme]);

    return (
        <ThemeContext.Provider
            value={{
                theme,
                setTheme,
                pickerTheme
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export function getThemeSetter() {
    return useContext(ThemeContext);
}