const themeFiles = import.meta.glob("../assets/themes/*.css", { eager: true });

import { useState, useEffect, createContext, useContext } from "react";

const ThemeContext = createContext();

export default function ThemeManager({ children }){
    const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "NightLight");

    useEffect(() => {
        document.body.className = theme;
        localStorage.setItem("theme", theme);
    }, [theme]);

    return (
        <ThemeContext.Provider
            value={{
                theme,
                setTheme
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export function getThemeSetter(){
    return useContext(ThemeContext);
}