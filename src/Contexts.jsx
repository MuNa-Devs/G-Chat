import { createContext, useState, useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { UiContext } from "./utils/UiContext";
import { loadUserDetails } from "./loadUserDetails";

export const AppContext = createContext(null);

export function AppProvider({ children }) {
    const [user_details, setUserDetails] = useState({});
    const [is_loading, setLoading] = useState(false);
    const { setOverride } = useContext(UiContext);

    const [is_logged_in, setIsLoggedIn] = useState(() => {
        const status = localStorage.getItem("is_logged_in");
        return status === "true";
    });

    const setLogin = () => {
        setIsLoggedIn(true);
        localStorage.setItem("is_logged_in", "true");
    };

    const setLogOut = () => {
        setIsLoggedIn(false);
        localStorage.setItem("is_logged_in", "false");
    };

    useEffect(() => {
        loadUserDetails(setUserDetails, setLoading, setOverride);
    }, []);

    return (
        <AppContext.Provider
            value={{
                is_loading,
                setLoading,
                is_logged_in,
                setLogin,
                setLogOut,
                user_details,
                setUserDetails,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function LoginProtector({ children }) {
    const { is_logged_in } = useContext(AppContext);

    if (!is_logged_in) {
        return <Navigate to="/signin" replace />;
    }

    return children;
}
