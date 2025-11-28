
import { createContext, useState, useContext } from "react";
import { Navigate } from "react-router-dom";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {

    // --------------------
    // Login things
    // --------------------

    const [is_logged_in, setIsLoggedIn] = useState(() => {
        const status = sessionStorage.getItem("is_logged_in");

        if (status === null) return false;
        else return (status === "true");
    });

    const setLogin = () => {
        setIsLoggedIn(true);
        sessionStorage.setItem("is_logged_in", "true");
    }

    const setLogOut = () => {
        setIsLoggedIn(false);
        sessionStorage.setItem("is_logged_in", "false");
    }

    return (
        <AuthContext.Provider
            value={{
                is_logged_in,
                setLogin,
                setLogOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function LoginProtector({ children }) {
    const { is_logged_in } = useContext(AuthContext);

    if (!is_logged_in)
        return <Navigate to="/login" replace />;

    return children;
}