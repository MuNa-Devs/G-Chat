
import axios from "axios";
import { createContext, useState, useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";

export const AppContext = createContext();

export default function ContextProvider({ children }) {
    const [user_details, setUserDetails] = useState({});
    const [is_loading, setLoading] = useState(true);

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

    useEffect(() => {
        loadUserDetails(setUserDetails, setLoading);
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
                setUserDetails
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

export function LoginProtector({ children }) {
    const { is_logged_in } = useContext(AppContext);

    if (!is_logged_in)
        return <Navigate to="/signin" replace />;

    return children;
}

export const loadUserDetails = async (setUserDetails, setLoading) => {
    setLoading(true);

    try {
        const user_id = localStorage.getItem("user_id");

        if (!user_id) {
            setUserDetails(null);
            return;
        };

        const user_details_res = await axios.get(
            `http://localhost:5500/g-chat/get-user?user_id=${user_id}`
        );
        console.log(user_details_res.data.user_details);

        setUserDetails(user_details_res.data.user_details);
    }
    catch (err) {
        console.log("User details not loaded: ", err);
        setUserDetails({
            id: 0,
            username: '',
            email: '',
            is_verified: false,
            pfp: ''
        })
    }

    setLoading(false);
}